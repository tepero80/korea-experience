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
import { mediaFor, mediaForSource } from '@/lib/media';
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
      <div className="wrap article-shell">
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
            {post.accuracyCorrection ? (
              <span>
                Accuracy corrected{' '}
                <time dateTime={post.accuracyCorrection.checkedAt}>
                  {dateLabel(post.accuracyCorrection.checkedAt)}
                </time>
              </span>
            ) : post.checkedAt ? (
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
              <strong>
                {post.accuracyCorrection
                  ? 'Accuracy rewrite · full experience review pending'
                  : 'This guide is awaiting editorial review'}
              </strong>
              {post.accuracyCorrection ? (
                <p>
                  The body and metadata were rewritten against linked primary sources on{' '}
                  {dateLabel(post.accuracyCorrection.checkedAt)}. Historical cover provenance and
                  the complete traveler-experience review remain pending. Confirm current operator
                  conditions before acting.{' '}
                  <Link href="/editorial-policy">How we review information</Link>
                </p>
              ) : (
                <p>
                  Dates, prices, access and important conditions have not completed our current
                  checks. Confirm them with the responsible operator before acting.{' '}
                  <Link href="/editorial-policy">How we review information</Link>
                </p>
              )}
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
            </div>
          ) : null}
        </header>
        <div className={e ? 'article-opening' : undefined}>
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
              <a className="text-link" href="#guide-details">
                See the steps & comparisons ↓
              </a>
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
          {post.image ? (
            <figure className="article-cover">
              <img
                src={post.image}
                srcSet={hero?.srcSet}
                sizes="(max-width: 700px) calc(100vw - 40px), 620px"
                style={{
                  objectPosition: hero?.focal,
                  objectFit: hero?.credit.kind === 'illustration' ? 'contain' : 'cover',
                }}
                alt={
                  hero?.alt || e?.imageCredit?.title || `${post.title} — illustrative archive cover`
                }
                width="1280"
                height="720"
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
        </div>
        <div className="article-layout" id="guide-details">
          <aside className="article-toc">
            <Contents headings={compiled.headings} />
          </aside>
          <div className="article-reading">
            <article className="article-body">{compiled.content}</article>
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
