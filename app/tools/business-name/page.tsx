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
      gradient="from-sky-500 via-blue-500 to-violet-600"
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
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
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
                          ? 'border-violet-500 bg-violet-50 text-violet-700'
                          : 'border-gray-200 hover:border-violet-300 text-gray-700'
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add a keyword to personalize your business name
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-sky-500 to-violet-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-sky-600 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
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
                      <div className="text-sm text-blue-600 font-semibold">
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
            <div className="bg-gradient-to-br from-sky-500 to-violet-600 rounded-3xl p-8 text-center text-white shadow-2xl">
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
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setSelectedName(null);
                  setGeneratedNames([]);
                }}
                className="flex-1 bg-gradient-to-r from-sky-500 to-violet-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-sky-600 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🔄 Generate New Names
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg border-2 border-blue-200"
              >
                📸 Download Image
              </button>
            </div>

            {/* Share Section */}
            <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl p-6 text-center">
              <p className="text-gray-700 mb-4">Share your business name!</p>
              <div className="flex justify-center gap-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent('https://koreaexperience.com/tools/business-name')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://koreaexperience.com/tools/business-name')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>

            {/* Try More Interactive Tools */}
            <div className="bg-gradient-to-r from-sky-100 to-violet-100 rounded-2xl p-8 text-center border-2 border-sky-200 mt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Try More Interactive Tools!
              </h3>
              <p className="text-gray-700 mb-6">
                Discover more about your Korean talents!
              </p>
              <Link
                href="/tools"
                className="inline-block bg-gradient-to-r from-sky-600 to-violet-600 text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
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
