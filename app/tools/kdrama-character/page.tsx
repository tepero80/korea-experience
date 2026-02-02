'use client';

import { useState, useRef } from 'react';
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
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Share Your Result</h3>
              <div className="flex justify-center space-x-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent('https://koreaexperience.com/tools/kdrama-character')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Share on Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://koreaexperience.com/tools/kdrama-character')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Share on Facebook
                </a>
                <a
                  href={`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText + ' https://koreaexperience.com/tools/kdrama-character')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Share on Threads
                </a>
              </div>
            </div>
          </div>

          {/* Restart Button */}
          <div className="flex justify-center">
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
