import assert from 'node:assert/strict';
import test from 'node:test';
import type { ReportResult } from '../scripts/reporting/client';
import {
  inspectionObservation,
  pendingInspections,
} from '../scripts/reporting/inspection-checkpoints';

const url = 'https://koreaexperience.com/blog/test-guide';
const tracked = { id: 'guide:test', url, checksDue: ['2026-11-28', '2026-12-01', '2026-12-08'] };
const indexed: ReportResult = {
  name: 'Fixture inspection',
  status: 'observed',
  data: {
    inspectionResult: {
      indexStatusResult: { verdict: 'PASS', coverageState: 'Submitted and indexed' },
    },
  },
};

test('duplicate tracking entries retain their dates and one request per URL', () => {
  const previous = { ...tracked, checksDue: ['2026-11-14', '2026-11-28'] };
  const today = '2026-12-01';
  assert.deepEqual(pendingInspections([previous, tracked], {}, today, false)[0].outstanding, [
    '2026-11-14',
    '2026-11-28',
    '2026-12-01',
  ]);
  assert.equal(pendingInspections([previous, tracked], {}, today, true).length, 1);
});

test('one late reading leaves future checks open and discloses missed dates', () => {
  const [work] = pendingInspections([tracked], {}, '2026-12-01', false);
  const reading = inspectionObservation(work, undefined, indexed, '2026-12-01T02:00:00Z', false);
  assert.deepEqual(reading.checkedFor, ['2026-12-01']);
  assert.deepEqual(reading.missedCheckpoints, ['2026-11-28']);
  assert.equal(pendingInspections([tracked], { [url]: reading }, '2026-12-01', false).length, 0);
  assert.deepEqual(
    pendingInspections([tracked], { [url]: reading }, '2026-12-08', false)[0].outstanding,
    ['2026-12-08'],
  );
});

test('a response with no inspection status preserves earlier evidence and leaves the due date open', () => {
  const [before] = pendingInspections([tracked], {}, '2026-11-28', false);
  const prior = inspectionObservation(before, undefined, indexed, '2026-11-28T02:00:00Z', false);
  const [later] = pendingInspections([tracked], { [url]: prior }, '2026-12-01', false);
  const blank: ReportResult = { name: 'Empty response', status: 'observed', data: {} };
  const failure = inspectionObservation(later, prior, blank, '2026-12-01T02:00:00Z', false);
  assert.equal(failure.result.status, 'unavailable');
  assert.equal(failure.crawlEvidence?.state, 'unavailable');
  assert.equal(failure.lastSuccessAt, prior.lastSuccessAt);
  assert.deepEqual(failure.previousSuccessfulResult, indexed);
  assert.deepEqual(failure.checkedFor, ['2026-11-28']);
  assert.deepEqual(
    pendingInspections([tracked], { [url]: failure }, '2026-12-01', false)[0].outstanding,
    ['2026-12-01'],
  );
});

test('an indexed older crawl does not verify the latest deployment even with duplicate tracking rows', () => {
  const recent = { commit: 'latest', verifiedAt: '2026-11-24T08:00:00Z' };
  const newer = { ...tracked, substantiveUpdates: [recent] };
  const older = { ...tracked, releaseCommit: 'original', verifiedPublicAt: '2026-10-01T00:00:00Z' };
  const [work] = pendingInspections([newer, older], {}, '2026-12-01', false);
  const response: ReportResult = {
    ...indexed,
    data: {
      inspectionResult: {
        indexStatusResult: {
          verdict: 'PASS',
          coverageState: 'Submitted and indexed',
          lastCrawlTime: '2026-11-24T07:59:59Z',
        },
      },
    },
  };
  const reading = inspectionObservation(work, undefined, response, '2026-12-01T02:00:00Z', false);
  assert.deepEqual(reading.crawlEvidence, {
    state: 'no-post-release-crawl-evidence',
    revision: recent,
    indexed: true,
    lastCrawlAt: '2026-11-24T07:59:59Z',
  });
  assert.deepEqual(reading.checkedFor, ['2026-12-01']);
});

test('a crawl after the deployment separates indexed from excluded and unspecified coverage', () => {
  const revision = { commit: 'rewrite', verifiedAt: '2026-11-24T08:00:00Z' };
  const [work] = pendingInspections(
    [{ ...tracked, substantiveUpdates: [revision] }],
    {},
    '2026-12-01',
    false,
  );
  for (const [verdict, expected] of [
    ['PASS', 'post-release-crawl-indexed'],
    ['NEUTRAL', 'post-release-crawl-unindexed'],
    ['VERDICT_UNSPECIFIED', 'post-release-crawl-index-status-unknown'],
  ]) {
    const response: ReportResult = {
      ...indexed,
      data: {
        inspectionResult: {
          indexStatusResult: {
            verdict,
            coverageState: 'Present in inspection response',
            lastCrawlTime: '2026-11-25T02:00:00.512Z',
          },
        },
      },
    };
    const reading = inspectionObservation(work, undefined, response, '2026-12-01T02:00:00Z', false);
    assert.equal(reading.crawlEvidence?.state, expected);
  }
});
