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
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      
      <p className="text-xl text-gray-600 mb-8">
        Have questions, suggestions, or partnership inquiries? We'd love to hear from you.
      </p>

      <div className="bg-white shadow-md rounded-lg p-8">
        <form action="https://formspree.io/f/xjgoyban" method="POST" className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="How can we help?"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Tell us more about your inquiry..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-amber-700 transition-colors"
          >
            Send Message
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h2>
          <div className="space-y-2 text-gray-600">
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:contact@koreaexperience.com" className="text-amber-700 hover:underline">
                contact@koreaexperience.com
              </a>
            </p>
            <p><strong>Response Time:</strong> Usually within 24-48 hours</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-amber-50 border-l-4 border-amber-400 p-6">
        <h3 className="text-lg font-semibold mb-2">Business Inquiries</h3>
        <p className="text-sm text-gray-700">
          For partnership opportunities, advertising, or business proposals, please include 
          "Business Inquiry" in your subject line for faster processing.
        </p>
      </div>
      </div>
    </div>
  );
}
