'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SITE_CONFIG, NAV_LINKS } from '@/lib/constants';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity" />
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
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {SITE_CONFIG.name}
              </span>
              <p className="text-xs text-gray-500 hidden sm:block">Your Guide to Korea</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className="
                    px-4 py-2 rounded-lg font-medium text-gray-700
                    hover:text-blue-600 hover:bg-blue-50
                    transition-all duration-200
                    relative group
                  "
                >
                  {link.label}
                  <span className="
                    absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 
                    bg-gradient-to-r from-blue-600 to-cyan-500
                    group-hover:w-2/3 transition-all duration-300
                  " />
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/contact"
              className="
                bg-gradient-to-r from-blue-600 to-cyan-500
                text-white px-6 py-2.5 rounded-lg font-semibold
                hover:shadow-lg hover:scale-105
                transition-all duration-200
                relative overflow-hidden group
              "
            >
              <span className="relative z-10">Get Started</span>
              <div className="
                absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
              " />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="
              md:hidden p-2 rounded-lg text-gray-700
              hover:bg-gray-100 transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500
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

        {/* Mobile Menu */}
        <div 
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="py-4 space-y-1 border-t border-gray-100">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="
                  block px-4 py-3 rounded-lg font-medium text-gray-700
                  hover:text-blue-600 hover:bg-blue-50
                  transition-all duration-200
                "
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="
                block mx-4 mt-4 text-center
                bg-gradient-to-r from-blue-600 to-cyan-500
                text-white px-6 py-3 rounded-lg font-semibold
                hover:shadow-lg transition-all duration-200
              "
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
