import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'Blog - Korea Experience',
  description: 'Read our latest guides on medical tourism, travel, K-culture, and investment in Korea.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Korea Experience Blog</h1>
        <p className="text-xl text-gray-600">
          Expert guides and insights on medical tourism, travel, K-culture, and more.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Category Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <Link 
            href="/blog"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            All Posts
          </Link>
          <Link 
            href="/blog?category=medical-tourism"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Medical Tourism
          </Link>
          <Link 
            href="/blog?category=travel"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Travel & Tourism
          </Link>
          <Link 
            href="/blog?category=k-culture"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            K-Culture
          </Link>
          <Link 
            href="/blog?category=investment"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Investment
          </Link>
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No blog posts yet. Check back soon for exciting content!
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
