import Link from 'next/link';
import { PostMetadata } from '@/lib/posts';

interface BlogCardProps {
  post: PostMetadata;
  showDeepDiveBadge?: boolean;
}

// Category styles mapping - matching homepage style
const categoryStyles: Record<string, { gradient: string; icon: string; badge: string }> = {
  'Medical Tourism': { gradient: 'from-rose-400 via-red-400 to-rose-500', icon: '🏥', badge: 'bg-rose-500' },
  'Travel & Tourism': { gradient: 'from-sky-400 via-blue-500 to-indigo-500', icon: '✈️', badge: 'bg-blue-500' },
  'Food & Dining': { gradient: 'from-orange-400 via-amber-500 to-yellow-500', icon: '🍜', badge: 'bg-orange-500' },
  'K-Culture': { gradient: 'from-purple-400 via-fuchsia-500 to-pink-500', icon: '🎭', badge: 'bg-purple-500' },
  'Living in Korea': { gradient: 'from-emerald-400 via-green-500 to-teal-500', icon: '🏠', badge: 'bg-emerald-500' },
  'Shopping & K-Beauty': { gradient: 'from-pink-400 via-rose-400 to-pink-500', icon: '💄', badge: 'bg-pink-500' },
};

export default function BlogCard({ post, showDeepDiveBadge = false }: BlogCardProps) {
  const { slug, title, excerpt, category, date, deepDive } = post;
  const style = categoryStyles[category] || { gradient: 'from-slate-400 via-gray-500 to-slate-500', icon: '📖', badge: 'bg-slate-500' };
  
  return (
    <Link
      href={`/blog/${slug}`}
      className="
        group bg-white rounded-2xl overflow-hidden
        shadow-sm hover:shadow-xl
        transition-all duration-300 hover:-translate-y-1
        border border-gray-100 hover:border-gray-200
      "
    >
      {/* Header with gradient and icon */}
      <div className={`relative h-24 bg-gradient-to-br ${style.gradient}`}>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        {/* Category Badge - top left */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 ${style.badge} text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm`}>
            <span>{style.icon}</span>
            <span>{category}</span>
          </span>
        </div>
        
        {/* Deep Dive Badge - top right (optional) */}
        {showDeepDiveBadge && deepDive && (
          <div className="absolute top-3 right-3">
            <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
              🔬 Deep Dive
            </span>
          </div>
        )}
        
        {/* Large icon - bottom right with rotation animation */}
        <div className="absolute -bottom-4 -right-2 text-6xl opacity-30 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
          {style.icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs">
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
