import data from '@/data/media.json';
import type { MediaCredit } from './content-types';
export interface EditorialMedia {
  id: string;
  src: string;
  srcSet?: string;
  width: number;
  height: number;
  alt: string;
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
