import Link from 'next/link';
export const metadata = {
  title: 'Contact & corrections',
  description:
    'Report a changed travel detail, ask an editorial question or contact Korea Experience.',
  alternates: { canonical: 'https://koreaexperience.com/contact' },
};
export default function Contact() {
  return (
    <div className="wrap document-page">
      <p className="eyebrow">Help make the next answer better</p>
      <h1 className="section-title">
        Questions, corrections
        <br />
        <em>& useful details.</em>
      </h1>
      <p>
        For editorial questions and corrections, email{' '}
        <a href="mailto:contact@koreaexperience.com">contact@koreaexperience.com</a>. We are not a
        booking agency, emergency service or medical provider.
      </p>
      <h2>Report a correction</h2>
      <ol>
        <li>Include the guide URL and the exact information that changed.</li>
        <li>Tell us when you observed it and link to an official notice if available.</li>
        <li>Explain what a traveler should check or do differently.</li>
      </ol>
      <h2>Suggest a useful guide or tool</h2>
      <p>
        Describe the decision you were trying to make, the area or travel period, and what you could
        not find. General travel conditions are enough; do not send passport numbers, payment
        details, private booking records or medical documents.
      </p>
      <aside className="answer-box">
        <h2>Urgent help in Korea</h2>
        <p>
          Call 119 for ambulance or fire emergencies and 112 for police. For non-emergency travel
          interpretation and visitor information, check the official Korea Travel Helpline guidance.
          Do not wait for an editorial reply in an emergency.
        </p>
        <a
          href="https://english.visitkorea.or.kr/svc/contents/infoBscView.do?vcontsId=140042"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official emergency information ↗
        </a>
      </aside>
      <Link href="/editorial-policy" className="text-link">
        How we review corrections ↗
      </Link>
    </div>
  );
}
