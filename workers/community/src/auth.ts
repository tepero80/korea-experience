import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import { sendLogin } from './security';
import type { Env } from './env';
export function authOptions(env: Env) {
  return {
    database: env.DB,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.SITE_URL,
    basePath: '/api/auth',
    advanced: { ipAddress: { ipAddressHeaders: ['cf-connecting-ip'] } },
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
const instances = new WeakMap<object, ReturnType<typeof createAuth>>();
export function auth(env: Env) {
  let instance = instances.get(env.DB);
  if (!instance) {
    instance = createAuth(env);
    instances.set(env.DB, instance);
  }
  return instance;
}
