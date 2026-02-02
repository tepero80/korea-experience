// Business categories and their Korean naming elements
export const BUSINESS_CATEGORIES = {
  cafe: {
    name: '☕ Cafe & Coffee Shop',
    prefixes: ['카페', '커피', '다방', '티', '차'],
    suffixes: ['하우스', '룸', '테라스', '라운지', '숍'],
    keywords: ['bean', 'brew', 'roast', 'aroma', 'bean', 'ground'],
    styles: ['모던', '빈티지', '미니멀', '코지', '힙스터']
  },
  restaurant: {
    name: '🍽️ Restaurant & Dining',
    prefixes: ['레스토랑', '식당', '밥집', '한식', '양식'],
    suffixes: ['하우스', '키친', '테이블', '다이닝', '플레이스'],
    keywords: ['taste', 'flavor', 'feast', 'table', 'kitchen', 'cuisine'],
    styles: ['파인', '캐주얼', '패밀리', '프리미엄', '트렌디']
  },
  beauty: {
    name: '💄 Beauty & Salon',
    prefixes: ['뷰티', '미용', '헤어', '네일', '스킨'],
    suffixes: ['샵', '살롱', '스튜디오', '클리닉', '하우스'],
    keywords: ['glow', 'beauty', 'charm', 'style', 'elegance', 'grace'],
    styles: ['럭셔리', '모던', '엘레강스', '스타일리시', '시크']
  },
  fashion: {
    name: '👗 Fashion & Clothing',
    prefixes: ['패션', '옷', '의류', '스타일', '브랜드'],
    suffixes: ['샵', '부티크', '스토어', '하우스', '컬렉션'],
    keywords: ['style', 'trend', 'chic', 'fashion', 'vogue', 'mode'],
    styles: ['하이엔드', '스트릿', '캐주얼', '빈티지', '미니멀']
  },
  fitness: {
    name: '💪 Fitness & Wellness',
    prefixes: ['헬스', '피트니스', '요가', '필라테스', '짐'],
    suffixes: ['센터', '스튜디오', '짐', '클럽', '하우스'],
    keywords: ['fit', 'strong', 'wellness', 'body', 'power', 'energy'],
    styles: ['프리미엄', '파워풀', '웰니스', '모던', '액티브']
  },
  tech: {
    name: '💻 Tech & IT',
    prefixes: ['테크', '디지털', '스마트', '이노', '넥스트'],
    suffixes: ['랩', '스튜디오', '허브', '베이스', '솔루션'],
    keywords: ['tech', 'digital', 'smart', 'next', 'future', 'innovation'],
    styles: ['이노베이티브', '스마트', '디지털', '퓨처', '넥스트']
  },
  bakery: {
    name: '🥐 Bakery & Dessert',
    prefixes: ['베이커리', '제과', '디저트', '빵', '케이크'],
    suffixes: ['하우스', '팩토리', '공방', '공장', '숍'],
    keywords: ['sweet', 'fresh', 'artisan', 'bake', 'oven', 'flour'],
    styles: ['아티장', '홈메이드', '프리미엄', '유럽풍', '빈티지']
  },
  pet: {
    name: '🐾 Pet Shop & Services',
    prefixes: ['펫', '반려', '애견', '동물', '퍼피'],
    suffixes: ['샵', '클리닉', '호텔', '카페', '하우스'],
    keywords: ['pet', 'paw', 'furry', 'happy', 'love', 'care'],
    styles: ['러블리', '케어풀', '해피', '프렌들리', '코지']
  },
  education: {
    name: '📚 Education & Academy',
    prefixes: ['교육', '학원', '아카데미', '스쿨', '랩'],
    suffixes: ['센터', '아카데미', '스쿨', '랩', '클래스'],
    keywords: ['learn', 'smart', 'bright', 'wisdom', 'grow', 'future'],
    styles: ['스마트', '프리미엄', '엘리트', '브라이트', '퓨처']
  },
  medical: {
    name: '🏥 Medical & Clinic',
    prefixes: ['메디', '힐링', '케어', '헬스', '웰'],
    suffixes: ['클리닉', '센터', '의원', '병원', '케어'],
    keywords: ['care', 'health', 'heal', 'life', 'wellness', 'med'],
    styles: ['프리미엄', '케어풀', '트러스트', '헬시', '웰']
  }
};

// Korean words for business naming
export const KOREAN_BUSINESS_WORDS = {
  positive: ['빛', '별', '하늘', '달', '해', '꿈', '행복', '사랑', '기쁨', '희망'],
  modern: ['모던', '스마트', '넥스트', '퓨처', '뉴', '프레시', '트렌디', '힙'],
  quality: ['프리미엄', '럭셔리', '프라임', '퍼스트', '베스트', '탑', '엘리트'],
  nature: ['숲', '나무', '꽃', '바람', '물', '산', '강', '바다', '하늘'],
  emotion: ['마음', '정', '한', '얼', '멋', '운', '흥', '신']
};

// English word components for business names
export const ENGLISH_BUSINESS_WORDS = {
  prefixes: ['The', 'My', 'Your', 'Our', 'Pure', 'True', 'Real', 'Best', 'Top', 'Prime'],
  core: ['House', 'Studio', 'Lab', 'Hub', 'Base', 'Space', 'Place', 'Room', 'Zone', 'Club'],
  adjectives: ['Happy', 'Bright', 'Fresh', 'Pure', 'Sweet', 'Cozy', 'Warm', 'Cool', 'Smart', 'Wise'],
  nouns: ['Dream', 'Star', 'Moon', 'Sun', 'Sky', 'Cloud', 'Forest', 'Garden', 'Tree', 'Flower']
};

// Generate business name
export interface BusinessNameResult {
  korean: string;
  english: string;
  romanized: string;
  meaning: string;
  description: string;
  brandStory: string;
  tagline: string;
  targetCustomer: string;
  vibe: string[];
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateBusinessName(
  category: keyof typeof BUSINESS_CATEGORIES,
  style: 'modern' | 'traditional' | 'luxury' | 'casual' | 'trendy',
  keyword?: string
): BusinessNameResult {
  const categoryData = BUSINESS_CATEGORIES[category];
  
  // Korean name generation
  let koreanName = '';
  let meaning = '';
  let englishName = '';
  
  if (style === 'modern' || style === 'trendy') {
    // Modern style: English + Korean suffix
    const englishWord = keyword || getRandomElement(categoryData.keywords);
    const koreanSuffix = getRandomElement(categoryData.suffixes);
    koreanName = `${englishWord.charAt(0).toUpperCase() + englishWord.slice(1)} ${koreanSuffix}`;
    englishName = `${englishWord.charAt(0).toUpperCase() + englishWord.slice(1)} ${getRandomElement(ENGLISH_BUSINESS_WORDS.core)}`;
    meaning = `Modern ${categoryData.name.split(' ')[1]} focused on ${englishWord}`;
  } else if (style === 'traditional') {
    // Traditional: Korean prefix + Korean suffix
    const koreanPrefix = getRandomElement(categoryData.prefixes);
    const koreanSuffix = getRandomElement(categoryData.suffixes);
    const koreanWord = getRandomElement(KOREAN_BUSINESS_WORDS.nature);
    koreanName = `${koreanWord} ${koreanPrefix}${koreanSuffix}`;
    englishName = `${getRandomElement(ENGLISH_BUSINESS_WORDS.nouns)} ${getRandomElement(ENGLISH_BUSINESS_WORDS.core)}`;
    meaning = `Traditional Korean style with natural elements`;
  } else if (style === 'luxury') {
    // Luxury: Premium words
    const premiumWord = getRandomElement(KOREAN_BUSINESS_WORDS.quality);
    const koreanSuffix = getRandomElement(categoryData.suffixes);
    koreanName = `${premiumWord} ${koreanSuffix}`;
    englishName = `${getRandomElement(['Premier', 'Elite', 'Prestige', 'Royal'])} ${getRandomElement(ENGLISH_BUSINESS_WORDS.core)}`;
    meaning = `Premium luxury experience`;
  } else if (style === 'casual') {
    // Casual: Friendly words
    const friendlyWord = getRandomElement(KOREAN_BUSINESS_WORDS.positive);
    const koreanPrefix = getRandomElement(categoryData.prefixes);
    koreanName = `${friendlyWord}${koreanPrefix}`;
    englishName = `${getRandomElement(ENGLISH_BUSINESS_WORDS.adjectives)} ${getRandomElement(ENGLISH_BUSINESS_WORDS.nouns)}`;
    meaning = `Friendly and approachable atmosphere`;
  } else {
    // Default trendy
    const trendyStyle = getRandomElement(categoryData.styles);
    const koreanSuffix = getRandomElement(categoryData.suffixes);
    koreanName = `${trendyStyle} ${koreanSuffix}`;
    englishName = `${getRandomElement(ENGLISH_BUSINESS_WORDS.prefixes)} ${getRandomElement(ENGLISH_BUSINESS_WORDS.core)}`;
    meaning = `Trendy and contemporary`;
  }
  
  // Romanization (simplified)
  const romanized = koreanName;
  
  // Generate descriptions
  const descriptions = {
    cafe: 'A cozy space where coffee meets community, creating memorable moments',
    restaurant: 'Where culinary excellence meets authentic Korean hospitality',
    beauty: 'Transforming beauty through expert care and premium service',
    fashion: 'Where style meets individuality, curated for the modern trendsetter',
    fitness: 'Empowering your wellness journey with expert guidance',
    tech: 'Innovating tomorrow\'s solutions with cutting-edge technology',
    bakery: 'Handcrafted goodness baked fresh daily with love',
    pet: 'Where pets are family and care is our passion',
    education: 'Nurturing minds and shaping futures through quality education',
    medical: 'Dedicated to your health and wellness with compassionate care'
  };
  
  const brandStories = {
    cafe: 'Born from a passion for perfect coffee and warm conversations',
    restaurant: 'Bringing generations of culinary tradition to your table',
    beauty: 'Inspired by Korean beauty standards and global excellence',
    fashion: 'Curating styles that express your unique personality',
    fitness: 'Building a community of health and strength',
    tech: 'Driven by innovation and commitment to excellence',
    bakery: 'Every creation tells a story of artisan craftsmanship',
    pet: 'Founded by pet lovers for pet lovers',
    education: 'Committed to excellence in learning and growth',
    medical: 'Your trusted partner in health and wellness'
  };
  
  const taglines = {
    cafe: '☕ Your Daily Escape',
    restaurant: '🍽️ Taste the Tradition',
    beauty: '✨ Reveal Your Glow',
    fashion: '👗 Style Your Story',
    fitness: '💪 Transform Today',
    tech: '💻 Innovate Tomorrow',
    bakery: '🥐 Baked with Love',
    pet: '🐾 Happy Pets, Happy Life',
    education: '📚 Learn. Grow. Succeed.',
    medical: '🏥 Care You Can Trust'
  };
  
  const targetCustomers = {
    cafe: '20-40s urban professionals and coffee enthusiasts',
    restaurant: 'Families and food lovers seeking authentic experiences',
    beauty: '20-50s individuals who value self-care and quality',
    fashion: '20-40s fashion-forward individuals',
    fitness: 'Health-conscious individuals of all fitness levels',
    tech: 'Businesses and individuals seeking digital solutions',
    bakery: 'Dessert lovers and special occasion celebrators',
    pet: 'Loving pet owners who prioritize pet happiness',
    education: 'Students and lifelong learners seeking quality education',
    medical: 'Individuals and families prioritizing health'
  };
  
  const vibes = {
    modern: ['Contemporary', 'Clean', 'Minimalist', 'Urban'],
    traditional: ['Classic', 'Timeless', 'Heritage', 'Authentic'],
    luxury: ['Premium', 'Exclusive', 'Sophisticated', 'Elite'],
    casual: ['Friendly', 'Approachable', 'Relaxed', 'Warm'],
    trendy: ['Hip', 'Cool', 'Instagram-worthy', 'Innovative']
  };
  
  return {
    korean: koreanName,
    english: englishName,
    romanized: romanized,
    meaning: meaning,
    description: descriptions[category],
    brandStory: brandStories[category],
    tagline: taglines[category],
    targetCustomer: targetCustomers[category],
    vibe: vibes[style]
  };
}

export function generateMultipleBusinessNames(
  category: keyof typeof BUSINESS_CATEGORIES,
  style: 'modern' | 'traditional' | 'luxury' | 'casual' | 'trendy',
  count: number = 6,
  keyword?: string
): BusinessNameResult[] {
  const names: BusinessNameResult[] = [];
  const usedNames = new Set<string>();
  
  let attempts = 0;
  const maxAttempts = count * 10;
  
  while (names.length < count && attempts < maxAttempts) {
    const name = generateBusinessName(category, style, keyword);
    
    if (!usedNames.has(name.korean)) {
      usedNames.add(name.korean);
      names.push(name);
    }
    
    attempts++;
  }
  
  return names;
}
