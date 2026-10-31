import {expect,test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const path='/blog/gluten-free-dining-in-korea-celiac-safe-options';
const oldAnchors=['the-hidden-dangers-why-korea-is-tricky-for-celiacs','the-jang-trinity','seouls-safest-bets-dedicated-gluten-free--friendly-restaurants','1-plant-itaewon--yeonnam-dong','2-sunny-bread-seongsu-dong','3-jyoti-indian-restaurant-sinchon','traditional-korean-food-what-is-safe','korean-bbq-the-safest-social-option','bibimbap-the-customizable-bowl','soup-dishes-proceed-with-caution','essential-survival-tools-for-2026','the-allergy-card','convenience-stores-the-247-lifesaver','beyond-seoul-busan-and-jeju','busan','jeju-island','comparison-dining-out-vs-self-catering','timeline-your-first-day-in-seoul-as-a-celiac','frequently-asked-questions'];
test('celiac guide avoids certifying food and supports planning',async({page,context},testInfo)=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.route('**/api/**',route=>route.fulfill({status:401,json:{}}));await page.goto(path);
 await expect(page.getByRole('heading',{name:'Celiac Disease and Gluten-Free Dining in Korea: A Planning Guide',level:1})).toBeVisible();
 await page.evaluate(()=>document.fonts.ready);await page.locator('main img').first().evaluate(async (img:HTMLImageElement)=>img.decode());await page.screenshot({path:testInfo.outputPath('celiac-top.png')});
 for(const id of oldAnchors)await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
 await expect(page.getByText(/this guide cannot certify any restaurant or dish as safe/i)).toBeVisible();
 await expect(page.getByRole('link',{name:/Korea Ministry of Food and Drug Safety/}).first()).toHaveAttribute('href',/mfds\.go\.kr/);
 await expect(page.getByText(/Ji-min Kim|85% of restaurant|Plant Wholefood Kitchen/i)).toHaveCount(0);
 await page.getByRole('button',{name:'Save guide'}).click();await expect(page.getByRole('button',{name:'Saved',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Copy summary'}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('Celiac Disease and Gluten-Free Dining');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
 const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();expect(scan.violations).toEqual([]);
});
