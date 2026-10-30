import fs from 'node:fs';
const end = new Date();
end.setUTCDate(end.getUTCDate() - 3);
const start = new Date(end);
start.setUTCDate(start.getUTCDate() - 27);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const startDate = iso(start),
  endDate = iso(end);
async function read(name: string, url: string, token: string | undefined, body?: unknown) {
  if (!token) return { name, status: 'unavailable', reason: 'Read credential is not connected.' };
  try {
    const response = await fetch(url, {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok)
      return {
        name,
        status: 'unavailable',
        httpStatus: response.status,
        reason:
          response.status === 401
            ? 'Access expired or rejected.'
            : 'Official report request failed; do not treat as zero.',
      };
    return { name, status: 'observed', data: await response.json() };
  } catch (error) {
    return { name, status: 'unavailable', reason: (error as Error).name };
  }
}
async function main() {
  const gsc = await read(
    'GSC search analytics',
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent('sc-domain:koreaexperience.com')}/searchAnalytics/query`,
    process.env.GSC_ACCESS_TOKEN,
    { startDate, endDate, dimensions: ['page', 'query', 'country', 'device'], rowLimit: 25000 },
  );
  const ga = process.env.GA4_PROPERTY_ID
    ? await read(
        'GA4',
        `https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`,
        process.env.GA4_ACCESS_TOKEN,
        {
          dateRanges: [{ startDate, endDate }],
          dimensions: [
            { name: 'landingPagePlusQueryString' },
            { name: 'sessionSourceMedium' },
            { name: 'country' },
            { name: 'deviceCategory' },
          ],
          metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }, { name: 'totalRevenue' }],
          limit: 10000,
        },
      )
    : { name: 'GA4', status: 'unavailable', reason: 'Property ID is not configured.' };
  const account = process.env.ADSENSE_ACCOUNT || 'accounts/pub-7793293419727384';
  if (!/^accounts\/pub-\d+$/.test(account)) throw Error('Invalid AdSense account resource.');
  const params = new URLSearchParams({
    dateRange: 'CUSTOM',
    'startDate.year': String(start.getUTCFullYear()),
    'startDate.month': String(start.getUTCMonth() + 1),
    'startDate.day': String(start.getUTCDate()),
    'endDate.year': String(end.getUTCFullYear()),
    'endDate.month': String(end.getUTCMonth() + 1),
    'endDate.day': String(end.getUTCDate()),
    currencyCode: 'USD',
  });
  for (const value of ['DATE', 'DOMAIN_NAME', 'PLATFORM_TYPE_CODE'])
    params.append('dimensions', value);
  for (const value of ['ESTIMATED_EARNINGS', 'PAGE_VIEWS', 'PAGE_VIEWS_RPM'])
    params.append('metrics', value);
  params.append('filters', 'DOMAIN_NAME==koreaexperience.com');
  const ads = await read(
    'AdSense site report',
    `https://adsense.googleapis.com/v2/${account}/reports:generate?${params}`,
    process.env.ADSENSE_ACCESS_TOKEN,
  );
  const report = {
    at: new Date().toISOString(),
    startDate,
    endDate,
    scope:
      'koreaexperience.com; 28-day reporting window with a three-day freshness buffer. Reporting APIs can still revise data.',
    privacy: 'Private reports may contain query or URL data. Never commit this file.',
    reports: [gsc, ga, ads],
  };
  fs.mkdirSync('.private/reports', { recursive: true });
  fs.writeFileSync(
    `.private/reports/metrics-${iso(new Date())}.json`,
    JSON.stringify(report, null, 2),
  );
  for (const r of report.reports) console.log(`${r.name}: ${r.status}`);
}
void main();
