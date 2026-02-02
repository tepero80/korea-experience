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
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/tools"
              className="inline-block text-white/90 hover:text-white mb-6 transition-colors"
            >
              ← Back to Tools
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
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">🎭 Your City Personality</h3>
              <p className="text-lg text-gray-700">{result.personality}</p>
            </div>

            {/* Cost of Living */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-xl p-6">
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
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">💡 Fun Fact</h3>
              <p className="text-gray-700">{result.funFact}</p>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to Explore {result.name}?</h3>
              <a
                href={`https://www.booking.com/city/kr/${result.id}.html`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                Find Accommodation in {result.name} 🏨
              </a>
            </div>
          </div>

          {/* Share & Retry */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Share Your Result</h3>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
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
            </div>
            <div className="text-center">
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold"
              >
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/tools"
            className="inline-block text-white/90 hover:text-white mb-6 transition-colors"
          >
            ← Back to Tools
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
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
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
              Reset Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
