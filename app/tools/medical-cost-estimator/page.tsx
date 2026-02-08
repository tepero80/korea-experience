'use client';

import { useState } from 'react';
import Link from 'next/link';
import ToolLayout from '@/components/ToolLayout';
import {
  categories,
  getProceduresByCategory,
  calculateCost,
  type MedicalProcedure,
  type CostEstimate
} from '@/lib/medical-cost-estimator';

export default function MedicalCostEstimatorPage() {
  const [step, setStep] = useState<'category' | 'procedure' | 'tier' | 'result'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<MedicalProcedure | null>(null);
  const [selectedTier, setSelectedTier] = useState<'budget' | 'standard' | 'premium' | null>(null);
  const [result, setResult] = useState<CostEstimate | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setStep('procedure');
  };

  const handleProcedureSelect = (procedure: MedicalProcedure) => {
    setSelectedProcedure(procedure);
    setStep('tier');
  };

  const handleTierSelect = (tier: 'budget' | 'standard' | 'premium') => {
    if (!selectedProcedure) return;
    setSelectedTier(tier);
    const estimate = calculateCost(selectedProcedure, tier);
    setResult(estimate);
    setStep('result');
  };

  const handleRestart = () => {
    setStep('category');
    setSelectedCategory(null);
    setSelectedProcedure(null);
    setSelectedTier(null);
    setResult(null);
  };

  const handleDownloadImage = () => {
    if (!result) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Purple-Pink gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#d97706');
    gradient.addColorStop(0.5, '#d97706');
    gradient.addColorStop(1, '#d97706');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // White content box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(40, 40, 720, 520, 20);
    ctx.fill();

    // Category icon
    const categoryIcon = categories.find(c => c.id === result.procedure.category)?.icon || '💊';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(categoryIcon, 400, 120);

    // Procedure name
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(result.procedure.name, 400, 180);

    // Korean name
    ctx.fillStyle = '#d97706';
    ctx.font = '24px Arial';
    ctx.fillText(result.procedure.nameKo, 400, 215);

    // Clinic tier
    const tierLabels = {
      budget: 'Budget Clinic',
      standard: 'Standard Clinic',
      premium: 'Premium Clinic'
    };
    ctx.fillStyle = '#6b7280';
    ctx.font = '20px Arial';
    ctx.fillText(tierLabels[result.clinicTier], 400, 250);

    // Cost box
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(100, 280, 600, 140);
    
    // Cost title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Estimated Total Cost', 400, 315);

    // USD amount
    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(`$${result.grandTotal.usd.toLocaleString()}`, 400, 365);

    // KRW amount
    ctx.fillStyle = '#6b7280';
    ctx.font = '20px Arial';
    ctx.fillText(`₩${result.grandTotal.krw.toLocaleString()}`, 400, 400);

    // Trip duration
    ctx.fillStyle = '#111827';
    ctx.font = '18px Arial';
    ctx.fillText(`Recommended Stay: ${result.totalTripDays} days`, 400, 445);

    // Website URL
    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('KoreaExperience.com', 400, 530);

    // Download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `korea-medical-cost-${result.procedure.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const shareText = result
    ? `I estimated my ${result.procedure.name} cost in Korea: $${result.grandTotal.usd.toLocaleString()} for ${result.totalTripDays} days! 🏥✨ Plan your medical tourism with KoreaExperience.com`
    : '';

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <ToolLayout
      title="Medical Tourism Cost Estimator"
      description="Calculate the total cost of your medical procedure in South Korea, including surgery, accommodation, and recovery time."
      emoji="🏥"
    >
      <div className="max-w-4xl mx-auto">
        {/* Category Selection */}
        {step === 'category' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Choose Your Medical Category
              </h2>
              <p className="text-gray-600">
                Select the type of medical procedure you&apos;re interested in
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-amber-500 hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-5xl">{category.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600">{category.nameKo}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Procedure Selection */}
        {step === 'procedure' && selectedCategory && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep('category')}
                className="text-amber-700 hover:text-amber-700 font-semibold"
              >
                ← Back to Categories
              </button>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Select Your Procedure
              </h2>
              <p className="text-gray-600">
                Choose the specific treatment you&apos;re considering
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {getProceduresByCategory(selectedCategory).map((procedure) => (
                <button
                  key={procedure.id}
                  onClick={() => handleProcedureSelect(procedure)}
                  className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-amber-500 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {procedure.name}
                      </h3>
                      <p className="text-amber-700 font-medium">{procedure.nameKo}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Starting from</div>
                      <div className="text-xl font-bold text-amber-700">
                        ${procedure.priceRange.budget.min.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{procedure.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>🕐 Recovery: {procedure.recoveryDays} days</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clinic Tier Selection */}
        {step === 'tier' && selectedProcedure && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setStep('procedure')}
                className="text-amber-700 hover:text-amber-700 font-semibold"
              >
                ← Back to Procedures
              </button>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Choose Clinic Tier
              </h2>
              <p className="text-gray-600">
                Select your preferred clinic quality and price range
              </p>
              <p className="text-sm text-gray-500 mt-2">
                For: {selectedProcedure.name} ({selectedProcedure.nameKo})
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Budget Tier */}
              <button
                onClick={() => handleTierSelect('budget')}
                className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-amber-500 hover:shadow-lg transition-all text-center"
              >
                <div className="text-4xl mb-3">💰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Budget</h3>
                <div className="text-2xl font-bold text-amber-700 mb-3">
                  ${selectedProcedure.priceRange.budget.min.toLocaleString()} - $
                  {selectedProcedure.priceRange.budget.max.toLocaleString()}
                </div>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>✓ Experienced doctors</li>
                  <li>✓ Basic facilities</li>
                  <li>✓ Standard care</li>
                  <li>✓ Good value</li>
                </ul>
              </button>

              {/* Standard Tier */}
              <button
                onClick={() => handleTierSelect('standard')}
                className="p-6 bg-white rounded-xl border-2 border-amber-500 hover:border-amber-600 hover:shadow-xl transition-all text-center relative"
              >
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Standard</h3>
                <div className="text-2xl font-bold text-amber-700 mb-3">
                  ${selectedProcedure.priceRange.standard.min.toLocaleString()} - $
                  {selectedProcedure.priceRange.standard.max.toLocaleString()}
                </div>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>✓ Top-rated doctors</li>
                  <li>✓ Modern facilities</li>
                  <li>✓ Premium care</li>
                  <li>✓ English support</li>
                </ul>
              </button>

              {/* Premium Tier */}
              <button
                onClick={() => handleTierSelect('premium')}
                className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all text-center"
              >
                <div className="text-4xl mb-3">💎</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-2xl font-bold text-orange-600 mb-3">
                  ${selectedProcedure.priceRange.premium.min.toLocaleString()} - $
                  {selectedProcedure.priceRange.premium.max.toLocaleString()}
                </div>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>✓ Celebrity doctors</li>
                  <li>✓ Luxury facilities</li>
                  <li>✓ VIP care</li>
                  <li>✓ Concierge service</li>
                </ul>
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {step === 'result' && result && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your Cost Estimate
              </h2>
              <p className="text-gray-600">
                {result.procedure.name} at a{' '}
                {result.clinicTier.charAt(0).toUpperCase() + result.clinicTier.slice(1)} clinic
              </p>
            </div>

            {/* Main Cost Card */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-8 text-white text-center shadow-xl">
              <div className="text-6xl mb-4">
                {categories.find(c => c.id === result.procedure.category)?.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{result.procedure.name}</h3>
              <p className="text-amber-100 mb-6">{result.procedure.nameKo}</p>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-4">
                <div className="text-sm text-amber-100 mb-2">Estimated Total Cost</div>
                <div className="text-5xl font-bold mb-2">
                  ${result.grandTotal.usd.toLocaleString()}
                </div>
                <div className="text-xl text-amber-100">
                  ₩{result.grandTotal.krw.toLocaleString()}
                </div>
              </div>

              <div className="flex justify-center items-center space-x-6 text-sm">
                <div>
                  <div className="text-amber-100">Recovery</div>
                  <div className="font-bold">{result.recoveryDays} days</div>
                </div>
                <div className="w-px h-8 bg-white/30"></div>
                <div>
                  <div className="text-amber-100">Total Trip</div>
                  <div className="font-bold">{result.totalTripDays} days</div>
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Cost Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Medical Procedure</span>
                  <span className="font-bold text-amber-700">
                    ${result.estimatedCost.usd.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Accommodation ({result.totalTripDays} days)</span>
                  <span className="font-semibold">${result.additionalCosts.accommodation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Meals ({result.totalTripDays} days)</span>
                  <span className="font-semibold">${result.additionalCosts.meals.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transportation</span>
                  <span className="font-semibold">${result.additionalCosts.transportation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Medications & Supplies</span>
                  <span className="font-semibold">${result.additionalCosts.medications.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-900">Grand Total</span>
                  <span className="text-2xl font-bold text-amber-700">
                    ${result.grandTotal.usd.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📋 What to Expect</h3>
              <ul className="space-y-2">
                {result.procedure.whatToExpect.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-700 mr-2">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Clinics */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🏥 Popular Clinics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {result.procedure.popularClinics.map((clinic, index) => (
                  <div
                    key={index}
                    className="bg-amber-50 rounded-lg p-3 text-center text-amber-900 font-medium"
                  >
                    {clinic}
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Pro Tips</h3>
              <ul className="space-y-2">
                {result.procedure.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-700 mr-2">✓</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Share Section - Following Standard Layout */}
            <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
                Share Your Estimate!
              </h3>

              {/* SNS Buttons - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>Twitter</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-[#4267B2] hover:bg-[#365899] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>

                {/* Instagram */}
                <button
                  onClick={() => alert('💡 Tip: Screenshot this result and share on Instagram! Tag @koreaexperience for a chance to be featured!')}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-700 hover:via-orange-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </button>

                {/* Threads */}
                <button
                  onClick={() => alert('💡 Tip: Screenshot this result and share on Threads! Tag @koreaexperience')}
                  className="flex items-center justify-center space-x-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.796-1.008-.649-1.68-1.665-1.867-2.816-.178-1.09.157-2.174.94-3.045.854-.95 2.101-1.561 3.516-1.718 1.37-.152 2.662.046 3.847.587.088-.503.126-.967.105-1.35-.056-.97-.388-1.713-.987-2.208-.695-.575-1.666-.862-2.885-.852-1.747.017-2.848.887-3.366 2.663l-1.95-.559c.752-2.574 2.557-3.89 5.363-3.923 1.662-.016 3.113.445 4.314 1.37 1.295 1 2.017 2.451 2.147 4.315.037.53.008 1.084-.084 1.648.536.419.95.943 1.232 1.561.761 1.677.753 4.206-1.316 6.349-1.8 1.866-4.045 2.669-7.296 2.698z"/>
                  </svg>
                  <span>Threads</span>
                </button>
              </div>

              {/* Copy Link Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert('Link copied to clipboard! 📋');
                }}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all mb-3"
              >
                📋 Copy Link
              </button>

              {/* Download Image Button */}
              <button
                onClick={handleDownloadImage}
                className="w-full bg-white hover:bg-gray-50 text-amber-700 border-2 border-amber-600 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                📸 Download Result Image
              </button>
            </div>

            {/* Try Again Button - Following Standard */}
            <div className="text-center">
              <button
                onClick={handleRestart}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all inline-flex items-center space-x-2"
              >
                <span>🔄 Try Again</span>
              </button>
            </div>

            {/* CTA - Following Standard */}
            <div className="mt-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Try More Interactive Tools!</h3>
              <p className="text-amber-100 mb-6">
                Discover your Korean name, K-pop stage name, compatibility and more
              </p>
              <Link
                href="/tools"
                className="inline-block bg-white text-amber-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Explore All Tools →
              </Link>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
