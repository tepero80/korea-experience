import type { ReportResult, WindowDates } from './client';

export type ReportSuccess = {
  at: string;
  window?: WindowDates;
  result: ReportResult;
};
export type ReportHistory = Record<string, ReportSuccess>;

// A failed poll is evidence about access, never a replacement for observed data.
export function retainObservedReports(
  previous: ReportHistory,
  at: string,
  checks: { key: string; window?: WindowDates; result: ReportResult }[],
): ReportHistory {
  const next = { ...previous };
  for (const check of checks)
    if (check.result.status === 'observed')
      next[check.key] = { at, window: check.window, result: check.result };
  return next;
}
