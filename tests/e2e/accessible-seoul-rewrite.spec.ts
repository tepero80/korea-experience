import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const path = '/blog/accessible-seoul-best-routes-for-wheelchair-and-limited-mobility-2026';
const legacyAnchors = [
  'the-state-of-accessibility-in-seoul-2026-update', 'essential-transportation-guide-for-wheelchair-users',
  'the-subway-system-your-best-friend', 'wheelchair-accessible-taxis', 'low-floor-buses',
  'route-1-the-royal-history-tour-gwanghwamun--gyeongbokgung', 'gwanghwamun-square', 'gyeongbokgung-palace',
  'route-2-the-future-city-gangnam--coex', 'coex-mall--starfield-library', 'bongeunsa-temple',
  'route-3-nature-and-rivers-han-river-parks', 'yeouido-han-river-park', 'barrier-free-accommodation-guide',
  'luxury-options-250', 'mid-range--budget-80---150', 'food--dining-navigating-restaurants',
  'strategies-for-dining', 'specialized-resources-seoul-danurim', 'challenges-and-reality-check',
  'budgeting-for-your-trip', 'final-thoughts',
];

test('accessible Seoul guide preserves old links and explains the exact route checks', async ({ page }, testInfo) => {
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto(path);
  await expect(page.getByRole('heading', { name: 'Accessible Seoul: How to Plan Your Route and Stay', level: 1 })).toBeVisible();
  const hero = page.getByAltText('Illustrative sequence for checking a room, station, street exit and venue; it does not depict a verified route');
  await hero.evaluate(async (image: HTMLImageElement) => { await image.decode(); });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: testInfo.outputPath('accessible-seoul-top.png') });
  for (const id of legacyAnchors) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  await expect(page.getByText('reservations for 2026 close on 4 December', { exact: false })).toBeVisible();
  await expect(page.getByText('서울특별시 강남구 영동대로 513')).toBeVisible();
  await expect(page.getByRole('link', { name: '2026 reservation notice' })).toHaveAttribute('href', 'https://www.seouldanurim.net/notice/14385_/14385');
  await expect(page.getByText('94% subway elevator coverage')).toHaveCount(0);
  await expect(page.getByText('Private editor notes', { exact: false })).toHaveCount(0);
  await expect(page.getByText('This draft removes', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Plan the wider trip/i })).toHaveAttribute('href', '/blog/first-trip-to-korea-planning-guide');
  await expect(page.getByRole('link', { name: /A useful companion.*pharmacy/i })).toHaveCount(0);
  await page.getByRole('button', { name: 'Load interactive map' }).click();
  await expect(page.getByRole('region', { name: 'Overview map of places in this guide' })).toBeVisible();
  await expect.poll(async () =>
    (await page.locator('.leaflet-tile-loaded').count()) > 0 ||
    (await page.getByText('Some map tiles could not load.', { exact: false }).isVisible()),
    { timeout: 15000 },
  ).toBeTruthy();
  await expect(page.getByText('서울 종로구 사직로 161')).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('accessible-seoul-map.png') });
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(scan.violations).toEqual([]);
});

test('the place list stays usable if map tiles cannot load', async ({ page }) => {
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.route('https://tile.openstreetmap.org/**', route => route.abort());
  await page.goto(path);
  await page.getByRole('button', { name: 'Load interactive map' }).click();
  await expect(page.getByText('Some map tiles could not load.', { exact: false })).toBeVisible();
  await expect(page.getByText('서울 종로구 사직로 161')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Naver Map', exact: false }).first()).toHaveAttribute('href', /map\.naver\.com/);
});

test('a traveler can save, copy an address and add a place to a local plan', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto(path);
  await page.getByRole('button', { name: 'Save guide' }).click();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Copy address', exact: true }).first().click();
  await expect(page.getByText('Place name and address copied.')).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('서울 종로구 사직로 161');
  await page.getByRole('button', { name: 'Add to trip board: Gyeongbokgung' }).click();
  await expect(page.getByText('Gyeongbokgung added to Day 1.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Copy summary' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Accessible Seoul: How to Plan Your Route and Stay');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
