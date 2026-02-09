'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { PostMetadata } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';
import { useState, useMemo, useEffect, useCallback } from 'react';

const POSTS_PER_PAGE = 30;

interface BlogListProps {
  allPosts: PostMetadata[];
}

// Valid category slugs for URL validation
const VALID_CATEGORIES = [
  'medicaltourism',
  'traveltourism',
  'kculture',
  'living',
  'food',
  'shopping'
];

export default function BlogList({ allPosts }: BlogListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const categorySlug = searchParams.get('category') || undefined;

  // Redirect invalid category params to /blog (client-side)
  useEffect(() => {
    if (categorySlug && !VALID_CATEGORIES.includes(categorySlug)) {
      router.replace('/blog');
    }
  }, [categorySlug, router]);
  
  // Map URL slugs to actual category names
  const categoryMap: Record<string, string> = {
    'medicaltourism': 'Medical Tourism',
    'traveltourism': 'Travel & Tourism',
    'kculture': 'K-Culture',
    'living': 'Living in Korea',
    'food': 'Food & Dining',
    'shopping': 'Shopping & K-Beauty'
  };

  // All posts sorted by date (newest first)
  const sortedPosts = useMemo(() => 
    allPosts.sort((a, b) => (a.date < b.date ? 1 : -1)),
    [allPosts]
  );
  
  // Filter posts by category
  const filteredPosts = categorySlug
    ? sortedPosts.filter((post) => {
        const actualCategory = categoryMap[categorySlug];
        return post.category === actualCategory;
      })
    : sortedPosts;

  // Build URL with params
  const buildUrl = (category?: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    const queryString = params.toString();
    return `/blog${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Category Filter */}
      <div className="mb-8 flex gap-2 flex-wrap items-center">
        <Link 
          href={buildUrl(undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !categorySlug 
              ? 'bg-amber-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Categories
        </Link>
        <Link 
          href={buildUrl('medicaltourism')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            categorySlug === 'medicaltourism'
              ? 'bg-rose-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>🏥</span> Medical Tourism
        </Link>
        <Link 
          href={buildUrl('traveltourism')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            categorySlug === 'traveltourism'
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>✈️</span> Travel & Tourism
        </Link>
        <Link 
          href={buildUrl('kculture')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            categorySlug === 'kculture'
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>🎭</span> K-Culture
        </Link>
        <Link 
          href={buildUrl('living')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            categorySlug === 'living'
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>🏠</span> Living in Korea
        </Link>
        <Link 
          href={buildUrl('food')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            categorySlug === 'food'
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>🍜</span> Food & Dining
        </Link>
        <Link 
          href={buildUrl('shopping')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            categorySlug === 'shopping'
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>💄</span> Shopping & K-Beauty
        </Link>
        <span className="w-px h-6 bg-gray-200 mx-1" />
        <Link
          href="/blog/category"
          className="px-4 py-2 rounded-full text-sm font-medium transition-colors border border-amber-200 text-amber-700 hover:bg-amber-50 flex items-center gap-1.5"
        >
          <span>📂</span> Browse Categories
        </Link>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-sm text-gray-500">
        Showing {filteredPosts.length} articles
        {categorySlug && ` in ${categoryMap[categorySlug]}`}
      </div>

      {/* Blog Posts Grid with Load More pagination */}
      <PaginatedGrid
        posts={filteredPosts}
        categorySlug={categorySlug}
        categoryMap={categoryMap}
      />
    </div>
  );
}

// Paginated grid component
function PaginatedGrid({ posts, categorySlug, categoryMap }: {
  posts: PostMetadata[];
  categorySlug?: string;
  categoryMap: Record<string, string>;
}) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [categorySlug]);

  const visiblePosts = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;
  const remaining = posts.length - visibleCount;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + POSTS_PER_PAGE, posts.length));
  }, [posts.length]);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl">
        <div className="text-4xl mb-4">📭</div>
        <p className="text-gray-500 text-lg">
          No articles found
          {categorySlug && ` in ${categoryMap[categorySlug]}`}.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Try selecting a different category or check back soon!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visiblePosts.map((post, index) => (
          <BlogCard key={post.slug} post={post} priority={index < 3} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors shadow-sm hover:shadow-md"
          >
            <span>Load More</span>
            <span className="text-sm bg-amber-500 px-2.5 py-0.5 rounded-full">
              {Math.min(POSTS_PER_PAGE, remaining)} of {remaining} remaining
            </span>
          </button>
        </div>
      )}
    </>
  );
}
