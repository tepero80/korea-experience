import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('palace night guide distinguishes ended events and a daytime alternative', async ({ page, context }, info) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/blog/palace-starlight-night-tours-2026');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('main img').first().evaluate(async (image: HTMLImageElement) => image.decode());
  await expect(page.getByText(/all three autumn runs below have ended/i)).toBeVisible();
  await page.screenshot({ path: info.outputPath('top.png') });
  const fallback = page.getByText('Visiting Gyeongbokgung in November?');
  await fallback.scrollIntoViewIfNeeded();
  await expect(page.getByRole('link', { name: 'October–November 2026 notice' })).toHaveAttribute('href', /royal\.khs\.go\.kr/);
  await expect(page.getByRole('link', { name: /autumn 2026 organizer's notice/ })).toHaveAttribute('href', /kh\.or\.kr/);
  await page.screenshot({ path: info.outputPath('fallback.png') });
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
  expect((await page.evaluate(() => navigator.clipboard.readText())).toLowerCase()).toContain('palace');
});
