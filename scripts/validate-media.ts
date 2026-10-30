import fs from 'node:fs';
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
const identities = (p: (typeof posts)[number]) => {
  const m = p.editorial?.heroMediaId
    ? byId.get(p.editorial.heroMediaId)
    : registry.find((m) => m.src === p.image);
  return new Set(
    [
      p.image,
      m?.originalHash,
      m?.originalId,
      m?.credit.sourceUrl,
      p.editorial?.imageCredit?.sourceUrl,
    ].filter(Boolean),
  );
};
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
  const own = identities(p);
  for (const other of posts)
    if (other.slug !== p.slug && [...identities(other)].some((id) => own.has(id)))
      errors.push(`Reused upgraded hero original ${p.slug} -> ${other.slug}`);
}
if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  process.exit(1);
}
console.log(
  `Media guard passed: ${registry.length} registered assets; upgraded heroes cannot reuse any guide's original. Legacy reuse remains in the audit until replaced.`,
);
