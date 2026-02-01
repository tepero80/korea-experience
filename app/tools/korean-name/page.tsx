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
                  
                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button
                        onClick={handleShareTwitter}
                        className="inline-flex items-center justify-center gap-2 bg-[#1DA1F2] text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-[#1a8cd8] hover:shadow-xl transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                      </button>
                      
                      <button
                        onClick={handleShareFacebook}
                        className="inline-flex items-center justify-center gap-2 bg-[#4267B2] text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-[#365899] hover:shadow-xl transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </button>
                      
                      <button
                        onClick={handleShareInstagram}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white px-4 py-3 rounded-xl font-semibold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Instagram
                      </button>
                      
                      <button
                        onClick={handleShareThreads}
                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 hover:shadow-xl transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 013.02.142l-.126 1.974c-.726-.1-1.543-.142-2.32-.1-.906.05-1.684.272-2.269.645-.461.295-.725.661-.735 1.08-.01.355.153.664.459.867.473.312 1.169.453 1.943.4 1.064-.056 1.842-.421 2.382-1.116.3-.386.498-.853.591-1.396.092-.541.088-1.108-.013-1.689-.203-1.16-.76-2.08-1.652-2.73-1.088-.793-2.624-1.207-4.56-1.228-2.238.02-3.932.627-5.038 1.805-1.036 1.103-1.574 2.63-1.602 4.54.028 1.911.566 3.438 1.602 4.542 1.106 1.178 2.8 1.785 5.038 1.805 2.552-.02 4.508-.87 5.816-2.528 1.402-1.776 2.117-4.188 2.117-7.164 0-.116-.002-.232-.005-.348-.089-3.46-1.327-6.14-3.676-7.968C16.93 1.283 14.59.684 12.01.67h-.014c-3.158.023-5.61.848-7.292 2.452C2.983 5.002 2.088 7.593 2.057 11.01v.017c.031 3.417.926 6.008 2.66 7.702 1.682 1.605 4.134 2.43 7.292 2.453h.007c1.922-.009 3.574-.384 4.91-1.115 1.604-.88 2.806-2.193 3.573-3.904l1.846.906c-.923 2.06-2.368 3.695-4.295 4.86-1.613.977-3.556 1.48-5.774 1.49z"/>
                        </svg>
                        Threads
                      </button>
                    </div>
                    
                    <button
                      onClick={handleCopyLink}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                      </svg>
                      Copy Link
                    </button>
                    
                    <button
                      onClick={handleDownload}
                      className="w-full inline-flex items-center justify-center gap-2 bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300"
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
