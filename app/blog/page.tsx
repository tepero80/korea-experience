import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'Blog - Korea Experience',
  description: 'Read our latest guides on medical tourism, travel, K-culture, and investment in Korea.',
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const posts = allPosts;

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
              No posts found in this category. Check back soon!
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
