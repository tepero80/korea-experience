import { gaReport, gscReport, type ReportResult, type WindowDates } from './client';

const windows = ['initial', 'followup'] as const;
const day = 86_400_000;
const gaMetrics = ['sessions', 'engagedSessions', 'activeUsers', 'newUsers', 'screenPageViews'];

export type GrowthPlan = {
  verifiedReleaseAt: string;
  comparison: [WindowDates, WindowDates];
  focusPaths: string[];
};

type WindowObservation =
  | { status: 'pending'; earliestDate: string; report: null }
  | { status: ReportResult['status']; earliestDate: string; report: ReportResult };

function sourceDate(at: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(at);
}

function parseDay(value: string) {
  const at = Date.parse(value + 'T00:00:00Z');
  if (!Number.isFinite(at) || new Date(at).toISOString().slice(0, 10) !== value)
    throw Error('Invalid growth comparison date.');
  return at;
}

function validate(plan: GrowthPlan) {
  if (!Array.isArray(plan.comparison) || plan.comparison.length !== 2)
    throw Error('Growth comparison requires exactly two periods.');
  const release = new Date(plan.verifiedReleaseAt);
  const [first, second] = plan.comparison;
  const firstStart = parseDay(first.startDate);
  const firstEnd = parseDay(first.endDate);
  const secondStart = parseDay(second.startDate);
  const secondEnd = parseDay(second.endDate);
  const length = firstEnd - firstStart + day;
  if (
    length <= 0 ||
    length % (7 * day) ||
    secondEnd - secondStart + day !== length ||
    secondStart !== firstEnd + day ||
    !['Asia/Seoul', 'America/Los_Angeles'].every(
      (zone) => first.startDate > sourceDate(release, zone),
    )
  ) {
    throw Error('Growth comparison requires adjacent equal full weeks after deployment.');
  }
  if (
    !Array.isArray(plan.focusPaths) ||
    plan.focusPaths.some((path) => typeof path !== 'string' || !/^\/blog\/[a-z0-9-]+$/.test(path))
  )
    throw Error('Growth comparison accepts canonical guide paths only.');
}

async function observe(
  dates: WindowDates,
  now: Date,
  zone: string,
  load: () => Promise<ReportResult>,
): Promise<WindowObservation> {
  // Wait for three full local dates after the last date in the window.
  const earliestDate = new Date(parseDay(dates.endDate) + 4 * day).toISOString().slice(0, 10);
  if (sourceDate(now, zone) < earliestDate) {
    return { status: 'pending', earliestDate, report: null };
  }
  const report = await load();
  return { status: report.status, earliestDate, report };
}

function metric(value: unknown) {
  if ((typeof value !== 'string' && typeof value !== 'number') || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function delta(before: number | null, after: number | null) {
  return before === null || after === null ? null : after - before;
}

export async function compareGrowth(
  plan: GrowthPlan,
  now: Date,
  tokens: { ga?: string; gsc?: string },
  transport: typeof fetch = fetch,
) {
  validate(plan);
  const gscZone = 'America/Los_Angeles';
  const gaZone = 'Asia/Seoul';
  const observed = await Promise.all(
    plan.comparison.map(async (dates, index) => {
      const [gsc, ga4, landing] = await Promise.all([
        observe(dates, now, gscZone, () =>
          gscReport('Growth Web totals', dates, [], tokens.gsc, transport),
        ),
        observe(dates, now, gaZone, () =>
          gaReport('Growth apex totals', dates, [], gaMetrics, tokens.ga, transport),
        ),
        observe(dates, now, gscZone, async () => {
          const report = await gscReport(
            'Growth Web landing pages',
            dates,
            ['page'],
            tokens.gsc,
            transport,
          );
          const rows = report.data?.rows;
          if (report.status === 'observed' && Array.isArray(rows)) {
            const targets = plan.focusPaths.map((path) => 'https://koreaexperience.com' + path);
            return {
              ...report,
              data: { rows: rows.filter((row) => targets.includes(row.keys?.[0])) },
            };
          }
          return report;
        }),
      ]);
      const searchRow = gsc.report?.data?.rows?.[0];
      const analyticsRow = ga4.report?.data?.rows?.[0]?.metricValues;
      return {
        window: windows[index],
        dates,
        gsc,
        ga4,
        landing,
        clicks: metric(searchRow?.clicks),
        impressions: metric(searchRow?.impressions),
        sessions: metric(analyticsRow?.[0]?.value),
        engagedSessions: metric(analyticsRow?.[1]?.value),
      };
    }),
  );
  const [initial, followup] = observed;
  const changes = {
    gscClicks: delta(initial.clicks, followup.clicks),
    gscImpressions: delta(initial.impressions, followup.impressions),
    ga4Sessions: delta(initial.sessions, followup.sessions),
    ga4EngagedSessions: delta(initial.engagedSessions, followup.engagedSessions),
  };
  const reads = observed.flatMap(({ gsc, ga4, landing }) => [gsc, ga4, landing]);
  return {
    status: reads.some((item) => item.status === 'pending')
      ? 'awaiting-data'
      : reads.every((item) => item.report?.status === 'observed' && !item.report.truncated) &&
          Object.values(changes).every((value) => value !== null)
        ? 'comparison-available'
        : 'incomplete',
    verifiedReleaseAt: plan.verifiedReleaseAt,
    timezones: { gsc: gscZone, ga4: gaZone },
    periods: observed,
    changes,
    interpretation:
      'Separate finalized organic search from consented analytics. Missing rows are unknown. A change alone does not establish sustained growth or causality.',
  };
}
