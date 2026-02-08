const fs = require('fs');
const path = require('path');

const titleFixes = {
  // Deep Dive
  'content/deep-dive/dmz-visit-guide-2026.md': 'DMZ Visit Guide 2026: Tours, Tips & What to Expect',
  'content/deep-dive/korean-bowing-etiquette-2026.md': 'Korean Bowing Etiquette: When and How Deep to Bow in 2026',
  'content/deep-dive/order-baemin-without-arc-2026.md': 'How to Order on Baemin Without an ARC in Korea (2026)',
  'content/deep-dive/why-google-maps-doesnt-work-in-korea.md': "Why Google Maps Doesn't Work in Korea (And What to Use)",
  'content/deep-dive/korean-drinking-etiquette-2026.md': 'Korean Drinking Etiquette 2026: Rules Every Visitor Should Know',
  'content/deep-dive/namane-vs-wowpass-guide-2026.md': 'Namane vs. Wowpass 2026: Which Korea Travel Card Is Better?',
  'content/deep-dive/seoul-transit-climate-card-vs-tmoney-2026.md': 'Climate Card vs. T-Money 2026: Best Seoul Transit Card Compared',
  'content/deep-dive/vat-tax-refund-plastic-surgery-2026.md': 'VAT Tax Refund on Plastic Surgery in Korea: 2026 Guide',
  'content/deep-dive/catchtable-global-michelin-reservation-guide-2026.md': 'CatchTable Global: Book Michelin Restaurants in Korea (2026)',
  'content/deep-dive/kiosk-card-rejection-guide-2026.md': "Foreign Card Rejected at Korean Kiosks? Here's How to Fix It",
  'content/deep-dive/korea-recycling-bunrisugeo-guide-2026.md': "How to Recycle in Korea 2026: A Foreigner's Bunrisugeo Guide",
  'content/deep-dive/exosome-therapy-seoul-guide-2026.md': 'Exosome Therapy in Seoul 2026: Clinics, Costs & What to Know',
  'content/deep-dive/smile-pro-vs-lasik-seoul-2026.md': 'SMILE Pro vs. LASIK in Seoul 2026: Cost, Recovery & Results',
  'content/deep-dive/solo-travel-safety-index-2026.md': 'Is Korea Safe for Solo Travelers? 2026 Safety Index',
  'content/deep-dive/tax-refund-instant-vs-airport-2026.md': 'South Korea Tourist Tax Refund 2026: Instant vs. Airport',
  'content/deep-dive/incheon-airport-survival-guide-2026.md': 'Incheon Airport Survival Guide 2026: Tips for First-Time Arrivals',
  'content/deep-dive/korea-cherry-blossom-forecast-2026.md': '2026 Korea Cherry Blossom Forecast: Peak Bloom Dates & Best Spots',
  'content/deep-dive/korea-social-rules-local-guide-2026.md': 'Unwritten Social Rules in South Korea: A 2026 Expat Guide',
  'content/deep-dive/olive-young-must-buys-2026.md': 'The Ultimate 2026 Olive Young Must-Buys Guide for Tourists',
  'content/deep-dive/ordering-food-traditional-markets-papago-2026.md': 'Ordering Food at Korean Traditional Markets Using Papago (2026)',
  'content/deep-dive/seoul-street-food-prices-2026.md': 'Seoul Street Food Prices 2026: What Everything Costs',
  'content/deep-dive/halal-dining-itaewon-2026.md': "Halal-Certified Dining in Itaewon 2026: A Muslim Visitor's Guide",
  'content/deep-dive/personal-color-analysis-hongdae-2026.md': 'Personal Color Analysis in Hongdae 2026: Where to Get Tested',
  // AI Posts
  'content/posts/customized-skincare-getting-a-professional-skin-analysis-in-seoul-2026.md': 'Professional Skin Analysis in Seoul 2026: Customized Skincare Guide',
  'content/posts/foreign-friendly-kiosk-survival-guide-what-to-do-when-your-overseas-credit-card-is-rejected.md': 'Korean Kiosk Survival Guide: What to Do When Your Foreign Card Fails',
  'content/posts/dental-veneers-porcelain-vs-composite-resin.md': 'Dental Veneers in Korea: Porcelain vs. Composite Resin Compared',
  'content/posts/korean-orthodontics-guide-invisalign-vs-local-clear-aligner-costs-2026.md': 'Korean Orthodontics 2026: Invisalign vs. Local Clear Aligner Costs',
  'content/posts/pharmacy-essentials-pain-relief-and-wound-care-products.md': 'Korea Pharmacy Essentials: Pain Relief & Wound Care for Tourists',
  'content/posts/dealing-with-complications-who-to-contact-in-emergencies.md': 'Medical Complications in Korea: Emergency Contacts & What to Do',
  'content/posts/korean-beauty-store-comparison-olive-young-vs-lalavla.md': 'Korean Beauty Store Comparison: Olive Young vs. Lalavla',
  'content/posts/reading-korean-medical-reviews-naver-blog-vs-real-patient-experiences.md': 'Korean Medical Reviews: Naver Blog vs. Real Patient Experiences',
  'content/posts/the-truth-about-shadow-doctors-how-to-ensure-your-surgeon-is-real-2026.md': 'Shadow Doctors in Korea: How to Ensure Your Surgeon Is Real (2026)',
  'content/posts/senior-medical-tourism-joint-replacement-and-cataract-surgery.md': 'Senior Medical Tourism in Korea: Joint Replacement & Cataract Surgery',
  'content/posts/korean-skincare-clinic-vs-hospital-where-should-you-go-for-botox-2026.md': 'Korean Clinic vs. Hospital: Where to Get Botox in Seoul (2026)',
  'content/posts/scalp-micropigmentation-smp-in-korea-best-clinics-for-hair-density-2026.md': 'Scalp Micropigmentation (SMP) in Korea 2026: Best Clinics & Costs',
  'content/posts/korea-plastic-surgery-cost-guide-2026.md': 'Korea Plastic Surgery Cost Guide 2026: Procedures & Price Ranges',
  'content/posts/acne-scar-treatment-korea-best-options.md': 'Acne Scar Treatment in Korea: Best Options and Clinic Guide',
  'content/posts/korean-clothing-sizes-conversion-chart.md': "Korean Clothing Sizes Conversion Chart: A Foreigner's Guide",
};

let fixed = 0;
let errors = [];

for (const [relPath, newTitle] of Object.entries(titleFixes)) {
  const filePath = path.join(process.cwd(), relPath);
  
  if (newTitle.length > 70) {
    errors.push(`OVER 70: "${newTitle}" (${newTitle.length} chars) in ${relPath}`);
    continue;
  }
  
  if (!fs.existsSync(filePath)) {
    errors.push(`FILE NOT FOUND: ${relPath}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const normalizedForParse = content.replace(/\r\n/g, '\n');
  const fmMatch = normalizedForParse.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    errors.push(`NO FRONTMATTER: ${relPath}`);
    continue;
  }
  
  const fm = fmMatch[1];
  const titleMatch = fm.match(/title:\s*"([^"]+)"/);
  if (!titleMatch) {
    errors.push(`NO TITLE: ${relPath}`);
    continue;
  }
  
  const oldTitle = titleMatch[1];
  content = content.replace(`title: "${oldTitle}"`, `title: "${newTitle}"`);
  fs.writeFileSync(filePath, content, 'utf8');
  fixed++;
  console.log(`✓ ${oldTitle.length} -> ${newTitle.length} | ${path.basename(relPath)}`);
  console.log(`  "${oldTitle}" → "${newTitle}"`);
}

console.log(`\n=== DONE: ${fixed} titles rewritten ===`);
if (errors.length > 0) {
  console.log(`\nERRORS:`);
  errors.forEach(e => console.log(`  ${e}`));
}
