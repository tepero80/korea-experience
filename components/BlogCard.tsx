import Link from 'next/link';
import { PostMetadata } from '@/lib/posts';

interface BlogCardProps {
  post: PostMetadata;
  showDeepDiveBadge?: boolean;
}

// Category styles mapping
const categoryStyles: Record<string, { icon: string; color: string; gradient: string; pattern: string }> = {
  'Medical Tourism': { icon: '🏥', color: 'text-rose-600', gradient: 'from-rose-500 via-red-400 to-orange-400', pattern: '╋' },
  'Travel & Tourism': { icon: '✈️', color: 'text-blue-600', gradient: 'from-sky-500 via-blue-500 to-indigo-500', pattern: '◆' },
  'Food & Dining': { icon: '🍜', color: 'text-orange-600', gradient: 'from-orange-400 via-amber-400 to-yellow-400', pattern: '●' },
  'K-Culture': { icon: '🎭', color: 'text-purple-600', gradient: 'from-purple-500 via-fuchsia-500 to-pink-400', pattern: '★' },
  'Living in Korea': { icon: '🏠', color: 'text-emerald-600', gradient: 'from-emerald-500 via-green-500 to-teal-400', pattern: '▲' },
  'Shopping & K-Beauty': { icon: '💄', color: 'text-pink-600', gradient: 'from-pink-500 via-rose-400 to-fuchsia-400', pattern: '♦' },
};

const defaultStyle = { icon: '📖', color: 'text-slate-600', gradient: 'from-slate-500 via-gray-500 to-slate-400', pattern: '■' };

export default function BlogCard({ post, showDeepDiveBadge = true }: BlogCardProps) {
  const { slug, title, excerpt, category, date, image, deepDive } = post;
  const style = categoryStyles[category] || defaultStyle;
  
  return (
    <Link
      href={`/blog/${slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
    >
      {/* Cover Image - only show when available */}
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Category & Deep Dive */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${style.color}`}>
            <span>{style.icon}</span>
            <span>{category}</span>
          </span>
          {showDeepDiveBadge && deepDive && (
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              🔬 Deep Dive
            </span>
          )}
        </div>

        {/* Title */}
        <div className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
          {title}
        </div>
        
        {/* Excerpt */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 font-semibold group-hover:gap-2 transition-all">
            <span>Read</span>
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
