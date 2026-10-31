import { expect, test } from '@playwright/test';

test('a traveler can locate the Gyeongju stops and save one to a private plan', async ({ page }, testInfo) => {
  await page.route('**/api/**', (route) => route.fulfill({ status: 401, json: {} }));
  await page.goto('/blog/gyeongju-the-museum-without-walls-2-day-historical-itinerary-2026');
  await expect(page.getByRole('heading', { name: 'Two Days in Gyeongju: A Practical Silla-History Itinerary', level: 1 })).toBeVisible();
  await expect(page.locator('#getting-there-ktx-vs-bus')).toBeAttached();
  await expect(page.locator('#morning-the-jewel-of-silla-bulguksa-temple')).toBeAttached();
  await expect(page.getByRole('link', { name: 'Gyeongju tourism map', exact: true })).toHaveAttribute('href', 'https://www.gyeongju.go.kr/tour/page.do?mnu_uid=4618');
  const photo = page.locator('figure.guide-photo');
  await expect(photo.locator('img')).toHaveAttribute('alt', /Donggung Palace reflected in Wolji Pond/);
  await photo.scrollIntoViewIfNeeded();
  await photo.screenshot({ path: testInfo.outputPath('context-photo.png') });
  await expect(page.getByText('경상북도 경주시 일정로 186')).toBeVisible();
  await expect(page.getByText('경상북도 경주시 석굴로 238 (진현동)')).toBeVisible();
  await page.getByRole('button', { name: 'Load interactive map' }).click();
  await expect(page.getByRole('region', { name: 'Overview map of places in this guide' })).toBeVisible();
  await page.getByRole('button', { name: 'Add to trip board: Gyeongju National Museum' }).click();
  await expect(page.getByText('Gyeongju National Museum added to Day 1.', { exact: false })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('map-open.png') });
  await page.getByRole('link', { name: 'Open your trip board', exact: false }).click();
  await expect(page).toHaveURL(/\/tools\/itinerary/);
  await expect(page.getByText('Gyeongju National Museum', { exact: false }).first()).toBeVisible();
});

test('the Gyeongju place list remains usable when map tiles fail', async ({ page }) => {
  await page.route('**/api/**', (route) => route.fulfill({ status: 401, json: {} }));
  await page.route('https://tile.openstreetmap.org/**', (route) => route.abort());
  await page.goto('/blog/gyeongju-the-museum-without-walls-2-day-historical-itinerary-2026');
  await page.getByRole('button', { name: 'Load interactive map' }).click();
  await expect(page.getByText('Some map tiles could not load.', { exact: false })).toBeVisible();
  await expect(page.getByText('경상북도 경주시 일정로 186')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Naver Map', exact: false }).first()).toHaveAttribute('href', /map\.naver\.com/);
});
