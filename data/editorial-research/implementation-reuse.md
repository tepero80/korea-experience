# Implementation reuse research

Checked 2026-10-30. Research only: no dependencies installed, migrations run, deployments made, or credentials read.

## Package and CLI observations

Registry metadata: `better-auth@1.7.14` MIT; `hono@4.13.14` MIT; `leaflet@1.9.4` BSD-2-Clause. `@vercel/og` currently resolves to 0.8.6 in this project (latest registry 1.0.3, MPL-2.0). Existing `sharp@0.34.5` resolves from node_modules, Apache-2.0. Reuse the existing OG version rather than upgrading solely for cards. Declare sharp directly if authoring a script that imports it, rather than relying on Next.js's transitive dependency.

Neither `gh` nor `wrangler` is on PATH. This does not prove GitHub Git authentication or Cloudflare browser authentication is missing. No login or credential inspection was attempted. A pinned dev dependency provides Wrangler after installation.

## Auth: adopt Better Auth native D1, mount directly in Hono

Native D1 support accepts `database: env.DB`; an ORM or third-party D1 adapter is unnecessary. D1 has no interactive transactions, so Better Auth uses D1 batch operations. Hono mounting uses the standard Request/Response handler directly. Workers require the `nodejs_compat` flag for AsyncLocalStorage. See [native D1](https://better-auth.com/blog/1-5#cloudflare-d1-support), [Hono integration](https://better-auth.com/docs/integrations/hono).

Configuration sketch (the application must supply tested limits/mail sender and real bindings):

```ts
import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import { Hono } from 'hono';

function makeAuth(env: Env) {
  return betterAuth({
    database: env.DB,
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.SITE_URL,
    basePath: '/api/auth',
    trustedOrigins: [env.SITE_URL],
    emailAndPassword: { enabled: false },
    socialProviders: {
      google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
    },
    session: {
      deferSessionRefresh: true,
      cookieCache: { enabled: true, maxAge: 60 },
    },
    plugins: [magicLink({
      expiresIn: 300,
      storeToken: 'hashed',
      sendMagicLink: async ({ email, url }) => {
        // Reserve the configured email budget atomically, then POST to Resend.
        // Throw on delivery failure; never print url/token or pretend success.
        await sendAuthEmail(env, email, url);
      },
    })],
  });
}

const app = new Hono<{ Bindings: Env }>();
app.all('/api/auth/*', c => makeAuth(c.env).handler(c.req.raw));
```

This is an API-shape example, not a measured performance recommendation to construct a new instance for every request. In 1.7.14 schema validation inspects DB metadata and caches its result per adapter instance. Investigate safe configuration/binding-scoped instance reuse, then measure cold/warm deployed CPU; do not globally share a user session, request, or response. [Database/schema documentation](https://better-auth.com/docs/concepts/database).

Google callback: `https://koreaexperience.com/api/auth/callback/google`; use the explicit production base URL and minimum identity scopes. [Google provider](https://better-auth.com/docs/authentication/google).

Magic link defaults are important: current plugin tokens are consumed atomically once; default token storage transform is **plain**, so explicitly choose `storeToken: 'hashed'`. Default expiry is five minutes. Do not use deprecated `allowedAttempts` to permit replay. Use the plugin's client adapter or documented endpoints for sign-in and verification. [Magic link](https://better-auth.com/docs/plugins/magic-link).

Production cookie defaults are HttpOnly/Secure and SameSite=Lax. Keep the application same-origin; do not broaden cookie domain or use wildcard credentialed CORS. Better Auth protects its own auth routes with origin/CSRF protections. The app's community endpoints still need their own origin validation, JSON-content-type policy, authorization and server-owned role checks. [Cookies](https://better-auth.com/docs/concepts/cookies), [Security](https://better-auth.com/docs/reference/security).

Cached session data can remain valid until its short expiry after revocation. For writes, administrator checks, deleting accounts, and accessing private itineraries, force DB validation:

```ts
const session = await auth.api.getSession({
  headers: c.req.raw.headers,
  query: { disableCookieCache: true },
});
```

Session cache is a read optimization, not the source of permissions. [Session management](https://better-auth.com/docs/concepts/session-management).

Generate the SQL schema from the **pinned installed auth version and actual config**; preserve it in D1 migrations. Core tables are user/session/account/verification, with additional application tables separate. Official CLI supports SQL generation for the built-in SQLite/D1 adapter; `getMigrations` from `better-auth/db/migration` supports programmatic migration. Never run migrations on each normal request or expose a public migration route. Apply reviewed migration SQL separately with Wrangler to local, staging, then production. [Migration APIs](https://better-auth.com/docs/concepts/database).

Worker Free CPU is 10ms/invocation and 100K requests/day at this check. Native D1 compatibility does not demonstrate free-tier suitability; measure OAuth callback, session lookups, magic-link redemption, writes and SSR in the deployed environment before launch. [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

## Maps: Leaflet directly, loaded only on request

Adopt `leaflet@1.9.4`; a React wrapper is unnecessary for this small static-export use case. Import its CSS once. In a client component, render the textual place list and a real Load map button, then dynamically `import('leaflet')` after activation, create the map in a fixed-height container, and call `map.remove()` on cleanup. Avoid importing Leaflet at module top in a server-rendered path. `next/dynamic({ssr:false})`, when used, belongs in a client component. [Leaflet quickstart](https://leafletjs.com/examples/quick-start/), [Next lazy loading](https://nextjs.org/docs/app/guides/lazy-loading).

Use reviewed numeric coordinates with markers/numbered `divIcon`s, not runtime geocoding. `fitBounds` can frame multiple places; polyline is only a schematic connector unless a real route source supports it. Escape popup text or build text DOM nodes. Always retain Korean/English names, address-copy and external map links independently of map availability. No map key or paid API is needed for this capability.

OSM tiles need visible attribution, valid Referer, normal cache behavior, and no bulk prefetch/offline download. There is no SLA. Keep provider URL configurable; on error retain the useful list and external directions. [OSM policy](https://operations.osmfoundation.org/policies/tiles/).

## Static OG images: reuse installed @vercel/og + sharp

`ImageResponse` returns PNG; it does not generate JPEG directly. In a build script, render the existing library's 1200x630 response, read its ArrayBuffer, optionally transcode using sharp, then save a single content-hashed JPEG per card. Use local font bytes already present, avoiding runtime remote font fetches. `sharp(input).jpeg({quality:82, mozjpeg:true}).toFile(output)` is sufficient; PNG remains suitable for line-heavy cards. [OG API](https://vercel.com/docs/og-image-generation/og-image-api), [sharp output](https://sharp.pixelplumbing.com/api-output/#jpeg).

Keep the cover photograph and OG information card roles distinct, reference the static card directly in metadata, and stop exporting redundant per-post response copies once legacy OG URLs have safe redirects. Do not add runtime OG rendering to the free Worker. Generate personal/Instagram layouts in the browser on demand instead of predeploying every permutation.

## Public skills: verified original locations and revisions

Cloudflare repository HEAD observed `ed2d6ba89033ba8015591005ed9382cef550417f`, Apache-2.0 at root LICENSE:

- `skills/workers-best-practices/SKILL.md` and its relevant references.
- `skills/wrangler/SKILL.md`.
- `skills/web-perf/SKILL.md`.

Use immutable raw URLs rooted at `https://raw.githubusercontent.com/cloudflare/skills/ed2d6ba89033ba8015591005ed9382cef550417f/`. Downloading only SKILL.md is insufficient when it links supporting references. Root can use the skill-installer helper at a pinned ref; no installation was made in this research pass.

Vercel repository HEAD observed `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62`:

- `skills/react-best-practices/SKILL.md`, declared name `vercel-react-best-practices`, version1.0.0, MIT in its frontmatter; supporting rules are part of the skill.
- `skills/web-design-guidelines/SKILL.md`, version1.0.0. It delegates to fresh `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` on each review.

The Vercel repository API returned no root license; the React skill explicitly declares MIT, but the web-design skill does not. Link/read web-design guidelines rather than silently vendoring them under a license assumption. [Cloudflare skills](https://github.com/cloudflare/skills), [Vercel skills](https://github.com/vercel-labs/agent-skills).

No gh/wrangler authentication status was obtained because the CLIs were absent. Cloudflare/GitHub account permissions, D1 creation, OAuth credentials, Resend sender verification, and live free CPU measurements remain root implementation checks.
