import { dailyAudienceTarget, settledDates } from './growth-goals';

export const cloudflareVisitsSnapshot = '.private/reports/cloudflare-visits-latest.json';
const source = 'Cloudflare Web Analytics dashboard';
const hostname = 'koreaexperience.com';
const timeZone = 'Asia/Seoul';
const scope =
  'RUM Visits for the exact apex host with Exclude bots set to Yes. Visits count entries, not distinct people. Cloudflare can sample or aggregate data.';

type Window = { startDate: string; endDate: string };
type Measure = { count: number; display: string; resolution: number };
type Observation = Window & { visits: Measure };

function dashboardMeasure(value: unknown): Measure | null {
  if (typeof value !== 'string') return null;
  if (/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value)) {
    const count = Number(value.replaceAll(',', ''));
    return Number.isSafeInteger(count) ? { count, display: value, resolution: 1 } : null;
  }
  const compact = /^(\d+)(?:\.(\d+))?([kmb])$/i.exec(value);
  if (!compact) return null;
  const multiplier =
    { k: 1_000, m: 1_000_000, b: 1_000_000_000 }[compact[3].toLowerCase() as 'k' | 'm' | 'b'];
  const resolution = multiplier / 10 ** (compact[2]?.length ?? 0);
  const count = Math.round(Number(value.slice(0, -1)) * multiplier);
  return resolution >= 1 && Number.isSafeInteger(count)
    ? { count, display: value, resolution }
    : null;
}

function asObject(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function windowForDays(days: string[]): Window {
  return { startDate: days[0], endDate: days.at(-1)! };
}

function rangeKey(range: Window) {
  return `${range.startDate}/${range.endDate}`;
}

export function summarizeCloudflareVisits(snapshot: unknown, now: Date) {
  const dates = settledDates(now, timeZone);
  const expected = {
    latest: windowForDays(dates.slice(-1)),
    previousSameWeekday: windowForDays(dates.slice(-8, -7)),
    latestWeek: windowForDays(dates.slice(-7)),
    previousWeek: windowForDays(dates.slice(-14, -7)),
  };
  const base = {
    source, hostname, timeZone, excludeBots: true, scope, visitTargetPerDay: dailyAudienceTarget, expected,
  };
  const unavailable = (reason: string) => ({ ...base, status: 'unavailable' as const, reason });
  if (snapshot === undefined) return unavailable('No dashboard observation has been saved.');
  const input = asObject(snapshot);
  if (
    !input || input.source !== source || input.hostname !== hostname || input.timeZone !== timeZone ||
    input.excludeBots !== true || !Array.isArray(input.observations) || !input.observations.length ||
    typeof input.observedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T.*Z$/.test(input.observedAt)
  ) {
    return unavailable('The source, scope, or observation record is invalid.');
  }
  const observedAt = new Date(input.observedAt);
  if (!Number.isFinite(observedAt.getTime()) || observedAt > now) {
    return unavailable('The observation time is invalid.');
  }
  const eligible = settledDates(observedAt, timeZone);
  const records = new Map<string, Observation>();
  for (const raw of input.observations) {
    const row = asObject(raw);
    if (!row || typeof row.startDate !== 'string' || typeof row.endDate !== 'string') {
      return unavailable('A dashboard range is invalid.');
    }
    const range = { startDate: row.startDate, endDate: row.endDate };
    const first = eligible.indexOf(range.startDate);
    const last = eligible.indexOf(range.endDate);
    const visits = dashboardMeasure(row.displayedVisits);
    if (first < 0 || last < 0 || ![0, 6].includes(last - first) || !visits || records.has(rangeKey(range))) {
      return unavailable('A dashboard range is incomplete or duplicated, or its displayed total is invalid.');
    }
    records.set(rangeKey(range), { ...range, visits });
  }

  const latest = records.get(rangeKey(expected.latest)) ?? null;
  const previousSameWeekday = records.get(rangeKey(expected.previousSameWeekday)) ?? null;
  const latestWeek = records.get(rangeKey(expected.latestWeek)) ?? null;
  const previousWeek = records.get(rangeKey(expected.previousWeek)) ?? null;
  const current = [latest, previousSameWeekday, latestWeek, previousWeek].filter(Boolean).length;
  const dailyCount = latest?.visits.resolution === 1 ? latest.visits.count : null;
  return {
    ...base,
    observedAt: input.observedAt,
    status: current === 4 ? 'observed' : latest || latestWeek ? 'partial' : 'stale',
    latest,
    latestVisitGap: dailyCount === null ? null : Math.max(0, dailyAudienceTarget - dailyCount),
    previousSameWeekday,
    latestWeek: latestWeek && { ...latestWeek, averagePerDay: latestWeek.visits.count / 7 },
    previousWeek: previousWeek && { ...previousWeek, averagePerDay: previousWeek.visits.count / 7 },
    weeklyChangeFraction: latestWeek && previousWeek && previousWeek.visits.count > 0
      ? latestWeek.visits.count / previousWeek.visits.count - 1
      : null,
    weeklyChangeUsesRoundedTotals: [latestWeek, previousWeek].some(week => (week?.visits.resolution ?? 1) > 1),
  };
}
