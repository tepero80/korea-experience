# Traveler experience upgrade

Accepted direction, 2026-10-31 (Asia/Seoul). Extends COMMERCIAL_REBUILD.md. This is a delivery contract and progress record, not a statement that unfinished work has shipped.

## Outcome and constraints

Korea Experience helps an international traveler find an answer, choose confidently, act in Korea, save/share the useful result, and ask or contribute an experience. Preserve the brand, domain, useful URLs and stable content IDs. Keep the existing free Cloudflare/Better Auth trial; no provider migration or paid upgrade. Follow AGENTS.md for credentials, image spending, factual evidence, moderation and publication authorization.

The upgrade covers the full 794-guide inventory, every hub, tool, community/account and static/error route. Forty reviewed guides receive a complete editorial upgrade in five batches of eight; these are improvements, not forty newly created articles. The other 754 receive recorded quality/risk/duplication decisions. Unknown traffic, backlinks or indexing evidence means hold a deletion decision. Do not infer usefulness from word count or an arbitrary photo quota.

## Baseline at a402467

- 794 public guides, 40 reviewed. All 40 share 11 original hero photographs; no contextual in-body photographs in those guides. Five late galleries repeat the same Bukchon image.
- Article body Markdown links render as anchors; a FAQ answer string leaks Markdown link syntax. String props need the same link audit as Markdown.
- Shared action buttons have no base CSS. Quick answers sit below a large mobile hero and credit block. Home has lost its canonical and lacks WebSite structured data.
- Transit-pass calculation lacks explicit per-person/group scope. Existing itinerary notes must survive a structured-plan upgrade. Legacy medical, military and diagnostic calculators require immediate calculation suspension and noindex review notices.
- Public community is an owner-approved observed free-tier trial. Real Google/email authentication was verified; CPU compliance and automated-browser Turnstile comment submission remain limitations, not passed checks.

Regenerate the inventory and retain timestamped evidence privately before treating these as current measurements.

## Design specification

Use MotionSites' precise composition and screenshot/fix process, adapted to the existing Next.js + Worker stack. References: https://github.com/Motionsites-AI/claude-skill, its MIT instructions and selected travel/discovery examples. Do not copy third-party brands, exact layouts, licensed example assets, commercial fonts or inaccessible effects. No premium purchases or promotional content in the product.

Signature: real place photography paired with a compact, usable trip planner. Mood: clear, contemporary, welcoming. Use a light background, dark ink, teal primary actions and a restrained amber accent. Self-host Manrope headings and Source Sans 3 body/UI under their OFL licenses. Body 17–18px, desktop maximum 1280px, reading column about 720px, mobile gutters 20px. Use visible underlined prose links, 44px touch targets, visible keyboard focus, explicit loading/error/disabled states and short transform/opacity transitions with reduced-motion support. Use a consistent identity across static pages and Hono community/account screens.

Home prioritizes search, journey stage, regions and useful tools. A guide starts with its actual answer, audience/conditions and primary actions; its photograph supports rather than delays that answer. Desktop may pair answer and photo; mobile puts the answer first. Remove misleading empty decoration and long implementation explanations from traveler-facing UI. Keep complete rights and evidence accessible without making the main task harder.

## Requirements and evidence gates

| ID       | Requirement                                                                                             | Evidence required                                                                              | Status  |
| -------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------- |
| AUD-01   | Inventory every public guide and route, media, outgoing/incoming links, content risk and relevance      | Timestamped private inventory; explicit hold/improve/merge/retire reasons                      | Pending |
| MED-01   | Never reuse a hero original across different guides, including recrops/renames                          | Asset IDs/source URLs/hash guard; perceptual candidates visually reviewed                      | Pending |
| MED-02   | Add relevant licensed real photographs and useful process visuals within the article                    | Per-image author/license/source/date/caption/focal point; visual relevance review              | Pending |
| CON-01   | Upgrade all 40 titles/intents to useful decisions, actions and exceptions                               | Claim-level primary evidence, units, check date, booking/navigation/fallback, per-guide record | Pending |
| CON-02   | Use five content formats: compare, place, itinerary, how-to, seasonal                                   | Appropriate visual structure; no generic text/stock-gallery padding                            | Pending |
| NAV-01   | Connect the traveler's next task, nearby options and failure alternatives                               | Contextual HTML links with a stated reason; no retired/broken references                       | Pending |
| UI-01    | Implement the shared design specification across the site                                               | Desktop/mobile screenshots and accessibility/interaction review                                | Pending |
| UI-02    | Make links, buttons, FAQ, menus, search, tables and maps usable                                         | Actual rendered anchor audit and state/keyboard/mobile checks                                  | Pending |
| TOOL-01  | Strengthen budget, pass comparison and itinerary board                                                  | Arithmetic/eligibility/assumption tests and traveler task completion                           | Pending |
| TOOL-02  | Embed airport decision helper, month checklist and rain alternatives in relevant guides                 | Contextual action; no false live-data promises; saved checklist state                          | Pending |
| TOOL-03  | Suspend medical/military/diagnostic legacy calculations; review remaining fun tools                     | Preserved URL, noindex review notice, useful official next action                              | Pending |
| PLAN-01  | Structured itinerary with dates/order/buffers/edit/save/reopen/import/export                            | Versioned data and v1 notes compatibility tests; stage share/revoke test                       | Pending |
| AUTH-01  | Return to the original guide with question/correction draft after login                                 | Safe same-origin returnTo, expired/error states, no open redirect or private URL leakage       | Pending |
| SHARE-01 | Useful share cards and reproducible public calculator inputs                                            | Actual preview/card inspection; no private notes/tokens in analytics or public URLs            | Pending |
| SEO-01   | Restore brand identity and technical discoverability                                                    | Home canonical, WebSite/Organization IDs/logo, verified sameAs only, title/OG consistency      | Pending |
| SEO-02   | Track branded discovery at 7/28/56 days and improve from real evidence                                  | Same-locale dated observations; GSC/AI reports marked unavailable when unavailable             | Pending |
| QA-01    | Block duplicate heroes, missing critical evidence, wrong group totals, broken primary actions and leaks | Build guards, Playwright/axe CI, link audit, private fixture security checks                   | Pending |
| QA-02    | Visually inspect every changed/new page at 320/390/768/1440 and relevant states                         | Coverage register, actual screenshots, defects fixed and rechecked                             | Pending |
| QA-03    | Verify diverse traveler tasks and revise failed journeys repeatedly                                     | Independent simulated persona critiques plus real browser task evidence, clearly labeled       | Pending |
| OPS-01   | Preserve export budgets, privacy, free quotas, recovery and actual release verification                 | Clean export report, stage restore, pushed commit == Cloudflare release, public health         | Pending |

Each guide record must identify URL, user question, primary answer, evidence, hero original, contextual visuals, next action, rendered-link check, viewport coverage and unresolved issues. Do not equate source validation, a passing build or a small screenshot sample with full-page usability.

## Media and content rules

Register immutable original identity, author, original page, license, hash, derivatives, caption and focal point. Different articles cannot use the same original as their hero. An article's own card/hero/OG may share its image. Generated illustrations are labeled and never evidence of an actual facility, route, menu or experience. Place/itinerary guides normally need several contextual real images and a map; transport/how-to guides need useful process photographs/diagrams; budgets/preparation need meaningful examples/comparisons/checklists. Add a visual only where it answers a real question. Keep originals/intermediates outside public, at most two useful responsive sizes (640/1280), one deployed OG per article, personal result cards generated in the browser.

Support changing prices, service schedules, reservations, entry, health and safety near the claim with official sources. Distinguish per-person/per-group/per-night/per-room units, estimates, checked facts and editorial suggestions. Avoid false visits, expertise, guarantees and confirmed future events. Maps need verified coordinates, Korean addresses, address copy and external navigation even if interactive tiles fail.

## Tools and participation

Keep three principal tools: budget, pass comparison, itinerary. Show realistic starting examples, editable assumptions, included/excluded items and share/save behavior. For passes show per traveler and group totals; count cards for each traveler. Itineraries support adding guide places, date edits, ordering, travel buffers, local recovery and private member storage; existing v1 notes/JSON remain readable. Public plan sharing is explicit and revocable.

Move airport, month and rain utilities into the guides where their limited logic is useful. Remove legacy entertainment tools from primary trip-planning navigation. Immediately stop medical/military/diagnostic calculations and offer review notices plus appropriate authoritative information. Later retention/merge/retirement decisions depend on actual utility and protected evidence.

Article questions/corrections/experiences retain a local draft and safe return destination across login. Distinguish pending, published and edited contributions; label editorial versus real traveler content. No fabricated engagement, initial photo upload or private messages. Do not weaken Turnstile to make automation pass. Real bot-check failures remain open until resolved or honestly scoped.

## Verification journeys

1. First-time traveler chooses a Seoul base and a suitable airport transfer.
2. Late arrival finds a usable fallback and a current official timetable/booking path.
3. Family compares per-person and total pass costs without treating group rides as one person's rides.
4. Visitor facing rain/closure selects a practical alternative in the same area.
5. Traveler adds guide places, edits/order/dates/buffers, saves/reopens, shares and revokes a plan.
6. Reader starts a question, logs in, returns to the same guide with the draft, and understands moderation.

Use mobile and desktop, keyboard and zoom, long content and error/empty/loading states. Automated personas are simulations, not actual interviews. Independent critiques must cite task evidence and failed steps; do not manufacture satisfaction scores. Completion means the required journeys work for different traveler needs and all blocking defects are resolved, not merely that the site looks newer.

## Delivery sequence

1. Audit/recovery and urgent FAQ, home metadata, actions and risky-calculator fixes.
2. Shared design with three prototypes: airport-limousine-bus-vs-arex-express-train; seoul-3-day-itinerary-perfect-first-time-visitor-guide-2026; how-to-order-food-in-korean-restaurants-phrases-guide-2026.
3. Upgrade the core forty in five batches of eight, with unique media and per-batch checks.
4. Complete principal tools, structured plans and participation return/draft journeys.
5. Record and execute evidence-based archive repairs/merges/retirements; protect unknown usage and seasonal value.
6. Independent traveler task critique, visual/factual/security regression loops and verified production deployment.

Use existing daily 10:00 and Monday 10:30 KST automations; extend their quality checks without duplicating schedules. Match 28-day cohorts; low samples remain inconclusive. Measure useful onward clicks, saves, shares, tool completion, repeat visits, real questions and revenue together. Observe branded discovery 7/28/56 days after changes; no ranking, indexing or AI-citation guarantees. Keep audit-only records out of deployment-triggering commits when practical. Warn at 14,000 exported files, block file-increasing normal releases at 16,000, preserve framework RSC files and the provider's hard limits.

## Execution log

- 2026-10-31, 918a440 preview checkpoint: the full 328-case isolated run 41152582865 passed 284 and failed 44. Failures repeat across four widths: document CTA and helper-muted contrast, legacy QuickFacts definition-list structure, select/textarea names containing their dynamic contents, and a draft test reading sign-in before activating the lazy discussion. Fix the markup/styles and keep the assertions. The draft journey now includes the user's editor focus after reload. The next suite has 332 cases, including mobile two-column reading, and captures fully decoded images plus exact page/viewport metadata. No full acceptance or production release is claimed from this run.
- In the actual 390px Cloudflare preview, a two-column question/answer table forced a sideways reading task. Two-column prose tables now fit/wrap within the mobile reading width; larger comparisons retain keyboard-accessible horizontal scrolling. A correctly focused Chrome tab is necessary for viewport overrides; record actual innerWidth instead of assuming the requested size was applied.
- Independent source-based traveler simulations (first visit/late arrival; family/winter/Busan; dietary/language/mobility) found and prompted concrete revisions: reproducible airport/rain inputs, stale airport-result removal, terminal-specific operator links, Seoul-only pass scope, a shorter one-night Busan option, a sourced Suwon approach/northern route, current museum access/contact details, Korean communication aids and community retry/keyboard focus. These are simulations and source critiques, not real interviews or visual acceptance.
- Stage Worker version 2b6e7354-858b-4de0-a85a-e17330de6a7e passed 46 actual deployed permission/privacy checks, including expected-title validation alongside plan data. The four-migration remote staging export passed isolated restore/integrity/foreign-key/fixture cleanup. Production remains a402467; its database has not been migrated during this upgrade.
- Daily and weekly existing heartbeat prompts were updated in place with quality/visual/source checks and 7/28/56-day branded-discovery follow-up. No duplicate schedule or paid service was created. The current public source-link run returned 86 successes from 94 URLs, with seven AREX TLS-client incompatibilities and one MOFA cookie/redirect behavior kept as explicit exceptions. The real FSA 404 was replaced by current GOV.UK guidance, not accepted as a passing link.

- 2026-10-31, second implementation checkpoint: all forty core guide bodies and metadata now have their traveler-focused rewrite and forty distinct hero originals. The inventory covers all 794 public guides and currently finds zero duplicated hero originals. Thirty core guides have contextual body photographs; the remaining comparison/process guides rely on their relevant image, tables, examples and/or interactive checklist. Editorial rewrite is not visual acceptance: no guide is marked experienceVersion 2 yet.
- Inspected candidate pixels and rejected a hotel-dominated Haeundae frame, a sunflower-dominated hanok frame, a supposed snowy street that actually showed red leaves, and an obscured skyline. Replaced them with verified district/snow/architectural photographs; removed eight unused public derivatives while retaining private originals/reasons. Native budget and family-occupancy diagrams are labeled illustrations; the phone image is labeled a video still. Diagrams use contain instead of a crop in cards/hero.
- CI run 41146021167 at f69f76e passed all 76 isolated browser tests. Its 56 full-page screenshots were downloaded and SHA-256 verified. The real 390px preview opening fell from 985px to 472px after compacting the answer; summary copying and an actual 1080×1350 card download were checked. Full screenshot acceptance remains pending, and this is a preview, not production.
- Expanded the next CI matrix to all forty guides, eight category hubs, principal destinations/support screens and contextual-helper open states. Month checklists persist locally; shared conditions do not overwrite saved progress. The 21–22h airport check no longer automatically ranks a taxi ahead of a potentially usable rail connection. All three helpers are embedded only where relevant and keep the article/official links usable without loading them.
- KORAIL's actual English form/calendar was opened on 31 October and states advance purchase up to two months. The subsequent schedule search was blocked by the operator's macro protection (-8003); no bypass, inventory validation, reservation, passenger data or payment was attempted. The rail guide distinguishes the observed form from unverified transaction behavior. Corrected an additional legacy 1330 article that incorrectly conflated tourist interpretation with emergency dispatch.
- Current clean export before the final helper/crop adjustments: 885 HTML pages, 60,426 rendered anchors, zero link/anchor/media blockers; 5,447 files / 360,018,818 bytes. The next build must recheck the current source. Production remains a402467; stage Worker migration 0004 and its 45 permission/privacy checks are verified, but production migration/release and real sign-in return/draft tasks remain outstanding.

- 2026-10-31, implementation checkpoint: The shared font/color/action system, home search and canonical/entity metadata, compiled-heading TOC, FAQ string links, risky-calculator notices, and eight representative guide rewrites are implemented locally. Eight hero originals are distinct; the remaining 32 reviewed guides still need their complete media/editorial upgrade. No guide is marked experienceVersion 2 before its traveler/visual acceptance.
- The planner now has versioned v2 data, v1 array/export/account-notes migration, editable days/date/order/visit duration/travel buffer, import/export, guide-place additions and account reopening. New public shares require an explicit field preview and immutable snapshot; notes, exact addresses and date are excluded by default. Worker migration 0004 is additive. Stage deployment/real share-revoke evidence and production release remain separate gates.
- Local evidence: 17 root regression tests and six Worker tests pass. A clean export has 885 HTML pages, 60,527 rendered anchors and zero broken-link/anchor/media blockers; 5,379 files / 351,979,107 bytes. One newly authored `/tools/budget` link failed the release guard and was corrected to the existing `/tools/trip-budget` URL. These are build/functional results, not visual acceptance.
- Current browser capture is returning Page.captureScreenshot timeouts even after a fresh Chrome tab and viewport reset. Supported DOM interactions work; do not certify blank/failed captures. Isolated Playwright/axe CI is configured for four actual CSS widths and retained screenshot artifacts. It has not yet run at this checkpoint. Production is still a402467.
- Subsequent stage evidence: refreshed the existing bounded Wrangler OAuth grant without adding scopes, applied migration 0004 to the dedicated staging D1, and deployed stage version 9ddbcea7-e40a-486d-bc6f-263d859ef55a. All 45 deployed permission/privacy/moderation checks passed; the isolated restore verified four migrations, integrity and fixture cleanup. This does not certify nominal Workers Free CPU compliance. GitHub branch codex/traveler-experience at 96806b5 has begun isolated browser CI; no production upgrade has been published.
- A real 390px browser task found that the opening answer occupied 985px before the photograph. Compact choice copy and a collapsed audience/conditions disclosure are being revised; the first screen and disclosure states must be rechecked. Search navigation, save/reload and the map-load button were exercised; screenshots remain unavailable in the current desktop capture connection.
- CI run 41144348606 at 96806b5 completed: 32/76 passed, 44 failed. Forty failures repeated shared color-contrast defects (home tool numbers, article share box and the paused-tool CTA); four repeated the exact accessible-name mismatch on Add to trip board. The first fix loop preserves the assertions, fixes the shared styles/name and captures all pages before axe assertions. Repeated traces are removed from retained artifacts to avoid unnecessary storage. Failure screenshots were downloaded with their recorded SHA-256 and reviewed privately; this is real isolated-browser evidence, not a desktop screenshot or a production release.
- To keep the mobile introduction short, show the concise answer and primary actions before the photograph, with the expanded choice outline/audience/conditions in one native disclosure. This refines the design specification's answer-before-photo rule; full comparison tables remain in the body. Review the new first screen and open disclosure before acceptance.

- 2026-10-31: Confirmed clean a402467 source, read current operational rules, opened the upgrade work with an exclusive private maintenance lock. Existing public release remains the baseline; no upgrade claimed deployed.
- 2026-10-31: Git c36bdc6 explicitly redistributed 601 legacy dates for a publishing pattern. Legacy frontmatter is not reliable first-public evidence. Keep those dates for archive reference, label them accordingly, omit unverified datePublished/OG publishedTime, and never use them alone to retire a guide. Fourteen launch-new URLs have separate verified release records.
