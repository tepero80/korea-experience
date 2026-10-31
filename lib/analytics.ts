'use client';
import { ANALYTICS_ORIGIN, analyticsContext, analyticsEvent } from './analytics-policy';
type EventValue = string | number | boolean;
let currentPageContext: ReturnType<typeof analyticsContext> = null;
let deniedInMemory = false;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function readAnalyticsPreference(): 'accepted' | 'essential' | null {
  if (deniedInMemory) return 'essential';
  try {
    const value = window.localStorage.getItem('ke-consent-v1');
    return value === 'accepted' || value === 'essential' ? value : null;
  } catch {
    return null;
  }
}

export function saveAnalyticsPreference(value: 'accepted' | 'essential'): boolean {
  // A failed storage write must still revoke an earlier acceptance in this view.
  deniedInMemory = true;
  let saved = false;
  try {
    window.localStorage.setItem('ke-consent-v1', value);
    deniedInMemory = value !== 'accepted';
    saved = true;
  } catch {}
  window.dispatchEvent(new Event('ke-consent-change'));
  return saved;
}

export function setAnalyticsPageContext(path: string, referrer: string) {
  currentPageContext = analyticsContext(path, referrer);
  return currentPageContext;
}

/** True means queued locally, not that Google received or reported an event. */
export function track(name: string, values: Record<string, EventValue> = {}): boolean {
  try {
    if (typeof window === 'undefined' || window.location.origin !== ANALYTICS_ORIGIN) return false;
    if (readAnalyticsPreference() !== 'accepted' || !window.gtag) return false;
    const freshContext = analyticsContext(window.location.pathname, document.referrer);
    const context =
      currentPageContext?.page_path === freshContext?.page_path ? currentPageContext : freshContext;
    const safeValues = analyticsEvent(name, values);
    if (!context || !safeValues) return false;
    window.gtag('event', name, { ...safeValues, ...context });
    return true;
  } catch {
    // Optional measurement must never interrupt a save, calculation or share action.
    return false;
  }
}
