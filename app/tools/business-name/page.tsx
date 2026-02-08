'use client';

import { useState } from 'react';
import Link from 'next/link';
import ToolLayout from '@/components/ToolLayout';
import { 
  generateMultipleBusinessNames, 
  BUSINESS_CATEGORIES,
  type BusinessNameResult 
} from '@/lib/korean-business-name';

export default function BusinessNameGenerator() {
  const [category, setCategory] = useState<keyof typeof BUSINESS_CATEGORIES>('cafe');
  const [style, setStyle] = useState<'modern' | 'traditional' | 'luxury' | 'casual' | 'trendy'>('modern');
  const [keyword, setKeyword] = useState('');
  const [generatedNames, setGeneratedNames] = useState<BusinessNameResult[]>([]);
  const [selectedName, setSelectedName] = useState<BusinessNameResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const names = generateMultipleBusinessNames(category, style, 6, keyword || undefined);
      setGeneratedNames(names);
      setSelectedName(names[0]);
      setIsGenerating(false);
    }, 500);
  };

  const handleDownload = () => {
    if (!selectedName) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 500);
    gradient.addColorStop(0, '#0ea5e9');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Your Korean Business Name', 400, 60);
    
    // Korean name
    ctx.font = 'bold 48px Arial';
    ctx.fillText(selectedName.korean, 400, 130);
    
    // English name
    ctx.font = '32px Arial';
    ctx.fillText(selectedName.english, 400, 180);
    
    // Tagline
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(selectedName.tagline, 400, 230);
    
    // Description
    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
    const words = selectedName.description.split(' ');
    let line = '';
    let y = 280;
    
    words.forEach((word, index) => {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 700 && index > 0) {
        ctx.fillText(line, 400, y);
        line = word + ' ';
        y += 28;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, 400, y);
    
    // Footer
    ctx.font = 'bold 22px Arial';
    ctx.fillText('🇰🇷 Korea Experience', 400, 460);
    
    // Download
    const link = document.createElement('a');
    link.download = `business-name-${selectedName.korean}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareText = selectedName 
    ? `Check out my Korean business name: ${selectedName.korean} (${selectedName.english})! ${selectedName.tagline}`
    : '';

  return (
    <ToolLayout
      title="Korean Business Name Generator"
      description="Generate the perfect Korean business name for your brand"
      emoji="🏢"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {!selectedName ? (
          <>
            {/* Input Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Business Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(BUSINESS_CATEGORIES).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setCategory(key as keyof typeof BUSINESS_CATEGORIES)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        category === key
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 hover:border-amber-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold text-sm">{data.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Business Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {['modern', 'traditional', 'luxury', 'casual', 'trendy'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s as typeof style)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        style === s
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 hover:border-amber-300 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold text-sm capitalize">{s}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keyword (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Keyword (Optional)
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., dream, star, fresh..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add a keyword to personalize your business name
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isGenerating ? '✨ Generating...' : '🎯 Generate Business Names'}
              </button>
            </div>

            {/* Generated Names Grid */}
            {generatedNames.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Choose Your Business Name
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedNames.map((name, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedName(name)}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-400 text-left"
                    >
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {name.korean}
                      </div>
                      <div className="text-lg text-gray-600 mb-2">
                        {name.english}
                      </div>
                      <div className="text-sm text-amber-700 font-semibold">
                        {name.tagline}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Result Display */
          <div className="space-y-6">
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-center text-white shadow-2xl">
              <div className="text-6xl mb-4">🏢</div>
              <h2 className="text-4xl font-bold mb-2">{selectedName.korean}</h2>
              <p className="text-2xl mb-1 opacity-90">{selectedName.english}</p>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 inline-block mt-4">
                <span className="text-lg font-semibold">{selectedName.tagline}</span>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Brand Description</h3>
              <p className="text-gray-700 leading-relaxed">{selectedName.description}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Brand Story</h3>
              <p className="text-gray-700 leading-relaxed">{selectedName.brandStory}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Meaning</h3>
              <p className="text-gray-700">{selectedName.meaning}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Target Customer</h3>
              <p className="text-gray-700">{selectedName.targetCustomer}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Brand Vibe</h3>
              <div className="flex flex-wrap gap-2">
                {selectedName.vibe.map((v, index) => (
                  <span
                    key={index}
                    className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Your Result */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 text-center">Share Your Result!</h3>
              
              {/* SNS Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent('https://koreaexperience.com/tools/business-name')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                  Twitter
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://koreaexperience.com/tools/business-name')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#4267B2] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>

                <a
                  href={`https://www.instagram.com/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-orange-600 to-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </a>

                <a
                  href={`https://www.threads.net/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 14.787c-.045.426-.3.829-.718 1.144-1.053.792-2.629 1.181-4.176 1.181-2.128 0-4.014-.676-5.002-1.793-.494-.558-.741-1.178-.741-1.85 0-.386.145-.739.41-1.004.265-.264.618-.41 1.004-.41.739 0 1.339.557 1.414 1.267.09.865.774 1.535 1.624 1.535.459 0 .894-.173 1.225-.486.331-.314.513-.732.513-1.179 0-.447-.182-.865-.513-1.179-.331-.313-.766-.486-1.225-.486h-.586c-.35 0-.673-.135-.913-.381-.24-.246-.372-.575-.372-.926s.132-.68.372-.926c.24-.246.563-.381.913-.381h.586c1.832 0 3.317 1.485 3.317 3.317 0 .887-.359 1.739-1.003 2.383z" />
                  </svg>
                  Threads
                </a>
              </div>

              {/* Copy Link & Download */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://koreaexperience.com/tools/business-name');
                    alert('Link copied to clipboard!');
                  }}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </button>

                <button
                  onClick={handleDownload}
                  className="w-full bg-white text-amber-700 font-semibold py-3 px-6 rounded-lg border-2 border-amber-600 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Result Image
                </button>
              </div>
            </div>

            {/* Try Again Button */}
            <button
              onClick={() => {
                setSelectedName(null);
                setGeneratedNames([]);
              }}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              🔄 Try Again
            </button>

            {/* Try More Interactive Tools */}
            <div className="bg-gradient-to-r from-amber-100 to-amber-100 rounded-2xl p-8 text-center border-2 border-amber-200 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Try More Interactive Tools!
              </h3>
              <p className="text-gray-700 mb-6">
                Discover more about your Korean identity
              </p>
              <Link
                href="/tools"
                className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
              >
                Explore All Tools
              </Link>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
