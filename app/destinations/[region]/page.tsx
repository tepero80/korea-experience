import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDestinations } from '@/lib/destinations';
import { mediaFor } from '@/lib/media';
import { SITE_CONFIG } from '@/lib/constants';
import BlogCard from '@/components/BlogCard';
type Params = Promise<{ region: string }>;
export const dynamicParams = false;
export function generateStaticParams() {
  return getDestinations().map((r) => ({ region: r.id }));
}
export async function generateMetadata({ params }: { params: Params }) {
  const id = (await params).region;
  const region = getDestinations().find((item) => item.id === id);
  if (!region) return { title: 'Destination not found', robots: { index: false } };
  const title = `${region.name} travel planning guides`;
  const url = `${SITE_CONFIG.url}/destinations/${id}`;
  const photo = mediaFor(region.coverMediaId);
  const image = photo && { url: SITE_CONFIG.url + photo.src, width: photo.width, height: photo.height, alt: photo.alt };
  return {
    title,
    description: region.intro,
    robots: { index: region.indexable, follow: true },
    alternates: { canonical: url },
    openGraph: { title, description: region.intro, url, type: 'website' as const, images: image ? [image] : [] },
    twitter: { title, description: region.intro, card: 'summary_large_image' as const, images: image ? [image] : [] },
  };
}
export default async function Destination({ params }: { params: Params }) {
  const id = (await params).region;
  const region = getDestinations().find((r) => r.id === id);
  if (!region) notFound();
  const posts = region.posts;
  const ranked = region.highlights?.flatMap((slug) => {
    const post = posts.find((guide) => guide.slug === slug);
    return post ? [post] : [];
  });
  const highlights = ranked?.length ? ranked : posts.slice(0, 6);
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
