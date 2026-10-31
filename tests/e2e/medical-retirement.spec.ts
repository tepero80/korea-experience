import { expect, test } from '@playwright/test';

for (const slug of [
  'korean-beauty-clinics-gangnam-skincare-guide',
  'revision-rhinoplasty-in-korea-why-foreigners-choose-seoul-for-second-chances-2026',
])
  test(`retired medical promotion is unavailable and absent from public discovery: ${slug}`, async ({
    page,
    request,
  }) => {
    const response = await page.goto('/blog/' + slug);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('link', { name: 'Find a travel guide' })).toBeVisible();
    for (const path of ['/sitemap.xml', '/content-catalog.json', '/search-index.json']) {
      const result = await request.get(path);
      expect(result.ok()).toBeTruthy();
      expect(await result.text()).not.toContain(slug);
    }
  });
