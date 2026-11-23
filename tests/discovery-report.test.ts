import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeDiscovery } from '../scripts/reporting/discovery';

const name = 'GA4 public events';
const row = (event: string, path: string, count: string) => ({
  dimensionValues: ['koreaexperience.com', event, path].map((value) => ({ value })),
  metricValues: [{ value: count }],
});

test('discovery totals aggregate event counts across article paths and keep missing rows unknown', () => {
  const result = summarizeDiscovery({
    name,
    status: 'observed',
    data: {
      rows: [
        row('home_first_trip', '/', '5'),
        row('guide_destination', '/blog/a', '3'),
        row('guide_destination', '/blog/b/', '2'),
        row('page_view', '/', '100'),
      ],
    },
  });
  assert.equal(result.status, 'observed');
  assert.equal(result.clicks.home_first_trip, 5);
  assert.equal(result.clicks.guide_destination, 5);
  assert.equal(result.clicks.home_destinations, null);
  assert.equal(result.clicks.page_view, undefined);
});

test('discovery totals preserve provider limitations and unexpected rows', () => {
  const noAccess = summarizeDiscovery({ name, status: 'unavailable', httpStatus: 401 });
  assert.equal(noAccess.status, 'unavailable');
  assert.ok(Object.values(noAccess.clicks).every((value) => value === null));
  const invalid = summarizeDiscovery({
    name,
    status: 'observed',
    data: {
      rows: [row('home_first_trip', '/blog/a', '5'), row('guide_destination', '/blog/a', 'bad')],
    },
  });
  assert.equal(invalid.status, 'partial');
  assert.equal(invalid.clicks.home_first_trip, null);
  assert.equal(invalid.clicks.guide_destination, null);

  for (const failure of [
    { truncated: true },
    { data: { metadata: { subjectToThresholding: true } } },
    { data: { metadata: { dataLossFromOtherRow: true } } },
    { data: { metadata: { samplingMetadatas: [{}] } } },
  ]) {
    assert.equal(summarizeDiscovery({ name, status: 'observed', ...failure }).status, 'partial');
  }
});
