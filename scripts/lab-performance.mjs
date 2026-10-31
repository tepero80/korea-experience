import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { chromium } from '@playwright/test';

// A separate disposable Actions browser; never attach Lighthouse to the owner's browser.
if (process.env.GITHUB_ACTIONS !== 'true')
  throw Error('Run this lab only in the isolated GitHub Actions workflow.');
const run = promisify(execFile);
const folder = 'test-results/lab-performance';
await fs.mkdir(folder, { recursive: true });
const supplied = process.env.LAB_PREVIEW_BASE_URL || '';
if (supplied) {
  const candidate = new URL(supplied);
  if (
    candidate.protocol !== 'https:' ||
    !/^[a-z0-9-]+\.korea-experience\.pages\.dev$/.test(candidate.hostname) ||
    candidate.port ||
    candidate.username ||
    candidate.password ||
    candidate.pathname !== '/' ||
    candidate.search ||
    candidate.hash
  )
    throw Error('Remote lab target must be a plain Korea Experience Pages preview origin.');
}
const origin = supplied ? new URL(supplied).origin : 'http://127.0.0.1:3000';
const server = supplied
  ? null
  : spawn(process.execPath, ['scripts/preview.mjs'], { stdio: 'ignore' });
const samples = [];
try {
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      if ((await fetch(origin, { redirect: 'manual' })).status === 200) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  if (!ready) throw Error('Isolated export preview did not start.');
  const paths = ['/', '/blog/airport-limousine-bus-vs-arex-express-train', '/tools/trip-budget'];
  for (const [index, route] of paths.entries()) {
    for (const device of ['mobile', 'desktop']) {
      for (let sample = 1; sample <= 3; sample++) {
        const prefix = path.join(folder, `page-${index}-${device}-${sample}`);
        const flags = [
          'node_modules/lighthouse/cli/index.js',
          origin + route,
          '--quiet',
          '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
          '--only-categories=performance,accessibility,best-practices',
          '--no-enable-error-reporting',
          '--output=json',
          '--output=html',
          '--output-path=' + prefix,
          ...[
            '*google-analytics.com/*',
            '*googletagmanager.com/*',
            '*googlesyndication.com/*',
            '*doubleclick.net/*',
            'https://koreaexperience.com/*',
          ].map((pattern) => '--blocked-url-patterns=' + pattern),
          ...(device === 'desktop' ? ['--preset=desktop'] : []),
        ];
        await run(process.execPath, flags, {
          env: { ...process.env, CHROME_PATH: chromium.executablePath() },
          timeout: 120000,
          maxBuffer: 1024 * 1024,
        });
        const report = JSON.parse(await fs.readFile(prefix + '.report.json', 'utf8'));
        if (report.runtimeError)
          throw Error('Lighthouse did not complete: ' + report.runtimeError.code);
        samples.push({
          route,
          device,
          sample,
          lighthouseVersion: report.lighthouseVersion,
          fetchTime: report.fetchTime,
          environment: report.environment,
          config: report.configSettings,
          scores: Object.fromEntries(
            Object.entries(report.categories).map(([key, value]) => [key, value.score]),
          ),
          metrics: Object.fromEntries(
            [
              'largest-contentful-paint',
              'cumulative-layout-shift',
              'total-blocking-time',
              'first-contentful-paint',
              'speed-index',
            ].map((key) => [key, report.audits[key]?.numericValue]),
          ),
          opportunities: Object.entries(report.audits)
            .filter(
              ([, a]) =>
                a.score !== null &&
                a.score < 1 &&
                (a.details?.overallSavingsMs || a.details?.overallSavingsBytes),
            )
            .map(([id, a]) => ({
              id,
              title: a.title,
              savingsMs: a.details?.overallSavingsMs,
              savingsBytes: a.details?.overallSavingsBytes,
            })),
        });
        console.log(
          `${device} ${route} sample${sample}: performance ${report.categories.performance.score}`,
        );
      }
    }
  }
  const summaries = [];
  const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  for (const route of paths)
    for (const device of ['mobile', 'desktop']) {
      const selected = samples.filter((s) => s.route === route && s.device === device);
      summaries.push({
        route,
        device,
        count: selected.length,
        metrics: Object.fromEntries(
          Object.keys(selected[0].metrics).map((key) => {
            const values = selected.map((s) => s.metrics[key]);
            return [
              key,
              { median: median(values), min: Math.min(...values), max: Math.max(...values) },
            ];
          }),
        ),
      });
    }
  await fs.writeFile(
    path.join(folder, 'summary.json'),
    JSON.stringify(
      {
        sourceCommit: process.env.GITHUB_SHA,
        origin,
        measuredAt: new Date().toISOString(),
        scope: `Cold disposable Chromium, ${supplied ? 'Cloudflare preview (deployment commit verified separately)' : 'uncompressed local static export'}, default Lighthouse simulated mobile/desktop profiles, three runs per route/profile. Analytics/ads excluded. Lab TBT is not field INP; this is not production CWV certification.`,
        samples,
        summaries,
      },
      null,
      2,
    ),
  );
} finally {
  server?.kill();
}
