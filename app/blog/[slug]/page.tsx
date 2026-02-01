import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { generateArticleSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';
import MDXContent from '@/components/MDXContent';
import AuthorBox from '@/components/AuthorBox';

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
      publishedTime: post.date,
      authors: [SITE_CONFIG.author],
      url: url,
      siteName: SITE_CONFIG.name,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      creator: SITE_CONFIG.social.twitter,
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
  });

  return (
    <main className="pt-20 pb-12">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <article className="max-w-4xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-gray-700">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{post.title}</span>
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

        {/* Medical Disclaimer */}
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
      </article>
    </main>
  );
}
