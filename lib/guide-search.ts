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
  'by',
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

function preferredGuide(phrase: string) {
  const otherAirport = /\b(?:jeju|cju|gimpo|gmp|gimhae|pus|gwangju|kwj|daegu|tae|cheongju|cjj|yangyang|yny|muan|mwx)\b/.test(phrase);
  const airport = /\b(?:incheon|icn)\b/.test(phrase) || (/\bairport\b/.test(phrase) && !otherAirport);
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

function focusedGuides(phrase: string) {
  if (
    /\bwolyeonggyo\b/.test(phrase) ||
    (/\b(?:woryeonggyo|moonlight bridge)\b/.test(phrase) && /\bandong\b/.test(phrase))
  ) {
    return [
      'andong-wolyeonggyo-evening-walk',
      'andong-station-and-bus-terminal-to-downtown',
    ];
  }
  if (/\bmokpo\b/.test(phrase) && /\bcable car\b/.test(phrase)) {
    return [
      'mokpo-marine-cable-car-boarding-without-a-car',
      'mokpo-modern-history-museum-harbor-weather-plan',
    ];
  }
  if (/\bsokcho\b/.test(phrase) && /\bbus terminals?\b/.test(phrase)) {
    return ['sokcho-intercity-vs-express-bus-terminal', 'sokcho-market-gaetbae-abai-village-walk'];
  }
  if (/\btongin\b/.test(phrase) && /\b(?:lunch|lunchbox|coins?|cafe)\b/.test(phrase)) {
    return ['gyeongbokgung-to-tongin-market-lunch'];
  }
  if (/\bchanggyeonggung\b/.test(phrase) && /\b(?:night|evening|after dark)\b/.test(phrase)) {
    return ['changgyeonggung-ordinary-evening-visit', 'palace-starlight-night-tours-2026'];
  }
  if (/\bmyeongdong\b/.test(phrase) && /\b(?:prayer|halal|iftar)\b/.test(phrase)) {
    return ['myeongdong-prayer-and-evening-meal-plan'];
  }
  if (/\bbusan\b/.test(phrase) && /\b(?:nampo|jagalchi|biff square)\b/.test(phrase) && /\b(?:halal|muslim)\b/.test(phrase)) {
    return ['busan-station-to-nampo-muslim-friendly-dining'];
  }
  if (/\binspire arena\b/.test(phrase) && /\b(?:shuttle|airport|return)\b/.test(phrase)) {
    return ['inspire-arena-event-shuttle-and-airport-return'];
  }
  if (/\bdaejeon station\b/.test(phrase) && /\b(?:metro|subway|line 1|line one)\b/.test(phrase)) {
    return ['daejeon-station-ktx-to-metro-line-one', 'daejeon-station-to-jungang-market-short-visit'];
  }
  if (/\bsongdo\b/.test(phrase) && /\b(?:incheon airport|incheon international airport|icn)\b/.test(phrase)) {
    return ['incheon-airport-to-songdo-hotels'];
  }
  if (
    /\b(?:jeju (?:international )?airport|cju)\b/.test(phrase) &&
    /\b(?:bus|buses|limousine|taxi|transfer|hotel|jungmun|seogwipo|jeju city)\b/.test(phrase)
  ) {
    return ['jeju-airport-to-jeju-city-and-seogwipo'];
  }
  if (
    /\b(?:seoul (?:to|from) busan|busan (?:to|from) seoul)\b/.test(phrase) &&
    !/\b(?:by car|car rental|drive|driving|flight|fly|plane|road trip)\b/.test(phrase)
  ) {
    const rail = 'ktx-vs-srt-high-speed-train-comparison-and-booking';
    const bus = 'intercity-bus-travel-booking-apps-and-routes';
    const itinerary = 'seoul-to-busan-weekend-planner-train-neighborhood-base-and-route-choices';
    if (/\b(?:bus|coach)\b/.test(phrase)) return [bus, itinerary];
    if (/\b(?:ktx|srt|rail|trains?)\b/.test(phrase)) return [rail, itinerary];
    if (/\b(?:weekend|itinerary|two days|2 days)\b/.test(phrase))
      return [itinerary, rail, bus];
    return [rail, bus, itinerary];
  }
  if (
    /\b(?:wheelchairs?|step free|barrier free|accessible|accessibility)\b/.test(phrase) &&
    /\b(?:palaces?|gyeongbokgung|changdeokgung)\b/.test(phrase) &&
    !/\b(?:deoksugung|changgyeonggung|gyeonghuigung)\b/.test(phrase)
  ) {
    return [
      'accessible-seoul-best-routes-for-wheelchair-and-limited-mobility-2026',
      'korean-palaces-guide-gyeongbokgung-to-changdeokgung-2026',
    ];
  }
  return [];
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
  const phrase = words(query).join(' ');
  // For known travel tasks, give a short reviewed list instead of unrelated city-name matches.
  const focused = focusedGuides(phrase).flatMap((slug) => {
    const match = index.find(({ guide }) => guide.reviewed && guide.slug === slug);
    return match ? [match.guide] : [];
  });
  if (focused.length) return focused;

  const preferred = preferredGuide(phrase);
  return index
    .map((entry) => {
      let score = 0;
      let matched = 0;
      let summaryMatch = false;
      for (const term of terms) {
        if (wordMatch(entry.title, term)) {
          score += 8;
          summaryMatch = true;
        } else if (wordMatch(entry.excerpt, term)) {
          score += 3;
          summaryMatch = true;
        } else if (wordMatch(entry.body, term)) {
          score += 1;
        } else {
          continue;
        }
        matched++;
      }
      // Favor a result that ties the full query to a visible topic, rather than
      // one matching a single word such as a city name in its title.
      if (terms.length > 1 && matched === terms.length && summaryMatch) score += 6;
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
