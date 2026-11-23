export type Region = {
  id: string;
  name: string;
  nameKo: string;
  area: string;
  coverMediaId: string;
  intro: string;
  tip: string;
  arrivalGuide?: string;
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
    onward: [
      { regionId: 'ulsan', reason: 'Take the train from Bujeon to Taehwagang Station, then choose a riverside walk, the coast or an indoor museum.' },
      { regionId: 'gyeongju', reason: 'Give the Silla sites their own day and check how to get from the KTX station to the historic center.' },
      { regionId: 'daegu', reason: 'Continue inland for Seomun Market and a separate downtown history visit.' },
    ],
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
    onward: [{ regionId: 'seoul', reason: 'Return to a Seoul base and choose a neighborhood for the following day.' }],
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
    onward: [{ regionId: 'seoul', reason: 'Choose a Seoul base and plan the last leg to your accommodation.' }],
  },
  {
    id: 'gyeongju',
    name: 'Gyeongju',
    nameKo: '경주',
    area: 'Southeast',
    coverMediaId: 'gyeongju-tombs-2022',
    intro:
      'Give the central Silla sites and the hillside temples their own time. Start with how you will reach the city and return from each outing.',
    tip: 'Gyeongju KTX Station, the historic center and the Bulguksa area are separate stops. Check how you will get back from the temples before leaving town.',
    highlights: [
      'gyeongju-the-museum-without-walls-2-day-historical-itinerary-2026',
      'gyeongju-ktx-to-hwangnidan',
      'gyeongju-bulguksa-seokguram-without-a-car',
      'gyeongju-donggung-wolji-woljeonggyo-evening-walk',
    ],
    onward: [
      { regionId: 'busan', reason: 'Build a separate waterfront day around one part of Busan.' },
      { regionId: 'andong', reason: 'Continue a heritage trip with a riverside evening or a visit outside Andong.' },
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
    onward: [{ regionId: 'busan', reason: 'If your onward ticket is to Busan, plan the airport transfer before choosing a coastal neighborhood.' }],
  },
  {
    id: 'daegu',
    name: 'Daegu',
    nameKo: '대구',
    area: 'Southeast',
    coverMediaId: 'daegu-seomun-night-market-2017',
    intro: 'Get from Dongdaegu railway station to the center, then plan a market meal or a short indoor history stop.',
    tip: 'Choose the actual stop for your next place. Dongdaegu, Daegu Station and the central market are different destinations.',
    highlights: [
      'dongdaegu-station-to-central-daegu',
      'daegu-modern-history-museum-downtown-visit',
      'seomun-market-daytime-food-visit',
    ],
    onward: [{ regionId: 'gyeongju', reason: 'Give the Silla tombs and evening waterfront a separate stop.' }],
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
    onward: [{ regionId: 'gwangju', reason: 'For a separate city day in Jeolla, choose between Gwangju’s Culture Center and National Museum.' }],
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
  {
    id: 'andong',
    name: 'Andong',
    nameKo: '안동',
    area: 'Southeast',
    coverMediaId: 'andong-wolyeonggyo-river-daylight',
    intro: 'Choose the bus or railway arrival, then plan the river after dusk or give a heritage site outside town its own day.',
    tip: 'Hahoe Village and Dosan Seowon are in different directions. Check the destination and return of a particular bus before trying to combine either with a train.',
    highlights: [
      'andong-station-and-bus-terminal-to-downtown',
      'andong-hahoe-or-dosan-seowon-without-a-car',
      'andong-wolyeonggyo-evening-walk',
    ],
    onward: [{ regionId: 'gyeongju', reason: 'Plan a separate Silla heritage stop around Gyeongju’s station, temples and historic center.' }],
  },
  {
    id: 'daejeon',
    name: 'Daejeon',
    nameKo: '대전',
    area: 'Central Korea',
    coverMediaId: 'daejeon-hanbat-arboretum-east-garden-2021',
    intro: 'Use a short rail stop for the city market, or take a separate outing to Yuseong or a family museum.',
    tip: 'Start a short visit near the station. Yuseong and the science museum are separate destinations, so check the return trip before leaving downtown.',
    highlights: [
      'daejeon-station-to-jungang-market-short-visit',
      'daejeon-yuseong-footbath-or-museum-day',
      'daejeon-national-science-museum-family-visit',
    ],
    onward: [{ regionId: 'jeonju', reason: 'Continue to a hanok and market outing. Check your departure station and connection before booking.' }],
  },
  {
    id: 'gwangju',
    name: 'Gwangju',
    nameKo: '광주',
    area: 'Jeolla',
    coverMediaId: 'gwangju-national-museum-courtyard-2015',
    intro: 'Connect from the airport or Gwangju-Songjeong railway station, then choose a downtown culture visit or a separate museum outing.',
    tip: 'Gwangju-Songjeong and Gwangju Station are different rail stops. For the Asia Culture Center, use the entrance and hall on your booking.',
    highlights: [
      'gwangju-songjeong-station-to-asia-culture-center',
      'gwangju-airport-to-songjeong-station',
      'gwangju-national-museum-children-visit',
    ],
    onward: [
      { regionId: 'mokpo', reason: 'Choose a separate port or harbor day if your trip continues southwest.' },
      { regionId: 'suncheon', reason: 'Continue into southern Jeolla for a garden or wetland day. Check the intercity leg separately.' },
    ],
  },
  {
    id: 'mokpo',
    name: 'Mokpo',
    nameKo: '목포',
    area: 'Jeolla',
    coverMediaId: 'mokpo-modern-history-museum-hall-two',
    intro: 'Confirm the ferry terminal first, then decide whether there is time for a harbor museum or the marine cable car.',
    tip: 'The port, cable car boarding stations and history museum are different stops. Check your sailing and return time before leaving the terminal area.',
    highlights: [
      'mokpo-station-to-correct-ferry-terminal',
      'mokpo-marine-cable-car-boarding-without-a-car',
      'mokpo-modern-history-museum-harbor-weather-plan',
    ],
    onward: [{ regionId: 'gwangju', reason: 'Plan an indoor city outing separately around the Asia Culture Center and your Gwangju-Songjeong arrival.' }],
  },
  {
    id: 'suncheon',
    name: 'Suncheon',
    nameKo: '순천',
    area: 'Jeolla',
    coverMediaId: 'suncheon-wetland-winter-waterbird-hub',
    intro: 'Choose a garden loop, walk the coastal reed beds or spend a separate half-day inside the walls of Naganeupseong.',
    tip: 'The National Garden and the wetland use different entrances. Arrange the return from the wetland or Naganeupseong before leaving the city.',
    arrivalGuide: 'suncheon-station-to-national-garden-east-gate',
    highlights: [
      'suncheon-national-garden-first-visit',
      'suncheon-bay-wetland-reed-fields',
      'naganeupseong-walled-town-from-suncheon',
    ],
    onward: [
      { regionId: 'yeosu', reason: 'Continue to the Expo waterfront for a causeway walk, a cable-car ride, or a separate Dolsan outing.' },
      { regionId: 'gwangju', reason: 'Plan a separate city stay with an indoor culture visit and a different rail arrival.' },
    ],
  },
  {
    id: 'yeosu',
    name: 'Yeosu',
    nameKo: '여수',
    area: 'Jeolla',
    coverMediaId: 'yeosu-dolsan-bridge-hub',
    intro: 'Walk across the water to Odongdo, choose the cable-car boarding shore, or give the climb to Hyangiram a separate outing.',
    tip: 'Start near the Expo waterfront if you arrive by train. Confirm the ride back before heading farther south on Dolsan.',
    arrivalGuide: 'yeosu-expo-station-to-odongdo',
    highlights: [
      'yeosu-expo-station-to-odongdo',
      'yeosu-maritime-cable-car-boarding-guide',
      'yeosu-hyangiram-hermitage-without-a-car',
    ],
    onward: [{ regionId: 'suncheon', reason: 'Give the wetland boardwalk or National Garden a separate day. Check the intercity departure from Yeosu Expo Station.' }],
  },
  {
    id: 'ulsan',
    name: 'Ulsan',
    nameKo: '울산',
    area: 'Southeast',
    coverMediaId: 'ulsan-daewangam-rocky-coast',
    intro: 'Explore bamboo by the Taehwa River, walk the pine-covered Daewangam headland, or spend time on the former whaling port’s history indoors.',
    tip: 'KTX Ulsan Station and Taehwagang Station serve different trips. Pick your actual arrival station before looking up the last leg.',
    arrivalGuide: 'busan-bujeon-to-ulsan-taehwagang-trains',
    highlights: [
      'ulsan-taehwagang-national-garden-bamboo-walk',
      'ulsan-daewangam-park-coastal-walk',
      'ulsan-jangsaengpo-whale-museum',
    ],
    onward: [
      { regionId: 'busan', reason: 'Check trains to Bujeon if you want to continue to Busan’s markets or choose a base for the coast.' },
      { regionId: 'gyeongju', reason: 'Make time for the Silla sites on a separate day and confirm the transfer from your arrival station.' },
    ],
  },
];

export function isInRegion(regions: readonly string[] | undefined, id: string) {
  return regions?.some((region) => region.trim().toLowerCase() === id) ?? false;
}
