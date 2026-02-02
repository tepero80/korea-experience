'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { 
  QUIZ_QUESTIONS, 
  calculateSkinType, 
  getSkinTypeResult,
  type BeautyRoutineResult 
} from '@/lib/korean-beauty-quiz';

export default function KoreanBeautyQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  const [result, setResult] = useState<BeautyRoutineResult | null>(null);
  const [showMorning, setShowMorning] = useState(true);

  const handleAnswer = (skinType: string) => {
    const newAnswers = {
      ...answers,
      [QUIZ_QUESTIONS[currentQuestion].id]: skinType,
    };
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete - calculate result
      const skinType = calculateSkinType(newAnswers);
      const skinTypeResult = getSkinTypeResult(skinType);
      setResult(skinTypeResult);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setShowMorning(true);
  };

  const handleShare = (platform: string) => {
    const url = 'https://www.koreaexperience.com/tools/korean-beauty-quiz';
    const text = result 
      ? `I discovered my skin type: ${result.skinType}! Take the Korean Beauty Routine Quiz at Korea Experience! 🇰🇷✨`
      : 'Take the Korean Beauty Routine Quiz to find your perfect K-beauty routine! 🇰🇷✨';

    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://www.koreaexperience.com/tools/korean-beauty-quiz');
    alert('Link copied to clipboard!');
  };

  const handleDownload = () => {
    if (!result) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradient background (beauty pink theme)
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#FFC0CB');
    gradient.addColorStop(0.5, '#FFB6D9');
    gradient.addColorStop(1, '#FF69B4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Korean Beauty Routine Quiz', 400, 60);

    // White box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(50, 100, 700, 400, 20);
    ctx.fill();

    // Result details
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${result.icon} ${result.skinType}`, 400, 160);

    ctx.font = '22px Arial';
    ctx.fillStyle = '#666666';
    
    // Wrap description
    const words = result.description.split(' ');
    let line = '';
    let y = 210;
    for (let word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 650 && line !== '') {
        ctx.fillText(line, 400, y);
        line = word + ' ';
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 400, y);

    // Characteristics
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#FF69B4';
    ctx.fillText('Key Characteristics:', 400, y + 50);
    
    ctx.font = '18px Arial';
    ctx.fillStyle = '#666666';
    const char1 = `• ${result.characteristics[0]}`;
    const char2 = result.characteristics[1] ? `• ${result.characteristics[1]}` : '';
    ctx.fillText(char1, 400, y + 80);
    if (char2) ctx.fillText(char2, 400, y + 110);

    // Footer
    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Korea Experience', 400, 560);

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'korean-beauty-routine.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  if (result) {
    return (
      <ToolLayout
        title="Korean Beauty Routine Quiz"
        description="Discover your perfect Korean skincare routine based on your skin type. Get personalized K-beauty recommendations!"
        emoji="✨"
      >
        <div className="max-w-4xl mx-auto">
          {/* Result Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">{result.icon}</div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {result.skinType}
              </h2>
              <p className="text-xl text-gray-700 mb-6">{result.description}</p>
            </div>

            {/* Characteristics */}
            <div className="bg-pink-50 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-bold text-pink-800 mb-4">
                🎯 Your Skin Characteristics
              </h3>
              <ul className="space-y-2">
                {result.characteristics.map((char, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-pink-500 mr-2">•</span>
                    <span className="text-gray-700">{char}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Routine Toggle */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setShowMorning(true)}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  showMorning
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                ☀️ Morning Routine
              </button>
              <button
                onClick={() => setShowMorning(false)}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  !showMorning
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                🌙 Evening Routine
              </button>
            </div>

            {/* Routine Steps */}
            <div className="space-y-4">
              {(showMorning ? result.morningRoutine : result.eveningRoutine).map((step) => (
                <div key={step.step} className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-1">{step.name}</h4>
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.products.map((product, idx) => (
                          <span
                            key={idx}
                            className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-pink-200"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              🛍️ Recommended Korean Products
            </h3>
            <div className="space-y-6">
              {result.productRecommendations.map((category, index) => (
                <div key={index} className="border-l-4 border-pink-500 pl-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-3">{category.category}</h4>
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Product Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.products.map((product, idx) => (
                        <span
                          key={idx}
                          className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Korean Brands:</p>
                    <div className="flex flex-wrap gap-2">
                      {category.koreanBrands.map((brand, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Korean Tips */}
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              💎 K-Beauty Expert Tips
            </h3>
            <ul className="space-y-3">
              {result.koreanTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-3 text-xl">{tip.substring(0, 2)}</span>
                  <span className="text-gray-700 flex-1">{tip.substring(3)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Try Again Button */}
          <button
            onClick={handleReset}
            className="w-full bg-gray-100 text-gray-700 text-lg font-semibold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all mb-8"
          >
            Take Quiz Again
          </button>

          {/* Share Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Share Your Results
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <button
                onClick={() => handleShare('twitter')}
                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                Facebook
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('reddit')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                Reddit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleCopyLink}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                📋 Copy Link
              </button>
              <button
                onClick={handleDownload}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                💾 Download Result
              </button>
            </div>
          </div>
        </div>
      </ToolLayout>
    );
  }

  // Quiz View
  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <ToolLayout
      title="Korean Beauty Routine Quiz"
      description="Discover your perfect Korean skincare routine based on your skin type. Answer 5 simple questions to get personalized K-beauty recommendations!"
      emoji="✨"
    >
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-sm font-semibold text-pink-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {question.question}
          </h2>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.skinType)}
                className="w-full p-5 rounded-xl border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg text-gray-700 group-hover:text-pink-700 font-medium">
                    {option.text}
                  </span>
                  <span className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6">
          <p className="text-center text-gray-700">
            ✨ Answer honestly for the most accurate K-beauty routine recommendations!
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
