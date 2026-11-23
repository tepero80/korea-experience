import { DISCOVERY_EVENTS } from '../../lib/analytics-policy';
import type { ReportResult } from './client';

type DiscoveryRow = {
  dimensionValues?: { value?: string }[];
  metricValues?: { value?: string }[];
};

export function summarizeDiscovery(report?: ReportResult) {
  const counts = new Map<string, number | null>(DISCOVERY_EVENTS.map((event) => [event, null]));
  if (report?.status !== 'observed') {
    return { status: 'unavailable' as const, clicks: Object.fromEntries(counts) };
  }

  let partial = Boolean(
    report.truncated ||
      report.data?.metadata?.subjectToThresholding ||
      report.data?.metadata?.dataLossFromOtherRow ||
      report.data?.metadata?.samplingMetadatas?.length,
  );
  const rows: DiscoveryRow[] = report.data?.rows ?? [];
  for (const row of rows) {
    // The public events report requests hostName, eventName, pagePath and eventCount, in that order.
    const [, name, from] = row.dimensionValues ?? [];
    const event = name?.value;
    if (!event || !counts.has(event)) continue;
    const fromExpectedSurface = event.startsWith('home_')
      ? from?.value === '/'
      : /^\/blog\/[a-z0-9-]+\/?$/.test(from?.value ?? '');
    const value = row.metricValues?.[0]?.value;
    const count = value && /^\d+$/.test(value) ? Number(value) : NaN;
    if (!fromExpectedSurface || !Number.isSafeInteger(count)) {
      partial = true;
      continue;
    }
    counts.set(event, (counts.get(event) ?? 0) + count);
  }

  return { status: partial ? 'partial' as const : 'observed' as const, clicks: Object.fromEntries(counts) };
}
