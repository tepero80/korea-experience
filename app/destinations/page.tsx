import Link from 'next/link';
import { getDestinations } from '@/lib/destinations';
import { mediaFor } from '@/lib/media';
export const metadata = {
  title: 'Korea Travel Destinations by Region',
  description:
    'Choose a destination in Korea, then connect your arrival, base and sightseeing with reviewed local travel guides.',
  alternates: { canonical: 'https://koreaexperience.com/destinations' },
};
export default function Destinations() {
  const destinations = getDestinations();
  const areas = [...new Set(destinations.map((region) => region.area))];
  return (
    <div className="wrap library-page">
      <div className="page-intro">
        <h1 className="section-title">Where to go in Korea</h1>
        <p>Choose an area, then plan your arrival, where to stay and what fits in a day.</p>
      </div>
      {areas.map((area) => (
        <section className="destination-area" key={area}>
          <h2 className="section-title">{area}</h2>
          <div className="guide-grid">
            {destinations.filter((region) => region.area === area).map((region) => {
              const photo = mediaFor(region.coverMediaId);
              return (
                <Link href={`/destinations/${region.id}`} className="guide-card" key={region.id}>
                  {photo ? (
                    <div className="guide-card-image">
                      <img
                        src={photo.src}
                        srcSet={photo.srcSet}
                        sizes="(max-width: 700px) calc(100vw - 40px), 420px"
                        alt=""
                        width={photo.width}
                        height={photo.height}
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <div className="guide-card-copy">
                    <span className="eyebrow" lang="ko">{region.nameKo}</span>
                    <h3>{region.name}</h3>
                    <p>{region.intro}</p>
                    <span className="text-link">Explore the collection ↗</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
