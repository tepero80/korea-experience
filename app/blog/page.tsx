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
    <div className="pt-20 min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto pt-10 pb-6">
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">📝</span>
            <span className="text-sm font-semibold text-amber-700">{allPosts.length}+ Expert Guides</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 mb-3">
            Korea Experience Blog
          </h1>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl">
            Expert guides and insights on medical tourism, travel, K-culture, and more.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        <Suspense fallback={<div>Loading...</div>}>
          <BlogList allPosts={allPosts} />
        </Suspense>
      </div>
    </div>
  );
}
