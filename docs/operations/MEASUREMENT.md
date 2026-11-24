# Measurement contracts and evidence

## Optional analytics

Only `https://koreaexperience.com` public editorial/tool routes may queue events after analytics consent. Event schemas accept known public IDs, tool names, categories, relation types and coarse search intent. Raw searches, names, email, post text, private plan data and arbitrary properties are excluded. URL query/hash fields are removed; external referrers are reduced to origins. Community, account, callback, moderation and sharing-token routes are excluded from this tracker.

Storage/tag exceptions must not interrupt saving, calculating or sharing. A failed persistence attempt revokes an earlier acceptance in the current view. Analytics consent and Google's advertising CMP are separate choices. Preview/synthetic runs must not send real provider events.

| Event              | Qualification                                                                                                        | Interpretation                                                   |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `page_view`        | Accepted public path changes; repeated consent-open/accept does not add a view                                       | Locally queued page view, not guaranteed reporting receipt       |
| `guide_engaged`    | At least45 visible seconds after consent plus reaching the article midpoint; once per mounted guide                  | A defined reading signal, not proof of comprehension             |
| Discovery clicks   | User activates a homepage or guide discovery link after consent                                                      | Entry clicks by source page and action type                     |
| `tool_start`       | First focus/action that can queue after consent, once per mounted tool                                               | Tool interaction, not necessarily a new person/session           |
| `tool_complete`    | First successful calculation; first itinerary addition/edit; first checklist item checked; rain area/priority change | First useful result milestone per mounted tool                   |
| `tool_recalculate` | Subsequent successful result updates in that same mounted tool                                                       | Repeat edits/calculations; excluded from first-completion totals |
| Share events       | Copy, native handoff, channel click or card download, separately                                                     | Not proof of social publication or recipient visits              |

Do not divide all-time event counts into a unique-user funnel. Analyze compatible sessions/users, eligible starts, date windows and consent coverage. Route reloads/mounts can produce another milestone. A local queue assertion is not GA4 DebugView or Data API receipt. Keep actual receipt verification separate and exclude identifiable test traffic from growth conclusions; do not create irreversible data filters without evidence and approval.

## Official reporting

For broader traffic trends, compare visits and page views from the existing Cloudflare Web Analytics
site for `koreaexperience.com`. Keep the exact reporting window, hostname and bot filter with the
observation. Cloudflare Web Analytics defines a visit by the entry referrer and uses a browser
beacon. GA4 active users are consented people estimates. Cloudflare's edge request and unique-IP
totals include other traffic and have a separate operational purpose. Preserve these scopes when
checking whether an apparent GA4 drop also appears in browser visits or search clicks. See the
[Cloudflare visit definition](https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/).

### Cloudflare visit observations

Use the existing signed-in Cloudflare Web Analytics site, open **Visits** and leave the series at **All**. Use `Host equals koreaexperience.com`, `Exclude bots equals Yes` and `GMT+9`. For each run, take the last fully settled date from the GA4 window in `growthGoals.visitors.window.endDate` or use four calendar days before today's Korean date. Observe that day, the same weekday seven days earlier, and the two adjacent seven-day periods ending on those dates. Open **Absolute time range** for each period and use midnight at the start and midnight on the day after its inclusive end. Confirm the exact range and refreshed **Total visits** before recording. A daily bucket from a wider chart may have a different boundary.

Save the four observed totals in `.private/reports/cloudflare-visits-latest.json`:

```json
{
  "source": "Cloudflare Web Analytics dashboard",
  "hostname": "koreaexperience.com",
  "timeZone": "Asia/Seoul",
  "excludeBots": true,
  "observedAt": "2026-11-24T00:00:00Z",
  "observations": [
    { "startDate": "2026-11-20", "endDate": "2026-11-20", "displayedVisits": "123" }
  ]
}
```

The example includes one synthetic range only. Copy provider display text as shown, including abbreviated totals such as `1.55k`. Weekly changes and daily averages based on abbreviated values are approximate. Leave missing ranges absent. If the dashboard is inaccessible, preserve the previous capture and record the access problem. `npm run metrics` reads the local observation and labels missing, incomplete and stale ranges. The command does not fetch Cloudflare automatically. Keep actual dashboard capture time and report generation time separate. Use the existing check schedule and browser session for this observation. The output is `growthGoals.cloudflareVisits`, a broad audience trend and operational proxy for the 10,000 daily audience goal. Keep it separate from `growthGoals.visitors` (GA4 consenting active users) and `growthGoals.revenue` (AdSense). Cloudflare’s bot filter and sampling affect coverage. Counting browser visits cannot establish that 10,000 distinct people visited.

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

Search Console sitemap observations record the provider's last download, pending status, warnings and errors for the approved property. Compare Google's downloaded version with the current public sitemap. Sitemap submission counts and HTTP responses do not establish which URLs Google has indexed.

The `discovery` field in the private metrics report summarizes the existing apex GA4 public events report for each window. On the homepage, `home_first_trip` is the planning guide entry, `home_destinations` jumps to the photo grid, `home_destination` opens a city hub from the grid, and `home_all_destinations` opens the complete directory. From a guide, `guide_first_trip`, `guide_more_planning`, `guide_destination`, and `guide_destinations` open the first-trip guide, planning category, related city hub, and complete directory respectively. Existing editorial next-guide relationships remain in `related_guide_click`.

Use the provider's `eventName` and `pagePath` dimensions and `eventCount` metric to drill into a source guide. The discovery events send only the sanitized source page context. These counts describe where consenting readers choose to go and may include more than one click per reader. A missing event row is `null`. Treat `partial` windows as incomplete when the API reports thresholding, sampling, grouped rows or truncated retrieval. Evaluate the first full post-release windows after the reporting freshness buffer so a window spanning deployment does not appear to represent a full period on the new design.

An active comparison in `.private/reports/growth-comparison.json` adds two adjacent post-release weeks and selected canonical guides to the existing `npm run metrics` checks. Each source waits for three full days in its reporting timezone after the period ends. The report keeps finalized search and consented analytics separate and preserves missing rows. A comparison can support a decision about growth, subject to coverage and sample size.

Use `.private/reports/growth-expansion-comparison.json` for the additional 50-guide release. Take its date from the last new guide’s verified public release and list all 50 canonical guide paths. The same weekly metrics run reports this comparison separately as `growthExpansion`. Its search landing data are limited to those paths. Analytics totals and the separate AdSense daily goal report cover the site.

Every `npm run metrics` run also updates `growthGoals` in the timestamped private report and in `metrics-latest.json`. This tracks the 10,000 daily visitors and US$100 daily ad revenue targets. GA4 uses `activeUsers` per date for the exact apex hostname in Asia/Seoul. Treat it as an audience estimate with consent and analytics coverage limits. AdSense uses domain/date estimated earnings in USD and page views in America/Los_Angeles. Its weekly page RPM divides the sum of earnings by the sum of reported page views and multiplies by 1,000. [GA4 data schema](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema) · [AdSense reporting](https://developers.google.com/adsense/management/reference/rest/v2/accounts.reports/generate)

Each provider gets its own rolling 28-day window after three full local days have passed. Read each series with its stated dates and coverage. The report shows the latest eligible day's target gap and compares it with the same weekday a week earlier. It also compares the latest seven days with the previous seven. A weekly audience average is a mean of daily active users. Weekly averages and counts of goal-reaching days require all seven daily values. Missing rows, wrong units or dates, duplicate days, and GA4 sampling or thresholding leave affected results unknown. Report access failures stay `unavailable` and preserve the previous successful API read separately. Recurring checks use the existing scheduler and local reporting environment.

Pagination is bounded at100,000 rows and explicitly partial when capped. Actual URL inspection describes Google's indexed version, not a live crawl or indexing request. Unknown backlinks and first-public dates still block retirement. Keep dated browser snapshots as supplementary evidence rather than silently merging periods/scopes.

The due inspection report compares Google's last recorded crawl with the latest verified release for each URL. Read the crawl and index findings together. At the 28-day review, prioritize guides where Google reports a crawl after deployment and a continuing exclusion. Keep missing release dates, unavailable reads and older crawls separate from that review queue.

## Performance and social evidence

The isolated Lighthouse job measures three cold mobile and desktop runs for home, a guide and the budget tool. Retain version/profile/time, raw reports, median and range. Local static export, blocked ads/analytics and simulated network/CPU differ from production users. Lab TBT is not field INP. Field CWV and repeat-use evidence require elapsed real traffic.

Tool HTML metadata and1200×630 cards have export/fingerprint guards. Downloaded feed/story QR tests must decode the actual composed image and reopen validated public inputs. DOM metadata and a browser-visible card are not a certified Facebook/LINE/WhatsApp/X renderer; keep platform-rendered preview observations separately dated. Do not add unverified social accounts.
