'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { generateEmojiName, getAllStyles, type EmojiNameResult } from '@/lib/korean-emoji-name';

export default function KoreanEmojiNamePage() {
  const [name, setName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'cute' | 'cool' | 'elegant'>('cute');
  const [result, setResult] = useState<EmojiNameResult | null>(null);

  const styles = getAllStyles();

  const handleGenerate = () => {
    if (name.trim()) {
      const emojiName = generateEmojiName(name, selectedStyle);
      setResult(emojiName);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard! 📋');
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.koreaexperience.com/tools/emoji-name';

  const shareText = result 
    ? `My emoji name is: ${result.emojis} ✨ Create yours!`
    : '';

  const handleDownloadImage = () => {
    if (!result) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Rainbow gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 500);
    gradient.addColorStop(0, '#d97706'); // pink
    gradient.addColorStop(0.25, '#ea580c'); // purple
    gradient.addColorStop(0.5, '#3b82f6'); // blue
    gradient.addColorStop(0.75, '#10b981'); // green
    gradient.addColorStop(1, '#f59e0b'); // yellow
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Your Korean Emoji Name', 400, 60);

    // Original name
    ctx.font = '28px Arial';
    ctx.fillText(`"${name}"`, 400, 110);

    // Emoji name (large)
    ctx.font = '80px Arial';
    ctx.fillText(result.emojis, 400, 220);

    // Style
    ctx.font = 'italic 24px Arial';
    ctx.fillText(`${result.style} Style`, 400, 280);

    // Description
    ctx.font = '18px Arial';
    const words = result.description.split(' ');
    let line = '';
    let y = 330;
    const maxWidth = 700;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, 400, y);
        line = words[i] + ' ';
        y += 25;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 400, y);

    // Footer
    ctx.font = '16px Arial';
    ctx.fillText('koreaexperience.com/tools/emoji-name', 400, 470);

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `emoji-name-${result.id}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <ToolLayout
      title="Your Korean Emoji Name"
      description="Transform your name into beautiful emojis! Perfect for Instagram bios, social media, and making your name stand out."
      emoji="✨"
    >
      <div className="space-y-8">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Name</h2>
          
          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sarah"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none text-lg"
                maxLength={20}
              />
              <p className="text-sm text-gray-500 mt-1">
                English letters only (max 20 characters)
              </p>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Your Style
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedStyle === style.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{style.emoji}</div>
                    <div className="font-bold text-gray-900">{style.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{style.nameKo}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!name.trim()}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✨ Generate Emoji Name
            </button>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-orange-500 via-purple-500 to-amber-500 rounded-2xl p-8 text-white text-center">
              <div className="text-8xl mb-4">{result.emojis}</div>
              <h3 className="text-3xl font-bold mb-2">{result.style}</h3>
              <p className="text-xl opacity-90">{result.styleKo}</p>
              <button
                onClick={() => handleCopy(result.emojis)}
                className="mt-6 px-8 py-3 bg-white text-amber-700 rounded-lg hover:bg-gray-100 transition-colors font-bold"
              >
                📋 Copy Emojis
              </button>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">About Your Emoji Name</h3>
              <p className="text-gray-700 text-lg mb-6">{result.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Vibe</h4>
                  <p className="text-gray-600">{result.vibe}</p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Best For</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.bestFor.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Alternatives */}
            <div className="bg-amber-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Alternative Versions ✨</h3>
              <div className="space-y-3">
                {result.alternatives.map((alt, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-lg p-4">
                    <span className="text-4xl">{alt}</span>
                    <button
                      onClick={() => handleCopy(alt)}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Emoji Name! ✨</h3>
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
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-colors font-medium"
                >
                  💾 Download Image
                </button>
              </div>
            </div>

            {/* Try Again */}
            <div className="text-center pt-4">
              <button
                onClick={() => {
                  setName('');
                  setResult(null);
                }}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-bold text-lg shadow-lg"
              >
                🔄 Try Another Name
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
