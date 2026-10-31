import fs from 'node:fs';
import { reportingAccessToken, REPORTING_TARGETS, safeReportingError } from './reporting/auth';
import { readOfficial } from './reporting/client';

async function main() {
  const now = new Date();
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const file = '.private/reports/url-inspection-latest.json';
  const previous = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, 'utf8'))
    : { observations: {} };
  const trackingFile = '.private/reports/url-tracking.json';
  if (!fs.existsSync(trackingFile)) {
    console.log('URL tracking is unavailable; no dates or indexing states were invented.');
    return;
  }
  const tracking: { id: string; url: string; checksDue: string[] }[] = JSON.parse(
    fs.readFileSync(trackingFile, 'utf8'),
  );
  const baseline = process.argv.includes('--baseline');
  const selected = tracking
    .filter(
      (item) =>
        baseline ||
        item.checksDue.some(
          (date) => date <= today && !previous.observations[item.url]?.checkedFor?.includes(date),
        ),
    )
    .slice(0, 50);
  if (!selected.length) {
    console.log('No unobserved7/14/28day checkpoint is due. No URL inspection request sent.');
    return;
  }
  let token: string | null;
  try {
    token = await reportingAccessToken();
  } catch (error) {
    console.log(JSON.stringify(safeReportingError(error)));
    return;
  }
  const observations = { ...previous.observations };
  let requests = 0,
    observed = 0;
  for (const item of selected) {
    const result = await readOfficial(
      'GSC URL inspection',
      'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
      token,
      {
        siteUrl: REPORTING_TARGETS.site,
        inspectionUrl: item.url,
        languageCode: 'en-US',
      },
    );
    if (token) requests++;
    const successful = result.status === 'observed';
    if (successful) observed++;
    const old = observations[item.url];
    observations[item.url] = {
      id: item.id,
      checkedAt: now.toISOString(),
      mode: baseline ? 'baseline' : 'due-checkpoint',
      checkedFor: successful
        ? [
            ...new Set([
              ...(old?.checkedFor || []),
              ...item.checksDue.filter((date) => date <= today),
            ]),
          ]
        : old?.checkedFor || [],
      lastSuccessAt: successful ? now.toISOString() : old?.lastSuccessAt || null,
      result,
      previousSuccessfulResult: !successful
        ? old?.previousSuccessfulResult || (old?.result?.status === 'observed' ? old.result : null)
        : undefined,
    };
    if (!token || result.httpStatus === 429 || result.httpStatus === 401) break;
  }
  const report = {
    at: now.toISOString(),
    site: REPORTING_TARGETS.site,
    requests,
    observed,
    scope:
      'Read-only indexed-version inspection. Not a live crawl, indexing submission or guarantee. Unavailable is not unindexed; successful baseline does not consume future7/14/28day checkpoints.',
    observations,
  };
  fs.mkdirSync('.private/reports/' + today, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(report, null, 2));
  fs.writeFileSync(
    '.private/reports/' +
      today +
      '/url-inspection-' +
      now.toISOString().replace(/[:.]/g, '-') +
      '.json',
    JSON.stringify(report, null, 2),
  );
  console.log(
    `URL inspection: ${observed} observed / ${requests} actual API requests. Evidence saved privately.`,
  );
}
main().catch(() => {
  console.error('URL inspection failed. No credential or raw provider error is printed.');
  process.exitCode = 1;
});
