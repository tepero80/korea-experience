import type { Env } from './env';
export class Problem extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export const uid = () => crypto.randomUUID();
export async function hash(value: string) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}
export function text(value: unknown, min: number, max: number, label: string) {
  if (typeof value !== 'string' || value.trim().length < min || value.length > max)
    throw new Problem(400, `${label} must contain ${min}–${max} characters.`);
  return value.trim();
}
export function isSameOrigin(request: Request, site: string) {
  return request.headers.get('origin') === new URL(site).origin;
}
export async function rate(
  env: Env,
  request: Request,
  scope: string,
  max: number,
  seconds = 60,
  subject?: string,
) {
  const now = Math.floor(Date.now() / 1000),
    bucket = Math.floor(now / seconds);
  const ip = subject ? 'member:' + subject : request.headers.get('CF-Connecting-IP') || 'local';
  const key = await hash(`${env.BETTER_AUTH_SECRET}:${ip}:${scope}:${bucket}`);
  const row = await env.DB.prepare(
    'INSERT INTO request_limit (id,count,expires_at) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET count=count+1 WHERE count<? RETURNING count',
  )
    .bind(key, now + seconds * 2, max)
    .first();
  if (!row) throw new Problem(429, 'Too many requests. Please try again later.');
}
export async function turnstile(env: Env, request: Request, token: unknown) {
  if (!env.TURNSTILE_SECRET) throw new Problem(503, 'Spam protection is not connected.');
  if (typeof token !== 'string' || !token.trim() || token.length > 2048)
    throw new Problem(400, 'Complete the anti-spam check.');
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    signal: AbortSignal.timeout(8000),
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET,
      response: token,
      remoteip: request.headers.get('CF-Connecting-IP') || '',
    }),
  }).catch(() => {
    throw new Problem(503, 'Anti-spam verification is temporarily unavailable. Try again.');
  });
  const result = (await response.json()) as { success: boolean; hostname?: string };
  if (!result.success || result.hostname !== new URL(env.SITE_URL).hostname)
    throw new Problem(400, 'Anti-spam verification failed. Try again.');
}
export async function sendLogin(env: Env, email: string, url: string) {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM)
    throw new Problem(503, 'Email login is not connected. Use Google when available.');
  const today = new Date().toISOString().slice(0, 10),
    month = today.slice(0, 7),
    daily = Math.min(90, Number(env.MAIL_DAILY_LIMIT) || 90),
    monthly = Math.min(2700, Number(env.MAIL_MONTHLY_LIMIT) || 2700);
  const reserve = await env.DB.prepare(
    `INSERT INTO mail_budget (month,day,day_count,month_count) VALUES (?,?,1,1) ON CONFLICT(month) DO UPDATE SET day=?,day_count=CASE WHEN day=? THEN day_count+1 ELSE 1 END,month_count=month_count+1 WHERE month_count<? AND (day<>? OR day_count<?) RETURNING month_count`,
  )
    .bind(month, today, today, today, monthly, today, daily)
    .first();
  if (!reserve)
    throw new Problem(
      429,
      'The free email allowance is temporarily full. Try Google login or return later.',
    );
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    signal: AbortSignal.timeout(8000),
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [email],
      subject: 'Your Korea Experience sign-in link',
      text: `Sign in to Korea Experience using this link within five minutes:\n\n${url}\n\nIf you did not request this, ignore the email. Do not share this link.`,
    }),
  });
  if (!response.ok)
    throw new Problem(503, 'The sign-in email could not be delivered. Try again later.');
}
