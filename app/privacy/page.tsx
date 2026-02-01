import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Korea Experience',
  description: 'Privacy Policy for Korea Experience website. Learn how we collect, use, and protect your data.',
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
          <h2 className="text-2xl font-semibold mb-4">5. Affiliate Links</h2>
          <p>
            Korea Experience contains affiliate links to third-party websites such as Booking.com, Klook, 
            and Amazon. When you click on these links and make a purchase, we may earn a commission at no 
            additional cost to you. We only recommend products and services we believe will add value to our readers.
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
