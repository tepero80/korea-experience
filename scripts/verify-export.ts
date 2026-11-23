import fs from 'node:fs';
import { CATEGORY_HUBS, SITE_CONFIG } from '../lib/constants';
import { getLaunchGuides } from '../lib/posts';
import { getDestinations } from '../lib/destinations';
import { mediaFor } from '../lib/media';
import { TOOL_PREVIEWS, toolPreviewImage } from '../lib/tool-preview';
import { parse, type DefaultTreeAdapterTypes as Tree } from 'parse5';
const errors: string[] = [];
const rssAlternate = 'rel="alternate" type="application/rss+xml" href="https://koreaexperience.com/feed"';
const sitemap = fs.readFileSync('out/sitemap.xml', 'utf8');

function exportedMetadata(html: string) {
  const tags = new Map<string, string>();
  const visit = (node: Tree.Node) => {
    if ('tagName' in node) {
      const attrs = Object.fromEntries(node.attrs.map((a) => [a.name, a.value]));
      if (node.tagName === 'meta') tags.set(attrs.property || attrs.name, attrs.content);
      if (node.tagName === 'link' && attrs.rel === 'canonical') tags.set('canonical', attrs.href);
      if (node.tagName === 'title') {
        tags.set(
          'title',
          node.childNodes.map((child) => ('value' in child ? child.value : '')).join(''),
        );
      }
    }
    if ('childNodes' in node) for (const child of node.childNodes) visit(child);
  };
  visit(parse(html));
  return tags;
}

for (const file of [
  'out/index.html',
  'out/blog.html',
  'out/blog/category.html',
  'out/blog/category/airports-transport.html',
  'out/blog/page/2.html',
]) {
  if (!fs.readFileSync(file, 'utf8').includes(rssAlternate)) {
    errors.push('RSS discovery missing from ' + file);
  }
}
if (!fs.readFileSync('out/_headers', 'utf8').includes('/feed\n  Content-Type: application/rss+xml')) {
  errors.push('RSS Content-Type missing from Pages headers');
}
for (const p of getLaunchGuides()) {
  const file = `out/blog/${p.slug}.html`;
  if (!fs.existsSync(file)) {
    errors.push('Missing exported article ' + p.slug);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes(rssAlternate)) errors.push('RSS discovery missing ' + p.slug);
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
  if (p.editorial?.heroOmissionReason && /class="article-cover[" ]/.test(html))
    errors.push('Withheld cover rendered ' + p.slug);
  if (!p.editorial?.heroOmissionReason && !html.includes('image-credits') && !html.includes('license'))
    errors.push('Photo provenance missing ' + p.slug);
  if (!fs.existsSync(`out/images/cards/${p.slug}.jpg`))
    errors.push('Missing preview image ' + p.slug);
  if (!sitemap.includes('/blog/' + p.slug + '</loc>'))
    errors.push('Missing sitemap entry ' + p.slug);
}
const directory = fs.readFileSync('out/destinations.html', 'utf8');
const directoryTags = exportedMetadata(directory);
const directoryUrl = SITE_CONFIG.url + '/destinations';
const directoryCard = '/images/cards/korea-travel-destinations.jpg';
if (directoryTags.get('canonical') !== directoryUrl || directoryTags.get('og:url') !== directoryUrl)
  errors.push('Destination directory canonical or share URL mismatch');
if (directoryTags.get('og:image') !== SITE_CONFIG.url + directoryCard ||
    directoryTags.get('twitter:image') !== SITE_CONFIG.url + directoryCard ||
    directoryTags.get('og:image:width') !== '1200' || directoryTags.get('og:image:height') !== '630' ||
    !fs.existsSync('out' + directoryCard))
  errors.push('Destination directory share card missing or incomplete');
for (const region of getDestinations()) {
  const path = '/destinations/' + region.id;
  const file = 'out' + path + '.html';
  if (!fs.existsSync(file)) {
    errors.push('Missing exported destination ' + path);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const tags = exportedMetadata(html);
  const photo = mediaFor(region.coverMediaId);
  if (!directory.includes(`href="${path}"`)) errors.push('Missing directory link ' + path);
  if (tags.get('canonical') !== SITE_CONFIG.url + path) errors.push('Destination canonical mismatch ' + path);
  if (tags.get('robots')?.startsWith('index,') !== region.indexable || sitemap.includes(path + '</loc>') !== region.indexable)
    errors.push('Destination visibility mismatch ' + path);
  if (!photo || photo.credit.kind !== 'photograph' || !fs.existsSync('out' + photo.src) || tags.get('og:image') !== SITE_CONFIG.url + photo.src)
    errors.push('Destination photo or share metadata missing ' + path);
  for (const { slug } of region.posts) {
    const guide = fs.readFileSync(`out/blog/${slug}.html`, 'utf8');
    if (!html.includes(`href="/blog/${slug}"`) || !guide.includes(`href="${path}"`))
      errors.push('Missing reciprocal destination link ' + path + ' / ' + slug);
  }
}
const numberingDir = 'out/blog/page';
const numberedPages = fs.existsSync(numberingDir)
  ? fs.readdirSync(numberingDir).filter((file) => /^\d+\.html$/.test(file))
  : [];
const guideCollections = [
  '/blog',
  '/blog/category',
  ...CATEGORY_HUBS.map(({ slug }) => '/blog/category/' + slug),
  ...numberedPages.map((file) => '/blog/page/' + file.slice(0, -5)),
];
for (const path of guideCollections) {
  const tags = exportedMetadata(fs.readFileSync(`out${path}.html`, 'utf8'));
  const canonical = SITE_CONFIG.url + path;
  for (const key of ['canonical', 'og:url']) {
    if (tags.get(key) !== canonical) errors.push(key + ' mismatch ' + path);
  }
  const title = tags.get('og:title');
  if (
    !title ||
    tags.get('title') !== `${title} | ${SITE_CONFIG.name}` ||
    tags.get('title')?.endsWith(` | ${SITE_CONFIG.name} | ${SITE_CONFIG.name}`) ||
    tags.get('twitter:title') !== title
  ) {
    errors.push('Collection title mismatch ' + path);
  }
  const description = tags.get('description');
  if (
    !description ||
    tags.get('og:description') !== description ||
    tags.get('twitter:description') !== description
  ) {
    errors.push('Collection description mismatch ' + path);
  }
}
for (const tool of TOOL_PREVIEWS) {
  const file = `out${tool.href}.html`;
  if (!fs.existsSync(file)) {
    errors.push('Missing exported tool ' + tool.slug);
    continue;
  }
  const tags = exportedMetadata(fs.readFileSync(file, 'utf8'));
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
  'Exported guide HTML, collection metadata, tool previews, sources, cards and sitemap checks passed.',
);
