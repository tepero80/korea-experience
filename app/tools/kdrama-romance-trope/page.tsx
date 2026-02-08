'use client';

import { useState, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { quizQuestions, calculateTrope, type TropeResult } from '@/lib/kdrama-romance-trope';

export default function KDramaRomanceTropePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(Array(8).fill([]));
  const [result, setResult] = useState<TropeResult | null>(null);
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
        const tropeResult = calculateTrope(newAnswers);
        setResult(tropeResult);
        setShowQuiz(false);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, 300);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers(Array(8).fill([]));
    setResult(null);
    setShowQuiz(true);
  };

  const shareText = result 
    ? `My K-Drama romance trope is: ${result.name} (${result.nameKo})! ${result.emoji} ${result.tagline}`
    : '';

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.koreaexperience.com/tools/kdrama-romance-trope';

  const handleDownloadImage = () => {
    if (!result) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradient background (romantic pink-purple)
    const gradient = ctx.createLinearGradient(0, 0, 800, 500);
    gradient.addColorStop(0, '#d97706'); // pink-500
    gradient.addColorStop(0.5, '#ea580c'); // fuchsia-500
    gradient.addColorStop(1, '#d97706'); // pink-500
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Your K-Drama Romance Trope', 400, 50);

    // Emoji
    ctx.font = '72px Arial';
    ctx.fillText(result.emoji, 400, 140);

    // Trope name
    ctx.font = 'bold 36px Arial';
    ctx.fillText(result.name, 400, 200);

    // Korean name
    ctx.font = '24px Arial';
    ctx.fillText(result.nameKo, 400, 235);

    // Tagline
    ctx.font = 'italic 22px Arial';
    ctx.fillStyle = '#fef3c7'; // yellow-100
    ctx.fillText(`"${result.tagline}"`, 400, 275);

    // Description (multi-line)
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    const words = result.description.split(' ');
    let line = '';
    let y = 320;
    const maxWidth = 700;
    let lineCount = 0;
    const maxLines = 5;

    for (let i = 0; i < words.length && lineCount < maxLines; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, 400, y);
        line = words[i] + ' ';
        y += 22;
        lineCount++;
      } else {
        line = testLine;
      }
    }
    if (lineCount < maxLines) {
      ctx.fillText(line, 400, y);
    }

    // Footer
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('koreaexperience.com/tools/kdrama-romance-trope', 400, 470);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kdrama-romance-trope-${result.id}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <ToolLayout
      title="Your K-Drama Romance Trope"
      description="Discover which K-Drama romance trope perfectly matches your love story preferences!"
      emoji="💕"
    >
      {showQuiz ? (
        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-fuchsia-500 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {quizQuestions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group"
                >
                  <span className="text-gray-700 group-hover:text-orange-700 font-medium">
                    {option.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Back Button */}
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="text-gray-600 hover:text-orange-600 font-medium"
            >
              ← Previous Question
            </button>
          )}
        </div>
      ) : result && (
        <div ref={resultRef} className="space-y-8">
          {/* Result Header */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-2xl p-8 text-white text-center">
            <div className="text-7xl mb-4">{result.emoji}</div>
            <h2 className="text-4xl font-bold mb-2">{result.name}</h2>
            <p className="text-2xl opacity-90 mb-3">{result.nameKo}</p>
            <p className="text-xl italic opacity-95">"{result.tagline}"</p>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Romance Story</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{result.description}</p>
          </div>

          {/* Storyline */}
          <div className="bg-orange-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-stone-900 mb-4">The Classic Storyline</h3>
            <p className="text-gray-700 leading-relaxed">{result.storyline}</p>
          </div>

          {/* Iconic Moments */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Iconic Moments 🎬</h3>
            <ul className="space-y-3">
              {result.iconicMoments.map((moment, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">✨</span>
                  <span className="text-gray-700 leading-relaxed">{moment}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Representative Dramas */}
          <div className="bg-orange-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-stone-900 mb-6">Must-Watch Dramas 📺</h3>
            <div className="space-y-4">
              {result.representativeDramas.map((drama, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{drama.title}</h4>
                      <p className="text-gray-600">({drama.year})</p>
                      <p className="text-sm text-gray-500 mt-1">Starring: {drama.leads}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Scenario */}
          <div className="bg-gradient-to-r from-orange-100 to-orange-100 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">If You Were the Main Character 🌟</h3>
            <p className="text-gray-700 leading-relaxed italic">{result.yourScenario}</p>
          </div>

          {/* Romantic Highlights */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Romantic Highlights 💖</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.romanticHighlights.map((highlight, index) => (
                <div key={index} className="bg-orange-50 rounded-lg p-4">
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Relationship Challenges 💔</h3>
            <ul className="space-y-3">
              {result.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">⚡</span>
                  <span className="text-gray-700">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Happy Ending */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Happy Ending 💕</h3>
            <p className="text-gray-700 leading-relaxed">{result.happyEnding}</p>
          </div>

          {/* Share Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Result! 💕</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-500 transition-colors font-medium"
              >
                Share on Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Share on Facebook
              </a>
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-colors font-medium"
              >
                Share on Instagram
              </a>
              <a
                href={`https://www.threads.net/`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Share on Threads
              </a>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleCopyLink}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                📋 Copy Link
              </button>
              <button
                onClick={handleDownloadImage}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-fuchsia-500 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-colors font-medium"
              >
                💾 Download Result Image
              </button>
            </div>
          </div>

          {/* Try Again Button */}
          <div className="text-center pt-4">
            <button
              onClick={handleRestart}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-fuchsia-500 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-bold text-lg shadow-lg"
            >
              🔄 Try Again
            </button>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Try More Interactive Tools!</h3>
            <p className="text-gray-600 mb-4">
              Discover more about Korean culture and entertainment
            </p>
            <a
              href="/tools"
              className="inline-block px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-colors font-medium"
            >
              Explore All Tools →
            </a>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
