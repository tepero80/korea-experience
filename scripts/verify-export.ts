import fs from 'node:fs';
import { getLaunchGuides } from '../lib/posts';
const errors: string[] = [];
for (const p of getLaunchGuides()) {
  const file = `out/blog/${p.slug}.html`;
  if (!fs.existsSync(file)) {
    errors.push('Missing exported article ' + p.slug);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  if ((html.match(/<h1\b/g) || []).length !== 1) errors.push('Expected one H1 ' + p.slug);
  if (!html.includes(`rel="canonical" href="https://koreaexperience.com/blog/${p.slug}"`))
    errors.push('Canonical mismatch ' + p.slug);
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      errors.push('Invalid JSON-LD ' + p.slug);
    }
  }
  if (!html.includes('Official sources &amp; checks'))
    errors.push('Source section missing ' + p.slug);
  if (!html.includes('image-credits') && !html.includes('license'))
    errors.push('Photo provenance missing ' + p.slug);
  if (!fs.existsSync(`out/images/cards/${p.slug}.jpg`))
    errors.push('Missing preview image ' + p.slug);
  if (!fs.readFileSync('out/sitemap.xml', 'utf8').includes('/blog/' + p.slug + '</loc>'))
    errors.push('Missing sitemap entry ' + p.slug);
}
if (!fs.existsSync('out/404.html')) errors.push('No real 404 export');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  'Exported launch HTML, canonical, H1, structured data, sources, cards and sitemap checks passed.',
);
