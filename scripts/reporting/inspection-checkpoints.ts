import type { ReportResult } from './client';

type Tracking = {
  id: string;
  url: string;
  checksDue: string[];
};

export type InspectionObservation = {
  id: string;
  checkedAt: string;
  mode: 'baseline' | 'due-checkpoint';
  checkedFor: string[];
  missedCheckpoints?: string[];
  lastSuccessAt: string | null;
  result: ReportResult;
  previousSuccessfulResult?: ReportResult | null;
};

export function pendingInspections(
  tracking: Tracking[],
  observations: Record<string, InspectionObservation>,
  today: string,
  baseline: boolean,
) {
  const byUrl = new Map<string, Tracking>();
  for (const item of tracking) {
    const previous = byUrl.get(item.url);
    const checksDue = [...new Set([...(previous?.checksDue ?? []), ...item.checksDue])].sort();
    byUrl.set(item.url, { ...item, checksDue });
  }
  return [...byUrl.values()]
    .flatMap((item) => {
      const previous = observations[item.url];
      const handled = new Set([
        ...(previous?.checkedFor ?? []),
        ...(previous?.missedCheckpoints ?? []),
      ]);
      const outstanding = item.checksDue.filter((date) => date <= today && !handled.has(date));
      return baseline || outstanding.length ? [{ ...item, outstanding }] : [];
    })
    .sort(
      (a, b) =>
        (b.outstanding.at(-1) ?? '').localeCompare(a.outstanding.at(-1) ?? '') ||
        a.url.localeCompare(b.url),
    );
}

export function inspectionObservation(
  item: ReturnType<typeof pendingInspections>[number],
  previous: InspectionObservation | undefined,
  response: ReportResult,
  checkedAt: string,
  baseline: boolean,
): InspectionObservation {
  const index = response.data?.inspectionResult?.indexStatusResult;
  const missingStatus =
    response.status === 'observed' &&
    (typeof index?.verdict !== 'string' ||
      !index.verdict ||
      typeof index?.coverageState !== 'string' ||
      !index.coverageState);
  const result: ReportResult = missingStatus
    ? { name: response.name, status: 'unavailable', reason: 'Google returned no index status.' }
    : response;
  const successful = result.status === 'observed';
  const latest = successful ? item.outstanding.at(-1) : undefined;
  return {
    id: item.id,
    checkedAt,
    mode: baseline ? 'baseline' : 'due-checkpoint',
    checkedFor: [...new Set([...(previous?.checkedFor ?? []), ...(latest ? [latest] : [])])].sort(),
    missedCheckpoints: [
      ...new Set([
        ...(previous?.missedCheckpoints ?? []),
        ...(latest ? item.outstanding.slice(0, -1) : []),
      ]),
    ].sort(),
    lastSuccessAt: successful ? checkedAt : (previous?.lastSuccessAt ?? null),
    result,
    previousSuccessfulResult: successful
      ? undefined
      : (previous?.previousSuccessfulResult ??
        (previous?.result.status === 'observed' ? previous.result : null)),
  };
}
