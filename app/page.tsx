import Link from 'next/link';
import { Metadata } from 'next';
import { SITE_CONFIG, ALL_TOOLS, BLOG_CATEGORIES } from '@/lib/constants';
import { getFeaturedPosts, getLatestDeepDivePerCategory } from '@/lib/posts';

export const metadata: Metadata = {
  alternates: { canonical: 'https://koreaexperience.com' },
};

export default function Home() {
  // Get top 6 featured tools
  const featuredTools = ALL_TOOLS.slice(0, 6);
  
  // Get featured posts (6 hand-picked articles)
  const featuredPosts = getFeaturedPosts();
  
  // Get latest deep dive per category (excluding featured)
  const featuredSlugs = featuredPosts.map(p => p.slug);
  const categoryLatest = getLatestDeepDivePerCategory(featuredSlugs);
  
  return (
    <div className="pt-20"> {/* Padding for fixed header */}
      
      {/* Hero Section - Warm Korean Aesthetic */}
      <section className="relative overflow-hidden text-white">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-korea.webp"
            alt="Traditional Korean hanok village with Seoul skyline at golden hour"
            className="w-full h-full object-cover"
          />
          {/* Warm overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/55 to-amber-900/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-stone-900/20" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-amber-50">Trusted by 10,000+ International Visitors</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">Experience Korea</span>
              <span className="block mt-2 bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                Like a Local
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-amber-50/90 leading-relaxed max-w-3xl mx-auto">
              Your insider guide to Korean travel, medical tourism, 
              K-culture, food, and living — curated by experts who call Korea home
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/blog"
                className="
                  group relative inline-flex items-center gap-2
                  bg-white text-stone-800 px-8 py-4 rounded-xl font-semibold text-lg
                  hover:shadow-2xl hover:scale-105
                  transition-all duration-300
                "
              >
                <span>Explore Guides</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/contact"
                className="
                  inline-flex items-center gap-2
                  border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg
                  hover:bg-white/10 hover:border-white
                  transition-all duration-300
                "
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Contact Us</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-amber-50/80">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Expert Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Regularly Updated</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>10+ Languages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 md:h-24 text-white" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* Featured Guides Section - Deep Dive */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-full mb-4">
              <span className="text-2xl">🔬</span>
              <span className="text-sm font-semibold text-blue-700">Deep Dive Guides</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              In-Depth Korea Insights
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive research-backed guides for navigating Korea like a local
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredPosts.map((post) => {
              // Category icon and color mapping
              const getCategoryStyle = (category: string) => {
                const styles: Record<string, { icon: string; color: string; gradient: string }> = {
                  'Medical Tourism': { icon: '🏥', color: 'text-rose-600', gradient: 'from-rose-500 via-red-400 to-orange-400' },
                  'Travel & Tourism': { icon: '✈️', color: 'text-blue-600', gradient: 'from-sky-500 via-blue-500 to-indigo-500' },
                  'Food & Dining': { icon: '🍜', color: 'text-orange-600', gradient: 'from-orange-400 via-amber-400 to-yellow-400' },
                  'K-Culture': { icon: '🎭', color: 'text-purple-600', gradient: 'from-purple-500 via-fuchsia-500 to-pink-400' },
                  'Living in Korea': { icon: '🏠', color: 'text-emerald-600', gradient: 'from-emerald-500 via-green-500 to-teal-400' },
                  'Shopping & K-Beauty': { icon: '💄', color: 'text-pink-600', gradient: 'from-pink-500 via-rose-400 to-fuchsia-400' },
                };
                return styles[category] || { icon: '📖', color: 'text-slate-600', gradient: 'from-slate-500 via-gray-500 to-slate-400' };
              };
              
              const style = getCategoryStyle(post.category);
              
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  {/* Cover Image - only show when available */}
                  {post.image && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                  )}

                  {/* Content below image */}
                  <div className="p-5">
                    {/* Category & Deep Dive */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${style.color}`}>
                        <span>{style.icon}</span>
                        <span>{post.category}</span>
                      </span>
                      {post.deepDive && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          🔬 Deep Dive
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                      {post.title}
                    </div>
                    
                    {/* Excerpt */}
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
            })}
          </div>

          {/* Latest Deep Dive per Category */}
          {categoryLatest.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full mb-4">
                  <span className="text-2xl">🆕</span>
                  <span className="text-sm font-semibold text-green-700">Fresh from Research</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Latest Deep Dives by Category
                </h3>
                <p className="text-xl text-gray-600">
                  The newest research-backed deep dives across every topic
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryLatest.map((post) => {
                  const getCategoryStyle = (category: string) => {
                    const styles: Record<string, { icon: string; color: string; gradient: string }> = {
                      'Medical Tourism': { icon: '🏥', color: 'text-rose-600', gradient: 'from-rose-500 via-red-400 to-orange-400' },
                      'Travel & Tourism': { icon: '✈️', color: 'text-blue-600', gradient: 'from-sky-500 via-blue-500 to-indigo-500' },
                      'Food & Dining': { icon: '🍜', color: 'text-orange-600', gradient: 'from-orange-400 via-amber-400 to-yellow-400' },
                      'K-Culture': { icon: '🎭', color: 'text-purple-600', gradient: 'from-purple-500 via-fuchsia-500 to-pink-400' },
                      'Living in Korea': { icon: '🏠', color: 'text-emerald-600', gradient: 'from-emerald-500 via-green-500 to-teal-400' },
                      'Shopping & K-Beauty': { icon: '💄', color: 'text-pink-600', gradient: 'from-pink-500 via-rose-400 to-fuchsia-400' },
                    };
                    return styles[category] || { icon: '📖', color: 'text-slate-600', gradient: 'from-slate-500 via-gray-500 to-slate-400' };
                  };
                  const style = getCategoryStyle(post.category);
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                    >
                      {post.image && (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${style.color}`}>
                            <span>{style.icon}</span>
                            <span>{post.category}</span>
                          </span>
                          {post.deepDive && (
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              🔬 Deep Dive
                            </span>
                          )}
                        </div>
                        <div className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          {post.title}
                        </div>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
                })}
              </div>
            </div>
          )}

          {/* Explore All Guides */}
          <div className="text-center mt-4">
            <Link
              href="/blog"
              className="
                inline-flex items-center gap-3
                bg-white text-gray-900 border-2 border-gray-200
                px-10 py-4 rounded-full font-semibold text-lg
                hover:border-blue-500 hover:text-blue-600 hover:shadow-lg
                transition-all duration-300
                group
              "
            >
              <span>📚</span>
              <span>Explore All 650+ Guides</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Tools Showcase */}
      <section className="pt-8 pb-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - same style as Deep Dive */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
              <span className="text-2xl">✨</span>
              <span className="text-sm font-semibold text-purple-700">Interactive Tools</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Discover Korea, Your Way
            </h2>
            <p className="text-xl text-gray-600">
              Quizzes, calculators, and generators loved by <span className="font-semibold text-purple-600">10,000+</span> users worldwide
            </p>
          </div>

          {/* Tools Grid - same card style as blog posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredTools.map((tool) => {
              const getToolColor = (category: string) => {
                const colors: Record<string, string> = {
                  'Discover Yourself': 'text-purple-600',
                  'Love & Relationships': 'text-rose-600',
                  'Fun & Entertainment': 'text-orange-600',
                  'Plan Your Korea Trip': 'text-blue-600',
                  'Life in Korea': 'text-emerald-600',
                };
                return colors[category] || 'text-gray-600';
              };

              // Derive slug from href: /tools/korean-name → korean-name
              const toolSlug = tool.href.replace('/tools/', '');
              const toolImage = `/images/tools/${toolSlug}.webp`;

              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={toolImage}
                      alt={tool.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>

                  {/* Content below - matching blog card structure */}
                  <div className="p-5">
                    {/* Category & Viral Score */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${getToolColor(tool.category)}`}>
                        <span>{tool.icon}</span>
                        <span>{tool.category}</span>
                      </span>
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        🔥 {tool.viral}% viral
                      </span>
                    </div>

                    {/* Title */}
                    <div className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                      {tool.title}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Meta - matching blog card bottom */}
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <span>{tool.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600 font-semibold group-hover:gap-2 transition-all">
                        <span>Try Now</span>
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* View All Button - same style as Explore All Guides */}
          <div className="text-center">
            <Link
              href="/tools"
              className="
                inline-flex items-center gap-3
                bg-white text-gray-900 border-2 border-gray-200
                px-10 py-4 rounded-full font-semibold text-lg
                hover:border-purple-500 hover:text-purple-600 hover:shadow-lg
                transition-all duration-300
                group
              "
            >
              <span>✨</span>
              <span>Explore All Tools</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats + CTA Combined Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-20">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-2xl mb-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">650+</div>
              <div className="text-sm text-gray-500 font-medium">Expert Guides</div>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-2xl mb-2">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">10k+</div>
              <div className="text-sm text-gray-500 font-medium">Monthly Visitors</div>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-2xl mb-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                </svg>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">10+</div>
              <div className="text-sm text-gray-500 font-medium">Languages</div>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-2xl mb-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">98%</div>
              <div className="text-sm text-gray-500 font-medium">Satisfaction</div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-lg p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Ready to Experience Korea?
            </h2>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of travelers and medical tourists who trust our comprehensive, research-backed guides
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/blog"
                className="
                  inline-flex items-center justify-center gap-2
                  bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg
                  hover:bg-amber-700 hover:shadow-lg hover:scale-105
                  transition-all duration-300 group
                "
              >
                <span>Browse All Guides</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/contact"
                className="
                  inline-flex items-center justify-center gap-2
                  border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg
                  hover:border-amber-500 hover:text-amber-600 hover:shadow-lg
                  transition-all duration-300
                "
              >
                Contact Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="py-6 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong className="font-semibold text-gray-600">Medical Disclaimer:</strong> This website provides informational content only
              and does not constitute medical advice. Always consult qualified healthcare professionals
              before making medical decisions. Read our full{' '}
              <Link href="/disclaimer" className="text-blue-600 hover:underline font-medium">Medical Disclaimer</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
