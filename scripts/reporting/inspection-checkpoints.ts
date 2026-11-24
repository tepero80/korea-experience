import type { ReportResult } from './client';

type Revision = { commit: string; verifiedAt: string };

export type TrackedInspection = {
  id: string;
  url: string;
  checksDue: string[];
  releaseCommit?: string;
  verifiedPublicAt?: string;
  substantiveUpdates?: Revision[];
};

type PlannedInspection = TrackedInspection & { revision?: Revision; outstanding: string[] };

export type InspectionCrawlEvidence = {
  state:
    | 'unavailable'
    | 'revision-unverified'
    | 'no-post-release-crawl-evidence'
    | 'post-release-crawl-indexed'
    | 'post-release-crawl-unindexed'
    | 'post-release-crawl-index-status-unknown';
  revision: Revision | null;
  lastCrawlAt: string | null;
  indexed: boolean | null;
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
  crawlEvidence?: InspectionCrawlEvidence;
};

export function pendingInspections(
  tracking: TrackedInspection[],
  observations: Record<string, InspectionObservation>,
  today: string,
  baseline: boolean,
): PlannedInspection[] {
  const byUrl = new Map<string, TrackedInspection & { revision?: Revision }>();
  for (const item of tracking) {
    const previous = byUrl.get(item.url);
    const checksDue = [...new Set([...(previous?.checksDue ?? []), ...item.checksDue])].sort();
    const original =
      item.releaseCommit && item.verifiedPublicAt
        ? { commit: item.releaseCommit, verifiedAt: item.verifiedPublicAt }
        : undefined;
    const revision = [previous?.revision, original, ...(item.substantiveUpdates ?? [])]
      .filter(
        (candidate): candidate is Revision =>
          !!candidate?.commit && Number.isFinite(Date.parse(candidate.verifiedAt)),
      )
      .sort((a, b) => Date.parse(b.verifiedAt) - Date.parse(a.verifiedAt))[0];
    byUrl.set(item.url, { ...item, checksDue, revision });
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
  item: PlannedInspection,
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
  const revision = item.revision ?? null;
  const observedAt = Date.parse(checkedAt);
  const lastCrawl =
    typeof index?.lastCrawlTime === 'string' ? Date.parse(index.lastCrawlTime) : NaN;
  const lastCrawlAt =
    successful && Number.isFinite(lastCrawl) && lastCrawl <= observedAt
      ? index.lastCrawlTime
      : null;
  const indexed = !successful
    ? null
    : index.verdict === 'PASS'
      ? true
      : ['NEUTRAL', 'FAIL'].includes(index.verdict)
        ? false
        : null;
  let state: InspectionCrawlEvidence['state'];
  if (!successful) state = 'unavailable';
  else if (!revision || Date.parse(revision.verifiedAt) > observedAt) state = 'revision-unverified';
  else if (!lastCrawlAt || lastCrawl < Date.parse(revision.verifiedAt))
    state = 'no-post-release-crawl-evidence';
  else if (indexed === true) state = 'post-release-crawl-indexed';
  else if (indexed === false) state = 'post-release-crawl-unindexed';
  else state = 'post-release-crawl-index-status-unknown';
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
    crawlEvidence: { state, revision, lastCrawlAt, indexed },
    previousSuccessfulResult: successful
      ? undefined
      : (previous?.previousSuccessfulResult ??
        (previous?.result.status === 'observed' ? previous.result : null)),
  };
}
