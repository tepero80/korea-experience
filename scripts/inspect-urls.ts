import fs from 'node:fs';
import { setTimeout } from 'node:timers/promises';
import { reportingAccessToken, REPORTING_TARGETS, safeReportingError } from './reporting/auth';
import { readOfficial } from './reporting/client';
import {
  inspectionObservation,
  pendingInspections,
  type InspectionCrawlEvidence,
  type InspectionObservation,
  type TrackedInspection,
} from './reporting/inspection-checkpoints';

const dueLimit = 400;
const baselineLimit = 50;
const batchSize = 4;

async function main() {
  const now = new Date();
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const file = '.private/reports/url-inspection-latest.json';
  const previous: { observations: Record<string, InspectionObservation> } = fs.existsSync(file)
    ? JSON.parse(fs.readFileSync(file, 'utf8'))
    : { observations: {} };
  const trackingFile = '.private/reports/url-tracking.json';
  if (!fs.existsSync(trackingFile)) {
    console.log('URL tracking is unavailable; no dates or indexing states were invented.');
    return;
  }
  const tracking: TrackedInspection[] = JSON.parse(fs.readFileSync(trackingFile, 'utf8'));
  const baseline = process.argv.includes('--baseline');
  const pending = pendingInspections(tracking, previous.observations, today, baseline);
  const selected = pending.slice(0, baseline ? baselineLimit : dueLimit);
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
  if (!token) {
    console.log('Search Console read access is unavailable. No URL inspections sent.');
    return;
  }
  const observations = { ...previous.observations };
  let requests = 0,
    observed = 0,
    failedBatches = 0;
  let stopped: string | undefined;
  const crawlStates: Partial<Record<InspectionCrawlEvidence['state'], number>> = {};
  const report = () => ({
    at: new Date().toISOString(),
    site: REPORTING_TARGETS.site,
    requests,
    observed,
    pending: pending.length,
    unattempted: pending.length - requests,
    stopped,
    crawlStates,
    scope:
      'Read-only Google index observations. Crawl states compare the last reported Google crawl with the verified deployment for each URL. A late reading covers the latest due checkpoint and records earlier outstanding dates as missed. Unavailable responses leave the dates open.',
    observations,
  });
  const saveLatest = () => {
    const payload = JSON.stringify(report(), null, 2);
    const temp = file + '.' + process.pid + '.tmp';
    fs.writeFileSync(temp, payload);
    fs.renameSync(temp, file);
    return payload;
  };
  fs.mkdirSync('.private/reports/' + today, { recursive: true });
  for (let start = 0; start < selected.length; start += batchSize) {
    const startedAt = Date.now();
    const batch = selected.slice(start, start + batchSize);
    const outcomes = await Promise.all(
      batch.map(async (item) => {
        const response = await readOfficial(
          'GSC URL inspection',
          'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
          token,
          { siteUrl: REPORTING_TARGETS.site, inspectionUrl: item.url, languageCode: 'en-US' },
        );
        const observation = inspectionObservation(
          item,
          observations[item.url],
          response,
          new Date().toISOString(),
          baseline,
        );
        return { url: item.url, observation, httpStatus: response.httpStatus };
      }),
    );
    requests += outcomes.length;
    const successful = outcomes.filter(
      ({ observation }) => observation.result.status === 'observed',
    ).length;
    observed += successful;
    failedBatches = successful ? 0 : failedBatches + 1;
    for (const { url, observation } of outcomes) {
      observations[url] = observation;
      if (observation.crawlEvidence) {
        const { state } = observation.crawlEvidence;
        crawlStates[state] = (crawlStates[state] ?? 0) + 1;
      }
    }
    const stopStatus = outcomes.find(
      ({ httpStatus }) => httpStatus && [401, 403, 429].includes(httpStatus),
    );
    if (stopStatus) {
      stopped = 'Google HTTP ' + stopStatus.httpStatus;
      break;
    }
    if (failedBatches >= 3) {
      stopped = 'No usable index status in three consecutive batches';
      break;
    }
    if (requests % 20 === 0) saveLatest();
    if (start + batchSize < selected.length)
      await setTimeout(Math.max(0, 1000 - (Date.now() - startedAt)));
  }
  fs.writeFileSync(
    '.private/reports/' +
      today +
      '/url-inspection-' +
      now.toISOString().replace(/[:.]/g, '-') +
      '.json',
    saveLatest(),
  );
  console.log(
    `URL inspection: ${observed} observed / ${requests} requests, ${pending.length - requests} unattempted.${stopped ? ' Stopped: ' + stopped + '.' : ''} Evidence saved privately.`,
  );
}
main().catch(() => {
  console.error('URL inspection failed. No credential or raw provider error is printed.');
  process.exitCode = 1;
});
