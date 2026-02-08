import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG, CATEGORY_HUBS, CATEGORY_SLUG_TO_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Blog Categories — Korea Experience' },
  description: 'Browse all Korea Experience blog categories: Medical Tourism, Travel, K-Culture, Living in Korea, Food & Dining, and Shopping & K-Beauty.',
  openGraph: {
    title: 'Blog Categories — Korea Experience',
    description: 'Browse all Korea Experience blog categories: Medical Tourism, Travel, K-Culture, Living in Korea, Food & Dining, and Shopping & K-Beauty.',
    url: `${SITE_CONFIG.url}/blog/category`,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Categories — Korea Experience',
    description: 'Browse all Korea Experience blog categories.',
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog/category`,
  },
};

export default function CategoryIndexPage() {
  const allPosts = getAllPosts();

  // Count posts per category
  const categoryCounts: Record<string, number> = {};
  for (const hub of CATEGORY_HUBS) {
    const categoryName = CATEGORY_SLUG_TO_NAME[hub.slug];
    categoryCounts[hub.slug] = allPosts.filter((p) => p.category === categoryName).length;
  }

  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Blog', item: `${SITE_CONFIG.url}/blog` },
    { name: 'Categories', item: `${SITE_CONFIG.url}/blog/category` },
  ]);

  // CollectionPage schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog Categories',
    description: 'Browse all Korea Experience blog categories.',
    url: `${SITE_CONFIG.url}/blog/category`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    numberOfItems: CATEGORY_HUBS.length,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, collectionSchema]),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center text-white">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center justify-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white font-medium">Categories</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Browse by Category
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Explore {allPosts.length}+ articles across {CATEGORY_HUBS.length} categories — from medical tourism and travel to K-culture and daily life in Korea.
          </p>
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORY_HUBS.map((hub) => (
            <Link
              key={hub.slug}
              href={`/blog/category/${hub.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient Background */}
              <div className={`bg-gradient-to-br ${hub.gradient} p-8 min-h-[240px] flex flex-col justify-between`}>
                {/* Icon & Count */}
                <div className="flex items-start justify-between">
                  <span className="text-5xl">{hub.icon}</span>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {categoryCounts[hub.slug]} articles
                  </span>
                </div>

                {/* Title & Description */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:underline decoration-2 underline-offset-4">
                    {hub.name}
                  </h2>
                  <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                    {hub.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="mt-4 flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Explore articles</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Back to Blog CTA */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600 mb-4">Looking for something specific?</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse All Articles
          </Link>
        </div>
      </section>
    </>
  );
}
