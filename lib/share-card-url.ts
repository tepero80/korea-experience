import {
  airportShareUrl,
  budgetShareUrl,
  checklistShareUrl,
  passShareUrl,
  rainShareUrl,
  readAirportShare,
  readBudgetShare,
  readChecklistShare,
  readPassShare,
  readRainShare,
} from './tool-share';

/** A downloadable image may contain only the same validated public tool inputs as its link. */
export function shareCardUrl(raw: string) {
  const url = new URL(raw);
  if (url.origin !== 'https://koreaexperience.com' || url.username || url.password)
    throw Error('Invalid public card destination.');
  const base = url.origin + url.pathname.replace(/\/$/, '');
  if (/^\/blog\/[a-z0-9-]+\/?$/.test(url.pathname)) return base;
  if (url.pathname === '/tools/transit-pass') {
    const v = readPassShare(url.search);
    return v ? passShareUrl(v) : base;
  }
  if (url.pathname === '/tools/trip-budget') {
    const v = readBudgetShare(url.search);
    return v ? budgetShareUrl(v) : base;
  }
  if (url.pathname === '/tools/airport-transfer') {
    const v = readAirportShare(url.search);
    return v ? airportShareUrl(v) : base;
  }
  if (url.pathname === '/tools/packing-checklist') {
    const v = readChecklistShare(url.search);
    return v ? checklistShareUrl(v) : base;
  }
  if (url.pathname === '/tools/rainy-day') {
    const v = readRainShare(url.search);
    return v ? rainShareUrl(v) : base;
  }
  if (url.pathname === '/tools/itinerary') return base;
  throw Error('This destination has no reviewed public share-card contract.');
}
