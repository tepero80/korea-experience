import { expect, test } from '@playwright/test';

test('a traveler can find official late-night pharmacy resources and emergency contacts', async ({ page }, testInfo) => {
  await page.route('**/api/**', (route) => route.fulfill({ status: 401, json: {} }));
  await page.goto('/blog/24-hour-english-pharmacies-in-seoul-2026');
  await expect(page.getByRole('heading', { name: 'How to Find a Late-Night Pharmacy in Seoul', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Pharm114 pharmacy directory', exact: true })).toHaveAttribute('href', 'https://www.pharm114.or.kr/');
  await expect(page.getByRole('link', { name: 'public late-night pharmacy map' })).toHaveAttribute('href', 'https://map.seoul.go.kr/smgis2/short/6PAOC');
  await expect(page.getByRole('link', { name: '119', exact: true })).toHaveAttribute('href', 'tel:119');
  await expect(page.getByText('English service is not guaranteed by a directory listing.')).toBeVisible();
  await page.getByRole('button', { name: 'Save guide', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Share', exact: true }).click();
  await expect(page.locator('#share-guide')).toBeInViewport();
  await expect(page.getByRole('heading', { name: 'Keep the important details together.' })).toBeInViewport();
  await expect(page.locator('#share-guide').getByRole('button', { name: 'Copy summary' })).toBeInViewport();
  await page.screenshot({ path: testInfo.outputPath('share-controls.png') });
  await page.getByRole('link', { name: 'Pharmacies & Medical Help in Korea', exact: true }).click();
  await expect(page).toHaveURL(/korean-pharmacies-otc-meds-tourists-2026/);
  await page.locator('.next-steps').getByText('Find late-night help in Seoul').click();
  await expect(page).toHaveURL(/24-hour-english-pharmacies-in-seoul-2026/);
});
