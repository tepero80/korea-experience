import { notFound } from 'next/navigation';
import { getDestinations } from '@/lib/destinations';
import { mediaFor } from '@/lib/media';
import { SITE_CONFIG } from '@/lib/constants';
import styles from '../destinations.module.css';

const arrivalGuides: Readonly<Record<string, string>> = {
  seoul: 'airport-limousine-bus-vs-arex-express-train',
  busan: 'gimhae-airport-to-busan',
  suwon: 'suwon-hwaseong-museum-before-fortress',
  incheon: 'incheon-airport-to-songdo-hotels',
  gyeongju: 'gyeongju-ktx-to-hwangnidan',
  jeju: 'jeju-airport-to-jeju-city-and-seogwipo',
  daegu: 'dongdaegu-station-to-central-daegu',
  jeonju: 'jeonju-station-to-hanok-village',
  chuncheon: 'seoul-to-chuncheon-train-choice',
  gangneung: 'seoul-to-gangneung-ktx-vs-express-bus',
  sokcho: 'sokcho-intercity-vs-express-bus-terminal',
  andong: 'andong-station-and-bus-terminal-to-downtown',
  daejeon: 'daejeon-station-ktx-to-metro-line-one',
  gwangju: 'gwangju-songjeong-station-to-asia-culture-center',
  mokpo: 'mokpo-station-to-correct-ferry-terminal',
};

const gyeongjuNight = 'gyeongju-donggung-wolji-woljeonggyo-evening-walk';

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
  const image = photo && {
    url: SITE_CONFIG.url + photo.src,
    width: photo.width,
    height: photo.height,
    alt: photo.alt,
  };
  return {
    title,
    description: region.intro,
    robots: { index: region.indexable, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title,
      description: region.intro,
      url,
      type: 'website' as const,
      images: image ? [image] : [],
    },
    twitter: {
      title,
      description: region.intro,
      card: 'summary_large_image' as const,
      images: image ? [image] : [],
    },
  };
}
export default async function Destination({ params }: { params: Params }) {
  const id = (await params).region;
  const destinations = getDestinations();
  const region = destinations.find((r) => r.id === id);
  if (!region) notFound();
  const posts = region.posts;
  const isGyeongju = id === 'gyeongju';
  const arrival = posts.find((post) => post.slug === arrivalGuides[id]);
  const cover = mediaFor(region.coverMediaId);
  const ranked = region.highlights?.flatMap((slug) => {
    const post = posts.find((guide) => guide.slug === slug);
    return post ? [post] : [];
  });
  const highlights = ranked?.length ? ranked : posts.slice(0, 6);
  if (isGyeongju) {
    const night = highlights.findIndex(({ slug }) => slug === gyeongjuNight);
    if (night > 0) highlights.unshift(...highlights.splice(night, 1));
  }
  const more = posts.filter((p) => !highlights.includes(p));
  const onward =
    region.onward?.flatMap(({ regionId, reason }) => {
      const other = destinations.find(
        (candidate) => candidate.id === regionId && candidate.indexable,
      );
      return other ? [{ destination: other, reason }] : [];
    }) ?? [];
  return (
    <div className={`wrap editorial-travel-surface ${styles.hub}`}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <a href="/destinations">Destinations</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{region.name}</span>
      </nav>
      <header className={styles.hubHero}>
        <div className={styles.hubIntro}>
          <p className={styles.koreanName} lang="ko">
            {region.nameKo}
          </p>
          <h1 className={styles.title}>{region.name}</h1>
          <p className={styles.dek}>
            {isGyeongju
              ? 'Walk among the Silla tombs, then stay for the city’s illuminated ponds and bridges.'
              : region.intro}
          </p>
          {highlights.length ? (
            <nav className={styles.hubActions} aria-label={`Plan a trip to ${region.name}`}>
              {arrival ? <a href={`/blog/${arrival.slug}`}>Getting here</a> : null}
              <a href="#plan-your-visit">Plan your visit</a>
            </nav>
          ) : null}
        </div>
        {cover ? (
          <figure className={styles.hubCover}>
            <img
              src={cover.src}
              srcSet={cover.srcSet}
              sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1200px) 55vw, 696px"
              alt={cover.alt}
              width={cover.width}
              height={cover.height}
              style={{ objectPosition: cover.focal }}
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>
              <span>{isGyeongju ? 'Daereungwon Tomb Complex' : cover.alt}</span>
              <a href={`/image-credits#${cover.id}`}>Photo credit</a>
            </figcaption>
          </figure>
        ) : null}
      </header>
      <aside className={styles.tripNote}>
        <p>{region.tip}</p>
      </aside>
      {highlights.length ? (
        <section className={styles.plans} aria-labelledby="plan-your-visit">
          <h2 className={styles.sectionTitle} id="plan-your-visit" tabIndex={-1}>
            Choose a plan
          </h2>
          <div className={`guide-grid ${styles.plansGrid}`}>
            {highlights.map((post) => (
              <a
                href={`/blog/${post.slug}`}
                className={`guide-card ${styles.planLink}`}
                key={post.id}
              >
                <div>
                  <h3>{post.slug === gyeongjuNight ? 'One evening in Gyeongju' : post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}
      {more.length ? (
        <details className={`guide-directory destination-directory ${styles.moreGuides}`}>
          <summary>
            Explore {more.length} more reviewed guides for {region.name}
          </summary>
          <ul>
            {more.map((p) => (
              <li key={p.id}>
                <a href={`/blog/${p.slug}`}>
                  <span>{p.category}</span>
                  {p.title} ↗
                </a>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
      {onward.length ? (
        <section
          className={`destination-onward ${styles.onward}`}
          aria-labelledby="destination-onward"
        >
          <h2 className={styles.sectionTitle} id="destination-onward">
            Plan your next stop
          </h2>
          <div className="next-step-grid">
            {onward.map(({ destination, reason }) => (
              <a href={`/destinations/${destination.id}`} key={destination.id}>
                <h3>{destination.name}</h3>
                <p>{reason}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}
      <a className={styles.creditsLink} href="/image-credits">
        Destination photo credits
      </a>
    </div>
  );
}
