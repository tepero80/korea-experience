'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateKpopStageName, StageNameResult } from '@/lib/kpop-stage-name';

export default function KpopStageNamePage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'neutral'>('neutral');
  const [concept, setConcept] = useState<'cute' | 'cool' | 'elegant' | 'powerful'>('cute');
  const [result, setResult] = useState<StageNameResult | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      alert('Please enter both first and last name!');
      return;
    }

    const generatedResult = generateKpopStageName({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      concept
    });

    setResult(generatedResult);
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setGender('neutral');
    setConcept('cute');
    setResult(null);
  };

  const shareText = result 
    ? `My K-Pop stage name is ${result.stageName} (${result.stageNameKo})! 🎤✨ Get yours at koreaexperience.com/tools/kpop-stage-name`
    : '';

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/tools"
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 mb-6 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tools
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-8 py-12 text-center">
            <div className="text-5xl mb-4">🎤</div>
            <h1 className="text-4xl font-bold mb-3">K-Pop Stage Name Generator</h1>
            <p className="text-amber-100 text-lg max-w-2xl mx-auto">
              Discover your perfect K-pop idol stage name! Choose your concept and get a name that matches your star potential ✨
            </p>
          </div>

          <div className="p-8">
            {!result ? (
              /* Input Form */
              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Name Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g., John"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g., Smith"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Gender Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['male', 'female', 'neutral'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          gender === g
                            ? 'bg-amber-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {g === 'male' ? '👨 Male' : g === 'female' ? '👩 Female' : '⚧️ Neutral'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Concept Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Concept Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['cute', 'cool', 'elegant', 'powerful'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setConcept(c)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          concept === c
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {c === 'cute' && '🌸 Cute'}
                        {c === 'cool' && '😎 Cool'}
                        {c === 'elegant' && '💎 Elegant'}
                        {c === 'powerful' && '🔥 Powerful'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  ✨ Generate My Stage Name
                </button>
              </form>
            ) : (
              /* Results */
              <div className="space-y-6">
                {/* Stage Name */}
                <div className="text-center bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-8">
                  <div className="text-sm text-amber-700 font-semibold mb-2">YOUR K-POP STAGE NAME</div>
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-3">
                    {result.stageName}
                  </div>
                  <div className="text-3xl text-gray-700 font-medium">
                    {result.stageNameKo}
                  </div>
                </div>

                {/* Concept Badge */}
                <div className="flex justify-center">
                  <span className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full font-semibold">
                    {result.concept === 'Cute' && '🌸 Cute Concept'}
                    {result.concept === 'Cool' && '😎 Cool Concept'}
                    {result.concept === 'Elegant' && '💎 Elegant Concept'}
                    {result.concept === 'Powerful' && '🔥 Powerful Concept'}
                  </span>
                </div>

                {/* Meaning */}
                <div className="bg-amber-50 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💫</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Name Meaning</h3>
                      <p className="text-gray-700 leading-relaxed">{result.meaning}</p>
                    </div>
                  </div>
                </div>

                {/* Idol Similarity */}
                <div className="bg-orange-50 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">⭐</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Similar K-Pop Idol</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-semibold text-amber-700">{result.similarity.idol}</span>
                        <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {result.similarity.percentage}% Match
                        </span>
                      </div>
                      <p className="text-gray-700">{result.similarity.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Group Suggestion */}
                <div className="bg-amber-50 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">👥</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Suggested Group Name</h3>
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-1">
                        {result.groupSuggestion.groupName}
                      </div>
                      <div className="text-lg text-gray-700 font-medium mb-2">
                        {result.groupSuggestion.groupNameKo}
                      </div>
                      <p className="text-gray-600 text-sm">{result.groupSuggestion.concept}</p>
                    </div>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 text-center">Share Your Result!</h3>
                    
                    {/* SNS Buttons Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
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
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://koreaexperience.com/tools/kpop-stage-name')}&quote=${encodeURIComponent(shareText)}`}
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
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-orange-600 to-orange-500 text-white px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Instagram
                      </button>

                      <a
                        href={`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`}
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
                          navigator.clipboard.writeText('https://koreaexperience.com/tools/kpop-stage-name');
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
                </div>

                {/* Try Again Button */}
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  🔄 Try Again
                </button>

                {/* Other Tools CTA */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 text-center border-2 border-amber-200 mt-6">
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
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About K-Pop Stage Names</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Stage names</strong> are an essential part of K-pop culture! They&apos;re designed to be:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Memorable:</strong> Easy to remember and pronounce globally</li>
              <li><strong>Unique:</strong> Stand out from other idols and celebrities</li>
              <li><strong>Meaningful:</strong> Reflect the idol&apos;s personality or concept</li>
              <li><strong>Marketable:</strong> Work well for international promotion</li>
            </ul>
            <p className="mt-4">
              Famous examples include <strong>V</strong> (BTS), <strong>G-Dragon</strong> (BIGBANG), 
              <strong> CL</strong> (2NE1), and <strong>Kai</strong> (EXO). Many idols choose stage names 
              that differ from their real names to create a distinct artistic identity!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
