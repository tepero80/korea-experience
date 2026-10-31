import test from 'node:test';
import assert from 'node:assert/strict';
import {
  reportingWindows,
  contentForReportUrl,
  assertReportingEndpoint,
  gaHostFilter,
  assertReportingRequest,
} from '../scripts/reporting/report-policy';

test('report comparisons use two complete adjacent28day windows with a freshness buffer', () => {
  const periods = reportingWindows(new Date('2026-10-31T05:00:00Z'));
  assert.deepEqual(periods, {
    current: { startDate: '2026-10-01', endDate: '2026-10-28' },
    previous: { startDate: '2026-09-03', endDate: '2026-09-30' },
  });
  for (const date of ['2028-03-02T00:00:00Z', '2027-01-02T00:00:00Z']) {
    const windows = reportingWindows(new Date(date));
    for (const p of Object.values(windows))
      assert.equal((Date.parse(p.endDate) - Date.parse(p.startDate)) / 86400000 + 1, 28);
    assert.equal(
      Date.parse(windows.current.startDate) - Date.parse(windows.previous.endDate),
      86400000,
    );
  }
});
test('report URL normalization joins public IDs without treating missing rows or other sites as zero', () => {
  const catalog = [{ id: 'stable-guide', slug: 'arrival-guide' }];
  assert.equal(
    contentForReportUrl(
      'https://koreaexperience.com/blog/arrival-guide/?utm_source=sample#map',
      catalog,
    ),
    'stable-guide',
  );
  assert.equal(
    contentForReportUrl('/blog/arrival-guide?private=redacted', catalog),
    'stable-guide',
  );
  for (const input of [
    'https://another.example/blog/arrival-guide',
    '/blog/unknown',
    '/community/shared/token',
    'javascript:alert(1)',
  ])
    assert.equal(contentForReportUrl(input, catalog), null);
});
test('OAuth-wide scopes cannot redirect the report code to another property or arbitrary endpoint', () => {
  assert.doesNotThrow(() =>
    assertReportingEndpoint(
      'https://analyticsdata.googleapis.com/v1beta/properties/522514411:runReport',
    ),
  );
  assert.doesNotThrow(() =>
    assertReportingEndpoint(
      'https://adsense.googleapis.com/v2/accounts/pub-7793293419727384/reports:generate?currencyCode=USD',
    ),
  );
  for (const url of [
    'https://analyticsdata.googleapis.com/v1beta/properties/123:runReport',
    'https://untrusted.example/',
    'http://adsense.googleapis.com/v2/accounts/pub-7793293419727384',
    'https://adsense.googleapis.com/v2/accounts/pub-123/reports:generate',
  ])
    assert.throws(() => assertReportingEndpoint(url));
  assert.equal(gaHostFilter().filter.stringFilter.value, 'koreaexperience.com');
  assert.throws(() =>
    assertReportingRequest('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      siteUrl: 'sc-domain:other.example',
      inspectionUrl: 'https://other.example/',
    }),
  );
  assert.throws(() =>
    assertReportingRequest('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      siteUrl: 'sc-domain:koreaexperience.com',
      inspectionUrl: 'https://other.example/',
    }),
  );
  assert.doesNotThrow(() =>
    assertReportingRequest('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      siteUrl: 'sc-domain:koreaexperience.com',
      inspectionUrl: 'https://koreaexperience.com/blog/arrival-guide',
    }),
  );
  assert.throws(() =>
    assertReportingRequest(
      'https://analyticsdata.googleapis.com/v1beta/properties/522514411:runReport',
      {},
    ),
  );
  assert.throws(() =>
    assertReportingRequest(
      'https://adsense.googleapis.com/v2/accounts/pub-7793293419727384/reports:generate?filters=DOMAIN_NAME%3D%3Dother.example',
    ),
  );
});
