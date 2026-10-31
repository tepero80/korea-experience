export interface RetirementEvidence {
  ageDays: number;
  indexed: boolean | null;
  intentionalNoindex: boolean;
  seasonalValue: boolean;
  technicalIssue: boolean;
  recentClicks: number | null;
  saves: number | null;
  backlinks: number | null;
  journeyRole: boolean;
  useful: boolean;
  duplicateTarget?: string;
  improvedAtDaysAgo?: number;
}
/** Medical editorial scope is independent of an indexing-quality diagnosis. */
export function hasCompleteRetirementReview(r: import('./content-types').Retirement) {
  const e = r.evidence;
  if (
    !r.reason?.trim() ||
    !r.decidedAt ||
    !e?.publicationDate ||
    !e.reviewedAt ||
    !e.indexingStatus?.trim() ||
    !e.usageChecked ||
    !e.linksChecked ||
    !e.seasonalChecked
  )
    return false;
  if (r.reviewBasis && !['index-review', 'medical-editorial-scope'].includes(r.reviewBasis))
    return false;
  return (
    r.reviewBasis === 'medical-editorial-scope' ||
    !/unknown|unavailable|unverified|pending|not.checked/i.test(e.indexingStatus)
  );
}
/** The launch is a historical delivery record, not a permanent article-count floor. */
export function unaccountedLaunchGuides(
  initial: readonly { id: string; slug: string }[],
  publishedReviewed: readonly { id: string; slug: string }[],
  retiredSlugs: readonly string[],
) {
  const live = new Map(publishedReviewed.map((guide) => [guide.slug, guide.id]));
  const retired = new Set(retiredSlugs);
  return initial.filter((guide) => live.get(guide.slug) !== guide.id && !retired.has(guide.slug));
}
export function assessRetirement(e: RetirementEvidence) {
  if (e.intentionalNoindex)
    return { action: 'keep', reason: 'Intentional indexing policy; not an indexing failure.' };
  if (e.ageDays < 90)
    return { action: 'observe', reason: 'Within the initial 90-day observation period.' };
  if (e.indexed === null || e.recentClicks === null || e.saves === null || e.backlinks === null)
    return { action: 'hold', reason: 'Missing evidence is not zero usage or no links.' };
  if (e.technicalIssue)
    return {
      action: 'repair',
      reason: 'Resolve the technical problem before judging editorial value.',
    };
  if (
    e.indexed ||
    e.seasonalValue ||
    e.recentClicks > 0 ||
    e.saves > 0 ||
    e.backlinks > 0 ||
    e.journeyRole
  )
    return {
      action: 'keep',
      reason: 'Indexing or demonstrated reader, link, season or journey value protects this URL.',
    };
  if (e.duplicateTarget)
    return {
      action: 'merge',
      reason: 'Consolidate into the equivalent useful guide and repair incoming references.',
    };
  if (e.useful && e.improvedAtDaysAgo === undefined)
    return {
      action: 'improve',
      reason: 'One focused improvement, followed by a review in 28 days.',
    };
  if (e.improvedAtDaysAgo !== undefined && e.improvedAtDaysAgo < 28)
    return { action: 'observe', reason: 'Allow the 28-day improvement review window.' };
  return {
    action: 'retire',
    reason: 'No demonstrated protection or useful remaining role after the review.',
  };
}
