import { REPORTING_TARGETS } from './auth';
import { assertReportingRequest, gaHostFilter } from './report-policy';
export type WindowDates = { startDate: string; endDate: string };
export type ReportResult = {
  name: string;
  status: 'observed' | 'unavailable';
  data?: Record<string, any>;
  reason?: string;
  httpStatus?: number;
  truncated?: boolean;
  coverage?: string;
  requests?: number;
};

export async function readOfficial(
  name: string,
  url: string,
  token: string | undefined | null,
  body?: unknown,
  transport: typeof fetch = fetch,
): Promise<ReportResult> {
  assertReportingRequest(url, body);
  if (!token) return { name, status: 'unavailable', reason: 'Read credential is not connected.' };
  try {
    const response = await transport(url, {
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
            ? 'Access expired or rejected; reconnect required.'
            : response.status === 429
              ? 'Report quota/rate limit reached; not zero activity.'
              : 'Official report unavailable; check resource access and API enablement.',
      };
    return { name, status: 'observed', data: await response.json() };
  } catch {
    return {
      name,
      status: 'unavailable',
      reason: 'Official request or response failed; not zero activity.',
    };
  }
}

export async function gscReport(
  name: string,
  dates: WindowDates,
  dimensions: string[],
  token: string | undefined | null,
  transport: typeof fetch = fetch,
) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(REPORTING_TARGETS.site)}/searchAnalytics/query`;
  const limit = 25000,
    rows: unknown[] = [];
  let last: ReportResult;
  let requests = 0;
  for (let page = 0; page < 4; page++) {
    last = await readOfficial(
      name,
      url,
      token,
      {
        ...dates,
        type: 'web',
        dataState: 'final',
        dimensions,
        rowLimit: limit,
        startRow: page * limit,
      },
      transport,
    );
    requests++;
    if (last.status !== 'observed') return { ...last, requests };
    const current = last.data?.rows || [];
    rows.push(...current);
    if (current.length < limit || dimensions.length === 0)
      return {
        ...last,
        data: { ...last.data, rows },
        truncated: false,
        requests,
        coverage:
          'Final Web search; America/Los_Angeles dates. Top-row API coverage and privacy omissions remain, even after pagination. Absent rows are not proof of zero demand.',
      };
  }
  return {
    ...last!,
    data: { ...last!.data, rows },
    truncated: true,
    requests,
    coverage: 'Stopped at the explicit100000-row cap; incomplete and top-row/privacy-limited.',
  };
}

export async function gaReport(
  name: string,
  dates: WindowDates,
  dimensions: string[],
  metrics: string[],
  token: string | undefined | null,
  transport: typeof fetch = fetch,
) {
  const rows: unknown[] = [],
    limit = 25000;
  let last: ReportResult;
  let requests = 0;
  for (let page = 0; page < 4; page++) {
    last = await readOfficial(
      name,
      `https://analyticsdata.googleapis.com/v1beta/properties/${REPORTING_TARGETS.property}:runReport`,
      token,
      {
        dateRanges: [dates],
        dimensions: dimensions.map((name) => ({ name })),
        metrics: metrics.map((name) => ({ name })),
        dimensionFilter: gaHostFilter(),
        limit: String(limit),
        offset: String(page * limit),
        returnPropertyQuota: true,
      },
      transport,
    );
    requests++;
    if (last.status !== 'observed') return { ...last, requests };
    rows.push(...(last.data?.rows || []));
    if (rows.length >= (last.data?.rowCount || 0))
      return {
        ...last,
        data: { ...last.data, rows },
        requests,
        truncated: false,
        coverage:
          'Exact apex hostname filter; metadata retains property timezone, currency, thresholding/sampling and quota. Event totals are not a unique-user completion funnel.',
      };
    if (!(last.data?.rows || []).length) break;
  }
  return {
    ...last!,
    data: { ...last!.data, rows },
    requests,
    truncated: true,
    coverage: 'Pagination ended before the reported rowCount; do not treat as complete.',
  };
}

export function adsenseReportUrl(dates: WindowDates) {
  const start = new Date(dates.startDate + 'T00:00:00Z'),
    end = new Date(dates.endDate + 'T00:00:00Z');
  const params = new URLSearchParams({
    dateRange: 'CUSTOM',
    'startDate.year': String(start.getUTCFullYear()),
    'startDate.month': String(start.getUTCMonth() + 1),
    'startDate.day': String(start.getUTCDate()),
    'endDate.year': String(end.getUTCFullYear()),
    'endDate.month': String(end.getUTCMonth() + 1),
    'endDate.day': String(end.getUTCDate()),
    currencyCode: 'USD',
    reportingTimeZone: 'GOOGLE_TIME_ZONE',
    limit: '100000',
  });
  for (const name of ['DATE', 'DOMAIN_NAME', 'PLATFORM_TYPE_CODE'])
    params.append('dimensions', name);
  for (const name of ['ESTIMATED_EARNINGS', 'PAGE_VIEWS', 'PAGE_VIEWS_RPM'])
    params.append('metrics', name);
  params.append('filters', 'DOMAIN_NAME==koreaexperience.com');
  return `https://adsense.googleapis.com/v2/${REPORTING_TARGETS.adsense}/reports:generate?${params}`;
}
