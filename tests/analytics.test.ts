import test from 'node:test';
import assert from 'node:assert/strict';
import { analyticsContext, analyticsEvent, publicAnalyticsPath } from '../lib/analytics-policy';
import {
  readAnalyticsPreference,
  saveAnalyticsPreference,
  setAnalyticsPageContext,
  track,
} from '../lib/analytics';

function browser<T>(
  run: (calls: unknown[][]) => T,
  options: {
    storageFails?: boolean;
    tagFails?: boolean;
    preference?: string;
    origin?: string;
    path?: string;
  } = {},
) {
  const calls: unknown[][] = [];
  const before = ['window', 'document'].map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );
  const path = options.path || '/tools/trip-budget';
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      location: { origin: options.origin || 'https://koreaexperience.com', pathname: path },
      localStorage: {
        setItem() {},
        getItem() {
          if (options.storageFails) throw Error('Storage denied');
          return options.preference ?? 'accepted';
        },
      },
      dispatchEvent() {
        return true;
      },
      gtag(...args: unknown[]) {
        if (options.tagFails) throw Error('Analytics blocked');
        calls.push(args);
      },
    },
  });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { referrer: 'https://example.com/private?email=private@example.com#token' },
  });
  setAnalyticsPageContext(path, 'https://example.com/private?email=private@example.com#token');
  try {
    return run(calls);
  } finally {
    for (const [key, descriptor] of before) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

test('analytics accepts only named public event fields and finite bounded values', () => {
  assert.deepEqual(
    analyticsEvent('tool_complete', {
      tool: 'trip-budget',
      email: 'private@example.com',
      note: 'PRIVATE',
    }),
    { tool: 'trip-budget' },
  );
  assert.deepEqual(
    analyticsEvent('related_guide_click', {
      content_id: 'plan-first-trip',
      target_id: 'guide:arrival',
      relation: 'prepare',
    }),
    { content_id: 'plan-first-trip', target_id: 'guide:arrival', relation: 'prepare' },
  );
  for (const name of ['unknown', 'toString', '__proto__'])
    assert.equal(analyticsEvent(name, {}), null);
  assert.equal(analyticsEvent('tool_complete', { tool: 'private custom itinerary title' }), null);
  assert.equal(
    analyticsEvent('guide_save', { content_id: 'private@example.com', category: 'plan-your-trip' }),
    null,
  );
  for (const term_count of [0, 1.5, Infinity, NaN, 101])
    assert.equal(analyticsEvent('search_no_results', { term_count, intent: 'unclassified' }), null);
  assert.equal(
    analyticsEvent('search_no_results', { term_count: 2, intent: 'raw private query' }),
    null,
  );
});

test('all event contexts strip private queries/fragments and exclude account, callback and share tokens', () => {
  assert.deepEqual(
    analyticsContext(
      '/tools/itinerary?note=PRIVATE#account-plan=secret',
      'https://accounts.google.com/callback?code=PRIVATE#token',
    ),
    {
      page_path: '/tools/itinerary',
      page_location: 'https://koreaexperience.com/tools/itinerary',
      page_referrer: 'https://accounts.google.com',
    },
  );
  assert.equal(
    analyticsContext(
      '/blog/arrival',
      'https://koreaexperience.com/community/shared/private-token?email=PRIVATE',
    )?.page_referrer,
    'https://koreaexperience.com',
  );
  for (const path of [
    '/community/account',
    '/community/shared/private-token',
    '/community/moderation',
    '/api/auth/callback/google',
    '/admin',
    '/someone@example.com',
  ])
    assert.equal(publicAnalyticsPath(path), null);
  assert.equal(analyticsContext('/blog/arrival', 'javascript:PRIVATE')?.page_referrer, '');
});

test('optional analytics never throws or consumes successful product actions when storage/tag fails', () => {
  for (const options of [
    { storageFails: true },
    { tagFails: true },
    { preference: 'essential' },
    { origin: 'https://preview.pages.dev' },
    { path: '/community/account' },
  ]) {
    browser((calls) => {
      assert.equal(track('tool_complete', { tool: 'trip-budget' }), false);
      assert.equal(calls.length, 0);
    }, options);
  }
  browser(() => assert.equal(readAnalyticsPreference(), null), { storageFails: true });
  assert.equal(track('tool_complete', { tool: 'trip-budget' }), false);
});

test('actual tracker queues only safe fields with current public route context', () => {
  browser((calls) => {
    setAnalyticsPageContext(
      '/tools/trip-budget',
      'https://koreaexperience.com/blog/arrival?token=PRIVATE',
    );
    assert.equal(track('tool_complete', { tool: 'trip-budget', note: 'PRIVATE' }), true);
    assert.deepEqual(calls, [
      [
        'event',
        'tool_complete',
        {
          tool: 'trip-budget',
          page_path: '/tools/trip-budget',
          page_location: 'https://koreaexperience.com/tools/trip-budget',
          page_referrer: 'https://koreaexperience.com/blog/arrival',
        },
      ],
    ]);
    assert.equal(JSON.stringify(calls).includes('PRIVATE'), false);
  });
});

test('a failed consent persistence still revokes a previous acceptance in the current view', () => {
  browser((calls) => {
    assert.equal(saveAnalyticsPreference('accepted'), true);
    assert.equal(track('tool_complete', { tool: 'trip-budget' }), true);
    const previous = calls.length;
    window.localStorage.setItem = () => {
      throw Error('Write denied');
    };
    assert.equal(saveAnalyticsPreference('essential'), false);
    assert.equal(readAnalyticsPreference(), 'essential');
    assert.equal(track('tool_complete', { tool: 'trip-budget' }), false);
    assert.equal(calls.length, previous);
    window.localStorage.setItem = () => {};
    assert.equal(saveAnalyticsPreference('accepted'), true);
  });
});
