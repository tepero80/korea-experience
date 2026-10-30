'use client';
type EventValue = string | number | boolean;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function track(name: string, values: Record<string, EventValue> = {}) {
  if (typeof window === 'undefined' || window.location.hostname !== 'koreaexperience.com') return;
  if (window.localStorage.getItem('ke-consent-v1') !== 'accepted') return;
  // Send identifiers and derived categories only; never names, emails, notes, or raw searches.
  window.gtag?.('event', name, values);
}
