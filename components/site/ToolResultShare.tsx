'use client';
import ShareActions from './ShareActions';
export default function ToolResultShare({
  slug,
  title,
  summary,
  facts,
}: {
  slug: string;
  title: string;
  summary: string;
  facts: string[];
}) {
  return (
    <ShareActions
      id={'result-' + slug}
      title={title}
      summary={summary}
      facts={facts}
      category="Your travel calculation"
      url={'https://koreaexperience.com/tools/' + slug}
      checkedAt="2026-10-30"
    />
  );
}
