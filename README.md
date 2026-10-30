# Korea Experience

English-first practical Korea travel guides, useful tools and a moderated travel community. Production: https://koreaexperience.com. GitHub main deploys the static Next.js export to the existing Cloudflare Pages project.

## Run and verify

Use Node 24 and npm. From C:/Projects/korea-experience:

```powershell
npm ci
npm run check
npm run build
node scripts/preview.mjs
```

Preview: http://127.0.0.1:3000. For source development use npm run dev. Do not run a development server and a production build against the same .next directory simultaneously.

## Content

Read AGENTS.md and .agents/skills/korea-content-operations/SKILL.md. New requested batches are researched and authored in this chat; there is no bulk Gemini text generator. Launch: 40 reviewed guides, 14 new URLs and 26 rewritten URLs. See data/launch-manifest.json. Future “N new guides” excludes updates from N.

Markdown remains in content/posts and content/deep-dive. Stable editorial IDs, source verification, relationships and classification are in data/editorial.json. Places and media rights are separate registries. Keep important facts traceable to verified primary evidence. Do not imply firsthand visits or a live price/booking feed.

Build checks content relationships, generates the public search/catalog and validates the 41 committed shared cards, exports Next.js, then enforces Cloudflare file budgets. Never strip generated framework files. When guide metadata or a photograph changes, run npm run generate:cards and inspect it before the build. Cards are fingerprint-checked, avoiding differences between local and Cloudflare system fonts. Shared story images are generated on demand in the browser.

## Community

workers/community is a separate Hono Worker with native D1, Better Auth Google and hashed single-use email login links. npm run check:community checks permissions, moderation, duplicate reactions, private plans, shared-link revocation and deletion. Community stays disabled until real provider credentials, Turnstile, free-tier CPU and external end-to-end tests pass. See docs/operations/SETUP.md. No automatic paid upgrade.

## Operations

Read docs/roadmap/COMMERCIAL_REBUILD.md for actual status and docs/operations/MAINTENANCE.md for the daily/weekly workflow. Private reports and secrets belong in .private or provider secrets, never Git. Ad delivery is configuration-gated until real units and consent are verified. Retiring public guides requires usage/link/seasonal evidence and incoming-link repair.

Recovery: Git tag rebuild-baseline-2026-10-30; external pre-cleanup copies in C:/Projects/korea-experience-recovery-2026-10-30. Source and content rollback use Git; provider database recovery is separate. Legacy raw drafts, one-off repair scripts and unrelated SQLite data were removed from the active checkout after preservation.
