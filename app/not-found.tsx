import Link from 'next/link';
export const metadata = { title: 'Page not found', robots: { index: false, follow: true } };
export default function NotFound() {
  return (
    <div className="wrap document-page">
      <p className="eyebrow">404 · A different route</p>
      <h1>This page is unavailable.</h1>
      <p>
        The address may have changed or the guide may have been retired. Find a current guide or
        start with a practical travel tool.
      </p>
      <div className="button-row">
        <Link className="button" href="/blog">
          Find a travel guide
        </Link>
        <Link className="button button-light" href="/tools">
          Travel tools
        </Link>
      </div>
    </div>
  );
}
