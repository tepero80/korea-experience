'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateMultipleNames, type GeneratedKoreanName } from '@/lib/name-generator';

export default function KoreanNameGeneratorPage() {
  const [englishName, setEnglishName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'neutral'>('neutral');
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
    // Check if name contains only English letters
    const englishOnlyRegex = /^[a-zA-Z\s'-]+$/;
    if (!englishOnlyRegex.test(englishName.trim())) {
      setError('Please enter your name in English only');
      return;
    }    
    setIsGenerating(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      try {
        const names = generateMultipleNames(englishName.trim(), 6, gender);
        setGeneratedNames(names);
        setSelectedName(names[0]);
      } catch (err) {
        setError('Failed to generate name. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  const shareText = selectedName 
    ? `My Korean name is ${selectedName.fullName.korean} (${selectedName.fullName.romanized})! Generate yours at` 
    : '';
  const shareUrl = 'https://www.koreaexperience.com/tools/korean-name';
  
  const handleShareTwitter = () => {
    if (!selectedName) return;
    const text = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };
  
  const handleShareFacebook = () => {
    if (!selectedName) return;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };
  
  const handleShareInstagram = () => {
    if (!selectedName) return;
    const text = `${shareText} ${shareUrl}`;
    navigator.clipboard.writeText(text);
    alert('Copied! Open Instagram and paste in your story or post 📸');
  };
  
  const handleShareThreads = () => {
    if (!selectedName) return;
    const text = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://www.threads.net/intent/post?text=${text}`, '_blank');
  };
  
  const handleCopyLink = () => {
    if (!selectedName) return;
    const text = `${shareText} ${shareUrl}`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard! 📋');
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
                
                {/* Gender Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Gender
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`
                        flex-1 px-4 py-3 rounded-xl font-semibold text-sm
                        border-2 transition-all duration-200
                        ${gender === 'male'
                          ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }
                      `}
                    >
                      👨 Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`
                        flex-1 px-4 py-3 rounded-xl font-semibold text-sm
                        border-2 transition-all duration-200
                        ${gender === 'female'
                          ? 'bg-pink-500 text-white border-pink-500 shadow-lg'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                        }
                      `}
                    >
                      👩 Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('neutral')}
                      className={`
                        flex-1 px-4 py-3 rounded-xl font-semibold text-sm
                        border-2 transition-all duration-200
                        ${gender === 'neutral'
                          ? 'bg-purple-500 text-white border-purple-500 shadow-lg'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }
                      `}
                    >
                      🎲 Random
                    </button>
                  </div>
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
                  
                  {/* Share Your Result */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 text-center">Share Your Result!</h3>
                    
                    {/* SNS Buttons Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        onClick={handleShareTwitter}
                        className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                        Twitter
                      </button>

                      <button
                        onClick={handleShareFacebook}
                        className="flex items-center justify-center gap-2 bg-[#4267B2] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </button>

                      <button
                        onClick={handleShareInstagram}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Instagram
                      </button>

                      <button
                        onClick={handleShareThreads}
                        className="flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 14.787c-.045.426-.3.829-.718 1.144-1.053.792-2.629 1.181-4.176 1.181-2.128 0-4.014-.676-5.002-1.793-.494-.558-.741-1.178-.741-1.85 0-.386.145-.739.41-1.004.265-.264.618-.41 1.004-.41.739 0 1.339.557 1.414 1.267.09.865.774 1.535 1.624 1.535.459 0 .894-.173 1.225-.486.331-.314.513-.732.513-1.179 0-.447-.182-.865-.513-1.179-.331-.313-.766-.486-1.225-.486h-.586c-.35 0-.673-.135-.913-.381-.24-.246-.372-.575-.372-.926s.132-.68.372-.926c.24-.246.563-.381.913-.381h.586c1.832 0 3.317 1.485 3.317 3.317 0 .887-.359 1.739-1.003 2.383z" />
                        </svg>
                        Threads
                      </button>
                    </div>

                    {/* Copy Link & Download */}
                    <div className="space-y-2">
                      <button
                        onClick={handleCopyLink}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Link
                      </button>

                      <button
                        onClick={handleDownload}
                        className="w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Result Image
                      </button>
                    </div>
                  </div>
                </div>

                {/* Other Name Options */}
                <div className="mb-8">
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

                {/* Generate Another Name Button */}
                <button
                  onClick={() => {
                    setGeneratedNames([]);
                    setSelectedName(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors mb-12"
                >
                  🔄 Generate Another Name
                </button>

                {/* Try More Interactive Tools */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 text-center border-2 border-purple-200 mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Try More Interactive Tools!
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Discover more about your Korean identity
                  </p>
                  <Link
                    href="/tools"
                    className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Explore All Tools
                  </Link>
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
