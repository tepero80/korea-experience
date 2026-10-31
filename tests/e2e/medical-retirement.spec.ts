import { expect, test } from '@playwright/test';

test('retired clinic promotion is unavailable and absent from public discovery', async ({
  page,
  request,
}) => {
  const slug = 'korean-beauty-clinics-gangnam-skincare-guide';
  const response = await page.goto('/blog/' + slug);
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('link', { name: 'Find a travel guide' })).toBeVisible();
  for (const path of ['/sitemap.xml', '/content-catalog.json', '/search-index.json']) {
    const result = await request.get(path);
    expect(result.ok()).toBeTruthy();
    expect(await result.text()).not.toContain(slug);
  }
});
