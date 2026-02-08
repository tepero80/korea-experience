'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SITE_CONFIG, NAV_LINKS } from '@/lib/constants';
import Search from './Search';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-sm'
        }
      `}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-3 transition-all duration-200"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-amber-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative bg-gradient-to-br from-amber-600 to-orange-700 p-2 rounded-xl">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="w-6 h-6">
                  <circle cx="13" cy="14" r="8.5" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                  <ellipse cx="13" cy="14" rx="4" ry="8.5" stroke="white" strokeWidth="1" opacity="0.3"/>
                  <line x1="4.5" y1="14" x2="21.5" y2="14" stroke="white" strokeWidth="1" opacity="0.3"/>
                  <path d="M5.5 10h15" stroke="white" strokeWidth="0.8" opacity="0.2"/>
                  <path d="M5.5 18h15" stroke="white" strokeWidth="0.8" opacity="0.2"/>
                  <path d="M4 10.5Q7 6 13 4.5Q19 6 22 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <path d="M6 9Q9.5 6.5 13 5.5Q16.5 6.5 20 9" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
                  <circle cx="4" cy="10.5" r="1" fill="white" opacity="0.8"/>
                  <circle cx="22" cy="10.5" r="1" fill="white" opacity="0.8"/>
                </svg>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-amber-700">
                {SITE_CONFIG.name}
              </span>
              <p className="text-xs text-gray-500 hidden sm:block">Your Guide to Korea</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
              <li 
                key={link.label}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.label)}
                onMouseLeave={() => link.hasDropdown && setOpenDropdown(null)}
              >
                {link.hasDropdown ? (
                  <>
                    {link.href ? (
                      <Link
                        href={link.href}
                        className="
                          px-4 py-2 rounded-lg font-medium text-gray-700
                          hover:text-amber-700 hover:bg-amber-50
                          transition-all duration-200
                          relative group flex items-center gap-1
                        "
                      >
                        {link.label}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                    ) : (
                      <button
                        className="
                          px-4 py-2 rounded-lg font-medium text-gray-700
                          hover:text-amber-700 hover:bg-amber-50
                          transition-all duration-200
                          relative group flex items-center gap-1
                        "
                      >
                        {link.label}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="
                          absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 
                          bg-gradient-to-r from-amber-600 to-orange-500
                          group-hover:w-2/3 transition-all duration-300
                        " />
                      </button>
                    )}
                    
                    {/* Blog Category Dropdown */}
                    {openDropdown === link.label && link.dropdownType === 'blog' && (
                      <div className="absolute top-full left-0 pt-2 w-56 z-50">
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                          {link.blogCategories?.map((cat) => (
                            <Link
                              key={cat.href}
                              href={cat.href}
                              className="
                                flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                hover:bg-amber-50 hover:text-amber-700
                                transition-all duration-150
                              "
                            >
                              <span className="text-lg">{cat.icon}</span>
                              <span className="font-medium">{cat.label}</span>
                            </Link>
                          ))}
                          <div className="mt-1 pt-1 border-t border-gray-100">
                            <Link
                              href="/blog/category"
                              className="
                                flex items-center gap-2 px-4 py-2.5 text-sm text-amber-700
                                hover:bg-amber-50 font-medium
                              "
                            >
                              <span>📂</span>
                              <span>Browse All Categories</span>
                              <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                            <Link
                              href="/blog"
                              className="
                                flex items-center gap-2 px-4 py-2.5 text-sm text-amber-700
                                hover:bg-amber-50 font-medium
                              "
                            >
                              <span>📚</span>
                              <span>All Articles</span>
                              <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tools Dropdown */}
                    {openDropdown === link.label && link.dropdownType === 'tools' && (
                      <div className="absolute top-full left-0 pt-2 w-56 z-50">
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                          {link.items?.map((category) => (
                            <Link
                              key={category.category}
                              href={`/tools#${category.slug}`}
                              className="
                                flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                                hover:bg-amber-50 hover:text-amber-700
                                transition-all duration-150
                              "
                            >
                              <span className="text-lg">{category.icon}</span>
                              <span className="font-medium">{category.category}</span>
                            </Link>
                          ))}
                          <div className="mt-1 pt-1 border-t border-gray-100">
                            <Link
                              href="/tools"
                              className="
                                flex items-center gap-2 px-4 py-2.5 text-sm text-amber-700
                                hover:bg-amber-50 font-medium
                              "
                            >
                              <span>🧰</span>
                              <span>View All Tools</span>
                              <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    href={link.href!}
                    className="
                      px-4 py-2 rounded-lg font-medium text-gray-700
                      hover:text-amber-700 hover:bg-amber-50
                      transition-all duration-200
                      relative group
                    "
                  >
                    {link.label}
                    <span className="
                      absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 
                      bg-gradient-to-r from-amber-600 to-orange-500
                      group-hover:w-2/3 transition-all duration-300
                    " />
                  </Link>
                )}
              </li>
            ))}
            </ul>
            <Search />
          </div>

          {/* Mobile: Search + Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Search />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="
                p-2 rounded-lg text-gray-700
                hover:bg-gray-100 transition-colors
                focus:outline-none focus:ring-2 focus:ring-amber-500
              "
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="py-4 space-y-1 border-t border-gray-100">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                {link.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                      className="
                        w-full flex items-center justify-between px-4 py-3 rounded-lg 
                        font-medium text-gray-700 hover:bg-amber-50
                        transition-all duration-200
                      "
                    >
                      <span>{link.label}</span>
                      <svg 
                        className={`w-4 h-4 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === link.label && link.dropdownType === 'blog' && (
                      <div className="pl-4 mt-2 space-y-1">
                        {link.blogCategories?.map((cat) => (
                          <Link
                            key={cat.href}
                            href={cat.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="
                              flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-600
                              hover:bg-amber-50 hover:text-amber-700
                              transition-all duration-200
                            "
                          >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </Link>
                        ))}
                        <Link
                          href="/blog/category"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="
                            flex items-center gap-3 px-4 py-2 text-sm text-amber-700 font-medium
                            hover:bg-amber-50 rounded-lg
                          "
                        >
                          <span>📂</span>
                          <span>Browse All Categories →</span>
                        </Link>
                        <Link
                          href="/blog"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="
                            flex items-center gap-3 px-4 py-2 text-sm text-amber-700 font-medium
                            hover:bg-amber-50 rounded-lg
                          "
                        >
                          <span>📚</span>
                          <span>All Articles →</span>
                        </Link>
                      </div>
                    )}
                    {openDropdown === link.label && link.dropdownType === 'tools' && (
                      <div className="pl-4 mt-2 space-y-1">
                        {link.items?.map((category) => (
                          <Link
                            key={category.category}
                            href={`/tools#${category.slug}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="
                              flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-600
                              hover:bg-amber-50 hover:text-amber-700
                              transition-all duration-200
                            "
                          >
                            <span>{category.icon}</span>
                            <span>{category.category}</span>
                          </Link>
                        ))}
                        <Link
                          href="/tools"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="
                            flex items-center gap-3 px-4 py-2 text-sm text-amber-700 font-medium
                            hover:bg-amber-50 rounded-lg
                          "
                        >
                          <span>🧰</span>
                          <span>View All Tools →</span>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href!}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="
                      block px-4 py-3 rounded-lg font-medium text-gray-700
                      hover:text-amber-700 hover:bg-amber-50
                      transition-all duration-200
                    "
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
