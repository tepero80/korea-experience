import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Korea Experience, your trusted guide for medical tourism, travel, and Korean culture.',
  alternates: { canonical: 'https://koreaexperience.com/about' },
  openGraph: {
    title: 'About Us | Korea Experience',
    description: 'Learn about Korea Experience, your trusted guide for medical tourism, travel, and Korean culture.',
    url: 'https://koreaexperience.com/about',
  },
};

const coverageAreas = [
  {
    icon: '🏥',
    title: 'Medical Tourism',
    description: 'In-depth clinic reviews, procedure guides, cost comparisons, and patient tips for plastic surgery, dermatology, and dental care in Korea.',
  },
  {
    icon: '✈️',
    title: 'Travel & Tourism',
    description: 'Insider travel itineraries, transportation hacks, accommodation guides, and seasonal trip planning for Seoul and beyond.',
  },
  {
    icon: '🎬',
    title: 'K-Culture',
    description: 'K-pop concert guides, K-drama filming locations, Hallyu hotspots, and cultural experiences you can\'t find in guidebooks.',
  },
  {
    icon: '🍜',
    title: 'Food & Dining',
    description: 'Best restaurant picks, street food guides, Korean BBQ etiquette, and hidden gem eateries across the country.',
  },
  {
    icon: '💄',
    title: 'Shopping & K-Beauty',
    description: 'K-beauty product guides, shopping districts, duty-free tips, and skincare routine recommendations.',
  },
  {
    icon: '🏠',
    title: 'Living in Korea',
    description: 'Visa guides, housing tips, banking, healthcare, and everything you need to know about daily life as an expat.',
  },
];

const stats = [
  { value: '650+', label: 'Expert Guides' },
  { value: '22', label: 'Interactive Tools' },
  { value: '10K+', label: 'Monthly Visitors' },
  { value: '6', label: 'Content Categories' },
];

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">

      {/* Hero Section */}
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">👋</span>
            <span className="text-sm font-semibold text-amber-700">About Us</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 mb-3">
            Your Insider Guide to Korea
          </h1>
          <p className="text-lg md:text-xl text-stone-500 max-w-2xl">
            We help international visitors experience the best of Korea — from world-class medical care to vibrant culture, food, and travel.
          </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-y border-stone-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-600">{stat.value}</div>
                <div className="text-sm text-stone-500 mt-1">{stat.label}</div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">Our Mission</h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-4">
              Korea Experience was built for travelers, patients, and culture enthusiasts who want reliable, first-hand information about Korea — not recycled tourist content.
            </p>
            <p className="text-lg text-stone-600 leading-relaxed">
              Every guide is research-backed and regularly updated. Whether you're planning a medical procedure in Gangnam, a two-week trip through the countryside, or just trying to figure out your Korean age, we've got you covered with accurate, actionable content.
            </p>
          </div>
        </div>
      </section>

      {/* What We Cover */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8 text-center">What We Cover</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coverageAreas.map((area) => (
              <div
                key={area.title}
                className="bg-white rounded-xl p-6 border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">{area.icon}</div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{area.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{area.description}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">Why Trust Us</h2>
            <div className="space-y-4">
              {[
                { icon: '🔬', text: 'Research-backed deep dive guides with real data, local insights, and expert-verified information.' },
                { icon: '🔄', text: 'Content is regularly audited and updated — outdated info gets flagged and refreshed.' },
                { icon: '🌏', text: 'Written by Korea-based writers and researchers who understand both local and international perspectives.' },
                { icon: '🛠️', text: '22 interactive tools — quizzes, calculators, and generators — to make exploring Korea fun and practical.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-stone-50">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <p className="text-stone-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">⚠️ Important Note</h3>
              <p className="text-sm text-amber-700 leading-relaxed">
                Korea Experience provides informational content only. We are not medical professionals. 
                All medical content is for educational purposes and should not replace professional medical advice. 
                Always consult qualified healthcare providers for medical decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Have Questions?</h2>
            <p className="text-amber-100 mb-6 max-w-xl mx-auto">
              Whether it's about our content, partnerships, or anything Korea-related — we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-amber-700 font-semibold px-6 py-3 rounded-full hover:bg-amber-50 transition-colors"
              >
                Contact Us →
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                Read Our Blog
              </Link>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
}
