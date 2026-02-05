'use client';

import { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content?: string;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchResult> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search index
  useEffect(() => {
    setIsLoading(true);
    fetch('/search-index.json')
      .then(res => res.json())
      .then((data: SearchResult[]) => {
        // Sort data to prioritize Deep Dive articles
        const sortedData = [...data].sort((a, b) => {
          const aIsDeepDive = a.slug.includes('deep-dive') || (a as any).deepDive;
          const bIsDeepDive = b.slug.includes('deep-dive') || (b as any).deepDive;
          if (aIsDeepDive && !bIsDeepDive) return -1;
          if (!aIsDeepDive && bIsDeepDive) return 1;
          return 0;
        });

        const fuseInstance = new Fuse<SearchResult>(sortedData, {
          keys: [
            { name: 'title', weight: 2 },
            { name: 'excerpt', weight: 1.5 },
            { name: 'category', weight: 1 },
            { name: 'content', weight: 0.5 }
          ],
          threshold: 0.3,
          ignoreLocation: true,
          includeScore: true,
          // Sort by score, then prioritize Deep Dive articles
          sortFn: (a, b) => {
            const aItem = sortedData[a.idx];
            const bItem = sortedData[b.idx];
            const aIsDeepDive = aItem.slug.includes('deep-dive') || (aItem as any).deepDive;
            const bIsDeepDive = bItem.slug.includes('deep-dive') || (bItem as any).deepDive;
            
            // If scores are similar (within 0.1), prioritize Deep Dive
            if (Math.abs(a.score! - b.score!) < 0.1) {
              if (aIsDeepDive && !bIsDeepDive) return -1;
              if (!aIsDeepDive && bIsDeepDive) return 1;
            }
            
            return a.score! - b.score!;
          }
        });
        setFuse(fuseInstance);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load search index:', err);
        setIsLoading(false);
      });
  }, []);

  // Search on query change
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      return;
    }
    
    const searchResults = fuse.search(query, { limit: 8 });
    setResults(searchResults.map(r => r.item));
  }, [query, fuse]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          flex items-center gap-3 px-5 py-2.5 rounded-lg 
          bg-gradient-to-r from-blue-50 to-cyan-50
          border-2 border-blue-200
          hover:border-blue-400 hover:from-blue-100 hover:to-cyan-100
          transition-all duration-200
          shadow-sm hover:shadow-md
          md:min-w-[200px]
        "
        aria-label="Search"
      >
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-gray-900 font-medium md:inline">Search</span>
        <kbd className="hidden lg:inline px-2.5 py-1 text-xs bg-white text-blue-600 font-semibold rounded border-2 border-blue-300 shadow-sm ml-auto">
          {typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl'}K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search 601 articles..."
                className="flex-1 text-lg outline-none placeholder-gray-400"
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-gray-400 hover:text-gray-600 transition"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  <svg className="w-8 h-8 animate-spin mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading search index...
                </div>
              ) : results.length > 0 ? (
                results.map((result, index) => {
                  const isDeepDive = result.slug.includes('deep-dive') || (result as any).deepDive;
                  return (
                    <Link
                      key={result.slug}
                      href={`/blog/${result.slug}`}
                      onClick={handleResultClick}
                      className={`block p-4 hover:bg-blue-50 border-b border-gray-100 transition-colors group ${isDeepDive ? 'bg-gradient-to-r from-blue-50/30 to-cyan-50/30' : ''}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {isDeepDive && (
                          <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded font-semibold flex items-center gap-1">
                            🔬 Deep Dive
                          </span>
                        )}
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                          {result.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {result.excerpt}
                      </p>
                    </Link>
                  );
                })
              ) : query ? (
                <div className="p-8 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium mb-1">No results found</p>
                  <p className="text-sm">Try different keywords</p>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium mb-1">Start typing to search</p>
                  <p className="text-sm">Search across 601 articles</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white rounded border border-gray-300">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white rounded border border-gray-300">↵</kbd>
                  Select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white rounded border border-gray-300">ESC</kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
