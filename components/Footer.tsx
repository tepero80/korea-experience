import Link from 'next/link';
import { FOOTER_LINKS } from '@/lib/constants';
import { TRAVEL_CATEGORIES } from '@/lib/taxonomy';
import CookieSettings from './site/CookieSettings';
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <Link href="/" className="footer-brand">
            Korea Experience<span>Make room for the experience.</span>
          </Link>
          <p>Useful answers, considered routes, and practical tools for your time in Korea.</p>
          <Link href="/editorial-policy" className="text-link">
            How we research our guides <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <nav aria-label="Explore Korea">
          <h2>Find your way</h2>
          {TRAVEL_CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/blog/category/${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Resources">
          <h2>Keep planning</h2>
          {FOOTER_LINKS.resources.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="wrap footer-bottom">
        <p>© {new Date().getFullYear()} Korea Experience</p>
        <nav aria-label="Policies">
          {FOOTER_LINKS.legal.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <CookieSettings />
        </nav>
        <p className="footer-disclosure">
          Planning information can change. Confirm important details with the official operator
          before you book. Paid links, when present, are labeled.
        </p>
      </div>
    </footer>
  );
}
