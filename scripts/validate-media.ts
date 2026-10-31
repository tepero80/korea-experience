import fs from 'node:fs';
import crypto from 'node:crypto';
import { getAllPosts, getPostBySlug } from '../lib/posts';
import mediaData from '../data/media.json';
import type { EditorialMedia } from '../lib/media';
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
    : registry.find((m) => m.src === p.image);
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
  for (const match of p.content.matchAll(/<GuidePhoto\s+id="([^"]+)"/g))
    if (!byId.has(match[1])) errors.push(`Unknown body image ${p.slug}: ${match[1]}`);
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
if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exit(1);
}
console.log(
  `Media guard passed: ${registry.length} registered assets; all ${posts.length} guide heroes checked for reused paths, source identities and exact image hashes.`,
);
