'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ALL_TOOLS } from '@/lib/constants';

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(ALL_TOOLS.map(tool => tool.category)))];

  // Filter tools by category
  const filteredTools = selectedCategory === 'All' 
    ? ALL_TOOLS 
    : ALL_TOOLS.filter(tool => tool.category === selectedCategory);

  // Group tools by category
  const discoverTools = filteredTools.filter(t => t.category === 'Discover Yourself');
  const loveTools = filteredTools.filter(t => t.category === 'Love & Relationships');
  const funTools = filteredTools.filter(t => t.category === 'Fun & Entertainment');
  const tripTools = filteredTools.filter(t => t.category === 'Plan Your Korea Trip');
  const lifeTools = filteredTools.filter(t => t.category === 'Life in Korea');

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-semibold text-amber-700">22 Interactive Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 mb-3">
            Interactive Korea Tools
          </h1>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl">
            Fun quizzes, calculators, and generators to explore Korean culture, plan your trip, and discover more about Korea
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-4 bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Horizontal scrollable categories for mobile */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2 min-w-max pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap
                    transition-all duration-200 flex-shrink-0
                    ${selectedCategory === category
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-xs text-gray-600">
              Showing <span className="font-semibold text-amber-700">{filteredTools.length}</span> tools
            </p>
          </div>
        </div>
      </section>

      {/* Discover Yourself */}
      {discoverTools.length > 0 && (
        <section id="discover-yourself" className="py-12 scroll-mt-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🎯</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Discover Yourself
                </h2>
              </div>
              <p className="text-gray-600">Find out more about your Korean identity and personality</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoverTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} priority="high" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Love & Relationships */}
      {loveTools.length > 0 && (
        <section id="love-relationships" className="py-12 bg-orange-50/30 scroll-mt-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💕</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Love & Relationships
                </h2>
              </div>
              <p className="text-gray-600">Explore Korean romance and relationship compatibility</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loveTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} priority="medium" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fun & Entertainment */}
      {funTools.length > 0 && (
        <section id="fun-entertainment" className="py-12 scroll-mt-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🎮</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Fun & Entertainment
                </h2>
              </div>
              <p className="text-gray-600">Games, quizzes, and creative generators for fun</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {funTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} priority="normal" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Plan Your Korea Trip */}
      {tripTools.length > 0 && (
        <section id="plan-your-korea-trip" className="py-12 bg-amber-50/30 scroll-mt-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">✈️</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Plan Your Korea Trip
                </h2>
              </div>
              <p className="text-gray-600">Essential calculators for planning your perfect Korean adventure</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} priority="normal" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Life in Korea */}
      {lifeTools.length > 0 && (
        <section id="life-in-korea" className="py-12 scroll-mt-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🏢</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Life in Korea
                </h2>
              </div>
              <p className="text-gray-600">Practical tools for living and working in Korea</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lifeTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} priority="low" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Want to Stay Updated?
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              New tools are being added every week. Check back soon for more interactive experiences!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="
                  bg-white text-amber-700 px-8 py-4 rounded-xl font-semibold text-lg
                  hover:shadow-2xl hover:scale-105 transition-all duration-300
                "
              >
                Browse Blog Guides
              </Link>
              <Link
                href="/contact"
                className="
                  border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg
                  hover:bg-white hover:text-amber-700 transition-all duration-300
                "
              >
                Suggest a Tool
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ToolCardProps {
  tool: {
    id: number;
    href: string;
    title: string;
    category: string;
    difficulty: string;
    viral: number;
    description: string;
    icon: string;
    status: string;
  };
  priority: 'high' | 'medium' | 'normal' | 'low';
}

function ToolCard({ tool, priority }: ToolCardProps) {
  const priorityColors = {
    high: 'from-amber-500 to-orange-500',
    medium: 'from-orange-500 to-orange-500',
    normal: 'from-amber-500 to-orange-500',
    low: 'from-gray-500 to-slate-500',
  };

  const priorityBadgeColors = {
    high: 'bg-amber-100 text-amber-700',
    medium: 'bg-orange-100 text-orange-700',
    normal: 'bg-amber-100 text-amber-700',
    low: 'bg-gray-100 text-gray-700',
  };

  return (
    <Link
      href={tool.href}
      className="
        group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl
        border-2 border-gray-100 hover:border-amber-300
        transition-all duration-300 hover:-translate-y-2
        overflow-hidden
      "
    >
      {/* Priority Gradient Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${priorityColors[priority]}`} />

      {/* Status Badge */}
      {tool.status === 'coming' && (
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1 ${priorityBadgeColors[priority]} text-xs font-semibold px-2.5 py-1 rounded-full`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Coming Soon
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
        {tool.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
        {tool.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed min-h-[3rem]">
        {tool.description}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-700">{tool.category}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <span>{tool.difficulty}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold">{tool.viral}%</span>
          </div>
        </div>
      </div>

      {/* Hover Arrow */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </Link>
  );
}
