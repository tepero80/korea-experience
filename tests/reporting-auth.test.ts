import test from 'node:test';
import assert from 'node:assert/strict';
import {
  desktopClient,
  REPORTING_SCOPES,
  assertReportingScopes,
  authorizationCode,
  mergeReportingTokens,
  safeReportingError,
} from '../scripts/reporting/auth';
import {
  protectReportingValue,
  unprotectReportingValue,
  prepareReportingDirectory,
} from '../scripts/reporting/private-store';

const installed = {
  client_id: '123-fixture.apps.googleusercontent.com',
  client_secret: 'not-a-real-secret',
  project_id: 'korea-experience-reporting',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
};
test('reporting setup accepts only the separate Desktop client and official OAuth endpoints', () => {
  assert.equal(desktopClient({ installed }).client_id, installed.client_id);
  for (const invalid of [
    { web: installed },
    { installed: { ...installed, token_uri: 'https://untrusted.example/token' } },
    { installed: { ...installed, auth_uri: 'http://accounts.google.com/o/oauth2/auth' } },
    { installed: { ...installed, client_secret: '' } },
    { installed: { ...installed, project_id: 'unrelated-project' } },
  ])
    assert.throws(() => desktopClient(invalid));
  assert.doesNotThrow(() => assertReportingScopes(REPORTING_SCOPES));
  assert.throws(() => assertReportingScopes(REPORTING_SCOPES.slice(0, 2)));
  assert.throws(() =>
    assertReportingScopes([...REPORTING_SCOPES, 'https://www.googleapis.com/auth/cloud-platform']),
  );
});
test('loopback code extraction binds one code to the exact callback and state', () => {
  const state = 'random-fixture-state';
  assert.equal(
    authorizationCode('/oauth/callback?state=' + state + '&code=fixture-code', state),
    'fixture-code',
  );
  for (const invalid of [
    '/other?state=' + state + '&code=fixture',
    '/oauth/callback?state=wrong&code=fixture',
    '/oauth/callback?state=' + state + '&state=' + state + '&code=fixture',
    '/oauth/callback?state=' + state + '&code=one&code=two',
    '/oauth/callback?state=' + state + '&error=access_denied',
  ])
    assert.throws(() => authorizationCode(invalid, state));
});
test('refresh responses retain the original offline token and sanitize failures', () => {
  assert.deepEqual(
    mergeReportingTokens(
      { refresh_token: 'fixture-offline', access_token: 'old', expiry_date: 1 },
      { access_token: 'new', expiry_date: 2 },
    ),
    { refresh_token: 'fixture-offline', access_token: 'new', expiry_date: 2 },
  );
  assert.equal(
    mergeReportingTokens({ refresh_token: 'fixture-offline' }, { refresh_token: undefined })
      .refresh_token,
    'fixture-offline',
  );
  const out = safeReportingError({
    message: 'PRIVATE',
    response: {
      status: 400,
      data: { error: 'invalid_grant', error_description: 'PRIVATE' },
      config: { headers: { Authorization: 'PRIVATE' } },
    },
  });
  assert.equal(out.reason, 'invalid_grant');
  assert.equal(JSON.stringify(out).includes('PRIVATE'), false);
  assert.equal(
    JSON.stringify(
      safeReportingError({ response: { data: { error: { token: 'PRIVATE' } } } }),
    ).includes('PRIVATE'),
    false,
  );
});
test(
  'Windows DPAPI encrypts and decrypts a harmless fixture for the current user',
  { skip: process.platform !== 'win32' },
  () => {
    prepareReportingDirectory();
    prepareReportingDirectory();
    const fixture = { purpose: 'nonsecret local round-trip fixture', number: 42 };
    const cipher = protectReportingValue(fixture);
    assert.ok(!cipher.includes(fixture.purpose));
    assert.deepEqual(unprotectReportingValue(cipher), fixture);
  },
);
