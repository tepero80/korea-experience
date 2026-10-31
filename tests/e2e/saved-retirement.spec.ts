import { expect, test } from '@playwright/test';

test('account-only retired guides stay visible and removal can be undone locally', async ({
  page,
}) => {
  await page.route('**/api/saved', (route) =>
    route.fulfill({ json: { items: [{ guide_id: 'guide:retired-example' }] } }),
  );
  await page.route('**/api/saved/**', (route) =>
    route.fulfill({ status: route.request().method() === 'PUT' ? 400 : 200, json: {} }),
  );
  await page.goto('/saved');
  await expect(page.getByRole('heading', { name: 'Unavailable saved guide' })).toBeVisible();
  await expect(page.getByText('This guide is no longer published.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Find a current alternative.' })).toHaveClass(
    /text-link/,
  );
  await page.getByRole('button', { name: 'Remove' }).click();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByRole('heading', { name: 'Unavailable saved guide' })).toBeVisible();
  await expect(
    page.getByText('Restored on this browser; account restoration could not be confirmed.'),
  ).toBeVisible();
});
