export function reportingWindows(now = new Date()) {
  const day = 86400000;
  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - 3 * day,
  );
  const start = new Date(end.getTime() - 27 * day);
  const iso = (date: Date) => date.toISOString().slice(0, 10);
  return {
    current: { startDate: iso(start), endDate: iso(end) },
    previous: {
      startDate: iso(new Date(start.getTime() - 28 * day)),
      endDate: iso(new Date(start.getTime() - day)),
    },
  };
}

export function contentForReportUrl(raw: string, catalog: readonly { id: string; slug: string }[]) {
  try {
    const url = new URL(raw, 'https://koreaexperience.com');
    if (
      !['koreaexperience.com', 'www.koreaexperience.com'].includes(url.hostname) ||
      !['http:', 'https:'].includes(url.protocol)
    )
      return null;
    const match = /^\/blog\/([a-z0-9-]+)\/?$/.exec(url.pathname);
    return match ? catalog.find((item) => item.slug === match[1])?.id || null : null;
  } catch {
    return null;
  }
}

export function assertReportingEndpoint(value: string) {
  const url = new URL(value);
  const allowed = [
    /^https:\/\/www\.googleapis\.com\/webmasters\/v3\/sites\/sc-domain%3Akoreaexperience\.com\/searchAnalytics\/query$/,
    /^https:\/\/searchconsole\.googleapis\.com\/v1\/urlInspection\/index:inspect$/,
    /^https:\/\/analyticsdata\.googleapis\.com\/v1beta\/properties\/522514411:(?:runReport|runRealtimeReport)$/,
    /^https:\/\/adsense\.googleapis\.com\/v2\/accounts\/pub-7793293419727384(?:\/reports:generate|\/alerts|\/policyIssues)?$/,
  ];
  if (!allowed.some((pattern) => pattern.test(url.origin + url.pathname)))
    throw Error('Reporting request is outside the approved resources.');
}

export function gaHostFilter() {
  return {
    filter: {
      fieldName: 'hostName',
      stringFilter: { matchType: 'EXACT', value: 'koreaexperience.com', caseSensitive: false },
    },
  };
}

export function assertReportingRequest(value: string, body?: unknown) {
  assertReportingEndpoint(value);
  const url = new URL(value);
  const input = body as Record<string, any> | undefined;
  if (url.hostname === 'searchconsole.googleapis.com') {
    const inspected = input?.inspectionUrl;
    if (input?.siteUrl !== 'sc-domain:koreaexperience.com' || typeof inspected !== 'string')
      throw Error('URL inspection must use the approved domain property.');
    const target = new URL(inspected);
    if (target.origin !== 'https://koreaexperience.com' || target.username || target.password)
      throw Error('URL inspection is outside the approved website.');
  }
  if (
    url.hostname === 'analyticsdata.googleapis.com' &&
    JSON.stringify(input?.dimensionFilter) !== JSON.stringify(gaHostFilter())
  )
    throw Error('Analytics reports require the exact approved hostname filter.');
  if (
    url.hostname === 'adsense.googleapis.com' &&
    url.pathname.endsWith('/reports:generate') &&
    JSON.stringify(url.searchParams.getAll('filters')) !==
      JSON.stringify(['DOMAIN_NAME==koreaexperience.com'])
  )
    throw Error('AdSense reports require the approved domain filter.');
}
