import { test, expect, type Page, type TestInfo } from '@playwright/test';
import fs from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import editorial from '../../data/editorial.json';

async function capturePage(page: Page, info: TestInfo, name = 'page') {
  // Inspect the images a scrolling reader sees, rather than empty lazy placeholders.
  for (const picture of await page.locator('img').all()) {
    await picture.scrollIntoViewIfNeeded();
    await picture.evaluate(async (node: HTMLImageElement) => {
      await node.decode();
    });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => scrollY === 0);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: info.outputPath(name + '.jpg'),
    type: 'jpeg',
    quality: 85,
    fullPage: true,
  });
  await fs.writeFile(
    info.outputPath(name + '-info.json'),
    JSON.stringify(
      {
        path: new URL(page.url()).pathname,
        title: await page.title(),
        test: info.title,
        imageFile: name + '.jpg',
        ...(await page.evaluate(() => ({
          width: innerWidth,
          height: innerHeight,
          contentWidth: document.documentElement.scrollWidth,
        }))),
      },
      null,
      2,
    ),
  );
}

const prototypes = [
  '/blog/airport-limousine-bus-vs-arex-express-train',
  '/blog/seoul-3-day-itinerary-perfect-first-time-visitor-guide-2026',
  '/blog/how-to-order-food-in-korean-restaurants-phrases-guide-2026',
  '/blog/first-trip-to-korea-planning-guide',
  '/blog/seoul-neighborhood-chooser-for-first-time-visitors-where-to-stay-by-trip-style',
  '/blog/seoul-shopping-districts-complete-guide-myeongdong-to-gangnam',
  '/blog/choosing-korean-cultural-experiences-reservations-and-walk-in-options',
  '/blog/korea-travel-problem-solving-guide',
];
test.beforeEach(async ({ page }) => {
  // Static-page UX fixture. Provider/auth security is tested against the separate stage Worker.
  await page.route('**/api/**', (route) =>
    route.fulfill({
      status: route.request().url().endsWith('/api/me') ? 401 : 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Community unavailable in this isolated test' }),
    }),
  );
});
const coreGuides = Object.keys(editorial).map((slug) => '/blog/' + slug);
const categoryPages = [
  ...new Set(Object.values(editorial).map((e) => '/blog/category/' + e.categoryId)),
];
for (const path of [
  '/',
  ...coreGuides,
  ...categoryPages,
  '/blog',
  '/blog/category',
  '/destinations',
  '/destinations/seoul',
  '/destinations/busan',
  '/destinations/suwon',
  '/saved',
  '/about',
  '/contact',
  '/editorial-policy',
  '/privacy',
  '/terms',
  '/image-credits',
  '/blog/24-hour-english-pharmacies-in-seoul-2026',
  '/blog/1330-travel-helpline-8-languages-2026',
  '/blog/gentle-monster-vs-blue-elephant-eyewear-2026',
  '/tools',
  '/tools/transit-pass',
  '/tools/trip-budget',
  '/tools/itinerary',
  '/tools/medical-cost-estimator',
  '/tools/airport-transfer',
  '/tools/packing-checklist',
  '/tools/rainy-day',
]) {
  test(`visible, accessible, usable page: ${path}`, async ({ page }, testInfo) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await capturePage(page, testInfo);
    const documentTitle = page.locator('.document-page > h1');
    if (await documentTitle.count())
      expect(await documentTitle.evaluate((el) => getComputedStyle(el).fontFamily)).toContain(
        'KE Manrope',
      );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    ).toBeTruthy();
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations).toEqual([]);
  });
}
test('visit-month helper saves progress and shared conditions preserve the saved list', async ({
  page,
}, testInfo) => {
  await page.goto('/blog/korea-winter-packing-checklist');
  await page.getByRole('button', { name: 'Open this planning helper', exact: true }).click();
  await page.getByLabel('Visit month', { exact: true }).selectOption('12');
  await page.getByLabel('Traveling with children', { exact: true }).check();
  const entry = page.getByLabel(
    'Check visa/authorization and arrival-declaration requirements for your passport and date.',
    { exact: false },
  );
  await entry.check();
  await page.reload();
  await page.getByRole('button', { name: 'Open this planning helper', exact: true }).click();
  await expect(page.getByLabel('Visit month', { exact: true })).toHaveValue('12');
  await expect(entry).toBeChecked();
  const saved = await page.evaluate(() => localStorage.getItem('ke-checklist-v1'));
  await capturePage(page, testInfo, 'helper-open');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze())
      .violations,
  ).toEqual([]);
  await page.goto(
    '/tools/packing-checklist?v=1&month=7&children=false&dietary=true&accessibility=false',
  );
  await expect(page.getByLabel('Visit month', { exact: true })).toHaveValue('7');
  await expect(page.getByLabel('Dietary requirements', { exact: true })).toBeChecked();
  expect(await page.evaluate(() => localStorage.getItem('ke-checklist-v1'))).toBe(saved);
});
test('rain helper opens a separate map section without duplicate IDs', async ({
  page,
}, testInfo) => {
  await page.goto(
    '/blog/seoul-rainy-day-itinerary-built-around-museums-markets-and-covered-streets',
  );
  await page.getByRole('button', { name: 'Open this planning helper', exact: true }).click();
  await expect(page.locator('#helper-weather-map')).toBeAttached();
  expect(
    await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map((n) => n.id);
      return ids.filter((id, i) => ids.indexOf(id) !== i);
    }),
  ).toEqual([]);
  await capturePage(page, testInfo, 'helper-open');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze())
      .violations,
  ).toEqual([]);
});
test('late arrival helper distinguishes evening rail checks from an overnight fallback', async ({
  page,
}, testInfo) => {
  await page.goto('/blog/incheon-airport-late-night-arrival-guide');
  await page.getByRole('button', { name: 'Open this planning helper', exact: true }).click();
  await page.getByLabel('Ready to leave terminal (Korea time)', { exact: true }).fill('22:05');
  await page.getByLabel('Hotel area', { exact: true }).selectOption('hongdae');
  await page.getByRole('button', { name: 'Find what to check first', exact: true }).click();
  await expect(page.locator('.decision-options > div').first()).toContainText(
    'rail connection to Hongik',
  );
  await page.getByLabel('Ready to leave terminal (Korea time)', { exact: true }).fill('00:30');
  await expect(page.locator('.decision-options')).toHaveCount(0);
  await page.getByRole('button', { name: 'Find what to check first', exact: true }).click();
  await expect(page.locator('.decision-options > div').first()).toContainText('authorized taxi');
  await expect(
    page.getByRole('link', { name: 'AREX all-stop timetable: T1 ↗', exact: true }),
  ).toHaveAttribute('href', 'https://www.airportrailroad.com/train/normal/info/100/0');
  await capturePage(page, testInfo, 'helper-open');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze())
      .violations,
  ).toEqual([]);
});
test('shared arrival and weather plans reopen their public conditions', async ({ page }) => {
  await page.goto(
    '/tools/airport-transfer?v=1&terminal=T2&readyTime=00%3A30&area=hongdae&people=4&bags=3&stepFree=true',
  );
  await expect(page.getByLabel('Arrival terminal', { exact: true })).toHaveValue('T2');
  await expect(
    page.getByLabel('Ready to leave terminal (Korea time)', { exact: true }),
  ).toHaveValue('00:30');
  await expect(page.getByLabel('Travelers', { exact: true })).toHaveValue('4');
  await expect(page.locator('.decision-options > div').first()).toContainText('larger taxi');
  await expect(
    page.getByRole('link', { name: 'Seoul night buses: T2 ↗', exact: true }),
  ).toHaveAttribute('href', 'https://airport.kr/ap_en/1510/subview.do');
  await page.goto('/tools/rainy-day?v=1&region=other&interest=market');
  await expect(page.getByLabel('Priority', { exact: true })).toHaveValue('market');
  await expect(
    page.getByRole('heading', { name: 'Gwangjang Market + a short food stop', exact: true }),
  ).toBeVisible();
});
test('community retry distinguishes unknown sign-in from signed out and retains the question', async ({
  page,
}) => {
  let healthy = false;
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    const body =
      path === '/api/config'
        ? { turnstileSiteKey: '' }
        : path.startsWith('/api/reactions')
          ? { count: 0, mine: false }
          : { items: [] };
    return route.fulfill({
      status: !healthy ? 503 : path === '/api/me' ? 401 : 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
  await page.goto(prototypes[0]);
  await page
    .getByLabel('Your question or update', { exact: true })
    .fill('Fixture question preserved during a connection failure.');
  await expect(page.getByRole('button', { name: 'Retry community', exact: true })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Save draft & sign in with Google or email', exact: true }),
  ).toHaveCount(0);
  healthy = true;
  await page.getByRole('button', { name: 'Retry community', exact: true }).click();
  await expect(
    page.getByRole('link', { name: 'Save draft & sign in with Google or email', exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel('Your question or update', { exact: true })).toHaveValue(
    'Fixture question preserved during a connection failure.',
  );
});
test('search finds an arrival guide and Escape returns focus', async ({ page }) => {
  await page.goto('/');
  const trigger = page.locator('.home-search-trigger');
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('searchbox').fill('incheon');
  await expect(
    dialog.getByRole('link').filter({ hasText: 'Incheon Airport to Your Hotel' }),
  ).toBeVisible();
  await dialog.getByRole('searchbox').press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('successful anti-spam retry clears its stale error while preserving receipt', async ({
  page,
}) => {
  // Isolated local UI fixture only. No provider challenge or production write is bypassed.
  await page.route('https://challenges.cloudflare.com/**', (route) => route.abort());
  await page.addInitScript(() => {
    let attempts = 0;
    Object.assign(window, {
      turnstile: {
        render: (_box: Element, options: Record<string, (value?: string) => void>) => {
          attempts++;
          queueMicrotask(() =>
            attempts === 1
              ? options['error-callback']()
              : options.callback('isolated-fixture-token'),
          );
          return String(attempts);
        },
        remove() {},
        reset() {},
      },
    });
  });
  await page.route('**/api/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    return route.fulfill({
      status: path === '/api/contributions' ? 201 : 200,
      contentType: 'application/json',
      body: JSON.stringify(
        path === '/api/config'
          ? { turnstileSiteKey: 'isolated-fixture-key' }
          : path === '/api/me'
            ? { name: 'UI fixture' }
            : path.startsWith('/api/reactions')
              ? { count: 0, mine: false }
              : { items: [], ok: true },
      ),
    });
  });
  await page.goto(prototypes[0]);
  await page
    .getByLabel('Your question or update', { exact: true })
    .fill('Isolated fixture question.');
  await page.getByRole('button', { name: 'Retry anti-spam check', exact: true }).click();
  const discussion = page.locator('#discussion');
  await expect(discussion).toContainText('Anti-spam check completed.');
  await expect(discussion).not.toContainText('Retrying the anti-spam check');
  await page.getByRole('button', { name: 'Send for review', exact: true }).click();
  await expect(discussion).toContainText('Received for review.');
  await expect(page.getByLabel('Your question or update', { exact: true })).toHaveValue('');
});
test('a two-column question table reads within the mobile viewport', async ({ page }) => {
  await page.goto('/blog/booking-family-hotel-rooms-in-korea');
  const region = page.getByRole('region', {
    name: 'Comparison table, scroll horizontally if needed',
    exact: true,
  });
  expect(await region.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy();
  await expect(
    region.getByRole('columnheader', { name: 'A useful written answer', exact: true }),
  ).toBeVisible();
});

test('a traveler adds a guide place, edits its date/time/buffer and reopens the private board', async ({
  page,
}) => {
  await page.goto(prototypes[1]);
  await page.getByRole('button', { name: 'Add to trip board: Gyeongbokgung', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'added to Day 1' })).toBeVisible();
  await page.getByRole('link', { name: 'Open your trip board →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Gyeongbokgung', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit Gyeongbokgung', exact: true }).click();
  await expect(page.getByLabel('Trip day', { exact: true })).toBeFocused();
  await page.getByLabel('Trip day', { exact: true }).fill('2');
  await page.getByLabel('Planned arrival, Korea time', { exact: true }).fill('11:00');
  await page.getByLabel('Visit duration, minutes', { exact: true }).fill('90');
  await page.getByLabel('Travel buffer after this stop, minutes', { exact: true }).fill('30');
  await page
    .getByLabel('Private reminder', { exact: true })
    .fill('Fixture reminder to keep private');
  await page.getByRole('button', { name: 'Save stop changes', exact: true }).click();
  await page.getByLabel('Start date, optional', { exact: true }).fill('2026-11-02');
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Day 2 · 2026-11-03', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.itinerary-list')).toContainText('90 min visit');
  await expect(page.locator('.itinerary-list')).toContainText('11:00');
  await page.getByText('Review a public sharing snapshot', { exact: true }).click();
  await expect(page.locator('.public-plan-preview')).toContainText('Gyeongbokgung');
  await expect(page.locator('.public-plan-preview')).not.toContainText('Fixture reminder');
  await expect(page.locator('.public-plan-preview')).not.toContainText('2026-11-02');
  await page.getByLabel('Include private plan and stop notes', { exact: true }).check();
  await expect(page.locator('.public-plan-preview')).toContainText('Fixture reminder');
});
test('family pass totals count separate cards and per-traveler journeys', async ({ page }) => {
  await page.goto('/tools/transit-pass');
  await page.getByLabel('Travelers with the same fare and travel pattern').fill('3');
  await page.getByRole('button', { name: 'Compare my costs', exact: true }).click();
  await expect(page.locator('.tool-result')).toContainText('Whole party: 3 travelers');
  await expect(page.locator('.tool-result')).toContainText('₩39,000');
  await expect(page.locator('.tool-result')).toContainText('₩37,200');
  await expect(page.locator('.tool-result')).toContainText('₩1,800');
});

test('family budget changes rooms without multiplying meals and keeps the breakdown before sharing', async ({
  page,
}, testInfo) => {
  await page.goto('/tools/trip-budget');
  await page.getByRole('button', { name: 'Build my budget', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: '₩2,104,500 for the party', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Keep this scenario for comparison', exact: true })
    .click();
  await page.getByLabel('Rooms each night', { exact: true }).fill('2');
  await expect(page.locator('.calculation-stale')).toBeVisible();
  await page.getByRole('button', { name: 'Build my budget', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: '₩2,932,500 for the party', exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('.cost-list > div').filter({ has: page.getByText('Food', { exact: true }) }),
  ).toContainText('₩490,000');
  await expect(page.locator('.scenario-comparison')).toContainText('₩828,000 more');
  expect(
    await page.locator('.tool-result').evaluate((el) => {
      const costs = el.querySelector('.cost-list');
      const share = el.querySelector('.share-box');
      return (
        !!costs &&
        !!share &&
        !!(costs.compareDocumentPosition(share) & Node.DOCUMENT_POSITION_FOLLOWING)
      );
    }),
  ).toBeTruthy();
  await expect(page.getByRole('region', { name: 'Share this result', exact: true })).toContainText(
    'The link reopens these inputs.',
  );
  await capturePage(page, testInfo, 'budget-result');
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze())
      .violations,
  ).toEqual([]);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download card', exact: true }).click();
  await (await download).saveAs(testInfo.outputPath('budget-result-card.png'));
});
test('guide save, map address and reading anchors have working controls', async ({ page }) => {
  await page.goto(prototypes[0]);
  await page.getByRole('button', { name: 'Save guide', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Places & map', exact: true }).click();
  await expect(page.locator('#places-and-map')).toBeInViewport();
  await expect(
    page.getByRole('button', { name: 'Copy address', exact: true }).first(),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Share', exact: true }).click();
  await expect(page.locator('#share-guide')).toBeInViewport();
});
test('a question draft survives a new page view without entering the sign-in URL', async ({
  page,
}) => {
  await page.goto(prototypes[0]);
  const draft = page.getByLabel('Your question or update');
  await draft.fill('Fixture question: which train suits a late family arrival?');
  await page.reload();
  await expect(draft).toHaveValue('Fixture question: which train suits a late family arrival?');
  await draft.click();
  const login = page.getByRole('link', { name: 'Save draft & sign in with Google or email' });
  await expect(login).toHaveAttribute('href', /returnTo=/);
  expect(await login.getAttribute('href')).not.toContain('Fixture');
});

test('older guides stay optional while their real links remain keyboard accessible', async ({
  page,
}, testInfo) => {
  await page.goto('/blog/category/culture-events');
  const archive = page.locator('.archive-list details');
  const firstLink = archive.getByRole('link').first();
  await expect(firstLink).toBeHidden();
  await archive.locator('summary').press('Enter');
  await expect(firstLink).toBeVisible();
  await expect(firstLink).toHaveAttribute('href', /^\/blog\//);
  await capturePage(page, testInfo, 'archive-expanded');
  await archive.locator('summary').press('Enter');
  await expect(firstLink).toBeHidden();
  await page.goto('/destinations/seoul');
  await expect(page.locator('.guide-grid .guide-card')).toHaveCount(6);
  const more = page.locator('.destination-directory');
  await expect(more.getByRole('link').first()).toBeHidden();
  await more.locator('summary').click();
  await expect(more.getByRole('link').first()).toBeVisible();
  await capturePage(page, testInfo, 'destination-expanded');
});
