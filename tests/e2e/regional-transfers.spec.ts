import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const guide of [
  { slug: 'gimhae-airport-to-busan', source: 'official public transport guide', copy: 'busan', map: 'Search for Gimhae Airport on Naver Map' },
  { slug: 'gangneung-station-anmok', source: '2026 East Coast guide', copy: 'anmok', map: 'Search Anmok Beach in Naver Map' },
]) {
  test(`${guide.slug}: source, responsive layout and controls`, async ({ page, context }, info) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
    await page.goto(`/blog/${guide.slug}`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('link', { name: guide.source }).first()).toHaveAttribute('href', /^https:\/\//);
    await expect(page.getByRole('link', { name: guide.map })).toHaveAttribute('href', /map\.naver\.com/);
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
    await page.getByRole('button', { name: 'Save guide' }).click();
    await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Share', exact: true }).first().click();
    await page.getByRole('button', { name: 'Copy summary' }).click();
    expect((await page.evaluate(() => navigator.clipboard.readText())).toLowerCase()).toContain(guide.copy);
  });
}
