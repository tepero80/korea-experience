import crypto from 'node:crypto';
import { OAuth2Client, type Credentials } from 'google-auth-library';
import { readReportingSecret, writeReportingSecret } from './private-store';

export const REPORTING_SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/adsense.readonly',
] as const;
export const REPORTING_TARGETS = {
  project: 'korea-experience-reporting',
  site: 'sc-domain:koreaexperience.com',
  host: 'koreaexperience.com',
  property: '522514411',
  adsense: 'accounts/pub-7793293419727384',
} as const;
export interface DesktopClient {
  client_id: string;
  client_secret: string;
  project_id: string;
}
export interface ReportingCredentials {
  version: 1;
  client: DesktopClient;
  tokens: Credentials;
  scopes: string[];
  authorizedAt: string;
}

export function desktopClient(input: unknown): DesktopClient {
  const data = input as { installed?: Record<string, unknown>; web?: unknown };
  const client = data?.installed;
  if (
    data?.web ||
    !client ||
    typeof client.client_id !== 'string' ||
    !/^[a-zA-Z0-9_-]+\.apps\.googleusercontent\.com$/.test(client.client_id) ||
    typeof client.client_secret !== 'string' ||
    !client.client_secret ||
    typeof client.project_id !== 'string' ||
    client.project_id !== REPORTING_TARGETS.project ||
    ![
      'https://accounts.google.com/o/oauth2/auth',
      'https://accounts.google.com/o/oauth2/v2/auth',
    ].includes(String(client.auth_uri)) ||
    client.token_uri !== 'https://oauth2.googleapis.com/token'
  )
    throw Error(
      'Use the downloaded Desktop OAuth client JSON from the dedicated reporting project.',
    );
  return {
    client_id: client.client_id,
    client_secret: client.client_secret,
    project_id: client.project_id,
  };
}

export function assertReportingScopes(scopes: readonly string[]) {
  if (
    REPORTING_SCOPES.some((s) => !scopes.includes(s)) ||
    scopes.some((s) => !REPORTING_SCOPES.includes(s as (typeof REPORTING_SCOPES)[number]))
  )
    throw Error('Exactly the three reporting read-only scopes must be granted.');
}

export function mergeReportingTokens(previous: Credentials, update: Credentials): Credentials {
  return {
    ...previous,
    ...Object.fromEntries(
      Object.entries(update).filter(([, value]) => value !== undefined && value !== null),
    ),
    refresh_token: update.refresh_token || previous.refresh_token,
  };
}

export function authorizationCode(raw: string, expectedState: string) {
  const url = new URL(raw, 'http://127.0.0.1');
  const state = url.searchParams.get('state') || '';
  const a = Buffer.from(state),
    b = Buffer.from(expectedState);
  if (
    url.pathname !== '/oauth/callback' ||
    url.searchParams.getAll('state').length !== 1 ||
    a.length !== b.length ||
    !crypto.timingSafeEqual(a, b)
  )
    throw Error('Invalid OAuth callback state.');
  if (url.searchParams.has('error'))
    throw Error('Reporting authorization was declined or unavailable.');
  const codes = url.searchParams.getAll('code');
  if (codes.length !== 1 || !codes[0] || codes[0].length > 4096)
    throw Error('Missing or invalid authorization code.');
  return codes[0];
}

export function safeReportingError(error: unknown) {
  const e = error as { code?: string; response?: { status?: number; data?: { error?: unknown } } };
  const kind = e?.response?.data?.error;
  const known = ['invalid_grant', 'access_denied', 'invalid_client'];
  return {
    status: 'unavailable' as const,
    httpStatus: e?.response?.status,
    reason:
      typeof kind === 'string' && known.includes(kind)
        ? kind
        : 'Reporting authorization or request failed. Details withheld to protect credentials.',
  };
}

export function savedReportingCredentials(): ReportingCredentials | null {
  const saved = readReportingSecret() as ReportingCredentials | null;
  if (!saved) return null;
  if (saved.version !== 1 || !saved.tokens?.refresh_token || !saved.client?.client_id)
    throw Error('Protected reporting credentials are incomplete.');
  assertReportingScopes(saved.scopes);
  return saved;
}

export async function reportingAccessToken(forceRefresh = false): Promise<string | null> {
  const saved = savedReportingCredentials();
  if (!saved) return null;
  const client = new OAuth2Client({
    clientId: saved.client.client_id,
    clientSecret: saved.client.client_secret,
  });
  client.setCredentials(
    forceRefresh ? { refresh_token: saved.tokens.refresh_token } : saved.tokens,
  );
  client.on('tokens', (tokens) => {
    saved.tokens = mergeReportingTokens(saved.tokens, tokens);
    writeReportingSecret(saved);
  });
  const token = (await client.getAccessToken()).token;
  if (!token) throw Error('A reporting access token was not returned.');
  return token;
}
