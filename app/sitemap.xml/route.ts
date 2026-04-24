import { getAllPosts, getImageDimensions } from '@/lib/posts';
import { SITE_CONFIG, ALL_TOOLS, CATEGORY_HUBS } from '@/lib/constants';

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const dynamic = 'force-static';

// Featured Deep Dive slugs (displayed on homepage)
const FEATURED_DEEP_DIVE_SLUGS = [
  'exosome-therapy-seoul-guide-2026',
  'korea-cherry-blossom-forecast-2026',
  'catchtable-global-michelin-reservation-guide-2026',
  'korea-social-rules-local-guide-2026',
  'olive-young-must-buys-2026',
  'seoul-transit-climate-card-vs-tmoney-2026',
];

// Google Image Sitemap을 포함한 XML 직접 생성
export async function GET() {
  const posts = getAllPosts();
  const baseUrl = SITE_CONFIG.url;
  const SITE_LAST_UPDATED = '2025-06-20';

  const staticPages = [
    '',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/tools',
    '/blog/category',
  ];

  const toolPages = ALL_TOOLS
    .filter(tool => tool.status === 'active')
    .map(tool => tool.href);

  const categoryPages = CATEGORY_HUBS.map(cat => `/blog/category/${cat.slug}`);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Static pages
  for (const route of staticPages) {
    xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${SITE_LAST_UPDATED}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  }

  // Category pages
  for (const route of categoryPages) {
    xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${SITE_LAST_UPDATED}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
  }

  // Tool pages
  for (const route of toolPages) {
    xml += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${SITE_LAST_UPDATED}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  // Blog posts with image sitemap tags
  for (const post of posts) {
    let priority = '0.6';
    if (FEATURED_DEEP_DIVE_SLUGS.includes(post.slug)) {
      priority = '0.9';
    } else if (post.deepDive) {
      priority = '0.8';
    }

    const postDate = new Date(post.date).toISOString().split('T')[0];
    const dims = getImageDimensions(post.image);
    const imageUrl = post.image && dims
      ? `${baseUrl}${post.image}`
      : `${baseUrl}/blog/${post.slug}/opengraph-image`;
    const imageTitle = xmlEscape(post.title);
    const captionTag = post.excerpt
      ? `\n      <image:caption>${xmlEscape(post.excerpt)}</image:caption>`
      : '';

    xml += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${imageTitle}</image:title>${captionTag}
    </image:image>
  </url>`;
  }

  xml += `
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
