export interface SavedGuide {
  id: string;
  slug: string;
  title: string;
  category: string;
  savedAt: string;
}
export const SAVED_KEY = 'ke-saved-guides-v1';
export function readSaved(): SavedGuide[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    return Array.isArray(data)
      ? data
          .filter(
            (v: SavedGuide) =>
              typeof v?.id === 'string' &&
              typeof v.slug === 'string' &&
              /^[a-z0-9-]+$/.test(v.slug) &&
              typeof v.title === 'string',
          )
          .slice(0, 300)
      : [];
  } catch {
    return [];
  }
}
export function writeSaved(items: SavedGuide[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('ke-saved-change'));
}
