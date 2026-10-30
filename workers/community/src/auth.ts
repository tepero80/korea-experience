import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import { Problem, rate, sendLogin } from './security';
import type { Env } from './env';
export function authOptions(env: Env) {
  return {
    database: env.DB,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.SITE_URL,
    basePath: '/api/auth',
    logger: {
      level: 'error' as const,
      // Preserve failure signals without provider payloads, codes, emails or tokens.
      log: () => console.error('authentication_request_failed'),
    },
    advanced: {
      // Schema is checked against the pinned migration before deployment and on restored exports.
      database: { validateSchema: false },
      ipAddress: { ipAddressHeaders: ['cf-connecting-ip'] },
    },
    trustedOrigins: [env.SITE_URL],
    emailAndPassword: { enabled: false },
    socialProviders:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? { google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET } }
        : {},
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: true, maxAge: 120 },
    },
    rateLimit: { enabled: true, storage: 'database' as const, window: 60, max: 30 },
    plugins: [
      magicLink({
        storeToken: 'hashed',
        expiresIn: 300,
        rateLimit: { window: 60, max: 3 },
        sendMagicLink: async ({ email, url }) => sendLogin(env, email, url),
      }),
    ],
  };
}
const createAuth = (env: Env) => betterAuth(authOptions(env));
const instances = new WeakMap<
  object,
  {
    values: Array<string | undefined>;
    instance: ReturnType<typeof createAuth>;
  }
>();
let initialized = 0;
export function auth(env: Env) {
  const values = [
    env.SITE_URL,
    env.BETTER_AUTH_SECRET,
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.RESEND_API_KEY,
    env.MAIL_FROM,
    env.MAIL_DAILY_LIMIT,
    env.MAIL_MONTHLY_LIMIT,
  ];
  let cached = instances.get(env.DB);
  if (!cached || values.some((value, index) => value !== cached!.values[index])) {
    cached = { values, instance: createAuth(env) };
    instances.set(env.DB, cached);
    if (env.SITE_URL === 'https://korea-experience-community-staging.yeomds.workers.dev')
      console.info('auth_instance_initialized', { instance: ++initialized });
  }
  return cached.instance;
}

// Use the documented server API for this deliberately small HTTP surface. Building
// Better Auth's general-purpose HTTP router on every invocation exceeds Free CPU
// on cold requests. Its endpoint pipeline still validates schemas, OAuth state,
// tokens and cookies, and creates a separate context for every call.
// This app has only the magic-link plugin (no onRequest/onResponse plugin hooks).
// Hono enforces JSON, same-origin writes and body size; these atomic limits also
// protect GET callbacks, since server API calls do not run HTTP router rate limits.
export async function authRequest(request: Request, env: Env, data?: Record<string, unknown>) {
  await rate(env, request, 'auth', 30);
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams);
  for (const field of ['callbackURL', 'newUserCallbackURL', 'errorCallbackURL', 'redirectTo']) {
    const value = data?.[field] ?? query[field];
    if (value !== undefined) {
      let allowed = false;
      try {
        allowed =
          typeof value === 'string' &&
          new URL(value, env.SITE_URL).origin === new URL(env.SITE_URL).origin;
      } catch {}
      if (!allowed) throw new Problem(403, 'Sign-in return address rejected.');
    }
  }
  const api = auth(env).api;
  const input = { request, headers: request.headers, asResponse: true as const };
  switch (request.method + ' ' + url.pathname) {
    case 'POST /api/auth/sign-in/social':
      if (data?.provider !== 'google' || data.idToken)
        throw new Problem(400, 'Choose Google sign-in.');
      return api.signInSocial({
        ...input,
        body: data as NonNullable<Parameters<typeof api.signInSocial>[0]>['body'],
      });
    case 'POST /api/auth/sign-in/magic-link':
      return api.signInMagicLink({
        ...input,
        body: data as NonNullable<Parameters<typeof api.signInMagicLink>[0]>['body'],
      });
    case 'GET /api/auth/magic-link/verify':
      await rate(env, request, 'email-verify', 3);
      return api.magicLinkVerify({
        ...input,
        query: query as NonNullable<Parameters<typeof api.magicLinkVerify>[0]>['query'],
      });
    case 'GET /api/auth/callback/google':
      return api.callbackOAuth({ ...input, params: { id: 'google' }, query });
    case 'GET /api/auth/get-session':
      return api.getSession({ ...input, query });
    case 'POST /api/auth/sign-out':
      return api.signOut(input);
    case 'GET /api/auth/error':
      return Response.redirect(env.SITE_URL + '/community/account?error=SIGN_IN_FAILED', 302);
    default:
      return new Response('Not found', { status: 404 });
  }
}
