import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medical Disclaimer',
  description: 'Important medical disclaimer for Korea Experience. This site provides general information, not medical advice.',
  alternates: { canonical: 'https://koreaexperience.com/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <div className="pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
        <h1 className="text-4xl font-bold mb-2 text-red-900">Medical Disclaimer</h1>
        <p className="text-red-800 font-semibold">Please Read Carefully Before Using This Website</p>
      </div>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. No Medical Advice</h2>
          <p>
            <strong>Korea Experience is NOT a medical website and does not provide medical advice.</strong>
          </p>
          <p className="mt-4">
            All information on this website regarding medical tourism, plastic surgery, dermatology, 
            and other health-related topics is provided for <strong>informational and educational purposes only</strong>. 
            This information is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Consult Qualified Professionals</h2>
          <p>
            <strong>Always seek the advice of qualified healthcare professionals</strong> regarding any 
            medical condition, treatment, or procedure. Never disregard professional medical advice or 
            delay seeking it because of information you read on Korea Experience.
          </p>
          <p className="mt-4">
            Before undergoing any medical procedure, including cosmetic surgery:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Consult with multiple licensed and board-certified medical professionals</li>
            <li>Verify the credentials and licensing of any clinic or doctor</li>
            <li>Understand all risks, benefits, and alternatives</li>
            <li>Get second opinions when appropriate</li>
            <li>Ensure informed consent before any procedure</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. No Doctor-Patient Relationship</h2>
          <p>
            Using this website and reading its content does not create a doctor-patient relationship 
            between you and Korea Experience, its owners, authors, or any medical professionals mentioned.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Accuracy of Information</h2>
          <p>
            While we strive to provide accurate and up-to-date information, we make no representations 
            or warranties regarding the completeness, accuracy, or reliability of any information on this website.
          </p>
          <p className="mt-4">
            Medical information, pricing, clinic details, and regulations may change without notice. 
            Always verify current information directly with medical facilities and relevant authorities.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Individual Results May Vary</h2>
          <p>
            Any testimonials, before/after photos, or success stories mentioned on this website represent 
            individual experiences and do not guarantee similar results for you. Individual medical outcomes 
            depend on many factors unique to each person.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Not an Endorsement</h2>
          <p>
            References to specific clinics, hospitals, doctors, or medical procedures do not constitute 
            endorsements or recommendations. We are not affiliated with any medical facilities unless 
            explicitly stated. Any affiliate relationships are disclosed in accordance with FTC guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Medical Tourism Risks</h2>
          <p>
            Medical tourism involves unique risks, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Language and communication barriers</li>
            <li>Different medical standards and regulations</li>
            <li>Limited legal recourse in case of complications</li>
            <li>Difficulty with follow-up care</li>
            <li>Travel-related health risks</li>
            <li>Complications from procedures</li>
          </ul>
          <p className="mt-4">
            Carefully research and consider all risks before traveling abroad for medical treatment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Emergency Medical Situations</h2>
          <p className="font-bold text-red-600">
            If you are experiencing a medical emergency, call emergency services immediately. 
            Do not rely on information from this website for emergency medical situations.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Korea Emergency:</strong> 119 (Ambulance/Fire)</li>
            <li><strong>Korea Emergency Medical Information Center:</strong> 1339</li>
            <li><strong>Police:</strong> 112</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Liability Disclaimer</h2>
          <p>
            Korea Experience, its owners, authors, and contributors are not liable for any damages, 
            injuries, or adverse outcomes resulting from your use of information on this website or 
            decisions made based on this information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Your Responsibility</h2>
          <p>
            By using this website, you acknowledge that:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>You have read and understood this medical disclaimer</li>
            <li>You will not rely solely on information from this website for medical decisions</li>
            <li>You will consult with qualified medical professionals before any medical procedures</li>
            <li>You accept full responsibility for your health decisions</li>
          </ul>
        </section>

        <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
          <h3 className="text-xl font-semibold mb-2">Last Updated</h3>
          <p>This Medical Disclaimer was last updated on February 1, 2026.</p>
          <p className="mt-4">
            If you have questions about this disclaimer, please <a href="/contact" className="text-blue-600 hover:underline">contact us</a>.
          </p>
        </section>
      </div>
      </div>
    </div>
  );
}
