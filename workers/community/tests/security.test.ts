import test from 'node:test';
import assert from 'node:assert/strict';
import { getPlatformProxy } from 'wrangler';
import { turnstile, sendLogin, rate } from '../src/security';
import type { Env } from '../src/env';
import { app } from '../src/index';
test('Turnstile rejects incorrect hostnames, invalid tokens and network failures; the app enforces it on email login', async () => {
  const platform = await getPlatformProxy({ persist: false });
  const savedFetch = globalThis.fetch;
  const env = {
    ...platform.env,
    SITE_URL: 'http://localhost:8787',
    COMMUNITY_ENABLED: 'true',
    BETTER_AUTH_SECRET: 'test-secret-at-least-thirty-two-characters',
    TURNSTILE_SECRET: 'test-only',
  } as Env;
  const request = new Request(env.SITE_URL + '/api/auth/sign-in/magic-link', {
    method: 'POST',
    headers: { origin: env.SITE_URL, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.invalid', turnstileToken: 'test-token' }),
  });
  try {
    await env.DB.prepare(
      'CREATE TABLE request_limit(id TEXT PRIMARY KEY,count INTEGER,expires_at INTEGER)',
    ).run();
    globalThis.fetch = async () => Response.json({ success: true, hostname: 'wrong.invalid' });
    await assert.rejects(() => turnstile(env, request, 'test'), /verification failed/);
    globalThis.fetch = async () => Response.json({ success: false });
    assert.equal((await app.fetch(request, env)).status, 400);
    globalThis.fetch = async () => {
      throw new Error('Network failure');
    };
    await assert.rejects(() => turnstile(env, request, 'test'), /temporarily unavailable/);
    globalThis.fetch = async () => Response.json({ success: true, hostname: 'localhost' });
    await turnstile(env, request, 'test');
  } finally {
    globalThis.fetch = savedFetch;
    await platform.dispose();
  }
});
test('parallel rate and email reservations cannot exceed their allowance', async () => {
  const p = await getPlatformProxy({ persist: false }),
    savedFetch = globalThis.fetch;
  const env = {
    ...p.env,
    SITE_URL: 'http://localhost:8787',
    BETTER_AUTH_SECRET: 'test-secret-at-least-thirty-two-characters',
    MAIL_DAILY_LIMIT: '1',
    MAIL_MONTHLY_LIMIT: '2',
    RESEND_API_KEY: 'fake-test-only',
    MAIL_FROM: 'test@example.invalid',
  } as Env;
  try {
    await env.DB.prepare(
      'CREATE TABLE request_limit(id TEXT PRIMARY KEY,count INTEGER,expires_at INTEGER)',
    ).run();
    await env.DB.prepare(
      'CREATE TABLE mail_budget(month TEXT PRIMARY KEY,day TEXT,day_count INTEGER,month_count INTEGER)',
    ).run();
    const results = await Promise.allSettled(
      Array.from({ length: 10 }, () => rate(env, new Request(env.SITE_URL), 'test', 3)),
    );
    assert.equal(results.filter((r) => r.status === 'fulfilled').length, 3);
    let sent = 0;
    globalThis.fetch = async (_url, options) => {
      sent++;
      const data = JSON.parse(String(options?.body));
      assert.ok(data.text.includes('\n\n'));
      return Response.json({ id: 'test-message' });
    };
    const mail = await Promise.allSettled(
      Array.from({ length: 5 }, () =>
        sendLogin(env, 'nobody@example.invalid', 'https://example.invalid/sign-in'),
      ),
    );
    assert.equal(mail.filter((r) => r.status === 'fulfilled').length, 1);
    assert.equal(sent, 1);
  } finally {
    globalThis.fetch = savedFetch;
    await p.dispose();
  }
});
