import test from 'node:test';
import assert from 'node:assert/strict';
import { readOfficial, gscReport, gaReport, adsenseReportUrl } from '../scripts/reporting/client';
import { retainObservedReports } from '../scripts/reporting/history';

test('an unavailable poll preserves dated successes while a genuinely empty report replaces them', () => {
  const first = retainObservedReports({}, '2026-10-30T00:00:00Z', [
    {
      key: 'pages',
      result: { name: 'pages', status: 'observed', data: { rows: [{ clicks: 3 }] } },
    },
  ]);
  const failed = retainObservedReports(first, '2026-10-31T00:00:00Z', [
    { key: 'pages', result: { name: 'pages', status: 'unavailable', httpStatus: 401 } },
  ]);
  assert.deepEqual(failed, first);
  const empty = retainObservedReports(failed, '2026-11-01T00:00:00Z', [
    { key: 'pages', result: { name: 'pages', status: 'observed', data: { rows: [] } } },
  ]);
  assert.equal(empty.pages.at, '2026-11-01T00:00:00Z');
  assert.deepEqual(empty.pages.result.data?.rows, []);
  assert.equal(first.pages.result.data?.rows.length, 1);
});

const dates = { startDate: '2026-10-01', endDate: '2026-10-28' };
test('unavailable, genuine empty and partial reporting results remain distinct without credential output', async () => {
  let called = false;
  const empty = (async () => {
    called = true;
    return Response.json({ rows: [] });
  }) as typeof fetch;
  const missing = await gscReport('pages', dates, ['page'], undefined, empty);
  assert.equal(missing.status, 'unavailable');
  assert.equal(called, false);
  assert.equal(missing.data, undefined);
  const observed = await gscReport('pages', dates, ['page'], 'fixture-token', empty);
  assert.equal(observed.status, 'observed');
  assert.deepEqual(observed.data?.rows, []);
  const limited = await readOfficial(
    'revenue',
    adsenseReportUrl(dates),
    'fixture-token',
    undefined,
    (async () => new Response('PRIVATE', { status: 429 })) as typeof fetch,
  );
  assert.equal(limited.status, 'unavailable');
  assert.equal(limited.httpStatus, 429);
  assert.equal(JSON.stringify(limited).includes('PRIVATE'), false);
  assert.equal(JSON.stringify(limited).includes('fixture-token'), false);
});
test('GA pagination retains later rows, exact hostname scope and response limitations', async () => {
  const offsets: string[] = [];
  const transport = (async (_url: unknown, options: RequestInit) => {
    const body = JSON.parse(String(options.body));
    offsets.push(body.offset);
    assert.equal(body.dimensionFilter.filter.stringFilter.value, 'koreaexperience.com');
    assert.equal(body.returnPropertyQuota, true);
    return Response.json({
      rows:
        body.offset === '0'
          ? Array(25000).fill({ metricValues: [{ value: '1' }] })
          : [{ metricValues: [{ value: '2' }] }],
      rowCount: 25001,
      metadata: { timeZone: 'Asia/Seoul', subjectToThresholding: true },
      propertyQuota: { tokensPerHour: { remaining: 900 } },
    });
  }) as typeof fetch;
  const result = await gaReport(
    'events',
    dates,
    ['hostName', 'eventName'],
    ['eventCount'],
    'fixture-token',
    transport,
  );
  assert.deepEqual(offsets, ['0', '25000']);
  assert.equal(result.data?.rows.length, 25001);
  assert.equal(result.data?.rows.at(-1).metricValues[0].value, '2');
  assert.equal(result.data?.metadata.subjectToThresholding, true);
  assert.equal(result.data?.metadata.timeZone, 'Asia/Seoul');
  assert.equal(result.truncated, false);
});
test('AdSense report is restricted to the intended domain, dates and explicit reporting timezone', () => {
  const url = new URL(adsenseReportUrl(dates));
  assert.deepEqual(url.searchParams.getAll('filters'), ['DOMAIN_NAME==koreaexperience.com']);
  assert.equal(url.searchParams.get('reportingTimeZone'), 'GOOGLE_TIME_ZONE');
  assert.equal(url.searchParams.get('startDate.month'), '10');
  assert.equal(url.searchParams.get('endDate.day'), '28');
});
