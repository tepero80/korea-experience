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

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { 
    label: 'Tools',
    hasDropdown: true,
    items: [
      {
        category: 'Discover Yourself',
        icon: '🎯',
        tools: [
          { href: '/tools/korean-name', label: 'Korean Name Generator', status: 'active' },
          { href: '/tools/korea-job-quiz', label: 'What Would Your Job Be in Korea?', status: 'active' },
          { href: '/tools/korean-city-quiz', label: 'Which Korean City Should You Live In?', status: 'active' },
          { href: '/tools/korean-food-quiz', label: 'What Korean Food Matches You?', status: 'active' },
          { href: '/tools/kdrama-character', label: 'Which K-Drama Character Are You?', status: 'active' },
        ]
      },
      {
        category: 'Love & Relationships',
        icon: '💕',
        tools: [
          { href: '/tools/love-compatibility', label: 'Korean Love Compatibility', status: 'active' },
          { href: '/tools/ideal-korean-partner', label: 'Your Ideal Korean Partner Type', status: 'active' },
        ]
      },
      {
        category: 'Fun & Entertainment',
        icon: '🎮',
        tools: [
          { href: '/tools/kpop-stage-name', label: 'K-Pop Stage Name Generator', status: 'active' },
          { href: '/tools/korean-typing-test', label: 'Korean Typing Speed Test', status: 'active' },
        ]
      },
      {
        category: 'Plan Your Korea Trip',
        icon: '✈️',
        tools: [
          { href: '/tools/korean-age', label: 'Korean Age Calculator', status: 'active' },
          { href: '/tools/trip-budget', label: 'Korea Trip Budget Calculator', status: 'active' },
          { href: '/tools/medical-cost-estimator', label: 'Medical Tourism Cost Estimator', status: 'active' },
        ]
      },
      {
        category: 'Life in Korea',
        icon: '🏢',
        tools: [
          { href: '/tools/business-name', label: 'Korean Business Name Generator', status: 'active' },
        ]
      }
    ]
  },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

// All Interactive Tools List (for /tools page)
export const ALL_TOOLS = [
  // Discover Yourself
  { id: 1, href: '/tools/korean-name', title: 'Korean Name Generator', category: 'Discover Yourself', difficulty: '⭐⭐', viral: 95, description: 'Get your perfect Korean name with meaning', icon: '🏷️', status: 'active' },
  { id: 2, href: '/tools/korea-job-quiz', title: 'What Would Your Job Be in Korea?', category: 'Discover Yourself', difficulty: '⭐⭐', viral: 90, description: 'Discover your ideal Korean career', icon: '💼', status: 'active' },
  { id: 3, href: '/tools/korean-city-quiz', title: 'Which Korean City Should You Live In?', category: 'Discover Yourself', difficulty: '⭐⭐', viral: 85, description: 'Find your perfect Korean city match', icon: '🏙️', status: 'active' },
  { id: 4, href: '/tools/korean-food-quiz', title: 'What Korean Food Matches You?', category: 'Discover Yourself', difficulty: '⭐⭐', viral: 82, description: 'Find your Korean food soulmate', icon: '🍜', status: 'active' },
  { id: 5, href: '/tools/kdrama-character', title: 'Which K-Drama Character Are You?', category: 'Discover Yourself', difficulty: '⭐⭐', viral: 90, description: 'Find your K-Drama character match', icon: '🎭', status: 'active' },
  
  // Love & Relationships
  { id: 6, href: '/tools/love-compatibility', title: 'Korean Love Compatibility', category: 'Love & Relationships', difficulty: '⭐⭐', viral: 92, description: 'Check your love compatibility', icon: '💕', status: 'active' },
  { id: 7, href: '/tools/ideal-korean-partner', title: 'Your Ideal Korean Partner Type', category: 'Love & Relationships', difficulty: '⭐⭐', viral: 87, description: 'Discover your ideal Korean partner', icon: '💑', status: 'active' },
  { id: 8, href: '/tools/couple-name', title: 'Korean Couple Name Combiner', category: 'Love & Relationships', difficulty: '⭐', viral: 80, description: 'Create cute couple nicknames', icon: '👫', status: 'coming' },
  { id: 9, href: '/tools/kdrama-romance-trope', title: 'Your K-Drama Romance Trope', category: 'Love & Relationships', difficulty: '⭐⭐', viral: 85, description: 'Find your romance story type', icon: '💖', status: 'coming' },
  
  // Fun & Entertainment
  { id: 10, href: '/tools/kpop-stage-name', title: 'K-Pop Stage Name Generator', category: 'Fun & Entertainment', difficulty: '⭐⭐', viral: 88, description: 'Create your K-Pop idol name', icon: '🎤', status: 'active' },
  { id: 11, href: '/tools/korean-typing-test', title: 'Korean Typing Speed Test', category: 'Fun & Entertainment', difficulty: '⭐⭐⭐', viral: 75, description: 'Test your Korean typing skills', icon: '⌨️', status: 'active' },
  { id: 12, href: '/tools/korean-zodiac-fortune', title: 'Korean Zodiac Fortune Today', category: 'Fun & Entertainment', difficulty: '⭐⭐', viral: 80, description: 'Check your daily fortune', icon: '🔮', status: 'coming' },
  { id: 13, href: '/tools/guess-korean-food', title: 'Guess the Korean Food Photo', category: 'Fun & Entertainment', difficulty: '⭐⭐⭐⭐', viral: 72, description: 'Test your Korean food knowledge', icon: '🎮', status: 'coming' },
  { id: 14, href: '/tools/emoji-name', title: 'Your Korean Emoji Name', category: 'Fun & Entertainment', difficulty: '⭐', viral: 85, description: 'Transform your name into emojis', icon: '✨', status: 'coming' },
  
  // Plan Your Korea Trip
  { id: 15, href: '/tools/korean-age', title: 'Korean Age Calculator', category: 'Plan Your Korea Trip', difficulty: '⭐', viral: 85, description: 'Find out your age in Korean years', icon: '🎂', status: 'active' },
  { id: 16, href: '/tools/trip-budget', title: 'Korea Trip Budget Calculator', category: 'Plan Your Korea Trip', difficulty: '⭐⭐⭐', viral: 80, description: 'Plan your perfect Korea trip budget', icon: '✈️', status: 'active' },
  { id: 17, href: '/tools/medical-cost-estimator', title: 'Medical Tourism Cost Estimator', category: 'Plan Your Korea Trip', difficulty: '⭐⭐⭐', viral: 70, description: 'Estimate medical procedure costs', icon: '🏥', status: 'active' },
  
  // Life in Korea
  { id: 18, href: '/tools/business-name', title: 'Korean Business Name Generator', category: 'Life in Korea', difficulty: '⭐⭐', viral: 65, description: 'Create the perfect business name', icon: '🏢', status: 'active' },
  { id: 19, href: '/tools/korean-beauty-quiz', title: 'Korean Beauty Routine Quiz', category: 'Life in Korea', difficulty: '⭐⭐', viral: 78, description: 'Get personalized K-Beauty routine', icon: '💄', status: 'coming' },
  { id: 20, href: '/tools/military-service', title: 'Korean Military Service Calculator', category: 'Life in Korea', difficulty: '⭐⭐', viral: 60, description: 'Calculate military service dates', icon: '🪖', status: 'coming' },
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

// Blog Categories
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
