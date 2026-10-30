import Link from 'next/link';
import { TOOL_REVIEWS, type ReviewedToolSlug } from '@/lib/tool-review';

export default function ToolReviewNotice({ slug }: { slug: ReviewedToolSlug }) {
  const review = TOOL_REVIEWS[slug];
  return (
    <div className="wrap document-page">
      <header className="page-intro">
        <p className="eyebrow">Tool under review</p>
        <h1>{review.title}</h1>
      </header>
      <div className="document-prose">
        <p>{review.explanation}</p>
        <p>
          <a href={review.source} target="_blank" rel="noopener noreferrer">
            {review.action} ↗
          </a>
        </p>
        <p>
          Notice updated <time dateTime="2026-10-31">31 October 2026</time>.
        </p>
        <Link href="/tools" className="button">
          Explore travel planning tools
        </Link>
      </div>
    </div>
  );
}
