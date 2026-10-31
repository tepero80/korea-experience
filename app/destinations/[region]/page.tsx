import { notFound } from 'next/navigation';
import Link from 'next/link';
import { REGIONS } from '@/lib/regions';
import { getLaunchGuides } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';
type Params = Promise<{ region: string }>;
export const dynamicParams = false;
export function generateStaticParams() {
  return REGIONS.map((r) => ({ region: r.id }));
}
export async function generateMetadata({ params }: { params: Params }) {
  const id = (await params).region;
  const r = REGIONS.find((r) => r.id === id);
  const count = getLaunchGuides().filter((p) => p.editorial?.regions.includes(id)).length;
  return {
    title: r ? `${r.name} travel planning guides` : 'Destination not found',
    description: r?.intro,
    robots: { index: count >= 3, follow: true },
    alternates: { canonical: `https://koreaexperience.com/destinations/${id}` },
  };
}
export default async function Destination({ params }: { params: Params }) {
  const id = (await params).region;
  const region = REGIONS.find((r) => r.id === id);
  if (!region) notFound();
  const posts = getLaunchGuides().filter((p) => p.editorial?.regions.includes(id));
  const firstDecisions = [
    'seoul-neighborhood-chooser-for-first-time-visitors-where-to-stay-by-trip-style',
    'airport-limousine-bus-vs-arex-express-train',
    'seoul-3-day-itinerary-perfect-first-time-visitor-guide-2026',
    'seongsu-dong-dior-luxury-vs-market-eats-in-24-hours',
    'seoul-rainy-day-itinerary-built-around-museums-markets-and-covered-streets',
    'how-to-order-food-in-korean-restaurants-phrases-guide-2026',
  ];
  const highlights =
    id === 'seoul'
      ? firstDecisions.map((slug) => posts.find((p) => p.slug === slug)!).filter(Boolean)
      : posts;
  const more = posts.filter((p) => !highlights.includes(p));
  return (
    <div className="wrap library-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/destinations">Destinations</Link>
        <span>/</span>
        <span>{region.name}</span>
      </nav>
      <div className="page-intro">
        <p className="eyebrow" lang="ko">
          {region.nameKo}
        </p>
        <h1 className="section-title">
          Your time in <em>{region.name}.</em>
        </h1>
        <p>{region.intro}</p>
      </div>
      <aside className="answer-box">
        <p className="eyebrow">Plan around this</p>
        <p>{region.tip}</p>
      </aside>
      {more.length ? <h2 className="section-title">Start with these decisions.</h2> : null}
      <div className="guide-grid">
        {highlights.map((p) => (
          <BlogCard post={p} key={p.id} />
        ))}
      </div>
      {more.length ? (
        <details className="guide-directory destination-directory">
          <summary>
            Explore {more.length} more reviewed guides for {region.name}
          </summary>
          <ul>
            {more.map((p) => (
              <li key={p.id}>
                <Link href={`/blog/${p.slug}`}>
                  <span>{p.category}</span>
                  {p.title} ↗
                </Link>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      <p className="map-notice">
        This collection expands when new places and routes have been checked.{' '}
        <Link href="/image-credits">Photo credits</Link>
      </p>
    </div>
  );
}
