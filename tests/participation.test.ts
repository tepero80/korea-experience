import test from 'node:test';
import assert from 'node:assert/strict';
import { safeReturnTo } from '../lib/return-to';
import { readGuideDraft, writeGuideDraft } from '../lib/guide-drafts';
test('sign-in returns only to public same-origin destinations and strips private queries', () => {
  const origin = 'https://koreaexperience.com';
  assert.equal(
    safeReturnTo('/blog/arrival-guide?token=secret#discussion', origin),
    '/blog/arrival-guide#discussion',
  );
  assert.equal(safeReturnTo('/tools/itinerary?plan=private', origin), '/tools/itinerary');
  for (const input of [
    '//evil.example/',
    'https://evil.example/blog/guide',
    '/\\evil.example',
    '/api/auth/callback/google',
    '/community/shared?token=private',
    '/blog/%2f%2fevil',
    '/blog/good\nLocation: evil',
    'https://user:password@koreaexperience.com/blog/guide',
  ])
    assert.equal(safeReturnTo(input, origin), '/community/account');
});
test('guide drafts survive a new view, remain separate, expire and preserve unknown storage versions', () => {
  const values = new Map<string, string>();
  const store = {
    getItem: (key: string) => values.get(key) || null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
  const now = 1793400000000;
  writeGuideDraft(store, 'guide-one', 'A question about late arrival', now);
  writeGuideDraft(store, 'guide-two', 'A separate family question', now + 1);
  assert.equal(readGuideDraft(store, 'guide-one', now + 100), 'A question about late arrival');
  writeGuideDraft(store, 'guide-one', '', now + 200);
  assert.equal(readGuideDraft(store, 'guide-two', now + 300), 'A separate family question');
  assert.equal(readGuideDraft(store, 'guide-two', now + 8 * 24 * 60 * 60 * 1000), '');
  values.set('ke-guide-drafts-v1', '{"version":99,"drafts":[]}');
  assert.throws(() => writeGuideDraft(store, 'guide-one', 'Do not overwrite', now));
  assert.equal(values.get('ke-guide-drafts-v1'), '{"version":99,"drafts":[]}');
});
