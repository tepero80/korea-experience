'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
export default function ConsentManager() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (location.hostname === 'koreaexperience.com' && !localStorage.getItem('ke-consent-v1'))
      setVisible(true);
    const open = () => setVisible(true);
    window.addEventListener('ke-open-consent', open);
    return () => window.removeEventListener('ke-open-consent', open);
  }, []);
  function choose(value: string) {
    localStorage.setItem('ke-consent-v1', value);
    window.dispatchEvent(new Event('ke-consent-change'));
    setVisible(false);
  }
  if (!visible) return null;
  return (
    <aside className="consent-banner no-print" aria-label="Analytics preferences">
      <div>
        <strong>Your visit, your choice.</strong>
        <p>
          Essential storage keeps your saved guides and plans on this browser. Optional analytics
          helps us improve the site. Advertising choices, when ads are enabled, are managed through
          Google’s consent message. <Link href="/privacy">Privacy details</Link>
        </p>
      </div>
      <div>
        <button className="button button-light" onClick={() => choose('essential')}>
          Essential only
        </button>
        <button className="button button-dark" onClick={() => choose('accepted')}>
          Allow analytics
        </button>
      </div>
    </aside>
  );
}
