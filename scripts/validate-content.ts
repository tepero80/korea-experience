import fs from 'node:fs';
import { getAllPosts, getLaunchGuides, getPostBySlug } from '../lib/posts';
import { PLACES, RETIREMENTS } from '../lib/editorial';
import { PRACTICAL_TOOLS } from '../lib/constants';
import initialLaunch from '../data/launch-manifest.json';
import { unaccountedLaunchGuides } from '../lib/retirement';
const posts = getAllPosts(),
  launch = getLaunchGuides(),
  slugs = new Set(posts.map((p) => p.slug)),
  ids = new Set<string>();
const errors: string[] = [];
for (const p of posts) {
  if (ids.has(p.id)) errors.push('Duplicate ID ' + p.id);
  ids.add(p.id);
  if (p.image && !fs.existsSync('public' + p.image)) errors.push('Missing image ' + p.slug);
  const e = p.editorial;
  if (!e) continue;
  if (!e.answer || e.sources.length === 0 || !e.checkedAt || !e.imageCredit?.license)
    errors.push('Incomplete review ' + p.slug);
  if (e.checkedAt < '2026-10-30') errors.push('Review date predates launch ' + p.slug);
  for (const s of e.sources) {
    if (!/^https:\/\//.test(s.url) || !s.checkedAt) errors.push('Invalid source ' + p.slug);
  }
  for (const r of e.relations)
    if (!slugs.has(r.slug) || r.slug === p.slug || !r.reason)
      errors.push('Broken relation ' + p.slug + ' -> ' + r.slug);
  for (const id of e.placeIds)
    if (!PLACES.some((p) => p.id === id)) errors.push('Unknown place ' + id);
  for (const id of e.tools)
    if (!PRACTICAL_TOOLS.some((t) => t.href === '/tools/' + id)) errors.push('Unknown tool ' + id);
  for (const m of getPostBySlug(p.slug)!.content.matchAll(/\]\(\/blog\/([^\s)#/]+)(?:#[^)]+)?\)/g))
    if (!slugs.has(m[1])) errors.push('Broken body link ' + p.slug + ' -> ' + m[1]);
}
if (
  initialLaunch.length !== 40 ||
  new Set(initialLaunch.map((guide) => guide.slug)).size !== 40 ||
  new Set(initialLaunch.map((guide) => guide.id)).size !== 40
)
  errors.push('The historical forty-guide launch manifest is incomplete or duplicated');
for (const guide of unaccountedLaunchGuides(
  initialLaunch,
  launch,
  RETIREMENTS.map((r) => r.slug),
))
  errors.push('Launch guide lost without a recorded retirement: ' + guide.slug);
for (const r of RETIREMENTS) {
  if (
    !r.reason?.trim() ||
    !r.decidedAt ||
    !r.evidence?.publicationDate ||
    !r.evidence?.reviewedAt ||
    !r.evidence?.indexingStatus?.trim() ||
    /unknown|unavailable|unverified|pending|not.checked/i.test(r.evidence.indexingStatus) ||
    !r.evidence.usageChecked ||
    !r.evidence.linksChecked ||
    !r.evidence.seasonalChecked
  )
    errors.push('Incomplete retirement review ' + r.slug);
  if (slugs.has(r.slug)) errors.push('Retired URL still published ' + r.slug);
  if (r.action === 'redirect' && (!r.target || !slugs.has(r.target)))
    errors.push('Invalid retirement target ' + r.slug);
  for (const p of posts)
    if (getPostBySlug(p.slug)!.content.includes('/blog/' + r.slug))
      errors.push('Incoming retired reference ' + p.slug);
}
for (const p of PLACES)
  if (
    !Number.isFinite(p.latitude) ||
    !Number.isFinite(p.longitude) ||
    Math.abs(p.latitude) > 90 ||
    Math.abs(p.longitude) > 180
  )
    errors.push('Invalid coordinates ' + p.id);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `Content checks passed: ${posts.length} published, ${launch.length} reviewed, ${PLACES.length} places.`,
);
