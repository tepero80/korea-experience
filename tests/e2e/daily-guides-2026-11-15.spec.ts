import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const guides = [
  'jeju-winter-ferry-checklist-udo-gapa-marado',
  'seoul-snow-transit-topis-checklist',
  'busan-modern-contemporary-history-museum-visit',
  'seoul-museum-of-craft-art-visitor-guide',
  'busan-museum-un-memorial-cemetery-respectful-half-day',
  'bukchon-village-library-visitor-guide',
  'korea-cold-wave-travel-day-plan',
  'walking-on-icy-sidewalks-in-korea',
  'korean-packaged-food-allergy-labels',
  'korea-ice-festival-opening-check',
];

const expectedThird: Record<string, string> = {
  'busan-modern-contemporary-history-museum-visit': 'seoul-to-busan-weekend-planner-train-neighborhood-base-and-route-choices',
  'busan-museum-un-memorial-cemetery-respectful-half-day': 'seoul-to-busan-weekend-planner-train-neighborhood-base-and-route-choices',
  'seoul-museum-of-craft-art-visitor-guide': 'unhyeongung-anguk-traditional-house-visit',
  'bukchon-village-library-visitor-guide': 'unhyeongung-anguk-traditional-house-visit',
};

for (const slug of guides) test(`${slug}: rendered travel guide`, async ({ page, context }, info) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  const response = await page.goto('/blog/' + slug);
  expect(response?.status()).toBe(200);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  if (expectedThird[slug]) {
    await expect(page.getByRole('link', { name: /Plan your Busan journey|Explore another Anguk stop/i })).toHaveAttribute('href', `/blog/${expectedThird[slug]}`);
  }
  const hero = page.locator('main img').first();
  await hero.evaluate(async (img: HTMLImageElement) => img.decode());
  await page.screenshot({ path: info.outputPath('top.png') });
  const articleHeading = page.locator('#guide-details h2').first();
  await expect(articleHeading).toBeVisible();
  await articleHeading.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('body.png') });
  for (const link of await page.locator('main a[href^="#"]').all()) {
    const href = await link.getAttribute('href');
    if (href && href.length > 1) await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations).toEqual([]);
  const credit = page.locator('.photo-credit details').first();
  await credit.locator('summary').click();
  await expect(credit).toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Save guide' }).click();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Share', exact: true }).first().click();
  await page.getByRole('button', { name: 'Copy summary' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('koreaexperience.com/blog/');
});
