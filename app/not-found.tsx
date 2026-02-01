import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-6">
            404
          </div>

          {/* Icon */}
          <div className="text-6xl mb-6">🗺️</div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Oops! Page Not Found
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Looks like you've ventured off the map. The page you're looking for doesn't exist 
            or may have been moved.
          </p>

          {/* Search Suggestions */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Here's what you can do:
            </h2>
            <ul className="space-y-3 text-left max-w-md mx-auto">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Check the URL for typos</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Go back to the homepage</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Browse our guides and tools</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="
                inline-flex items-center justify-center gap-2
                bg-gradient-to-r from-blue-600 to-cyan-600
                text-white px-8 py-4 rounded-xl font-semibold text-lg
                hover:shadow-2xl hover:scale-105
                transition-all duration-300
              "
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Go Home</span>
            </Link>
            <Link
              href="/blog"
              className="
                inline-flex items-center justify-center gap-2
                border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg
                hover:bg-blue-600 hover:text-white
                transition-all duration-300
              "
            >
              <span>Browse Guides</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Popular Pages */}
        <div className="mt-20 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Popular Pages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/blog"
              className="
                group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl
                border border-gray-100 hover:border-blue-300
                transition-all duration-300 hover:-translate-y-1
              "
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Blog Guides
              </h3>
              <p className="text-gray-600 text-sm">
                Expert guides on medical tourism, travel, and K-culture
              </p>
            </Link>

            <Link
              href="/tools"
              className="
                group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl
                border border-gray-100 hover:border-purple-300
                transition-all duration-300 hover:-translate-y-1
              "
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                Interactive Tools
              </h3>
              <p className="text-gray-600 text-sm">
                Fun quizzes, calculators, and generators
              </p>
            </Link>

            <Link
              href="/contact"
              className="
                group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl
                border border-gray-100 hover:border-green-300
                transition-all duration-300 hover:-translate-y-1
              "
            >
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                Contact Us
              </h3>
              <p className="text-gray-600 text-sm">
                Get personalized help for your Korea journey
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
