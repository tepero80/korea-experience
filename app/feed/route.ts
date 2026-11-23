import { getAllPosts } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/constants';

export const dynamic = 'force-static';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = SITE_CONFIG.url;

  // The inventory already sorts by substantive update or original publication date.
  const recentPosts = posts
    .filter(
      (post) =>
        post.indexable &&
        (post.publicationStatus === 'verified-release' || (post.reviewed && post.updated)),
    )
    .slice(0, 50);

  const latest = recentPosts[0];
  const lastBuildDate = latest
    ? `<lastBuildDate>${new Date(latest.updated || latest.date).toUTCString()}</lastBuildDate>`
    : '';

  const items = recentPosts
    .map((post) => {
      const link = `${baseUrl}/blog/${post.slug}`;
      const pubDate =
        post.publicationStatus === 'verified-release'
          ? `<pubDate>${new Date(post.date).toUTCString()}</pubDate>`
          : '';
      const modified =
        post.reviewed && post.updated ? `<dcterms:modified>${post.updated}</dcterms:modified>` : '';

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.category)}</category>
      ${pubDate}${modified}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dcterms="http://purl.org/dc/terms/">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>en</language>
    ${lastBuildDate}
    <atom:link href="${baseUrl}/feed" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
