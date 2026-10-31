'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/lib/constants';
import Search from './Search';
import Icon from './site/Icon';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [open]);
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="site-header-inner">
        <Link href="/" className="wordmark" aria-label="K° Korea Experience home">
          <span className="brand-mark" aria-hidden="true">
            K<span>°</span>
          </span>
          <span>
            Korea{' '}<span className="brand-second">Experience</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Search />
          <Link href="/saved" className="icon-button" aria-label="Saved guides">
            <Icon name="bookmark" />
          </Link>
          <button
            ref={menuButton}
            className="icon-button mobile-menu-button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
              <Icon name="arrow" />
            </Link>
          ))}
          <Link href="/saved">
            Saved guides
            <Icon name="bookmark" />
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
