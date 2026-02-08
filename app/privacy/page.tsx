import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Korea Experience. Learn how we collect, use, and protect your personal data.',
  alternates: { canonical: 'https://koreaexperience.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      
      <p className="text-gray-600 mb-8">
        <strong>Last Updated:</strong> February 1, 2026
      </p>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>
            When you visit Korea Experience, we may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Personal Information:</strong> Name, email address when you contact us or subscribe to our newsletter</li>
            <li><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent on pages</li>
            <li><strong>Cookies:</strong> We use cookies to enhance your browsing experience and analyze site traffic</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>We use collected information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>To provide and maintain our website</li>
            <li>To respond to your inquiries and contact requests</li>
            <li>To send newsletters (only if you subscribe)</li>
            <li>To analyze website usage and improve our content</li>
            <li>To detect and prevent fraud or abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website. 
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
          <p className="mt-4">
            <strong>Types of cookies we use:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Essential cookies for website functionality</li>
            <li>Analytics cookies (Google Analytics) to understand user behavior</li>
            <li>Advertising cookies (Google AdSense) to display relevant ads</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
          <p>We use the following third-party services that may collect information:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Google Analytics:</strong> For website analytics</li>
            <li><strong>Google AdSense:</strong> For displaying advertisements</li>
            <li><strong>Cloudflare:</strong> For hosting and security</li>
          </ul>
          <p className="mt-4">
            These services have their own privacy policies and we have no control over their data practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Affiliate Links & Monetization Disclosure</h2>
          <p>
            <strong>Important Disclosure:</strong> Korea Experience participates in various affiliate marketing 
            programs and monetization methods to support the free content we provide. This means we earn 
            commissions when you click on certain links and make purchases, at no additional cost to you.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Affiliate Programs We Participate In</h3>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Klook Affiliate Program:</strong> We earn commissions when you book tours, activities, 
              or experiences through our Klook affiliate links (Affiliate ID: 110604). Our tour cards and 
              travel recommendations may include Klook affiliate links.
            </li>
            <li>
              <strong>Booking.com Affiliate Program:</strong> We may earn commissions when you book 
              accommodations through our Booking.com affiliate links (pending approval).
            </li>
            <li>
              <strong>Future Partners:</strong> We may add other reputable travel and e-commerce affiliate 
              programs (such as Agoda, Viator, Amazon Associates) as our content expands.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Google AdSense</h3>
          <p>
            We display advertisements through Google AdSense (Publisher ID: ca-pub-7793293419727384). 
            These ads are personalized based on your browsing behavior across websites. Google may use 
            cookies and other tracking technologies to serve relevant ads. You can opt out of personalized 
            advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a>.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Our Editorial Independence</h3>
          <p>
            While we earn commissions from affiliate links and ad revenue, our editorial content remains 
            independent and unbiased. We only recommend products, services, tours, and accommodations that:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>We genuinely believe will provide value to our readers</li>
            <li>Are relevant to experiencing Korea as a traveler or expat</li>
            <li>Meet our quality standards based on reviews and research</li>
            <li>Align with our mission to help foreigners navigate Korean culture and travel</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.4 Transparency & FTC Compliance</h3>
          <p>
            In compliance with the Federal Trade Commission (FTC) guidelines and Korean advertising laws, 
            we clearly disclose affiliate relationships:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Affiliate links are marked with visible disclaimers (e.g., "This is an affiliate link")</li>
            <li>Tour cards and hotel recommendations include affiliate disclosure text</li>
            <li>Blog posts containing affiliate content include disclosure notices</li>
            <li>Prices shown are accurate at the time of publication but may change</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.5 No Additional Cost to You</h3>
          <p>
            <strong>Important:</strong> Using our affiliate links does NOT increase the price you pay. 
            In many cases, we may even have access to exclusive deals or promo codes that save you money. 
            The commission we earn comes from the merchant, not from you.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.6 Data Collection by Affiliate Partners</h3>
          <p>
            When you click on affiliate links, our partner websites (Klook, Booking.com, etc.) may collect 
            information about your visit and purchase. This data collection is governed by their respective 
            privacy policies, which we encourage you to review.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, 
            no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Your Rights (GDPR)</h2>
          <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Right to access your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten")</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
          <p>
            Our website is not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by 
            posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:{' '}
            <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a> or email{' '}
            <a href="mailto:privacy@koreaexperience.com" className="text-blue-600 hover:underline">
              privacy@koreaexperience.com
            </a>
          </p>
        </section>
      </div>
      </div>
    </div>
  );
}
