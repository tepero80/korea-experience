import fs from 'node:fs';
import { getAllPosts } from '../lib/posts';
import { ALL_TOOLS, SITE_CONFIG } from '../lib/constants';
import { RETIREMENTS } from '../lib/editorial';
import { guidePreviewImage } from '../lib/seo';
import legacy from '../data/legacy-og-slugs.json';
const posts = getAllPosts();
const redirects = posts
  .filter((p) => legacy.includes(p.slug))
  .map(
    (p) =>
      `/blog/${p.slug}/opengraph-image ${guidePreviewImage(p)} 301`,
  );
for (const t of ALL_TOOLS)
  redirects.push(`${t.href}/opengraph-image /images/cards/korea-experience.jpg 301`);
for (const r of RETIREMENTS)
  if (r.action === 'redirect' && r.target) redirects.push(`/blog/${r.slug} /blog/${r.target} 301`);

// Older addresses found in Google's crawl report with an equivalent public guide.
const guideAliases = [
  ['national-museum-korea-childrens-museum', 'national-museum-korea-childrens-museum-reservation'],
  ['national-museum-korea-children', 'national-museum-korea-childrens-museum-reservation'],
  ['winter-ski-resorts-comparison-viv', 'winter-ski-resorts-comparison-vivaldi-park-vs-yongpyong-vs-alpensia-2026'],
  ['winter-ski-resorts-comparison-vivaldi-park-vs-yongpong-vs-alpensia-2026', 'winter-ski-resorts-comparison-vivaldi-park-vs-yongpyong-vs-alpensia-2026'],
  ['1330-for-medical-translation-2026', 'medical-emergencies-1330-vs-119-2026'],
  ['luxury-resale-market-korea', 'luxury-resale-market-in-korea-shopping-for-pre-loved-designer-bags-2026'],
];
const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
const retiredSlugs = new Set(RETIREMENTS.map((retirement) => retirement.slug));
for (const [from, to] of guideAliases) {
  if (postsBySlug.has(from) || retiredSlugs.has(from) || !postsBySlug.get(to)?.indexable)
    throw Error(`Invalid legacy guide alias: ${from} -> ${to}`);
  redirects.push(`/blog/${from} /blog/${to} 301`, `/blog/${from}/ /blog/${to} 301`);
}

const assetAliases = [
  ['/logo.png', SITE_CONFIG.logo],
  ['/og-image.jpg', '/images/cards/korea-experience.jpg'],
];
for (const [from, to] of assetAliases) {
  if (fs.existsSync('public' + from) || !fs.statSync('public' + to, { throwIfNoEntry: false })?.isFile())
    throw Error(`Invalid legacy asset alias: ${from} -> ${to}`);
  redirects.push(`${from} ${to} 301`);
}

if (redirects.length > 2000) throw Error('Review Cloudflare redirect budget.');
fs.writeFileSync('public/_redirects', [...new Set(redirects)].join('\n') + '\n');
console.log(`Legacy guide, image and retirement redirect rules: ${redirects.length}.`);
