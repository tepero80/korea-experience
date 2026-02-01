import Link from 'next/link';
import { SITE_CONFIG, NAV_LINKS } from '@/lib/constants';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            {SITE_CONFIG.name}
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            aria-label="Menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation - will add functionality later */}
        {/* <div className="md:hidden mt-4">
          Mobile menu items
        </div> */}
      </nav>
    </header>
  );
}
