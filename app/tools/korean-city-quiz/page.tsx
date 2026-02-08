'use client';

import { useState } from 'react';
import Link from 'next/link';
import { quizQuestions, cityResults, calculateCityResult } from '@/lib/korean-city-quiz';

export default function KoreanCityQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(Array(quizQuestions.length).fill([]));
  const [showResult, setShowResult] = useState(false);
  const [resultCity, setResultCity] = useState('');

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = [optionIndex];
    setAnswers(newAnswers);

    // Auto advance to next question after short delay
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Calculate result
        const city = calculateCityResult(newAnswers);
        setResultCity(city);
        setShowResult(true);
      }
    }, 300);
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers(Array(quizQuestions.length).fill([]));
    setShowResult(false);
    setResultCity('');
  };

  const handleShare = (platform: string) => {
    const result = cityResults[resultCity];
    const text = `I should live in ${result.name} (${result.nameKo})! ${result.emoji}\n\nFind out which Korean city matches your lifestyle:`;
    const url = 'https://koreaexperience.com/tools/korean-city-quiz';

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      threads: `https://threads.net/intent/post?text=${encodeURIComponent(text + '\n' + url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentQ = quizQuestions[currentQuestion];

  if (showResult) {
    const result = cityResults[resultCity];

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Tools
            </Link>
            <div className="text-6xl mb-4">🏙️</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Perfect Korean City
            </h1>
          </div>

          {/* Result Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{result.emoji}</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                {result.name}
              </h2>
              <p className="text-2xl text-gray-600 mb-4">{result.nameKo}</p>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                {result.description}
              </p>
            </div>

            {/* Personality */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🎭 Your City Personality</h3>
              <p className="text-lg text-gray-700">{result.personality}</p>
            </div>

            {/* Cost of Living */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-amber-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">🏠 Average Rent</h3>
                <p className="text-gray-700">{result.avgRent}</p>
                <p className="text-sm text-gray-600">{result.avgRentUSD}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">💰 Monthly Living Cost</h3>
                <p className="text-gray-700">{result.livingCost}</p>
                <p className="text-sm text-gray-600">{result.livingCostUSD}</p>
              </div>
            </div>

            {/* Pros */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Why You'll Love It</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {result.pros.map((pro, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{pro}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⚠️ Things to Consider</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {result.cons.map((con, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span className="text-gray-700">{con}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best For */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Perfect For</h3>
              <div className="space-y-2">
                {result.bestFor.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-yellow-600">★</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">💡 Fun Fact</h3>
              <p className="text-gray-700">{result.funFact}</p>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to Explore {result.name}?</h3>
              <a
                href={`https://www.booking.com/city/kr/${result.id}.html`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 px-8 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
              >
                Find Accommodation in {result.name} 🏨
              </a>
            </div>
          </div>

          {/* Share & Retry */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 text-center">Share Your Result!</h3>
              
              {/* SNS Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                  Twitter
                </button>

                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center justify-center gap-2 bg-[#4267B2] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>

                <button
                  onClick={() => alert('Instagram story sharing feature coming soon! For now, take a screenshot and share on Instagram! 📸')}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-orange-600 to-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </button>

                <button
                  onClick={() => handleShare('threads')}
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
                  onClick={() => {
                    navigator.clipboard.writeText('https://koreaexperience.com/tools/korean-city-quiz');
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
                  onClick={() => alert('Screenshot and share your result! 📸')}
                  className="w-full bg-white text-amber-700 font-semibold py-3 px-6 rounded-lg border-2 border-amber-600 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Result Image
                </button>
              </div>
            </div>

            {/* Restart Button */}
            <button
              onClick={handleReset}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              🔄 Try Again
            </button>
          </div>

          {/* Other Tools CTA */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 text-center border-2 border-amber-200">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <div className="text-6xl mb-4">🏙️</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Which Korean City Should You Live In?
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover your perfect Korean city match based on your lifestyle, career, and preferences!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-3 mb-8">
          <div
            className="bg-white rounded-full h-3 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                  answers[currentQuestion].includes(index)
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                }`}
              >
                <span className="text-lg text-gray-900">{option.text}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-all"
            >
              ← Previous
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-all"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
