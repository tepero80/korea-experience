import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeCloudflareVisits } from '../scripts/reporting/cloudflare-visits';

const now = new Date('2026-11-23T22:15:00Z');
const latest = { startDate: '2026-11-20', endDate: '2026-11-20', displayedVisits: '475' };
const priorDay = { startDate: '2026-11-13', endDate: '2026-11-13', displayedVisits: '500' };
const week = { startDate: '2026-11-14', endDate: '2026-11-20', displayedVisits: '1.25k' };
const priorWeek = { startDate: '2026-11-07', endDate: '2026-11-13', displayedVisits: '2.50k' };
const snapshot = {
  source: 'Cloudflare Web Analytics dashboard', hostname: 'koreaexperience.com',
  timeZone: 'Asia/Seoul', excludeBots: true, observedAt: '2026-11-23T22:00:00Z',
  observations: [latest, priorDay, week, priorWeek],
};

test('uses only the four settled Korean ranges and preserves dashboard rounding', () => {
  const result = summarizeCloudflareVisits(snapshot, now);
  assert.equal(result.status, 'observed');
  assert.equal(result.latest?.visits.count, 475);
  assert.equal(result.latestVisitGap, 9_525);
  assert.equal(result.latestWeek?.visits.display, '1.25k');
  assert.equal(result.latestWeek?.visits.resolution, 10);
  assert.equal(result.weeklyChangeFraction, -0.5);
  assert.equal(result.weeklyChangeUsesRoundedTotals, true);
});

test('rejects imported host, bot or day mismatches and duplicate aggregates', () => {
  for (const evidence of [
    { ...snapshot, hostname: 'www.koreaexperience.com' },
    { ...snapshot, excludeBots: false },
    { ...snapshot, timeZone: 'UTC' },
    { ...snapshot, observations: [latest, latest] },
    { ...snapshot, observations: [{ ...latest, endDate: '2026-11-21' }] },
    { ...snapshot, observations: [{ ...latest, displayedVisits: 'n/a' }] },
  ]) assert.equal(summarizeCloudflareVisits(evidence, now).status, 'unavailable');
});

test('no snapshot, partial and stale remain distinct; explicit zero remains observed', () => {
  assert.equal(summarizeCloudflareVisits(undefined, now).status, 'unavailable');
  const result = summarizeCloudflareVisits({ ...snapshot, observations: [{ ...latest, displayedVisits: '0' }] }, now);
  assert.equal(result.status, 'partial');
  assert.equal(result.latest?.visits.count, 0);
  assert.equal(result.weeklyChangeFraction, null);
  const stale = summarizeCloudflareVisits(snapshot, new Date('2026-11-24T22:15:00Z'));
  assert.equal(stale.status, 'stale');
  assert.equal(stale.latest, null);
  assert.equal(stale.observedAt, snapshot.observedAt);
  const weekLater = summarizeCloudflareVisits(snapshot, new Date('2026-11-30T22:15:00Z'));
  assert.equal(weekLater.status, 'stale');
  assert.equal(weekLater.previousWeek?.visits.display, '1.25k');
});
