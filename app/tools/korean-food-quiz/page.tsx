'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import ToolLayout from '@/components/ToolLayout';
import { quizQuestions, calculateFoodType, type FoodResult } from '@/lib/korean-food-quiz';

export default function KoreanFoodQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(Array(10).fill([]));
  const [result, setResult] = useState<FoodResult | null>(null);
  const [showQuiz, setShowQuiz] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = [optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      // Calculate result
      setTimeout(() => {
        const foodResult = calculateFoodType(newAnswers);
        setResult(foodResult);
        setShowQuiz(false);
      }, 300);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers(Array(10).fill([]));
    setResult(null);
    setShowQuiz(true);
  };

  const shareText = result 
    ? `I'm ${result.name} (${result.nameKo})! ${result.emoji} What Korean food matches your personality?`
    : '';

  const handleDownloadImage = () => {
    if (!result || !resultRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 500);
    gradient.addColorStop(0, '#f97316'); // orange-500
    gradient.addColorStop(0.5, '#ef4444'); // red-500
    gradient.addColorStop(1, '#f97316'); // orange-500
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('What Korean Food Matches You?', 400, 60);

    // Food name
    ctx.font = 'bold 40px Arial';
    ctx.fillText(`${result.emoji} ${result.name}`, 400, 130);

    // Korean name
    ctx.font = '28px Arial';
    ctx.fillText(result.nameKo, 400, 170);

    // Category
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#fef08a'; // yellow-200
    ctx.fillText(result.category, 400, 210);

    // Description (wrap text)
    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
    const words = result.description.split(' ');
    let line = '';
    let y = 260;
    
    words.forEach((word, index) => {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 700 && index > 0) {
        ctx.fillText(line, 400, y);
        line = word + ' ';
        y += 28;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, 400, y);

    // Site info
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🇰🇷 Korea Experience', 400, 460);

    // Download
    const link = document.createElement('a');
    link.download = `korean-food-personality-${result.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!showQuiz && result) {
    return (
      <ToolLayout
        title="What Korean Food Matches Your Personality?"
        description="Discover which Korean food perfectly represents your unique personality"
        emoji="🍜"
        gradient="from-orange-500 via-red-500 to-orange-600"
      >
        <div ref={resultRef} className="max-w-2xl mx-auto space-y-6">
          {/* Result Header */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 text-center text-white shadow-2xl">
            <div className="text-8xl mb-4">{result.emoji}</div>
            <h2 className="text-4xl font-bold mb-2">{result.name}</h2>
            <p className="text-2xl mb-1">{result.nameKo}</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 inline-block mt-4">
              <span className="text-lg font-semibold">{result.category}</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Your Personality</h3>
            <p className="text-gray-700 leading-relaxed">{result.description}</p>
          </div>

          {/* Personality Traits */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Your Traits</h3>
            <div className="flex flex-wrap gap-2">
              {result.personality.map((trait, index) => (
                <span
                  key={index}
                  className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Flavor Profile */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🌶️ Flavor Profile</h3>
            <p className="text-gray-700">{result.flavorProfile}</p>
          </div>

          {/* Best Paired With */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🍽️ Best Paired With</h3>
            <div className="flex flex-wrap gap-2">
              {result.bestPairedWith.map((item, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* When to Eat */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">⏰ When to Eat</h3>
            <p className="text-gray-700">{result.whenToEat}</p>
          </div>

          {/* Popular In */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">📍 Popular In</h3>
            <p className="text-gray-700">{result.popularIn}</p>
          </div>

          {/* Health Benefits */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">💪 Health Benefits</h3>
            <ul className="space-y-2">
              {result.healthBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fun Fact */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🎉 Fun Fact</h3>
            <p className="text-gray-700 italic">{result.funFact}</p>
          </div>

          {/* Perfect For */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">✨ Perfect For</h3>
            <p className="text-gray-700">{result.perfectFor}</p>
          </div>

          {/* Similar Foods */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🌎 Similar Foods Worldwide</h3>
            <div className="flex flex-wrap gap-2">
              {result.similarFoods.map((food, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm"
                >
                  {food}
                </span>
              ))}
            </div>
          </div>

          {/* Share Your Result */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900 text-center">Share Your Result!</h3>
            
            {/* SNS Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent('https://koreaexperience.com/tools/korean-food-quiz')}`}
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
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://koreaexperience.com/tools/korean-food-quiz')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#4267B2] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>

              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </a>

              <a
                href={`https://www.threads.net/`}
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
                  navigator.clipboard.writeText('https://koreaexperience.com/tools/korean-food-quiz');
                  alert('Link copied to clipboard!');
                }}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </button>

              <button
                onClick={handleDownloadImage}
                className="w-full bg-white text-orange-600 font-semibold py-3 px-6 rounded-lg border-2 border-orange-600 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
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
            onClick={handleRestart}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            🔄 Try Again
          </button>

          {/* Try More Interactive Tools */}
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-8 text-center border-2 border-orange-200 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Try More Interactive Tools!
            </h3>
            <p className="text-gray-700 mb-6">
              Discover more about your Korean identity
            </p>
            <Link
              href="/tools"
              className="inline-block bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
            >
              Explore All Tools
            </Link>
          </div>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title="What Korean Food Matches Your Personality?"
      description="Discover which Korean food perfectly represents your unique personality"
      emoji="🍜"
      gradient="from-orange-500 via-red-500 to-orange-600"
    >
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {quizQuestions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 group"
              >
                <span className="text-gray-700 group-hover:text-orange-700 font-medium">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Info */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 text-center">
          <p className="text-gray-600">
            🍜 Discover your Korean food soulmate based on your unique personality traits!
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
