import Link from 'next/link';
import { Metadata } from 'next';
import { SITE_CONFIG, ALL_TOOLS, BLOG_CATEGORIES } from '@/lib/constants';
import { getFeaturedPosts } from '@/lib/posts';

export const metadata: Metadata = {
  alternates: { canonical: 'https://koreaexperience.com' },
};

export default function Home() {
  // Get top 6 featured tools
  const featuredTools = ALL_TOOLS.slice(0, 6);
  
  // Get featured posts (6 hand-picked articles)
  const featuredPosts = getFeaturedPosts();
  
  return (
    <div className="pt-20"> {/* Padding for fixed header */}
      
      {/* Hero Section - Premium Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Trusted by 10,000+ International Visitors</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Your Complete Guide to the
              <span className="block mt-2 bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
                Korea Experience
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed max-w-3xl mx-auto">
              From world-class medical tourism and K-beauty clinics to travel guides, 
              cultural experiences, living guides, and authentic Korean food
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/blog"
                className="
                  group relative inline-flex items-center gap-2
                  bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg
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
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Expert Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Regularly Updated</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredPosts.map((post) => {
              // Category icon and color mapping - 6 standard categories only
              const getCategoryStyle = (category: string) => {
                const styles: Record<string, { icon: string; gradient: string; badge: string }> = {
                  'Medical Tourism': { icon: '🏥', gradient: 'from-rose-400 via-red-400 to-rose-500', badge: 'bg-rose-500' },
                  'Travel & Tourism': { icon: '✈️', gradient: 'from-sky-400 via-blue-500 to-indigo-500', badge: 'bg-blue-500' },
                  'Food & Dining': { icon: '🍜', gradient: 'from-orange-400 via-amber-500 to-yellow-500', badge: 'bg-orange-500' },
                  'K-Culture': { icon: '🎭', gradient: 'from-purple-400 via-fuchsia-500 to-pink-500', badge: 'bg-purple-500' },
                  'Living in Korea': { icon: '🏠', gradient: 'from-emerald-400 via-green-500 to-teal-500', badge: 'bg-emerald-500' },
                  'Shopping & K-Beauty': { icon: '💄', gradient: 'from-pink-400 via-rose-400 to-pink-500', badge: 'bg-pink-500' },
                };
                return styles[category] || { icon: '📖', gradient: 'from-slate-400 via-gray-500 to-slate-500', badge: 'bg-slate-500' };
              };
              
              const style = getCategoryStyle(post.category);
              
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
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
                        <span>{post.category}</span>
                      </span>
                    </div>
                    
                    {/* Large icon - bottom right */}
                    <div className="absolute -bottom-4 -right-2 text-6xl opacity-30 transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                      {style.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Title - using div instead of h3 to avoid globals.css override */}
                    <div className="text-base font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                      {post.title}
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs">
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

          {/* View All Button */}
          <div className="text-center">
            <Link
              href="/blog"
              className="
                inline-flex items-center gap-2
                bg-gradient-to-r from-blue-600 to-cyan-600
                text-white px-8 py-4 rounded-xl font-semibold text-lg
                hover:shadow-2xl hover:scale-105
                transition-all duration-300
                group
              "
            >
              <span>View All Articles</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Tools Showcase */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
              <span className="text-2xl">✨</span>
              <span className="text-sm font-semibold text-purple-700">Interactive Tools</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Try Our Interactive Tools
            </h2>
            <p className="text-xl text-gray-600">
              Fun quizzes, calculators, and generators loved by <span className="font-semibold text-purple-600">10,000+ users</span>
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="
                  group relative bg-white
                  rounded-2xl p-6 shadow-md hover:shadow-xl
                  border-2 border-gray-100 hover:border-purple-300
                  transition-all duration-300 hover:-translate-y-1
                "
              >
                {/* Coming Soon Badge */}
                {tool.status === 'coming' && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Soon
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {tool.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {tool.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-purple-600">{tool.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{tool.difficulty}</span>
                    <span>•</span>
                    <span className="font-semibold">{tool.viral}% viral</span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Link
              href="/tools"
              className="
                inline-flex items-center gap-2
                bg-gradient-to-r from-purple-600 to-pink-600
                text-white px-8 py-4 rounded-xl font-semibold text-lg
                hover:shadow-2xl hover:scale-105
                transition-all duration-300
                group
              "
            >
              <span>View All Tools</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Card Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for Your
              <span className="text-gradient"> Korea Journey</span>
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive, expert-verified guides covering all aspects of experiencing Korea
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Medical Tourism Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Medical Tourism</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                World-renowned plastic surgery, dermatology clinics, and beauty treatments with detailed price guides
              </p>
              <Link href="/blog?category=medical" className="text-red-500 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Learn More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Travel Guide Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Travel Guides</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Insider tips on Seoul hotspots, hidden gems, authentic Korean food, and seasonal travel
              </p>
              <Link href="/blog?category=travel" className="text-green-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* K-Culture Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">K-Culture</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                K-pop, K-drama filming locations, Korean language learning, and cultural experiences
              </p>
              <Link href="/blog?category=culture" className="text-purple-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Discover
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Living in Korea Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Living in Korea</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Visa guides, housing tips, cost of living, expat life, and settling in Korea
              </p>
              <Link href="/blog?category=living" className="text-green-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Explore
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Food & Dining Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Food & Dining</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Korean cuisine, restaurant guides, food markets, cooking classes, and culinary experiences
              </p>
              <Link href="/blog?category=food" className="text-orange-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Taste
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Shopping & K-Beauty Card */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Shopping & K-Beauty</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                K-beauty products, shopping districts, fashion, cosmetics, and beauty trends
              </p>
              <Link href="/blog?category=shopping" className="text-pink-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                Shop
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">200+</div>
              <div className="text-blue-100">Expert Guides</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">10k+</div>
              <div className="text-blue-100">Monthly Visitors</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">10+</div>
              <div className="text-blue-100">Languages</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">98%</div>
              <div className="text-blue-100">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Ready to Start Your Korea Journey?
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto">
                Join thousands of travelers and medical tourists who trust our comprehensive guides
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/blog"
                  className="
                    bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg
                    hover:shadow-2xl hover:scale-105
                    transition-all duration-300 inline-block
                  "
                >
                  Browse All Guides
                </Link>
                <Link 
                  href="/contact"
                  className="
                    border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg
                    hover:bg-white hover:text-blue-600
                    transition-all duration-300 inline-block
                  "
                >
                  Contact Expert
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="py-8 bg-amber-50 border-t border-amber-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex items-start gap-4">
            <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-gray-700">
                <strong className="font-semibold">Medical Disclaimer:</strong> This website provides informational content only 
                and does not constitute medical advice. Always consult qualified healthcare professionals 
                before making medical decisions. Read our full{' '}
                <Link href="/disclaimer" className="text-blue-600 hover:underline font-semibold">Medical Disclaimer</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
