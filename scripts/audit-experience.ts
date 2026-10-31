import fs from 'node:fs';
import crypto from 'node:crypto';
import { getAllPosts, getPostBySlug } from '../lib/posts';
import { internalGuideLinks } from '../lib/content-links';
import media from '../data/media.json';
import type { EditorialMedia } from '../lib/media';

const posts = getAllPosts().map((p) => getPostBySlug(p.slug)!);
const registry = media as EditorialMedia[];
const mediaByPath = new Map(registry.map((m) => [m.src, m]));
const digest = new Map<string, string>();
const sha = (path: string) => {
  if (!digest.has(path))
    digest.set(
      path,
      crypto
        .createHash('sha256')
        .update(fs.readFileSync('public' + path))
        .digest('hex'),
    );
  return digest.get(path)!;
};
const heroIdentity = (p: (typeof posts)[number]) => {
  const m = p.image ? mediaByPath.get(p.image) : undefined;
  return (
    m?.credit.sourceUrl ||
    p.editorial?.imageCredit?.sourceUrl ||
    (p.image ? 'file-sha256:' + sha(p.image) : 'none:' + p.slug)
  );
};
const groups = new Map<string, string[]>();
for (const p of posts)
  groups.set(heroIdentity(p), [...(groups.get(heroIdentity(p)) || []), p.slug]);
const incoming = new Map<string, string[]>();
for (const p of posts)
  for (const target of [
    ...internalGuideLinks(p.content),
    ...(p.editorial?.relations.map((r) => r.slug) || []),
  ])
    incoming.set(target, [...new Set([...(incoming.get(target) || []), p.slug])]);
const inventory = posts.map((p) => {
  const internalLinks = internalGuideLinks(p.content);
  const bodyPhotoIds = [...p.content.matchAll(/<GuidePhoto\s+id="([^"]+)"/g)].map((m) => m[1]);
  const withheldAttributions = [...p.content.matchAll(/<ExpertTip\b/g)].length;
  const flags = [
    ...(!p.reviewed ? ['editorial-review-pending'] : []),
    ...(withheldAttributions ? ['archive-attribution-withheld-no-evidence'] : []),
    ...(!p.editorial?.imageCredit ? ['hero-provenance-not-reviewed'] : []),
    ...((groups.get(heroIdentity(p))?.length || 0) > 1 ? ['hero-original-reused'] : []),
    ...(!bodyPhotoIds.length && !/!\[|<ImageGallery|<img\b/.test(p.content)
      ? ['no-contextual-body-photographs']
      : []),
    ...(!internalLinks.length ? ['no-contextual-guide-links'] : []),
    ...(p.editorial?.answer === p.excerpt ? ['quick-answer-repeats-deck'] : []),
    ...(!p.reviewed &&
    /medical|clinic|surgery|treatment|visa|tax|allerg|medication|emergen/i.test(p.title)
      ? ['priority-factual-risk-review']
      : []),
  ];
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    reviewed: p.reviewed,
    category: p.categoryId,
    declaredPublication: p.date,
    publicationStatus: p.publicationStatus,
    checkedAt: p.checkedAt || null,
    hero: p.image || null,
    heroOriginal: heroIdentity(p),
    bodyPhotoIds,
    withheldAttributions,
    internalGuideLinks: internalLinks,
    incoming: incoming.get(p.slug) || [],
    sources: p.editorial?.sources || [],
    flags,
    decision: p.editorial?.heroMediaId
      ? 'implemented-awaiting-traveler-acceptance'
      : 'hold-for-editorial-review',
    reason: p.editorial?.heroMediaId
      ? 'Rewrite and distinct media prepared; visual/task acceptance recorded separately.'
      : 'Indexing, usage and backlinks unavailable; archive first-public dates unverified. Preserve URL and prioritize factual/source review instead of deleting blindly.',
    deletionEvidence: {
      indexing: 'unavailable',
      usage: 'unavailable',
      backlinks: 'unavailable',
      seasonAndJourney: 'requires-editorial-review',
    },
  };
});
const counts = Object.fromEntries(
  [...new Set(inventory.flatMap((p) => p.flags))].map((f) => [
    f,
    inventory.filter((p) => p.flags.includes(f)).length,
  ]),
);
const report = {
  at: new Date().toISOString(),
  sourceCommit: process.env.GITHUB_SHA || 'working-tree',
  total: posts.length,
  reviewed: posts.filter((p) => p.reviewed).length,
  counts,
  duplicateHeroGroups: [...groups]
    .filter(([, v]) => v.length > 1)
    .map(([source, slugs]) => ({ source, slugs })),
  inventory,
};
fs.mkdirSync('.private/reports', { recursive: true });
fs.writeFileSync(
  '.private/reports/experience-inventory.json',
  JSON.stringify(report, null, 2) + '\n',
);
console.log(
  JSON.stringify(
    {
      total: report.total,
      reviewed: report.reviewed,
      flags: counts,
      duplicateHeroGroups: report.duplicateHeroGroups.length,
    },
    null,
    2,
  ),
);
