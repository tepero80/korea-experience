import fs from 'node:fs';
import { getLaunchGuides } from '../lib/posts';
import { TOOL_PREVIEWS, toolPreviewImage } from '../lib/tool-preview';
import { parse, type DefaultTreeAdapterTypes as Tree } from 'parse5';
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
for (const tool of TOOL_PREVIEWS) {
  const file = `out${tool.href}.html`;
  if (!fs.existsSync(file)) {
    errors.push('Missing exported tool ' + tool.slug);
    continue;
  }
  const tags = new Map<string, string>();
  const visit = (node: Tree.Node) => {
    if ('tagName' in node) {
      const attrs = Object.fromEntries(node.attrs.map((a) => [a.name, a.value]));
      if (node.tagName === 'meta') tags.set(attrs.property || attrs.name, attrs.content);
      if (node.tagName === 'link' && attrs.rel === 'canonical') tags.set('canonical', attrs.href);
    }
    if ('childNodes' in node) for (const child of node.childNodes) visit(child);
  };
  visit(parse(fs.readFileSync(file, 'utf8')));
  const canonical = 'https://koreaexperience.com' + tool.href;
  for (const key of ['canonical', 'og:url'])
    if (tags.get(key) !== canonical) errors.push(key + ' mismatch ' + tool.slug);
  for (const key of ['og:title', 'twitter:title'])
    if (tags.get(key) !== tool.title) errors.push(key + ' mismatch ' + tool.slug);
  for (const key of ['og:description', 'twitter:description'])
    if (tags.get(key) !== tool.description) errors.push(key + ' mismatch ' + tool.slug);
  for (const key of ['og:image', 'twitter:image'])
    if (tags.get(key) !== 'https://koreaexperience.com' + toolPreviewImage(tool))
      errors.push(key + ' mismatch ' + tool.slug);
  if (!fs.existsSync('out' + toolPreviewImage(tool)))
    errors.push('Missing exported tool image ' + tool.slug);
}
if (!fs.existsSync('out/404.html')) errors.push('No real 404 export');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  'Exported guide HTML and tool OG/Twitter identity, canonical, sources, cards and sitemap checks passed.',
);
