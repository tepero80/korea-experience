import Link from 'next/link';
import { SITE_CONFIG, FOOTER_LINKS } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg blur opacity-50" />
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg">
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted comprehensive guide to Korea - from world-class medical tourism 
              and travel to vibrant K-culture, living guides, and authentic Korean experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
              Categories
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog?category=medical" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  → Medical Tourism
                </Link>
              </li>
              <li>
                <Link href="/blog?category=travel" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  → Travel Guides
                </Link>
              </li>
              <li>
                <Link href="/blog?category=culture" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  → K-Culture
                </Link>
              </li>
              <li>
                <Link href="/blog?category=living" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  → Living in Korea
                </Link>
              </li>
              <li>
                <Link href="/blog?category=food" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  → Food & Dining
                </Link>
              </li>
              <li>
                <Link href="/blog?category=shopping" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                  → Shopping & K-Beauty
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-lg mb-6 relative inline-block">
              Legal
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SSL Secured
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                GDPR Compliant
              </span>
              <span>Affiliate Disclosure</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-center text-gray-600">
            This site contains affiliate links. We may earn a commission from purchases made through these links at no additional cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
