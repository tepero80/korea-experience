import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Korea Experience for questions, suggestions, or partnerships.',
  alternates: { canonical: 'https://koreaexperience.com/contact' },
  openGraph: {
    title: 'Contact Us | Korea Experience',
    description: 'Get in touch with Korea Experience for questions, suggestions, or partnerships.',
    url: 'https://koreaexperience.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
              <span className="text-2xl">✉️</span>
              <span className="text-sm font-semibold text-amber-700">Get in Touch</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 mb-3">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-stone-500 max-w-2xl">
              Have questions, suggestions, or partnership inquiries? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-stone-200 p-8">
                <form action="https://formspree.io/f/xjgoyban" method="POST" className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all"
                  >
                    Send Message →
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <div className="text-2xl mb-3">📧</div>
                <h3 className="font-semibold text-stone-900 mb-2">Email Us</h3>
                <a href="mailto:contact@koreaexperience.com" className="text-amber-700 hover:underline text-sm">
                  contact@koreaexperience.com
                </a>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-6">
                <div className="text-2xl mb-3">⏱️</div>
                <h3 className="font-semibold text-stone-900 mb-2">Response Time</h3>
                <p className="text-sm text-stone-500">Usually within 24–48 hours</p>
              </div>

              <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                <div className="text-2xl mb-3">💼</div>
                <h3 className="font-semibold text-amber-800 mb-2">Business Inquiries</h3>
                <p className="text-sm text-amber-700">
                  For partnerships, advertising, or business proposals, include "Business Inquiry" in your subject line for faster processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
