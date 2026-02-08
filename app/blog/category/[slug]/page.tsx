import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts } from '@/lib/posts';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG, CATEGORY_HUBS, CATEGORY_SLUG_TO_NAME } from '@/lib/constants';
import BlogCard from '@/components/BlogCard';

type Params = Promise<{ slug: string }>;

// Generate static paths for all 6 category hubs
export function generateStaticParams() {
  return CATEGORY_HUBS.map((cat) => ({
    slug: cat.slug,
  }));
}

// Dynamic metadata per category
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const hub = CATEGORY_HUBS.find((c) => c.slug === slug);

  if (!hub) {
    return { title: 'Category Not Found' };
  }

  const url = `${SITE_CONFIG.url}/blog/category/${slug}`;

  return {
    title: {
      absolute: hub.metaTitle,
    },
    description: hub.metaDescription,
    openGraph: {
      title: hub.metaTitle,
      description: hub.metaDescription,
      url,
      siteName: SITE_CONFIG.name,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: hub.metaTitle,
      description: hub.metaDescription,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function CategoryHubPage({ params }: { params: Params }) {
  const { slug } = await params;
  const hub = CATEGORY_HUBS.find((c) => c.slug === slug);

  if (!hub) {
    notFound();
  }

  const categoryName = CATEGORY_SLUG_TO_NAME[slug];
  const allPosts = getAllPosts();
  const posts = allPosts.filter((p) => p.category === categoryName);

  // Separate Deep Dive posts
  const deepDivePosts = posts.filter((p) => p.deepDive);
  const regularPosts = posts.filter((p) => !p.deepDive);

  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Blog', item: `${SITE_CONFIG.url}/blog` },
    { name: hub.name, item: `${SITE_CONFIG.url}/blog/category/${slug}` },
  ]);

  // CollectionPage schema for SEO
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.metaTitle,
    description: hub.metaDescription,
    url: `${SITE_CONFIG.url}/blog/category/${slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    about: {
      '@type': 'Thing',
      name: hub.name,
    },
    numberOfItems: posts.length,
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

      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${hub.gradient} py-16 md:py-24`}>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center text-white">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center justify-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white font-medium">{hub.name}</span>
          </nav>

          <div className="text-6xl mb-4">{hub.icon}</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{hub.name}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {hub.description}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 text-sm font-medium">
            <span>📚</span>
            <span>{posts.length} articles</span>
            {deepDivePosts.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/60" />
                <span>🔬 {deepDivePosts.length} Deep Dives</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORY_HUBS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/category/${cat.slug}`}
                className={`
                  flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${cat.slug === slug
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Section (if any) */}
      {deepDivePosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <span className="text-lg">🔬</span>
              <span className="font-semibold text-sm">Deep Dive Series</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deepDivePosts.map((post) => (
              <BlogCard key={post.slug} post={post} showDeepDiveBadge />
            ))}
          </div>
        </section>
      )}

      {/* All Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full">
            <span className="text-lg">📖</span>
            <span className="font-semibold text-sm">All Articles</span>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">{regularPosts.length} articles</span>
        </div>

        {regularPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-4">📝</div>
            <p>No articles in this category yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Cross-Category CTA */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Explore More Topics</h2>
          <p className="text-gray-500 text-center mb-8">Discover everything about Korea</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORY_HUBS.filter((c) => c.slug !== slug).map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/category/${cat.slug}`}
                className="group bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-gray-100"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
