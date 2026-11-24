import data from '@/data/media.json';
import generatedArchive from '@/data/generated-archive-covers.json';
import type { MediaCredit } from './content-types';
export interface EditorialMedia {
  id: string;
  src: string;
  srcSet?: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  focal?: string;
  originalId?: string;
  originalHash?: string;
  capturedAt?: string;
  credit: MediaCredit;
}
const registry = new Map((data as EditorialMedia[]).map((m) => [m.id, m]));
const registryBySource = new Map<string, EditorialMedia>();
for (const media of registry.values()) {
  if (!registryBySource.has(media.src)) registryBySource.set(media.src, media);
}
const generatedArchiveCovers = new Map(Object.entries(generatedArchive.covers));

export function generatedArchiveCoverHash(slug: string, src?: string) {
  return src === `/images/${slug}.webp` ? generatedArchiveCovers.get(slug) : undefined;
}
export function mediaFor(id?: string) {
  return id ? registry.get(id) : undefined;
}

export function guideHeroPhotograph(id?: string, src?: string) {
  const photo = mediaFor(id) ?? mediaForSource(src);
  if (
    !photo ||
    photo.src !== src ||
    photo.credit.kind !== 'photograph' ||
    !photo.credit.author ||
    !photo.credit.sourceUrl ||
    !photo.credit.licenseUrl
  ) return undefined;
  return photo;
}

export function mediaForSource(src?: string) {
  return src ? registryBySource.get(src) : undefined;
}
