import { GUIDES_PER_PAGE } from '@/components/site/GuideLibrary';
import { CATEGORY_HUBS, PRACTICAL_TOOLS, SITE_CONFIG } from '@/lib/constants';
import { mediaFor } from '@/lib/media';
import { getAllPosts } from '@/lib/posts';
import { getDestinations } from '@/lib/destinations';

export const dynamic = 'force-static';

function xmlText(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function GET() {
  const inventory = getAllPosts();
  const posts = inventory.filter((post) => post.indexable);
  const paths = [
    '/',
    '/blog',
    '/about',
    '/contact',
    '/editorial-policy',
    '/image-credits',
    '/tools',
    '/blog/category',
    ...CATEGORY_HUBS.map((category) => `/blog/category/${category.slug}`),
    ...PRACTICAL_TOOLS.map((tool) => tool.href),
    ...getDestinations().filter((region) => region.indexable)
      .map((region) => `/destinations/${region.id}`),
    '/destinations',
    ...Array.from(
      { length: Math.max(0, Math.ceil(inventory.length / GUIDES_PER_PAGE) - 1) },
      (_, i) => `/blog/page/${i + 2}`,
    ),
  ];
  const collections = paths.map(
    (path) => `<url><loc>${xmlText(SITE_CONFIG.url + path)}</loc></url>`,
  );
  const guides = posts.map((post) => {
    const canonical = SITE_CONFIG.url + '/blog/' + post.slug;
    // Legacy dates were redistributed and do not describe a verified page change.
    const updated = post.reviewed ? post.updated : undefined;
    const lastModified =
      updated ?? (post.publicationStatus === 'verified-release' ? post.date : undefined);
    const hero = mediaFor(post.editorial?.heroMediaId);
    const image =
      hero?.credit.kind === 'photograph' &&
      hero.src === post.image &&
      hero.src.startsWith('/images/')
        ? `<image:image><image:loc>${xmlText(SITE_CONFIG.url + hero.src)}</image:loc></image:image>`
        : '';
    return `<url><loc>${xmlText(canonical)}</loc>${lastModified ? `<lastmod>${lastModified}</lastmod>` : ''}${image}</url>`;
  });

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
    [...collections, ...guides].join('\n') +
    '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
