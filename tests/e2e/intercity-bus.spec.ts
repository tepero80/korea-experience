import { expect, test } from '@playwright/test';

test('a traveler can find official bus booking sources and compare rail', async ({ page }) => {
  await page.route('**/api/**', (route) => route.fulfill({ status: 401, json: {} }));
  await page.goto('/blog/intercity-bus-travel-booking-apps-and-routes');
  await expect(
    page.getByRole('heading', {
      name: 'How to Book Intercity and Express Buses in Korea',
      level: 1,
    }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'TxBus', exact: true })).toHaveAttribute(
    'href',
    'https://intercitybuse.tmoney.co.kr/main.do',
  );
  await expect(page.getByRole('link', { name: 'NAVER Map', exact: true })).toHaveAttribute(
    'href',
    'https://map.naver.com/',
  );
  await expect(page.getByText('동서울종합터미널')).toBeVisible();
  await expect(page.getByText('서울고속버스터미널', { exact: false })).toBeVisible();
  await expect(
    page.getByText('The pictured vehicle is not verified as a scheduled intercity service.'),
  ).toBeVisible();
  await page.getByRole('link', { name: 'KTX and SRT booking guide' }).click();
  await expect(page).toHaveURL(/ktx-vs-srt-high-speed-train-comparison-and-booking/);
  await expect(page.locator('.next-steps').getByText('Compare the bus')).toBeVisible();
  await page.locator('.next-steps').getByText('Compare the bus').click();
  await expect(page).toHaveURL(/intercity-bus-travel-booking-apps-and-routes/);
});
