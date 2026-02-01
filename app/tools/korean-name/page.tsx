import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Korean Name Generator - Get Your Personalized Korean Name | Korea Experience',
  description: 'Generate your unique Korean name with meaning, pronunciation, and Hanja characters. Perfect for K-pop fans, Korean learners, and anyone interested in Korean culture.',
  keywords: ['korean name generator', 'korean name meaning', 'hanja name', 'korean culture', 'kpop name'],
  openGraph: {
    title: 'Korean Name Generator - Get Your Personalized Korean Name',
    description: 'Generate your unique Korean name with meaning, pronunciation, and Hanja characters.',
    type: 'website',
    url: 'https://koreaexperience.com/tools/korean-name',
  },
};

export default function KoreanNameGeneratorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Korean Name Generator
          </h1>
          <p className="text-xl text-gray-600">
            Discover your perfect Korean name with meaning and pronunciation
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <form className="space-y-6">
            {/* English Name Input */}
            <div>
              <label htmlFor="englishName" className="block text-lg font-semibold mb-2 text-gray-800">
                Your Name (English)
              </label>
              <input
                type="text"
                id="englishName"
                name="englishName"
                placeholder="e.g., Sarah, Michael"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-lg"
                required
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-lg font-semibold mb-3 text-gray-800">
                Gender
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    defaultChecked
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Female</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Male</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="unisex"
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Unisex</span>
                </label>
              </div>
            </div>

            {/* Meaning Preference */}
            <div>
              <label htmlFor="meaning" className="block text-lg font-semibold mb-2 text-gray-800">
                Preferred Meaning (Optional)
              </label>
              <select
                id="meaning"
                name="meaning"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-lg"
              >
                <option value="">Any meaning</option>
                <option value="beauty">Beauty & Grace</option>
                <option value="wisdom">Wisdom & Intelligence</option>
                <option value="strength">Strength & Courage</option>
                <option value="nature">Nature & Harmony</option>
                <option value="prosperity">Prosperity & Success</option>
                <option value="joy">Joy & Happiness</option>
                <option value="star">Star & Light</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg text-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition shadow-lg"
            >
              ✨ Generate My Korean Name
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-3 text-gray-800">How It Works</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>AI-powered name generation based on Korean naming traditions</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Authentic Hanja (Chinese characters) with beautiful meanings</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Proper Korean pronunciation guide (Romanization)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Cultural context and naming significance</span>
            </li>
          </ul>
        </div>

        {/* Ad Space Placeholder */}
        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
          <p className="text-sm">Advertisement</p>
          <div className="h-32 flex items-center justify-center">
            {/* Google AdSense will go here */}
          </div>
        </div>
      </div>
    </main>
  );
}
