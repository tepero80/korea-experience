import data from '@/data/media.json';
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
export function mediaFor(id?: string) {
  return id ? registry.get(id) : undefined;
}

export function guideHeroPhotograph(id?: string, src?: string) {
  const photo = mediaFor(id);
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
  return src ? (data as EditorialMedia[]).find((m) => m.src === src) : undefined;
}
