import fs from 'node:fs';
import { getLaunchGuides } from '../lib/posts';
async function main() {
  const base = process.env.HEALTH_BASE_URL || 'https://koreaexperience.com';
  const seen = new Set<string>();
  const guides = getLaunchGuides().filter((p) => {
    if (process.env.HEALTH_ALL_LAUNCH === '1') return true;
    if (seen.has(p.categoryId)) return false;
    seen.add(p.categoryId);
    return true;
  });
  const routes = [
    '/',
    '/blog',
    '/tools/transit-pass',
    '/destinations/seoul',
    '/robots.txt',
    '/sitemap.xml',
    ...guides.map((p) => '/blog/' + p.slug),
    '/__ke-health-missing-page',
  ];
  const checks = [];
  for (const route of routes) {
    try {
      const r = await fetch(base + route, {
        signal: AbortSignal.timeout(15000),
        headers: { 'User-Agent': 'KoreaExperienceOwnerHealthCheck/1.0' },
      });
      const body = await r.text();
      const expectedStatus = route === '/__ke-health-missing-page' ? 404 : 200;
      const canonical = route.startsWith('/blog/')
        ? body.includes(`rel="canonical" href="https://koreaexperience.com${route}"`)
        : undefined;
      checks.push({
        route,
        status: r.status,
        expectedStatus,
        ok: r.status === expectedStatus && canonical !== false,
        canonical,
      });
    } catch (e) {
      checks.push({ route, ok: false, error: (e as Error).name });
    }
  }
  const report = {
    at: new Date().toISOString(),
    base,
    checks,
    accountReports:
      'Not checked by this public URL script. Authenticated GSC/GA4/AdSense and moderation checks must be recorded separately.',
  };
  fs.mkdirSync('.private/reports', { recursive: true });
  fs.writeFileSync('.private/reports/health-latest.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (checks.some((x) => !x.ok)) process.exitCode = 1;
}
void main();
