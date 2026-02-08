'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { 
  KOREAN_FOODS,
  getRandomFoods,
  generateQuizQuestion,
  calculateGameResult,
  type FoodItem,
  type GameResult 
} from '@/lib/guess-korean-food';

export default function GuessKoreanFoodPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizData, setQuizData] = useState<Array<{
    food: FoodItem;
    options: FoodItem[];
  }>>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [foodsGuessed, setFoodsGuessed] = useState<string[]>([]);
  const [foodsMissed, setFoodsMissed] = useState<string[]>([]);

  const startGame = () => {
    const numQuestions = 10;
    const selectedFoods = difficulty === 'mixed' 
      ? getRandomFoods(numQuestions)
      : getRandomFoods(numQuestions, difficulty);
    
    const quiz = selectedFoods.map(food => {
      const question = generateQuizQuestion(food, KOREAN_FOODS);
      return {
        food,
        options: question.options,
      };
    });

    setQuizData(quiz);
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setFoodsGuessed([]);
    setFoodsMissed([]);
  };

  const handleAnswer = (selectedFood: FoodItem) => {
    const currentFood = quizData[currentQuestionIndex].food;
    const isCorrect = selectedFood.id === currentFood.id;

    if (isCorrect) {
      setScore(score + 1);
      setFoodsGuessed([...foodsGuessed, currentFood.name]);
    } else {
      setFoodsMissed([...foodsMissed, currentFood.name]);
    }

    setSelectedAnswer(selectedFood.id);

    setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        // Game over
        const result = calculateGameResult(
          isCorrect ? score + 1 : score,
          quizData.length,
          isCorrect ? [...foodsGuessed, currentFood.name] : foodsGuessed,
          isCorrect ? foodsMissed : [...foodsMissed, currentFood.name]
        );
        setGameResult(result);
        setShowResult(true);
      }
    }, 1500);
  };

  const handleReset = () => {
    setGameStarted(false);
    setShowResult(false);
    setGameResult(null);
  };

  const handleShare = (platform: string) => {
    const url = 'https://www.koreaexperience.com/tools/guess-korean-food';
    const text = gameResult 
      ? `I scored ${gameResult.score}/${gameResult.totalQuestions} (${gameResult.percentage}%) on the Guess Korean Food Quiz! ${gameResult.rankEmoji} ${gameResult.rank}. Can you beat my score? 🇰🇷🍜`
      : 'Test your Korean food knowledge! Can you guess these Korean dishes? 🇰🇷🍜';

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
    navigator.clipboard.writeText('https://www.koreaexperience.com/tools/guess-korean-food');
    alert('Link copied to clipboard!');
  };

  const handleDownload = () => {
    if (!gameResult) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradient background (food theme - orange to red)
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#FF6B35');
    gradient.addColorStop(0.5, '#F7931E');
    gradient.addColorStop(1, '#FDC830');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🍜 Guess Korean Food Quiz', 400, 60);

    // White box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(50, 100, 700, 400, 20);
    ctx.fill();

    // Result details
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${gameResult.rankEmoji} ${gameResult.rank}`, 400, 170);

    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#FF6B35';
    ctx.fillText(`${gameResult.score}/${gameResult.totalQuestions} Correct`, 400, 230);

    ctx.font = '32px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(`${gameResult.percentage}% Accuracy`, 400, 275);

    // Achievements
    if (gameResult.achievements.length > 0) {
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#FF6B35';
      ctx.fillText('🏆 Achievements', 400, 330);
      
      ctx.font = '18px Arial';
      ctx.fillStyle = '#666666';
      gameResult.achievements.slice(0, 3).forEach((achievement, index) => {
        ctx.fillText(achievement, 400, 360 + (index * 30));
      });
    }

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
        a.download = 'korean-food-quiz-result.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  // Result Screen
  if (showResult && gameResult) {
    return (
      <ToolLayout
        title="Guess Korean Food Photo"
        description="Test your Korean food knowledge! Can you identify these delicious Korean dishes?"
        emoji="🍜"
      >
        <div className="max-w-4xl mx-auto">
          {/* Result Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="text-7xl mb-4">{gameResult.rankEmoji}</div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {gameResult.rank}
              </h2>
              <div className="text-6xl font-bold text-gray-800 mb-2">
                {gameResult.score}/{gameResult.totalQuestions}
              </div>
              <div className="text-2xl text-gray-600 mb-4">
                {gameResult.percentage}% Correct
              </div>
              
              {/* Score Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <div
                  className="bg-gradient-to-r from-amber-600 to-orange-600 h-4 rounded-full transition-all"
                  style={{ width: `${gameResult.percentage}%` }}
                />
              </div>
            </div>

            {/* Achievements */}
            {gameResult.achievements.length > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-bold text-orange-800 mb-4 text-center">
                  🏆 Achievements Unlocked
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gameResult.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 text-center font-semibold text-gray-700 shadow-sm"
                    >
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Foods Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Correct Guesses */}
              {gameResult.foodsGuessed.length > 0 && (
                <div className="bg-green-50 rounded-xl p-5">
                  <h4 className="text-lg font-bold text-green-800 mb-3">
                    ✅ Correctly Guessed ({gameResult.foodsGuessed.length})
                  </h4>
                  <ul className="space-y-2">
                    {gameResult.foodsGuessed.map((food, index) => (
                      <li key={index} className="text-amber-700">
                        • {food}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missed Foods */}
              {gameResult.foodsMissed.length > 0 && (
                <div className="bg-red-50 rounded-xl p-5">
                  <h4 className="text-lg font-bold text-red-800 mb-3">
                    ❌ Missed ({gameResult.foodsMissed.length})
                  </h4>
                  <ul className="space-y-2">
                    {gameResult.foodsMissed.map((food, index) => (
                      <li key={index} className="text-red-700">
                        • {food}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Play Again Button */}
            <button
              onClick={handleReset}
              className="w-full mt-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xl font-bold py-4 px-8 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all shadow-lg"
            >
              Play Again 🎮
            </button>
          </div>

          {/* Share Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Share Your Score
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <button
                onClick={() => handleShare('twitter')}
                className="bg-amber-500 hover:bg-amber-500 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                Facebook
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-4 rounded-lg transition-all"
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
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                💾 Download Result
              </button>
            </div>
          </div>
        </div>
      </ToolLayout>
    );
  }

  // Quiz Screen
  if (gameStarted && quizData.length > 0) {
    const currentQuiz = quizData[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;

    return (
      <ToolLayout
        title="Guess Korean Food Photo"
        description="Test your Korean food knowledge! Can you identify these delicious Korean dishes?"
        emoji="🍜"
      >
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-700">
                Question {currentQuestionIndex + 1} of {quizData.length}
              </span>
              <span className="text-lg font-semibold text-orange-600">
                Score: {score}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-amber-600 to-orange-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Food Image (Text Description) */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6">{currentQuiz.food.emoji}</div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6">
                <p className="text-xl text-gray-700 italic">
                  "{currentQuiz.food.imageDescription}"
                </p>
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              What Korean food is this?
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuiz.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrect = option.id === currentQuiz.food.id;
                const showFeedback = selectedAnswer !== null;

                let buttonClass = 'bg-white border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50';
                
                if (showFeedback) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-100 border-2 border-amber-500';
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'bg-red-100 border-2 border-red-500';
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => !selectedAnswer && handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`${buttonClass} p-6 rounded-xl transition-all text-left disabled:cursor-not-allowed`}
                  >
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {option.name}
                    </div>
                    <div className="text-lg text-gray-600 mb-2">
                      {option.koreanName}
                    </div>
                    {showFeedback && isCorrect && (
                      <div className="text-sm text-amber-700 mt-2">
                        ✅ Correct! {option.funFact}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </ToolLayout>
    );
  }

  // Start Screen
  return (
    <ToolLayout
      title="Guess Korean Food Photo"
      description="Test your Korean food knowledge! Can you identify these delicious Korean dishes from their descriptions?"
      emoji="🍜"
    >
      <div className="max-w-3xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🍜</div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Guess Korean Food Photo
            </h2>
            <p className="text-xl text-gray-600">
              Test your knowledge of Korean cuisine! Can you identify 10 Korean dishes?
            </p>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <label className="block text-xl font-semibold text-gray-800 mb-4 text-center">
              Choose Difficulty Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 'easy', label: 'Easy', emoji: '😊', desc: 'Popular dishes' },
                { value: 'medium', label: 'Medium', emoji: '🤔', desc: 'Common foods' },
                { value: 'hard', label: 'Hard', emoji: '😰', desc: 'Expert level' },
                { value: 'mixed', label: 'Mixed', emoji: '🎲', desc: 'All levels' },
              ].map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => setDifficulty(diff.value as any)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    difficulty === diff.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{diff.emoji}</div>
                  <div className="font-bold text-gray-800">{diff.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{diff.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-2xl font-bold py-5 px-8 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Quiz! 🎮
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-orange-900 mb-3">
            🍱 How to Play
          </h3>
          <ul className="space-y-2 text-orange-800">
            <li>• You'll see 10 Korean food descriptions with emojis</li>
            <li>• Choose the correct food name from 4 options</li>
            <li>• Learn fun facts about each dish!</li>
            <li>• Share your score with friends</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
