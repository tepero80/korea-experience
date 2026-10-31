import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import { existsSync, statSync, readFileSync } from 'node:fs';
import path from 'node:path';

const origin = 'https://koreaexperience.com';
test.afterEach(async ({ page }) => {
  // Next may still have static-route prefetches in flight after the assertion.
  // Finish handlers before Playwright disposes their API response context.
  await page.unrouteAll({ behavior: 'wait' });
});
async function isolatedProductionOrigin(page: Page, blockWrites = false) {
  // All apex requests are fulfilled by the local export. No real analytics,
  // advertising, authentication, mail or contribution request can leave this fixture.
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin && !url.pathname.startsWith('/api/')) {
      // Do not hold an intercepted request open across a second HTTP fetch:
      // Next can cancel a prefetch while that fetch is still in flight. Serve
      // the same export bytes directly, without an APIResponse lifecycle race.
      const root = path.resolve('out');
      const candidate = path.resolve(root, '.' + decodeURIComponent(url.pathname));
      if (candidate !== root && !candidate.startsWith(root + path.sep))
        return route.fulfill({ status: 403, body: '' });
      const file = [candidate, candidate + '.html', path.join(candidate, 'index.html')].find(
        (file) => existsSync(file) && statSync(file).isFile(),
      );
      const types: Record<string, string> = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.txt': 'text/plain',
        '.json': 'application/json',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
      };
      return route.fulfill({
        status: file ? 200 : 404,
        contentType: types[path.extname(file || '')] || 'text/html',
        body: readFileSync(file || path.join(root, '404.html')),
      });
    }
    if (url.hostname === 'www.googletagmanager.com')
      return route.fulfill({
        contentType: 'application/javascript',
        body: '/* isolated no-network tag fixture */',
      });
    if (url.origin === origin && url.pathname.startsWith('/api/'))
      return route.fulfill({ status: 401, contentType: 'application/json', body: '{}' });
    return route.abort();
  });
  await page.addInitScript(
    ({ blockWrites }) => {
      const calls: unknown[][] = [];
      Object.assign(window, {
        __keFixtureEvents: calls,
        gtag: (...args: unknown[]) => calls.push(args),
      });
      if (blockWrites)
        Storage.prototype.setItem = () => {
          throw new DOMException('Fixture blocked storage', 'SecurityError');
        };
    },
    { blockWrites },
  );
}
async function events(page: Page, name: string) {
  return page.evaluate(
    (event) =>
      (window as unknown as { __keFixtureEvents: unknown[][] }).__keFixtureEvents.filter(
        (call) => call[0] === 'event' && call[1] === event,
      ),
    name,
  );
}
test('consent, SPA context and first-completion measurement preserve the traveler task', async ({
  page,
}) => {
  await isolatedProductionOrigin(page);
  await page.goto(origin + '/tools/trip-budget?email=PRIVATE@example.invalid#private-token');
  await page.getByRole('button', { name: 'Build my budget', exact: true }).click();
  expect(await events(page, 'tool_complete')).toHaveLength(0);
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await page.getByRole('button', { name: 'Build my budget', exact: true }).click();
  expect(await events(page, 'tool_start')).toHaveLength(1);
  expect(await events(page, 'tool_complete')).toHaveLength(1);
  await page.getByRole('button', { name: 'Build my budget', exact: true }).click();
  expect(await events(page, 'tool_complete')).toHaveLength(1);
  expect(await events(page, 'tool_recalculate')).toHaveLength(1);
  await page.getByRole('button', { name: 'Cookie settings', exact: true }).click();
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  expect(await events(page, 'page_view')).toHaveLength(1);
  await page.getByRole('link', { name: 'Travel tools', exact: true }).first().click();
  await expect(page).toHaveURL(origin + '/tools');
  await expect.poll(async () => (await events(page, 'page_view')).length).toBe(2);
  const calls = await page.evaluate(
    () => (window as unknown as { __keFixtureEvents: unknown[][] }).__keFixtureEvents,
  );
  expect(JSON.stringify(calls)).not.toContain('PRIVATE');
  expect(JSON.stringify(calls)).not.toContain('private-token');
  const views = await events(page, 'page_view');
  expect(views.at(-1)?.[2]).toMatchObject({
    page_location: origin + '/tools',
    page_referrer: origin + '/tools/trip-budget',
  });
  await page.getByRole('button', { name: 'Cookie settings', exact: true }).click();
  await page.getByRole('button', { name: 'Essential only', exact: true }).click();
  await page
    .getByRole('navigation', { name: 'Resources', exact: true })
    .getByRole('link', { name: 'All guides', exact: true })
    .click();
  await expect(page).toHaveURL(origin + '/blog');
  expect(await events(page, 'page_view')).toHaveLength(2);
});

test('unavailable consent storage leaves the calculator usable and analytics off', async ({
  page,
}, info) => {
  await isolatedProductionOrigin(page, true);
  await page.goto(origin + '/tools/trip-budget');
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Your browser could not save this choice' }),
  ).toBeVisible();
  await page.screenshot({
    path: info.outputPath('consent-storage-error.jpg'),
    fullPage: true,
    type: 'jpeg',
    quality: 85,
  });
  await fs.writeFile(
    info.outputPath('consent-error-info.json'),
    JSON.stringify({
      path: '/tools/trip-budget',
      width: page.viewportSize()?.width,
      imageFile: 'consent-storage-error.jpg',
      test: info.title,
    }),
  );
  expect(await events(page, 'page_view')).toHaveLength(0);
  await page.getByRole('button', { name: 'Essential only', exact: true }).click();
  await page.getByRole('button', { name: 'Build my budget', exact: true }).click();
  await expect(page.locator('.tool-result')).toBeVisible();
  expect(await events(page, 'tool_complete')).toHaveLength(0);
});

test('engaged reading qualifies only after consent and is counted once', async ({ page }) => {
  await isolatedProductionOrigin(page);
  await page.clock.install();
  await page.goto(origin + '/blog/first-trip-to-korea-planning-guide?token=PRIVATE#draft');
  await page
    .locator('.article-body')
    .evaluate((element) => element.scrollIntoView({ block: 'end', behavior: 'instant' }));
  await expect
    .poll(() =>
      page.locator('.article-body').evaluate((element) => {
        const box = element.getBoundingClientRect();
        return box.top + box.height / 2 < innerHeight;
      }),
    )
    .toBe(true);
  await page.clock.runFor(46000);
  expect(await events(page, 'guide_engaged')).toHaveLength(0);
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await page
    .locator('.article-body')
    .evaluate((element) => element.scrollIntoView({ block: 'end', behavior: 'instant' }));
  await expect
    .poll(() =>
      page.locator('.article-body').evaluate((element) => {
        const box = element.getBoundingClientRect();
        return box.top + box.height / 2 < innerHeight;
      }),
    )
    .toBe(true);
  await page.clock.runFor(44000);
  expect(await events(page, 'guide_engaged')).toHaveLength(0);
  await page.clock.runFor(2000);
  expect(await events(page, 'guide_engaged')).toHaveLength(1);
  await page.clock.runFor(46000);
  expect(await events(page, 'guide_engaged')).toHaveLength(1);
});
