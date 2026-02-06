import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { SITE_CONFIG, ALL_TOOLS, CATEGORY_HUBS } from '@/lib/constants';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const baseUrl = SITE_CONFIG.url;

  // Static pages - use a fixed date (last significant site update)
  // Do NOT use new Date() — it changes every build, sending false freshness signals to Google
  const SITE_LAST_UPDATED = new Date('2025-06-20');

  const staticPages = [
    '',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/tools',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Interactive Tools - 동적 생성 (22개 모든 툴 포함)
  const toolPages = ALL_TOOLS
    .filter(tool => tool.status === 'active')
    .map((tool) => ({
      url: `${baseUrl}${tool.href}`,
      lastModified: SITE_LAST_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // Blog posts with priority based on Deep Dive status
  const blogPosts = posts.map((post) => {
    let priority = 0.6; // Default for regular posts
    
    if (FEATURED_DEEP_DIVE_SLUGS.includes(post.slug)) {
      priority = 0.9; // Featured Deep Dive (homepage)
    } else if (post.deepDive) {
      priority = 0.8; // Other Deep Dive posts
    }
    
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority,
    };
  });

  // Category Hub Pages — crawlable category index pages for SEO
  const categoryPages = CATEGORY_HUBS.map((cat) => ({
    url: `${baseUrl}/blog/category/${cat.slug}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...blogPosts];
}
