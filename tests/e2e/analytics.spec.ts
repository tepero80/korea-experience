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
async function isolatedProductionOrigin(
  page: Page,
  blockWrites = false,
  recordCalls = true,
  retainCallsPerTab = false,
) {
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
    ({ blockWrites, recordCalls, retainCallsPerTab }) => {
      if (recordCalls) {
        const fixtureKey = 'ke-fixture-event-log';
        const calls: unknown[][] = retainCallsPerTab
          ? JSON.parse(sessionStorage.getItem(fixtureKey) ?? '[]')
          : [];
        Object.assign(window, {
          __keFixtureEvents: calls,
          gtag: (...args: unknown[]) => {
            calls.push(args);
            if (retainCallsPerTab) sessionStorage.setItem(fixtureKey, JSON.stringify(calls));
          },
        });
      }
      if (blockWrites)
        Storage.prototype.setItem = () => {
          throw new DOMException('Fixture blocked storage', 'SecurityError');
        };
    },
    { blockWrites, recordCalls, retainCallsPerTab },
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
test('the production tag queues Google commands only after opt-in and in its supported format', async ({
  page,
}) => {
  await isolatedProductionOrigin(page, false, false);
  await page.goto(origin);
  const consent = page.getByRole('button', { name: 'Allow analytics', exact: true });
  await expect(consent).toBeVisible();
  await expect(page.locator('#ke-ga')).toHaveCount(0);
  await consent.click();
  await expect(page.locator('#ke-ga')).toHaveCount(1);
  const commands = await page.evaluate(() =>
    (window.dataLayer ?? []).map((entry) => ({
      type: Object.prototype.toString.call(entry),
      values: Array.from(entry as IArguments).slice(0, 2),
    })),
  );
  expect(commands).toContainEqual({ type: '[object Arguments]', values: ['event', 'page_view'] });
  expect(commands.filter((command) => command.values[0] === 'config')).toHaveLength(1);
});

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

test('returning from an excluded route records a new public view without the private referrer', async ({
  page,
}) => {
  await isolatedProductionOrigin(page);
  const guide = '/blog/first-trip-to-korea-planning-guide';
  await page.goto(origin + guide, { referer: 'https://www.google.com/search?q=FIXTURE_PRIVATE' });
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await expect.poll(async () => (await events(page, 'page_view')).length).toBe(1);
  await page.evaluate(() => document.documentElement.setAttribute('data-spa-fixture', 'same'));
  const community = page.locator('a[href="/community"]:visible').first();
  if (!(await community.isVisible())) {
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  }
  await community.click();
  await expect(page).toHaveURL(origin + '/community');
  await expect(page.locator('html')).toHaveAttribute('data-spa-fixture', 'same');
  expect(await events(page, 'page_view')).toHaveLength(1);
  await page.goBack();
  await expect(page).toHaveURL(origin + guide);
  await expect(page.locator('html')).toHaveAttribute('data-spa-fixture', 'same');
  await expect.poll(async () => (await events(page, 'page_view')).length).toBe(2);
  const views = await events(page, 'page_view');
  expect(views[0]?.[2]).toMatchObject({
    page_location: origin + guide,
    page_referrer: 'https://www.google.com',
  });
  expect(views[1]?.[2]).toMatchObject({ page_location: origin + guide, page_referrer: '' });
  expect(JSON.stringify(views)).not.toMatch(/FIXTURE_PRIVATE|\/community/);
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

test('discovery records the chosen path after consent and keeps the ad below the guide links', async ({
  page,
}) => {
  // Links load a new document. Keep the fixture-only queue through that navigation.
  await isolatedProductionOrigin(page, false, true, true);
  await page.goto(origin);
  const home = page.getByRole('navigation', { name: 'Start exploring Korea', exact: true });
  const destinations = home.getByRole('link', { name: 'Explore destinations', exact: true });
  await page.getByRole('button', { name: 'Essential only', exact: true }).click();
  await destinations.press('Enter');
  await expect(page).toHaveURL(origin + '/#explore-destinations');
  expect(await events(page, 'home_destinations')).toHaveLength(0);

  await page.getByRole('button', { name: 'Cookie settings', exact: true }).click();
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await destinations.press('Enter');
  expect(await events(page, 'home_destinations')).toEqual([
    ['event', 'home_destinations', { page_path: '/', page_location: origin + '/', page_referrer: '' }],
  ]);

  const regional = '/blog/gwangju-u-square-bus-terminal-to-asia-culture-center';
  await page.goto(origin + regional, { referer: 'https://www.google.com/search?q=PRIVATE_FIXTURE' });
  const next = page.getByRole('navigation', { name: 'Destination guides', exact: true });
  await expect(page.locator('.ad-slot')).toHaveCount(1);
  expect(
    await next.evaluate((nav) => {
      const article = document.querySelector('.article-body');
      const ad = document.querySelector('.ad-slot');
      return (
        article && ad &&
        Boolean(article.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING) &&
        Boolean(nav.compareDocumentPosition(ad) & Node.DOCUMENT_POSITION_FOLLOWING)
      );
    }),
  ).toBe(true);

  await next.getByRole('link', { name: /^Plan your first trip/ }).click();
  await expect(page).toHaveURL(origin + '/blog/first-trip-to-korea-planning-guide');
  expect(await events(page, 'guide_first_trip')).toEqual([
    ['event', 'guide_first_trip', {
      page_path: regional,
      page_location: origin + regional,
      page_referrer: 'https://www.google.com',
    }],
  ]);
});
