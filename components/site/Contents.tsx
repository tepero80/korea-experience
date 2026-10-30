export default function Contents({ headings }: { headings: { text: string; id: string }[] }) {
  if (headings.length < 2) return null;
  const links = (
    <ol>
      {headings.map((h) => (
        <li key={h.id}>
          <a href={'#' + h.id}>{h.text}</a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <nav className="contents-box contents-desktop" aria-label="On this page">
        <p className="contents-title">In this guide</p>
        {links}
      </nav>
      <details className="contents-box contents-mobile">
        <summary>Jump to a section</summary>
        <nav aria-label="On this page">{links}</nav>
      </details>
    </>
  );
}
