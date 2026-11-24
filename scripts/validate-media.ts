import fs from 'node:fs';
import crypto from 'node:crypto';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '../lib/posts';
import mediaData from '../data/media.json';
import destinationReviews from '../data/destination-guide-photos.json';
import type { EditorialMedia } from '../lib/media';
import { generatedArchiveCoverHash, guideHeroPhotograph, mediaForSource } from '../lib/media';
const registry = mediaData as EditorialMedia[];
const errors: string[] = [];
const byId = new Map<string, EditorialMedia>();
for (const m of registry) {
  if (byId.has(m.id)) errors.push(`Duplicate media ID ${m.id}`);
  byId.set(m.id, m);
  if (!fs.existsSync('public' + m.src)) errors.push(`Missing registered image ${m.id}`);
  for (const src of m.srcSet?.split(',').map((s) => s.trim().split(' ')[0]) || [])
    if (!fs.existsSync('public' + src)) errors.push(`Missing responsive image ${src}`);
}
const posts = getAllPosts().map((p) => getPostBySlug(p.slug)!);
const fileHashes = new Map<string, string>();
function fileIdentity(src?: string) {
  if (!src || !fs.existsSync('public' + src)) return undefined;
  if (!fileHashes.has(src))
    fileHashes.set(
      src,
      crypto
        .createHash('sha256')
        .update(fs.readFileSync('public' + src))
        .digest('hex'),
    );
  return 'file-sha256:' + fileHashes.get(src);
}
const identities = (p: (typeof posts)[number]) => {
  const m = p.editorial?.heroMediaId
    ? byId.get(p.editorial.heroMediaId)
    : mediaForSource(p.image);
  return new Set(
    [
      p.image,
      fileIdentity(p.image),
      m?.originalHash,
      m?.originalId,
      m?.credit.sourceUrl,
      p.editorial?.imageCredit?.sourceUrl,
    ].filter(Boolean),
  );
};
const heroOwners = new Map<unknown, string>();
for (const p of posts)
  for (const identity of identities(p)) {
    const previous = heroOwners.get(identity);
    if (previous && previous !== p.slug)
      errors.push(`Reused hero original ${p.slug} -> ${previous}`);
    heroOwners.set(identity, p.slug);
  }
for (const p of posts) {
  const generatedHash = generatedArchiveCoverHash(p.slug, p.image);
  if (p.image && !generatedHash) {
    const credit = mediaForSource(p.image)?.credit;
    if (!credit?.author || !credit?.sourceUrl || !credit?.licenseUrl)
      errors.push(`Guide hero needs a registered source and reuse terms: ${p.slug} -> ${p.image}`);
  }
  if (generatedHash && p.image && fs.existsSync('public' + p.image)) {
    const bytes = fs.readFileSync('public' + p.image);
    const blob = crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    if (blob !== generatedHash || mediaForSource(p.image)?.credit.kind === 'photograph')
      errors.push(`Review conflicting archive illustration evidence ${p.slug}`);
  }
  for (const match of p.content.matchAll(/<GuidePhoto\s+id="([^"]+)"/g)) {
    if (!byId.has(match[1])) errors.push(`Unknown body image ${p.slug}: ${match[1]}`);
    if (match[1] === p.editorial?.heroMediaId)
      errors.push(`Hero repeated as a body image ${p.slug}: ${match[1]}`);
  }
  if (!p.editorial?.heroMediaId) continue;
  const m = byId.get(p.editorial.heroMediaId);
  if (
    !m ||
    m.src !== p.image ||
    !m.originalHash ||
    !m.originalId ||
    !m.alt ||
    !m.credit.author ||
    !m.credit.licenseUrl
  )
    errors.push(`Incomplete upgraded hero ${p.slug}`);
}
const postsBySlug = new Map(posts.map((post) => [post.slug, post]));
const validScore = (value: number, upper: number) =>
  Number.isInteger(value) && value >= 0 && value <= upper;
for (const [slug, review] of Object.entries(destinationReviews)) {
  const post = postsBySlug.get(slug);
  const asset = byId.get(review.mediaId);
  if (
    !post?.indexable || post.editorial?.heroMediaId !== review.mediaId || !asset || asset.src !== post.image ||
    asset.credit.kind !== 'photograph' || !asset.credit.sourceUrl || !asset.credit.author ||
    !asset.credit.licenseUrl ||
    !validScore(review.subjectUsefulness, 3) || review.subjectUsefulness < 2 ||
    !validScore(review.sceneClarity, 2) || !validScore(review.cropPotential, 2) ||
    review.subjectUsefulness + review.sceneClarity + review.cropPotential < 5
  ) errors.push(`Invalid photo review for a destination plan ${slug}`);
}
let nextStepCards = 0;
for (const post of posts) {
  for (const target of getRelatedPosts(post.slug)) {
    nextStepCards++;
    if (!guideHeroPhotograph(target.editorial?.heroMediaId, target.image))
      errors.push(`Next-step card needs the linked guide's licensed lead photo: ${post.slug} -> ${target.slug}`);
  }
}
if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exit(1);
}
console.log(
  `Media guard passed: ${registry.length} registered assets; all ${posts.length} guide heroes checked for reused paths, source identities and exact image hashes. ${Object.keys(destinationReviews).length} destination plan photo approvals and ${nextStepCards} next-step photographs are current.`,
);
