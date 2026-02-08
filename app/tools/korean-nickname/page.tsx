'use client';

import { useState } from 'react';
import Link from 'next/link';
import ToolLayout from '@/components/ToolLayout';
import { GeneratorResult } from '@/components/tools/results/GeneratorResult';
import { ToastContainer } from '@/components/tools/ToastContainer';
import { useCanvasDownload, useToast } from '@/hooks';
import { generateKoreanNickname, type NicknameResult } from '@/lib/korean-nickname';

export default function KoreanNicknamePage() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState<'cute' | 'cool' | 'unique'>('cute');
  const [options, setOptions] = useState<NicknameResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<NicknameResult | null>(null);
  
  const { toasts, showToast } = useToast();
  
  const { generateImage } = useCanvasDownload({
    width: 1200,
    height: 630,
    filename: 'korean-nickname-result.png'
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your name!', 'error');
      return;
    }
    
    const results = generateKoreanNickname(name.trim(), style);
    setOptions(results);
  };

  const handleSelect = (result: NicknameResult) => {
    setSelectedResult(result);
  };

  const handleReset = () => {
    setName('');
    setStyle('cute');
    setOptions([]);
    setSelectedResult(null);
  };

  const handleRegenerate = () => {
    setSelectedResult(null);
  };

  const handleDownload = () => {
    if (!selectedResult) return;
    
    generateImage((ctx, canvas) => {
      // Render nickname result
      ctx.fillStyle = 'white';
      ctx.font = 'bold 72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(selectedResult.nickname, canvas.width / 2, 200);
      
      ctx.font = 'bold 56px sans-serif';
      ctx.fillText(selectedResult.nicknameKo, canvas.width / 2, 300);
      
      ctx.font = '32px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(selectedResult.meaning, canvas.width / 2, 400);
      
      ctx.font = '28px sans-serif';
      ctx.fillText('🇰🇷 Korea Experience', canvas.width / 2, 550);
    });
    
    showToast('✅ Image downloaded successfully!');
  };

  return (
    <>
      <ToastContainer toasts={toasts} />
      <ToolLayout
        title="Korean Nickname Generator"
        description="Get your perfect Korean nickname! Generate cute, cool, or unique Korean-style nicknames with meanings."
        emoji="🏷️"
      >
        {!selectedResult ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nickname Style
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setStyle('cute')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      style === 'cute'
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🥰 Cute
                  </button>
                  <button
                    type="button"
                    onClick={() => setStyle('cool')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      style === 'cool'
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    😎 Cool
                  </button>
                  <button
                    type="button"
                    onClick={() => setStyle('unique')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      style === 'unique'
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ✨ Unique
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all"
              >
                Generate Nicknames
              </button>
            </form>

            {options.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Choose Your Nickname:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(option)}
                      className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all text-left"
                    >
                      <div className="text-2xl font-bold text-amber-700">
                        {option.nickname}
                      </div>
                      <div className="text-lg text-gray-700 mt-1">
                        {option.nicknameKo}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {option.meaning}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <GeneratorResult
            emoji="🏷️"
            mainResult={{
              primary: selectedResult.nickname,
              secondary: selectedResult.nicknameKo,
              pronunciation: selectedResult.pronunciation
            }}
            meaning={{
              title: 'Meaning',
              description: selectedResult.meaning
            }}
            shareConfig={{
              toolSlug: 'korean-nickname',
              shareText: (r) => `My Korean nickname is ${r.nickname} (${r.nicknameKo})! 🏷️ What's yours?`,
              result: selectedResult
            }}
            onReset={handleReset}
            onRegenerate={handleRegenerate}
            onDownload={handleDownload}
          />
        )}

        {/* Try More Interactive Tools CTA */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 text-center border-2 border-amber-200 mt-12">
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
      </ToolLayout>
    </>
  );
}
