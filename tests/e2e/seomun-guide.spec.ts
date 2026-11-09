import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Traveler can plan a Seomun Market meal, save and share', async ({ page, context }, info) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/blog/seomun-market-daytime-food-visit');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'KTO venue information' })).toHaveAttribute('href', /visitkorea\.or\.kr/);
  await expect(page.getByRole('link', { name: 'Find Seomun Market in Naver Map' })).toHaveAttribute('href', /map\.naver\.com/);
  await page.locator('main img').first().evaluate(async (img: HTMLImageElement) => img.decode());
  await page.screenshot({ path: info.outputPath('top.png') });
  await page.getByRole('heading', { name: 'Before you leave' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('table.png') });
  for (const link of await page.locator('main a[href^="#"]').all()) {
    const href = await link.getAttribute('href');
    if (href && href.length > 1) await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Save guide' }).click();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Share', exact: true }).first().click();
  await page.getByRole('button', { name: 'Copy summary' }).click();
  expect((await page.evaluate(() => navigator.clipboard.readText())).toLowerCase()).toContain('seomun');
});


