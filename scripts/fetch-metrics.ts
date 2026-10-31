import fs from 'node:fs';
import { REPORTING_TARGETS, reportingAccessToken, safeReportingError } from './reporting/auth';
import { reportingWindows, contentForReportUrl } from './reporting/report-policy';
import {
  gscReport,
  gaReport,
  adsenseReportUrl,
  readOfficial,
  type ReportResult,
} from './reporting/client';

async function main() {
  const now = new Date(),
    windows = reportingWindows(now);
  let offlineToken: string | null = null,
    authorization: unknown = { status: 'unavailable', reason: 'No persisted reporting grant.' };
  try {
    offlineToken = await reportingAccessToken();
    if (offlineToken)
      authorization = {
        status: 'observed',
        source: 'Windows-protected offline OAuth refresh credentials; no token output',
      };
  } catch (error) {
    authorization = safeReportingError(error);
  }
  if (process.env.GA4_PROPERTY_ID && process.env.GA4_PROPERTY_ID !== REPORTING_TARGETS.property)
    throw Error('GA4 property is outside the approved reporting resource.');
  if (process.env.ADSENSE_ACCOUNT && process.env.ADSENSE_ACCOUNT !== REPORTING_TARGETS.adsense)
    throw Error('AdSense account is outside the approved reporting resource.');
  const tokens = {
    gsc: offlineToken || process.env.GSC_ACCESS_TOKEN,
    ga: offlineToken || process.env.GA4_ACCESS_TOKEN,
    ads: offlineToken || process.env.ADSENSE_ACCESS_TOKEN,
  };
  const catalog: { id: string; slug: string }[] = JSON.parse(
    fs.readFileSync('public/content-catalog.json', 'utf8'),
  );
  const periods: Record<string, ReportResult[]> = {};
  for (const [period, dates] of Object.entries(windows)) {
    const results = await Promise.all([
      gscReport('GSC site totals', dates, [], tokens.gsc),
      gscReport('GSC pages', dates, ['page'], tokens.gsc),
      gscReport('GSC queries by country/device', dates, ['query', 'country', 'device'], tokens.gsc),
      gaReport(
        'GA4 landing/source/country/device',
        dates,
        [
          'hostName',
          'landingPagePlusQueryString',
          'sessionSourceMedium',
          'country',
          'deviceCategory',
        ],
        ['sessions', 'engagedSessions', 'totalRevenue'],
        tokens.ga,
      ),
      gaReport(
        'GA4 public events',
        dates,
        ['hostName', 'eventName', 'pagePath'],
        ['eventCount', 'totalUsers'],
        tokens.ga,
      ),
      readOfficial('AdSense site revenue', adsenseReportUrl(dates), tokens.ads),
    ]);
    for (const result of results) {
      if (result.name === 'AdSense site revenue' && result.status === 'observed') {
        result.truncated =
          Number(result.data?.totalMatchedRows || 0) > (result.data?.rows?.length || 0);
        result.coverage =
          'Apex domain only; USD; explicitly GOOGLE_TIME_ZONE (America/Los_Angeles). Account-home browser cards may use a different timezone/scope.';
      }
    }
    periods[period] = results;
  }
  const policy = await readOfficial(
    'AdSense policy issues',
    `https://adsense.googleapis.com/v2/${REPORTING_TARGETS.adsense}/policyIssues`,
    tokens.ads,
  );
  const alerts = await readOfficial(
    'AdSense account alerts',
    `https://adsense.googleapis.com/v2/${REPORTING_TARGETS.adsense}/alerts`,
    tokens.ads,
  );
  const normalizedPages = Object.fromEntries(
    Object.entries(periods).map(([period, results]) => [
      period,
      {
        gsc:
          results.find((r) => r.name === 'GSC pages')?.status === 'observed'
            ? results
                .find((r) => r.name === 'GSC pages')!
                .data?.rows?.map((r: any) => ({
                  contentId: contentForReportUrl(r.keys?.[0] || '', catalog),
                  url: r.keys?.[0],
                  clicks: r.clicks,
                  impressions: r.impressions,
                  ctr: r.ctr,
                  position: r.position,
                })) || []
            : null,
        ga4:
          results.find((r) => r.name === 'GA4 landing/source/country/device')?.status === 'observed'
            ? results
                .find((r) => r.name === 'GA4 landing/source/country/device')!
                .data?.rows?.map((r: any) => ({
                  contentId: contentForReportUrl(r.dimensionValues?.[1]?.value || '', catalog),
                  dimensions: r.dimensionValues,
                  metrics: r.metricValues,
                })) || []
            : null,
      },
    ]),
  );
  const report = {
    at: now.toISOString(),
    windows,
    resources: REPORTING_TARGETS,
    authorization,
    scope:
      'Two adjacent28day windows with a3day freshness buffer. Source timezones/filters/thresholding/coverage remain separate; browser snapshots are not silently combined.',
    privacy:
      'Private raw query/URL data: never commit. Missing rows and unavailable reports never imply zero traffic, no links or retirement eligibility.',
    periods,
    normalizedPages,
    policy,
    alerts,
  };
  const folder = `.private/reports/${now.toISOString().slice(0, 10)}`;
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(
    `${folder}/metrics-${now.toISOString().replace(/[:.]/g, '-')}.json`,
    JSON.stringify(report, null, 2),
  );
  fs.writeFileSync('.private/reports/metrics-latest.json', JSON.stringify(report, null, 2));
  for (const [period, results] of Object.entries(periods))
    for (const result of results)
      console.log(
        `${period} | ${result.name}: ${result.status}${result.truncated ? ' (partial)' : ''}`,
      );
  console.log(`Policy: ${policy.status}; alerts: ${alerts.status}. Raw data saved privately.`);
}
main().catch(() => {
  console.error('Reporting execution failed; no credentials or raw provider errors are printed.');
  process.exitCode = 1;
});
