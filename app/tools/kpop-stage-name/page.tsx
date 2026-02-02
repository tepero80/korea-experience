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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/tools"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-6 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tools
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white px-8 py-12 text-center">
            <div className="text-5xl mb-4">🎤</div>
            <h1 className="text-4xl font-bold mb-3">K-Pop Stage Name Generator</h1>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
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
                            ? 'bg-purple-600 text-white shadow-lg'
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
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
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
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  ✨ Generate My Stage Name
                </button>
              </form>
            ) : (
              /* Results */
              <div className="space-y-6">
                {/* Stage Name */}
                <div className="text-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-8">
                  <div className="text-sm text-purple-600 font-semibold mb-2">YOUR K-POP STAGE NAME</div>
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
                    {result.stageName}
                  </div>
                  <div className="text-3xl text-gray-700 font-medium">
                    {result.stageNameKo}
                  </div>
                </div>

                {/* Concept Badge */}
                <div className="flex justify-center">
                  <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold">
                    {result.concept === 'Cute' && '🌸 Cute Concept'}
                    {result.concept === 'Cool' && '😎 Cool Concept'}
                    {result.concept === 'Elegant' && '💎 Elegant Concept'}
                    {result.concept === 'Powerful' && '🔥 Powerful Concept'}
                  </span>
                </div>

                {/* Meaning */}
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💫</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Name Meaning</h3>
                      <p className="text-gray-700 leading-relaxed">{result.meaning}</p>
                    </div>
                  </div>
                </div>

                {/* Idol Similarity */}
                <div className="bg-pink-50 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">⭐</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">Similar K-Pop Idol</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-semibold text-purple-600">{result.similarity.idol}</span>
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {result.similarity.percentage}% Match
                        </span>
                      </div>
                      <p className="text-gray-700">{result.similarity.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Group Suggestion */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">👥</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Suggested Group Name</h3>
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1">
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
                  <h3 className="text-center font-bold text-gray-900 mb-4">Share Your Stage Name!</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Twitter
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://koreaexperience.com/tools/kpop-stage-name')}&quote=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </a>
                    <a
                      href={`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.023-5.086.83-6.47 2.398-1.459 1.656-2.198 4.027-2.198 7.051v.002c.005 3.024.738 5.393 2.183 7.048 1.374 1.574 3.55 2.388 6.465 2.412 2.18.013 3.872-.458 5.025-1.402.916-.748 1.56-1.807 1.91-3.148-.399-.158-.816-.295-1.248-.418-1.223-.348-2.53-.523-3.89-.523-2.633 0-4.928.645-6.617 1.862-1.746 1.259-2.631 2.944-2.631 5.004 0 2.004.823 3.608 2.447 4.768 1.467 1.048 3.41 1.579 5.775 1.579 3.183 0 5.695-.999 7.468-2.969 1.574-1.75 2.37-4.069 2.37-6.898v-.815c.001-.029.001-.058.001-.087V9.973c0-.834.672-1.507 1.503-1.507.831 0 1.504.673 1.504 1.507v4.828c0 .029-.001.058-.001.087v.815c0 3.314-.997 6.083-2.965 8.233-2.167 2.366-5.342 3.564-9.439 3.564z"/>
                      </svg>
                      Threads
                    </a>
                  </div>
                </div>

                {/* Try Again Button */}
                <button
                  onClick={handleReset}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  🎲 Generate Another Name
                </button>
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
