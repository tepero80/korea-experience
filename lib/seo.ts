import type { Metadata } from 'next';
import { SITE_CONFIG } from './constants';
import type { PostMetadata } from './posts';
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
export function guideMetadata(post: PostMetadata): Metadata {
  const canonical = `${SITE_CONFIG.url}/blog/${post.slug}`;
  const image = post.reviewed
    ? `/images/cards/${post.slug}.jpg`
    : post.image || '/images/cards/korea-experience.jpg';
  return {
    title: { absolute: post.title },
    description: post.excerpt,
    alternates: { canonical },
    robots: { index: post.indexable, follow: true },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: canonical,
      siteName: SITE_CONFIG.name,
      locale: 'en_US',
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      images: [
        { url: image, alt: post.title, ...(post.reviewed ? { width: 1200, height: 630 } : {}) },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}
export function guideSchema(post: PostMetadata) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_CONFIG.url}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    inLanguage: 'en',
    articleSection: post.category,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.author,
      url: `${SITE_CONFIG.url}/editorial-policy`,
    },
    publisher: { '@type': 'Organization', name: SITE_CONFIG.name, url: SITE_CONFIG.url },
    mainEntityOfPage: `${SITE_CONFIG.url}/blog/${post.slug}`,
    image: post.image ? `${SITE_CONFIG.url}${post.image}` : undefined,
    citation: post.editorial?.sources.map((s) => s.url),
  };
}
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.path}`,
    })),
  };
}
