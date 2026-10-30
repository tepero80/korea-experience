import Link from 'next/link';
export const metadata = {
  title: 'About Korea Experience',
  description:
    'Practical Korea travel information organized around your real decisions, routes and interests.',
  alternates: { canonical: 'https://koreaexperience.com/about' },
};
export default function About() {
  return (
    <div className="wrap document-page">
      <p className="eyebrow">A considered guide to Korea</p>
      <h1 className="section-title">
        A little preparation.
        <br />
        <em>More room to explore.</em>
      </h1>
      <p>
        Korea Experience is an independent, English-first travel publication and toolkit for people
        preparing for or taking a trip to Korea.
      </p>
      <p>
        We organize information around the decisions you face: where to stay, how to arrive, what
        can fit into a day, how to order and what to do when something changes. A useful guide
        should make the next step clearer.
      </p>
      <h2>What you will find</h2>
      <p>
        Practical guides, source-backed comparisons, realistic route suggestions, addresses and
        maps, and tools that show their assumptions. Related guides follow your journey and
        interests rather than simply repeating the same keywords.
      </p>
      <h2>What our checks mean</h2>
      <p>
        We review important information against official sources and show the check date. This is
        not a claim of firsthand experience at every place. Fares, access and reservations can
        change after publication, so the current operator notice matters.
      </p>
      <h2>A site that gets better with questions</h2>
      <p>
        Useful travel questions, corrections and real trip reports help us find gaps. We would
        rather improve or retire a weak guide than keep a large collection for its own sake.
      </p>
      <div className="button-row">
        <Link href="/editorial-policy" className="button button-dark">
          Our editorial standards ↗
        </Link>
        <Link href="/contact" className="text-link">
          Contact us ↗
        </Link>
      </div>
    </div>
  );
}
