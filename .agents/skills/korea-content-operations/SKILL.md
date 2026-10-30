---
name: korea-content-operations
description: Create or refresh researched English Korea travel guides, publish requested batches, and maintain this Korea Experience repository. Use only for this project, not generic travel advice.
---

# Korea Experience operations

Read `docs/roadmap/COMMERCIAL_REBUILD.md` and the current content registries before acting. Keep implementation/deployment/integration status accurate.

## Requested content

- Interpret “N new articles” as N new useful search intents; updates are separate. The approved launch40 may mix new and rewritten URLs.
- Inspect current primary sources, local search/community demand and existing URLs. Propose a short topic list and proceed within authorized scope. Default mix: evergreen50%, upcoming2–12weeks30%, currentseason20%; with sufficient evidence use proven60/season20/experiment20.
- Preserve existing URLs for equivalent intents. Give every article a stable ID, one primary category, journey/region/interests, evidence checks, media provenance and deliberate next actions.
- Prefer official sources for changing rules, prices, hours, reservations, entry, safety and healthcare. Link claims near the text. Label estimates/advice. Never fabricate experience, credentials, statistics, bookings, certainty or citations.
- Use real licensed photos for places; log author/license/original URL. Generated media is clearly illustrative. Built-in image generation first; Google image-only fallback is authorized within KRW10000/month, price/FX checked and reserved before calls. No paid call without a calculable remaining allowance.
- Use maps with verified coordinates, Korean addresses/copy and real navigation links; keep equivalent text accessible.
- Check content, internal relationships, evidence, licenses, metadata, mobile UI, build/export budget and actual deployment. Commit/push approved completed batches; verify Cloudflare commit and public routes. Update this project's status record.
- When guide metadata, checked conditions or its photograph changes, run `npm run generate:cards`, inspect the resulting card, then build. Preview images are committed and fingerprint-checked in CI; do not regenerate reviewed typography on every Cloudflare build with different system fonts.

## Maintenance

Daily10:00KST: deployment, canonical URLs, sitemap, moderation, quotas and AdSense policy/delivery anomalies. Monday10:30: search/AI/behavior/revenue, improve or retire up to5 existing guides. First monthly week: aged-unindexed review, ads experiments, regions/languages and storage forecast. No unsolicited new articles. Report meaningful changes/failures/user actions; otherwise remain quiet.

Do not infer zero traffic from inaccessible reports. Use official read APIs when configured and authenticated browser reports as supplementary evidence. Missing/expired access means unverified. Never click live ads or manufacture traffic. Automation needs the local host/app running; do not label a missed run successful.

Retirement: publication90days plus actual unindexed status triggers a review, not deletion. Check technical causes, quality, demand, usage, backlinks, season and journey role. Improve valuable content once then revisit28days later; merge duplicates to equivalent301 targets; low-value unprotected standalone content gets404. Preserve recovery material and repair incoming body/hub/tool/language/community/saved-plan/search/sitemap links. Missing evidence means hold.

Keep private metrics, personal data and credentials outside Git. Never purchase/upgrade services. Honor hosting warning14000/block16000 export-file budgets without stripping framework route files.
