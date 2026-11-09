import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test("Traveler can use daegu-modern-history-museum-downtown-visit", async ({page,context}, info)=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.route('**/api/**', route=>route.fulfill({status:401,json:{}}));
 await page.goto("/blog/daegu-modern-history-museum-downtown-visit"); await page.evaluate(()=>document.fonts.ready);
 await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
 await expect(page.getByRole('link',{name:"Daegu Foundation for Culture and Arts visitor page",exact:true})).toHaveAttribute('href',new RegExp("dgfca\\.or\\.kr"));
 await page.locator('main img').first().evaluate(async (img:HTMLImageElement)=>img.decode());
 await page.screenshot({path:info.outputPath('top.png')});
 await page.getByRole('heading',{name:"Pick a day and get there",exact:true}).scrollIntoViewIfNeeded();
 await page.screenshot({path:info.outputPath('section.png')});
 for(const link of await page.locator('main a[href^="#"]').all()){const h=await link.getAttribute('href');if(h&&h.length>1)await expect(page.locator('[id="'+h.slice(1)+'"]')).toHaveCount(1);}
 await page.evaluate(()=>window.scrollTo(0,0));
 expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 const credit=page.locator('.photo-credit details').first();await credit.locator('summary').click();await expect(credit).toHaveAttribute('open','');
 await page.getByRole('button',{name:'Save guide'}).click();await expect(page.getByRole('button',{name:'Saved',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Share',exact:true}).first().click();await page.getByRole('button',{name:'Copy summary'}).click();expect((await page.evaluate(()=>navigator.clipboard.readText())).toLowerCase()).toContain("daegu");
});
