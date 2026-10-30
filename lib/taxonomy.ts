export const TRAVEL_CATEGORIES = [
  {
    slug: 'plan-your-trip',
    name: 'Plan Your Trip',
    short: 'Plan',
    icon: '01',
    description: 'Choose your dates, set a realistic budget, and arrive prepared.',
    question: 'What should I arrange before I go?',
    color: 'amber',
  },
  {
    slug: 'airports-transport',
    name: 'Airports & Transport',
    short: 'Get around',
    icon: '02',
    description: 'Find your way from the airport to the right train, bus, and neighborhood.',
    question: 'How do I get there?',
    color: 'blue',
  },
  {
    slug: 'where-to-stay',
    name: 'Where to Stay',
    short: 'Stay',
    icon: '03',
    description: 'Pick a base that fits your route, companions, and daily rhythm.',
    question: 'Which neighborhood works for me?',
    color: 'emerald',
  },
  {
    slug: 'places-itineraries',
    name: 'Places & Itineraries',
    short: 'Explore',
    icon: '04',
    description: 'Build days that make sense on the map, with room for a change of plan.',
    question: 'What can I comfortably fit into a day?',
    color: 'blue',
  },
  {
    slug: 'food-dining',
    name: 'Food & Cafés',
    short: 'Eat',
    icon: '05',
    description: 'Understand menus, order with confidence, and plan delicious detours.',
    question: 'Where and how should I eat?',
    color: 'orange',
  },
  {
    slug: 'shopping-kbeauty',
    name: 'Shopping & K-Beauty',
    short: 'Shop',
    icon: '06',
    description: 'Shop with a purpose, understand the conditions, and get your purchases home.',
    question: 'What is worth buying and checking?',
    color: 'pink',
  },
  {
    slug: 'culture-events',
    name: 'Culture & Events',
    short: 'Experience',
    icon: '07',
    description: 'Find cultural experiences and understand the booking steps before you commit.',
    question: 'What should I reserve or experience?',
    color: 'purple',
  },
  {
    slug: 'travel-essentials',
    name: 'Travel Essentials',
    short: 'Be ready',
    icon: '08',
    description:
      'Practical help for connectivity, payments, everyday needs, and unexpected problems.',
    question: 'What if something does not go to plan?',
    color: 'emerald',
  },
] as const;
export type CategoryId = (typeof TRAVEL_CATEGORIES)[number]['slug'];
export type JourneyStage =
  'before-you-go' | 'arrival' | 'getting-around' | 'exploring' | 'departure';
export type RelationType = 'prepare' | 'next' | 'nearby' | 'interest' | 'alternative';
export type GuideFormat = 'decision' | 'place' | 'itinerary' | 'how-to' | 'seasonal';
export const LEGACY_CATEGORY_HUBS = [
  {
    slug: 'medical-tourism',
    name: 'Medical Tourism',
    description:
      'Earlier healthcare and medical-travel articles. Check current official information and seek qualified medical advice.',
  },
  {
    slug: 'travel-tourism',
    name: 'Travel & Tourism',
    description: 'Earlier travel guides, now organized around the decisions you need to make.',
  },
  {
    slug: 'k-culture',
    name: 'K-Culture',
    description:
      'Earlier Korean culture guides. Explore our new culture and events collection for reviewed travel information.',
  },
  {
    slug: 'living-in-korea',
    name: 'Living in Korea',
    description:
      'Earlier guides for longer stays. Travel essentials focus on short-term visitor needs.',
  },
] as const;
export function categoryById(id: string) {
  return TRAVEL_CATEGORIES.find((c) => c.slug === id);
}
export function inferCategory(category: string, title: string): CategoryId {
  const exact = TRAVEL_CATEGORIES.find((c) => c.slug === category || c.name === category);
  if (exact) return exact.slug;
  const t = title.toLowerCase();
  if (
    /airport|arex|ktx|srt|rail pass|transit|transport|t-money|climate card|luggage storage/.test(t)
  )
    return 'airports-transport';
  if (/where to stay|accommodation|hotel|hostel|guesthouse|hanok stay|neighborhoods.*stay/.test(t))
    return 'where-to-stay';
  if (
    /packing|best time|month.by.month|first.time|travel budget|trip budget|travel checklist/.test(t)
  )
    return 'plan-your-trip';
  if (category === 'Food & Dining') return 'food-dining';
  if (category === 'Shopping & K-Beauty') return 'shopping-kbeauty';
  if (category === 'K-Culture') return 'culture-events';
  if (category === 'Travel & Tourism') return 'places-itineraries';
  return 'travel-essentials';
}
