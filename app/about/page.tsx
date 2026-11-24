import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import { guideCollectionMetadata } from '@/lib/seo';

const title = `About ${SITE_CONFIG.name}`;
const description =
  'Meet the independent, English-first publication behind Korea Experience travel guides, maps and planning tools.';
export const metadata = {
  ...guideCollectionMetadata(title, description, '/about'),
  title: { absolute: title },
};
export default function About() {
  return (
    <div className="wrap document-page">
      <p className="eyebrow">Independent travel guides & planning tools</p>
      <h1 className="section-title">{title}</h1>
      <p>
        <Link className="inline-content-link" href="/">{SITE_CONFIG.domain}</Link> is the home of Korea Experience,
        an independent, English-first travel publication for people planning or taking a trip to South Korea.
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
