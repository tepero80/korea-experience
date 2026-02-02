'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ToolLayout from '@/components/ToolLayout';
import {
  getRandomText,
  calculateTypingResult,
  saveScore,
  getLeaderboard,
  getPersonalBest,
  getDifficultyLabel,
  type TypingText,
  type TypingResult,
  type LeaderboardEntry,
} from '@/lib/korean-typing-test';

export default function KoreanTypingTest() {
  // Game state
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentText, setCurrentText] = useState<TypingText | null>(null);
  const [typedText, setTypedText] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<TypingResult | null>(null);
  
  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [personalBest, setPersonalBest] = useState<LeaderboardEntry | null>(null);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load leaderboard on mount
  useEffect(() => {
    setLeaderboard(getLeaderboard());
    setPersonalBest(getPersonalBest());
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            finishTest();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Start test
  const startTest = () => {
    const text = getRandomText(difficulty);
    setCurrentText(text);
    setTypedText('');
    setTimeLeft(60);
    setIsActive(true);
    setIsFinished(false);
    setResult(null);
    
    // Focus on input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Finish test
  const finishTest = () => {
    if (!currentText) return;
    
    setIsActive(false);
    setIsFinished(true);
    
    const timeElapsed = 60 - timeLeft;
    const testResult = calculateTypingResult(
      currentText.text,
      typedText,
      timeElapsed > 0 ? timeElapsed : 60,
      difficulty
    );
    
    setResult(testResult);
    saveScore(testResult);
    
    // Refresh leaderboard
    setLeaderboard(getLeaderboard());
    setPersonalBest(getPersonalBest());
    
    // Scroll to result
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle typing
  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isActive || !currentText) return;
    setTypedText(e.target.value);
  };

  // Render character with color (correct/incorrect/pending)
  const renderTextWithHighlight = () => {
    if (!currentText) return null;
    
    return currentText.text.split('').map((char, index) => {
      let className = 'text-gray-400'; // pending
      
      if (index < typedText.length) {
        if (typedText[index] === char) {
          className = 'text-green-600'; // correct
        } else {
          className = 'text-red-600 bg-red-100'; // incorrect
        }
      }
      
      if (index === typedText.length && isActive) {
        className += ' animate-pulse bg-yellow-200'; // current cursor position
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  // Download result as image
  const downloadImage = () => {
    if (!result) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 500);
    gradient.addColorStop(0, '#8B5CF6'); // purple
    gradient.addColorStop(1, '#EC4899'); // pink
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 500);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('⌨️ Korean Typing Speed Test', 400, 80);

    // WPM
    ctx.font = 'bold 72px Arial';
    ctx.fillText(`${result.wpm} CPM`, 400, 180);

    // Accuracy
    ctx.font = '36px Arial';
    ctx.fillText(`${result.accuracy}% Accuracy`, 400, 240);

    // Rating
    ctx.font = 'bold 42px Arial';
    ctx.fillText(result.rating, 400, 310);

    // Difficulty
    ctx.font = '28px Arial';
    ctx.fillText(`Level: ${getDifficultyLabel(result.difficulty)}`, 400, 360);

    // Footer
    ctx.font = '22px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('koreaexperience.com', 400, 450);

    // Download
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `typing-test-${result.wpm}cpm.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  // Share URLs
  const shareText = result
    ? `I just typed ${result.wpm} CPM with ${result.accuracy}% accuracy in Korean! ${result.rating} 🎯⌨️`
    : '';
  const shareUrl = 'https://koreaexperience.com/tools/korean-typing-test';

  return (
    <ToolLayout
      title="Korean Typing Speed Test"
      description="Test your Korean typing speed and accuracy! 한글 타자 속도를 측정해보세요 ⌨️"
      emoji="⌨️"
      gradient="from-purple-500 via-pink-500 to-purple-600"
    >
      <div className="max-w-4xl mx-auto">

        {/* Difficulty Selection */}
        {!isActive && !isFinished && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Choose Difficulty Level
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setDifficulty('beginner')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  difficulty === 'beginner'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">🌱</div>
                <div className="font-bold text-lg mb-1">Beginner</div>
                <div className="text-sm text-gray-600">초급</div>
                <div className="text-xs text-gray-500 mt-2">
                  Simple daily phrases
                </div>
              </button>

              <button
                onClick={() => setDifficulty('intermediate')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  difficulty === 'intermediate'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">📚</div>
                <div className="font-bold text-lg mb-1">Intermediate</div>
                <div className="text-sm text-gray-600">중급</div>
                <div className="text-xs text-gray-500 mt-2">
                  Varied vocabulary
                </div>
              </button>

              <button
                onClick={() => setDifficulty('advanced')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  difficulty === 'advanced'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">🚀</div>
                <div className="font-bold text-lg mb-1">Advanced</div>
                <div className="text-sm text-gray-600">고급</div>
                <div className="text-xs text-gray-500 mt-2">
                  Complex sentences
                </div>
              </button>
            </div>

            {/* Personal Best */}
            {personalBest && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Your Personal Best</div>
                    <div className="font-bold text-lg">
                      {personalBest.wpm} CPM · {personalBest.accuracy}% · {getDifficultyLabel(personalBest.difficulty)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={startTest}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-xl text-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Start Test (60 seconds)
            </button>
          </div>
        )}

        {/* Typing Test */}
        {isActive && currentText && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            {/* Timer & Stats */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <div className="text-center">
                <div className="text-sm text-gray-600">Time Left</div>
                <div className="text-3xl font-bold text-purple-600">{timeLeft}s</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Level</div>
                <div className="text-lg font-bold">{getDifficultyLabel(difficulty)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Progress</div>
                <div className="text-lg font-bold">
                  {typedText.length} / {currentText.text.length}
                </div>
              </div>
            </div>

            {/* Text to type */}
            <div className="bg-gray-50 p-6 rounded-lg mb-4 text-xl leading-relaxed font-mono">
              {renderTextWithHighlight()}
            </div>

            {/* Input area */}
            <textarea
              ref={inputRef}
              value={typedText}
              onChange={handleTyping}
              className="w-full p-4 border-2 border-purple-300 rounded-lg text-lg font-mono focus:outline-none focus:border-purple-500"
              rows={4}
              placeholder="Start typing here... 여기에 타이핑하세요..."
              disabled={!isActive}
            />

            <button
              onClick={finishTest}
              className="mt-4 w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Stop Test
            </button>
          </div>
        )}

        {/* Results */}
        {isFinished && result && (
          <div ref={resultRef} className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{result.rating.split(' ')[0]}</div>
              <h2 className="text-3xl font-bold mb-2">Test Complete!</h2>
              <p className="text-gray-600">{result.feedback}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Typing Speed</div>
                <div className="text-4xl font-bold text-purple-600 mb-1">
                  {result.wpm} CPM
                </div>
                <div className="text-xs text-gray-500">Characters Per Minute</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Accuracy</div>
                <div className="text-4xl font-bold text-green-600 mb-1">
                  {result.accuracy}%
                </div>
                <div className="text-xs text-gray-500">
                  {result.correctChars} / {result.totalChars} correct
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Rating</div>
                <div className="text-2xl font-bold text-blue-600">
                  {result.rating}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Level</div>
                <div className="text-2xl font-bold text-orange-600">
                  {getDifficultyLabel(result.difficulty)}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span>💡</span> Tips to Improve
              </h3>
              <ul className="space-y-2">
                {result.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Share Section */}
            <div className="border-t pt-8">
              <h3 className="text-xl font-bold mb-4 text-center">
                Share Your Result! 🎉
              </h3>
              
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1DA1F2] text-white px-6 py-3 rounded-lg hover:bg-[#1a8cd8] transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                  Twitter
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1877F2] text-white px-6 py-3 rounded-lg hover:bg-[#166fe5] transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                  Facebook
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    alert('Link copied to clipboard!');
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Link
                </button>

                <button
                  onClick={downloadImage}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Download Image
                </button>
              </div>

              <button
                onClick={() => {
                  setIsFinished(false);
                  setResult(null);
                  setCurrentText(null);
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-xl text-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
              <span>🏆</span> Your Top Scores
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Rank</th>
                    <th className="text-left py-3 px-4">Speed</th>
                    <th className="text-left py-3 px-4">Accuracy</th>
                    <th className="text-left py-3 px-4">Level</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(0, 10).map((entry, index) => (
                    <tr key={entry.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-bold">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-purple-600">
                        {entry.wpm} CPM
                      </td>
                      <td className="py-3 px-4">{entry.accuracy}%</td>
                      <td className="py-3 px-4 text-sm">
                        {getDifficultyLabel(entry.difficulty)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Try More Interactive Tools */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 text-center border-2 border-purple-200 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Try More Interactive Tools!
          </h3>
          <p className="text-gray-700 mb-6">
            Discover more about your Korean talents!
          </p>
          <Link
            href="/tools"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
          >
            Explore All Tools
          </Link>
        </div>
      </div>
    </ToolLayout>
  );
}
