import { adsenseReportUrl, gaReport, readOfficial, type ReportResult } from './client';

const dayMs = 86_400_000;
const week = 7;
const period = 28;
const visitorsGoal = 10_000;
const revenueGoalUsd = 100;
const analyticsZone = 'Asia/Seoul';
const adsZone = 'America/Los_Angeles';

function settledDates(now: Date, timeZone: string) {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  // The report end has three complete local dates between it and today.
  const end = Date.parse(today + 'T00:00:00Z') - 4 * dayMs;
  return Array.from({ length: period }, (_, index) =>
    new Date(end - (period - 1 - index) * dayMs).toISOString().slice(0, 10),
  );
}

function numberFromProvider(value: unknown, tally = false) {
  if (typeof value !== 'string' || !/^\d+(?:\.\d+)?$/.test(value)) return null;
  const parsed = Number(value);
  return (tally ? Number.isSafeInteger(parsed) : Number.isFinite(parsed)) ? parsed : null;
}

type DailyValue = { date: string; value: number | null; pageViews?: number | null };
type Coverage = 'observed' | 'partial' | 'unavailable';

function goalsForDays(
  dates: string[],
  goal: number,
  report: ReportResult,
  records: DailyValue[],
  qualified: boolean,
) {
  const byDate = new Map(records.map((item) => [item.date, item]));
  const valid =
    qualified &&
    byDate.size === records.length &&
    records.every((item) => dates.includes(item.date));
  const days = dates.map((date) => {
    const row = valid ? byDate.get(date) : undefined;
    const value = row?.value ?? null;
    return {
      date,
      value,
      pageViews: row?.pageViews,
      gap: value === null ? null : Math.max(0, goal - value),
      goalStatus: value === null ? 'unknown' : value >= goal ? 'reached' : 'below',
    };
  });
  const status: Coverage =
    report.status === 'unavailable'
      ? 'unavailable'
      : days.every((item) => item.value !== null)
        ? 'observed'
        : 'partial';
  const latest = days.at(-1)!;
  const previousSameWeekday = days.at(-(week + 1))!;
  const summarizeWeek = (entries: typeof days) => {
    const average = entries.every((item) => item.value !== null)
      ? entries.reduce((sum, item) => sum + item.value!, 0) / entries.length
      : null;
    const views = entries.every((item) => typeof item.pageViews === 'number')
      ? entries.reduce((sum, item) => sum + item.pageViews!, 0)
      : null;
    return {
      startDate: entries[0].date,
      endDate: entries.at(-1)!.date,
      observedDays: entries.filter((item) => item.value !== null).length,
      goalDays:
        average === null ? null : entries.filter((item) => item.goalStatus === 'reached').length,
      averagePerDay: average,
      pageRpm:
        average !== null && views !== null && views > 0
          ? Math.round(((average * entries.length * 1000) / views) * 100) / 100
          : null,
    };
  };
  const latestWeek = summarizeWeek(days.slice(-week));
  const previousWeek = summarizeWeek(days.slice(-2 * week, -week));
  return {
    goalPerDay: goal,
    status,
    days,
    latest,
    previousSameWeekday,
    sameWeekdayChange: change(previousSameWeekday.value, latest.value),
    latestWeek,
    previousWeek,
    weeklyAverageChange: change(previousWeek.averagePerDay, latestWeek.averagePerDay),
  };
}

function change(before: number | null, after: number | null) {
  return before === null || after === null ? null : after - before;
}

function visitorsForDays(dates: string[], report: ReportResult) {
  const metadata = report.data?.metadata;
  const qualified =
    report.status === 'observed' &&
    !report.truncated &&
    metadata?.timeZone === analyticsZone &&
    !metadata.subjectToThresholding &&
    !metadata.dataLossFromOtherRow &&
    !metadata.samplingMetadatas?.length;
  const records: DailyValue[] = (report.data?.rows ?? []).map(
    (row: { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] }) => ({
      date: (row.dimensionValues?.[0]?.value ?? '').replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3'),
      value: numberFromProvider(row.metricValues?.[0]?.value, true),
    }),
  );
  return goalsForDays(dates, visitorsGoal, report, records, qualified);
}

function revenueForDays(dates: string[], report: ReportResult) {
  const headers: { name: string; currencyCode?: string }[] = report.data?.headers ?? [];
  const expected = ['DATE', 'DOMAIN_NAME', 'ESTIMATED_EARNINGS', 'PAGE_VIEWS', 'PAGE_VIEWS_RPM'];
  const rows: { cells?: { value?: string }[] }[] = report.data?.rows ?? [];
  const qualified =
    report.status === 'observed' &&
    !report.truncated &&
    headers.length === expected.length &&
    headers.every((header, index) => header.name === expected[index]) &&
    headers[2]?.currencyCode === 'USD' &&
    headers[4]?.currencyCode === 'USD' &&
    rows.every((row) => row.cells?.[1]?.value === 'koreaexperience.com');
  const records = rows.map(({ cells }) => ({
    date: cells?.[0]?.value ?? '',
    value: numberFromProvider(cells?.[2]?.value),
    pageViews: numberFromProvider(cells?.[3]?.value, true),
  }));
  return goalsForDays(dates, revenueGoalUsd, report, records, qualified);
}

export async function observeGrowthGoals(
  now: Date,
  tokens: { ga?: string; ads?: string },
  transport: typeof fetch = fetch,
) {
  const gaDays = settledDates(now, analyticsZone);
  const adsDays = settledDates(now, adsZone);
  const gaWindow = { startDate: gaDays[0], endDate: gaDays.at(-1)! };
  const adsWindow = { startDate: adsDays[0], endDate: adsDays.at(-1)! };
  const [ga, ads] = await Promise.all([
    gaReport('GA4 daily active users', gaWindow, ['date'], ['activeUsers'], tokens.ga, transport),
    readOfficial(
      'AdSense daily domain revenue',
      adsenseReportUrl(adsWindow, 'day'),
      tokens.ads,
      undefined,
      transport,
    ),
  ]);
  if (ads.status === 'observed') {
    ads.truncated = Number(ads.data?.totalMatchedRows ?? 0) > (ads.data?.rows?.length ?? 0);
  }
  return {
    visitors: {
      ...visitorsForDays(gaDays, ga),
      timeZone: analyticsZone,
      window: gaWindow,
      scope:
        'GA4 daily active users on the exact apex hostname. Consent and analytics coverage limit this estimate. The weekly average describes the mean daily audience.',
      report: ga,
    },
    revenue: {
      ...revenueForDays(adsDays, ads),
      timeZone: adsZone,
      window: adsWindow,
      scope: 'AdSense estimated USD earnings on the apex domain, grouped by Google reporting date.',
      report: ads,
    },
  };
}
