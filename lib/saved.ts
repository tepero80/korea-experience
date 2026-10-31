export interface SavedGuide {
  id: string;
  slug: string;
  title: string;
  category: string;
  savedAt: string;
  unavailable?: boolean;
}
export const SAVED_KEY = 'ke-saved-guides-v1';
/** Keep account-only saves visible even when their guide is no longer published. */
export function mergeAccountSaves(
  local: SavedGuide[],
  accountIds: unknown[],
  catalog: { id: string; slug: string; title: string; category: string }[],
  savedAt: string,
): SavedGuide[] {
  const result = [...local];
  for (const id of accountIds) {
    if (typeof id !== 'string' || !id || id.length > 180 || result.some((item) => item.id === id))
      continue;
    const guide = catalog.find((item) => item.id === id);
    const legacySlug = id.startsWith('guide:') ? id.slice(6) : '';
    result.push(
      guide
        ? { ...guide, savedAt }
        : {
            id,
            slug: /^[a-z0-9-]+$/.test(legacySlug) ? legacySlug : 'unavailable-saved-guide',
            title: 'Unavailable saved guide',
            category: 'Saved guide',
            savedAt,
            unavailable: true,
          },
    );
  }
  return result;
}
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
