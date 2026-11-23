import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compareGrowth, type GrowthPlan } from '../scripts/reporting/growth-comparison';

const plan: GrowthPlan = {
  verifiedReleaseAt: '2026-11-23T06:14:44Z',
  comparison: [
    { startDate: '2026-11-24', endDate: '2026-11-30' },
    { startDate: '2026-12-01', endDate: '2026-12-07' },
  ],
  focusPaths: ['/blog/incheon-airport-survival-guide-2026'],
};

test('fixed growth windows wait independently for three full days in each reporting timezone', async () => {
  const calls: URL[] = [];
  const transport: typeof fetch = async (input) => {
    calls.push(new URL(String(input)));
    return Response.json({});
  };
  const tokens = { ga: 'fixture', gsc: 'fixture' };
  const early = await compareGrowth(plan, new Date('2026-11-23T06:35:00Z'), tokens, transport);
  assert.equal(early.status, 'awaiting-data');
  assert.equal(calls.length, 0);
  assert.equal(early.changes.gscClicks, null);
  const whilePacificWaits = await compareGrowth(
    plan,
    new Date('2026-12-04T04:30:00Z'),
    tokens,
    transport,
  );
  assert.equal(calls.length, 1);
  assert.equal(calls[0].hostname, 'analyticsdata.googleapis.com');
  assert.equal(whilePacificWaits.periods[0].gsc.status, 'pending');
  assert.equal(whilePacificWaits.periods[0].ga4.status, 'observed');
  assert.equal(whilePacificWaits.periods[1].ga4.status, 'pending');
});

test('growth observations separate final search and apex analytics and keep an empty window unknown', async () => {
  const transport: typeof fetch = async (input, init) => {
    const url = new URL(String(input));
    const request = JSON.parse(String(init?.body));
    if (url.hostname === 'analyticsdata.googleapis.com') {
      assert.equal(request.dimensionFilter.filter.stringFilter.value, 'koreaexperience.com');
      if (request.dateRanges[0].startDate === '2026-12-01') return Response.json({ rowCount: 0 });
      return Response.json({
        rowCount: 1,
        rows: [{ metricValues: [{ value: '5' }, { value: '3' }] }],
      });
    }
    assert.equal(request.dataState, 'final');
    assert.equal(request.type, 'web');
    const row = { clicks: request.startDate === '2026-12-01' ? 4 : 2, impressions: 15 };
    return Response.json({
      rows: request.dimensions.includes('page')
        ? [
            { ...row, keys: ['https://koreaexperience.com' + plan.focusPaths[0]] },
            { ...row, keys: ['https://koreaexperience.com/blog/another-guide'] },
          ]
        : [row],
    });
  };
  const observation = await compareGrowth(
    plan,
    new Date('2026-12-11T10:00:00Z'),
    { ga: 'fixture', gsc: 'fixture' },
    transport,
  );
  assert.equal(observation.status, 'incomplete');
  assert.equal(observation.changes.gscClicks, 2);
  assert.equal(observation.changes.ga4Sessions, null);
  assert.equal(observation.periods[1].sessions, null);
  assert.equal(observation.periods[1].landing.report?.data?.rows.length, 1);
});

test('growth comparison rejects mismatched weeks and the deployment date', async () => {
  await assert.rejects(
    compareGrowth(
      { ...plan, verifiedReleaseAt: '2026-11-24T05:00:00Z' },
      new Date('2026-12-11T10:00:00Z'),
      {},
    ),
    /adjacent equal full weeks/,
  );
  await assert.rejects(
    compareGrowth(
      {
        ...plan,
        comparison: [plan.comparison[0], { startDate: '2026-12-01', endDate: '2026-12-06' }],
      },
      new Date('2026-12-11T10:00:00Z'),
      {},
    ),
    /adjacent equal full weeks/,
  );
});
