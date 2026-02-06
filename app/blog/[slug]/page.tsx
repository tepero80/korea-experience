import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/posts';
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { SITE_CONFIG, CATEGORY_NAME_TO_SLUG, CATEGORY_HUBS } from '@/lib/constants';
import MDXContent from '@/components/MDXContent';
import AuthorBox from '@/components/AuthorBox';
import RelatedPosts from '@/components/RelatedPosts';

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const url = `${SITE_CONFIG.url}/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: SITE_CONFIG.author }],
    keywords: [post.category, 'Korea', 'travel', 'medical tourism'],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: [SITE_CONFIG.author],
      url: url,
      siteName: SITE_CONFIG.name,
      locale: 'en_US',
      images: [
        {
          url: `/blog/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      creator: SITE_CONFIG.social.twitter,
      images: [`/blog/${slug}/opengraph-image`],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Generate JSON-LD schema
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: SITE_CONFIG.author,
    category: post.category,
    url: `${SITE_CONFIG.url}/blog/${slug}`,
    imageUrl: `${SITE_CONFIG.url}/blog/${slug}/opengraph-image`,
  });

  // Resolve category hub info
  const categorySlug = CATEGORY_NAME_TO_SLUG[post.category];
  const categoryHub = CATEGORY_HUBS.find(c => c.slug === categorySlug);

  // Generate Breadcrumb Schema (Home > Blog > Category > Post)
  const breadcrumbItems = [
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Blog', item: `${SITE_CONFIG.url}/blog` },
  ];
  if (categorySlug) {
    breadcrumbItems.push({ name: post.category, item: `${SITE_CONFIG.url}/blog/category/${categorySlug}` });
  }
  breadcrumbItems.push({ name: post.title, item: `${SITE_CONFIG.url}/blog/${slug}` });
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  // Get related posts — neighbor chain within same category
  const relatedPosts = getRelatedPosts(slug, 6);

  // Extract FAQ items from post content for FAQPage JSON-LD
  const faqItems: { question: string; answer: string }[] = [];
  if (post.content.includes('FAQAccordion')) {
    const faqRegex = /question:\s*"([^"]+)"\s*,\s*answer:\s*"([^"]+)"/g;
    let match;
    while ((match = faqRegex.exec(post.content)) !== null) {
      faqItems.push({ question: match[1], answer: match[2] });
    }
  }
  const faqSchema = faqItems.length > 0 ? generateFAQSchema(faqItems) : null;

  return (
    <main className="pt-20 pb-12">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      <article className="max-w-4xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          {categorySlug && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/blog/category/${categorySlug}`} className="hover:text-blue-600 transition-colors">
                {categoryHub?.icon} {post.category}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 line-clamp-1 inline">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full font-medium">
              {post.category}
            </span>
            <time className="text-gray-500">{new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</time>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Article Content */}
        <div className="mb-12">
          <MDXContent source={post.content} />
        </div>

        {/* Author Box */}
        <AuthorBox />

        {/* Medical Disclaimer — Medical Tourism only */}
        {post.category === 'Medical Tourism' && (
          <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              ⚠️ Medical Disclaimer
            </h3>
            <p className="text-sm text-red-700">
              The information provided on this website is for general informational purposes only
              and does not constitute medical advice. Always consult with qualified healthcare
              professionals before making any medical decisions.
            </p>
          </div>
        )}

        {/* Browse Category Hub */}
        {categorySlug && categoryHub && (
          <div className="mt-10 p-6 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{categoryHub.icon}</span>
              <h3 className="text-lg font-semibold text-gray-900">
                Explore more in {post.category}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{categoryHub.description}</p>
            <Link
              href={`/blog/category/${categorySlug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-sm hover:shadow-md"
            >
              Browse All {post.category} Articles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />
      </article>
    </main>
  );
}
