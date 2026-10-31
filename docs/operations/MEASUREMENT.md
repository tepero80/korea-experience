# Measurement contracts and evidence

## Optional analytics

Only `https://koreaexperience.com` public editorial/tool routes may queue events after analytics consent. Event schemas accept known public IDs, tool names, categories, relation types and coarse search intent. Raw searches, names, email, post text, private plan data and arbitrary properties are excluded. URL query/hash fields are removed; external referrers are reduced to origins. Community, account, callback, moderation and sharing-token routes are excluded from this tracker.

Storage/tag exceptions must not interrupt saving, calculating or sharing. A failed persistence attempt revokes an earlier acceptance in the current view. Analytics consent and Google's advertising CMP are separate choices. Preview/synthetic runs must not send real provider events.

| Event              | Qualification                                                                                                        | Interpretation                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `page_view`        | Accepted public path changes; repeated consent-open/accept does not add a view                                       | Locally queued page view, not guaranteed reporting receipt       |
| `guide_engaged`    | At least45 visible seconds after consent plus reaching the article midpoint; once per mounted guide                  | A defined reading signal, not proof of comprehension             |
| `tool_start`       | First focus/action that can queue after consent, once per mounted tool                                               | Tool interaction, not necessarily a new person/session           |
| `tool_complete`    | First successful calculation; first itinerary addition/edit; first checklist item checked; rain area/priority change | First useful result milestone per mounted tool                   |
| `tool_recalculate` | Subsequent successful result updates in that same mounted tool                                                       | Repeat edits/calculations; excluded from first-completion totals |
| Share events       | Copy, native handoff, channel click or card download, separately                                                     | Not proof of social publication or recipient visits              |

Do not divide all-time event counts into a unique-user funnel. Analyze compatible sessions/users, eligible starts, date windows and consent coverage. Route reloads/mounts can produce another milestone. A local queue assertion is not GA4 DebugView or Data API receipt. Keep actual receipt verification separate and exclude identifiable test traffic from growth conclusions; do not create irreversible data filters without evidence and approval.

## Official reporting

The local reporting project is separate from public sign-in. Scopes are exactly GSC, Analytics and AdSense read-only; OAuth permissions themselves can cover reports the owner can access. Code further restricts requests to `sc-domain:koreaexperience.com`, GA4 property522514411 with exact apex-host filter and AdSense `accounts/pub-7793293419727384` with apex-domain revenue filter. No write, billing or public-login scope is requested.

Use the official `google-auth-library`. Windows user DPAPI encrypts refresh credentials; a current-user-only ACL restricts `.private/integrations/google-reporting`. No credentials belong in Git, command arguments, logs, Worker bindings or browser storage. The downloaded Desktop JSON is transient setup material; protect it promptly and remove the task-created plaintext copy after confirmed encrypted storage. Never print provider errors that may contain tokens.

Commands:

```text
npm run reporting:authorize -- --authorize --client-json=<downloaded Desktop JSON path>
npm run reporting:refresh
npm run metrics
```

The setup helper uses a random-port127.0.0.1 callback, PKCE S256 and state; it does not open a browser automatically. The owner approves the three read scopes. External Testing refresh credentials generally expire after seven days for these scopes; do not describe that as durable maintenance. Follow Google's supported personal-use/verification rules and hand security warnings to the owner. A separate process must force refresh and all three reports must return observed data before connection acceptance.

Reports save only under ignored `.private/reports`, with current and previous adjacent28-day windows and a3-day freshness buffer. GSC Web final reports use Pacific dates and remain top-row/privacy-limited after pagination. GA retains hostname filters, timezone, threshold/sampling metadata and quota. AdSense revenue explicitly uses USD and Google's reporting timezone, kept separate from account-home browser cards. Pages join to stable content IDs; a missing row is not zero demand. API failure/expiry/quota is unavailable, never zero activity or policy-clear.

Pagination is bounded at100,000 rows and explicitly partial when capped. Actual URL inspection describes Google's indexed version, not a live crawl or indexing request. Unknown backlinks and first-public dates still block retirement. Keep dated browser snapshots as supplementary evidence rather than silently merging periods/scopes.

## Performance and social evidence

The isolated Lighthouse job measures three cold mobile and desktop runs for home, a guide and the budget tool. Retain version/profile/time, raw reports, median and range. Local static export, blocked ads/analytics and simulated network/CPU differ from production users. Lab TBT is not field INP. Field CWV and repeat-use evidence require elapsed real traffic.

Tool HTML metadata and1200×630 cards have export/fingerprint guards. Downloaded feed/story QR tests must decode the actual composed image and reopen validated public inputs. DOM metadata and a browser-visible card are not a certified Facebook/LINE/WhatsApp/X renderer; keep platform-rendered preview observations separately dated. Do not add unverified social accounts.
