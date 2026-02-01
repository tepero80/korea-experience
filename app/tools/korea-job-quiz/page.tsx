'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { QUIZ_QUESTIONS, JobResult } from '@/lib/job-quiz-data';
import { calculateJobResult, getProgress, getTopMatches, generateShareText } from '@/lib/job-quiz';

export default function KoreaJobQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<JobResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const progress = getProgress(currentQuestion + 1, QUIZ_QUESTIONS.length);

  // Handle answer selection
  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed - calculate result
      const jobResult = calculateJobResult(newAnswers);
      setResult(jobResult);
      setShowResult(true);

      // Scroll to result after a brief delay
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  // Restart quiz
  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setShowResult(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SNS Share handlers
  const handleShareTwitter = () => {
    if (!result) return;
    const text = encodeURIComponent(generateShareText(result));
    const url = encodeURIComponent('https://www.koreaexperience.com/tools/korea-job-quiz');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent('https://www.koreaexperience.com/tools/korea-job-quiz');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const handleShareInstagram = () => {
    if (!result) return;
    const text = generateShareText(result) + ' https://www.koreaexperience.com/tools/korea-job-quiz';
    navigator.clipboard.writeText(text);
    alert('✅ Copied! Open Instagram and paste to share 📸');
  };

  const handleShareThreads = () => {
    if (!result) return;
    const text = encodeURIComponent(generateShareText(result) + ' https://www.koreaexperience.com/tools/korea-job-quiz');
    window.open(`https://threads.net/intent/post?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://www.koreaexperience.com/tools/korea-job-quiz');
    alert('✅ Link copied to clipboard!');
  };

  // Download result as image
  const handleDownload = () => {
    if (!result) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Emoji
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(result.emoji, 400, 180);

    // Job title
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(result.title, 400, 280);

    // Korean title
    ctx.font = '32px Arial';
    ctx.fillStyle = '#e0e0e0';
    ctx.fillText(result.titleKorean, 400, 330);

    // Personality
    ctx.font = '24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(result.personality, 400, 400);

    // Website
    ctx.font = '20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('KoreaExperience.com', 400, 550);

    // Download
    const link = document.createElement('a');
    link.download = `korea-job-quiz-${result.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const currentQuestionData = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="pt-20 pb-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            💼 What Would Your Job Be in Korea?
          </h1>
          <p className="text-xl text-white/90">
            Discover your perfect Korean career match!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showResult ? (
          /* Quiz Mode */
          <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-sm font-semibold text-purple-600">
                  {progress}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                {currentQuestionData.question}
              </h2>

              {/* Options */}
              <div className="space-y-4">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="
                      w-full text-left p-6 rounded-xl border-2 border-gray-200
                      hover:border-purple-400 hover:bg-purple-50
                      transition-all duration-200
                      hover:shadow-lg hover:scale-[1.02]
                      active:scale-[0.98]
                      group
                    "
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-800 group-hover:text-purple-700">
                        {option.text}
                      </span>
                      <svg
                        className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Previous Answers Indicator */}
            {currentQuestion > 0 && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setCurrentQuestion(Math.max(0, currentQuestion - 1));
                    setAnswers(answers.slice(0, -1));
                  }}
                  className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Go Back
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Result Mode */
          <div ref={resultRef} className="max-w-4xl mx-auto">
            {/* Result Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 border-2 border-purple-200">
              {/* Result Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 text-center">
                <div className="text-8xl mb-4">{result?.emoji}</div>
                <h2 className="text-4xl md:text-5xl font-bold mb-2">{result?.title}</h2>
                <p className="text-2xl text-white/90 mb-4">{result?.titleKorean}</p>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <p className="text-lg font-semibold">{result?.personality}</p>
                </div>
              </div>

              {/* Result Content */}
              <div className="p-8">
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">About This Job</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">{result?.description}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="text-sm font-semibold text-purple-700 mb-1">💰 Salary Range</div>
                    <div className="text-lg font-bold text-gray-900">{result?.salary}</div>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                    <div className="text-sm font-semibold text-pink-700 mb-1">📍 Location</div>
                    <div className="text-lg font-bold text-gray-900">{result?.location}</div>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                      <span className="text-2xl">✅</span> Pros
                    </h3>
                    <ul className="space-y-2">
                      {result?.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span className="text-gray-700">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                      <span className="text-2xl">⚠️</span> Cons
                    </h3>
                    <ul className="space-y-2">
                      {result?.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-600 mt-1">•</span>
                          <span className="text-gray-700">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Skills Needed */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">🎯 Skills You'll Need</h3>
                  <div className="flex flex-wrap gap-2">
                    {result?.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 text-center">Share Your Result!</h3>
                  
                  {/* SNS Buttons Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={handleShareTwitter}
                      className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                      </svg>
                      Twitter
                    </button>

                    <button
                      onClick={handleShareFacebook}
                      className="flex items-center justify-center gap-2 bg-[#4267B2] text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </button>

                    <button
                      onClick={handleShareInstagram}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      Instagram
                    </button>

                    <button
                      onClick={handleShareThreads}
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
                      onClick={handleCopyLink}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </button>

                    <button
                      onClick={handleDownload}
                      className="w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
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
                  onClick={handleRestart}
                  className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  🔄 Take Quiz Again
                </button>
              </div>
            </div>

            {/* Other Tools CTA */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 text-center border-2 border-purple-200">
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
      </div>
    </div>
  );
}
