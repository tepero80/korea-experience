import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const slugs = ['seoul-guide-for-deaf-and-hard-of-hearing-travelers-2026','incheon-airport-baggage-delivery-for-reduced-mobility-travelers','bringing-personal-medication-into-korea-traveler-guide','jeju-muslim-friendly-dining-in-jeju-city','seoul-personal-shopper-galleria-concierge','seoul-lantern-festival-2026-planning-guide','jeongdongjin-2027-new-year-sunrise-festival-plan','seoul-public-wifi-for-travelers-setup-and-map','finding-seoul-outdoor-drinking-water-fountains-arisu-map','incheon-airport-baby-care-room-locations','korea-grand-sale-2026','seoul-in-winter-complete-guide-ice-skating-and-more-2026'];
for (const slug of slugs) test(`${slug}: guide, links and controls`, async ({page,context},info)=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']); await page.route('**/api/**', route=>route.fulfill({status:401,json:{}}));
 const response=await page.goto('/blog/'+slug); expect(response?.status()).toBe(200); await page.evaluate(()=>document.fonts.ready); await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
 for (const img of await page.locator('main img').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(async (i:HTMLImageElement)=>{await i.decode()}); }
 await page.screenshot({path:info.outputPath('full.png'),fullPage:true});
 for(const link of await page.locator('main a[href^="#"]').all()){const href=await link.getAttribute('href');if(href && href.length>1)await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1)}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 const credit=page.locator('.photo-credit details').first(); await credit.locator('summary').click(); await expect(credit).toHaveAttribute('open',''); await credit.scrollIntoViewIfNeeded(); await page.screenshot({path:info.outputPath('credit-open.png')});
 await page.getByRole('button',{name:'Save guide'}).click();await expect(page.getByRole('button',{name:'Saved',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Share',exact:true}).first().click(); const shareAction = page.locator('.share-box button').first(); await shareAction.hover(); await expect(shareAction).toHaveCSS('background-color','rgb(7, 83, 79)'); await expect(shareAction).toHaveCSS('color','rgb(255, 255, 255)'); await page.screenshot({path:info.outputPath('share-open.png')}); await page.getByRole('button',{name:'Copy summary'}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('koreaexperience.com/blog/');
});



test('share copy failure offers a manual link', async ({page},info)=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw new Error('unavailable')}},configurable:true});});
 await page.goto('/blog/bringing-personal-medication-into-korea-traveler-guide');
 await page.getByRole('button',{name:'Copy summary'}).click();
 await expect(page.locator('.share-box').getByRole('status')).toContainText('Copy was unavailable');
 await expect(page.locator('.share-source-url')).toHaveAttribute('href',/koreaexperience\.com\/blog\//);
 await page.screenshot({path:info.outputPath('copy-error.png')});
});
