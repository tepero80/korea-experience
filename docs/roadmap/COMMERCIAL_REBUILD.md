# Commercial rebuild

Accepted 2026-10-30 (Asia/Seoul). This is the implementation record, not a claim that pending features are live.

## Traveler upgrade checkpoint

The traveler-focused upgrade is published at 40e7926. See [its acceptance record](../operations/TRAVELER_ACCEPTANCE.md) and the private exact-release/coverage records for actual scope and evidence. Inline stop-removal undo follows the same regression, visual and actual-deployment checks. Earlier launch counts below are historical baselines, not current media/viewport coverage.

## Owner decisions

- English-first practical travel; eight categories, five launch guides each (40 total). Launch includes rewritten existing URLs and new guides, reported separately. Later requests for N new articles mean N new articles; updates are separate.
- Preserve existing GitHub main → Cloudflare Pages (npm run build, out, Node 24).
- Free services only; Google image generation is permitted only as fallback, KRW 10,000/month maximum including a conservative exchange/tax allowance. No paid auto-upgrade.
- Google and email magic-link accounts; comments, helpful reactions, saved plans and moderated travel questions/reports/updates.
- Daily 10:00 KST checks, Monday 10:30 KST improvements; first-week monthly performance/retirement review. No unsolicited scheduled new articles. Notify meaningful changes/errors/action required, stay quiet otherwise.

## Product

Categories: Plan Your Trip; Airports & Transport; Where to Stay; Places & Itineraries; Food & Cafés; Shopping & K-Beauty; Culture & Events; Travel Essentials. Region, season, audience, interests and journey stages are independent facets, not automatically indexable combinations.

Guides answer a real question first, disclose conditions and verification dates, show useful tables, real place information, maps/addresses, alternatives and next actions. Sources support specific claims. No invented firsthand experience or verification. Real photographs need documented rights; generated covers are labeled illustrations. No guaranteed indexing or AI citation claims.

Relationships: prerequisites, next actions, nearby, interests, alternatives, tools. Curated relationships outrank contextual fallback; do not fill slots with unrelated posts. Repair body, hub, recommendation, tool, language, community, saved-plan and sitemap references together on retirement.

## Implementation checklist

- [x] Baseline Git tag: rebuild-baseline-2026-10-30 (b662e14).
- [x] Recovery copies of unrelated root SQLite files outside repository: C:/Projects/korea-experience-recovery-2026-10-30. Original checkout C:/kc/korea-experience also remains.
- [x] Read existing rendering, taxonomy, sharing, SEO and build implementation.
- [x] Official Vercel React skill (declares MIT) and web-interface skill installed and used as local references. Upstream reference copies are excluded from redistribution; the project-specific operational skill is versioned. Source: https://github.com/vercel-labs/agent-skills.
- [x] Clean inventory and reproducible build; Next 16.4.3, MDX 6, current Sharp and dependency security updates. Both npm audits found zero vulnerabilities.
- [x] Shared content model, eight categories, source/place/media/relationship registries; 18 map locations and 11 licensed real photographs.
- [x] New home, navigation, hubs, article UI, search, local saved guides and trust pages.
- [x] Six practical tools, checked source assumptions, six meaningful unit tests and browser task checks.
- [x] Forty researched launch guides: 14 new URLs, 26 rewritten URLs. Existing equivalent addresses preserved; content records distinguish research checks from original declared dates.
- [x] Article/Breadcrumb SEO, 41 reviewed OG cards, client feed/story cards, lazy real maps, link/retirement/export-budget checks. No broken internal guide links in the inventory audit.
- [x] Worker/D1 auth, comments, likes, plans, moderation and SSR community; six local integration tests and 40 remote staging checks pass. Published on the owner's existing free configuration for an observed trial.
- [x] Real Google/email round trips, verified sender DNS and hostname-bound Turnstile; ownership, deletion and isolated remote-export restore checks. CPU measured, with spikes above the nominal Free budget: this is an explicit owner-accepted operational limitation, not a passed CPU-compliance gate.
- [x] Private reporting adapters, unavailable-access records, operational skill and setup instructions. Durable official read API credentials are still pending.
- [x] Daily/weekly heartbeat automations registered and verified: korea-experience at 10:00 KST; korea-experience-2 on Monday 10:30 KST, both attached to this chat.
- [x] AdSense responsive unit 9886001322 created; Auto Ads and auto optimization saved OFF, automatic winner unchecked. Published Google EU CMP verified on the production domain, including rejection. One manual protected article slot enabled; other regional settings remain an ongoing review item.
- [x] Source restore hash check, remote staging fixture export/isolated restore, and actual production D1 export/isolated restore after the owner's first real login. No restore was executed against the live production database.
- [x] Static browser QA and release guards. See docs/operations/QA.md. The actual pushed commit, Cloudflare deployment and public URL checks belong in .private/reports/release-latest.json after verification; this source checklist does not itself prove deployment.

## Outstanding external gates

Wrangler's bounded scopes, dedicated staging/production D1 databases, Google OAuth, Resend sender and host-specific Turnstile are connected. Google audience is External/Production with only openid/email/profile. The owner rotated the Google client secret and disabled the old key before public use. Secrets are encrypted Worker bindings; sender DNS is verified and actual mail passed SPF/DKIM. Production serves only the apex /api/* and /community routes; staging has no production routes and is noindex.

CPU telemetry remains a limitation: the optimized staging Google callback used 61ms and the production callback 52ms, although observed invocations completed with outcome ok and no exceededCpu errors. The owner explicitly chose to publish and operate the current setup rather than enroll in Supabase. Keep the existing free plan, monitor real failures and usage, and do not describe this as proven 10ms compliance. Supabase signup, provider migration and paid upgrades are not authorized by that decision.

GSC, GA4 and AdSense official reporting adapters currently return **unavailable**, because reporting credentials have not been connected. Authenticated browser observations remain useful dated snapshots. Field Core Web Vitals, complete WCAG conformance and every social platform's rendered preview are not certified by the local checks. Preserve those as explicit follow-up work.

The archive still contains 754 guides outside the reviewed 40; 126 current legacy high-risk candidates were flagged for further accuracy/retirement review. No public guide was deleted solely for being unindexed or having unknown performance. Legacy entertainment tools are retained behind the secondary collection pending real usage and quality review.

## Retirement

Track publication/first-known-public date separately from substantive updates. Inspect new/refreshed URLs at 7/14/28 days. After 90 days, unindexed URLs require technical, demand, accuracy, duplication, usage/backlink and seasonal review. Improve useful candidates once and reassess after 28 days. Merge true duplicates with relevant 301; retire low-value unprotected content with real 404. Unknown evidence means hold, not invented zero traffic. Keep reason, recovery point and next review date. Initial 40 is a launch portfolio, not a permanent quantity floor.

## Measurement and ads

Separate periods and account vs site scope. As observed 2026-10-30: 780 published posts; GSC last updated 2026-10-23: indexed385/excluded513, crawled-not-indexed308, discovered-not-indexed194; 3-month clicks82/impressions4530. AdSense home7days: estimatedUSD1.66/pageRPM0.84; domain pageviews1952, pages.dev14. Policy center clear. Auto ads, auto optimize, auto-apply enabled; page exclusions0. These are observations, not APIs already connected.

Measure search, AI referrals, engaged reads, next-step clicks, tool completion, saves/sharing, internal no-result searches, real questions and revenue. Do not send names, emails, private plans or post text to analytics. Twenty-eight-day baseline; low samples remain inconclusive. Initial opportunity thresholds: 200 impressions for CTR review; 10 repeated zero-result searches; 3 independent similar questions; 20 tool starts and <40% completion for UX review.

Ad relaunch: controlled responsive slots (long article max2, short max1), protect summaries/maps/costs/safety/controls. Interactive/auth/admin/share and initial community ad-free. Development/previews ad-free. Record existing settings; disable automatic winner application and uncontrolled changes. One experiment at a time; compare revenue with completion, next-step behavior, return use and CLS. Consent/CMP and GA4-AdSense connection are launch prerequisites, not assumed configured.

## Hosting and gates

Copied export observation: 9187 files, ~510MiB. The clean rebuilt export is approximately 5338 files / 322MiB (exact measured reference in data/export-baseline.json and private export report). Removed unreferenced raw-image intermediates, retired generators/drafts, old speculative manuals and duplicated route-generated images after recovery preservation. Framework RSC files remain intact. PagesFree limits currently20000 files/25MiB each/500builds per month. Warn14000, stop file-increasing normal deploys16000. Social variants are generated client-side; community records do not multiply static export pages. Report six-month forecast monthly.

Static site remains Next.js. Separate Worker/Hono + D1 for API/community, Better Auth native D1 + Google/email and ResendFree. Runtime schema introspection is replaced by pinned migration and isolated-export schema checks. The documented server API avoids rebuilding the general authentication HTTP router on each request; the small route allowlist retains strict same-origin JSON writes, callback-origin validation, atomic rate limits, vendor OAuth state/token checks and request-local contexts. Preserve the owner's observed-trial decision above. Never silently spend or migrate providers. Editorial pages remain independent of API availability.

Delivery sequence: audit/recovery → free-runtime proof → shared design/3 representative guides →8 launch hubs →16+core tools →32→40+remaining tools →verified community →operations. Three prototype guides count in40. Record actual gates rather than declare all scope complete after scaffolding.
