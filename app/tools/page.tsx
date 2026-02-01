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

  // Group tools by priority (Week 1, Week 2, etc.)
  const week1Tools = filteredTools.filter(t => t.id >= 1 && t.id <= 5);
  const week2Tools = filteredTools.filter(t => t.id >= 6 && t.id <= 10);
  const week3Tools = filteredTools.filter(t => t.id >= 11 && t.id <= 15);
  const laterTools = filteredTools.filter(t => t.id >= 16 && t.id <= 20);

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-2xl">🎯</span>
              <span className="text-sm font-semibold">20 Interactive Tools</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Interactive Korea Tools
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto">
              Fun quizzes, calculators, and generators to explore Korean culture, plan your trip, and discover more about Korea
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-6 py-2.5 rounded-full font-semibold text-sm
                  transition-all duration-200
                  ${selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-purple-600">{filteredTools.length}</span> tools
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid - Week 1 Priority */}
      {week1Tools.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">⭐</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Top Priority Tools
                </h2>
                <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Week 1
                </span>
              </div>
              <p className="text-gray-600">Highest viral potential - Coming very soon!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {week1Tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} priority="high" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools Grid - Week 2 Priority */}
      {week2Tools.length > 0 && (
        <section className="py-12 bg-purple-50/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💎</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  High Priority Tools
                </h2>
                <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Week 2
                </span>
              </div>
              <p className="text-gray-600">Strong engagement expected</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {week2Tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} priority="medium" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools Grid - Week 3-4 Priority */}
      {week3Tools.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🎨</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Medium Priority Tools
                </h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Week 3-4
                </span>
              </div>
              <p className="text-gray-600">Building out the collection</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {week3Tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} priority="normal" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools Grid - Later Priority */}
      {laterTools.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">✨</span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Expansion Tools
                </h2>
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Month 2+
                </span>
              </div>
              <p className="text-gray-600">More tools for diverse interests</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {laterTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} priority="low" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Want to Stay Updated?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              New tools are being added every week. Check back soon for more interactive experiences!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="
                  bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg
                  hover:shadow-2xl hover:scale-105 transition-all duration-300
                "
              >
                Browse Blog Guides
              </Link>
              <Link
                href="/contact"
                className="
                  border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg
                  hover:bg-white hover:text-purple-600 transition-all duration-300
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
    high: 'from-purple-500 to-pink-500',
    medium: 'from-pink-500 to-rose-500',
    normal: 'from-blue-500 to-cyan-500',
    low: 'from-gray-500 to-slate-500',
  };

  const priorityBadgeColors = {
    high: 'bg-purple-100 text-purple-700',
    medium: 'bg-pink-100 text-pink-700',
    normal: 'bg-blue-100 text-blue-700',
    low: 'bg-gray-100 text-gray-700',
  };

  return (
    <Link
      href={tool.href}
      className="
        group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl
        border-2 border-gray-100 hover:border-purple-300
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
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
        {tool.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed min-h-[3rem]">
        {tool.description}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-purple-600">{tool.category}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <span>{tool.difficulty}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold">{tool.viral}%</span>
          </div>
        </div>
      </div>

      {/* Hover Arrow */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </Link>
  );
}
