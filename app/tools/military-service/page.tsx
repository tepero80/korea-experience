'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { 
  calculateMilitaryService, 
  HEALTH_CONDITIONS, 
  SERVICE_TYPES,
  type MilitaryServiceResult 
} from '@/lib/korean-military-service';

export default function KoreanMilitaryServicePage() {
  const [age, setAge] = useState<string>('');
  const [healthGrade, setHealthGrade] = useState<number>(1);
  const [preferredBranch, setPreferredBranch] = useState<keyof typeof SERVICE_TYPES>('army');
  const [result, setResult] = useState<MilitaryServiceResult | null>(null);

  const handleCalculate = () => {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 100) {
      alert('Please enter a valid age between 1 and 100');
      return;
    }

    const serviceResult = calculateMilitaryService(ageNum, healthGrade, preferredBranch);
    setResult(serviceResult);
  };

  const handleReset = () => {
    setAge('');
    setHealthGrade(1);
    setPreferredBranch('army');
    setResult(null);
  };

  const handleShare = (platform: string) => {
    const url = 'https://www.koreaexperience.com/tools/military-service';
    const text = result 
      ? `I checked my Korean military service requirements! Service Type: ${result.serviceType}, Duration: ${result.duration}. Check yours at Korea Experience! 🇰🇷`
      : 'Calculate your Korean military service requirements at Korea Experience! 🇰🇷';

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
    navigator.clipboard.writeText('https://www.koreaexperience.com/tools/military-service');
    alert('Link copied to clipboard!');
  };

  const handleDownload = () => {
    if (!result) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gradient background (military green theme)
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#2D5016');
    gradient.addColorStop(0.5, '#4A7C59');
    gradient.addColorStop(1, '#6B8E23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🪖 Korean Military Service', 400, 60);

    // White box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(50, 100, 700, 380, 20);
    ctx.fill();

    // Result details
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(result.serviceType, 400, 160);

    ctx.font = '24px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(`Duration: ${result.duration}`, 400, 200);
    ctx.fillText(`Health Grade: ${result.healthGrade}`, 400, 235);
    ctx.fillText(`Age Status: ${result.ageStatus}`, 400, 270);

    // Timeline
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#2D5016';
    ctx.fillText('📅 Timeline', 400, 320);
    ctx.font = '18px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(`Enlistment Age: ${result.timeline.enlistmentAge}`, 400, 350);
    ctx.fillText(`Completion Age: ${result.timeline.completionAge}`, 400, 380);

    // Tips preview
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#2D5016';
    ctx.fillText('💡 Top Tips', 400, 430);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#666666';
    if (result.tips.length > 0) {
      ctx.fillText(result.tips[0].substring(0, 60), 400, 460);
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
        a.download = 'korean-military-service.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <ToolLayout
      title="Korean Military Service Calculator"
      description="Calculate your Korean military service requirements based on age, health, and preferences. All Korean men aged 18-35 must complete mandatory military service."
      emoji="🪖"
    >
      <div className="max-w-4xl mx-auto">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="space-y-6">
            {/* Age Input */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Your Age
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Health Grade Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Health Condition
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {HEALTH_CONDITIONS.map((condition) => (
                  <button
                    key={condition.id}
                    onClick={() => setHealthGrade(condition.grade)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      healthGrade === condition.grade
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-800">{condition.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{condition.description}</div>
                    <div className="text-xs text-gray-500 mt-1">Grade {condition.grade}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Branch Selection */}
            {healthGrade <= 3 && (
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Preferred Military Branch
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(SERVICE_TYPES)
                    .filter(([key]) => !['alternative', 'exempted'].includes(key))
                    .map(([key, branch]) => (
                      <button
                        key={key}
                        onClick={() => setPreferredBranch(key as keyof typeof SERVICE_TYPES)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          preferredBranch === key
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-800">{branch.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{branch.duration}</div>
                        <div className="text-xs text-gray-500 mt-1">{branch.description}</div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white text-xl font-bold py-4 px-8 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
            >
              Calculate Service Requirements 🪖
            </button>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              Your Military Service Requirements
            </h2>

            {/* Main Result */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-800 mb-2">
                  {result.serviceType}
                </div>
                <div className="text-2xl text-gray-700 mb-1">
                  Duration: <span className="font-semibold">{result.duration}</span>
                </div>
                <div className="text-lg text-gray-600">
                  Health Grade: {result.healthGrade}
                </div>
              </div>
            </div>

            {/* Age Status */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-6">
              <div className="font-semibold text-blue-900 mb-1">Age Status</div>
              <div className="text-blue-800">{result.ageStatus}</div>
            </div>

            {/* Exemption Info */}
            {result.exemptionInfo && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 mb-6">
                <div className="font-semibold text-yellow-900 mb-1">⚠️ Exemption Notice</div>
                <div className="text-yellow-800">{result.exemptionInfo}</div>
              </div>
            )}

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">📅 Enlistment Age</div>
                <div className="text-2xl font-bold text-gray-800">{result.timeline.enlistmentAge}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">🎓 Completion Age</div>
                <div className="text-2xl font-bold text-gray-800">{result.timeline.completionAge}</div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Important Tips</h3>
              <ul className="space-y-3">
                {result.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Try Again Button */}
            <button
              onClick={handleReset}
              className="w-full mt-6 bg-gray-100 text-gray-700 text-lg font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all"
            >
              Calculate Again
            </button>
          </div>
        )}

        {/* Share Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Share This Tool
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
            {result && (
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
              >
                💾 Download Result
              </button>
            )}
          </div>
        </div>

        {/* Information Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">
            📋 About Korean Military Service
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>
              • All Korean men aged 18-35 must complete mandatory military service
            </p>
            <p>
              • Service duration varies by branch: Army (18 months), Navy (20 months), Air Force (21 months)
            </p>
            <p>
              • Health examinations determine eligibility and service type
            </p>
            <p>
              • Postponement is possible for students and certain professions
            </p>
            <p>
              • Failure to serve results in legal penalties including travel restrictions
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
