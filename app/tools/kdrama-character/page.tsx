'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import ToolLayout from '@/components/ToolLayout';
import { quizQuestions, calculateCharacterType, type CharacterResult } from '@/lib/kdrama-character-quiz';

export default function KDramaCharacterQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(Array(10).fill([]));
  const [result, setResult] = useState<CharacterResult | null>(null);
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
        const characterResult = calculateCharacterType(newAnswers);
        setResult(characterResult);
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
    ? `I'm ${result.name} (${result.nameKo})! ${result.emoji} Which K-Drama character are you?`
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
    gradient.addColorStop(0, '#7c3aed'); // violet-600
    gradient.addColorStop(0.5, '#ec4899'); // pink-500
    gradient.addColorStop(1, '#7c3aed'); // violet-600
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Which K-Drama Character Are You?', 400, 60);

    // Character name
    ctx.font = 'bold 40px Arial';
    ctx.fillText(`${result.emoji} ${result.name}`, 400, 130);

    // Korean name
    ctx.font = '28px Arial';
    ctx.fillText(result.nameKo, 400, 170);

    // Archetype
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#fde047'; // yellow-300
    ctx.fillText(result.archetype, 400, 210);

    // Description (multi-line)
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    const words = result.description.split(' ');
    let line = '';
    let y = 260;
    const maxWidth = 700;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, 400, y);
        line = words[i] + ' ';
        y += 25;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 400, y);

    // Footer
    ctx.font = '16px Arial';
    ctx.fillText('koreaexperience.com/tools/kdrama-character', 400, 470);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kdrama-character-${result.id}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <ToolLayout
      title="Which K-Drama Character Are You?"
      description="Answer 10 questions to discover which K-Drama character archetype matches your personality!"
      emoji="🎭"
      gradient="from-violet-600 via-pink-500 to-violet-600"
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
                className="h-full bg-gradient-to-r from-violet-600 to-pink-500 transition-all duration-300"
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
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:border-violet-500 hover:bg-violet-50 ${
                    answers[currentQuestion].includes(index)
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <span className="text-lg">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : result && (
        <div ref={resultRef} className="space-y-6">
          {/* Result Header */}
          <div className="bg-gradient-to-r from-violet-600 via-pink-500 to-violet-600 text-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">{result.emoji}</div>
            <h2 className="text-3xl font-bold mb-2">{result.name}</h2>
            <p className="text-2xl opacity-90 mb-2">{result.nameKo}</p>
            <p className="text-xl font-semibold text-yellow-300">{result.archetype}</p>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Your Character</h3>
            <p className="text-gray-700 leading-relaxed">{result.description}</p>
          </div>

          {/* Personality Traits */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Personality Traits</h3>
            <div className="flex flex-wrap gap-2">
              {result.personality.map((trait, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-violet-100 to-pink-100 text-violet-700 rounded-full text-sm font-medium"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Love Style */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">💕 Love Style</h3>
            <p className="text-gray-700 leading-relaxed">{result.loveStyle}</p>
          </div>

          {/* Representative Dramas */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📺 Representative Dramas</h3>
            <div className="space-y-3">
              {result.representativeDramas.map((drama, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{drama.title} ({drama.year})</p>
                    <p className="text-sm text-gray-600">Character: {drama.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Famous Quote */}
          <div className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-xl shadow-lg p-6 border-l-4 border-violet-500">
            <h3 className="text-xl font-bold text-gray-900 mb-3">💬 Famous Quote</h3>
            <p className="text-lg text-gray-700 italic">{result.famousQuote}</p>
          </div>

          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">✨ Strengths</h3>
            <ul className="space-y-2">
              {result.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">⚠️ Challenges</h3>
            <ul className="space-y-2">
              {result.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-500 mr-2">!</span>
                  <span className="text-gray-700">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ideal Partner */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">💝 Ideal Partner</h3>
            <p className="text-gray-700 leading-relaxed">{result.idealPartner}</p>
          </div>

          {/* Career Path */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">💼 Career Path</h3>
            <p className="text-gray-700 leading-relaxed">{result.careerPath}</p>
          </div>

          {/* Download & Share Buttons */}
          <div className="space-y-4">
            {/* Download Image Button */}
            <div className="flex justify-center">
              <button
                onClick={handleDownloadImage}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-lg font-semibold hover:from-violet-700 hover:to-pink-700 transition-all flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Image</span>
              </button>
            </div>

            {/* Share Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900 text-center">Share Your Result!</h3>
                
                {/* SNS Buttons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent('https://koreaexperience.com/tools/kdrama-character')}`}
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
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://koreaexperience.com/tools/kdrama-character')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#4267B2] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>

                  <button
                    onClick={() => alert('Instagram story sharing feature coming soon! For now, take a screenshot and share on Instagram! 📸')}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Instagram
                  </button>

                  <a
                    href={`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText + ' https://koreaexperience.com/tools/kdrama-character')}`}
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
                      navigator.clipboard.writeText('https://koreaexperience.com/tools/kdrama-character');
                      alert('Link copied to clipboard! 📋');
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>

                  <button
                    onClick={() => alert('Screenshot and share your result! 📸')}
                    className="w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Result Image
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Restart Button */}
          <div className="flex justify-center">
            <button
              onClick={handleRestart}
              className="w-full max-w-md bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              🔄 Take Quiz Again
            </button>
          </div>

          {/* Other Tools CTA */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 text-center border-2 border-purple-200 mt-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Try More Interactive Tools!
            </h3>
            <p className="text-gray-700 mb-6">
              Discover more about your Korean identity
            </p>
            <Link
              href="/tools"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
            >
              Explore All Tools
            </Link>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
