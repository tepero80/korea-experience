import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Korea Experience',
  description: 'Terms of Service for using Korea Experience website.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      
      <p className="text-gray-600 mb-8">
        <strong>Last Updated:</strong> February 1, 2026
      </p>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Korea Experience ("the Website"), you accept and agree to be bound by 
            these Terms of Service. If you do not agree to these terms, please do not use the Website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Use of Website</h2>
          <p>You agree to use the Website only for lawful purposes and in a way that does not:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Infringe on the rights of others</li>
            <li>Restrict or inhibit anyone else's use of the Website</li>
            <li>Engage in any fraudulent activity</li>
            <li>Attempt to harm or exploit minors</li>
            <li>Transmit any harmful code or malware</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
          <p>
            All content on Korea Experience, including text, graphics, logos, images, and software, 
            is the property of Korea Experience or its content suppliers and is protected by copyright 
            and other intellectual property laws.
          </p>
          <p className="mt-4">
            You may view and print pages from the Website for personal use, but you may not reproduce, 
            republish, or redistribute content without our express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. User-Generated Content</h2>
          <p>
            If you submit comments, feedback, or other content to the Website, you grant us a 
            non-exclusive, worldwide, royalty-free license to use, reproduce, and publish such content.
          </p>
          <p className="mt-4">
            You represent that any content you submit does not violate any third-party rights and 
            does not contain any unlawful or harmful material.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Disclaimer of Warranties</h2>
          <p>
            The Website and all content are provided "as is" without warranties of any kind, either 
            express or implied. We do not warrant that:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>The Website will be available or uninterrupted</li>
            <li>The content is accurate, complete, or current</li>
            <li>Defects will be corrected</li>
            <li>The Website is free of viruses or harmful components</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p>
            Korea Experience and its owners, employees, and affiliates shall not be liable for any 
            direct, indirect, incidental, consequential, or punitive damages arising from your use 
            of the Website or reliance on its content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Affiliate Links and Advertising</h2>
          <p>
            The Website contains affiliate links and advertisements. We may earn commission from 
            purchases made through these links at no additional cost to you. We are not responsible 
            for the content, products, or services of third-party websites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. External Links</h2>
          <p>
            The Website may contain links to external websites. These links are provided for your 
            convenience only, and we do not endorse or take responsibility for the content of 
            linked websites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Korea Experience from any claims, damages, 
            losses, or expenses arising from your use of the Website or violation of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be 
            effective immediately upon posting. Your continued use of the Website after changes 
            constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the 
            Republic of Korea, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at:{' '}
            <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a>
          </p>
        </section>
      </div>
    </div>
  );
}
