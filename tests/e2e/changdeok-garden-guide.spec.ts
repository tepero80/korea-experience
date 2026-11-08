import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('garden ticket decisions and sources are usable', async ({ page }, info) => {
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/blog/changdeokgung-secret-garden-tickets');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'official reservation page' })).toHaveAttribute('href', /royal\.khs\.go\.kr/);
  await expect(page.getByText(/do not assume that garden capacity is unlimited or free/)).toBeVisible();
  await page.locator('main img').first().evaluate(async (img: HTMLImageElement) => img.decode());
  await page.screenshot({ path: info.outputPath('top.png') });
  await page.getByRole('table').first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('table.png') });
  for (const link of await page.locator('main a[href^="#"]').all()) {
    const href = await link.getAttribute('href');
    if (href && href.length > 1) await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
});

test('garden guide can be saved, shared and mapped', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/blog/changdeokgung-secret-garden-tickets');
  await page.getByRole('button', { name: 'Save guide' }).click();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Share', exact: true }).first().click();
  await page.getByRole('button', { name: 'Copy summary' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Garden');
  await page.getByRole('link', { name: 'Places & map', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Naver Map', exact: false }).first()).toHaveAttribute('href', /map\.naver\.com/);
  await page.getByRole('button', { name: 'Copy address', exact: true }).first().click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('서울');
});
