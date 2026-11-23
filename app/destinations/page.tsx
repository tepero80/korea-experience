import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { getDestinations } from '@/lib/destinations';
import { mediaFor } from '@/lib/media';

const title = 'Korea Travel Destinations by Region';
const description =
  'Compare Korean cities and regions, then connect your arrival, where to stay and what to see with practical local guides.';
const url = `${SITE_CONFIG.url}/destinations`;
const shareImage = {
  url: '/images/cards/korea-travel-destinations.jpg',
  width: 1200,
  height: 630,
  alt: 'Korea Travel Destinations, with traditional rooftops in Jeonju Hanok Village',
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, type: 'website', siteName: SITE_CONFIG.name, images: [shareImage] },
  twitter: { card: 'summary_large_image', title, description, images: [shareImage] },
};
export default function Destinations() {
  const destinations = getDestinations();
  const areas = [...new Set(destinations.map((region) => region.area))].map((name) => ({
    name,
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    destinations: destinations.filter((region) => region.area === name),
  }));
  return (
    <div className="wrap library-page">
      <div className="page-intro">
        <h1 className="section-title">Where to go in Korea</h1>
        <p>Choose an area, then plan your arrival, where to stay and what fits in a day.</p>
      </div>
      <nav className="destination-area-jump" aria-label="Jump to an area">
        {areas.map(({ id, name }) => (
          <a key={id} href={`#${id}`}>{name}</a>
        ))}
      </nav>
      {areas.map(({ id, name, destinations }) => (
        <section className="destination-area" key={id} aria-labelledby={id}>
          <h2 className="section-title" id={id} tabIndex={-1}>{name}</h2>
          <div className="guide-grid">
            {destinations.map((region) => {
              const photo = mediaFor(region.coverMediaId);
              return (
                <a href={`/destinations/${region.id}`} className="guide-card" key={region.id}>
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
                </a>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
