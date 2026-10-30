# Creating and maintaining guides

Use `.agents/skills/korea-content-operations/SKILL.md` and `docs/operations/MAINTENANCE.md`. The retired Gemini article/batch generation commands are intentionally absent. Ask for a researched batch in this chat; N requested new articles means N new URLs, with updates counted separately.

`content/posts` and `content/deep-dive` retain compatible Markdown frontmatter. `data/editorial.json` gives reviewed guides stable IDs, verified facts/sources, trip conditions, relationships, tools and places. `data/launch-manifest.json` records the initial 14 new and 26 rewritten URLs. `data/media.json` and `data/editorial-research/photos.json` record actual photo rights. Never copy a venue's promotional images without reuse permission.

Write for the traveler. Research caveats belong in the evidence record; public copy should explain the concrete choice and its limits. Label planning estimates. Verify changing fares, schedules, admission, immigration, medical and safety facts with primary sources. Show the checking date and cite the relevant fact nearby. Never invent a visit, test, review, traffic statistic or future event date.

Run `npm run generate:cards` after card metadata/photo changes and inspect the images. Run `npm run check`, `npx tsx scripts/audit-inventory.ts`, and `npm run build`; prebuild checks source and link consistency, while postbuild checks actual exported HTML and hosting budgets. Browser-test the relevant trip task. Commit/push a reviewed batch and compare the production deployment commit with Git. Follow public URLs at 7/14/28 days; an HTTP success is not proof of Google indexing.

Existing rich MDX components remain for archive compatibility. New public guides use semantic headings, responsive tables, lists and the shared article's answer, evidence, media, map, tools and next steps. Public community input is plain text and never enters the MDX compiler. Structured data comes from `lib/seo.ts` and matches visible content; extra schema is not a guarantee of rich results or AI citation.
