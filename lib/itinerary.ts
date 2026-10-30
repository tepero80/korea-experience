/** Shared by the static planner and Worker. No user-provided HTML is interpreted. */
export interface ItineraryStop {
  id: string;
  day: number;
  time: string;
  place: string;
  address: string;
  note: string;
  durationMinutes: number | null;
  travelBufferMinutes: number | null;
  placeId?: string;
  sourceGuideId?: string;
}
export interface ItineraryPlan {
  version: 2;
  timeZone: 'Asia/Seoul';
  startDate: string | null;
  notes: string;
  items: ItineraryStop[];
}
export interface SharePlanOptions {
  includeNotes: boolean;
  includeAddresses: boolean;
  includeDates: boolean;
}
export const PRIVATE_PLAN_BYTES = 12000;
export const ITINERARY_KEY = 'ke-itinerary-v2';
export const emptyPlan = (): ItineraryPlan => ({
  version: 2,
  timeZone: 'Asia/Seoul',
  startDate: null,
  notes: '',
  items: [],
});
function record(v: unknown): Record<string, unknown> {
  if (!v || typeof v !== 'object' || Array.isArray(v))
    throw Error('This is not a supported trip plan.');
  return v as Record<string, unknown>;
}
function string(v: unknown, max: number, label: string, min = 0) {
  if (typeof v !== 'string' || v.length < min || v.length > max)
    throw Error(`${label} must contain ${min}–${max} characters.`);
  return v;
}
function integer(v: unknown, min: number, max: number, label: string) {
  if (typeof v !== 'number' || !Number.isInteger(v) || v < min || v > max)
    throw Error(`${label} must be a whole number from ${min} to ${max}.`);
  return v;
}
export function validTripDate(v: unknown): v is string {
  if (
    typeof v !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(v) ||
    Number(v.slice(0, 4)) < 2000 ||
    Number(v.slice(0, 4)) > 2100
  )
    return false;
  const date = new Date(v + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === v;
}
export function normalizePlan(value: unknown): ItineraryPlan {
  const raw = Array.isArray(value) ? { items: value } : record(value);
  if (raw.version !== undefined && raw.version !== 1 && raw.version !== 2)
    throw Error(
      'This plan uses a newer or unsupported version. Your existing data has not been replaced.',
    );
  const legacy = raw.version !== 2;
  if (raw.items === undefined && raw.notes === undefined)
    throw Error('The file has no trip stops or notes.');
  if (raw.items !== undefined && !Array.isArray(raw.items))
    throw Error('Trip stops must be a list.');
  const items = (raw.items || []) as unknown[];
  if (items.length > 150)
    throw Error('Keep up to 150 stops. Split a longer trip into separate plans.');
  const seen = new Set<string>();
  const normalized = items.map((value, index) => {
    const s = record(value);
    const id = string(s.id, 100, 'Stop ID', 1);
    if (!/^[\w-]+$/.test(id) || seen.has(id))
      throw Error('Stop IDs must be unique. No stops have been discarded.');
    seen.add(id);
    const time = string(s.time, 5, 'Arrival time');
    if (time !== '' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
      throw Error('Use a valid 24-hour arrival time, or leave it blank.');
    const stop: ItineraryStop = {
      id,
      day: integer(s.day, 1, 90, 'Trip day'),
      time,
      place: string(s.place, 120, 'Place', 1),
      address: string(s.address ?? '', 250, 'Address'),
      note: string(s.note ?? '', 1000, 'Stop note'),
      durationMinutes:
        legacy || s.durationMinutes == null
          ? null
          : integer(s.durationMinutes, 0, 1440, 'Visit minutes'),
      travelBufferMinutes:
        legacy || s.travelBufferMinutes == null
          ? null
          : integer(s.travelBufferMinutes, 0, 1440, 'Travel buffer'),
    };
    for (const key of ['placeId', 'sourceGuideId'] as const)
      if (s[key] !== undefined) stop[key] = string(s[key], 220, key, 1);
    return { stop, index };
  });
  // v1 displayed day/time order. Preserve that once when migrating; v2 order is the owner's order.
  if (legacy)
    normalized.sort(
      (a, b) =>
        a.stop.day - b.stop.day || a.stop.time.localeCompare(b.stop.time) || a.index - b.index,
    );
  const startDate = legacy ? null : raw.startDate;
  if (startDate !== null && !validTripDate(startDate))
    throw Error('Choose a real start date from 2000–2100.');
  if (!legacy && raw.timeZone !== 'Asia/Seoul')
    throw Error('This planner currently uses Korea time (Asia/Seoul).');
  return {
    version: 2,
    timeZone: 'Asia/Seoul',
    startDate,
    notes: string(raw.notes ?? '', 10000, 'Private plan notes'),
    items: normalized.map((v) => v.stop),
  };
}
export function accountPlanData(value: unknown) {
  const plan = normalizePlan(value);
  if (new TextEncoder().encode(JSON.stringify(plan)).byteLength > PRIVATE_PLAN_BYTES)
    throw Error(
      'This plan exceeds the 12,000-byte account limit. Download the complete backup, then split it or shorten notes. Nothing has been truncated.',
    );
  return plan;
}
export function publicPlanData(value: unknown, options: SharePlanOptions): ItineraryPlan {
  const plan = normalizePlan(value);
  return {
    ...plan,
    startDate: options.includeDates ? plan.startDate : null,
    notes: options.includeNotes ? plan.notes : '',
    items: plan.items.map(
      ({ id, day, time, place, address, note, durationMinutes, travelBufferMinutes }) => ({
        id,
        day,
        time,
        place,
        address: options.includeAddresses ? address : '',
        note: options.includeNotes ? note : '',
        durationMinutes,
        travelBufferMinutes,
      }),
    ),
  };
}
export function dateForDay(startDate: string | null, day: number) {
  if (!startDate) return null;
  const date = new Date(startDate + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() + day - 1);
  return date.toISOString().slice(0, 10);
}
export function timingWarnings(plan: ItineraryPlan): string[] {
  const warnings: string[] = [];
  for (const day of new Set(plan.items.map((s) => s.day))) {
    const items = plan.items.filter((s) => s.day === day);
    for (let i = 0; i < items.length - 1; i++) {
      const a = items[i],
        b = items[i + 1];
      if (!a.time || !b.time || a.durationMinutes === null || a.travelBufferMinutes === null)
        continue;
      const minute = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
      if (minute(a.time) + a.durationMinutes + a.travelBufferMinutes > minute(b.time))
        warnings.push(
          `${a.place} → ${b.place}: your visit plus travel buffer extends beyond the next arrival. Adjust times or order.`,
        );
    }
  }
  return warnings;
}
type Store = Pick<Storage, 'getItem' | 'setItem'>;
export function readLocalPlan(store: Store): ItineraryPlan {
  const current = store.getItem(ITINERARY_KEY);
  if (current) {
    const data = record(JSON.parse(current));
    if (data.version !== 2)
      throw Error('Unsupported saved plan version. Download or recover it before replacing it.');
    return normalizePlan(data.plan);
  }
  const legacy = store.getItem('ke-itinerary-v1');
  return legacy ? normalizePlan(JSON.parse(legacy)) : emptyPlan();
}
export function writeLocalPlan(store: Store, plan: ItineraryPlan) {
  // Read before replacing: an unsupported/corrupt existing version must be explicitly recovered.
  readLocalPlan(store);
  store.setItem(ITINERARY_KEY, JSON.stringify({ version: 2, plan: normalizePlan(plan) }));
  // The v1 key is deliberately retained as a migration/recovery copy.
}
