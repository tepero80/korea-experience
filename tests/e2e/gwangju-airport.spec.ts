import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Traveler can plan Gwangju airport rail connection', async ({ page, context }, info) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/blog/gwangju-airport-to-songjeong-station');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'airport’s transport guidance' })).toHaveAttribute('href', /airport\.co\.kr/);
  const mapRow = page.getByRole('row').filter({ hasText: 'Gwangju-Songjeong railway station' });
  await expect(mapRow.getByRole('link', { name: 'Naver Map' })).toHaveAttribute('href', /map\.naver\.com/);
  await expect(mapRow.getByRole('link', { name: 'Kakao Map' })).toHaveAttribute('href', /map\.kakao\.com/);
  const quickDirections = page.getByRole('region', { name: 'Addresses and directions' });
  const google = await quickDirections.getByRole('link', { name: 'Google Maps for Gwangju-Songjeong Railway Station' }).getAttribute('href');
  const kakao = await quickDirections.getByRole('link', { name: 'Kakao Map for Gwangju-Songjeong Railway Station' }).getAttribute('href');
  const target = new URL(google!).searchParams.get('query');
  expect(target).toMatch(/^35\.\d+,126\.\d+$/);
  expect(new URL(kakao!).pathname.endsWith(`,${target}`)).toBe(true);
  await page.locator('main img').first().evaluate(async (img: HTMLImageElement) => img.decode());
  await page.screenshot({ path: info.outputPath('top.png') });
  await page.getByRole('heading', { name: 'Choose the right direction' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('table.png') });
  for (const link of await page.locator('main a[href^="#"]').all()) {
    const href = await link.getAttribute('href');
    if (href && href.length > 1) await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  const credit = page.locator('.photo-credit details').first();
  await credit.locator('summary').click();
  await expect(credit).toHaveAttribute('open', '');
  await page.screenshot({ path: info.outputPath('credit-open.png') });
  await page.getByRole('button', { name: 'Save guide' }).click();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: 'Share', exact: true }).filter({ visible: true }).first().click();
  await page.getByRole('button', { name: 'Copy summary' }).click();
  expect((await page.evaluate(() => navigator.clipboard.readText())).toLowerCase()).toContain('gwangju');
});


