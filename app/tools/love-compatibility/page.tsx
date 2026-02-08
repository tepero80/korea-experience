'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import ToolLayout from '@/components/ToolLayout';
import { calculateLoveCompatibility, Person, CompatibilityResult } from '@/lib/love-compatibility';

export default function LoveCompatibilityPage() {
  const [person1, setPerson1] = useState<Partial<Person>>({
    name: '',
    birthYear: 1995,
    birthMonth: 1,
    birthDay: 1,
    bloodType: 'A'
  });
  
  const [person2, setPerson2] = useState<Partial<Person>>({
    name: '',
    birthYear: 1995,
    birthMonth: 1,
    birthDay: 1,
    bloodType: 'A'
  });
  
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!person1.name || !person2.name) {
      alert('Please enter both names!');
      return;
    }
    
    const compatibility = calculateLoveCompatibility(
      person1 as Person,
      person2 as Person
    );
    
    setResult(compatibility);
  };

  const handleReset = () => {
    setPerson1({
      name: '',
      birthYear: 1995,
      birthMonth: 1,
      birthDay: 1,
      bloodType: 'A'
    });
    setPerson2({
      name: '',
      birthYear: 1995,
      birthMonth: 1,
      birthDay: 1,
      bloodType: 'A'
    });
    setResult(null);
  };

  const shareText = result 
    ? `${person1.name} & ${person2.name} love compatibility: ${result.score}% ${result.grade} Get yours at koreaexperience.com/tools/love-compatibility`
    : '';

  const handleDownloadImage = () => {
    if (!result || !resultRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 500);
    gradient.addColorStop(0, '#d97706'); // pink-600
    gradient.addColorStop(0.5, '#ea580c'); // purple-600
    gradient.addColorStop(1, '#d97706'); // pink-600
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Korean Love Compatibility', 400, 60);

    // Names
    ctx.font = 'bold 28px Arial';
    ctx.fillText(`${person1.name} 💗 ${person2.name}`, 400, 110);

    // Score
    ctx.font = 'bold 80px Arial';
    ctx.fillText(`${result.score}%`, 400, 210);

    // Grade
    ctx.font = 'bold 36px Arial';
    ctx.fillText(result.grade, 400, 260);

    // Emoji
    ctx.font = '48px Arial';
    ctx.fillText(result.emoji, 400, 320);

    // Couple Nickname
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Couple Nickname: ${result.coupleNickname}`, 400, 370);
    ctx.font = '20px Arial';
    ctx.fillText(result.coupleNicknameKo, 400, 400);

    // Footer
    ctx.font = '16px Arial';
    ctx.fillText('koreaexperience.com/tools/love-compatibility', 400, 460);

    // Download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `love-compatibility-${person1.name}-${person2.name}.png`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1940 + 1 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const bloodTypes: Array<'A' | 'B' | 'O' | 'AB'> = ['A', 'B', 'O', 'AB'];

  return (
    <ToolLayout
      title="Korean Love Compatibility Calculator"
      description="Check your love compatibility based on Korean zodiac signs, blood types, and birth dates! 💕"
      emoji="💑"
    >
      {!result ? (
        /* Input Form */
        <form onSubmit={handleCalculate} className="space-y-8">
          {/* Person 1 */}
          <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">👤</span> Person 1
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={person1.name}
                  onChange={(e) => setPerson1({ ...person1, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Birth Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={person1.birthYear}
                    onChange={(e) => setPerson1({ ...person1, birthYear: parseInt(e.target.value) })}
                    className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 outline-none"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select
                    value={person1.birthMonth}
                    onChange={(e) => setPerson1({ ...person1, birthMonth: parseInt(e.target.value) })}
                    className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 outline-none"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>Month {month}</option>
                    ))}
                  </select>
                  <select
                    value={person1.birthDay}
                    onChange={(e) => setPerson1({ ...person1, birthDay: parseInt(e.target.value) })}
                    className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 outline-none"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>Day {day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blood Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {bloodTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPerson1({ ...person1, bloodType: type })}
                      className={`py-3 rounded-lg font-semibold transition-all ${
                        person1.bloodType === type
                          ? 'bg-orange-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Type {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Heart Divider */}
          <div className="flex items-center justify-center">
            <div className="text-4xl animate-pulse">💗</div>
          </div>

          {/* Person 2 */}
          <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">👤</span> Person 2
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={person2.name}
                  onChange={(e) => setPerson2({ ...person2, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Birth Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={person2.birthYear}
                    onChange={(e) => setPerson2({ ...person2, birthYear: parseInt(e.target.value) })}
                    className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 outline-none"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select
                    value={person2.birthMonth}
                    onChange={(e) => setPerson2({ ...person2, birthMonth: parseInt(e.target.value) })}
                    className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 outline-none"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>Month {month}</option>
                    ))}
                  </select>
                  <select
                    value={person2.birthDay}
                    onChange={(e) => setPerson2({ ...person2, birthDay: parseInt(e.target.value) })}
                    className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 outline-none"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>Day {day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blood Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {bloodTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPerson2({ ...person2, bloodType: type })}
                      className={`py-3 rounded-lg font-semibold transition-all ${
                        person2.bloodType === type
                          ? 'bg-amber-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Type {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            💕 Calculate Love Compatibility
          </button>
        </form>
      ) : (
        /* Results */
        <div className="space-y-6" ref={resultRef}>
          {/* Names */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {person1.name} 💗 {person2.name}
            </div>
          </div>

          {/* Score */}
          <div className="text-center bg-gradient-to-r from-orange-100 via-amber-100 to-orange-100 rounded-xl p-8">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-2">
              {result.score}%
            </div>
            <div className="text-2xl font-semibold text-gray-800 mb-2">
              {result.grade}
            </div>
            <div className="text-4xl">
              {result.emoji}
            </div>
          </div>

          {/* Couple Nickname */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💝</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Your Couple Nickname</h3>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                  {result.coupleNickname}
                </div>
                <div className="text-xl text-gray-700 mt-1">
                  {result.coupleNicknameKo}
                </div>
              </div>
            </div>
          </div>

          {/* Zodiac Match */}
          <div className="bg-yellow-50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🐲</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Zodiac Sign Compatibility</h3>
                <div className="text-sm text-gray-600 mb-2">
                  {result.zodiacMatch.person1Zodiac} × {result.zodiacMatch.person2Zodiac}
                </div>
                <p className="text-gray-700">{result.zodiacMatch.compatibility}</p>
              </div>
            </div>
          </div>

          {/* Blood Type Match */}
          <div className="bg-red-50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🩸</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Blood Type Compatibility</h3>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-gray-600">
                    {person1.bloodType} × {person2.bloodType}
                  </span>
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {result.bloodTypeMatch.percentage}%
                  </span>
                </div>
                <p className="text-gray-700">{result.bloodTypeMatch.compatibility}</p>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Relationship Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Weaknesses */}
          <div className="bg-orange-50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Areas to Work On</h3>
                <ul className="space-y-2">
                  {result.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Advice */}
          <div className="bg-amber-50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Relationship Advice</h3>
                <p className="text-gray-700 leading-relaxed">{result.advice}</p>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="border-t-2 border-gray-200 pt-6">
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 text-center">Share Your Result!</h3>
              
              {/* SNS Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
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
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://koreaexperience.com/tools/love-compatibility')}&quote=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#4267B2] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>

                <button
                  onClick={() => alert('Instagram story sharing feature coming soon! For now, take a screenshot and share on Instagram! 📸')}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-orange-600 to-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </button>

                <a
                  href={`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`}
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
                    navigator.clipboard.writeText('https://koreaexperience.com/tools/love-compatibility');
                    alert('Link copied to clipboard! 📋');
                  }}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </button>

                <button
                  onClick={handleDownloadImage}
                  className="w-full bg-white text-amber-700 font-semibold py-3 px-6 rounded-lg border-2 border-amber-600 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Result Image
                </button>
              </div>
            </div>
          </div>

          {/* Try Again Button */}
          <button
            onClick={handleReset}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            � Try Again
          </button>

          {/* Other Tools CTA */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 text-center border-2 border-amber-200 mt-6">
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

      {/* Info Section */}
      {!result && (
        <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3">About Korean Love Compatibility</h3>
          <div className="space-y-2 text-gray-700 text-sm">
            <p>
              In Korean culture, <strong>zodiac signs (띠)</strong> and <strong>blood types (혈액형)</strong> are 
              traditionally used to assess compatibility between couples.
            </p>
            <p>
              This calculator combines Korean zodiac astrology, blood type personality theory, and numerology 
              to give you a comprehensive compatibility analysis!
            </p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
