'use client';

import { useState, useRef } from 'react';
import { 
  calculateBudget, 
  getSavingTips, 
  getRecommendedItinerary, 
  getFlightInfo,
  getSeasonalAdvice,
  getBudgetLevel,
  type TripPreferences,
  type BudgetBreakdown
} from '@/lib/trip-budget-calculator';

export default function TripBudgetCalculator() {
  const [preferences, setPreferences] = useState<TripPreferences>({
    days: 7,
    accommodation: 'standard',
    meals: 'standard',
    shopping: 200,
    activities: 'moderate'
  });
  
  const [result, setResult] = useState<BudgetBreakdown | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    const budget = calculateBudget(preferences);
    setResult(budget);
    setShowResults(true);
    
    // Scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setPreferences({
      days: 7,
      accommodation: 'standard',
      meals: 'standard',
      shopping: 200,
      activities: 'moderate'
    });
    setResult(null);
    setShowResults(false);
  };

  const handleShare = (platform: string) => {
    if (!result) return;
    
    const text = `My Korea trip budget for ${preferences.days} days: $${result.total.toLocaleString()} (₩${result.totalKRW.toLocaleString()})! Plan your Korea trip: ${window.location.href}`;
    const url = encodeURIComponent(window.location.href);
    const encodedText = encodeURIComponent(text);

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`,
      instagram: `https://www.instagram.com/`,
      threads: `https://www.threads.net/intent/post?text=${encodedText}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const handleDownloadImage = async () => {
    if (!result) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#2563eb');
    gradient.addColorStop(1, '#06b6d4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('My Korea Trip Budget', canvas.width / 2, 100);

    // Trip details
    ctx.font = '32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(`${preferences.days} Days Trip`, canvas.width / 2, 160);

    // Budget amount
    ctx.font = 'bold 72px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(`$${result.total.toLocaleString()}`, canvas.width / 2, 280);

    // KRW amount
    ctx.font = '36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(`₩${result.totalKRW.toLocaleString()}`, canvas.width / 2, 340);

    // Breakdown
    ctx.font = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    const breakdownY = 420;
    const lineHeight = 45;
    const leftX = 100;
    const rightX = canvas.width / 2 + 50;

    ctx.fillText(`🏨 Accommodation: $${result.accommodation}`, leftX, breakdownY);
    ctx.fillText(`🍜 Meals: $${result.meals}`, leftX, breakdownY + lineHeight);
    ctx.fillText(`🚇 Transport: $${result.transportation}`, leftX, breakdownY + lineHeight * 2);
    
    ctx.fillText(`🎭 Activities: $${result.activities}`, rightX, breakdownY);
    ctx.fillText(`🛍️ Shopping: $${result.shopping}`, rightX, breakdownY + lineHeight);
    ctx.fillText(`💡 Misc: $${result.miscellaneous}`, rightX, breakdownY + lineHeight * 2);

    // Website
    ctx.textAlign = 'center';
    ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('koreaexperience.com/tools/trip-budget', canvas.width / 2, 590);

    // Download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'korea-trip-budget.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const budgetLevel = result ? getBudgetLevel(result.total / preferences.days) : 'standard';
  const savingTips = getSavingTips(preferences);
  const itinerary = result ? getRecommendedItinerary(budgetLevel, preferences.days) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">✈️</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Korea Trip Budget Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plan your perfect Korea trip! Get detailed cost estimates for accommodation, food, activities, and more.
          </p>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Preferences</h2>
          
          {/* Days */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📅 How many days? <span className="text-blue-600">{preferences.days} days</span>
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={preferences.days}
              onChange={(e) => setPreferences({ ...preferences, days: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 day</span>
              <span>30 days</span>
            </div>
          </div>

          {/* Accommodation */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🏨 Accommodation Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['budget', 'standard', 'luxury'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setPreferences({ ...preferences, accommodation: type })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.accommodation === type
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold capitalize">{type}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {type === 'budget' && '$30/night'}
                    {type === 'standard' && '$80/night'}
                    {type === 'luxury' && '$200/night'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Meals */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🍜 Dining Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['budget', 'standard', 'foodie'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setPreferences({ ...preferences, meals: type })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.meals === type
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold capitalize">{type}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {type === 'budget' && '$15/day'}
                    {type === 'standard' && '$35/day'}
                    {type === 'foodie' && '$70/day'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🎭 Activities & Attractions
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['minimal', 'moderate', 'extensive'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setPreferences({ ...preferences, activities: type })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    preferences.activities === type
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold capitalize">{type}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {type === 'minimal' && '$20/day'}
                    {type === 'moderate' && '$60/day'}
                    {type === 'extensive' && '$150/day'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Shopping Budget */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🛍️ Shopping Budget (Total) <span className="text-blue-600">${preferences.shopping}</span>
            </label>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={preferences.shopping}
              onChange={(e) => setPreferences({ ...preferences, shopping: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$2,000</span>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex gap-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
            >
              Calculate My Budget 💰
            </button>
            {showResults && (
              <button
                onClick={handleReset}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {showResults && result && (
          <div ref={resultRef} className="space-y-6">
            {/* Total Budget */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="text-center">
                <div className="text-lg font-semibold mb-2">Your Total Trip Budget</div>
                <div className="text-6xl font-bold mb-4">${result.total.toLocaleString()}</div>
                <div className="text-2xl opacity-90">₩{result.totalKRW.toLocaleString()}</div>
                <div className="mt-4 inline-block bg-white/20 rounded-full px-6 py-2 text-sm font-semibold backdrop-blur-sm">
                  {budgetLevel === 'budget' && '💰 Budget Traveler'}
                  {budgetLevel === 'standard' && '⭐ Standard Comfort'}
                  {budgetLevel === 'luxury' && '👑 Luxury Experience'}
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Cost Breakdown</h3>
              <div className="space-y-4">
                {[
                  { icon: '🏨', label: 'Accommodation', amount: result.accommodation, desc: `$${(result.accommodation / preferences.days).toFixed(0)}/night` },
                  { icon: '🍜', label: 'Meals & Dining', amount: result.meals, desc: `$${(result.meals / preferences.days).toFixed(0)}/day` },
                  { icon: '🚇', label: 'Transportation', amount: result.transportation, desc: 'Subway, bus, taxi' },
                  { icon: '🎭', label: 'Activities', amount: result.activities, desc: 'Tours, attractions' },
                  { icon: '🛍️', label: 'Shopping', amount: result.shopping, desc: 'K-beauty, souvenirs' },
                  { icon: '💡', label: 'Miscellaneous', amount: result.miscellaneous, desc: 'SIM card, tips, etc.' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">${item.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flight Info */}
            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
              <div className="flex items-start gap-3">
                <span className="text-3xl">✈️</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Flight Costs (Not Included)</h4>
                  <p className="text-gray-700 text-sm">{getFlightInfo()}</p>
                </div>
              </div>
            </div>

            {/* Seasonal Advice */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
              <div className="flex items-start gap-3">
                <span className="text-3xl">📅</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Seasonal Tip</h4>
                  <p className="text-gray-700 text-sm">{getSeasonalAdvice(preferences.days)}</p>
                </div>
              </div>
            </div>

            {/* Recommended Itinerary */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended Itinerary</h3>
              <div className="space-y-3">
                {itinerary.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl">{item.split(' ')[0]}</span>
                    <p className="text-gray-700 flex-1">{item.substring(item.indexOf(' ') + 1)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Saving Tips */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">💡 Money-Saving Tips</h3>
              <div className="space-y-4">
                {savingTips.map((tip, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="font-semibold text-gray-900 mb-1">{tip.category}</div>
                    <p className="text-gray-700 text-sm">{tip.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking.com Link */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-200 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Book Your Trip?</h3>
              <p className="text-gray-700 mb-6">Find the best hotel deals in Korea on Booking.com</p>
              <a
                href="https://www.booking.com/searchresults.html?ss=Seoul%2C+South+Korea"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
              >
                Browse Seoul Hotels 🏨
              </a>
              <p className="text-xs text-gray-500 mt-4">Search hotels in Seoul and surrounding areas</p>
            </div>

            {/* Share Buttons */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Share Your Budget</h3>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all font-semibold"
                >
                  <span>𝕏</span> Share on X
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold"
                >
                  📘 Facebook
                </button>
                <button
                  onClick={() => handleShare('threads')}
                  className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all font-semibold"
                >
                  🧵 Threads
                </button>
                <button
                  onClick={handleDownloadImage}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
                >
                  📥 Download Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Calculator</h2>
          <div className="prose prose-blue max-w-none text-gray-700">
            <p>
              Our Korea Trip Budget Calculator helps you plan the perfect Korean adventure by providing realistic cost estimates based on your travel style. All prices are in USD and updated for 2026.
            </p>
            <h3 className="text-lg font-semibold mt-4 mb-2">What's Included:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Accommodation costs (hostels to luxury hotels)</li>
              <li>Daily meals and dining expenses</li>
              <li>Local transportation (subway, bus, taxi)</li>
              <li>Activities and attraction entrance fees</li>
              <li>Shopping budget for K-beauty and souvenirs</li>
              <li>Miscellaneous expenses (SIM card, tips, emergencies)</li>
            </ul>
            <h3 className="text-lg font-semibold mt-4 mb-2">Not Included:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>International flights</li>
              <li>Travel insurance</li>
              <li>Visa fees (if applicable)</li>
              <li>Airport transfers</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600 italic">
              Note: Exchange rates and prices fluctuate. Use this as a planning guide. We recommend adding a 10-15% buffer for unexpected expenses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
