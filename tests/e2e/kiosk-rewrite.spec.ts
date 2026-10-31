import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const path = '/blog/foreign-friendly-kiosk-survival-guide-what-to-do-when-your-overseas-credit-card-is-rejected';
const legacyAnchors = [
  'understanding-koreas-kiosk-culture-the-rise-of-self-service', 'why-kiosks-are-king-in-korea',
  'decoding-your-card-rejection-common-culprits-and-solutions', '1-international-card-compatibility-issues',
  '2-the-silent-killer-3d-secure-verification', '3-card-network-limitations',
  '4-merchant-specific-policies-or-terminal-configurations', '5-insufficient-funds-or-dailytransaction-limits',
  '6-magnetic-strip-vs-chip-problems', 'on-the-spot-solutions-when-your-card-fails', '1-the-try-again-method',
  '2-switch-to-a-different-card', '3-change-the-kiosk-language-to-english-or-your-preferred-language',
  '4-seek-human-assistance', 'the-korean-cash-lifeline-atms-and-currency-exchange',
  '1-the-importance-of-carrying-korean-won', '2-finding-foreign-friendly-atms-global-atms',
  '3-atm-withdrawal-process-fees-and-limits', '4-currency-exchange-services',
  'embracing-mobile-payments-koreas-digital-edge', '1-kakao-pay--naver-pay-the-dominant-duo', '2-zero-pay',
  '3-apple-pay--google-pay', '4-prepaid--debit-cards-for-travelers', '5-t-money-card-with-payment-functionality',
  'proactive-preparation-before-you-go', '1-notify-your-banks-of-your-travel-plans',
  '2-carry-multiple-payment-methods', '3-download-essential-apps-and-set-up-vpn',
  '4-always-carry-emergency-cash', 'conclusion-mastering-payments-in-the-land-of-morning-calm',
];

test('a traveler can read, save and share the kiosk recovery guide', async ({ page, context }, testInfo) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.route('**/api/**', route => route.fulfill({ status: 401, json: {} }));
  await page.goto(path);
  await expect(page.getByRole('heading', { name: 'Korean Kiosks: What to Do When Your Card Is Declined', level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const hero = page.locator('main img').first();
  await hero.evaluate(async (image: HTMLImageElement) => { await image.decode(); });
  await page.screenshot({ path: testInfo.outputPath('kiosk-top.png') });
  const photo = page.getByAltText(/self-order kiosks/i);
  await photo.scrollIntoViewIfNeeded();
  await photo.evaluate(async (image: HTMLImageElement) => { await image.decode(); });
  await expect(page.getByText(/photo does not establish/i)).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('kiosk-photo.png') });
  await expect(page.getByRole('link', { name: /International Cards at Climate Card/i })).toHaveAttribute('href', /english\.seoul\.go\.kr/);
  await expect(page.getByRole('link', { name: /International Visitors.*Public Transportation/i })).toHaveAttribute('href', /english\.visitkorea\.or\.kr/);
  await expect(page.getByText(/private editor notes|image note for editorial review/i)).toHaveCount(0);
  await expect(page.locator('[id="the-state-of-accessibility-in-seoul-2026-update"]')).toHaveCount(0);
  for (const id of legacyAnchors) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  await expect(page.locator('[id="the-silent-killer-3d-secure-verification"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Save guide' }).click();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Copy summary' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Korean Kiosks: What to Do When Your Card Is Declined');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(overflow).toBe(false);
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(scan.violations).toEqual([]);
});
