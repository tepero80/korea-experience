import editorialData from '@/data/editorial.json';
import placeData from '@/data/places.json';
import retirementData from '@/data/retirements.json';
import type { EditorialGuide, Place, Retirement } from './content-types';
export const EDITORIAL = editorialData as Record<string, EditorialGuide>;
export const PLACES = placeData as Place[];
export const RETIREMENTS = retirementData as Retirement[];
const placesById = new Map(PLACES.map((place) => [place.id, place]));
export function editorialFor(slug: string) {
  return EDITORIAL[slug];
}
export function placesFor(ids: string[]) {
  return Array.from(new Set(ids), (id) => placesById.get(id)).filter(
    (place) => place !== undefined,
  );
}
export function retirementFor(slug: string) {
  return RETIREMENTS.find((r) => r.slug === slug);
}
