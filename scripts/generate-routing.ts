import fs from 'node:fs';
import { getAllPosts } from '../lib/posts';
import { ALL_TOOLS } from '../lib/constants';
import { RETIREMENTS } from '../lib/editorial';
import legacy from '../data/legacy-og-slugs.json';
const posts = getAllPosts();
const redirects = posts
  .filter((p) => legacy.includes(p.slug))
  .map(
    (p) =>
      `/blog/${p.slug}/opengraph-image ${p.reviewed ? '/images/cards/' + p.slug + '.jpg' : p.image || '/images/cards/korea-experience.jpg'} 301`,
  );
for (const t of ALL_TOOLS)
  redirects.push(`${t.href}/opengraph-image /images/cards/korea-experience.jpg 301`);
for (const r of RETIREMENTS)
  if (r.action === 'redirect' && r.target) redirects.push(`/blog/${r.slug} /blog/${r.target} 301`);
if (redirects.length > 2000) throw Error('Review Cloudflare redirect budget.');
fs.writeFileSync('public/_redirects', [...new Set(redirects)].join('\n') + '\n');
console.log(`Legacy image and retirement redirects: ${redirects.length}.`);
