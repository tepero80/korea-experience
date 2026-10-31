'use client';
import ShareActions from './ShareActions';
export default function ToolResultShare({
  slug,
  title,
  summary,
  facts,
  url,
  checkedAt,
}: {
  slug: string;
  title: string;
  summary: string;
  facts: string[];
  url?: string;
  checkedAt?: string;
}) {
  return (
    <ShareActions
      kind="result"
      id={'result-' + slug}
      title={title}
      summary={summary}
      facts={facts}
      category="Your travel calculation"
      url={url || 'https://koreaexperience.com/tools/' + slug}
      checkedAt={checkedAt}
    />
  );
}
