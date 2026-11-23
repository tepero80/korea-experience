import Link from 'next/link';
import { guideCollectionMetadata } from '@/lib/seo';
import { TRAVEL_CATEGORIES } from '@/lib/taxonomy';
export const metadata = guideCollectionMetadata(
  'Korea travel guides by category',
  'Choose from eight travel collections covering plans, airports, accommodation, places, food, shopping, culture, and travel essentials.',
  '/blog/category',
);
export default function Categories() {
  return (
    <div className="wrap library-page">
      <div className="page-intro">
        <p className="eyebrow">Choose your question</p>
        <h1 className="section-title">
          Guides for every
          <br />
          <em>part of your trip.</em>
        </h1>
        <p>Preparation, arrival, exploring and the details in between.</p>
      </div>
      <div className="category-grid">
        {TRAVEL_CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/blog/category/${c.slug}`}>
            <span className="category-number">{c.icon}</span>
            <h2>{c.name}</h2>
            <p>{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
