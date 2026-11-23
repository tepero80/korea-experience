import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { getAllPosts } from '@/lib/posts';
import { TRAVEL_CATEGORIES } from '@/lib/taxonomy';
export const GUIDES_PER_PAGE = 24;

function guidePageHref(page: number) {
  return page === 1 ? '/blog' : `/blog/page/${page}`;
}

export default function GuideLibrary({ page = 1 }: { page?: number }) {
  const all = getAllPosts();
  const count = Math.ceil(all.length / GUIDES_PER_PAGE);
  const slice = all.slice((page - 1) * GUIDES_PER_PAGE, page * GUIDES_PER_PAGE);
  return (
    <div className="wrap library-page">
      <div className="page-intro">
        <h1 className="section-title">Korea travel guides</h1>
        <p>
          Browse practical travel information by the decision you are making. Newly reviewed guides
          include sources, checked dates, useful tools, and deliberate next steps.
        </p>
      </div>
      <nav className="filter-links" aria-label="Guide categories">
        <Link href="/blog" aria-current={page === 1 ? 'page' : undefined}>
          All guides
        </Link>
        {TRAVEL_CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/blog/category/${c.slug}`}>
            {c.name}
          </Link>
        ))}
      </nav>
      <div className="list-meta">
        <span>
          {all.length} published guides · Page {page} of {count}
        </span>
        <Link href="/editorial-policy">What “reviewed” means</Link>
      </div>
      {count > 1 ? (
        <details className="guide-directory library-page-jump">
          <summary>Jump to a page</summary>
          <nav aria-label="Choose a guide page">
            <ol role="list">
              {Array.from({ length: count }, (_, index) => {
                const number = index + 1;
                return (
                  <li key={number}>
                    {number === page ? (
                      <span aria-current="page">
                        <span className="sr-only">Page </span>
                        {number}
                      </span>
                    ) : (
                      <a href={guidePageHref(number)} aria-label={`Page ${number}`}>
                        {number}
                      </a>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </details>
      ) : null}
      <h2 className="sr-only">Guide results</h2>
      <div className="guide-grid">
        {slice.map((p, i) => (
          <BlogCard key={p.id} post={p} priority={i < 3} />
        ))}
      </div>
      <nav className="pagination" aria-label="Guide pages">
        {page > 1 ? (
          <Link
            href={guidePageHref(page - 1)}
            className="button button-light"
          >
            ← Previous
          </Link>
        ) : (
          <span />
        )}
        <span>
          Page {page} of {count}
        </span>
        {page < count ? (
          <Link href={guidePageHref(page + 1)} className="button button-light">
            Next →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
