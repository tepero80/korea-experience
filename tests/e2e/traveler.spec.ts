import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Community unavailable in this isolated test' }),
    }),
  );
});
for (const path of [
  '/',
  ...prototypes,
  '/tools',
  '/tools/transit-pass',
  '/tools/trip-budget',
  '/tools/itinerary',
  '/tools/medical-cost-estimator',
]) {
  test(`visible, accessible, usable page: ${path}`, async ({ page }, testInfo) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    ).toBeTruthy();
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(violations).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('page.png'), fullPage: true });
  });
}
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

test('a traveler adds a guide place, edits its date/time/buffer and reopens the private board', async ({
  page,
}) => {
  await page.goto(prototypes[1]);
  await page.getByRole('button', { name: 'Add to trip board: Gyeongbokgung', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'added to Day 1' })).toBeVisible();
  await page.getByRole('link', { name: 'Open your trip board →', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Gyeongbokgung', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit Gyeongbokgung', exact: true }).click();
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
  const login = page.getByRole('link', { name: 'Save draft & sign in with Google or email' });
  await expect(login).toHaveAttribute('href', /returnTo=/);
  expect(await login.getAttribute('href')).not.toContain('Fixture');
});
