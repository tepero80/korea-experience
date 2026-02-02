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
  const categorySlug = searchParams.get('category') || undefined;
  
  // Map URL slugs to actual category names
  const categoryMap: Record<string, string> = {
    'medicaltourism': 'Medical Tourism',
    'traveltourism': 'Travel & Tourism',
    'kculture': 'K-Culture',
    'living': 'Living in Korea',
    'food': 'Food & Dining',
    'shopping': 'Shopping & K-Beauty'
  };
  
  // Filter posts by category
  const posts = categorySlug
    ? allPosts.filter((post) => {
        const actualCategory = categoryMap[categorySlug];
        return post.category === actualCategory;
      })
    : allPosts;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Category Filter */}
      <div className="mb-8 flex gap-2 flex-wrap">
        <Link 
          href="/blog"
          className={`px-4 py-2 rounded-md transition-colors ${
            !categorySlug 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Posts
        </Link>
        <Link 
          href="/blog?category=medicaltourism"
          className={`px-4 py-2 rounded-md transition-colors ${
            categorySlug === 'medicaltourism'
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Medical Tourism
        </Link>
        <Link 
          href="/blog?category=traveltourism"
          className={`px-4 py-2 rounded-md transition-colors ${
            categorySlug === 'traveltourism'
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Travel & Tourism
        </Link>
        <Link 
          href="/blog?category=kculture"
          className={`px-4 py-2 rounded-md transition-colors ${
            categorySlug === 'kculture'
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          K-Culture
        </Link>
        <Link 
          href="/blog?category=living"
          className={`px-4 py-2 rounded-md transition-colors ${
            categorySlug === 'living'
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Living in Korea
        </Link>
        <Link 
          href="/blog?category=food"
          className={`px-4 py-2 rounded-md transition-colors ${
            categorySlug === 'food'
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Food & Dining
        </Link>
        <Link 
          href="/blog?category=shopping"
          className={`px-4 py-2 rounded-md transition-colors ${
            categorySlug === 'shopping'
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Shopping & K-Beauty
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
