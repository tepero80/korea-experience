'use client';

import { useState, useRef } from 'react';
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
    gradient.addColorStop(0, '#ec4899'); // pink-600
    gradient.addColorStop(0.5, '#a855f7'); // purple-600
    gradient.addColorStop(1, '#ec4899'); // pink-600
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
          <div className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
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
                    className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 outline-none"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select
                    value={person1.birthMonth}
                    onChange={(e) => setPerson1({ ...person1, birthMonth: parseInt(e.target.value) })}
                    className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 outline-none"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>Month {month}</option>
                    ))}
                  </select>
                  <select
                    value={person1.birthDay}
                    onChange={(e) => setPerson1({ ...person1, birthDay: parseInt(e.target.value) })}
                    className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 outline-none"
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
                          ? 'bg-pink-600 text-white shadow-lg'
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
          <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
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
                    className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select
                    value={person2.birthMonth}
                    onChange={(e) => setPerson2({ ...person2, birthMonth: parseInt(e.target.value) })}
                    className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>Month {month}</option>
                    ))}
                  </select>
                  <select
                    value={person2.birthDay}
                    onChange={(e) => setPerson2({ ...person2, birthDay: parseInt(e.target.value) })}
                    className="px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none"
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
                          ? 'bg-purple-600 text-white shadow-lg'
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
            className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
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
          <div className="text-center bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 rounded-xl p-8">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-2">
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
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border-2 border-pink-200">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💝</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Your Couple Nickname</h3>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
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
                      <span className="text-green-600 mt-1">•</span>
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
          <div className="bg-blue-50 rounded-xl p-6">
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
            <h3 className="text-center font-bold text-gray-900 mb-4">Share Your Result!</h3>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <button
                onClick={handleDownloadImage}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Image
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://koreaexperience.com/tools/love-compatibility')}&quote=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a
                href={`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.023-5.086.83-6.47 2.398-1.459 1.656-2.198 4.027-2.198 7.051v.002c.005 3.024.738 5.393 2.183 7.048 1.374 1.574 3.55 2.388 6.465 2.412 2.18.013 3.872-.458 5.025-1.402.916-.748 1.56-1.807 1.91-3.148-.399-.158-.816-.295-1.248-.418-1.223-.348-2.53-.523-3.89-.523-2.633 0-4.928.645-6.617 1.862-1.746 1.259-2.631 2.944-2.631 5.004 0 2.004.823 3.608 2.447 4.768 1.467 1.048 3.41 1.579 5.775 1.579 3.183 0 5.695-.999 7.468-2.969 1.574-1.75 2.37-4.069 2.37-6.898v-.815c.001-.029.001-.058.001-.087V9.973c0-.834.672-1.507 1.503-1.507.831 0 1.504.673 1.504 1.507v4.828c0 .029-.001.058-.001.087v.815c0 3.314-.997 6.083-2.965 8.233-2.167 2.366-5.342 3.564-9.439 3.564z"/>
                </svg>
                Threads
              </a>
            </div>
          </div>

          {/* Try Again Button */}
          <button
            onClick={handleReset}
            className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            💫 Try Another Couple
          </button>
        </div>
      )}

      {/* Info Section */}
      {!result && (
        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border-2 border-pink-100">
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
