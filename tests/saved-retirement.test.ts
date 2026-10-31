import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeAccountSaves } from '../lib/saved';

test('account saves remain visible when a guide is retired or absent from the catalog', () => {
  const local = [
    { id: 'local', slug: 'local', title: 'Local', category: 'Travel', savedAt: 'old' },
  ];
  const catalog = [{ id: 'live', slug: 'live', title: 'Live', category: 'Travel' }];
  const result = mergeAccountSaves(
    local,
    ['guide:retired-example', 'live', 'live', null],
    catalog,
    'now',
  );
  assert.deepEqual(
    result.map((item) => item.id),
    ['local', 'guide:retired-example', 'live'],
  );
  assert.equal(result[1].unavailable, true);
  assert.equal(result[1].slug, 'retired-example');
  assert.equal(result[2].title, 'Live');
  assert.equal(local.length, 1);
});
