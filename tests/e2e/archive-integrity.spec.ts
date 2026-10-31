import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { getAllPosts } from '../../lib/posts';

// Only the explicit isolated archive matrix runs this larger coverage set.
// Both metadata rewrites and shared-component changes must be rendered.
const shard = Number(process.env.ARCHIVE_REVIEW_SHARD || '0');
if (shard) {
  // Shared MDX changes can affect any legacy guide, including those without
  // the initially suspected components. Keep the complete754-guide archive.
  const affected = getAllPosts().filter((post) => !post.reviewed);
  for (const post of affected.filter((_, index) => index % 4 === shard - 1)) {
    test(`archive evidence display: ${post.slug}`, async ({ page }, info) => {
      await page.route('**/api/**', (route) =>
        route.fulfill({ status: 401, contentType: 'application/json', body: '{}' }),
      );
      await page.goto('/blog/' + post.slug);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText(post.title);
      await expect(
        page.locator('[itemtype="https://schema.org/LocalBusiness"], [itemprop="aggregateRating"]'),
      ).toHaveCount(0);
      for (const picture of await page.locator('img').all()) {
        await picture.scrollIntoViewIfNeeded();
        await picture.evaluate(async (node: HTMLImageElement) => {
          await node.decode();
        });
      }
      await page.evaluate(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return document.fonts.ready;
      });
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      const measured = await page.evaluate(() => ({
        width: innerWidth,
        height: innerHeight,
        contentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
        scrollY,
      }));
      await page.screenshot({
        path: info.outputPath('archive.jpg'),
        type: 'jpeg',
        quality: 70,
        fullPage: true,
      });
      await fs.writeFile(
        info.outputPath('archive-info.json'),
        JSON.stringify({
          path: '/blog/' + post.slug,
          title: post.title,
          test: info.title,
          imageFile: 'archive.jpg',
          ...measured,
          scope:
            'Rendered evidence-display/layout/image/accessibility checks, not whole-article factual acceptance.',
        }),
      );
      expect(measured.contentWidth).toBeLessThanOrEqual(measured.width + 1);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(violations).toEqual([]);
    });
  }
}
