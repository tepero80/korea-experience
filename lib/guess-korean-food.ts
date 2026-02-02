// Guess Korean Food Photo Game

export interface FoodItem {
  id: number;
  name: string;
  koreanName: string;
  emoji: string;
  description: string;
  imageDescription: string; // For text-based representation
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  funFact: string;
}

export interface GameResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  rank: string;
  rankEmoji: string;
  achievements: string[];
  foodsGuessed: string[];
  foodsMissed: string[];
}

export const KOREAN_FOODS: FoodItem[] = [
  // Easy Level
  {
    id: 1,
    name: 'Kimchi',
    koreanName: '김치',
    emoji: '🥬',
    description: 'Fermented spicy cabbage, Korea\'s most iconic side dish',
    imageDescription: 'Red, spicy-looking fermented cabbage with chili flakes',
    difficulty: 'easy',
    category: 'Side Dish',
    funFact: 'There are over 200 varieties of kimchi in Korea!',
  },
  {
    id: 2,
    name: 'Bibimbap',
    koreanName: '비빔밥',
    emoji: '🍚',
    description: 'Mixed rice bowl with vegetables, meat, and gochujang',
    imageDescription: 'Colorful bowl with rice, vegetables arranged in sections, topped with egg',
    difficulty: 'easy',
    category: 'Main Dish',
    funFact: 'Bibimbap means "mixed rice" - mix it all together before eating!',
  },
  {
    id: 3,
    name: 'Bulgogi',
    koreanName: '불고기',
    emoji: '🥩',
    description: 'Marinated grilled beef, sweet and savory',
    imageDescription: 'Thinly sliced, dark brown glazed beef with slight char',
    difficulty: 'easy',
    category: 'Main Dish',
    funFact: 'Bulgogi literally means "fire meat" in Korean!',
  },
  {
    id: 4,
    name: 'Tteokbokki',
    koreanName: '떡볶이',
    emoji: '🍢',
    description: 'Spicy stir-fried rice cakes in red sauce',
    imageDescription: 'Cylindrical white rice cakes in bright red spicy sauce',
    difficulty: 'easy',
    category: 'Street Food',
    funFact: 'Tteokbokki is the most popular Korean street food!',
  },
  {
    id: 5,
    name: 'Korean Fried Chicken',
    koreanName: '치킨',
    emoji: '🍗',
    description: 'Double-fried crispy chicken with sweet & spicy glaze',
    imageDescription: 'Extra crispy chicken pieces with glossy red-orange coating',
    difficulty: 'easy',
    category: 'Main Dish',
    funFact: 'Koreans eat chicken with beer (chimaek = chicken + maekju)!',
  },
  
  // Medium Level
  {
    id: 6,
    name: 'Japchae',
    koreanName: '잡채',
    emoji: '🍜',
    description: 'Stir-fried glass noodles with vegetables',
    imageDescription: 'Translucent sweet potato noodles with colorful vegetables',
    difficulty: 'medium',
    category: 'Side Dish',
    funFact: 'Japchae was originally made without noodles until the 1920s!',
  },
  {
    id: 7,
    name: 'Samgyeopsal',
    koreanName: '삼겹살',
    emoji: '🥓',
    description: 'Grilled pork belly, Korean BBQ favorite',
    imageDescription: 'Thick slices of pork belly with distinct fat layers being grilled',
    difficulty: 'medium',
    category: 'Main Dish',
    funFact: 'Koreans consume 2.3kg of pork belly per person annually!',
  },
  {
    id: 8,
    name: 'Sundubu-jjigae',
    koreanName: '순두부찌개',
    emoji: '🍲',
    description: 'Soft tofu stew, spicy and bubbling hot',
    imageDescription: 'Red spicy stew with soft white tofu chunks, served bubbling',
    difficulty: 'medium',
    category: 'Soup/Stew',
    funFact: 'This stew is served so hot it continues boiling at your table!',
  },
  {
    id: 9,
    name: 'Kimbap',
    koreanName: '김밥',
    emoji: '🍱',
    description: 'Seaweed rice rolls with various fillings',
    imageDescription: 'Sliced rolls showing colorful fillings in spiral pattern',
    difficulty: 'medium',
    category: 'Main Dish',
    funFact: 'Kimbap is Korea\'s favorite picnic and road trip food!',
  },
  {
    id: 10,
    name: 'Jajangmyeon',
    koreanName: '짜장면',
    emoji: '🍝',
    description: 'Black bean noodles, Korean-Chinese fusion',
    imageDescription: 'Thick noodles covered in black bean sauce with diced vegetables',
    difficulty: 'medium',
    category: 'Main Dish',
    funFact: 'Koreans eat jajangmyeon on "Black Day" (April 14) if they\'re single!',
  },
  
  // Hard Level
  {
    id: 11,
    name: 'Bossam',
    koreanName: '보쌈',
    emoji: '🥬',
    description: 'Boiled pork wraps with kimchi and ssam vegetables',
    imageDescription: 'Sliced white boiled pork with leafy vegetables and fermented shrimp',
    difficulty: 'hard',
    category: 'Main Dish',
    funFact: 'Bossam literally means "wrapped" or "packaged"!',
  },
  {
    id: 12,
    name: 'Dakgalbi',
    koreanName: '닭갈비',
    emoji: '🌶️',
    description: 'Spicy stir-fried chicken with vegetables',
    imageDescription: 'Red spicy chicken pieces with cabbage and sweet potato on hot plate',
    difficulty: 'hard',
    category: 'Main Dish',
    funFact: 'Dakgalbi originated in Chuncheon and is cooked on a large round pan!',
  },
  {
    id: 13,
    name: 'Gamjatang',
    koreanName: '감자탕',
    emoji: '🍖',
    description: 'Pork bone soup with potatoes',
    imageDescription: 'Hearty soup with large pork spine bones and whole potatoes',
    difficulty: 'hard',
    category: 'Soup/Stew',
    funFact: 'Despite the name "potato soup," the star is actually the pork spine!',
  },
  {
    id: 14,
    name: 'Haemul Pajeon',
    koreanName: '해물파전',
    emoji: '🦐',
    description: 'Seafood and green onion pancake',
    imageDescription: 'Crispy pancake with visible seafood pieces and long green onions',
    difficulty: 'hard',
    category: 'Appetizer',
    funFact: 'Pajeon tastes best when eaten during rainy days with makgeolli!',
  },
  {
    id: 15,
    name: 'Naengmyeon',
    koreanName: '냉면',
    emoji: '🥶',
    description: 'Cold buckwheat noodles in icy broth',
    imageDescription: 'Thin brown noodles in icy broth with ice cubes, sliced egg and cucumber',
    difficulty: 'hard',
    category: 'Main Dish',
    funFact: 'Naengmyeon is a summer favorite but also eaten after Korean BBQ!',
  },
  {
    id: 16,
    name: 'Gimbap',
    koreanName: '김밥',
    emoji: '🍙',
    description: 'Korean seaweed rice roll',
    imageDescription: 'Rice and vegetables rolled in seaweed, sliced into bite-sized pieces',
    difficulty: 'easy',
    category: 'Main Dish',
    funFact: 'Often called "Korean sushi" but it\'s actually quite different!',
  },
  {
    id: 17,
    name: 'Galbi',
    koreanName: '갈비',
    emoji: '🍖',
    description: 'Grilled marinated beef ribs',
    imageDescription: 'Grilled beef short ribs with bones, glazed and caramelized',
    difficulty: 'medium',
    category: 'Main Dish',
    funFact: 'Galbi is often served at special occasions and celebrations!',
  },
  {
    id: 18,
    name: 'Hotteok',
    koreanName: '호떡',
    emoji: '🥞',
    description: 'Sweet Korean pancake with cinnamon sugar filling',
    imageDescription: 'Flat, round golden-brown pancake with sweet filling oozing out',
    difficulty: 'medium',
    category: 'Dessert',
    funFact: 'Hotteok is the perfect winter street food to warm your hands!',
  },
  {
    id: 19,
    name: 'Mandu',
    koreanName: '만두',
    emoji: '🥟',
    description: 'Korean dumplings with meat and vegetable filling',
    imageDescription: 'Pleated dumplings, can be steamed, fried, or in soup',
    difficulty: 'medium',
    category: 'Appetizer',
    funFact: 'Mandu comes in many varieties: steamed, fried, or in soup!',
  },
  {
    id: 20,
    name: 'Samgye-tang',
    koreanName: '삼계탕',
    emoji: '🐔',
    description: 'Ginseng chicken soup with whole young chicken',
    imageDescription: 'Whole small chicken in milky white broth with ginseng root',
    difficulty: 'hard',
    category: 'Soup/Stew',
    funFact: 'Koreans eat this hot soup on the hottest summer days to "fight fire with fire"!',
  },
];

export function getRandomFoods(count: number, difficulty?: 'easy' | 'medium' | 'hard'): FoodItem[] {
  let foodPool = difficulty 
    ? KOREAN_FOODS.filter(food => food.difficulty === difficulty)
    : KOREAN_FOODS;
  
  const shuffled = [...foodPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateQuizQuestion(food: FoodItem, allFoods: FoodItem[]): {
  correctAnswer: FoodItem;
  options: FoodItem[];
} {
  // Get 3 random wrong answers from the same or similar difficulty
  const wrongAnswers = allFoods
    .filter(f => f.id !== food.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  // Combine and shuffle
  const options = [food, ...wrongAnswers].sort(() => Math.random() - 0.5);
  
  return {
    correctAnswer: food,
    options,
  };
}

export function calculateGameResult(
  correctAnswers: number,
  totalQuestions: number,
  foodsGuessed: string[],
  foodsMissed: string[]
): GameResult {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  let rank = '';
  let rankEmoji = '';
  
  if (percentage >= 90) {
    rank = 'Korean Food Master';
    rankEmoji = '👑';
  } else if (percentage >= 75) {
    rank = 'K-Food Expert';
    rankEmoji = '🌟';
  } else if (percentage >= 60) {
    rank = 'Food Enthusiast';
    rankEmoji = '🎯';
  } else if (percentage >= 40) {
    rank = 'Learning Foodie';
    rankEmoji = '📚';
  } else {
    rank = 'Food Explorer';
    rankEmoji = '🔍';
  }
  
  const achievements: string[] = [];
  
  if (correctAnswers === totalQuestions) {
    achievements.push('🏆 Perfect Score!');
  }
  if (correctAnswers >= totalQuestions * 0.8) {
    achievements.push('⭐ 80%+ Accuracy');
  }
  if (foodsGuessed.includes('Kimchi')) {
    achievements.push('🥬 Kimchi Connoisseur');
  }
  if (foodsGuessed.includes('Bibimbap')) {
    achievements.push('🍚 Bibimbap Pro');
  }
  if (foodsGuessed.length >= 5) {
    achievements.push('🎓 Food Scholar');
  }
  
  return {
    score: correctAnswers,
    totalQuestions,
    percentage,
    rank,
    rankEmoji,
    achievements,
    foodsGuessed,
    foodsMissed,
  };
}

export function getFoodsByCategory(category: string): FoodItem[] {
  return KOREAN_FOODS.filter(food => food.category === category);
}

export function getAllCategories(): string[] {
  const categories = KOREAN_FOODS.map(food => food.category);
  return Array.from(new Set(categories));
}
