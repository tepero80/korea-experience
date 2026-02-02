'use client';

import { useState, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { 
  generateDailyFortune, 
  getColorHex, 
  getFortuneGrade, 
  generateShareText,
  FortuneResult 
} from '@/lib/korean-zodiac-fortune';

export default function KoreanZodiacFortunePage() {
  const [birthYear, setBirthYear] = useState<number>(1995);
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCheckFortune = (e: React.FormEvent) => {
    e.preventDefault();
    
    const today = new Date();
    const currentYear = today.getFullYear();
    
    if (birthYear < 1900 || birthYear > currentYear) {
      alert('Please enter a valid birth year (1900-' + currentYear + ')');
      return;
    }
    
    const result = generateDailyFortune(birthYear, today);
    setFortune(result);
    
    // Scroll to result
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setFortune(null);
    setBirthYear(1995);
  };

  const shareText = fortune ? generateShareText(fortune) : '';

  const handleShareTwitter = () => {
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent('https://www.koreaexperience.com/tools/korean-zodiac-fortune');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent('https://www.koreaexperience.com/tools/korean-zodiac-fortune');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleShareInstagram = () => {
    navigator.clipboard.writeText(shareText + ' https://www.koreaexperience.com/tools/korean-zodiac-fortune');
    alert('✅ Copied! Open Instagram and paste to share 📸');
  };

  const handleShareThreads = () => {
    const text = encodeURIComponent(shareText + ' https://www.koreaexperience.com/tools/korean-zodiac-fortune');
    window.open(`https://threads.net/intent/post?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://www.koreaexperience.com/tools/korean-zodiac-fortune');
    alert('✅ Link copied to clipboard!');
  };

  const handleDownloadImage = () => {
    if (!fortune) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#7c3aed'); // violet-600
    gradient.addColorStop(0.5, '#a855f7'); // purple-600
    gradient.addColorStop(1, '#c026d3'); // fuchsia-600
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Today's Korean Zodiac Fortune", 400, 60);

    // Zodiac emoji
    ctx.font = '120px Arial';
    ctx.fillText(fortune.zodiac.emoji, 400, 180);

    // Zodiac name
    ctx.font = 'bold 32px Arial';
    ctx.fillText(`${fortune.zodiac.english} (${fortune.zodiac.korean})`, 400, 230);

    // Date
    ctx.font = '20px Arial';
    ctx.fillText(fortune.dateFormatted, 400, 265);

    // Overall score
    ctx.font = 'bold 64px Arial';
    ctx.fillText(`${fortune.overallScore}/100`, 400, 350);

    const grade = getFortuneGrade(fortune.overallScore);
    ctx.font = 'bold 28px Arial';
    ctx.fillText(`${grade.emoji} ${grade.text}`, 400, 390);

    // Lucky elements
    ctx.font = '24px Arial';
    ctx.fillText(`🎨 Lucky Color: ${fortune.luckyColor}`, 400, 450);
    ctx.fillText(`🔢 Lucky Number: ${fortune.luckyNumber}`, 400, 490);

    // Footer
    ctx.font = '18px Arial';
    ctx.fillText('koreaexperience.com/tools/korean-zodiac-fortune', 400, 560);

    // Download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `korean-zodiac-fortune-${fortune.zodiac.english}-${fortune.date}.png`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1940 + 1 }, (_, i) => currentYear - i);

  return (
    <ToolLayout
      title="Korean Zodiac Fortune Today"
      description="Check your daily fortune based on Korean zodiac (띠)! Get insights on love, wealth, health, and career. 🔮"
      emoji="🔮"
      gradient="from-violet-600 via-purple-600 to-fuchsia-600"
    >
      {!fortune ? (
        /* Input Form */
        <form onSubmit={handleCheckFortune} className="space-y-6">
          <div>
            <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-2">
              Select Your Birth Year
            </label>
            <select
              id="birthYear"
              value={birthYear}
              onChange={(e) => setBirthYear(Number(e.target.value))}
              className="w-full px-4 py-3 text-lg border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ✨ Check Today's Fortune ✨
          </button>

          <p className="text-sm text-gray-500 text-center">
            Your fortune is generated based on your Korean zodiac sign and today's date. 
            Come back tomorrow for a new fortune! 🌟
          </p>
        </form>
      ) : (
        /* Result Display */
        <div ref={resultRef} className="space-y-6">
          {/* Zodiac Header */}
          <div className="text-center bg-gradient-to-r from-violet-100 via-purple-100 to-fuchsia-100 rounded-2xl p-8 border-2 border-purple-200">
            <div className="text-8xl mb-4">{fortune.zodiac.emoji}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {fortune.zodiac.english} ({fortune.zodiac.korean})
            </h2>
            <p className="text-gray-600 mb-1">{fortune.zodiac.personality}</p>
            <p className="text-sm text-gray-500">{fortune.dateFormatted}</p>
          </div>

          {/* Overall Fortune Score */}
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl p-8 text-center shadow-xl">
            <div className="text-6xl font-bold mb-2">{fortune.overallScore}/100</div>
            <div className="text-2xl mb-4">
              {getFortuneGrade(fortune.overallScore).emoji} {getFortuneGrade(fortune.overallScore).text}
            </div>
            {/* Progress bar */}
            <div className="bg-white/30 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-1000"
                style={{ width: `${fortune.overallScore}%` }}
              ></div>
            </div>
          </div>

          {/* Detailed Fortunes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Love */}
            <div className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  💕 Love Fortune
                </h3>
                <span className="text-2xl font-bold text-pink-600">{fortune.loveScore}</span>
              </div>
              <div className="bg-pink-200 rounded-full h-2 mb-3 overflow-hidden">
                <div 
                  className="bg-pink-600 h-full rounded-full"
                  style={{ width: `${fortune.loveScore}%` }}
                ></div>
              </div>
              <p className="text-gray-700 text-sm">{fortune.detailedFortune.love}</p>
            </div>

            {/* Wealth */}
            <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  💰 Wealth Fortune
                </h3>
                <span className="text-2xl font-bold text-yellow-600">{fortune.wealthScore}</span>
              </div>
              <div className="bg-yellow-200 rounded-full h-2 mb-3 overflow-hidden">
                <div 
                  className="bg-yellow-600 h-full rounded-full"
                  style={{ width: `${fortune.wealthScore}%` }}
                ></div>
              </div>
              <p className="text-gray-700 text-sm">{fortune.detailedFortune.wealth}</p>
            </div>

            {/* Health */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  🏥 Health Fortune
                </h3>
                <span className="text-2xl font-bold text-green-600">{fortune.healthScore}</span>
              </div>
              <div className="bg-green-200 rounded-full h-2 mb-3 overflow-hidden">
                <div 
                  className="bg-green-600 h-full rounded-full"
                  style={{ width: `${fortune.healthScore}%` }}
                ></div>
              </div>
              <p className="text-gray-700 text-sm">{fortune.detailedFortune.health}</p>
            </div>

            {/* Career */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  💼 Career Fortune
                </h3>
                <span className="text-2xl font-bold text-blue-600">{fortune.careerScore}</span>
              </div>
              <div className="bg-blue-200 rounded-full h-2 mb-3 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${fortune.careerScore}%` }}
                ></div>
              </div>
              <p className="text-gray-700 text-sm">{fortune.detailedFortune.career}</p>
            </div>
          </div>

          {/* Lucky Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lucky Color */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 text-center">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Lucky Color</h3>
              <div 
                className="mx-auto w-32 h-32 rounded-2xl shadow-lg mb-3 flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: getColorHex(fortune.luckyColor) }}
              >
                {fortune.luckyColor}
              </div>
              <p className="text-sm text-gray-600">Wear or surround yourself with this color today!</p>
            </div>

            {/* Lucky Number */}
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 text-center">
              <div className="text-2xl mb-2">🔢</div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Lucky Number</h3>
              <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-3">
                {fortune.luckyNumber}
              </div>
              <p className="text-sm text-gray-600">This number brings you good fortune today!</p>
            </div>
          </div>

          {/* Advice */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              💡 Today's Advice
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">{fortune.advice}</p>
          </div>

          {/* Warning */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              ⚠️ Be Careful Of
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">{fortune.warning}</p>
          </div>

          {/* Share Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              📢 Share Your Fortune!
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <button
                onClick={handleShareTwitter}
                className="bg-[#1DA1F2] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
                Twitter
              </button>

              <button
                onClick={handleShareFacebook}
                className="bg-[#1877F2] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
                Facebook
              </button>

              <button
                onClick={handleShareInstagram}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
                Instagram
              </button>

              <button
                onClick={handleShareThreads}
                className="bg-black text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 013.02.142l-.126.742a12.847 12.847 0 00-2.896-.136c-1.278.06-2.254.4-2.897.998-.57.529-.865 1.235-.822 2.006.038.77.448 1.431 1.152 1.857.662.4 1.514.572 2.397.526 1.345-.07 2.316-.547 2.971-1.459 1.097-1.531 1.028-4.012.335-6.39-.687-2.354-2.335-4.15-4.916-5.345C13.585 2.014 11.768 1.5 9.635 1.472 6.635 1.442 4.276 2.503 2.707 4.645 1.138 6.786.394 9.72.365 13.012c.029 3.286.773 6.215 2.342 8.357 1.568 2.14 3.927 3.2 6.927 3.231h.007c1.918-.005 3.511-.448 4.75-1.319.62-.436 1.124-.948 1.506-1.529l.736.455c-.44.674-1.005 1.257-1.684 1.74-1.424 1.01-3.197 1.521-5.277 1.527zm2.28-6.738c-.353 1.071-.872 1.934-1.544 2.566-.672.632-1.486 1.01-2.424 1.123-.89.107-1.753-.005-2.566-.336a3.598 3.598 0 01-1.758-1.329c-.446-.629-.691-1.384-.73-2.244-.04-.858.12-1.685.477-2.46.358-.775.88-1.423 1.556-1.929.676-.506 1.463-.824 2.34-.944.878-.12 1.771-.012 2.653.321.882.333 1.62.858 2.196 1.56.576.702.916 1.548 1.014 2.518.098.971-.058 1.885-.464 2.72-.407.835-1.027 1.512-1.848 2.014-.82.502-1.774.772-2.838.803-1.064.031-2.062-.197-2.969-.68a5.478 5.478 0 01-2.188-2.027c-.568-.85-.886-1.842-.944-2.952-.058-1.11.153-2.173.627-3.166a6.46 6.46 0 011.936-2.37c.826-.62 1.788-.997 2.86-1.12 1.072-.122 2.156.006 3.225.382 1.07.376 1.983.964 2.72 1.75.736.786 1.24 1.733 1.498 2.813l-.742.187c-.227-.951-.66-1.766-1.289-2.425-.629-.659-1.422-1.152-2.362-1.468-.94-.316-1.897-.424-2.849-.32-1.036.113-1.918.456-2.625.996a5.468 5.468 0 00-1.628 2.018c-.404.823-.588 1.75-.547 2.754.041.974.33 1.85.861 2.603a4.656 4.656 0 001.859 1.725c.771.411 1.629.596 2.553.549.925-.046 1.763-.296 2.494-.743a4.425 4.425 0 001.633-1.785c.39-.759.529-1.574.416-2.426-.113-.852-.43-1.6-.943-2.228-.513-.628-1.175-1.098-1.972-1.401-.797-.303-1.655-.396-2.549-.275-.894.121-1.668.42-2.303.89a4.186 4.186 0 00-1.296 1.613c-.304.647-.434 1.387-.387 2.2.047.813.29 1.509.722 2.069a2.598 2.598 0 001.565 1.016c.63.136 1.283.08 1.942-.166.66-.246 1.21-.633 1.639-1.152.429-.52.714-1.135.85-1.827z"></path>
                </svg>
                Threads
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleCopyLink}
                className="bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Link
              </button>

              <button
                onClick={handleDownloadImage}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Result Image
              </button>
            </div>
          </div>

          {/* Try Again Button */}
          <button
            onClick={handleReset}
            className="w-full bg-white text-purple-600 border-2 border-purple-600 py-4 px-8 rounded-xl font-bold text-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">🔄</span>
            Check Tomorrow's Fortune
          </button>

          {/* Try More Tools CTA */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🎯 Try More Interactive Tools!
            </h3>
            <p className="text-gray-600 mb-4">
              Discover your Korean name, ideal partner, K-drama character, and more!
            </p>
            <a
              href="/tools"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Browse All Tools
            </a>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
