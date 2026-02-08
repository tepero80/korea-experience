import { Metadata } from 'next';

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

export default function AboutPage() {
  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">About Korea Experience</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          Your comprehensive guide to experiencing the best of Korea - from world-class medical tourism to vibrant culture and travel.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p>
            Korea Experience was created to help international visitors navigate the rich opportunities Korea offers. 
            Whether you're seeking premium medical care, planning a memorable trip, or exploring investment opportunities, 
            we provide accurate, up-to-date information to make your Korean experience seamless and rewarding.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What We Cover</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Medical Tourism:</strong> Comprehensive guides to Korea's top plastic surgery and dermatology clinics</li>
            <li><strong>Travel Information:</strong> Insider tips on attractions, accommodations, and local experiences</li>
            <li><strong>K-Culture:</strong> Everything from K-pop to K-drama filming locations</li>
            <li><strong>Investment & Immigration:</strong> Real estate, business opportunities, and visa guidance</li>
            <li><strong>Practical Guides:</strong> Transportation, language tips, and cultural insights</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Trust Us</h2>
          <p>
            Our team consists of experienced writers, researchers, and Korea enthusiasts who are committed to 
            providing factual, well-researched content. We regularly update our guides to ensure you have the 
            most current information available.
          </p>
        </section>

        <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
          <h3 className="text-xl font-semibold mb-2">Important Note</h3>
          <p className="text-sm">
            Korea Experience provides informational content only. We are not medical professionals. 
            All medical content is for educational purposes and should not replace professional medical advice. 
            Always consult qualified healthcare providers for medical decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            Have questions or suggestions? We'd love to hear from you. 
            Visit our <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a> to get in touch.
          </p>
        </section>
      </div>
      </div>
    </div>
  );
}
