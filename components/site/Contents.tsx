import GithubSlugger from 'github-slugger';
export default function Contents({ source }: { source: string }) {
  const slugger = new GithubSlugger();
  const headings = [...source.matchAll(/^## (.+)$/gm)].map((m) => {
    const text = m[1].replace(/[*_`]/g, '');
    return { text, id: slugger.slug(text) };
  });
  if (headings.length < 2) return null;
  return (
    <details className="contents-box" open>
      <summary>In this guide</summary>
      <nav aria-label="On this page">
        <ol>
          {headings.map((h) => (
            <li key={h.id}>
              <a href={'#' + h.id}>{h.text}</a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
