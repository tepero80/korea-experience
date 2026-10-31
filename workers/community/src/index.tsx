import { Hono, type Context } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { bodyLimit } from 'hono/body-limit';
import { auth, authRequest } from './auth';
import type { Env } from './env';
import { Problem, hash, isSameOrigin, rate, text, turnstile, uid } from './security';
import contentIds from '../../../data/content-ids.json';
import { safeReturnTo } from '../../../lib/return-to';
import { communityStyles } from './styles';
import {
  accountPlanData,
  normalizePlan,
  publicPlanData,
  type ItineraryPlan,
} from '../../../lib/itinerary';
const guides = new Set(contentIds);
type Profile = { id: string; name: string; blocked: number };
type App = { Bindings: Env };
type C = Context<App>;
const app = new Hono<App>();
app.use(
  '*',
  bodyLimit({ maxSize: 20000, onError: (c) => c.json({ error: 'Request too large.' }, 413) }),
);
app.use(
  '*',
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://challenges.cloudflare.com'],
      styleSrc: ["'self'"],
      fontSrc: ["'self'", 'https://koreaexperience.com'],
      imgSrc: ["'self'", 'https://koreaexperience.com'],
      connectSrc: ["'self'", 'https://challenges.cloudflare.com'],
      frameSrc: ['https://challenges.cloudflare.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
    referrerPolicy: 'no-referrer',
    xFrameOptions: 'DENY',
    xContentTypeOptions: 'nosniff',
  }),
);
app.use('*', async (c, next) => {
  c.header('Cache-Control', 'no-store');
  if (c.env.SITE_URL !== 'https://koreaexperience.com')
    c.header('X-Robots-Tag', 'noindex, nofollow');
  if (c.env.COMMUNITY_ENABLED !== 'true')
    return c.json({ error: 'Community is not connected yet.' }, 503);
  if (!c.env.BETTER_AUTH_SECRET || c.env.BETTER_AUTH_SECRET.length < 32)
    return c.json({ error: 'Authentication is unavailable.' }, 503);
  if (!['GET', 'HEAD', 'OPTIONS'].includes(c.req.method)) {
    if (!isSameOrigin(c.req.raw, c.env.SITE_URL))
      throw new Problem(403, 'Request origin rejected.');
    if (Number(c.req.header('Content-Length') || 0) > 20000)
      throw new Problem(413, 'Request too large.');
    if (!(c.req.header('Content-Type') || '').startsWith('application/json'))
      throw new Problem(415, 'Use JSON for this request.');
    await rate(c.env, c.req.raw, 'write', 30);
  }
  await next();
});
app.onError((e, c) => {
  if (e instanceof Problem) return c.json({ error: e.message }, e.status as 400);
  console.error('community_request_failed', { path: c.req.path, error: e.name });
  return c.json({ error: 'This request could not be completed. Please try again.' }, 500);
});
async function body(c: C) {
  const raw = await c.req.text();
  if (raw.length > 16000) throw new Problem(413, 'Request too large.');
  try {
    return JSON.parse(raw);
  } catch {
    throw new Problem(400, 'Invalid JSON.');
  }
}
async function session(c: C) {
  const result = await auth(c.env).api.getSession({
    headers: c.req.raw.headers,
    query: { disableCookieCache: true },
  });
  if (!result?.user || !result.user.emailVerified) throw new Problem(401, 'Sign in to continue.');
  return result;
}
async function member(c: C, allowBlocked = false) {
  const s = await session(c);
  let p = await c.env.DB.prepare('SELECT id,name,blocked FROM profile WHERE auth_user_id=?')
    .bind(s.user.id)
    .first<Profile>();
  if (!p) {
    await c.env.DB.prepare('INSERT OR IGNORE INTO profile(id,auth_user_id,name) VALUES (?,?,?)')
      .bind(uid(), s.user.id, 'Traveler')
      .run();
    p = await c.env.DB.prepare('SELECT id,name,blocked FROM profile WHERE auth_user_id=?')
      .bind(s.user.id)
      .first<Profile>();
  }
  if (!p || (p.blocked && !allowBlocked)) throw new Problem(403, 'This account cannot contribute.');
  return {
    ...p,
    authId: s.user.id,
    email: s.user.email,
    sessionCreatedAt: new Date(s.session.createdAt).getTime(),
  };
}
async function admin(c: C) {
  const p = await member(c);
  if (
    !(c.env.ADMIN_EMAILS || '')
      .split(',')
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean)
      .includes(p.email.toLowerCase())
  )
    throw new Problem(403, 'Administrator access required.');
  return p;
}
function guide(value: unknown) {
  if (value === undefined || value === null || value === '') return null;
  const id = text(value, 1, 180, 'Guide');
  if (!guides.has(id)) throw new Problem(400, 'This guide is not available for contributions.');
  return id;
}
app.get('/api/health', async (c) => {
  await c.env.DB.prepare('SELECT 1').first();
  return c.json({
    ok: true,
    community: true,
    google: !!(c.env.GOOGLE_CLIENT_ID && c.env.GOOGLE_CLIENT_SECRET),
    email: !!(c.env.RESEND_API_KEY && c.env.MAIL_FROM),
    spam: !!c.env.TURNSTILE_SECRET,
  });
});
app.get('/api/config', (c) =>
  c.json({
    turnstileSiteKey: c.env.TURNSTILE_SITE_KEY || '',
    google: !!c.env.GOOGLE_CLIENT_ID,
    email: !!c.env.RESEND_API_KEY,
  }),
);
app.on(['GET', 'POST'], '/api/auth/*', async (c) => {
  const data = c.req.method === 'POST' ? await body(c) : undefined;
  if (c.req.method === 'POST' && c.req.path.endsWith('/sign-in/magic-link')) {
    await rate(c.env, c.req.raw, 'email', 3, 300);
    await turnstile(c.env, c.req.raw, data?.turnstileToken);
  }
  return authRequest(c.req.raw, c.env, data);
});
app.get('/api/me', async (c) => {
  const p = await member(c, true);
  return c.json({
    id: p.id,
    name: p.name,
    admin: (c.env.ADMIN_EMAILS || '')
      .split(',')
      .map((x) => x.trim().toLowerCase())
      .includes(p.email.toLowerCase()),
  });
});
app.patch('/api/me', async (c) => {
  const p = await member(c),
    d = await body(c);
  const name = text(d.name, 2, 50, 'Display name');
  await c.env.DB.prepare('UPDATE profile SET name=? WHERE id=?').bind(name, p.id).run();
  return c.json({ ok: true });
});
app.get('/api/community', async (c) => {
  const id = c.req.query('guide');
  if (id && !guides.has(id)) throw new Problem(400, 'Unknown guide.');
  const rows = await c.env.DB.prepare(
    `SELECT c.id,c.kind,c.guide_id,c.parent_id,c.title,c.body,c.created_at,c.author_type,p.name FROM contribution c LEFT JOIN profile p ON p.id=c.profile_id WHERE c.status='published' ${id ? 'AND c.guide_id=?' : ''} ORDER BY c.created_at DESC LIMIT 50`,
  )
    .bind(...(id ? [id] : []))
    .all();
  return c.json({ items: rows.results });
});
app.post('/api/contributions', async (c) => {
  const p = await member(c),
    d = await body(c);
  await rate(c.env, c.req.raw, 'contribution', 5, 3600, p.id);
  await turnstile(c.env, c.req.raw, d.turnstileToken);
  const kind = text(d.kind, 1, 20, 'Type');
  if (!['question', 'report', 'update', 'comment'].includes(kind))
    throw new Problem(400, 'Choose a valid contribution type.');
  const guideId = guide(d.guideId),
    parent = d.parentId ? text(d.parentId, 1, 80, 'Parent') : null;
  if (kind === 'comment' && !guideId && !parent)
    throw new Problem(400, 'A comment needs a guide or conversation.');
  if (
    parent &&
    !(await c.env.DB.prepare("SELECT id FROM contribution WHERE id=? AND status='published'")
      .bind(parent)
      .first())
  )
    throw new Problem(400, 'The conversation is unavailable.');
  const id = uid(),
    title = kind === 'comment' ? '' : text(d.title, 8, 140, 'Title'),
    content = text(d.body, 10, 5000, 'Message');
  await c.env.DB.prepare(
    'INSERT INTO contribution(id,profile_id,kind,guide_id,parent_id,title,body,author_type) VALUES (?,?,?,?,?,?,?,?)',
  )
    .bind(
      id,
      p.id,
      kind,
      guideId,
      parent,
      title,
      content,
      (c.env.ADMIN_EMAILS || '')
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .includes(p.email.toLowerCase())
        ? 'editorial'
        : 'community',
    )
    .run();
  return c.json({ id, status: 'pending' }, 201);
});
app.patch('/api/contributions/:id', async (c) => {
  const p = await member(c),
    d = await body(c);
  await turnstile(c.env, c.req.raw, d.turnstileToken);
  const item = await c.env.DB.prepare(
    "SELECT * FROM contribution WHERE id=? AND profile_id=? AND status<>'deleted'",
  )
    .bind(c.req.param('id'), p.id)
    .first<any>();
  if (!item) throw new Problem(404, 'Contribution not found.');
  const title = item.kind === 'comment' ? '' : text(d.title, 8, 140, 'Title'),
    content = text(d.body, 10, 5000, 'Message');
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO revision(id,contribution_id,title,body) VALUES (?,?,?,?)').bind(
      uid(),
      item.id,
      item.title,
      item.body,
    ),
    c.env.DB.prepare(
      "UPDATE contribution SET title=?,body=?,status='pending',indexable=0,revision=revision+1,updated_at=CURRENT_TIMESTAMP WHERE id=? AND profile_id=?",
    ).bind(title, content, item.id, p.id),
  ]);
  return c.json({ status: 'pending' });
});
app.delete('/api/contributions/:id', async (c) => {
  const p = await member(c, true);
  await c.env.DB.prepare(
    "UPDATE contribution SET status='deleted',indexable=0,updated_at=CURRENT_TIMESTAMP WHERE id=? AND profile_id=?",
  )
    .bind(c.req.param('id'), p.id)
    .run();
  return c.json({ ok: true });
});
app.get('/api/my-contributions', async (c) => {
  const p = await member(c, true);
  const rows = await c.env.DB.prepare(
    "SELECT id,title,body,kind,status FROM contribution WHERE profile_id=? AND status<>'deleted' ORDER BY created_at DESC LIMIT 100",
  )
    .bind(p.id)
    .all();
  return c.json({ items: rows.results });
});
app.post('/api/reports', async (c) => {
  const p = await member(c),
    d = await body(c);
  await turnstile(c.env, c.req.raw, d.turnstileToken);
  const id = text(d.contributionId, 1, 80, 'Contribution'),
    reason = text(d.reason, 10, 1000, 'Reason');
  if (
    !(await c.env.DB.prepare("SELECT id FROM contribution WHERE id=? AND status='published'")
      .bind(id)
      .first())
  )
    throw new Problem(404, 'Contribution unavailable.');
  await c.env.DB.prepare(
    'INSERT INTO report(id,profile_id,contribution_id,reason) VALUES (?,?,?,?)',
  )
    .bind(uid(), p.id, id, reason)
    .run();
  return c.json({ ok: true });
});
app.get('/api/reactions/:id', async (c) => {
  const id = c.req.param('id');
  const count = await c.env.DB.prepare('SELECT COUNT(*) AS total FROM reaction WHERE target_id=?')
    .bind(id)
    .first<{ total: number }>();
  const current = await auth(c.env).api.getSession({
    headers: c.req.raw.headers,
    query: { disableCookieCache: true },
  });
  const mine = current
    ? !!(await c.env.DB.prepare(
        'SELECT 1 FROM reaction r JOIN profile p ON r.profile_id=p.id WHERE r.target_id=? AND p.auth_user_id=?',
      )
        .bind(id, current.user.id)
        .first())
    : false;
  return c.json({ count: count?.total || 0, mine });
});
app.put('/api/reactions/:id', async (c) => {
  const p = await member(c),
    id = c.req.param('id');
  if (
    !guides.has(id) &&
    !(await c.env.DB.prepare("SELECT id FROM contribution WHERE id=? AND status='published'")
      .bind(id)
      .first())
  )
    throw new Problem(404, 'Target unavailable.');
  await c.env.DB.prepare('INSERT OR IGNORE INTO reaction(profile_id,target_id) VALUES (?,?)')
    .bind(p.id, id)
    .run();
  return c.json({ ok: true });
});
app.delete('/api/reactions/:id', async (c) => {
  const p = await member(c);
  await c.env.DB.prepare('DELETE FROM reaction WHERE profile_id=? AND target_id=?')
    .bind(p.id, c.req.param('id'))
    .run();
  return c.json({ ok: true });
});
app.get('/api/saved', async (c) => {
  const p = await member(c);
  return c.json({
    items: (
      await c.env.DB.prepare('SELECT guide_id FROM saved WHERE profile_id=?').bind(p.id).all()
    ).results,
  });
});
app.put('/api/saved/:id', async (c) => {
  const p = await member(c),
    id = guide(c.req.param('id'));
  await c.env.DB.prepare('INSERT OR IGNORE INTO saved(profile_id,guide_id) VALUES (?,?)')
    .bind(p.id, id)
    .run();
  return c.json({ ok: true });
});
app.delete('/api/saved/:id', async (c) => {
  const p = await member(c);
  await c.env.DB.prepare('DELETE FROM saved WHERE profile_id=? AND guide_id=?')
    .bind(p.id, c.req.param('id'))
    .run();
  return c.json({ ok: true });
});
app.get('/api/plans', async (c) => {
  const p = await member(c);
  return c.json({
    items: (
      await c.env.DB.prepare(
        'SELECT id,title,data,updated_at FROM plan WHERE profile_id=? ORDER BY updated_at DESC LIMIT 20',
      )
        .bind(p.id)
        .all()
    ).results,
  });
});
app.get('/api/plans/:id', async (c) => {
  const p = await member(c);
  const row = await c.env.DB.prepare(
    'SELECT id,title,data,updated_at FROM plan WHERE id=? AND profile_id=?',
  )
    .bind(c.req.param('id'), p.id)
    .first();
  if (!row) throw new Problem(404, 'Plan not found.');
  return c.json(row);
});
function checkedPlan(value: unknown) {
  try {
    return accountPlanData(value);
  } catch (error) {
    throw new Problem(400, (error as Error).message);
  }
}
app.post('/api/plans', async (c) => {
  const p = await member(c),
    d = await body(c);
  const title = text(d.title, 1, 100, 'Plan title'),
    data = JSON.stringify(checkedPlan(d.data));
  const id = uid();
  const result = await c.env.DB.prepare(
    'INSERT INTO plan(id,profile_id,title,data) SELECT ?,?,?,? WHERE (SELECT COUNT(*) FROM plan WHERE profile_id=?)<20 RETURNING id',
  )
    .bind(id, p.id, title, data, p.id)
    .first();
  if (!result) throw new Problem(429, 'Keep up to 20 plans. Delete one before adding another.');
  return c.json({ id, private: true }, 201);
});
app.put('/api/plans/:id', async (c) => {
  const p = await member(c),
    d = await body(c);
  if (
    !(await c.env.DB.prepare('SELECT id FROM plan WHERE id=? AND profile_id=?')
      .bind(c.req.param('id'), p.id)
      .first())
  )
    throw new Problem(404, 'Plan not found.');
  const row = await c.env.DB.prepare(
    'UPDATE plan SET title=?,data=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND profile_id=? RETURNING id',
  )
    .bind(
      text(d.title, 1, 100, 'Title'),
      JSON.stringify(checkedPlan(d.data)),
      c.req.param('id'),
      p.id,
    )
    .first();
  if (!row) throw new Problem(404, 'Plan not found.');
  return c.json({ ok: true });
});
app.delete('/api/plans/:id', async (c) => {
  const p = await member(c);
  await c.env.DB.prepare('DELETE FROM plan WHERE id=? AND profile_id=?')
    .bind(c.req.param('id'), p.id)
    .run();
  return c.json({ ok: true });
});
app.post('/api/plans/:id/share', async (c) => {
  const p = await member(c),
    id = c.req.param('id');
  const row = await c.env.DB.prepare('SELECT title,data FROM plan WHERE id=? AND profile_id=?')
    .bind(id, p.id)
    .first<{ title: string; data: string }>();
  if (!row) throw new Problem(404, 'Plan not found.');
  const d = await body(c);
  for (const key of ['includeNotes', 'includeAddresses', 'includeDates'])
    if (typeof d[key] !== 'boolean')
      throw new Problem(400, 'Review and explicitly choose the public sharing fields first.');
  const privatePlan = checkedPlan(JSON.parse(row.data));
  if (d.expectedData !== JSON.stringify(privatePlan) || d.expectedTitle !== row.title)
    throw new Problem(
      409,
      'The private plan changed. Reopen it and review the public version again.',
    );
  const snapshot = publicPlanData(privatePlan, {
    includeNotes: d.includeNotes as boolean,
    includeAddresses: d.includeAddresses as boolean,
    includeDates: d.includeDates as boolean,
  });
  if (!snapshot.items.length && !snapshot.notes)
    throw new Problem(400, 'The selected public version has no stops or notes.');
  const bytes = crypto.getRandomValues(new Uint8Array(32)),
    token = [...bytes].map((x) => x.toString(16).padStart(2, '0')).join('');
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM plan_share WHERE plan_id=?').bind(id),
    c.env.DB.prepare('INSERT INTO plan_share(token_hash,plan_id,public_data) VALUES (?,?,?)').bind(
      await hash(token),
      id,
      JSON.stringify({ title: row.title, plan: snapshot }),
    ),
  ]);
  // Query strings are redacted by the Worker observability configuration.
  return c.json({ url: `${c.env.SITE_URL}/community/shared?token=${token}` });
});
app.delete('/api/plans/:id/share', async (c) => {
  const p = await member(c);
  await c.env.DB.prepare(
    'DELETE FROM plan_share WHERE plan_id IN (SELECT id FROM plan WHERE id=? AND profile_id=?)',
  )
    .bind(c.req.param('id'), p.id)
    .run();
  return c.json({ ok: true });
});
app.get('/api/moderation', async (c) => {
  await admin(c);
  const pending = await c.env.DB.prepare(
    "SELECT c.*,p.name FROM contribution c LEFT JOIN profile p ON p.id=c.profile_id WHERE c.status IN ('pending','hidden') ORDER BY c.created_at LIMIT 100",
  ).all();
  const reports = await c.env.DB.prepare(
    "SELECT id,contribution_id,reason FROM report WHERE status='open' LIMIT 100",
  ).all();
  return c.json({ pending: pending.results, reports: reports.results });
});
app.post('/api/moderation/:id', async (c) => {
  const p = await admin(c),
    d = await body(c),
    id = c.req.param('id');
  const action = text(d.action, 1, 30, 'Action'),
    reason = text(d.reason, 5, 500, 'Reason');
  if (!['publish', 'hide', 'restore', 'delete'].includes(action))
    throw new Problem(400, 'Invalid moderation action.');
  const status =
    action === 'publish' || action === 'restore'
      ? 'published'
      : action === 'hide'
        ? 'hidden'
        : 'deleted';
  const row = await c.env.DB.prepare('SELECT id FROM contribution WHERE id=?').bind(id).first();
  if (!row) throw new Problem(404, 'Contribution not found.');
  await c.env.DB.batch([
    c.env.DB.prepare(
      'UPDATE contribution SET status=?,indexable=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',
    ).bind(status, status === 'published' && d.indexable === true ? 1 : 0, id),
    c.env.DB.prepare(
      'INSERT INTO moderation_log(id,actor_id,target_id,action,reason) VALUES (?,?,?,?,?)',
    ).bind(uid(), p.id, id, action, reason),
    c.env.DB.prepare("UPDATE report SET status='resolved' WHERE contribution_id=?").bind(id),
  ]);
  return c.json({ ok: true });
});
app.post('/api/moderation/profiles/:id', async (c) => {
  const p = await admin(c),
    d = await body(c),
    id = c.req.param('id'),
    blocked = d.blocked === true;
  if (id === p.id) throw new Problem(400, 'Cannot block your own administrator account.');
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE profile SET blocked=? WHERE id=?').bind(blocked ? 1 : 0, id),
    c.env.DB.prepare(
      'INSERT INTO moderation_log(id,actor_id,target_id,action,reason) VALUES (?,?,?,?,?)',
    ).bind(uid(), p.id, id, blocked ? 'block' : 'unblock', text(d.reason, 5, 500, 'Reason')),
  ]);
  return c.json({ ok: true });
});
app.delete('/api/account', async (c) => {
  const p = await member(c, true),
    d = await body(c);
  if (Date.now() - p.sessionCreatedAt > 300000)
    throw new Problem(
      401,
      'Sign out and sign in again within five minutes before deleting your account.',
    );
  if (d.confirm !== 'DELETE MY ACCOUNT' || !['delete', 'anonymize'].includes(d.contributions))
    throw new Problem(400, 'Choose how to handle public contributions and confirm deletion.');
  const statements = [
    c.env.DB.prepare('DELETE FROM plan WHERE profile_id=?').bind(p.id),
    c.env.DB.prepare('DELETE FROM saved WHERE profile_id=?').bind(p.id),
    c.env.DB.prepare('DELETE FROM reaction WHERE profile_id=?').bind(p.id),
  ];
  if (d.contributions === 'delete')
    statements.push(c.env.DB.prepare('DELETE FROM contribution WHERE profile_id=?').bind(p.id));
  else
    statements.push(
      c.env.DB.prepare(
        "UPDATE contribution SET profile_id=NULL,author_type='community' WHERE profile_id=? AND status='published'",
      ).bind(p.id),
      c.env.DB.prepare('DELETE FROM contribution WHERE profile_id=?').bind(p.id),
    );
  statements.push(
    c.env.DB.prepare('DELETE FROM profile WHERE id=?').bind(p.id),
    c.env.DB.prepare('DELETE FROM user WHERE id=?').bind(p.authId),
  );
  const signedOut = await auth(c.env).api.signOut({ headers: c.req.raw.headers, asResponse: true });
  await c.env.DB.batch(statements);
  const response = c.json({ ok: true });
  for (const cookie of signedOut.headers.getSetCookie())
    response.headers.append('Set-Cookie', cookie);
  return response;
});
function Shell({
  title,
  children,
  index = false,
  preview,
}: {
  title: string;
  children: any;
  index?: boolean;
  preview?: { url: string; title?: string; description: string; image?: string };
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="robots" content={index ? 'index,follow' : 'noindex,follow'} />
        <title>{title} | Korea Experience</title>
        {preview ? (
          <>
            <link rel="canonical" href={preview.url} />
            <meta name="description" content={preview.description} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Korea Experience" />
            <meta property="og:title" content={preview.title || title} />
            <meta property="og:description" content={preview.description} />
            <meta property="og:url" content={preview.url} />
            <meta
              property="og:image"
              content={
                preview.image || 'https://koreaexperience.com/images/cards/korea-experience.jpg'
              }
            />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={preview.title || title} />
            <meta name="twitter:description" content={preview.description} />
            <meta
              name="twitter:image"
              content={
                preview.image || 'https://koreaexperience.com/images/cards/korea-experience.jpg'
              }
            />
          </>
        ) : null}
        <link rel="icon" type="image/svg+xml" href="https://koreaexperience.com/icon.svg" />
        <link rel="stylesheet" href="/api/community.css" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <header>
          <a
            href="https://koreaexperience.com/"
            className="wordmark"
            aria-label="Korea Experience home"
          >
            <span className="brand-mark" aria-hidden="true">
              K<span>°</span>
            </span>
            <span>
              Korea<span className="brand-second">Experience</span>
            </span>
          </a>
          <nav className="community-desktop-nav" aria-label="Main navigation">
            <a href="https://koreaexperience.com/blog/category/plan-your-trip">Plan your trip</a>
            <a href="https://koreaexperience.com/destinations">Destinations</a>
            <a href="https://koreaexperience.com/blog">Guides</a>
            <a href="https://koreaexperience.com/tools">Travel tools</a>
            <a href="/community">Community</a>
            <a href="/community/account">My account</a>
          </nav>
          <details className="community-menu">
            <summary>Menu</summary>
            <nav aria-label="Mobile navigation">
              <a href="https://koreaexperience.com/blog/category/plan-your-trip">Plan your trip</a>
              <a href="https://koreaexperience.com/destinations">Destinations</a>
              <a href="https://koreaexperience.com/blog">Guides</a>
              <a href="https://koreaexperience.com/tools">Travel tools</a>
              <a href="/community">Community</a>
              <a href="/community/account">My account</a>
            </nav>
          </details>
        </header>
        <main id="main-content" tabIndex={-1}>
          <p id="auth-notice" role="alert" hidden />
          <p id="member-status" role="status" hidden />
          {children}
        </main>
        <footer>
          <a href="https://koreaexperience.com/editorial-policy">Editorial policy</a> ·{' '}
          <a href="https://koreaexperience.com/privacy">Privacy</a> ·{' '}
          <a href="https://koreaexperience.com/terms">Terms</a>
          <p>
            Questions, reports and updates are reviewed before publication. Do not post personal
            documents, private contact details or booking codes.
          </p>
        </footer>
        <script src="/api/community-client.js" defer />
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" defer />
      </body>
    </html>
  );
}
function Login({ returnTo = '/community/account' }: { returnTo?: string } = {}) {
  return (
    <section className="panel" id="login-panel" data-return-to={returnTo}>
      <h2>Sign in to contribute</h2>
      <p>Google or a single-use email link. Reading does not require an account.</p>
      <button id="google-login" type="button" disabled>
        Continue with Google
      </button>
      <form data-action="email">
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" maxLength={254} />
        </label>
        <div className="spam-check" />
        <button type="submit" disabled>
          Email a sign-in link
        </button>
      </form>
      <p role="status" id="login-status" />
    </section>
  );
}
function Compose({ parent, guideId }: { parent?: string; guideId?: string }) {
  return (
    <section className="panel" data-member-only hidden>
      <h2>{parent ? 'Add a reply' : 'Ask or share something useful'}</h2>
      <p>
        Include dates, area and what you already checked. Contributions and edits appear after
        review.
      </p>
      <form data-action="contribution">
        <input type="hidden" name="parentId" value={parent || ''} />
        <input type="hidden" name="guideId" value={guideId || ''} />
        <label>
          Type
          <select name="kind">
            <option value={parent ? 'comment' : 'question'}>
              {parent ? 'Reply' : 'Travel question'}
            </option>
            {!parent ? (
              <>
                <option value="report">Trip report</option>
                <option value="update">Local update</option>
              </>
            ) : null}
          </select>
        </label>
        {!parent ? (
          <label>
            Title
            <input name="title" minLength={8} maxLength={140} required />
          </label>
        ) : null}
        <label>
          Message
          <textarea name="body" minLength={10} maxLength={5000} rows={7} required />
        </label>
        <div className="spam-check" />
        <button type="submit">Send for review</button>
        <p role="status" />
      </form>
    </section>
  );
}
app.get('/community', async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT c.id,c.title,c.kind,c.body,c.created_at,c.author_type,p.name FROM contribution c LEFT JOIN profile p ON p.id=c.profile_id WHERE c.status='published' AND c.parent_id IS NULL AND c.kind<>'comment' ORDER BY c.created_at DESC LIMIT 50",
  ).all<any>();
  const guideId = c.req.query('guide');
  return c.html(
    <Shell
      title="Travel community"
      preview={{
        url: c.env.SITE_URL + '/community',
        description:
          'Reviewed travel questions, trip reports and local updates. Read freely and sign in to contribute.',
      }}
    >
      <p className="eyebrow">Travel questions · Trip reports · Local updates</p>
      <h1>Travel knowledge gets better together.</h1>
      <p>
        Ask a specific question, share what helped, or report a change with its date and source.
      </p>
      <section>
        <h2>Recent conversations</h2>
        {rows.results.length ? (
          rows.results.map((i) => (
            <article className="panel">
              <small>
                {i.kind} · {i.created_at}
              </small>
              <h3>
                <a href={`/community/posts/${i.id}`}>{i.title}</a>
              </h3>
              <p>{i.body.slice(0, 220)}</p>
              <p>
                By {i.name || 'Former traveler'} ·{' '}
                {i.author_type === 'editorial' ? 'Editorial team' : 'Community member'}
              </p>
            </article>
          ))
        ) : (
          <p className="panel">
            No reviewed conversations yet. The first useful question can start one.
          </p>
        )}
      </section>
      <Compose guideId={guideId && guides.has(guideId) ? guideId : undefined} />
      <Login />
    </Shell>,
  );
});
app.get('/community/posts/:id', async (c) => {
  const item = await c.env.DB.prepare(
    "SELECT c.*,p.name FROM contribution c LEFT JOIN profile p ON p.id=c.profile_id WHERE c.id=? AND c.status='published'",
  )
    .bind(c.req.param('id'))
    .first<any>();
  if (!item)
    return c.html(
      <Shell title="Conversation unavailable">
        <h1>This conversation is unavailable.</h1>
        <a href="/community">Return to community</a>
      </Shell>,
      404,
    );
  const replies = await c.env.DB.prepare(
    "SELECT c.body,c.created_at,c.author_type,p.name FROM contribution c LEFT JOIN profile p ON p.id=c.profile_id WHERE c.parent_id=? AND c.status='published' ORDER BY c.created_at LIMIT 100",
  )
    .bind(item.id)
    .all<any>();
  return c.html(
    <Shell
      title={item.title || 'Travel conversation'}
      index={item.indexable === 1}
      preview={{
        url: c.env.SITE_URL + '/community/posts/' + encodeURIComponent(item.id),
        description:
          'A reviewed community conversation about travel in Korea. Member experiences are not official guidance.',
      }}
    >
      <p className="eyebrow">
        {item.kind} · {item.created_at}
      </p>
      <h1>{item.title}</h1>
      <p>
        By {item.name || 'Former traveler'} ·{' '}
        {item.author_type === 'editorial' ? 'Editorial team' : 'Community member'}
      </p>
      <article className="panel preserve">{item.body}</article>
      <button data-like={item.id}>Helpful</button>
      <details>
        <summary>Report this contribution</summary>
        <form data-action="report">
          <input type="hidden" name="contributionId" value={item.id} />
          <label>
            Reason
            <textarea name="reason" minLength={10} maxLength={1000} required />
          </label>
          <div className="spam-check" />
          <button type="submit">Send report</button>
          <p role="status" />
        </form>
      </details>
      <h2>Reviewed replies</h2>
      {replies.results.map((r) => (
        <article className="panel">
          <p className="preserve">{r.body}</p>
          <small>
            {r.name || 'Former traveler'} · {r.created_at}
          </small>
        </article>
      ))}
      <Compose parent={item.id} guideId={item.guide_id} />
      <Login />
    </Shell>,
  );
});
app.get('/community/shared', async (c) => {
  c.header('Referrer-Policy', 'no-referrer');
  const token = c.req.query('token') || '';
  if (!/^[a-f0-9]{64}$/.test(token)) return c.notFound();
  const p = await c.env.DB.prepare(
    'SELECT s.public_data FROM plan p JOIN plan_share s ON s.plan_id=p.id WHERE s.token_hash=?',
  )
    .bind(await hash(token))
    .first<{ public_data: string | null }>();
  if (!p)
    return c.html(
      <Shell title="Plan unavailable">
        <h1>This plan is no longer shared.</h1>
      </Shell>,
      404,
    );
  if (!p.public_data)
    return c.html(
      <Shell title="Review the sharing snapshot">
        <h1>This legacy link needs a new sharing snapshot.</h1>
        <p>
          Ask the owner to open their private plan and create a reviewed public link. Their original
          notes are still private in their account.
        </p>
      </Shell>,
    );
  const snapshot = JSON.parse(p.public_data) as { title: string; plan: ItineraryPlan };
  const plan = normalizePlan(snapshot.plan);
  return c.html(
    <Shell
      title={snapshot.title}
      preview={{
        url:
          c.env.SITE_URL + '/community/shared?token=' + encodeURIComponent(c.req.query('token')!),
        title: 'Shared Korea trip plan',
        description:
          'An owner-reviewed sharing snapshot. Check current opening, reservations and travel conditions before using the plan.',
        image: 'https://koreaexperience.com/images/cards/tool-itinerary.jpg',
      }}
    >
      <p className="eyebrow">Owner's shared snapshot · unverified personal itinerary</p>
      <h1>{snapshot.title}</h1>
      <p>
        Korea time (Asia/Seoul). {plan.startDate ? `Starts ${plan.startDate}.` : ''} Check current
        opening hours, reservations and travel times.
      </p>
      {plan.notes ? <p className="panel preserve">{plan.notes}</p> : null}
      <ol className="shared-plan-list">
        {plan.items.map((stop) => (
          <li className="panel" key={stop.id}>
            <p>
              Day {stop.day}
              {stop.time ? ` · ${stop.time}` : ''}
            </p>
            <h2>{stop.place}</h2>
            {stop.address ? <p>{stop.address}</p> : null}
            <p>
              {stop.durationMinutes === null
                ? 'Visit time not set'
                : `${stop.durationMinutes} min visit`}{' '}
              ·{' '}
              {stop.travelBufferMinutes === null
                ? 'Travel buffer not set'
                : `${stop.travelBufferMinutes} min travel buffer`}
            </p>
            {stop.note ? <p className="preserve">{stop.note}</p> : null}
            <a
              href={`https://map.naver.com/p/search/${encodeURIComponent(stop.address || stop.place)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Check location and route ↗
            </a>
          </li>
        ))}
      </ol>
      <p>
        Private changes are not published automatically. Ask the owner for an updated link if plans
        change.
      </p>
      <a href="https://koreaexperience.com/tools/itinerary">Create your own trip board</a>
    </Shell>,
  );
});
app.get('/community/account', (c) =>
  c.html(
    <Shell title="Your travel account">
      <h1>Your travel account</h1>
      {safeReturnTo(c.req.query('returnTo'), c.env.SITE_URL) !== '/community/account' ? (
        <p>
          <a
            className="return-to-guide"
            href={safeReturnTo(c.req.query('returnTo'), c.env.SITE_URL)}
          >
            Return to your guide or trip board →
          </a>
        </p>
      ) : null}
      <Login returnTo={safeReturnTo(c.req.query('returnTo'), c.env.SITE_URL)} />
      <section className="panel" data-member-only hidden>
        <h2>Profile</h2>
        <form data-action="profile">
          <label>
            Public display name
            <input name="name" minLength={2} maxLength={50} required />
          </label>
          <button>Update name</button>
          <p role="status" />
        </form>
        <button id="sign-out">Sign out</button>
      </section>
      <section className="panel" data-member-only hidden>
        <h2>Your contributions</h2>
        <div id="my-contributions">Sign in to manage your contributions.</div>
      </section>
      <section className="panel" data-member-only hidden>
        <h2>Private plans</h2>
        <p>
          Plans are private until you explicitly create a public link. Revoke it at any time. Anyone
          with that link can read the fields you select in the preview. Later private edits do not
          change the shared snapshot.
        </p>
        <div id="my-plans" />
        <form data-action="plan">
          <label>
            Plan title
            <input name="title" required maxLength={100} />
          </label>
          <label>
            Plan notes
            <textarea name="notes" required maxLength={10000} />
          </label>
          <button>Save a private plan</button>
          <p role="status" />
        </form>
      </section>
      <section className="panel" data-member-only hidden>
        <h2>Delete account</h2>
        <p>Removes sessions, profile, saved items, private plans and all shared links.</p>
        <form data-action="delete-account">
          <label>
            Public contributions
            <select name="contributions">
              <option value="anonymize">Keep reviewed contributions anonymously</option>
              <option value="delete">Delete contributions</option>
            </select>
          </label>
          <label>
            Type DELETE MY ACCOUNT
            <input name="confirm" required pattern="DELETE MY ACCOUNT" />
          </label>
          <button>Delete my account permanently</button>
          <p role="status" />
        </form>
      </section>
    </Shell>,
  ),
);
app.get('/community/moderation', async (c) => {
  await admin(c);
  return c.html(
    <Shell title="Community moderation">
      <h1>Review contributions</h1>
      <p>
        Check usefulness, factual claims, personal data, spam and links before publication. Enable
        indexing only for substantial, useful conversations.
      </p>
      <div id="moderation-queue" />
    </Shell>,
  );
});
app.get('/api/community.css', (c) =>
  c.text(communityStyles, 200, { 'Content-Type': 'text/css; charset=utf-8' }),
);
import { clientScript } from './ui-client';
app.get('/api/community-client.js', (c) =>
  c.text(clientScript, 200, { 'Content-Type': 'application/javascript; charset=utf-8' }),
);
app.notFound((c) => c.json({ error: 'Not found.' }, 404));
export { app };
export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledController, env: Env) {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM request_limit WHERE expires_at<?').bind(
        Math.floor(Date.now() / 1000),
      ),
      env.DB.prepare('DELETE FROM session WHERE expiresAt<?').bind(Date.now()),
      env.DB.prepare('DELETE FROM verification WHERE expiresAt<?').bind(Date.now()),
    ]);
  },
};
