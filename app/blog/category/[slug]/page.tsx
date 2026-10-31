import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORY_HUBS, PRACTICAL_TOOLS } from '@/lib/constants';
import { getAllPosts } from '@/lib/posts';
import { breadcrumbSchema, jsonLd } from '@/lib/seo';
import BlogCard from '@/components/BlogCard';
type Params = Promise<{ slug: string }>;
export const dynamicParams = false;
export function generateStaticParams() {
  return CATEGORY_HUBS.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const hub = CATEGORY_HUBS.find((c) => c.slug === slug);
  return hub
    ? {
        title: hub.metaTitle,
        description: hub.description,
        alternates: { canonical: `https://koreaexperience.com/blog/category/${slug}` },
      }
    : { title: 'Category not found', robots: { index: false } };
}
export default async function Hub({ params }: { params: Params }) {
  const { slug } = await params;
  const hub = CATEGORY_HUBS.find((c) => c.slug === slug);
  if (!hub) notFound();
  const posts = getAllPosts().filter((p) =>
    hub.legacy
      ? p.legacyCategory === hub.name
      : p.categoryId === slug &&
        (p.reviewed ||
          (p.legacyCategory !== 'Medical Tourism' &&
            !/digital nomad|alien registration|\bARC\b|long.term|work visa|job application|bank account|jeonse|military service/i.test(
              p.title,
            ))),
  );
  const reviewed = posts
    .filter((p) => p.reviewed)
    .sort((a, b) => a.editorial!.launchOrder - b.editorial!.launchOrder);
  const archive = posts.filter((p) => !p.reviewed);
  const toolIds = new Set(reviewed.flatMap((p) => p.editorial?.tools || []));
  const tools = PRACTICAL_TOOLS.filter((t) => toolIds.has(t.href.split('/').pop()!));
  return (
    <div className="wrap library-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Guides', path: '/blog' },
              { name: hub.name, path: `/blog/category/${slug}` },
            ]),
          ),
        }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/blog">Guides</Link>
        <span>/</span>
        <span>{hub.name}</span>
      </nav>
      <div className="page-intro">
        <p className="eyebrow">{hub.legacy ? 'Earlier collection' : 'Find your next answer'}</p>
        <h1 className="section-title">{hub.name}</h1>
        <p>{hub.description}</p>
      </div>
      <nav className="filter-links" aria-label="Other guide categories">
        {CATEGORY_HUBS.filter((c) => !c.legacy).map((c) => (
          <Link
            key={c.slug}
            href={`/blog/category/${c.slug}`}
            aria-current={slug === c.slug ? 'page' : undefined}
          >
            {c.name}
          </Link>
        ))}
      </nav>
      {reviewed.length ? (
        <>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className="section-title">Reviewed for your trip.</h2>
            </div>
            <p className="section-intro">
              Each guide shows its sources, conditions, and information check date.
            </p>
          </div>
          <div className="guide-grid">
            {reviewed.map((p, i) => (
              <BlogCard key={p.id} post={p} priority={i < 3} />
            ))}
          </div>
        </>
      ) : null}
      {tools.length ? (
        <section className="guide-tools">
          <p className="eyebrow">Make the next decision easier</p>
          <h2>Useful tools</h2>
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
      {archive.length ? (
        <section className="archive-list">
          <h2>More from the archive</h2>
          <p>
            These earlier articles are awaiting the new editorial review. Confirm current details
            with the official operator.
          </p>
          <details className="guide-directory" open={!reviewed.length}>
            <summary>Browse {archive.length} earlier guides</summary>
            <ul>
              {archive.map((p) => (
                <li key={p.id}>
                  <Link href={`/blog/${p.slug}`}>
                    {p.title} <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </section>
      ) : null}
    </div>
  );
}
