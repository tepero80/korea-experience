import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const path = '/blog/emergency-ready-app-english-alerts-2026';
const oldAnchors = ['why-you-need-the-emergency-ready-app', 'comparing-your-alert-options',
  'option-a-the-set-it-and-forget-it-method-recommended', 'option-b-the-tourist-method-papago',
  'pros-and-cons-of-the-app', 'step-by-step-setup-guide', 'advanced-features-drills-and-medical-help',
  'civil-defense-drills-minbangwi', 'finding-medical-help', 'critical-warnings-and-tips',
  'the-ghost-vibration', 'frequently-asked-questions', 'conclusion', 'sources'];

test('emergency guide distinguishes immediate help from optional app information', async ({ page, context }, testInfo) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto(path);
  await expect(page.getByRole('heading', { name: 'Emergency Ready App in Korea: Alerts and Safety Information', level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.locator('main img').first().evaluate(async (image: HTMLImageElement) => image.decode());
  await page.screenshot({ path: testInfo.outputPath('emergency-top.png') });
  for (const id of oldAnchors) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  await expect(page.getByText(/Do not delay an emergency call to install or troubleshoot an app/i)).toBeVisible();
  await expect(page.getByText(/We have not tested alert delivery, offline use or the current app interface on a device/i)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Emergency Ready App on Google Play' })).toHaveAttribute('href', /play\.google\.com\/store\/apps/);
  await expect(page.getByRole('link', { name: 'Emergency Ready App on Apple App Store' })).toHaveAttribute('href', /apps\.apple\.com/);
  await expect(page.getByText(/Sarah Jenkins|1\.7 million|1-5 Minutes/i)).toHaveCount(0);
  await page.getByRole('button', { name: 'Save guide' }).click();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Copy summary' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Emergency Ready App in Korea');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
  expect(scan.violations).toEqual([]);
});
