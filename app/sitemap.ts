import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/constants';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const baseUrl = SITE_CONFIG.url;

  // Static pages
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
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Interactive Tools
  const toolPages = [
    '/tools/korean-name',
    '/tools/korea-job-quiz',
    '/tools/korean-age',
    '/tools/trip-budget',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Blog posts
  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...toolPages, ...blogPosts];
}
