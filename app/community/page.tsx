import Link from 'next/link';
export const metadata = {
  title: 'Travel questions & updates',
  description:
    'A space for practical Korea travel questions, trip reports and useful local updates.',
  robots: { index: false, follow: true },
};
export default function CommunityFallback() {
  return (
    <div className="wrap document-page">
      <p className="eyebrow">Travel questions & updates</p>
      <h1 className="section-title">
        Better answers
        <br />
        <em>start with a question.</em>
      </h1>
      <p>
        Our member community is being connected and tested. Posting, comments and reactions will
        open after sign-in, moderation and privacy checks are complete.
      </p>
      <div className="category-grid">
        {[
          {
            title: 'Travel questions',
            text: 'Ask about a practical decision, with the area and travel conditions that matter.',
          },
          {
            title: 'Trip reports',
            text: 'Share what actually happened on your visit, with dates and useful details.',
          },
          {
            title: 'Local updates',
            text: 'Help keep routes, booking information and everyday advice current.',
          },
        ].map((x) => (
          <div className="plain-card" key={x.title}>
            <h2>{x.title}</h2>
            <p>{x.text}</p>
          </div>
        ))}
      </div>
      <aside className="answer-box">
        <h2>Need to report something now?</h2>
        <p>
          Send an editorial question or correction while community posting is unavailable. Please do
          not include passport, payment or medical records.
        </p>
        <Link href="/contact" className="button button-dark">
          Contact the editorial desk ↗
        </Link>
      </aside>
      <Link href="/blog" className="text-link">
        Find a practical guide ↗
      </Link>
    </div>
  );
}
