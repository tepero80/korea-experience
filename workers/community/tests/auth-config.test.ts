import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getPlatformProxy } from 'wrangler';
import { app } from '../src/index';
import type { Env } from '../src/env';

test('an updated provider configuration takes effect on the next authentication request', async () => {
  const platform = await getPlatformProxy({ persist: false });
  const env = {
    ...platform.env,
    SITE_URL: 'http://localhost:8787',
    COMMUNITY_ENABLED: 'true',
    BETTER_AUTH_SECRET: 'auth-config-regression-fixture-at-least-32-bytes',
    GOOGLE_CLIENT_ID: 'before-change.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: 'local-test-only-not-a-real-credential',
    MAIL_DAILY_LIMIT: '90',
    MAIL_MONTHLY_LIMIT: '2700',
  } as Env;
  try {
    for (const file of ['0001_auth.sql', '0002_community.sql', '0003_contribution_origin.sql'])
      for (const statement of readFileSync('migrations/' + file, 'utf8')
        .replace(/^--.*$/gm, '')
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean))
        await env.DB.prepare(statement).run();
    async function requestedClient() {
      const response = await app.request(
        env.SITE_URL + '/api/auth/sign-in/social',
        {
          method: 'POST',
          headers: {
            origin: env.SITE_URL,
            'Content-Type': 'application/json',
            'cf-connecting-ip': '127.0.0.1',
          },
          body: JSON.stringify({ provider: 'google', callbackURL: '/community/account' }),
        },
        env,
      );
      assert.equal(response.status, 200);
      const body = (await response.json()) as { url: string };
      return new URL(body.url).searchParams.get('client_id');
    }
    assert.equal(await requestedClient(), env.GOOGLE_CLIENT_ID);
    env.GOOGLE_CLIENT_ID = 'after-change.apps.googleusercontent.com';
    assert.equal(await requestedClient(), env.GOOGLE_CLIENT_ID);
    async function post(data: unknown, origin = env.SITE_URL) {
      return app.request(
        env.SITE_URL + '/api/auth/sign-in/social',
        {
          method: 'POST',
          headers: { origin, 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
        env,
      );
    }
    for (const callbackURL of [
      'https://elsewhere.invalid/',
      '//elsewhere.invalid/',
      'javascript:alert(1)',
    ])
      assert.equal((await post({ provider: 'google', callbackURL })).status, 403);
    assert.equal((await post({ provider: 'google' }, 'https://elsewhere.invalid')).status, 403);
    assert.equal(
      (await post({ provider: 'google', idToken: { token: 'not-an-oauth-flow' } })).status,
      400,
    );
    assert.equal((await app.request(env.SITE_URL + '/api/auth/sign-out', {}, env)).status, 404);
    assert.equal(
      (await app.request(env.SITE_URL + '/api/auth/get-access-token', {}, env)).status,
      404,
    );
    assert.equal(
      (
        await app.request(
          env.SITE_URL +
            '/api/auth/magic-link/verify?token=invalid&callbackURL=https://elsewhere.invalid',
          {},
          env,
        )
      ).status,
      403,
    );
    const badState = await app.request(
      env.SITE_URL + '/api/auth/callback/google?code=invalid&state=invalid',
      {},
      env,
    );
    assert.equal(badState.status, 302);
    assert.equal(new URL(badState.headers.get('location')!).origin, env.SITE_URL);
  } finally {
    await platform.dispose();
  }
});
