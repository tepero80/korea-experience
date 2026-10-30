export type Env = {
  DB: D1Database;
  SITE_URL: string;
  COMMUNITY_ENABLED: string;
  BETTER_AUTH_SECRET: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  TURNSTILE_SECRET?: string;
  TURNSTILE_SITE_KEY?: string;
  MAIL_DAILY_LIMIT: string;
  MAIL_MONTHLY_LIMIT: string;
  ADMIN_EMAILS?: string;
};
