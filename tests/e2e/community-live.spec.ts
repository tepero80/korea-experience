import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';

// Read-only public UI review. No provider login, email, post, CAPTCHA interaction or member fixture.
const base = process.env.COMMUNITY_REVIEW_BASE_URL;
test.skip(!base, 'Live public community review requires an explicit deployment URL.');
for (const path of ['/community', '/community/account']) {
  test(`live public community layout: ${path}`, async ({ page }, info) => {
    await page.goto(base! + path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Continue with Google', exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel('Email', { exact: true })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    // The host-bound managed widget may pass or report a browser challenge error. Neither is
    // manufactured here; the visible state is retained, and actual sign-in is a separate gate.
    await expect(page.locator('form[data-action="email"] .spam-check')).toBeVisible();
    const menu = page.locator('.community-menu');
    if (await menu.isVisible()) {
      await menu.locator('summary').press('Enter');
      await expect(menu.getByRole('link', { name: 'Travel tools', exact: true })).toBeVisible();
      await page.screenshot({
        path: info.outputPath('menu-open.jpg'),
        type: 'jpeg',
        quality: 85,
        fullPage: true,
      });
      await menu.locator('summary').press('Enter');
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    ).toBeTruthy();
    await page.screenshot({
      path: info.outputPath('community.jpg'),
      type: 'jpeg',
      quality: 85,
      fullPage: true,
    });
    await fs.writeFile(
      info.outputPath('community-info.json'),
      JSON.stringify(
        {
          path,
          base,
          title: await page.title(),
          test: info.title,
          imageFile: 'community.jpg',
          ...(await page.evaluate(() => ({
            width: innerWidth,
            height: innerHeight,
            contentWidth: document.documentElement.scrollWidth,
          }))),
        },
        null,
        2,
      ),
    );
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze())
        .violations,
    ).toEqual([]);
  });
}
