'use client';

import { useState } from 'react';
import Link from 'next/link';
import { calculateKoreanAge, formatBirthDate, generateShareText, getAgeDifferenceExplanation, getFamousPeople, KoreanAgeResult } from '@/lib/korean-age';

export default function KoreanAgePage() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<KoreanAgeResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');

  // Handle calculate
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!birthDate) {
      setError('Please enter your birth date');
      return;
    }

    const date = new Date(birthDate);
    const today = new Date();

    // Validation
    if (date > today) {
      setError('Birth date cannot be in the future');
      return;
    }

    const year = date.getFullYear();
    if (year < 1900) {
      setError('Please enter a valid birth year');
      return;
    }

    // Calculate Korean age
    const ageResult = calculateKoreanAge(date);
    setResult(ageResult);
    setShowResult(true);
  };

  // SNS Share handlers
  const handleShareTwitter = () => {
    if (!result) return;
    const text = encodeURIComponent(generateShareText(result));
    const url = encodeURIComponent('https://www.koreaexperience.com/tools/korean-age');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent('https://www.koreaexperience.com/tools/korean-age');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleShareInstagram = () => {
    if (!result) return;
    const text = generateShareText(result) + ' https://www.koreaexperience.com/tools/korean-age';
    navigator.clipboard.writeText(text);
    alert('✅ Copied! Open Instagram and paste to share 📸');
  };

  const handleShareThreads = () => {
    if (!result) return;
    const text = encodeURIComponent(generateShareText(result) + ' https://www.koreaexperience.com/tools/korean-age');
    window.open(`https://threads.net/intent/post?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://www.koreaexperience.com/tools/korean-age');
    alert('✅ Link copied to clipboard!');
  };

  // Download result as image
  const handleDownload = () => {
    if (!result) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#d97706');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Zodiac emoji
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(result.zodiacSign.emoji, 400, 150);

    // Ages
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`International Age: ${result.internationalAge}`, 400, 250);
    
    ctx.font = 'bold 42px Arial';
    ctx.fillStyle = '#fde68a';
    ctx.fillText(`Korean Age: ${result.koreanAge}`, 400, 310);

    // Zodiac
    ctx.font = '32px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${result.zodiacSign.emoji} ${result.zodiacSign.korean} (${result.zodiacSign.english})`, 400, 380);

    // Website
    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('KoreaExperience.com', 400, 550);

    // Download
    const link = document.createElement('a');
    link.download = `korean-age-${result.birthYear}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Reset
  const handleReset = () => {
    setBirthDate('');
    setResult(null);
    setShowResult(false);
    setError('');
  };

  const famousPeople = result ? getFamousPeople(result.birthYear) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="pt-20 pb-10 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎂 Korean Age Calculator
          </h1>
          <p className="text-xl text-white/90">
            Find out your age in the Korean system + your zodiac sign!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showResult ? (
          /* Input Form */
          <div className="max-w-2xl mx-auto">
            {/* Info Card */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                🎂 About Korean Age System
              </h3>
              <p className="text-stone-800 text-sm leading-relaxed">
                Korea traditionally used a unique age system where everyone became 1 year old at birth 
                and gained a year every January 1st. As of <strong>June 2023</strong>, Korea officially 
                switched to the international age system (만 나이)! However, the traditional system 
                (세는 나이) is still culturally interesting.
              </p>
            </div>

            {/* Input Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Enter Your Birth Date
              </h2>

              <form onSubmit={handleCalculate} className="space-y-6">
                {/* Date Input */}
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700 mb-3">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="
                      w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl
                      focus:ring-4 focus:ring-amber-200 focus:border-orange-500
                      transition-all duration-200
                    "
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">Click the calendar icon to select your birth date</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Calculate Button */}
                <button
                  type="submit"
                  className="
                    w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white
                    font-bold py-4 px-6 rounded-xl text-lg
                    hover:from-amber-700 hover:to-orange-700
                    transform hover:scale-[1.02] active:scale-[0.98]
                    transition-all duration-200 shadow-lg
                  "
                >
                  🎉 Calculate My Korean Age
                </button>
              </form>
            </div>

            {/* Fun Facts */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="text-3xl mb-2">🎂</div>
                <h3 className="font-bold text-gray-900 mb-2">Traditional Korean Age</h3>
                <p className="text-sm text-gray-600">
                  Born = 1 year old, +1 every January 1st
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="text-3xl mb-2">🌏</div>
                <h3 className="font-bold text-gray-900 mb-2">International Age</h3>
                <p className="text-sm text-gray-600">
                  Official Korean age system since June 2023
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Result Display */
          <div className="max-w-4xl mx-auto">
            {/* Main Result Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 border-2 border-orange-200">
              {/* Result Header */}
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-8 text-center">
                <div className="text-8xl mb-4">{result?.zodiacSign.emoji}</div>
                <h2 className="text-3xl font-bold mb-2">Your Ages</h2>
                <p className="text-lg text-white/90">
                  Born {result && formatBirthDate(result.birthYear, result.birthMonth, result.birthDay)}
                </p>
              </div>

              {/* Ages Display */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* International Age */}
                  <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                    <div className="text-sm font-semibold text-amber-700 mb-2">🌏 International Age</div>
                    <div className="text-5xl font-bold text-green-900 mb-2">{result?.internationalAge}</div>
                    <div className="text-xs text-amber-600">Official since 2023</div>
                  </div>

                  {/* Korean Age */}
                  <div className="text-center p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
                    <div className="text-sm font-semibold text-orange-700 mb-2">🎉 Korean Age</div>
                    <div className="text-5xl font-bold text-stone-900 mb-2">{result?.koreanAge}</div>
                    <div className="text-xs text-orange-600">Traditional system</div>
                  </div>

                  {/* Year Age */}
                  <div className="text-center p-6 bg-amber-50 rounded-xl border-2 border-amber-200">
                    <div className="text-sm font-semibold text-amber-700 mb-2">📅 Year Age</div>
                    <div className="text-5xl font-bold text-amber-900 mb-2">{result?.yearAge}</div>
                    <div className="text-xs text-amber-700">Year difference</div>
                  </div>
                </div>

                {/* Age Difference Explanation */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mb-8">
                  <p className="text-stone-800 text-sm leading-relaxed">
                    {result && getAgeDifferenceExplanation(result)}
                  </p>
                </div>

                {/* Zodiac Sign Info */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    Your Zodiac Sign (띠)
                  </h3>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2">{result?.zodiacSign.emoji}</div>
                      <h4 className="text-2xl font-bold text-gray-900">{result?.zodiacSign.korean}</h4>
                      <p className="text-lg text-gray-600">{result?.zodiacSign.english}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <div className="text-sm font-semibold text-amber-700 mb-1">✨ Personality</div>
                        <p className="text-gray-700">{result?.zodiacSign.personality}</p>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-amber-700 mb-1">🎨 Lucky Colors</div>
                        <p className="text-gray-700">{result?.zodiacSign.luckyColor}</p>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm font-semibold text-amber-700 mb-1">💕 Best Match</div>
                        <p className="text-gray-700">{result?.zodiacSign.compatibility.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Famous People */}
                {famousPeople.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      🌟 Famous People Born in {result?.birthYear}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {famousPeople.map((person, index) => (
                        <span
                          key={index}
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="space-y-4 mb-6">
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
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-orange-600 to-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
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
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </button>

                    <button
                      onClick={handleDownload}
                      className="w-full bg-white text-orange-600 font-semibold py-3 px-6 rounded-lg border-2 border-orange-600 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Result Image
                    </button>
                  </div>
                </div>

                {/* Calculate Again Button */}
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  🔄 Try Again
                </button>
              </div>
            </div>

            {/* Other Tools CTA */}
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-8 text-center border-2 border-orange-200">
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
    </div>
  );
}
