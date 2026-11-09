import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Traveler can compare trains to Taehwagang', async ({ page, context }, info) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/blog/busan-bujeon-to-ulsan-taehwagang-trains');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'metropolitan rail operations page' })).toHaveAttribute('href', /info\.korail\.com/);
  await expect(page.getByRole('link', { name: 'Find 태화강역 in Naver Map' })).toHaveAttribute('href', /map\.naver\.com/);
  await page.locator('main img').first().evaluate(async (img: HTMLImageElement) => img.decode());
  await page.screenshot({ path: info.outputPath('top.png') });
  await page.getByRole('heading', { name: 'Which train fits your plan?' }).scrollIntoViewIfNeeded();
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
  await page.getByRole('button', { name: 'Share', exact: true }).first().click();
  await page.getByRole('button', { name: 'Copy summary' }).click();
  expect((await page.evaluate(() => navigator.clipboard.readText())).toLowerCase()).toContain('taehwagang');
});


