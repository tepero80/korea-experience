'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { PostMetadata } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { CATEGORY_HUBS } from '@/lib/constants';

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
  
  // Tab state from URL
  const currentTab = searchParams.get('tab') || 'deep-dive';
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

  // Separate Deep Dive and regular posts
  const deepDivePosts = useMemo(() => 
    allPosts
      .filter(post => post.deepDive === true)
      .sort((a, b) => {
        // Sort by deepDiveOrder if available, otherwise by date
        if (a.deepDiveOrder && b.deepDiveOrder) {
          return a.deepDiveOrder - b.deepDiveOrder;
        }
        return a.date < b.date ? 1 : -1;
      }),
    [allPosts]
  );

  const regularPosts = useMemo(() => 
    allPosts.filter(post => post.deepDive !== true),
    [allPosts]
  );

  // Get current posts based on tab
  const currentPosts = currentTab === 'deep-dive' ? deepDivePosts : regularPosts;
  
  // Filter posts by category
  const filteredPosts = categorySlug
    ? currentPosts.filter((post) => {
        const actualCategory = categoryMap[categorySlug];
        return post.category === actualCategory;
      })
    : currentPosts;

  // Build URL with params
  const buildUrl = (tab?: string, category?: string) => {
    const params = new URLSearchParams();
    if (tab && tab !== 'deep-dive') params.set('tab', tab);
    if (tab === 'deep-dive') params.delete('tab');
    if (category) params.set('category', category);
    const queryString = params.toString();
    return `/blog${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl inline-flex">
          <Link
            href={buildUrl('deep-dive', categorySlug)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${currentTab === 'deep-dive'
                ? 'bg-white text-amber-700 shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }
            `}
          >
            <span className="text-xl">🔬</span>
            <span>Deep Dive Guides</span>
            <span className={`
              text-xs px-2 py-0.5 rounded-full
              ${currentTab === 'deep-dive' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'}
            `}>
              {deepDivePosts.length}
            </span>
          </Link>
          <Link
            href={buildUrl('articles', categorySlug)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${currentTab === 'articles'
                ? 'bg-white text-amber-700 shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }
            `}
          >
            <span className="text-xl">📚</span>
            <span>All Articles</span>
            <span className={`
              text-xs px-2 py-0.5 rounded-full
              ${currentTab === 'articles' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'}
            `}>
              {regularPosts.length}
            </span>
          </Link>
        </div>
      </div>

      {/* Tab Description */}
      <div className="mb-8">
        {currentTab === 'deep-dive' ? (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔬</div>
              <div>
                <h3 className="font-semibold text-amber-900">Research-Backed Deep Dive Guides</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Comprehensive, expert-verified guides with real data, local insights, and actionable tips for navigating Korea.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-stone-50 to-amber-50 border border-stone-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📚</div>
              <div>
                <h3 className="font-semibold text-stone-900">All Articles & Updates</h3>
                <p className="text-sm text-stone-600 mt-1">
                  Latest news, tips, and updates about Korea — from travel hacks to cultural insights.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex gap-2 flex-wrap items-center">
        <Link 
          href={buildUrl(currentTab, undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !categorySlug 
              ? 'bg-amber-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Categories
        </Link>
        <Link 
          href={buildUrl(currentTab, 'medicaltourism')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            categorySlug === 'medicaltourism'
              ? 'bg-rose-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>🏥</span> Medical Tourism
        </Link>
        <Link 
          href={buildUrl(currentTab, 'traveltourism')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            categorySlug === 'traveltourism'
              ? 'bg-amber-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>✈️</span> Travel & Tourism
        </Link>
        <Link 
          href={buildUrl(currentTab, 'kculture')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            categorySlug === 'kculture'
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>🎭</span> K-Culture
        </Link>
        <Link 
          href={buildUrl(currentTab, 'living')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            categorySlug === 'living'
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>🏠</span> Living in Korea
        </Link>
        <Link 
          href={buildUrl(currentTab, 'food')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
            categorySlug === 'food'
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>🍜</span> Food & Dining
        </Link>
        <Link 
          href={buildUrl(currentTab, 'shopping')}
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
        Showing {filteredPosts.length} {currentTab === 'deep-dive' ? 'deep dive guides' : 'articles'}
        {categorySlug && ` in ${categoryMap[categorySlug]}`}
      </div>

      {/* Blog Posts Grid with Load More pagination */}
      <PaginatedGrid
        posts={filteredPosts}
        currentTab={currentTab}
        categorySlug={categorySlug}
        categoryMap={categoryMap}
      />
    </div>
  );
}

// Paginated grid component
function PaginatedGrid({ posts, currentTab, categorySlug, categoryMap }: {
  posts: PostMetadata[];
  currentTab: string;
  categorySlug?: string;
  categoryMap: Record<string, string>;
}) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [currentTab, categorySlug]);

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
          No {currentTab === 'deep-dive' ? 'deep dive guides' : 'articles'} found
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
