export type SearchGuide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  reviewed?: boolean;
  content?: string;
};

type IndexedGuide = {
  guide: SearchGuide;
  title: Set<string>;
  excerpt: Set<string>;
  body: Set<string>;
};

const ignoredWords = new Set([
  'a',
  'an',
  'and',
  'are',
  'at',
  'can',
  'could',
  'do',
  'does',
  'for',
  'from',
  'get',
  'have',
  'how',
  'i',
  'in',
  'is',
  'it',
  'me',
  'my',
  'of',
  'on',
  'or',
  'please',
  'should',
  'the',
  'to',
  'what',
  'when',
  'where',
  'which',
  'with',
  'would',
  'you',
  'your',
]);

function words(value: string) {
  return (
    value
      .normalize('NFC')
      .toLowerCase()
      .match(/[\p{L}\p{N}]+/gu) ?? []
  );
}

export function guideQueryTerms(query: string) {
  return [...new Set(words(query).filter((word) => !ignoredWords.has(word)))];
}

export function indexGuides(guides: SearchGuide[]): IndexedGuide[] {
  return guides.map((guide) => ({
    guide,
    title: new Set(words(guide.title)),
    excerpt: new Set(words(guide.excerpt)),
    body: new Set(words(guide.content ?? '')),
  }));
}

function preferredGuide(query: string) {
  const phrase = words(query).join(' ');
  const airport = /\b(incheon|icn|airport)\b/.test(phrase);
  if (/\bterminals?\b/.test(phrase) && (airport || /\b(flight|airline)\b/.test(phrase))) {
    return 'incheon-terminal-flight-check';
  }
  if (airport && /\b(forgot|left behind|lost item|lost property)\b/.test(phrase)) {
    return 'incheon-airport-lost-item-which-office';
  }
  if (/\b(tax|vat)\b/.test(phrase) && /\brefunds?\b/.test(phrase)) {
    if (/\bolive young\b/.test(phrase))
      return 'olive-young-shopping-guide-must-buy-k-beauty-products';
    return 'tax-refund-for-tourists-how-to-claim';
  }
  if (
    /\b(bag|bags|baggage|luggage|suitcase)\b/.test(phrase) &&
    /\b(lost|missing|delayed|arrive|arrived)\b/.test(phrase) &&
    (airport || /\bchecked\b/.test(phrase))
  ) {
    return 'incheon-missing-checked-bag';
  }
  if (/\bkorea\b/.test(phrase) && /\b(first time|first trip|first visit)\b/.test(phrase)) {
    return 'first-trip-to-korea-planning-guide';
  }
  if (
    airport &&
    /\b(late|midnight|overnight)\b/.test(phrase) &&
    /\b(arrive|arrival|arriving|land|landing|hotel|train|seoul|bus)\b/.test(phrase)
  ) {
    return 'incheon-airport-late-night-arrival-guide';
  }
  if (
    airport &&
    /\b(immigration|customs|arrival|arrivals|arrive|arriving|landing)\b/.test(phrase) &&
    !/\b(hotel|train|bus|arex)\b/.test(phrase)
  ) {
    return 'incheon-airport-survival-guide-2026';
  }
  if (
    /^(airport|incheon|incheon airport|icn|arex)$/.test(phrase) ||
    (airport && /\b(seoul|hotel|train|bus|arex|taxi)\b/.test(phrase))
  ) {
    return 'airport-limousine-bus-vs-arex-express-train';
  }
}

function wordMatch(field: Set<string>, term: string) {
  if (field.has(term)) return true;
  // Retain partial-word lookup for longer inputs, without matching inside words.
  if (term.length >= 4) {
    for (const word of field) {
      if (word.startsWith(term)) return true;
    }
  }
  return false;
}

export function findGuideMatches(
  index: IndexedGuide[],
  query: string,
  terms = guideQueryTerms(query),
) {
  if (!terms.length) return [];
  const preferred = preferredGuide(query);
  return index
    .map((entry) => {
      const score = terms.reduce(
        (total, term) =>
          total +
          (wordMatch(entry.title, term)
            ? 8
            : wordMatch(entry.excerpt, term)
              ? 3
              : wordMatch(entry.body, term)
                ? 1
                : 0),
        0,
      );
      return {
        guide: entry.guide,
        preferred: entry.guide.reviewed && entry.guide.slug === preferred,
        score,
      };
    })
    .filter((entry) => entry.preferred || entry.score > 0)
    .sort(
      (a, b) =>
        Number(Boolean(b.preferred)) - Number(Boolean(a.preferred)) ||
        b.score + (b.guide.reviewed ? 5 : 0) - (a.score + (a.guide.reviewed ? 5 : 0)),
    )
    .slice(0, 8)
    .map((entry) => entry.guide);
}
