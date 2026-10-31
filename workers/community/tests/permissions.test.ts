import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getPlatformProxy } from 'wrangler';
import { serializeSignedCookie } from 'better-call';
import { app } from '../src/index';
import { auth } from '../src/auth';
import { authOptions } from '../src/auth';
import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import { hash, sendLogin, turnstile, rate } from '../src/security';
import type { Env } from '../src/env';
import { normalizePlan } from '../../../lib/itinerary';
test('D1 ownership, duplicate reactions, moderation, public-share revocation and account deletion', async () => {
  const platform = await getPlatformProxy({ persist: false });
  const env = {
    ...platform.env,
    SITE_URL: 'http://localhost:8787',
    COMMUNITY_ENABLED: 'true',
    BETTER_AUTH_SECRET: 'local-integration-test-secret-at-least-32-bytes',
    MAIL_DAILY_LIMIT: '90',
    MAIL_MONTHLY_LIMIT: '2700',
    ADMIN_EMAILS: 'admin@example.invalid',
  } as Env;
  try {
    for (const file of [
      '0001_auth.sql',
      '0002_community.sql',
      '0003_contribution_origin.sql',
      '0004_plan_share_snapshot.sql',
    ]) {
      const sql = readFileSync('migrations/' + file, 'utf8').replace(/^--.*$/gm, '');
      for (const statement of sql
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean))
        await env.DB.prepare(statement).run();
    }
    const context = await auth(env).$context;
    async function user(email: string) {
      const u = await context.internalAdapter.createUser(
        { name: 'Test traveler', email, emailVerified: true },
        { method: 'magic-link' },
      );
      const s = await context.internalAdapter.createSession(u.id, false);
      assert.ok(s);
      const cookie = (
        await serializeSignedCookie('better-auth.session_token', s.token, env.BETTER_AUTH_SECRET)
      ).split(';')[0];
      return { u, cookie };
    }
    const owner = await user('owner@example.invalid'),
      other = await user('other@example.invalid'),
      administrator = await user('admin@example.invalid');
    async function request(
      path: string,
      method = 'GET',
      data?: unknown,
      cookie = owner.cookie,
      origin = env.SITE_URL,
    ) {
      return app.request(
        env.SITE_URL + path,
        {
          method,
          headers: { cookie, origin, 'Content-Type': 'application/json' },
          body: data === undefined ? undefined : JSON.stringify(data),
        },
        env,
      );
    }
    let r = await request('/api/me');
    assert.equal(r.status, 200);
    const p = (await r.json()) as any;
    const cached = await request('/api/auth/get-session');
    const cachedCookies = cached.headers.getSetCookie().map((s) => s.split(';')[0]);
    assert.ok(cachedCookies.some((s) => s.includes('session_data')));
    owner.cookie += '; ' + cachedCookies.join('; ');
    let planData = normalizePlan({
      notes: 'Private booking code fixture',
      items: [
        {
          id: 'place-one',
          day: 1,
          time: '10:00',
          place: 'Public museum fixture',
          address: 'Private address fixture',
          note: 'Private stop note fixture',
        },
      ],
    });
    planData.startDate = '2026-11-02';
    let planTitle = 'Private test plan';
    const sharing = () => ({
      includeNotes: false,
      includeAddresses: false,
      includeDates: false,
      expectedTitle: planTitle,
      expectedData: JSON.stringify(planData),
    });
    r = await request('/api/plans', 'POST', {
      title: 'Private test plan',
      data: planData,
    });
    assert.equal(r.status, 201);
    const plan = (await r.json()) as any;
    assert.equal((await request('/api/plans/' + plan.id)).status, 200);
    assert.equal(
      (await request('/api/plans/' + plan.id, 'GET', undefined, other.cookie)).status,
      404,
    );
    assert.equal(
      (await request('/api/plans/' + plan.id, 'PUT', { title: 'Attack', data: {} }, other.cookie))
        .status,
      404,
    );
    assert.equal(
      (await request('/api/plans/' + plan.id + '/share', 'POST', {}, other.cookie)).status,
      404,
    );
    assert.equal((await request('/api/plans/' + plan.id + '/share', 'POST', {})).status, 400);
    assert.equal(
      (
        await request('/api/plans/' + plan.id + '/share', 'POST', {
          ...sharing(),
          expectedTitle: 'Unreviewed title',
        })
      ).status,
      409,
    );
    r = await request('/api/plans/' + plan.id + '/share', 'POST', sharing());
    assert.equal(r.status, 200);
    const share = (await r.json()) as any;
    const url = new URL(share.url);
    const sharedPath = url.pathname + url.search;
    const sharedResponse = await request(sharedPath);
    assert.equal(sharedResponse.status, 200);
    assert.equal(sharedResponse.headers.get('Referrer-Policy'), 'no-referrer');
    const publicHtml = await sharedResponse.text();
    assert.match(publicHtml, /name="robots" content="noindex,follow"/);
    assert.match(publicHtml, /property="og:title" content="Shared Korea trip plan"/);
    assert.match(publicHtml, /name="twitter:card" content="summary_large_image"/);
    assert.match(publicHtml, /Public museum fixture/);
    assert.doesNotMatch(publicHtml, /Private booking|Private address|Private stop note|2026-11-02/);
    const staleSharing = sharing();
    planData = {
      ...planData,
      notes: 'Later private booking code',
      items: planData.items.map((s) => ({ ...s, place: 'Later private place' })),
    };
    assert.equal(
      (
        await request('/api/plans/' + plan.id, 'PUT', {
          title: 'Later private title',
          data: planData,
        })
      ).status,
      200,
    );
    assert.equal(await (await request(sharedPath)).text(), publicHtml);
    assert.equal(
      (await request('/api/plans/' + plan.id + '/share', 'POST', staleSharing)).status,
      409,
    );
    planTitle = 'Later private title';
    const replacement = (await (
      await request('/api/plans/' + plan.id + '/share', 'POST', sharing())
    ).json()) as any;
    assert.equal((await request(sharedPath)).status, 404);
    const replacementUrl = new URL(replacement.url);
    assert.equal((await request(replacementUrl.pathname + replacementUrl.search)).status, 200);
    await request('/api/plans/' + plan.id + '/share', 'DELETE', {});
    assert.equal((await request(sharedPath)).status, 404);
    await request('/api/reactions/plan-first-trip', 'PUT', {});
    await request('/api/reactions/plan-first-trip', 'PUT', {});
    assert.equal(
      ((await (await request('/api/reactions/plan-first-trip')).json()) as any).count,
      1,
    );
    assert.equal(
      (
        await request(
          '/api/reactions/plan-first-trip',
          'PUT',
          {},
          owner.cookie,
          'https://evil.invalid',
        )
      ).status,
      403,
    );
    assert.equal((await request('/api/moderation')).status, 403);
    await env.DB.prepare(
      "INSERT INTO contribution(id,profile_id,kind,title,body,status) VALUES ('test-question',?,'question','A real test question','A sufficiently long test message','pending')",
    )
      .bind(p.id)
      .run();
    assert.equal(((await (await request('/api/community')).json()) as any).items.length, 0);
    assert.equal(
      (
        await request(
          '/api/moderation/test-question',
          'POST',
          { action: 'publish', reason: 'Verified test only', indexable: false },
          administrator.cookie,
        )
      ).status,
      200,
    );
    assert.equal(((await (await request('/api/community')).json()) as any).items.length, 1);
    // A published conversation may outlive its guide; replies retain the
    // parent's association even when that guide is absent from the catalog.
    await env.DB.prepare(
      "UPDATE contribution SET guide_id='guide:retired-fixture' WHERE id='test-question'",
    ).run();
    const previousFetch = globalThis.fetch;
    env.TURNSTILE_SECRET = 'local-test-only';
    try {
      globalThis.fetch = async () =>
        new Response(JSON.stringify({ success: true, hostname: 'localhost' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      const reply = await request('/api/contributions', 'POST', {
        kind: 'comment',
        parentId: 'test-question',
        guideId: 'guide:spoofed',
        body: 'A useful reply fixture.',
        turnstileToken: 'test-token',
      });
      assert.equal(reply.status, 201);
      const replyId = ((await reply.json()) as any).id;
      const storedReply = await env.DB.prepare(
        'SELECT guide_id, parent_id FROM contribution WHERE id=?',
      )
        .bind(replyId)
        .first<any>();
      assert.equal(storedReply.guide_id, 'guide:retired-fixture');
      assert.equal(storedReply.parent_id, 'test-question');
      const missing = await request('/api/contributions', 'POST', {
        kind: 'comment',
        parentId: 'not-a-published-parent',
        body: 'A useful reply fixture.',
        turnstileToken: 'test-token',
      });
      assert.equal(missing.status, 400);
    } finally {
      globalThis.fetch = previousFetch;
    }
    const publicPost = await (await request('/community/posts/test-question')).text();
    assert.match(
      publicPost,
      /rel="canonical" href="http:\/\/localhost:8787\/community\/posts\/test-question"/,
    );
    assert.match(publicPost, /property="og:title" content="A real test question"/);
    assert.match(publicPost, /name="robots" content="noindex,follow"/);
    const accountHtml = await (await request('/community/account?returnTo=PRIVATE')).text();
    assert.doesNotMatch(accountHtml, /property="og:url"|rel="canonical"/);
    assert.equal(
      (await request('/api/contributions/test-question', 'DELETE', {}, other.cookie)).status,
      200,
    );
    assert.equal(((await (await request('/api/community')).json()) as any).items.length, 1);
    r = await request('/api/plans/' + plan.id + '/share', 'POST', sharing());
    const oldShareUrl = new URL(((await r.json()) as any).url);
    const oldShare = oldShareUrl.pathname + oldShareUrl.search;
    await env.DB.prepare('UPDATE session SET createdAt=? WHERE userId=?')
      .bind(Date.now() - 86400000, owner.u.id)
      .run();
    assert.equal(
      (
        await request('/api/account', 'DELETE', {
          confirm: 'DELETE MY ACCOUNT',
          contributions: 'anonymize',
        })
      ).status,
      401,
    );
    await env.DB.prepare('UPDATE session SET createdAt=? WHERE userId=?')
      .bind(Date.now(), owner.u.id)
      .run();
    await env.DB.prepare('UPDATE profile SET blocked=1 WHERE id=?').bind(p.id).run();
    assert.equal(
      (
        await request('/api/account', 'DELETE', {
          confirm: 'DELETE MY ACCOUNT',
          contributions: 'anonymize',
        })
      ).status,
      200,
    );
    assert.equal((await request('/api/me')).status, 401);
    assert.equal(
      (await request('/api/plans', 'POST', { title: 'Stale session', data: {} })).status,
      401,
    );
    assert.equal((await request('/api/moderation')).status, 401);
    assert.equal((await request(oldShare)).status, 404);
    const remaining = await env.DB.prepare(
      "SELECT profile_id,status FROM contribution WHERE id='test-question'",
    ).first<any>();
    assert.equal(remaining.profile_id, null);
    assert.equal(remaining.status, 'published');
    assert.equal(
      (await env.DB.prepare('SELECT COUNT(*) AS n FROM session WHERE userId=?')
        .bind(owner.u.id)
        .first<any>())!.n,
      0,
    );
    assert.equal(
      (await env.DB.prepare('SELECT COUNT(*) AS n FROM plan WHERE profile_id=?')
        .bind(p.id)
        .first<any>())!.n,
      0,
    );
  } finally {
    await platform.dispose();
  }
});
test('mail reservations are atomic and fail closed when a free allowance is full', async () => {
  const p = await getPlatformProxy({ persist: false });
  try {
    const env = {
      ...p.env,
      MAIL_DAILY_LIMIT: '1',
      MAIL_MONTHLY_LIMIT: '1',
      RESEND_API_KEY: 'test',
      MAIL_FROM: 'test@example.invalid',
    } as Env;
    await env.DB.prepare(
      'CREATE TABLE mail_budget(month TEXT PRIMARY KEY,day TEXT,day_count INTEGER,month_count INTEGER)',
    ).run();
    const date = new Date().toISOString().slice(0, 10);
    await env.DB.prepare('INSERT INTO mail_budget VALUES (?,?,1,1)')
      .bind(date.slice(0, 7), date)
      .run();
    await assert.rejects(
      () => sendLogin(env, 'never-send@example.invalid', 'https://example.invalid'),
      /allowance/,
    );
  } finally {
    await p.dispose();
  }
});
test('magic links are hashed, expire and are consumed only once', async () => {
  const platform = await getPlatformProxy({ persist: false });
  const env = {
    ...platform.env,
    SITE_URL: 'http://localhost:8787',
    BETTER_AUTH_SECRET: 'isolated-auth-test-secret-at-least-32-characters',
  } as Env;
  try {
    for (const statement of readFileSync('migrations/0001_auth.sql', 'utf8')
      .replace(/^--.*$/gm, '')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean))
      await env.DB.prepare(statement).run();
    let link = '';
    const instance = betterAuth({
      ...authOptions(env),
      rateLimit: { enabled: false },
      plugins: [
        magicLink({
          storeToken: 'hashed',
          expiresIn: 300,
          sendMagicLink: async ({ url }) => {
            link = url;
          },
        }),
      ],
    });
    const send = () =>
      instance.handler(
        new Request(env.SITE_URL + '/api/auth/sign-in/magic-link', {
          method: 'POST',
          headers: { origin: env.SITE_URL, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'link-test@example.invalid',
            callbackURL: '/community/account',
          }),
        }),
      );
    assert.equal((await send()).status, 200);
    const token = new URL(link).searchParams.get('token')!;
    const stored = await env.DB.prepare('SELECT identifier,value FROM verification').all<any>();
    assert.ok(stored.results.length);
    assert.ok(!JSON.stringify(stored.results).includes(token));
    const first = await instance.handler(new Request(link));
    assert.equal(first.status, 302);
    assert.ok(first.headers.get('set-cookie')?.includes('session_token'));
    const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM session').first<any>();
    await instance.handler(new Request(link));
    assert.equal(
      (await env.DB.prepare('SELECT COUNT(*) AS n FROM session').first<any>())!.n,
      count!.n,
    );
    await send();
    await env.DB.prepare('UPDATE verification SET expiresAt=0').run();
    const expired = await instance.handler(new Request(link));
    assert.ok(expired.headers.get('location')?.includes('error'));
    assert.equal(
      (await env.DB.prepare('SELECT COUNT(*) AS n FROM session').first<any>())!.n,
      count!.n,
    );
  } finally {
    await platform.dispose();
  }
});
