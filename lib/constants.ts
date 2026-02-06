// Site Configuration
export const SITE_CONFIG = {
  name: 'Korea Experience',
  title: 'Korea Experience - Medical Tourism, Travel & K-Culture Guide',
  description: 'Discover everything about Korea - from world-class medical tourism and K-beauty to authentic travel experiences, living guides, and cultural insights. Your trusted companion for exploring Korea.',
  url: 'https://koreaexperience.com',
  author: 'Korea Experience Team',
  email: 'contact@koreaexperience.com',
  social: {
    twitter: '@koreaexperience',
    facebook: 'koreaexperience',
    instagram: 'koreaexperience',
  },
  keywords: [
    'Korea medical tourism',
    'Korean plastic surgery',
    'Seoul travel guide',
    'K-beauty clinics',
    'Living in Korea',
    'K-culture',
    'Korea visa guide',
    'Gangnam clinics',
  ],
};

// All Interactive Tools List (for /tools page)
export const ALL_TOOLS = [
  // Discover Yourself
  { id: 1, href: '/tools/korean-name', title: 'Korean Name Generator', category: 'Discover Yourself', difficulty: '⭐⭐', viral: 95, description: 'Get your perfect Korean name with meaning', icon: '🏷️', status: 'active' },
  { id: 2, href: '/tools/korea-job-quiz', title: 'What Would Your Job Be in Korea?', category: 'Discover Yourself', difficulty: '⭐⭐', viral: 90, description: 'Discover your ideal Korean career', icon: '💼', status: 'active' },
  { id: 3, href: '/tools/korean-city-quiz', title: 'Which Korean City Should You Live In?', category: 'Discover Yourself', difficulty: '⭐⭐', viral: 85, description: 'Find your perfect Korean city match', icon: '🏙️', status: 'active' },
  { id: 4, href: '/tools/korean-food-quiz', title: 'What Korean Food Matches You?', category: 'Discover Yourself', difficulty: '⭐⭐', viral: 82, description: 'Find your Korean food soulmate', icon: '🍜', status: 'active' },
  { id: 5, href: '/tools/kdrama-character', title: 'Which K-Drama Character Are You?', category: 'Discover Yourself', difficulty: '⭐⭐', viral: 90, description: 'Find your K-Drama character match', icon: '🎭', status: 'active' },
  { id: 21, href: '/tools/korean-nickname', title: 'Korean Nickname Generator', category: 'Discover Yourself', difficulty: '⭐', viral: 88, description: 'Generate cute, cool, or unique Korean nicknames', icon: '✨', status: 'active' },
  
  // Love & Relationships
  { id: 6, href: '/tools/love-compatibility', title: 'Korean Love Compatibility', category: 'Love & Relationships', difficulty: '⭐⭐', viral: 92, description: 'Check your love compatibility', icon: '💕', status: 'active' },
  { id: 7, href: '/tools/ideal-korean-partner', title: 'Your Ideal Korean Partner Type', category: 'Love & Relationships', difficulty: '⭐⭐', viral: 87, description: 'Discover your ideal Korean partner', icon: '💑', status: 'active' },
  { id: 8, href: '/tools/couple-name', title: 'Korean Couple Name Combiner', category: 'Love & Relationships', difficulty: '⭐', viral: 80, description: 'Create cute couple nicknames', icon: '👫', status: 'active' },
  { id: 9, href: '/tools/kdrama-romance-trope', title: 'Your K-Drama Romance Trope', category: 'Love & Relationships', difficulty: '⭐⭐', viral: 85, description: 'Find your romance story type', icon: '💖', status: 'active' },
  
  // Fun & Entertainment
  { id: 10, href: '/tools/kpop-stage-name', title: 'K-Pop Stage Name Generator', category: 'Fun & Entertainment', difficulty: '⭐⭐', viral: 88, description: 'Create your K-Pop idol name', icon: '🎤', status: 'active' },
  { id: 11, href: '/tools/korean-typing-test', title: 'Korean Typing Speed Test', category: 'Fun & Entertainment', difficulty: '⭐⭐⭐', viral: 75, description: 'Test your Korean typing skills', icon: '⌨️', status: 'active' },
  { id: 12, href: '/tools/korean-zodiac-fortune', title: 'Korean Zodiac Fortune Today', category: 'Fun & Entertainment', difficulty: '⭐⭐', viral: 80, description: 'Check your daily fortune', icon: '🔮', status: 'active' },
  { id: 13, href: '/tools/guess-korean-food', title: 'Guess the Korean Food Photo', category: 'Fun & Entertainment', difficulty: '⭐⭐⭐⭐', viral: 72, description: 'Test your Korean food knowledge', icon: '🎮', status: 'active' },
  { id: 14, href: '/tools/emoji-name', title: 'Your Korean Emoji Name', category: 'Fun & Entertainment', difficulty: '⭐', viral: 85, description: 'Transform your name into emojis', icon: '✨', status: 'active' },
  
  // Plan Your Korea Trip
  { id: 15, href: '/tools/korean-age', title: 'Korean Age Calculator', category: 'Plan Your Korea Trip', difficulty: '⭐', viral: 85, description: 'Find out your age in Korean years', icon: '🎂', status: 'active' },
  { id: 16, href: '/tools/trip-budget', title: 'Korea Trip Budget Calculator', category: 'Plan Your Korea Trip', difficulty: '⭐⭐⭐', viral: 80, description: 'Plan your perfect Korea trip budget', icon: '✈️', status: 'active' },
  { id: 17, href: '/tools/medical-cost-estimator', title: 'Medical Tourism Cost Estimator', category: 'Plan Your Korea Trip', difficulty: '⭐⭐⭐', viral: 70, description: 'Estimate medical procedure costs', icon: '🏥', status: 'active' },
  { id: 22, href: '/tools/convenience-store-meals', title: 'Convenience Store Meal Builder', category: 'Plan Your Korea Trip', difficulty: '⭐⭐', viral: 95, description: 'Build perfect Korean convenience store combos', icon: '🏪', status: 'active' },
  
  // Life in Korea
  { id: 18, href: '/tools/business-name', title: 'Korean Business Name Generator', category: 'Life in Korea', difficulty: '⭐⭐', viral: 65, description: 'Create the perfect business name', icon: '🏢', status: 'active' },
  { id: 19, href: '/tools/korean-beauty-quiz', title: 'Korean Beauty Routine Quiz', category: 'Life in Korea', difficulty: '⭐⭐', viral: 78, description: 'Get personalized K-Beauty routine', icon: '💄', status: 'active' },
  { id: 20, href: '/tools/military-service', title: 'Korean Military Service Calculator', category: 'Life in Korea', difficulty: '⭐⭐', viral: 60, description: 'Calculate military service dates', icon: '🪖', status: 'active' },
];

// Category Icons Mapping
const CATEGORY_ICONS: Record<string, string> = {
  'Discover Yourself': '🎯',
  'Love & Relationships': '💕',
  'Fun & Entertainment': '🎮',
  'Plan Your Korea Trip': '✈️',
  'Life in Korea': '🏢',
};

// Auto-generate navigation tools from ALL_TOOLS
const generateNavTools = () => {
  const categories = Object.keys(CATEGORY_ICONS);
  
  return categories.map(category => ({
    category,
    icon: CATEGORY_ICONS[category],
    tools: ALL_TOOLS
      .filter(t => t.category === category && t.status === 'active')
      .sort((a, b) => b.viral - a.viral) // Sort by viral score
      .slice(0, 5) // Max 5 tools per category in header
      .map(t => ({
        href: t.href,
        label: t.title,
        status: t.status
      }))
  }));
};

// Blog Categories (legacy - for general reference)
export const BLOG_CATEGORIES = [
  'Medical Tourism',
  'Plastic Surgery',
  'Dermatology',
  'Travel Guide',
  'K-Culture',
  'Living in Korea',
  'Food & Dining',
  'Shopping & K-Beauty',
  'Visa & Immigration',
  'Skincare',
];

// Blog Category Hub Pages — static routes for SEO
export const CATEGORY_HUBS = [
  {
    slug: 'medical-tourism',
    name: 'Medical Tourism',
    icon: '🏥',
    color: 'rose',
    gradient: 'from-rose-500 to-red-600',
    description: 'World-class medical procedures at competitive prices. From plastic surgery and dermatology to dental care and health checkups — your complete guide to medical tourism in Korea.',
    metaTitle: 'Medical Tourism in Korea — Complete Guide 2026',
    metaDescription: 'Explore Korea\'s top medical tourism options: plastic surgery, dermatology, dental care, health screenings, and more. Expert guides with costs, clinics, and tips.',
  },
  {
    slug: 'travel-tourism',
    name: 'Travel & Tourism',
    icon: '✈️',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    description: 'From Seoul\'s neon-lit streets to Jeju\'s volcanic landscapes — discover the best of Korea with insider travel tips, itineraries, and seasonal guides.',
    metaTitle: 'Korea Travel Guide — Best Destinations & Tips 2026',
    metaDescription: 'Plan your perfect Korea trip with expert travel guides. Seoul itineraries, day trips, seasonal festivals, transportation tips, and hidden gems.',
  },
  {
    slug: 'k-culture',
    name: 'K-Culture',
    icon: '🎭',
    color: 'purple',
    gradient: 'from-purple-500 to-fuchsia-600',
    description: 'K-Pop, K-Drama, traditional arts, and modern culture — dive deep into the cultural phenomena that have captivated the world.',
    metaTitle: 'K-Culture Guide — K-Pop, K-Drama & Korean Culture 2026',
    metaDescription: 'Your guide to Korean culture: K-Pop concerts, K-Drama filming locations, traditional customs, festivals, and the cultural trends shaping Korea.',
  },
  {
    slug: 'living-in-korea',
    name: 'Living in Korea',
    icon: '🏠',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Everything expats and long-term visitors need to know — from visa requirements and housing to banking, healthcare, and daily life tips.',
    metaTitle: 'Living in Korea — Expat Guide 2026',
    metaDescription: 'The essential expat guide to living in Korea. Visa info, housing, banking, healthcare, schools, and practical tips for daily life.',
  },
  {
    slug: 'food-dining',
    name: 'Food & Dining',
    icon: '🍜',
    color: 'orange',
    gradient: 'from-orange-500 to-amber-600',
    description: 'Korean BBQ, street food, Michelin restaurants, and regional specialties — your ultimate guide to eating well in Korea.',
    metaTitle: 'Korean Food Guide — Best Restaurants & Street Food 2026',
    metaDescription: 'Discover Korea\'s incredible food scene: Korean BBQ, street food markets, Michelin restaurants, regional cuisine, and dining etiquette.',
  },
  {
    slug: 'shopping-kbeauty',
    name: 'Shopping & K-Beauty',
    icon: '💄',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600',
    description: 'From Olive Young hauls to Myeongdong shopping tips — discover the best K-Beauty products, fashion trends, and shopping destinations in Korea.',
    metaTitle: 'K-Beauty & Shopping Guide — Best Products & Stores 2026',
    metaDescription: 'Your guide to shopping in Korea: K-Beauty must-buys, Olive Young essentials, Myeongdong tips, fashion districts, and duty-free shopping.',
  },
] as const;

// Map from hub slug to actual frontmatter category name
export const CATEGORY_SLUG_TO_NAME: Record<string, string> = {
  'medical-tourism': 'Medical Tourism',
  'travel-tourism': 'Travel & Tourism',
  'k-culture': 'K-Culture',
  'living-in-korea': 'Living in Korea',
  'food-dining': 'Food & Dining',
  'shopping-kbeauty': 'Shopping & K-Beauty',
};

// Reverse: frontmatter category name → hub slug
export const CATEGORY_NAME_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_SLUG_TO_NAME).map(([slug, name]) => [name, slug])
);

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { 
    label: 'Blog',
    href: '/blog',
    hasDropdown: true,
    dropdownType: 'blog' as const,
    blogCategories: CATEGORY_HUBS.map(cat => ({
      href: `/blog/category/${cat.slug}`,
      label: cat.name,
      icon: cat.icon,
    })),
  },
  { 
    label: 'Tools',
    hasDropdown: true,
    dropdownType: 'tools' as const,
    items: generateNavTools()
  },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

// Footer Links
export const FOOTER_LINKS = {
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/disclaimer', label: 'Medical Disclaimer' },
  ],
  resources: [
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ],
};
