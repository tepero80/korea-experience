import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { retiredResponse } from '../src/retirement-route';
import retirements from '../../../data/retirements.json';

test('each removed URL has an exact route for both production hostnames', () => {
  const config = readFileSync('wrangler.jsonc', 'utf8');
  for (const item of retirements.filter((entry) => entry.action === 'removed'))
    for (const host of ['koreaexperience.com', 'www.koreaexperience.com'])
      assert.ok(config.includes(`"pattern": "${host}/blog/${item.slug}"`));
});

test('only recorded removed URLs get a genuine no-store 404 without forwarding private query strings', async () => {
  let seen = '';
  const fakeFetch = async (url: string | URL | Request) => {
    seen = String(url);
    return new Response('<h1>Useful 404</h1>', { status: 404 });
  };
  const request = new Request(
    'https://koreaexperience.com/blog/korean-beauty-clinics-gangnam-skincare-guide?private=fixture',
  );
  const response = await retiredResponse(request, fakeFetch as typeof fetch);
  assert.equal(response?.status, 404);
  assert.equal(response?.headers.get('cache-control'), 'no-store');
  assert.equal(await response?.text(), '<h1>Useful 404</h1>');
  assert.equal(
    seen,
    'https://korea-experience.pages.dev/blog/korean-beauty-clinics-gangnam-skincare-guide',
  );
  assert.equal(
    await retiredResponse(
      new Request('https://koreaexperience.com/blog/a-live-guide'),
      fakeFetch as typeof fetch,
    ),
    null,
  );
  assert.equal(
    await retiredResponse(new Request(request.url, { method: 'POST' }), fakeFetch as typeof fetch),
    null,
  );
});

test('a missing Pages origin still returns an honest 404 and a path to current guides', async () => {
  const fail = async () => {
    throw new Error('offline');
  };
  const response = await retiredResponse(
    new Request(
      'https://koreaexperience.com/blog/revision-rhinoplasty-in-korea-why-foreigners-choose-seoul-for-second-chances-2026',
    ),
    fail as typeof fetch,
  );
  assert.equal(response?.status, 404);
  assert.match((await response?.text()) || '', /href="\/blog"/);
});
