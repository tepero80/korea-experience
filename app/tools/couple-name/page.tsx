'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { generateCoupleNames, getCoupleEmojis, getRelationshipTerms, type CoupleNameResult } from '@/lib/korean-couple-name';

export default function KoreanCoupleNamePage() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [results, setResults] = useState<CoupleNameResult[]>([]);

  const emojis = getCoupleEmojis();
  const terms = getRelationshipTerms();

  const handleGenerate = () => {
    if (name1.trim() && name2.trim()) {
      const coupleNames = generateCoupleNames(name1, name2);
      setResults(coupleNames);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard! 💕');
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.koreaexperience.com/tools/couple-name';

  const shareText = results.length > 0
    ? `Our couple name is: ${results[0].name} 💕 Create yours!`
    : '';

  const handleDownloadImage = () => {
    if (results.length === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pink-Rose gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 500);
    gradient.addColorStop(0, '#d97706'); // pink-500
    gradient.addColorStop(0.5, '#ea580c'); // rose-500
    gradient.addColorStop(1, '#d97706'); // pink-500
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Our Couple Name', 400, 60);

    // Names
    ctx.font = '24px Arial';
    ctx.fillText(`${name1} + ${name2}`, 400, 100);

    // Heart emoji
    ctx.font = '60px Arial';
    ctx.fillText('💕', 400, 170);

    // Couple name
    ctx.font = 'bold 48px Arial';
    ctx.fillText(results[0].name, 400, 240);

    // Korean version
    ctx.font = '32px Arial';
    ctx.fillText(results[0].nameKo, 400, 285);

    // Method
    ctx.font = 'italic 20px Arial';
    ctx.fillStyle = '#fef3c7'; // yellow-100
    ctx.fillText(results[0].method, 400, 320);

    // Description
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    ctx.fillText(results[0].description, 400, 360);

    // Additional names
    ctx.font = '16px Arial';
    ctx.fillText(`Also try: ${results.slice(1, 3).map(r => r.name).join(', ')}`, 400, 400);

    // Footer
    ctx.font = '16px Arial';
    ctx.fillText('koreaexperience.com/tools/couple-name', 400, 470);

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `couple-name-${results[0].id}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <ToolLayout
      title="Korean Couple Name Combiner"
      description="Create the perfect couple nickname by combining two names! Perfect for couples, best friends, and K-drama fans."
      emoji="💕"
    >
      <div className="space-y-8">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Two Names</h2>
          
          <div className="space-y-6">
            {/* Name Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="e.g., Sarah"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Second Name
                </label>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="e.g., John"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
                  maxLength={20}
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!name1.trim() || !name2.trim()}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-500 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💕 Generate Couple Names
            </button>
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-500 rounded-2xl p-8 text-white text-center">
              <div className="text-2xl mb-3">{name1} + {name2}</div>
              <div className="text-6xl mb-4">💕</div>
              <div className="text-5xl font-bold mb-2">{results[0].name}</div>
              <div className="text-3xl mb-4 opacity-90">{results[0].nameKo}</div>
              <div className="text-lg italic opacity-80 mb-2">{results[0].method}</div>
              <p className="text-white/90 mb-6">{results[0].description}</p>
              <button
                onClick={() => handleCopy(results[0].name)}
                className="px-8 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-bold"
              >
                📋 Copy This Name
              </button>
            </div>

            {/* All Variations */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">All Couple Name Variations 💖</h3>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className="bg-gradient-to-r from-orange-50 to-orange-50 rounded-lg p-6 border border-orange-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '💝'}</span>
                          <div>
                            <h4 className="text-2xl font-bold text-gray-900">{result.name}</h4>
                            <p className="text-lg text-gray-600">{result.nameKo}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-orange-600 mb-2">{result.method}</p>
                        <p className="text-gray-700 mb-2">{result.description}</p>
                        <p className="text-sm text-gray-500">Vibe: {result.vibe}</p>
                        <p className="text-sm text-gray-400 italic mt-1">Example: {result.example}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(result.name)}
                        className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Couple Emojis */}
            <div className="bg-orange-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Couple Emojis to Add 💕</h3>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleCopy(emoji)}
                    className="text-4xl hover:scale-110 transition-transform bg-white rounded-lg p-3 shadow-sm hover:shadow-md"
                    title="Click to copy"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Relationship Terms */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sweet Relationship Terms ❤️</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {terms.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleCopy(term)}
                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Couple Name! 💕</h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-500 transition-colors font-medium"
                >
                  Share on Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  Share on Facebook
                </a>
                <a
                  href={`https://www.instagram.com/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-colors font-medium"
                >
                  Share on Instagram
                </a>
                <a
                  href={`https://www.threads.net/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Share on Threads
                </a>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => handleCopy(currentUrl)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  📋 Copy Link
                </button>
                <button
                  onClick={handleDownloadImage}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-500 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-colors font-medium"
                >
                  💾 Download Image
                </button>
              </div>
            </div>

            {/* Try Again */}
            <div className="text-center pt-4">
              <button
                onClick={() => {
                  setName1('');
                  setName2('');
                  setResults([]);
                }}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-500 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-bold text-lg shadow-lg"
              >
                🔄 Try New Names
              </button>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Try More Tools!</h3>
              <p className="text-gray-600 mb-4">
                Discover more fun and interactive Korean culture tools
              </p>
              <a
                href="/tools"
                className="inline-block px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-colors font-medium"
              >
                Explore All Tools →
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
