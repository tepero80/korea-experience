import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('power bank guide supports a safe departure decision', async ({ page }, info) => {
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto('/blog/incheon-power-bank-carry-on-rules');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Korean-language carry-on rules' })).toHaveAttribute('href', 'https://www.airport.kr/ap_ko/905/subview.do');
  await expect(page.getByRole('link', { name: 'May 2026 announcement' })).toHaveAttribute('href', /airport\.kr/);
  await page.locator('main img').first().evaluate(async (img: HTMLImageElement) => img.decode());
  await page.screenshot({ path: info.outputPath('top.png') });
  const table = page.getByRole('table'); await table.scrollIntoViewIfNeeded(); await expect(table).toBeVisible();
  await page.screenshot({ path: info.outputPath('table.png') });
  for (const link of await page.locator('main a[href^="#"]').all()) { const href = await link.getAttribute('href'); if (href && href.length > 1) await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1); }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze(); expect(results.violations).toEqual([]);
});

test('guide controls preserve and share the guide', async ({ page, context }) => {
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.route('**/api/**', route => route.fulfill({status:401,json:{}}));
 await page.goto('/blog/incheon-power-bank-carry-on-rules');
 await page.getByRole('button',{name:'Save guide'}).click();
 await expect(page.getByRole('button',{name:'Saved',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Share',exact:true}).first().click();
 await expect(page.getByRole('button',{name:'Copy summary'})).toBeVisible();
 await page.getByRole('button',{name:'Copy summary'}).click();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('power bank');
});
