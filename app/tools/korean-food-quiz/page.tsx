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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🔄 Take Quiz Again
            </button>
            <button
              onClick={handleDownloadImage}
              className="flex-1 bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-all duration-200 shadow-lg border-2 border-orange-200"
            >
              📸 Download Result
            </button>
          </div>

          {/* Share Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 text-center">
            <p className="text-gray-700 mb-4">Share your result with friends!</p>
            <div className="flex justify-center gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent('https://koreaexperience.com/tools/korean-food-quiz')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://koreaexperience.com/tools/korean-food-quiz')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Explore More */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Explore More Korean Culture</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/tools/kdrama-character"
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-3 rounded-lg transition-colors font-medium"
              >
                🎭 K-Drama Character Quiz
              </Link>
              <Link
                href="/tools/korean-name"
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-lg transition-colors font-medium"
              >
                🏷️ Get Your Korean Name
              </Link>
              <Link
                href="/tools/korean-city-quiz"
                className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-3 rounded-lg transition-colors font-medium"
              >
                🏙️ Which City Suits You?
              </Link>
              <Link
                href="/blog"
                className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-6 py-3 rounded-lg transition-colors font-medium"
              >
                📖 Read Korea Blog
              </Link>
            </div>
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
