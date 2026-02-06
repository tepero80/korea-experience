const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function readPosts(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const data = matter(fs.readFileSync(path.join(dir, f), 'utf8')).data;
      return {
        slug: f.replace('.md', ''),
        date: data.date,
        category: data.category,
        deepDive: !!data.deepDive
      };
    });
}

const all = [
  ...readPosts('content/posts'),
  ...readPosts('content/deep-dive')
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

console.log(`Total: ${all.length} posts (DD: ${all.filter(x=>x.deepDive).length}, RG: ${all.filter(x=>!x.deepDive).length})\n`);

// Simulate getRelatedPosts (guaranteed chain)
function getRelatedPosts(currentSlug, limit = 6) {
  const cur = all.find(p => p.slug === currentSlug);
  if (!cur) return [];

  // Same category sorted by date (INCLUDING current for index)
  const sameCatSorted = all
    .filter(p => p.category === cur.category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentIdx = sameCatSorted.findIndex(p => p.slug === currentSlug);
  const result = [];
  const used = new Set([currentSlug]);

  // 1) Immediate prev & next — guaranteed
  if (currentIdx > 0) {
    result.push(sameCatSorted[currentIdx - 1]);
    used.add(sameCatSorted[currentIdx - 1].slug);
  }
  if (currentIdx < sameCatSorted.length - 1) {
    result.push(sameCatSorted[currentIdx + 1]);
    used.add(sameCatSorted[currentIdx + 1].slug);
  }

  // 2) Expand outward
  let offset = 2;
  while (result.length < limit && offset < sameCatSorted.length) {
    if (currentIdx - offset >= 0) {
      const p = sameCatSorted[currentIdx - offset];
      if (!used.has(p.slug)) { result.push(p); used.add(p.slug); }
    }
    if (result.length < limit && currentIdx + offset < sameCatSorted.length) {
      const p = sameCatSorted[currentIdx + offset];
      if (!used.has(p.slug)) { result.push(p); used.add(p.slug); }
    }
    offset++;
  }

  // 3) Other categories fallback
  if (result.length < limit) {
    const curDate = new Date(cur.date).getTime();
    const others = all
      .filter(p => !used.has(p.slug) && p.category !== cur.category)
      .sort((a, b) =>
        Math.abs(new Date(a.date).getTime() - curDate) -
        Math.abs(new Date(b.date).getTime() - curDate)
      )
      .slice(0, limit - result.length);
    result.push(...others);
  }
  return result.slice(0, limit);
}

// --- Test 1: Specific posts ---
const tests = [
  'best-korean-lip-tints-and-lipsticks-2026',
  'acne-scar-treatment-korea-best-options',
  '50-must-try-korean-foods-complete-guide-2026',
  'olive-young-must-buys-2026',
];

tests.forEach(slug => {
  const post = all.find(p => p.slug === slug);
  if (!post) return;
  const res = getRelatedPosts(slug, 6);
  console.log(`=== "${slug}" (${post.category}, ${post.deepDive ? 'DD' : 'RG'}) ===`);
  res.forEach((p, i) => {
    console.log(`  ${i+1}. ${String(p.date).slice(0,10)} ${p.deepDive ? 'DD' : 'RG'} [${p.category}] ${p.slug}`);
  });
  console.log(`  -> DD: ${res.filter(x=>x.deepDive).length}, RG: ${res.filter(x=>!x.deepDive).length}\n`);
});

// --- Test 2: Chain coverage ---
console.log('=== CHAIN COVERAGE TEST ===');
const linked = new Set();
all.forEach(post => {
  const related = getRelatedPosts(post.slug, 6);
  related.forEach(r => linked.add(r.slug));
});
const orphans = all.filter(p => !linked.has(p.slug));
console.log(`Linked (appear in at least one RelatedPosts): ${linked.size} / ${all.length}`);
console.log(`Orphans (never recommended anywhere): ${orphans.length}`);
if (orphans.length > 0) {
  // Group by category
  const byCat = {};
  orphans.forEach(p => { byCat[p.category] = byCat[p.category] || []; byCat[p.category].push(p); });
  Object.entries(byCat).forEach(([cat, posts]) => {
    const catTotal = all.filter(p => p.category === cat).length;
    console.log(`\n  [${cat}] ${posts.length} orphans / ${catTotal} total in category:`);
    posts.forEach(p => console.log(`    - ${p.slug} (${String(p.date).slice(0,10)}, ${p.deepDive?'DD':'RG'})`));
  });
}
