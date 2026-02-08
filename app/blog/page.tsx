import { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllPosts } from '@/lib/posts';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';
import BlogList from './BlogList';

export const metadata: Metadata = {
  title: { absolute: 'Korea Blog — Medical Tourism, Travel & Culture Guides' },
  description: 'Read 650+ expert guides on medical tourism, travel, K-culture, food, shopping, and living in Korea. Updated weekly.',
  alternates: { canonical: 'https://koreaexperience.com/blog' },
  openGraph: {
    title: 'Korea Blog — Medical Tourism, Travel & Culture Guides',
    description: 'Read 650+ expert guides on medical tourism, travel, K-culture, food, shopping, and living in Korea.',
    url: 'https://koreaexperience.com/blog',
  },
};

export default function BlogPage() {
  const allPosts = getAllPosts();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Blog', item: `${SITE_CONFIG.url}/blog` },
  ]);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Korea Experience Blog',
    description: 'Read 650+ expert guides on medical tourism, travel, K-culture, food, shopping, and living in Korea.',
    url: `${SITE_CONFIG.url}/blog`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    numberOfItems: allPosts.length,
  };

  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Korea Experience Blog</h1>
          <p className="text-xl text-gray-600">
            Expert guides and insights on medical tourism, travel, K-culture, and more.
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <BlogList allPosts={allPosts} />
        </Suspense>
      </div>
    </div>
  );
}
