import fs from 'node:fs';
import http from 'node:http';
import crypto from 'node:crypto';
import { OAuth2Client, CodeChallengeMethod } from 'google-auth-library';
import {
  desktopClient,
  REPORTING_SCOPES,
  REPORTING_TARGETS,
  assertReportingScopes,
  authorizationCode,
  reportingAccessToken,
  safeReportingError,
} from './reporting/auth';
import {
  clearPendingAuthorization,
  reportingStorePath,
  pendingAuthorizationPath,
  writePendingAuthorization,
  writeReportingSecret,
  readProtectedDesktopClient,
} from './reporting/private-store';

async function authorize(file?: string) {
  const client = desktopClient(
    file ? JSON.parse(fs.readFileSync(file, 'utf8')) : readProtectedDesktopClient(),
  );
  const state = crypto.randomBytes(32).toString('base64url');
  const server = http.createServer();
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw Error('Loopback callback could not start.');
  const host = `127.0.0.1:${address.port}`,
    redirectUri = `http://${host}/oauth/callback`;
  const oauth = new OAuth2Client({
    clientId: client.client_id,
    clientSecret: client.client_secret,
    redirectUri,
  });
  const pkce = await oauth.generateCodeVerifierAsync();
  const url = oauth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [...REPORTING_SCOPES],
    include_granted_scopes: false,
    state,
    code_challenge: pkce.codeChallenge,
    code_challenge_method: CodeChallengeMethod.S256,
  });
  const done = new Promise<void>((resolve, reject) => {
    let processing = false;
    const timeout = setTimeout(
      () => {
        clearPendingAuthorization();
        server.close();
        reject(Error('Reporting authorization timed out; no credentials replaced.'));
      },
      12 * 60 * 1000,
    );
    server.on('request', async (request, response) => {
      response.setHeader('Cache-Control', 'no-store');
      response.setHeader('Referrer-Policy', 'no-referrer');
      response.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      if (
        request.method !== 'GET' ||
        request.headers.host !== host ||
        !request.url?.startsWith('/oauth/callback?') ||
        processing
      ) {
        response.writeHead(400);
        response.end('Invalid reporting callback.');
        return;
      }
      let code: string;
      try {
        code = authorizationCode(request.url, state);
      } catch (error) {
        response.writeHead(400);
        response.end(
          'Reporting consent was declined or the callback did not match. No credentials were changed.',
        );
        if (
          error instanceof Error &&
          error.message === 'Reporting authorization was declined or unavailable.'
        ) {
          clearTimeout(timeout);
          clearPendingAuthorization();
          server.close();
          reject(Error('Reporting authorization was declined. No credentials were replaced.'));
        }
        return;
      }
      processing = true;
      try {
        const { tokens } = await oauth.getToken({
          code,
          codeVerifier: pkce.codeVerifier,
          redirect_uri: redirectUri,
        });
        if (!tokens.refresh_token || !tokens.access_token)
          throw Error('Offline reporting access was not granted.');
        const info = await oauth.getTokenInfo(tokens.access_token);
        assertReportingScopes(info.scopes);
        writeReportingSecret({
          version: 1,
          client,
          tokens,
          scopes: info.scopes,
          authorizedAt: new Date().toISOString(),
        });
        response.end('Korea Experience reporting consent saved locally. You may close this tab.');
        clearTimeout(timeout);
        clearPendingAuthorization();
        server.close();
        resolve();
      } catch {
        response.writeHead(500);
        response.end('Reporting connection failed. No token details are shown.');
        clearTimeout(timeout);
        clearPendingAuthorization();
        server.close();
        reject(Error('Reporting code exchange or scope validation failed.'));
      }
    });
  });
  writePendingAuthorization({
    url,
    createdAt: new Date().toISOString(),
    expiresInSeconds: 720,
    scopes: REPORTING_SCOPES,
    targets: REPORTING_TARGETS,
  });
  console.log(
    'Loopback reporting authorization is ready. Open the private pending-authorization URL only after owner consent. No browser was opened.',
  );
  await done;
  console.log(
    'Reporting credentials saved with Windows user DPAPI and a current-user-only directory ACL.',
  );
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--refresh-check')) {
    const token = await reportingAccessToken(true);
    console.log(
      JSON.stringify({
        connected: Boolean(token),
        forcedRefreshFromPersistedCredentials: Boolean(token),
        targets: REPORTING_TARGETS,
      }),
    );
    if (!token) process.exitCode = 1;
    return;
  }
  const file = args.find((a) => a.startsWith('--client-json='))?.slice('--client-json='.length);
  if ((!file && !args.includes('--protected-client')) || !args.includes('--authorize')) {
    console.log(
      'Owner-approved setup: --authorize --client-json=<Desktop JSON path>. Separate-process check: --refresh-check.',
    );
    console.log(
      JSON.stringify({
        protectedCredentialsPresent: fs.existsSync(reportingStorePath),
        pendingAuthorizationPresent: fs.existsSync(pendingAuthorizationPath),
        scopes: REPORTING_SCOPES,
        targets: REPORTING_TARGETS,
      }),
    );
    return;
  }
  await authorize(file);
}
main().catch((error: unknown) => {
  console.error(JSON.stringify(safeReportingError(error)));
  process.exitCode = 1;
});
