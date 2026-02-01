'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PostMetadata } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';

interface BlogListProps {
  allPosts: PostMetadata[];
}

export default function BlogList({ allPosts }: BlogListProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  
  // Filter posts by category
  const posts = category
    ? allPosts.filter((post) => {
        const postCategory = post.category?.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
        const filterCategory = category.toLowerCase();
        return postCategory === filterCategory;
      })
    : allPosts;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Category Filter */}
      <div className="mb-8 flex gap-2 flex-wrap">
        <Link 
          href="/blog"
          className={`px-4 py-2 rounded-md transition-colors ${
            !category 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Posts
        </Link>
        <Link 
          href="/blog?category=medicaltourism"
          className={`px-4 py-2 rounded-md transition-colors ${
            category === 'medicaltourism'
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Medical Tourism
        </Link>
        <Link 
          href="/blog?category=traveltourism"
          className={`px-4 py-2 rounded-md transition-colors ${
            category === 'traveltourism'
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Travel & Tourism
        </Link>
        <Link 
          href="/blog?category=k-culture"
          className={`px-4 py-2 rounded-md transition-colors ${
            category === 'k-culture'
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          K-Culture
        </Link>
        <Link 
          href="/blog?category=investment"
          className={`px-4 py-2 rounded-md transition-colors ${
            category === 'investment'
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
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
            No posts found in this category. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
