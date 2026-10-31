export const ANALYTICS_ORIGIN = 'https://koreaexperience.com';
export const ANALYTICS_ID = 'G-8D8HNVWDR9';
export const ANALYTICS_READY_EVENT = 'ke-analytics-ready';

const tools = new Set([
  'airport-transfer',
  'transit-pass',
  'trip-budget',
  'itinerary',
  'packing-checklist',
  'rainy-day',
]);
const categories = new Set([
  'plan-your-trip',
  'airports-transport',
  'where-to-stay',
  'places-itineraries',
  'food-dining',
  'shopping-kbeauty',
  'culture-events',
  'travel-essentials',
]);
const intents = new Set([
  'tax-refund',
  'dietary',
  'palace-night',
  'airport-transfer',
  'transit-pass',
  'winter-preparation',
  'payment',
  'connectivity',
  'accommodation',
  'itinerary',
  'food',
  'culture',
  'shopping',
  'entry-preparation',
  'unclassified',
]);
const relations = new Set(['prepare', 'next', 'nearby', 'interest', 'alternative']);
type Value = string | number | boolean;
type Validator = (value: unknown) => value is Value;
const identifier: Validator = (v): v is string =>
  typeof v === 'string' && /^[a-z0-9][a-z0-9:_-]{0,99}$/.test(v);
const member =
  (values: Set<string>): Validator =>
  (v): v is string =>
    typeof v === 'string' && values.has(v);
const count =
  (maximum: number): Validator =>
  (v): v is number =>
    typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= maximum;

// Only these project events and public identifiers may reach analytics. Raw searches,
// private plan fields, destinations entered by a member and arbitrary URLs have no schema.
const schema: Record<string, Record<string, Validator>> = {
  guide_engaged: { content_id: identifier, category: member(categories) },
  guide_save: { content_id: identifier, category: member(categories) },
  guide_unsave: { content_id: identifier, category: member(categories) },
  related_guide_click: {
    content_id: identifier,
    target_id: identifier,
    relation: member(relations),
  },
  search_no_results: { term_count: count(100), intent: member(intents) },
  tool_start: { tool: member(tools) },
  tool_complete: { tool: member(tools) },
  tool_recalculate: { tool: member(tools) },
  itinerary_place_add: { place_id: identifier },
  map_open: { place_count: count(500) },
  share_copy: { content_id: identifier },
  share_handoff: { content_id: identifier },
  share_card_download: { content_id: identifier, format: member(new Set(['feed', 'story'])) },
  share_channel_click: {
    content_id: identifier,
    channel: member(new Set(['facebook', 'x', 'whatsapp', 'line'])),
  },
  affiliate_click: { partner: member(new Set(['klook'])) },
};

export function analyticsEvent(
  name: string,
  input: Record<string, unknown>,
): Record<string, Value> | null {
  const fields = Object.hasOwn(schema, name) ? schema[name] : undefined;
  if (!fields) return null;
  const output: Record<string, Value> = {};
  for (const [key, valid] of Object.entries(fields)) {
    if (!valid(input[key])) return null;
    output[key] = input[key];
  }
  return output;
}

export function publicAnalyticsPath(value: string): string | null {
  const path = value.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/';
  if (/^\/(?:api|admin|community)(?:\/|$)/.test(path)) return null;
  if (/^\/(?:blog|tools|destinations)(?:\/[a-z0-9-]+){0,2}$/.test(path)) return path;
  return new Set([
    '/',
    '/saved',
    '/about',
    '/contact',
    '/editorial-policy',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/image-credits',
  ]).has(path)
    ? path
    : null;
}

export function analyticsContext(pathname: string, referrer: string) {
  const path = publicAnalyticsPath(pathname);
  if (!path) return null;
  let safeReferrer = '';
  try {
    const url = new URL(referrer);
    if (url.protocol === 'https:' || url.protocol === 'http:') {
      const publicPath = url.origin === ANALYTICS_ORIGIN ? publicAnalyticsPath(url.pathname) : null;
      safeReferrer = url.origin + (publicPath && publicPath !== '/' ? publicPath : '');
    }
  } catch {
    /* Empty or malformed referrers are omitted. */
  }
  return {
    page_path: path,
    page_location: ANALYTICS_ORIGIN + (path === '/' ? '/' : path),
    page_referrer: safeReferrer,
  };
}
