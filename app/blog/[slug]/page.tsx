import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { placesFor } from '@/lib/editorial';
import { guideMetadata, guideSchema, breadcrumbSchema, jsonLd } from '@/lib/seo';
import { SITE_CONFIG, PRACTICAL_TOOLS } from '@/lib/constants';
import { compileGuideContent } from '@/components/MDXContent';
import SaveButton from '@/components/site/SaveButton';
import ShareActions from '@/components/site/ShareActions';
import NextSteps from '@/components/site/NextSteps';
import Contents from '@/components/site/Contents';
import PlaceMap from '@/components/site/PlaceMap';
import PhotoCredit from '@/components/site/PhotoCredit';
import AdSlot from '@/components/site/AdSlot';
import GuideCommunity from '@/components/site/GuideCommunity';
import GuideSignals from '@/components/site/GuideSignals';
import DiscoveryLink from '@/components/site/DiscoveryLink';
import Icon from '@/components/site/Icon';
import { mediaFor, mediaForSource } from '@/lib/media';
import { getDestinations } from '@/lib/destinations';
import { isInRegion } from '@/lib/regions';
import { googleMapsSearch } from '@/lib/google-maps';
import styles from './article-editorial.module.css';
type Params = Promise<{ slug: string }>;
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Params }) {
  const p = getPostBySlug((await params).slug);
  return p ? guideMetadata(p) : { title: 'Guide not found', robots: { index: false } };
}
function dateLabel(date: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}
export default async function Guide({ params }: { params: Params }) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();
  const e = post.editorial;
  const compiled = await compileGuideContent(post.content);
  const hero = mediaFor(e?.heroMediaId) || mediaForSource(post.image);
  const related = getRelatedPosts(post.slug, 3);
  const places = placesFor(e?.placeIds || []);
  const tools = PRACTICAL_TOOLS.filter((t) => e?.tools.includes(t.href.split('/').pop()!));
  const firstTripGuide = post.slug === 'first-trip-to-korea-planning-guide';
  const openingPlaces = places.slice(0, 2);
  const destinations = e?.regions.length
    ? getDestinations().filter((region) => isInRegion(e.regions, region.id))
    : [];
  const regionalLinks = destinations.map((region) => (
    <li key={region.id}>
      <DiscoveryLink event="guide_destination" href={`/destinations/${region.id}`}>
        <span>
          <strong>Explore {region.name}</strong>
          <span>Local transport, places & itineraries</span>
        </span>
        <Icon name="next" />
      </DiscoveryLink>
    </li>
  ));
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/blog' },
    { name: post.category, path: `/blog/category/${post.categoryId}` },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd([guideSchema(post), breadcrumb]) }}
      />
      <GuideSignals id={post.id} category={post.categoryId} />
      <div className={`wrap article-shell editorial-travel-surface ${styles.shell}`}>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Guides</Link>
          <span>/</span>
          <Link href={`/blog/category/${post.categoryId}`}>{post.category}</Link>
        </nav>
        <header className="article-header">
          <div className="eyebrow">
            {post.category}
            <span className="meta-dot" />
            {e ? 'Reviewed travel guide' : 'From the archive'}
          </div>
          <h1>{post.title}</h1>
          {!e ? <p className="article-deck">{post.excerpt}</p> : null}
          <div className="article-byline">
            <Link href="/editorial-policy">Korea Experience Editorial</Link>
            <span>{post.readTime}</span>
            {post.checkedAt ? (
              <span>
                Information checked{' '}
                <time dateTime={post.checkedAt}>{dateLabel(post.checkedAt)}</time>
              </span>
            ) : (
              <span>
                Archive date <time dateTime={post.date}>{dateLabel(post.date)}</time>
              </span>
            )}
          </div>
          {!e ? (
            <aside className="archive-notice">
              <strong>This guide is awaiting editorial review</strong>
              <p>
                Dates, prices, access and important conditions have not completed our current
                checks. Confirm them with the responsible operator before acting.{' '}
                <Link href="/editorial-policy">How we review information</Link>
              </p>
            </aside>
          ) : null}
          {!e ? (
            <div className="article-actions no-print">
              <SaveButton
                id={post.id}
                slug={post.slug}
                title={post.title}
                category={post.category}
              />
              <a href="#share-guide" className="action-button">
                Share this guide
              </a>
              {places.length ? (
                <a href="#places-and-map" className="action-button">
                  Places & map
                </a>
              ) : null}
              <a className="action-button" href="#guide-planning-links">
                Find your next stop
              </a>
            </div>
          ) : null}
        </header>
        <div className={e ? `article-opening ${styles.opening}` : styles.archiveOpening}>
          {e ? (
            <section className="answer-box" aria-labelledby="quick-answer">
              <h2 id="quick-answer">{e.quickTitle || 'Your quick answer'}</h2>
              <p className="opening-answer">{e.answer}</p>
              <div className="article-actions no-print">
                <SaveButton
                  id={post.id}
                  slug={post.slug}
                  title={post.title}
                  category={post.category}
                />
                {places.length ? (
                  <a href="#places-and-map" className="action-button">
                    Places & map
                  </a>
                ) : null}
                <a href="#share-guide" className="action-button">
                  Share
                </a>
              </div>
              <div className="answer-navigation no-print">
                <a className="text-link" href="#guide-details">
                  See the steps & comparisons <span aria-hidden="true">↓</span>
                </a>
                <a className="text-link" href="#guide-planning-links">
                  Find your next stop <span aria-hidden="true">↓</span>
                </a>
              </div>
              <details className="answer-conditions">
                <summary>
                  {e.quickChoices?.length
                    ? 'Compare the choices & key conditions'
                    : 'Who this helps & key conditions'}
                </summary>
                {e.quickChoices?.length ? (
                  <ul className="quick-choices">
                    {e.quickChoices.map((c) => (
                      <li key={c.label}>
                        <strong>{c.label}</strong>
                        <span>{c.detail}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p>
                  <strong>For:</strong> {e.forWhom}
                </p>
                {e.conditions.length ? (
                  <ul>
                    {e.conditions.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                ) : null}
              </details>
            </section>
          ) : null}
          {post.image || openingPlaces.length ? (
            <div className={styles.leadVisual}>
              {post.image ? (
                <figure className={`article-cover${hero ? ` ${styles.actualRatio}` : ''}`}>
                  <img
                    src={post.image}
                    srcSet={hero?.srcSet}
                    sizes={
                      e
                        ? '(max-width: 760px) calc(100vw - 40px), (max-width: 1180px) 45vw, 540px'
                        : '(max-width: 780px) calc(100vw - 40px), 720px'
                    }
                    style={{
                      objectPosition: hero?.focal,
                      objectFit: hero ? 'contain' : 'cover',
                    }}
                    alt={
                      hero?.alt || e?.imageCredit?.title || `${post.title} — illustrative archive cover`
                    }
                    width={hero?.width || 1280}
                    height={hero?.height || 720}
                    fetchPriority="high"
                  />
                  <figcaption>
                    {e?.heroCaption ? <p className="hero-caption">{e.heroCaption}</p> : null}
                    <PhotoCredit credit={e?.imageCredit || hero?.credit} />
                    {!e?.imageCredit && !hero?.credit ? (
                      <p className="photo-credit">
                        Archive cover: its origin and accuracy as a real view of this place have not
                        been verified.
                      </p>
                    ) : null}
                  </figcaption>
                </figure>
              ) : null}
              {openingPlaces.length ? (
                <section className={styles.route} aria-label="Addresses and directions">
                  <h2>Addresses & directions</h2>
                  <ul>
                    {openingPlaces.map((place) => (
                      <li key={place.id}>
                        <div className={styles.routePlace}>
                          <strong>{place.name}</strong>
                          <span lang="ko">{place.address || place.nameKo}</span>
                        </div>
                        <div className={styles.routeMaps}>
                          <a
                            href={`https://map.naver.com/p/search/${encodeURIComponent(place.nameKo)}`}
                            aria-label={`Naver Map for ${place.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Naver Map <span aria-hidden="true">↗</span>
                          </a>
                          <a
                            href={googleMapsSearch(`${place.latitude},${place.longitude}`)}
                            aria-label={`Google Maps for ${place.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Google Maps <span aria-hidden="true">↗</span>
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <a className={styles.mapLink} href="#places-and-map">
                    Open map & all stops <span aria-hidden="true">↓</span>
                  </a>
                </section>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="article-layout" id="guide-details">
          <aside className="article-toc">
            <Contents headings={compiled.headings} />
          </aside>
          <div className="article-reading">
            <article className="article-body">{compiled.content}</article>
            <nav
              className="article-destinations no-print"
              aria-label="Destination guides"
              id="guide-planning-links"
              tabIndex={-1}
            >
              <h2>Continue planning</h2>
              <ul className="article-discovery-links">
                {!firstTripGuide && regionalLinks}
                {!firstTripGuide ? (
                  <li>
                    <DiscoveryLink event="guide_first_trip" href="/blog/first-trip-to-korea-planning-guide">
                      <span><strong>Plan your first trip</strong><span>Dates, budget & what to book</span></span>
                      <Icon name="next" />
                    </DiscoveryLink>
                  </li>
                ) : null}
                <li>
                  <DiscoveryLink event="guide_destinations" href="/destinations">
                    <span><strong>All destinations</strong><span>Compare Korea’s cities & regions</span></span>
                    <Icon name="next" />
                  </DiscoveryLink>
                </li>
                {firstTripGuide ? (
                  <li>
                    <DiscoveryLink event="guide_more_planning" href="/blog/category/plan-your-trip">
                      <span><strong>More trip-planning guides</strong><span>Find checklists & booking advice</span></span>
                      <Icon name="next" />
                    </DiscoveryLink>
                  </li>
                ) : null}
                {firstTripGuide && regionalLinks}
              </ul>
            </nav>
            <AdSlot key={post.id} />
            <PlaceMap places={places} guideId={post.id} />
            {e?.sources.length ? (
              <section className="source-box" id="sources-and-checks">
                <p className="eyebrow">Trace the important details</p>
                <h2>Official sources & checks</h2>
                <p>
                  Reviewed against the sources below on {dateLabel(e.checkedAt)}. Opening
                  conditions, fares and booking rules can change; the operator’s current notice
                  takes precedence.
                </p>
                <ol>
                  {e.sources.map((s) => (
                    <li key={s.id}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.title} ↗
                      </a>
                      <p>Checked {dateLabel(s.checkedAt)}</p>
                    </li>
                  ))}
                </ol>
                <Link href="/contact" className="text-link">
                  Spotted something that changed? Send a correction ↗
                </Link>
              </section>
            ) : null}
            {post.legacyCategory === 'Medical Tourism' ? (
              <aside className="archive-notice">
                <strong>Medical information</strong>
                <p>
                  General information only. Seek qualified professional advice about your own
                  circumstances. For an emergency in Korea call 119.
                </p>
              </aside>
            ) : null}
            <div className="article-dates">
              <span>
                {post.publicationStatus === 'verified-release'
                  ? 'First published'
                  : 'Date recorded in the original archive'}{' '}
                {dateLabel(post.date)}
              </span>
              {post.updated ? <span>Substantively updated {dateLabel(post.updated)}</span> : null}
              <Link href="/editorial-policy">Research & corrections policy</Link>
            </div>
          </div>
        </div>
        {tools.length ? (
          <section className="guide-tools">
            <p className="eyebrow">Put the guide to work</p>
            <h2>Tools for your next decision</h2>
            <div>
              {tools.map((t) => (
                <Link key={t.href} href={t.href}>
                  <strong>{t.title} ↗</strong>
                  <span>{t.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
        <NextSteps current={post} posts={related} />
        <div id="share-guide">
          <ShareActions
            id={post.id}
            title={post.title}
            url={`${SITE_CONFIG.url}/blog/${post.slug}`}
            summary={post.excerpt}
            facts={e?.shareFacts || []}
            checkedAt={post.checkedAt}
            category={post.category}
          />
        </div>
        <GuideCommunity key={post.id} id={post.id} slug={post.slug} />
        <section className="correction-callout">
          <h2>A useful question makes a better guide.</h2>
          <p>
            Tell us what you could not find, what changed on your visit, or which travel detail
            needs a clearer answer.
          </p>
          <div className="button-row">
            <Link
              href={`/community?guide=${encodeURIComponent(post.id)}`}
              className="button button-light"
            >
              Travel questions & updates ↗
            </Link>
            <Link href="/contact" className="text-link">
              Send a correction ↗
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
