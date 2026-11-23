import test from 'node:test';
import assert from 'node:assert/strict';
import { observeGrowthGoals } from '../scripts/reporting/growth-goals';

const observationTime = new Date('2026-11-23T15:10:00Z');
const tokens = { ga: 'fixture', ads: 'fixture' };
const adsHeaders = [
  { name: 'DATE' },
  { name: 'DOMAIN_NAME' },
  { name: 'ESTIMATED_EARNINGS', currencyCode: 'USD' },
  { name: 'PAGE_VIEWS' },
  { name: 'PAGE_VIEWS_RPM', currencyCode: 'USD' },
];

function seriesEndingOn(endDate: string, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(`${endDate}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + i - count + 1);
    return date.toISOString().slice(0, 10);
  });
}

function analytics(
  rows: { date: string; users: string }[],
  limitations: Record<string, unknown> = {},
) {
  return {
    rowCount: rows.length,
    metadata: { timeZone: 'Asia/Seoul', ...limitations },
    rows: rows.map(({ date, users }) => ({
      dimensionValues: [{ value: date.replaceAll('-', '') }],
      metricValues: [{ value: users }],
    })),
  };
}

function adsDay(date: string, earnings: string, views = '1000') {
  return {
    cells: [date, 'koreaexperience.com', earnings, views, '399'].map((value) => ({ value })),
  };
}

test('growth goals ask for mature provider-specific day totals and compare compatible periods', async () => {
  const gaDates = seriesEndingOn('2026-11-20', 28);
  const adsDates = seriesEndingOn('2026-11-19', 28);
  const transport = (async (input: RequestInfo | URL, options?: RequestInit) => {
    const url = new URL(String(input));
    if (url.origin === 'https://analyticsdata.googleapis.com') {
      const body = JSON.parse(String(options?.body));
      assert.deepEqual(body.dateRanges, [{ startDate: gaDates[0], endDate: '2026-11-20' }]);
      assert.deepEqual(body.dimensions, [{ name: 'date' }]);
      assert.deepEqual(body.metrics, [{ name: 'activeUsers' }]);
      assert.equal(body.dimensionFilter.filter.stringFilter.value, 'koreaexperience.com');
      return Response.json(
        analytics(
          gaDates.map((date, index) => ({
            date,
            users: index < 21 ? '8000' : '10000',
          })),
        ),
      );
    }
    assert.equal(url.origin, 'https://adsense.googleapis.com');
    assert.deepEqual(url.searchParams.getAll('dimensions'), ['DATE', 'DOMAIN_NAME']);
    assert.deepEqual(url.searchParams.getAll('filters'), ['DOMAIN_NAME==koreaexperience.com']);
    assert.equal(url.searchParams.get('reportingTimeZone'), 'GOOGLE_TIME_ZONE');
    assert.equal(url.searchParams.get('currencyCode'), 'USD');
    assert.equal(url.searchParams.get('endDate.day'), '19');
    return Response.json({
      headers: adsHeaders,
      totalMatchedRows: '28',
      rows: adsDates.map((date, index) =>
        index < 21 ? adsDay(date, '50') : adsDay(date, '80', '2000'),
      ),
    });
  }) as typeof fetch;
  const { visitors, revenue } = await observeGrowthGoals(observationTime, tokens, transport);
  assert.equal(visitors.status, 'observed');
  assert.equal(visitors.timeZone, 'Asia/Seoul');
  assert.equal(visitors.latest.goalStatus, 'reached');
  assert.equal(visitors.latest.gap, 0);
  assert.equal(visitors.latestWeek.goalDays, 7);
  assert.equal(visitors.latestWeek.averagePerDay, 10000);
  assert.equal(visitors.weeklyAverageChange, 2000);
  assert.equal(visitors.sameWeekdayChange, 2000);
  assert.equal(revenue.status, 'observed');
  assert.equal(revenue.timeZone, 'America/Los_Angeles');
  assert.equal(revenue.latest.goalStatus, 'below');
  assert.equal(revenue.latest.gap, 20);
  assert.equal(revenue.latestWeek.pageRpm, 40);
  assert.equal(revenue.previousWeek.pageRpm, 50);
  assert.equal(revenue.weeklyAverageChange, 30);
});

test('explicit zero remains observed, missing dates remain unknown, and 429 never becomes zero revenue', async () => {
  const transport = (async (input: RequestInfo | URL) =>
    String(input).includes('analyticsdata.googleapis.com')
      ? Response.json(analytics([{ date: '2026-11-20', users: '0' }]))
      : new Response(null, { status: 429 })) as typeof fetch;
  const { visitors, revenue } = await observeGrowthGoals(observationTime, tokens, transport);
  assert.equal(visitors.status, 'partial');
  assert.equal(visitors.latest.value, 0);
  assert.equal(visitors.previousSameWeekday.value, null);
  assert.equal(visitors.sameWeekdayChange, null);
  assert.equal(visitors.latestWeek.observedDays, 1);
  assert.equal(visitors.latestWeek.averagePerDay, null);
  assert.equal(revenue.status, 'unavailable');
  assert.equal(revenue.report.httpStatus, 429);
  assert.equal(revenue.latest.value, null);
});

test('counting targets is suppressed for thresholded GA4 and ambiguous AdSense daily rows', async () => {
  const transport = (async (input: RequestInfo | URL) =>
    String(input).includes('analyticsdata.googleapis.com')
      ? Response.json(
          analytics([{ date: '2026-11-20', users: '15000' }], { subjectToThresholding: true }),
        )
      : Response.json({
          headers: adsHeaders,
          rows: [adsDay('2026-11-19', '120'), adsDay('2026-11-19', '200')],
        })) as typeof fetch;
  const { visitors, revenue } = await observeGrowthGoals(observationTime, tokens, transport);
  assert.equal(visitors.latest.goalStatus, 'unknown');
  assert.equal(revenue.latest.goalStatus, 'unknown');
  assert.equal(visitors.status, 'partial');
  assert.equal(revenue.status, 'partial');
});
