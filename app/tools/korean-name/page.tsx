'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateMultipleNames, type GeneratedKoreanName } from '@/lib/name-generator';

export default function KoreanNameGeneratorPage() {
  const [englishName, setEnglishName] = useState('');
  const [generatedNames, setGeneratedNames] = useState<GeneratedKoreanName[]>([]);
  const [selectedName, setSelectedName] = useState<GeneratedKoreanName | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    setError('');
    
    if (!englishName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (englishName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      try {
        const names = generateMultipleNames(englishName.trim(), 6);
        setGeneratedNames(names);
        setSelectedName(names[0]);
      } catch (err) {
        setError('Failed to generate name. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const handleShare = async () => {
    if (!selectedName) return;
    
    const text = `My Korean name is ${selectedName.fullName.korean} (${selectedName.fullName.romanized})! Generate yours at koreaexperience.com/tools/korean-name`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (!selectedName) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 400);
    gradient.addColorStop(0, '#9333ea');
    gradient.addColorStop(1, '#ec4899');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 400);
    
    // Korean name (large)
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(selectedName.fullName.korean, 400, 150);
    
    // Romanized name
    ctx.font = 'bold 40px Arial';
    ctx.fillText(selectedName.fullName.romanized, 400, 220);
    
    // Meaning
    ctx.font = '24px Arial';
    ctx.fillText(`${selectedName.givenName.meaning}`, 400, 280);
    
    // URL
    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('koreaexperience.com/tools/korean-name', 400, 360);
    
    // Download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `korean-name-${selectedName.fullName.romanized.replace(/ /g, '-')}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold mb-6 group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Tools
            </Link>
            
            <div className="text-6xl mb-6 animate-bounce">🇰🇷</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Korean Name Generator
            </h1>
            <p className="text-xl md:text-2xl text-purple-100">
              Discover your beautiful Korean name with meaning
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Input Form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-100 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                What's your name?
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="englishName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter your name (English)
                  </label>
                  <input
                    id="englishName"
                    type="text"
                    value={englishName}
                    onChange={(e) => setEnglishName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="e.g., Sarah, Michael, Emma..."
                    className="
                      w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl
                      focus:border-purple-500 focus:ring-4 focus:ring-purple-100
                      transition-all duration-200 outline-none
                    "
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="
                    w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white
                    px-8 py-4 rounded-xl font-bold text-lg
                    hover:shadow-2xl hover:scale-105 transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  "
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    '✨ Generate Korean Name'
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {generatedNames.length > 0 && selectedName && (
              <>
                {/* Selected Name Display */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl border-2 border-purple-200 mb-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full mb-4">
                      <span className="text-sm font-bold">✨ Your Korean Name</span>
                    </div>
                    
                    <div className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                      {selectedName.fullName.korean}
                    </div>
                    
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      {selectedName.fullName.romanized}
                    </div>
                    
                    {/* Name Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
                      <div className="bg-white rounded-xl p-4 border-2 border-purple-100">
                        <div className="text-sm text-gray-600 mb-1">Surname</div>
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {selectedName.surname.korean} ({selectedName.surname.romanized})
                        </div>
                        <div className="text-sm text-gray-700">
                          Meaning: {selectedName.surname.meaning}
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 border-2 border-pink-100">
                        <div className="text-sm text-gray-600 mb-1">Given Name</div>
                        <div className="text-2xl font-bold text-pink-600 mb-1">
                          {selectedName.givenName.korean} ({selectedName.givenName.romanized})
                        </div>
                        <div className="text-sm text-gray-700">
                          Meaning: {selectedName.givenName.meaning}
                        </div>
                      </div>
                    </div>
                    
                    {/* Gender Badge */}
                    <div className="mb-6">
                      <span className={`
                        inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                        ${selectedName.gender === 'male' ? 'bg-blue-100 text-blue-700' : 
                          selectedName.gender === 'female' ? 'bg-pink-100 text-pink-700' : 
                          'bg-gray-100 text-gray-700'}
                      `}>
                        {selectedName.gender === 'male' ? '👨 Male' : 
                         selectedName.gender === 'female' ? '👩 Female' : 
                         '🧑 Gender Neutral'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleShare}
                      className="
                        inline-flex items-center justify-center gap-2
                        bg-white text-purple-600 border-2 border-purple-600
                        px-6 py-3 rounded-xl font-semibold
                        hover:bg-purple-600 hover:text-white transition-all duration-300
                      "
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      Share
                    </button>
                    
                    <button
                      onClick={handleDownload}
                      className="
                        inline-flex items-center justify-center gap-2
                        bg-gradient-to-r from-purple-600 to-pink-600 text-white
                        px-6 py-3 rounded-xl font-semibold
                        hover:shadow-xl hover:scale-105 transition-all duration-300
                      "
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download Image
                    </button>
                  </div>
                </div>

                {/* Other Name Options */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Other Name Options
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedNames.map((name, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedName(name)}
                        className={`
                          text-left p-6 rounded-xl border-2 transition-all duration-300
                          ${selectedName === name
                            ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-400 shadow-lg scale-105'
                            : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                          }
                        `}
                      >
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                          {name.fullName.korean}
                        </div>
                        <div className="text-lg font-semibold text-gray-900 mb-1">
                          {name.fullName.romanized}
                        </div>
                        <div className="text-sm text-gray-600">
                          {name.givenName.meaning}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Information Section */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                About Korean Names
              </h3>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Korean names typically consist of a family name (surname) followed by a given name. 
                  The most common Korean surnames are Kim (김), Lee (이), and Park (박), which together 
                  account for nearly half of the Korean population.
                </p>
                
                <p>
                  Given names are usually composed of two syllables, each chosen for its meaning. 
                  Parents carefully select characters that represent positive qualities, natural elements, 
                  or virtues they hope their child will embody.
                </p>
                
                <p>
                  This generator creates authentic Korean names by combining traditional surname frequencies 
                  with popular given name patterns. Each name is generated with meaningful syllables that 
                  reflect Korean naming traditions.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Explore More Korean Culture
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Discover comprehensive guides about Korea, K-pop, travel tips, and more!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tools"
                className="
                  inline-flex items-center justify-center gap-2
                  bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg
                  hover:shadow-2xl hover:scale-105 transition-all duration-300
                "
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                More Tools
              </Link>
              <Link
                href="/blog"
                className="
                  inline-flex items-center justify-center gap-2
                  border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg
                  hover:bg-white hover:text-purple-600 transition-all duration-300
                "
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Read Guides
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
