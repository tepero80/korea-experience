import { expect, test, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const firstTrip = '/blog/first-trip-to-korea-planning-guide';
const regionalGuide = '/blog/gwangju-u-square-bus-terminal-to-asia-culture-center';
const nationalGuide = '/blog/korea-charger-voltage-plug';
const archiveGuide = '/blog/autumn-colors-best-hiking-and-photography-spots';

function guideNavigation(page: Page) {
  return page.getByRole('navigation', { name: 'Destination guides', exact: true });
}

async function open(page: Page, path: string) {
  expect((await page.goto(path))?.status()).toBe(200);
  const essential = page.getByRole('button', { name: 'Essential only', exact: true });
  if (await essential.isVisible()) await essential.click();
  await page.evaluate(() => document.fonts.ready);
}

async function expectClearOfHeader(target: Locator) {
  await expect(target).toBeInViewport();
  await expect
    .poll(() =>
      target.evaluate((element) => {
        const siteHeader = document.querySelector('.site-header');
        return element.getBoundingClientRect().top >= (siteHeader?.getBoundingClientRect().bottom ?? 0) - 1;
      }),
    )
    .toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== 'http://127.0.0.1:3000') return route.abort();
    if (url.pathname.startsWith('/api/')) {
      return route.fulfill({ status: 401, contentType: 'application/json', body: '{}' });
    }
    return route.continue();
  });
});

test('the home opening gives first-trip and photo-led destination discovery equal space', async ({ page }, info) => {
  await open(page, '/');
  const starting = page.getByRole('navigation', { name: 'Start exploring Korea', exact: true });
  const plan = starting.getByRole('link', { name: 'Plan your first trip', exact: true });
  const explore = starting.getByRole('link', { name: 'Explore destinations', exact: true });
  await expect(plan).toBeInViewport({ ratio: 1 });
  await expect(explore).toBeInViewport({ ratio: 1 });
  await expect(plan).toHaveAttribute('href', firstTrip);
  await expect(explore).toHaveAttribute('href', '#explore-destinations');
  const dimensions = await starting.getByRole('link').evaluateAll((links) =>
    links.map((link) => {
      const { width, height } = link.getBoundingClientRect();
      return { width, height, fontSize: getComputedStyle(link).fontSize };
    }),
  );
  const [planSize, exploreSize] = dimensions;
  expect(dimensions).toHaveLength(2);
  expect(planSize.height).toBeGreaterThanOrEqual(44);
  expect(exploreSize.height).toBeGreaterThanOrEqual(44);
  expect(Math.abs(planSize.width - exploreSize.width)).toBeLessThanOrEqual(1);
  expect(planSize.fontSize).toBe(exploreSize.fontSize);
  expect(
    await starting.getByRole('link').evaluateAll((links) =>
      links.every((link) => {
        const icon = link.querySelector('svg')?.getBoundingClientRect();
        const hitArea = link.getBoundingClientRect();
        return !icon?.width || (icon.left >= hitArea.left && icon.right <= hitArea.right);
      }),
    ),
  ).toBe(true);
  await page.screenshot({ path: info.outputPath('home-opening.jpg'), type: 'jpeg', quality: 85 });

  await plan.press('Enter');
  await expect(page).toHaveURL(new URL(firstTrip, page.url()).href);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your First Korea Trip');
  await page.goBack();
  await expect(page).toHaveURL('http://127.0.0.1:3000/');
  await expect(starting).toBeVisible();

  await explore.press('Enter');
  const title = page.getByRole('heading', { name: 'Explore destinations', exact: true });
  await expect(page).toHaveURL(/\/#explore-destinations$/);
  await expect(title).toBeFocused();
  await expectClearOfHeader(title);
  const section = title.locator('xpath=ancestor::section[1]');
  const originalPhotos = new Set<string>();
  for (const [name, slug] of [
    ['Seoul', 'seoul'],
    ['Busan', 'busan'],
    ['Gyeongju', 'gyeongju'],
    ['Jeju', 'jeju'],
    ['Jeonju', 'jeonju'],
    ['Sokcho', 'sokcho'],
    ['Suwon', 'suwon'],
    ['Tongyeong', 'tongyeong'],
  ]) {
    const link = section.locator(`.home-destination-card[href="/destinations/${slug}"]`);
    await expect(link).toHaveAccessibleName(new RegExp(`\\b${name}\\b`, 'i'));
    const img = link.locator('img');
    await expect(img).toHaveCount(1);
    await img.scrollIntoViewIfNeeded();
    const photo = await img.evaluate(async (node: HTMLImageElement) => {
      await node.decode();
      return { source: node.currentSrc, width: node.width, height: node.height };
    });
    expect(photo.width * photo.height).toBeGreaterThan(0);
    originalPhotos.add(photo.source);
  }
  expect(originalPhotos.size).toBe(8);
  const all = section.getByRole('link', { name: /^All \d+ destinations$/ });
  await expect(all).toHaveAttribute('href', '/destinations');
  const destinationCount = Number((await all.innerText()).match(/\d+/)?.[0]);
  await title.evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.screenshot({ path: info.outputPath('home-destinations.jpg'), type: 'jpeg', quality: 85 });

  const credits = section.getByText('Photo credits', { exact: true });
  const creditLinks = credits.locator('xpath=ancestor::details[1]').getByRole('link');
  await credits.press('Enter');
  await expect(creditLinks).toHaveCount(8);
  for (const link of await creditLinks.all()) {
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /^\/image-credits#[a-z0-9-]+$/);
  }
  await page.screenshot({ path: info.outputPath('home-photo-credits.jpg'), type: 'jpeg', quality: 85 });
  await credits.press('Enter');
  await expect(creditLinks).toHaveCount(0);

  const reads = page.getByRole('region', { name: 'Your first useful reads' });
  const guideLinks = reads.locator('.guide-card');
  await expect(guideLinks).toHaveCount(6);
  for (const link of await guideLinks.all()) {
    await expect(link).toHaveAttribute('href', /^\/blog\/[a-z0-9-]+$/);
    const img = link.locator('img');
    await expect(img).toHaveAttribute('loading', 'lazy');
    await img.scrollIntoViewIfNeeded();
    const source = await img.evaluate(async (node: HTMLImageElement) => {
      await node.decode();
      return node.currentSrc;
    });
    originalPhotos.add(source);
  }
  expect(originalPhotos.size).toBe(14);
  const guideCredits = reads.getByText('Guide photo credits', { exact: true });
  await guideCredits.press('Enter');
  await expect(guideCredits.locator('xpath=ancestor::details[1]').getByRole('link')).toHaveCount(6);
  await guideCredits.press('Enter');
  await reads.getByRole('heading', { level: 2 }).evaluate((element) => {
    element.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  await page.screenshot({ path: info.outputPath('home-guide-picks.jpg'), type: 'jpeg', quality: 85 });
  await page.evaluate(() => window.scrollTo(0, 0));

  const { violations } = await new AxeBuilder({ page })
    .include('main')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    (page.viewportSize()?.width ?? 0) + 1,
  );

  await section.getByRole('link', { name: /\bBusan\b/i }).click();
  await expect(page).toHaveURL(/\/destinations\/busan$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Busan');
  await page.goBack();
  await expect(page).toHaveURL(/\/#explore-destinations$/);
  await expect(title).toBeVisible();
  await all.click();
  await expect(page).toHaveURL(/\/destinations$/);
  await expect(page.locator('.destination-area .guide-card')).toHaveCount(destinationCount);
});

test('a guide search arrival can reach the local hub from the quick-answer anchor', async ({ page }, info) => {
  await open(page, regionalGuide);
  const quick = page.getByRole('region', { name: 'Your quick answer', exact: true });
  const jump = quick.getByRole('link', { name: /^Find your next stop/ });
  await expect(jump).toHaveAttribute('href', '#guide-planning-links');
  await jump.press('Enter');
  const nav = guideNavigation(page);
  await expect(page).toHaveURL(/#guide-planning-links$/);
  await expect(nav).toBeFocused();
  await expectClearOfHeader(nav.getByRole('heading', { name: 'Continue planning', exact: true }));
  const links = nav.getByRole('link');
  await expect(links).toHaveCount(3);
  await expect(links.nth(0)).toHaveAttribute('href', '/destinations/gwangju');
  await expect(links.nth(1)).toHaveAttribute('href', firstTrip);
  await expect(links.nth(2)).toHaveAttribute('href', '/destinations');
  const { violations } = await new AxeBuilder({ page })
    .include('#guide-planning-links')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(violations).toEqual([]);
  await page.screenshot({ path: info.outputPath('regional-guide-onward.jpg'), type: 'jpeg', quality: 85 });
  await links.first().press('Enter');
  await expect(page).toHaveURL(/\/destinations\/gwangju$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Gwangju');
  await page.goBack();
  await expect(page).toHaveURL(new URL(`${regionalGuide}#guide-planning-links`, page.url()).href);
  await expect(nav).toBeVisible();
});

for (const [name, guide, hrefs] of [
  ['nationwide article', nationalGuide, [firstTrip, '/destinations']],
  ['first-trip article', firstTrip, ['/destinations', '/blog/category/plan-your-trip', '/destinations/seoul']],
  ['archive article', archiveGuide, [firstTrip, '/destinations']],
] as const) {
  test(`${name} offers useful paths without a self-link`, async ({ page }, info) => {
    await open(page, guide);
    await page.getByRole('link', { name: /^Find your next stop/ }).press('Enter');
    const nav = guideNavigation(page);
    await expect(nav).toBeFocused();
    await expectClearOfHeader(nav.getByRole('heading', { name: 'Continue planning', exact: true }));
    const links = await nav.getByRole('link').evaluateAll((items) =>
      items.map((link) => link.getAttribute('href')),
    );
    expect(links).toEqual(hrefs);
    for (const href of hrefs) {
      await nav.locator(`a[href="${href}"]`).click();
      await expect(page).toHaveURL(new URL(href, page.url()).href);
      await page.goBack();
      await expect(page).toHaveURL(new URL(`${guide}#guide-planning-links`, page.url()).href);
      await expect(nav).toBeVisible();
    }
    await nav.scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath('guide-onward.jpg'), type: 'jpeg', quality: 85 });
  });
}

test('the featured photograph leads to a real evening route and directions', async ({ page }, info) => {
  await open(page, '/');
  await expect(page.getByRole('heading', { name: 'Find your Korea.', exact: true })).toBeVisible();
  await expect(page.locator('.magazine-feature img')).toBeInViewport();
  await page.locator('.magazine-feature img').evaluate(async (image: HTMLImageElement) => image.decode());
  await page.screenshot({ path: info.outputPath('magazine-home.jpg'), type: 'jpeg', quality: 85 });

  await page.getByRole('link', { name: /Make an evening of Gyeongju/ }).click();
  await expect(page).toHaveURL(/\/destinations\/gyeongju$/);
  await expect(page.getByRole('link', { name: 'Getting here', exact: true }))
    .toHaveAttribute('href', '/blog/gyeongju-ktx-to-hwangnidan');
  await page.getByRole('link', { name: 'Plan your visit', exact: true }).press('Enter');
  await expect(page.locator('#plan-your-visit')).toBeFocused();
  await page.locator('a[href="/blog/gyeongju-donggung-wolji-woljeonggyo-evening-walk"]').first().click();
  await expect(page).toHaveURL(/\/blog\/gyeongju-donggung-wolji-woljeonggyo-evening-walk$/);
  await expect(page.locator('#quick-answer')).toBeVisible();
  const nearPhoto = page.getByRole('region', { name: 'Addresses and directions', exact: true });
  await expect(nearPhoto.getByRole('link', { name: /Naver Map/ })).toHaveCount(2);
  await nearPhoto.getByRole('link', { name: 'Open map & all stops', exact: true }).press('Enter');
  await expect(page.locator('#places-and-map')).toBeFocused();
  await expectClearOfHeader(page.locator('#places-and-map h2'));
});
