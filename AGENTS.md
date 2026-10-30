# Korea Experience

This project is an English-first practical Korea travel publication. The owner authorized the commercial rebuild, GitHub main pushes, Cloudflare deployments, and bounded ongoing maintenance. Never spend on services; the sole paid exception is Google image generation capped at KRW 10,000/month. Never expose credentials or private analytics/member data.

Read `docs/roadmap/COMMERCIAL_REBUILD.md` for the accepted scope and actual implementation status. Read `.agents/skills/korea-content-operations/SKILL.md` for new content and maintenance work. Respect the difference between implemented, tested, deployed, and externally connected.

For actual publication evidence, read `.private/reports/release-latest.json` when present and compare its commit with Git and Cloudflare. Deployment/account observations are private operational evidence; documentation changes alone do not require a new deployment.

Preserve useful public article URLs. Never delete a post just because it is not indexed. Follow the recorded 90-day review and one 28-day improvement cycle, protect actual usage/link/seasonal value, and repair all incoming references on retirement. New content must have verified primary evidence and honest image provenance. Do not invent expertise, visits, visitors, statistics, bookings, or dates.

On 2026-10-31 the owner explicitly chose to publish and operate the current Better Auth configuration as an observed free-tier trial instead of switching to Supabase. Real Google/email round trips work, but CPU spikes exceed the nominal 10ms Free budget. Do not claim CPU compliance or silently enroll in Supabase/upgrade plans. Monitor actual 1102/exceededCpu failures, login/delivery errors and quotas under docs/operations/MAINTENANCE.md.

Use the local Node installation with `npm.cmd` on Windows. Test via `npm run check` and `npm run build` once available. Do not remove Next.js-generated RSC files to satisfy hosting budgets. Review export file counts and real browser behavior. Verify authentication, secrets, deployed permissions and moderation before exposing writes; preserve the owner's explicitly recorded CPU-trial exception above.
