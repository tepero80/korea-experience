'use client';

import Link from 'next/link';

interface Tool {
  id: number;
  href: string;
  title: string;
  category: string;
  difficulty: string;
  viral: number;
  description: string;
  icon: string;
  status: string;
}

interface ToolComingSoonClientProps {
  tool: Tool | undefined;
  relatedTools: Tool[];
}

export default function ToolComingSoonClient({ tool, relatedTools }: ToolComingSoonClientProps) {
  if (!tool) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tool Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">The tool you're looking for doesn't exist.</p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
            >
              View All Tools
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-8 group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Tools
            </Link>

            {/* Tool Icon with Animation */}
            <div className="text-center mb-8">
              <div className="inline-block text-8xl mb-6 animate-bounce">
                {tool.icon}
              </div>
              
              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg mb-6">
                <svg className="w-5 h-5 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-lg">Coming Soon</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                {tool.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
                {tool.description}
              </p>
            </div>

            {/* Tool Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Category */}
              <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-purple-100 text-center">
                <div className="text-3xl mb-2">🏷️</div>
                <div className="text-sm text-gray-600 mb-1">Category</div>
                <div className="text-lg font-bold text-purple-600">{tool.category}</div>
              </div>

              {/* Difficulty */}
              <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-pink-100 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-sm text-gray-600 mb-1">Difficulty</div>
                <div className="text-lg font-bold text-pink-600">{tool.difficulty}</div>
              </div>

              {/* Viral Potential */}
              <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-rose-100 text-center">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-sm text-gray-600 mb-1">Viral Potential</div>
                <div className="text-lg font-bold text-rose-600">{tool.viral}%</div>
              </div>
            </div>

            {/* Status Message */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-12 border-2 border-purple-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🚀</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    We're Building Something Special
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    This interactive tool is currently under development. We're working hard to make it amazing for you!
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    In the meantime, explore our other tools below or check out our comprehensive guides on the blog.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/tools"
                className="
                  inline-flex items-center justify-center gap-2
                  bg-gradient-to-r from-purple-600 to-pink-600 text-white
                  px-8 py-4 rounded-xl font-semibold text-lg
                  hover:shadow-2xl hover:scale-105 transition-all duration-300
                "
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                View All Tools
              </Link>
              <Link
                href="/blog"
                className="
                  inline-flex items-center justify-center gap-2
                  border-2 border-purple-600 text-purple-600
                  px-8 py-4 rounded-xl font-semibold text-lg
                  hover:bg-purple-600 hover:text-white transition-all duration-300
                "
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Browse Blog Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 text-center">
                Try These Tools Instead
              </h2>
              <p className="text-lg text-gray-600 text-center mb-12">
                Similar tools in the <span className="font-semibold text-purple-600">{tool.category}</span> category
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedTools.map((relatedTool) => (
                  <Link
                    key={relatedTool.id}
                    href={relatedTool.href}
                    className="
                      group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6
                      border-2 border-purple-100 hover:border-purple-300
                      hover:shadow-xl transition-all duration-300 hover:-translate-y-2
                    "
                  >
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {relatedTool.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {relatedTool.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {relatedTool.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-600">{relatedTool.category}</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold">{relatedTool.viral}%</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-6">📬</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get Notified When Tools Launch
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              We're adding new interactive tools every week. Stay updated on the latest launches!
            </p>
            <Link
              href="/contact"
              className="
                inline-flex items-center gap-2
                bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg
                hover:shadow-2xl hover:scale-105 transition-all duration-300
              "
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Stay Updated
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
