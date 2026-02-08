'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import ToolLayout from '@/components/ToolLayout';
import { GeneratorResult } from '@/components/tools/results/GeneratorResult';
import { useToolShare, useCanvasDownload, useToast } from '@/hooks';
import { 
  generateMeal, 
  formatPrice, 
  generateShareText,
  GeneratedMeal 
} from '@/lib/convenience-store-meals';

export default function ConvenienceStoreMealsPage() {
  const [purpose, setPurpose] = useState<string>('meal');
  const [budget, setBudget] = useState<number>(5000);
  const [meal, setMeal] = useState<GeneratedMeal | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  
  const { showToast } = useToast();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = generateMeal(purpose, budget);
    
    if (!result) {
      showToast('No combo found. Try different options!', 'error');
      return;
    }
    
    setMeal(result);
    
    // Scroll to result
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setMeal(null);
    setPurpose('meal');
    setBudget(5000);
  };

  const handleRegenerate = () => {
    const result = generateMeal(purpose, budget);
    if (result) {
      setMeal(result);
      showToast('New combo generated!', 'success');
    }
  };

  const toolUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareConfig = meal ? {
    url: toolUrl,
    title: 'Korean Convenience Store Meal Builder',
    text: generateShareText(meal),
  } : undefined;

  const { generateImage } = useCanvasDownload({
    width: 1200,
    height: 630,
    filename: `convenience-store-combo-${meal?.combo.name.toLowerCase().replace(/\s+/g, '-')}.png`,
  });

  const onDownload = () => {
    if (!meal) return;
    
    generateImage((ctx, canvas) => {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#10B981');
      gradient.addColorStop(0.5, '#3B82F6');
      gradient.addColorStop(1, '#d97706');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Emoji
      ctx.font = 'bold 120px Arial';
      ctx.fillText(meal.combo.emoji, 60, 160);
      
      // Title
      ctx.fillStyle = 'white';
      ctx.font = 'bold 56px Arial';
      ctx.fillText(meal.combo.name, 60, 260);
      
      // Korean name
      ctx.font = '36px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText(meal.combo.nameKo, 60, 320);
      
      // Items
      ctx.font = '32px Arial';
      ctx.fillText(`${meal.items.length} items - ${formatPrice(meal.totalPrice).krw}`, 60, 380);
      
      // Store info
      ctx.font = '28px Arial';
      ctx.fillText(`Available at: ${meal.stores.join(', ')}`, 60, 440);
      
      // Site name
      ctx.font = 'bold 32px Arial';
      ctx.fillText('🇰🇷 Korea Experience', 60, 570);
    });
  };

  const priceFormatted = meal ? formatPrice(meal.totalPrice) : null;

  return (
    <ToolLayout
      title="Korean Convenience Store Meal Builder"
      description="Build the perfect Korean convenience store combo! Mix ramen, kimbap, drinks and snacks. Get authentic meal ideas from GS25, CU, and 7-Eleven. 🏪"
      emoji="🏪"
    >
      {!meal ? (
        /* Input Form */
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Purpose Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              What's your purpose? 🎯
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'meal', label: 'Quick Meal', emoji: '🍱', desc: 'Fill your stomach' },
                { value: 'latenight', label: 'Late Night', emoji: '🌙', desc: 'Midnight snack' },
                { value: 'drink', label: 'Drinking', emoji: '🍺', desc: 'Soju party' },
                { value: 'dessert', label: 'Dessert', emoji: '🍰', desc: 'Sweet treat' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPurpose(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    purpose === option.value
                      ? 'border-amber-500 bg-amber-50 shadow-md'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <div className="font-bold text-gray-900 text-sm mb-1">{option.label}</div>
                  <div className="text-xs text-gray-600">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Budget 💰
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 5000, label: '₩5,000', usd: '$3.85', desc: 'Budget friendly' },
                { value: 10000, label: '₩10,000', usd: '$7.69', desc: 'Standard combo' },
                { value: 15000, label: '₩15,000', usd: '$11.54', desc: 'Premium feast' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setBudget(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    budget === option.value
                      ? 'border-amber-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="font-bold text-gray-900 text-lg mb-1">{option.label}</div>
                  <div className="text-sm text-gray-600 mb-1">{option.usd}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
          >
            🎲 Generate My Combo!
          </button>

          <p className="text-sm text-gray-500 text-center">
            Get authentic Korean convenience store meal combos! All items are available at major stores like GS25, CU, and 7-Eleven. 🏪
          </p>
        </form>
      ) : (
        /* Result Display */
        <div ref={resultRef} className="space-y-6">
          {/* Combo Header */}
          <div className="text-center bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 rounded-2xl p-8 border-2 border-amber-200">
            <div className="text-8xl mb-4">{meal.combo.emoji}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {meal.combo.name}
            </h2>
            <p className="text-xl text-gray-600 mb-4">{meal.combo.nameKo}</p>
            
            {/* Price & Calories */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="bg-white px-6 py-3 rounded-xl shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Total Price</div>
                <div className="text-2xl font-bold text-amber-600">{priceFormatted?.krw}</div>
                <div className="text-sm text-gray-500">{priceFormatted?.usd}</div>
              </div>
              <div className="bg-white px-6 py-3 rounded-xl shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Total Calories</div>
                <div className="text-2xl font-bold text-orange-600">{meal.totalCalories}</div>
                <div className="text-sm text-gray-500">kcal</div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              🛒 Your Combo Items ({meal.items.length})
            </h3>
            <div className="space-y-3">
              {meal.items.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-amber-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.nameKo}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{item.calories} kcal</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {item.stores.join(', ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-600">₩{item.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">${(item.price / 1300).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              💡 Pro Tips
            </h3>
            <p className="text-gray-700 leading-relaxed">{meal.tips}</p>
          </div>

          {/* Store Availability */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-green-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              🏪 Where to Buy
            </h3>
            <div className="flex flex-wrap gap-2">
              {meal.stores.map((store, index) => (
                <span
                  key={index}
                  className="bg-white px-4 py-2 rounded-lg border-2 border-green-300 font-semibold text-amber-700"
                >
                  {store}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {meal.stores.length === 1 
                ? `All items available at ${meal.stores[0]}!` 
                : 'Items may be at different stores. Check availability!'}
            </p>
          </div>

          {/* Standard Result Component */}
          <GeneratorResult
            emoji={meal.combo.emoji}
            mainResult={{
              primary: meal.combo.name,
              secondary: meal.combo.nameKo,
            }}
            meaning={{
              title: 'Total',
              description: `${meal.items.length} items combo for ${priceFormatted?.krw} (${priceFormatted?.usd})`,
            }}
            shareConfig={{
              toolSlug: 'convenience-store-meals',
              shareText: generateShareText(meal),
              result: meal,
            }}
            onReset={handleReset}
            onRegenerate={handleRegenerate}
            onDownload={onDownload}
          />
        </div>
      )}

      {/* About Section */}
      {!meal && (
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">About Korean Convenience Stores 🏪</h3>
          <div className="space-y-2 text-gray-700 text-sm">
            <p>
              Korean convenience stores are legendary! Unlike typical Western stores, they offer <strong>hot food preparation areas</strong>, 
              <strong> seating spaces</strong>, and <strong>microwave ovens</strong> for customers.
            </p>
            <p>
              The big three chains - <strong>GS25</strong>, <strong>CU</strong>, and <strong>7-Eleven</strong> - compete fiercely with unique products 
              and meal combinations. Many Koreans regularly eat meals at convenience stores due to their convenience and value!
            </p>
            <p className="pt-2">
              💡 <strong>Pro Tip:</strong> Visit between 1-2 PM or 7-8 PM for fresh hot food restocking. Most stores have free hot water dispensers for instant noodles!
            </p>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {meal && (
        <div className="mt-12 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-8 text-center text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-3">Try More Interactive Tools! 🎯</h3>
          <p className="text-lg mb-6 text-white/90">
            Discover Korean culture with our fun tools and quizzes
          </p>
          <Link 
            href="/tools"
            className="inline-block bg-white text-amber-700 px-8 py-3 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
          >
            Explore All Tools →
          </Link>
        </div>
      )}
    </ToolLayout>
  );
}
