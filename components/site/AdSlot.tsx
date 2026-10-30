'use client';
import { useEffect, useRef, useState } from 'react';
import config from '@/data/ad-config.json';
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}
export default function AdSlot({ variant = 'article' }: { variant?: 'article' | 'hub' }) {
  const ref = useRef<HTMLModElement>(null);
  const [production, setProduction] = useState(false);
  const slot = variant === 'article' ? config.articleSlot : config.hubSlot;
  useEffect(() => {
    setProduction(location.hostname === 'koreaexperience.com');
    if (
      !config.enabled ||
      !config.cmpVerified ||
      !production ||
      !slot ||
      location.hostname !== 'koreaexperience.com'
    )
      return;
    try {
      (window.adsbygoogle ||= []).push({});
    } catch {
      /* Ad blocking must not break the guide. */
    }
  }, [slot, production]);
  if (!production || !config.enabled || !config.cmpVerified || !slot) return null;
  return (
    <aside className="ad-slot no-print" aria-label="Advertisement">
      <span>Advertisement</span>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={config.publisher}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
