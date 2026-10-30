# Operating Korea Experience

Actual status is in docs/roadmap/COMMERCIAL_REBUILD.md. The account observations there are dated snapshots, not a live API feed. Daily and weekly heartbeat IDs: korea-experience and korea-experience-2, attached to this chat, Asia/Seoul. Local runs require this computer and the app to be available. Never count a missed run as a successful check.

## Lock and evidence

Before editing, check Git status and .private/maintenance.lock. Do not overwrite another active edit or push. Create the lock with exclusive file creation, record this task and timestamp, and remove only your own lock after finishing. A stale lock requires checking the associated task/process; elapsed time alone is not permission to discard it. Store raw reports and account exports under .private/reports/YYYY-MM-DD. Record period, scope, filters, timezone, source, last data date and whether observed/API/unavailable. Logs alone do not require a deploy.

## Daily 10:00 KST

Run npm run health; inspect actual Pages deployment commit and production domain. Check sitemap/robots/canonical and new or refreshed URLs at 7/14/28 days. Authenticated GSC: https://search.google.com/search-console?hl=ko&resource_id=sc-domain:koreaexperience.com. Check real indexing status and crawl evidence; do not use bulk indexing services or claim a sitemap submission guarantees indexing. Check moderation, reports and free quotas if community is connected. AdSense: https://adsense.google.com/adsense/u/0/pub-7793293419727384/home; inspect policy center/delivery anomalies without clicking live ads. Record unavailable access and notify on actionable expiry/failure. Stay quiet when unchanged.

The owner chose the current Better Auth/Workers Free observed production trial on 2026-10-31 despite measured CPU spikes. Inspect actual Worker CPU percentiles, 1102/exceededCpu outcomes, auth 5xx/delivery errors, D1 and mail quotas, plus moderation backlog. Zero events in a short tail means unobserved, not zero failures; compare dated metrics windows. Do not repeatedly send test login emails or manufacture member engagement. Record evidence privately and notify meaningful failures. No automatic Supabase enrollment/migration, paid upgrade or claim that the nominal 10ms limit has been proven safe. Static guides must remain accessible during API problems. Internal email caps are 90/day and 2700/month.

## Monday 10:30 KST

Compare equal 28-day periods for GSC queries/countries/devices, actual analytics engagement and next-guide transitions, tools, saves/shares, internal no-results and repeated community needs, and site-specific AdSense revenue/RPM. Never mix account-wide and site-only values. Look for opportunity after 200 impressions for CTR, 10 same-intent no-results, three independent similar questions, or 20 tool starts with <40% completion. Small samples remain inconclusive. AI referrals need observed source attribution; keep unknowns unknown. Record 16 stable monthly question probes without treating the sample as a ranking guarantee.

Produce: change → likely reader need → next improvement/topic → uncertainty/hold. Improve, merge or retire at most five existing guides; no unsolicited scheduled new articles. One ad experiment at a time, with country/device/season controls and UX guardrails, not just RPM. Revert harmful layouts. Check tools/auth/share/admin and initial community remain ad-free. Real units and regional consent/CMP must be verified before enabling ads.

## Monthly first week

Audit all eligible aged-unindexed URLs and the six-month file forecast. The 90-day clock needs a defensible first-public date, not a recently edited frontmatter field. Unknown clicks, saves or backlinks means hold. Use lib/retirement.ts as a decision guard, with a recorded human-readable reason and source evidence. Valuable guides get one focused improvement and 28-day reassessment. Seasonal/journey value protects useful content. True duplicates get an equivalent 301; removed standalone content gets 404, never a blanket homepage redirect.

Retirement is one change set: recovery snapshot; all inbound body/anchor/hub/related/tool/language/community/saved/public-plan references; merged text; redirect or actual 404; catalog/search/sitemap; type/content tests; build/export budget; Git main push; actual deployment response. Current automation must not retire a URL until dynamic references can also be queried/repaired. Do not treat local client storage as centrally editable: resolve stable IDs and show unavailable items with removal/undo.

Review region/language demand, useful community answers, ad experiment results, quotas, privacy settings and a real restoration drill. File warning 14,000, block ordinary file-increasing deployment at 16,000; platform maximum 20,000/25MiB per file. Keep framework output intact. No paid upgrades. Image-generation exception is KRW10,000/month, reserved with current prices/FX/tax before any Google call; unknown cost means no paid call.

## Release and recovery

Use npm run check, npm run check:community when affected, and npm run build. Inspect exported pages and the browser tasks, then commit/push the reviewed change. Verify Cloudflare's production commit and public routes. Source recovery: rebuild-baseline-2026-10-30 plus subsequent Git commits. Use a revert commit for production rollback. D1 recovery requires an export and an actual isolated restore test; do not claim Git restores member data. Never put secrets, private metrics, user content or backups in the public repository.
