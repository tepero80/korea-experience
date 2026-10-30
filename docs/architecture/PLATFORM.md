# Platform boundaries

The Next.js site exports to `out` on the existing GitHub main → Cloudflare Pages integration. Reviewed and archive guides share a compatibility loader. The content registry controls titles, canonical URLs, source checks, categories, relationships, search catalog, sitemap and share cards. Static RSC/route output is retained; the export guard measures all real files.

Six core tools use pure calculations and browser state in `lib/travel-tools.ts` and `components/site/TravelTool.tsx`. Prices entered by users are hypothetical estimates unless a current operator source is explicitly quoted. Results capture their calculation assumptions for sharing. The itinerary is local and private by default; core tools need no account and contain no ad slots.

`workers/community` is a separate Hono Worker with native D1, Better Auth, Google OAuth, email magic links, Resend and Turnstile. Stable application profile IDs isolate community ownership from the auth provider. Contributions and revisions require moderation; only explicitly reviewed valuable public threads may become indexable. Private API/session responses are not cached. Session refresh, account deletion and private-plan ownership are enforced by the server.

Community remains disabled until the actual external free-tier tests in `docs/operations/SETUP.md` pass. Local passing tests and a dry-run bundle do not prove Google callbacks, mail delivery or Workers Free CPU limits. Pages reading does not depend on the Worker being available. If the minimal auth implementation cannot meet measured free-tier limits, use the documented Supabase Free auth fallback while keeping D1 and application profile IDs.

`components/site/ProductionServices.tsx` separates production consent-based measurement from previews. Manual AdSense units appear only in protected article positions. Auto Ads and automatic optimization are disabled in the account baseline. Google CMP manages advertising choices; the site's separate analytics banner does not replace it. Never click live ads during verification.

Run `npm run check:community` for dynamic changes. Its local D1 tests cover ownership, duplicate likes, origins, fresh-session deletion, single-use/expired magic links, quotas, rate limits, Turnstile failures and revocable shares. Production credentials, metrics, restore exports and community data never enter Git.
