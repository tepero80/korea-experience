export type Region = {
  id: string;
  name: string;
  nameKo: string;
  area: string;
  coverMediaId: string;
  intro: string;
  tip: string;
  highlights?: readonly string[];
  onward?: readonly { regionId: string; reason: string }[];
  keepVisible?: boolean;
};

export const REGIONS: readonly Region[] = [
  {
    id: 'seoul',
    name: 'Seoul',
    nameKo: '서울',
    area: 'Capital area',
    coverMediaId: 'bukchon',
    intro:
      'Choose a base first, then group your days by neighborhood. Central historic districts and the eastern café districts work better as separate outings.',
    tip: 'Leave room for the final walk: a station name alone does not describe the hotel entrance, stairs, or the correct exit.',
    highlights: [
      'seoul-neighborhood-chooser-for-first-time-visitors-where-to-stay-by-trip-style',
      'airport-limousine-bus-vs-arex-express-train',
      'seoul-3-day-itinerary-perfect-first-time-visitor-guide-2026',
      'seongsu-dong-dior-luxury-vs-market-eats-in-24-hours',
      'seoul-rainy-day-itinerary-built-around-museums-markets-and-covered-streets',
      'how-to-order-food-in-korean-restaurants-phrases-guide-2026',
    ],
    onward: [
      { regionId: 'chuncheon', reason: 'Plan a lake outing from Seoul and choose where to board the train.' },
      { regionId: 'gangneung', reason: 'Work out your arrival and give the coast and the heritage sights their own time.' },
      { regionId: 'sokcho', reason: 'Choose the right bus terminal for a market visit, the waterfront or Seoraksan.' },
    ],
  },
  {
    id: 'busan',
    name: 'Busan',
    nameKo: '부산',
    area: 'Southeast',
    coverMediaId: 'jagalchi',
    intro:
      'Busan’s waterfront and historic market districts are spread out. Choose your accommodation around your priorities and group the western markets separately from Haeundae.',
    tip: 'A car-free trip is practical when you allow travel time between districts and avoid crossing the city repeatedly.',
  },
  {
    id: 'suwon',
    name: 'Suwon',
    nameKo: '수원',
    area: 'Capital area',
    coverMediaId: 'suwon',
    keepVisible: true,
    intro:
      'Make a manageable day around a section of Hwaseong’s walls, the palace area, and a meal. The full fortress circuit is optional, not a requirement.',
    tip: 'Check separate palace, activity and seasonal opening notices. A fortress walk does not guarantee a ticketed building or evening program is open.',
  },
  {
    id: 'incheon',
    name: 'Incheon',
    nameKo: '인천',
    area: 'Capital area',
    coverMediaId: 'incheon-open-port-art-platform',
    intro:
      'Explore Chinatown and the Open Port from Incheon Station, or plan your airport arrival before connecting to another city.',
    tip: 'Incheon Station and Incheon International Airport are different starting points. Budget the journey between them before combining a city stop with a flight.',
    highlights: [
      'incheon-chinatown-open-port-walking-route',
      'songdo-central-park-visit-plan',
      'incheon-airport-to-songdo-hotels',
      'incheon-airport-survival-guide-2026',
      'incheon-airport-late-night-arrival-guide',
    ],
  },
  {
    id: 'gyeongju',
    name: 'Gyeongju',
    nameKo: '경주',
    area: 'Southeast',
    coverMediaId: 'gyeongju-wolji-night',
    intro:
      'Give the central Silla sites and the hillside temples their own time. Start with how you will reach the city and return from each outing.',
    tip: 'Gyeongju KTX Station, the historic center and the Bulguksa area are separate stops. Check how you will get back from the temples before leaving town.',
    highlights: [
      'gyeongju-the-museum-without-walls-2-day-historical-itinerary-2026',
      'gyeongju-ktx-to-hwangnidan',
      'gyeongju-bulguksa-seokguram-without-a-car',
      'gyeongju-donggung-wolji-woljeonggyo-evening-walk',
    ],
  },
  {
    id: 'jeju',
    name: 'Jeju',
    nameKo: '제주',
    area: 'Jeju Island',
    coverMediaId: 'jeju-hallasan-aerial-2024',
    intro:
      'Choose a base you can travel from without a rental car, then plan your airport transfer, a Seongsan bus day or a ferry outing.',
    tip: 'Plan around your exact stops and return times. Keep an alternative on Jeju itself for ferry days and avoid relying on the last connection.',
    highlights: [
      'where-to-stay-in-jeju-without-a-car',
      'jeju-airport-to-jeju-city-and-seogwipo',
      'seongsan-ilchulbong-by-bus-from-jeju-city',
      'jeju-muslim-friendly-dining-in-jeju-city',
      'jeju-winter-ferry-checklist-udo-gapa-marado',
    ],
  },
  {
    id: 'daegu',
    name: 'Daegu',
    nameKo: '대구',
    area: 'Southeast',
    coverMediaId: 'dongdaegu-metro-line-one',
    intro: 'Get from Dongdaegu railway station to the center, then plan a market meal or a short indoor history stop.',
    tip: 'Choose the actual stop for your next place. Dongdaegu, Daegu Station and the central market are different destinations.',
    highlights: [
      'dongdaegu-station-to-central-daegu',
      'daegu-modern-history-museum-downtown-visit',
      'seomun-market-daytime-food-visit',
    ],
  },
  {
    id: 'jeonju',
    name: 'Jeonju',
    nameKo: '전주',
    area: 'Jeolla',
    coverMediaId: 'jeonju-hanok-rooftops-overview',
    intro: 'Choose your station-to-village connection, then pair a heritage walk with one useful market meal.',
    tip: 'Protect the shrine’s last admission and leave a separate margin for your train. Omokdae is an optional uphill extension.',
    highlights: [
      'jeonju-station-to-hanok-village',
      'jeonju-gyeonggijeon-omokdae-walking-route',
      'jeonju-nambu-market-eating-plan',
    ],
  },
  {
    id: 'chuncheon',
    name: 'Chuncheon',
    nameKo: '춘천',
    area: 'Gangwon',
    coverMediaId: 'chuncheon-soyanggang-waterfront',
    intro: 'Pick the right train from Seoul, then choose an easy river outing or set aside time for the lake cable car.',
    tip: 'The Soyanggang Skywalk and the upper deck at Samaksan are separate outings. Check weather and last admission at the one you plan to visit.',
    highlights: [
      'seoul-to-chuncheon-train-choice',
      'chuncheon-station-to-soyanggang-skywalk',
      'chuncheon-samaksan-lake-cable-car-visit',
    ],
    onward: [{ regionId: 'seoul', reason: 'Choose where to stay in Seoul before planning your train to Chuncheon.' }],
  },
  {
    id: 'gangneung',
    name: 'Gangneung',
    nameKo: '강릉',
    area: 'Gangwon',
    coverMediaId: 'gangneung-gyeongpo-lake-overview',
    intro: 'Compare arrival stations, then choose a lake-and-beach outing, an Anmok waterfront visit or a heritage and market half-day.',
    tip: 'Railway and bus arrivals use different places in town. Give the waterfront its own time and keep an inland alternative for rough weather.',
    highlights: [
      'seoul-to-gangneung-ktx-vs-express-bus',
      'gangneung-gyeongpo-lake-and-beach-walk',
      'gangneung-ojukheon-and-jungang-market',
      'gangneung-station-anmok',
    ],
    onward: [{ regionId: 'sokcho', reason: 'Compare a separate Sokcho stay if the market, harbor or Seoraksan is your priority.' }],
  },
  {
    id: 'sokcho',
    name: 'Sokcho & Seoraksan',
    nameKo: '속초·설악산',
    area: 'Gangwon',
    coverMediaId: 'sokcho-abai-waterfront-overview',
    intro: 'Pin the terminal from your ticket, then choose between Sokcho’s market and village waterfront or a day at Seoraksan.',
    tip: 'The express and intercity terminals are separate. Recheck your return ticket and keep a city alternative when the mountain weather changes.',
    highlights: [
      'sokcho-intercity-vs-express-bus-terminal',
      'sokcho-market-gaetbae-abai-village-walk',
      'seoraksan-cable-car-flexible-sokcho-day',
    ],
    onward: [{ regionId: 'gangneung', reason: 'Explore Gangneung separately for a lakeside walk, beach or indoor heritage stop.' }],
  },
];

export function isInRegion(regions: readonly string[] | undefined, id: string) {
  return regions?.some((region) => region.trim().toLowerCase() === id) ?? false;
}
