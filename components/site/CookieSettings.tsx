'use client';
import Link from 'next/link';
export default function CookieSettings() {
  return (
    <>
      <button
        className="cookie-settings"
        onClick={() => window.dispatchEvent(new Event('ke-open-consent'))}
      >
        Cookie settings
      </button>
      <Link href="/privacy#advertising-choices">Advertising privacy</Link>
    </>
  );
}
