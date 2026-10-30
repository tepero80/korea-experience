import Link from 'next/link';
import { REGIONS } from '@/lib/regions';
export const metadata = {
  title: 'Find your place in Korea',
  description:
    'Start with Seoul, Busan or Suwon and connect a realistic base, route, food stops and transport.',
  alternates: { canonical: 'https://koreaexperience.com/destinations' },
};
export default function Destinations() {
  return (
    <div className="wrap library-page">
      <div className="page-intro">
        <p className="eyebrow">Find your place</p>
        <h1 className="section-title">
          Explore a little deeper.
          <br />
          <em>Travel a little easier.</em>
        </h1>
        <p>
          Start with the area, then build days that make sense on the map. These focused collections
          are growing as we verify more useful local information.
        </p>
      </div>
      <div className="guide-grid">
        {REGIONS.map((r) => (
          <Link href={`/destinations/${r.id}`} className="guide-card" key={r.id}>
            <div className="guide-card-image">
              <img src={r.image} alt="" width="960" height="640" />
            </div>
            <div className="guide-card-copy">
              <span className="eyebrow" lang="ko">
                {r.nameKo}
              </span>
              <h2>{r.name}</h2>
              <p>{r.intro}</p>
              <span className="text-link">Explore the collection ↗</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
