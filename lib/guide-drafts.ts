const KEY = 'ke-guide-drafts-v1';
const TTL = 7 * 24 * 60 * 60 * 1000;
type Store = Pick<Storage, 'getItem' | 'setItem'>;
type Draft = { guideId: string; body: string; updatedAt: number };
function read(store: Store, now: number): Draft[] {
  const raw = store.getItem(KEY);
  if (!raw) return [];
  const data = JSON.parse(raw);
  if (data.version !== 1 || !Array.isArray(data.drafts)) throw Error('Unsupported draft storage.');
  return data.drafts
    .filter(
      (d: Draft) =>
        typeof d.guideId === 'string' &&
        typeof d.body === 'string' &&
        d.body.length <= 5000 &&
        Number.isFinite(d.updatedAt) &&
        d.updatedAt <= now + 60000 &&
        now - d.updatedAt < TTL,
    )
    .map((d: Draft) => ({ guideId: d.guideId, body: d.body, updatedAt: d.updatedAt }));
}
export function readGuideDraft(store: Store, guideId: string, now = Date.now()) {
  return read(store, now).find((d) => d.guideId === guideId)?.body || '';
}
export function writeGuideDraft(store: Store, guideId: string, body: string, now = Date.now()) {
  if (body.length > 5000) throw Error('Draft is too long.');
  const drafts = read(store, now).filter((d) => d.guideId !== guideId);
  if (body) drafts.push({ guideId, body, updatedAt: now });
  drafts.sort((a, b) => b.updatedAt - a.updatedAt);
  store.setItem(KEY, JSON.stringify({ version: 1, drafts: drafts.slice(0, 20) }));
}
