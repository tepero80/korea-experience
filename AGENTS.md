# Korea Experience

This project is an English-first practical Korea travel publication. The owner authorized the commercial rebuild, GitHub main pushes, Cloudflare deployments, and bounded ongoing maintenance. Never spend on services; the sole paid exception is Google image generation capped at KRW 10,000/month. Never expose credentials or private analytics/member data.

Read `docs/roadmap/COMMERCIAL_REBUILD.md` for the accepted scope and actual implementation status. Read `.agents/skills/korea-content-operations/SKILL.md` for new content and maintenance work. Respect the difference between implemented, tested, deployed, and externally connected.

The accepted traveler-quality upgrade is in `docs/roadmap/TRAVELER_EXPERIENCE_UPGRADE.md`. It extends the launch scope: audit all 794 guides, upgrade core 40 with distinct hero originals and useful contextual visuals, strengthen the three principal planning tools, and verify diverse traveler journeys. Follow its requirement/evidence matrix; passing a build or inspecting a few screens does not complete the upgrade. Keep persona simulations distinct from real user research.

For actual publication evidence, read `.private/reports/release-latest.json` when present and compare its commit with Git and Cloudflare. Deployment/account observations are private operational evidence; documentation changes alone do not require a new deployment.

Preserve useful public article URLs. Never delete a post just because it is not indexed. Follow the recorded 90-day review and one 28-day improvement cycle, protect actual usage/link/seasonal value, and repair all incoming references on retirement. New content must have verified primary evidence and honest image provenance. Do not invent expertise, visits, visitors, statistics, bookings, or dates.

On 2026-10-31 the owner explicitly chose to publish and operate the current Better Auth configuration as an observed free-tier trial instead of switching to Supabase. Real Google/email round trips work, but CPU spikes exceed the nominal 10ms Free budget. Do not claim CPU compliance or silently enroll in Supabase/upgrade plans. Monitor actual 1102/exceededCpu failures, login/delivery errors and quotas under docs/operations/MAINTENANCE.md.

Use the local Node installation with `npm.cmd` on Windows. Test via `npm run check` and `npm run build` once available. Do not remove Next.js-generated RSC files to satisfy hosting budgets. Review export file counts and real browser behavior. Verify authentication, secrets, deployed permissions and moderation before exposing writes; preserve the owner's explicitly recorded CPU-trial exception above.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
