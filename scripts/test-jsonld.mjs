// Quick test script: verify JSON-LD schemas on blog posts
const BASE = 'http://localhost:3003';

async function checkPost(slug, expectMedDisclaimer, expectFAQ) {
  const url = `${BASE}/blog/${slug}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`❌ ${slug} — HTTP ${res.status}`);
      return;
    }
    const html = await res.text();
    
    // Check BlogPosting
    const hasBlogPosting = html.includes('"BlogPosting"');
    const hasArticle = html.includes('"Article"');
    console.log(`\n=== ${slug} ===`);
    console.log(`  BlogPosting: ${hasBlogPosting ? '✅' : '❌'}`);
    if (hasArticle) console.log(`  ⚠️  Still has "Article" type!`);
    
    // Check FAQPage
    const hasFAQPage = html.includes('"FAQPage"');
    console.log(`  FAQPage JSON-LD: ${hasFAQPage ? '✅' : '—'} (expected: ${expectFAQ ? 'yes' : 'no'})`);
    
    // Check Medical Disclaimer
    const hasMedDisclaimer = html.includes('Medical Disclaimer');
    console.log(`  Medical Disclaimer: ${hasMedDisclaimer ? '✅ shown' : '— hidden'} (expected: ${expectMedDisclaimer ? 'shown' : 'hidden'})`);
    
    // Check microdata removal
    const hasMicrodata = html.includes('itemType="https://schema.org/FAQPage"');
    if (hasMicrodata) console.log(`  ⚠️  FAQAccordion still has microdata!`);
    
    // Validate
    const faqOk = expectFAQ ? hasFAQPage : true;
    const disclaimerOk = hasMedDisclaimer === expectMedDisclaimer;
    if (hasBlogPosting && !hasArticle && faqOk && disclaimerOk && !hasMicrodata) {
      console.log(`  → ALL CHECKS PASSED ✅`);
    } else {
      console.log(`  → SOME CHECKS FAILED ❌`);
    }
  } catch (e) {
    console.log(`❌ ${slug} — ${e.message}`);
  }
}

async function main() {
  console.log('Testing Phase 2 changes...\n');
  
  // 1. Medical Tourism + FAQ post
  await checkPost('medical-tourism-visa-c33-2026', true, true);
  
  // 2. Non-medical post with FAQ
  await checkPost('24-hours-in-seongsu-dong-luxury-dior-pop-up-vs-5-market-food-a-dualism-route', false, false);
  
  // 3. Regular post without FAQ  
  await checkPost('best-korean-bbq-restaurants-in-seoul-2026', false, false);
  
  // 4. Another medical tourism post
  await checkPost('acne-scar-treatment-korea-best-options', true, false);
  
  console.log('\n--- Done ---');
}

main();
