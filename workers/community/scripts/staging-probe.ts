import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { getPlatformProxy, unstable_readConfig } from 'wrangler';
import { serializeSignedCookie } from 'better-call';
import { auth } from '../src/auth';
import type { Env } from '../src/env';
import { normalizePlan } from '../../../lib/itinerary';

// Creates only disposable accounts in the explicitly named staging database.
// This tests deployed server permissions; it does not simulate a successful Google/email login.
const stage = unstable_readConfig({ config: 'wrangler.jsonc', env: 'staging' });
if (stage.name !== 'korea-experience-community-staging' || stage.routes?.length)
  throw Error('A route-free staging configuration is required.');
const base = stage.vars.SITE_URL as string;
if (new URL(base).hostname !== 'korea-experience-community-staging.yeomds.workers.dev')
  throw Error('Refusing to test a different hostname.');
const privateRoot = path.resolve('../../.private');
fs.mkdirSync(path.join(privateRoot, 'testing'), { recursive: true });
fs.mkdirSync(path.join(privateRoot, 'reports'), { recursive: true });
const secrets = JSON.parse(
  fs.readFileSync(path.join(privateRoot, 'credentials/community-staging.json'), 'utf8'),
);
const checks: Array<{
  name: string;
  status?: number;
  expected?: number;
  ok: boolean;
  wallMs?: number;
}> = [];
const runId = 'probe-' + crypto.randomUUID();
const fixtureIds: string[] = [];
function literal(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  return "'" + String(value).replaceAll("'", "''") + "'";
}
function remote(sql: string, readResult = false) {
  const file = path.join(privateRoot, 'testing', runId + '.sql');
  fs.writeFileSync(file, sql);
  try {
    const output = execFileSync(
      process.execPath,
      [
        'node_modules/wrangler/bin/wrangler.js',
        'd1',
        'execute',
        'korea-experience-community-staging',
        '--env',
        'staging',
        '--remote',
        ...(readResult ? ['--command', sql] : ['--file', file]),
        '--json',
      ],
      {
        encoding: 'utf8',
        maxBuffer: 4_000_000,
        env: { ...process.env, NO_COLOR: '1' },
      },
    );
    // File imports report success through the process exit status; read queries return JSON.
    if (!readResult) return;
    const start = output.search(/^\[\s*\r?\n\s*\{/m);
    if (start < 0) throw Error('The remote CLI did not return a JSON result.');
    return JSON.parse(output.slice(start, output.lastIndexOf(']') + 1));
  } finally {
    fs.unlinkSync(file);
  }
}
async function request(
  name: string,
  route: string,
  expected: number,
  cookie = '',
  method = 'GET',
  data?: unknown,
  origin = base,
) {
  const start = Date.now();
  const target = new URL(route, base);
  if (target.origin !== base) throw Error('Refusing to probe another origin.');
  const response = await fetch(target, {
    method,
    headers: {
      cookie,
      origin,
      'Content-Type': 'application/json',
      'User-Agent': 'KoreaExperienceOwnerStagingProbe/1.0',
    },
    body: data === undefined ? undefined : JSON.stringify(data),
    signal: AbortSignal.timeout(20000),
  });
  const check = {
    name,
    status: response.status,
    expected,
    ok: response.status === expected,
    wallMs: Date.now() - start,
  };
  checks.push(check);
  console.log(JSON.stringify(check));
  if (!check.ok) throw Error('Deployed check failed: ' + name + ' (HTTP ' + response.status + ').');
  return response;
}
const platform = await getPlatformProxy({ persist: false });
const env = { ...platform.env, ...stage.vars, ...secrets } as Env;
let ownerId = '',
  otherId = '',
  adminId = '',
  profileId = '',
  planId = '';
let failure: string | undefined;
try {
  for (const file of [
    '0001_auth.sql',
    '0002_community.sql',
    '0003_contribution_origin.sql',
    '0004_plan_share_snapshot.sql',
  ]) {
    for (const sql of fs
      .readFileSync('migrations/' + file, 'utf8')
      .replace(/^--.*$/gm, '')
      .split(';')
      .map((x) => x.trim())
      .filter(Boolean))
      await env.DB.prepare(sql).run();
  }
  const context = await auth(env).$context;
  async function fixture(email: string) {
    const user = await context.internalAdapter.createUser(
      { name: 'Disposable staging traveler', email, emailVerified: true },
      { method: 'magic-link' },
    );
    const session = await context.internalAdapter.createSession(user.id, false);
    if (!session) throw Error('Could not create local disposable session.');
    fixtureIds.push(user.id);
    const cookie = (
      await serializeSignedCookie(
        context.authCookies.sessionToken.name,
        session.token,
        secrets.BETTER_AUTH_SECRET,
      )
    ).split(';')[0];
    return { id: user.id, cookie };
  }
  const owner = await fixture(runId + '-owner@example.invalid');
  ownerId = owner.id;
  const other = await fixture(runId + '-other@example.invalid');
  otherId = other.id;
  const administrator = await fixture('ke-stage-admin@example.invalid');
  adminId = administrator.id;
  let sql = '';
  for (const table of ['user', 'session']) {
    const rows = (await env.DB.prepare('SELECT * FROM "' + table + '"').all()).results as Record<
      string,
      unknown
    >[];
    for (const row of rows)
      sql +=
        'INSERT INTO "' +
        table +
        '" (' +
        Object.keys(row)
          .map((k) => '"' + k + '"')
          .join(',') +
        ') VALUES (' +
        Object.values(row).map(literal).join(',') +
        ');\n';
  }
  remote(sql);
  const health = await request('Bound remote D1 health', '/api/health', 200);
  const services = (await health.json()) as { spam: boolean };
  checks.push({
    name: 'Staging excludes indexing',
    ok: health.headers.get('X-Robots-Tag') === 'noindex, nofollow',
  });
  await request('Anonymous private access rejected', '/api/me', 401);
  const me = (await (
    await request('Signed owner session', '/api/me', 200, owner.cookie)
  ).json()) as any;
  profileId = me.id;
  await request('Second user session', '/api/me', 200, other.cookie);
  await request('Nonadmin moderation rejected', '/api/moderation', 403, owner.cookie);
  await request(
    'Wrong origin rejected',
    '/api/plans',
    403,
    owner.cookie,
    'POST',
    { title: 'Blocked origin', data: {} },
    'https://other.invalid',
  );
  let planData = normalizePlan({
    notes: 'Private staging note fixture',
    items: [
      {
        id: 'fixture-stop',
        day: 1,
        time: '10:00',
        place: 'Public museum fixture',
        address: 'Private staging address',
        note: 'Private booking fixture',
      },
    ],
  });
  planData.startDate = '2026-11-02';
  let planTitle = 'Disposable staging plan';
  const sharing = () => ({
    includeNotes: false,
    includeAddresses: false,
    includeDates: false,
    expectedTitle: planTitle,
    expectedData: JSON.stringify(planData),
  });
  const plan = (await (
    await request('Create private plan', '/api/plans', 201, owner.cookie, 'POST', {
      title: 'Disposable staging plan',
      data: planData,
    })
  ).json()) as any;
  planId = plan.id;
  await request('Owner can reopen private plan', '/api/plans/' + plan.id, 200, owner.cookie);
  await request('Other user cannot read private plan', '/api/plans/' + plan.id, 404, other.cookie);
  await request(
    'Other user cannot alter private plan',
    '/api/plans/' + plan.id,
    404,
    other.cookie,
    'PUT',
    { title: 'Unauthorized edit', data: {} },
  );
  await request(
    'Other user cannot share private plan',
    '/api/plans/' + plan.id + '/share',
    404,
    other.cookie,
    'POST',
    {},
  );
  await request(
    'Unreviewed title rejected',
    '/api/plans/' + plan.id + '/share',
    409,
    owner.cookie,
    'POST',
    { ...sharing(), expectedTitle: 'Unreviewed private title' },
  );
  const share = (await (
    await request(
      'Explicit sharing creates a link',
      '/api/plans/' + plan.id + '/share',
      200,
      owner.cookie,
      'POST',
      sharing(),
    )
  ).json()) as any;
  const publicHtml = await (await request('Shared plan readable', share.url, 200)).text();
  if (
    !publicHtml.includes('Public museum fixture') ||
    /Private staging|Private booking|2026-11-02/.test(publicHtml)
  )
    throw Error('The reviewed snapshot leaked an excluded field.');
  checks.push({
    name: 'Shared snapshot has generic privacy-safe social metadata',
    ok:
      publicHtml.includes('property="og:title" content="Shared Korea trip plan"') &&
      publicHtml.includes('name="robots" content="noindex') &&
      publicHtml.includes('rel="canonical" href="' + new URL(share.url, base).href + '"'),
  });
  const stale = sharing();
  planData = {
    ...planData,
    notes: 'Later private edit',
    items: planData.items.map((s) => ({ ...s, place: 'Later private place' })),
  };
  await request('Owner updates private plan', '/api/plans/' + plan.id, 200, owner.cookie, 'PUT', {
    title: 'Later private title',
    data: planData,
  });
  if (
    (await (await request('Snapshot is independent of private edits', share.url, 200)).text()) !==
    publicHtml
  )
    throw Error('A private edit changed the public snapshot.');
  await request(
    'Outdated sharing preview rejected',
    '/api/plans/' + plan.id + '/share',
    409,
    owner.cookie,
    'POST',
    stale,
  );
  planTitle = 'Later private title';
  const replacement = (await (
    await request(
      'Rotate shared link',
      '/api/plans/' + plan.id + '/share',
      200,
      owner.cookie,
      'POST',
      sharing(),
    )
  ).json()) as any;
  await request('Rotated old link rejected', share.url, 404);
  await request('Replacement share works', replacement.url, 200);
  await request(
    'Revoke shared link',
    '/api/plans/' + plan.id + '/share',
    200,
    owner.cookie,
    'DELETE',
    {},
  );
  await request('Revoked share rejected', replacement.url, 404);
  await request('First like', '/api/reactions/plan-first-trip', 200, owner.cookie, 'PUT', {});
  await request(
    'Duplicate like is idempotent',
    '/api/reactions/plan-first-trip',
    200,
    owner.cookie,
    'PUT',
    {},
  );
  const likes = (await (
    await request('Read like count', '/api/reactions/plan-first-trip', 200, owner.cookie)
  ).json()) as any;
  checks.push({
    name: 'Unique account-target like count',
    ok: likes.count === 1,
  });
  await request(
    'Contribution rejects an invalid anti-spam token',
    '/api/contributions',
    services.spam ? 400 : 503,
    owner.cookie,
    'POST',
    {
      kind: 'question',
      title: 'Disposable travel question',
      body: 'Test only. This must not be published.',
      turnstileToken: 'invalid',
    },
  );
  remote(
    `INSERT INTO contribution(id,profile_id,kind,title,body,status) VALUES (${literal(runId)},${literal(profileId)},'question','Disposable test question','Test fixture only, never a real traveler contribution.','pending');`,
  );
  const before = (await (
    await request('Pending thread stays private', '/api/community', 200)
  ).json()) as any;
  checks.push({
    name: 'Unreviewed contribution absent',
    ok: !before.items.some((x: any) => x.id === runId),
  });
  await request(
    'Admin can publish after review',
    '/api/moderation/' + runId,
    200,
    administrator.cookie,
    'POST',
    { action: 'publish', reason: 'Disposable staging test', indexable: false },
  );
  const publishedHtml = await (
    await request('Published community SSR', '/community/posts/' + runId, 200)
  ).text();
  checks.push({
    name: 'Moderated community post has its own social identity',
    ok:
      publishedHtml.includes('property="og:title" content="Disposable test question"') &&
      publishedHtml.includes('rel="canonical" href="' + base + '/community/posts/' + runId + '"'),
  });
  const accountHtml = await (
    await request('Anonymous account page readable', '/community/account', 200)
  ).text();
  checks.push({
    name: 'Account page excludes public social metadata',
    ok: !/property="og:url"|rel="canonical"/.test(accountHtml),
  });
  await request('Admin can hide', '/api/moderation/' + runId, 200, administrator.cookie, 'POST', {
    action: 'hide',
    reason: 'Disposable staging test',
  });
  await request('Hidden thread returns 404', '/community/posts/' + runId, 404);
  await request(
    'Admin can restore',
    '/api/moderation/' + runId,
    200,
    administrator.cookie,
    'POST',
    { action: 'restore', reason: 'Disposable staging test' },
  );
  const cached = await request(
    'Cached auth session issued',
    '/api/auth/get-session',
    200,
    owner.cookie,
  );
  const cachedCookie = cached.headers
    .getSetCookie()
    .map((s) => s.split(';')[0])
    .join('; ');
  const ownerCached = owner.cookie + '; ' + cachedCookie;
  remote(
    `UPDATE session SET createdAt=${Date.now() - 86_400_000} WHERE userId=${literal(owner.id)};`,
  );
  await request('Old session cannot delete account', '/api/account', 401, ownerCached, 'DELETE', {
    confirm: 'DELETE MY ACCOUNT',
    contributions: 'anonymize',
  });
  remote(
    `UPDATE session SET createdAt=${Date.now()} WHERE userId=${literal(owner.id)}; UPDATE profile SET blocked=1 WHERE id=${literal(profileId)};`,
  );
  await request('Blocked user can delete own account', '/api/account', 200, ownerCached, 'DELETE', {
    confirm: 'DELETE MY ACCOUNT',
    contributions: 'anonymize',
  });
  await request('Deleted account session revoked', '/api/me', 401, ownerCached);
  const remaining = remote(
    `SELECT COUNT(*) AS n FROM plan WHERE id=${literal(planId)}; SELECT COUNT(*) AS n FROM session WHERE userId=${literal(owner.id)};`,
    true,
  );
  checks.push({
    name: 'Private plan and session rows removed',
    ok: remaining.every((r: any) => r.results[0].n === 0),
  });
  for (let i = 0; i < 6; i++) await request('Warm public read ' + (i + 1), '/api/community', 200);
} catch (e) {
  failure = (e as Error).message;
} finally {
  if (fixtureIds.length) {
    try {
      const ids = fixtureIds.map(literal).join(',');
      remote(
        `DELETE FROM contribution WHERE id=${literal(runId)}; DELETE FROM profile WHERE auth_user_id IN (${ids}); DELETE FROM user WHERE id IN (${ids}); DELETE FROM moderation_log WHERE target_id=${literal(runId)};`,
      );
    } catch {
      failure = (failure ? failure + '; ' : '') + 'Disposable staging cleanup needs review.';
    }
  }
  await platform.dispose();
  const report = {
    at: new Date().toISOString(),
    base,
    database: stage.d1_databases[0].database_name,
    runId,
    checks,
    passed: checks.every((x) => x.ok) && !failure,
    failure,
    scope:
      'Disposable DB sessions test the deployed server, not a real Google or email login. wallMs is elapsed time, not CPU. Read Cloudflare request CPU telemetry separately.',
  };
  fs.writeFileSync(
    path.join(privateRoot, 'reports/staging-probe-latest.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
  console.log(
    JSON.stringify({
      passed: report.passed,
      checks: checks.length,
      failure: failure || null,
    }),
  );
  if (!report.passed) process.exitCode = 1;
}
