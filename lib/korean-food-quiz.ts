// Types
export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    scores: { [key: string]: number };
  }[];
}

export interface FoodResult {
  id: string;
  name: string;
  nameKo: string;
  emoji: string;
  category: string;
  description: string;
  personality: string[];
  flavorProfile: string;
  bestPairedWith: string[];
  whenToEat: string;
  popularIn: string;
  healthBenefits: string[];
  funFact: string;
  perfectFor: string;
  similarFoods: string[];
}

// Food Types
export const foodTypes: { [key: string]: FoodResult } = {
  kimchi: {
    id: 'kimchi',
    name: 'Kimchi',
    nameKo: '김치',
    emoji: '🥬',
    category: 'Fermented Side Dish',
    description: 'You are bold, authentic, and full of character. Like kimchi, you add spice to life and get better with time. You\'re a staple in any friend group and people can\'t imagine life without you.',
    personality: ['Bold', 'Authentic', 'Complex', 'Traditional', 'Essential'],
    flavorProfile: 'Spicy, Tangy, Umami-rich',
    bestPairedWith: ['Rice', 'Stew', 'BBQ', 'Noodles'],
    whenToEat: 'Every meal - it\'s Korea\'s essential side dish!',
    popularIn: 'Everywhere in Korea',
    healthBenefits: ['Probiotics', 'Vitamin C', 'Aids digestion', 'Boosts immunity'],
    funFact: 'There are over 200 varieties of kimchi in Korea!',
    perfectFor: 'Someone who loves bold flavors and isn\'t afraid to stand out',
    similarFoods: ['Pickles', 'Sauerkraut', 'Kombucha']
  },
  bibimbap: {
    id: 'bibimbap',
    name: 'Bibimbap',
    nameKo: '비빔밥',
    emoji: '🍲',
    category: 'Mixed Rice Bowl',
    description: 'You are balanced, colorful, and bring people together. Like bibimbap, you have many layers to your personality that create perfect harmony when mixed. You\'re healthy, wholesome, and always bring good vibes.',
    personality: ['Balanced', 'Harmonious', 'Versatile', 'Healthy', 'Colorful'],
    flavorProfile: 'Sweet, Spicy, Savory, Balanced',
    bestPairedWith: ['Doenjang soup', 'Side dishes', 'Makgeolli'],
    whenToEat: 'Lunch - it\'s the perfect midday energy boost',
    popularIn: 'Jeonju (the birthplace of bibimbap)',
    healthBenefits: ['Balanced nutrition', 'High fiber', 'Rich in vegetables', 'Good protein'],
    funFact: 'The name literally means "mixed rice" - the fun is in the mixing!',
    perfectFor: 'Someone who appreciates balance and loves colorful, healthy meals',
    similarFoods: ['Buddha bowl', 'Poke bowl', 'Burrito bowl']
  },
  samgyeopsal: {
    id: 'samgyeopsal',
    name: 'Samgyeopsal',
    nameKo: '삼겹살',
    emoji: '🥓',
    category: 'Grilled Pork Belly',
    description: 'You are social, fun-loving, and the life of the party. Like samgyeopsal, you bring people together and create memorable experiences. You\'re indulgent, satisfying, and know how to enjoy life.',
    personality: ['Social', 'Fun', 'Generous', 'Indulgent', 'Popular'],
    flavorProfile: 'Rich, Savory, Smoky, Fatty',
    bestPairedWith: ['Soju', 'Lettuce wraps', 'Garlic', 'Ssamjang'],
    whenToEat: 'Dinner with friends - it\'s a social experience!',
    popularIn: 'Seoul, especially in Hongdae and Gangnam',
    healthBenefits: ['High protein', 'Vitamin B1', 'Energy boost', 'Good for grilling outdoors'],
    funFact: 'March 3rd (3/3) is officially Samgyeopsal Day in Korea!',
    perfectFor: 'Someone who loves social gatherings and isn\'t afraid of indulgence',
    similarFoods: ['Korean BBQ', 'Bacon', 'Pork belly bao']
  },
  tteokbokki: {
    id: 'tteokbokki',
    name: 'Tteokbokki',
    nameKo: '떡볶이',
    emoji: '🍢',
    category: 'Spicy Rice Cakes',
    description: 'You are youthful, energetic, and full of passion. Like tteokbokki, you\'re comforting yet exciting, with a perfect balance of sweet and spicy. You\'re the go-to friend for late-night adventures.',
    personality: ['Energetic', 'Passionate', 'Youthful', 'Comforting', 'Addictive'],
    flavorProfile: 'Sweet-Spicy, Chewy, Sauce-rich',
    bestPairedWith: ['Fried foods', 'Fish cakes', 'Boiled eggs', 'Cheese'],
    whenToEat: 'Street food snack or late-night craving',
    popularIn: 'Myeongdong, Sindang-dong (birthplace of tteokbokki)',
    healthBenefits: ['Energy boost', 'Stress relief', 'Mood enhancement', 'Carb satisfaction'],
    funFact: 'It was originally a royal court dish before becoming street food!',
    perfectFor: 'Someone who loves spicy, comforting snacks and late-night food runs',
    similarFoods: ['Spicy noodles', 'Mochi', 'Gnocchi in tomato sauce']
  },
  jjajangmyeon: {
    id: 'jjajangmyeon',
    name: 'Jjajangmyeon',
    nameKo: '짜장면',
    emoji: '🍝',
    category: 'Black Bean Noodles',
    description: 'You are comforting, nostalgic, and reliable. Like jjajangmyeon, you\'re the friend people turn to when they need comfort. You\'re simple yet satisfying, and you never go out of style.',
    personality: ['Comforting', 'Reliable', 'Nostalgic', 'Humble', 'Classic'],
    flavorProfile: 'Savory, Sweet, Rich, Umami',
    bestPairedWith: ['Tangsuyuk', 'Pickled radish', 'Dumplings'],
    whenToEat: 'Delivery night, rainy days, or when you need comfort',
    popularIn: 'Incheon (Korea\'s Chinatown)',
    healthBenefits: ['Filling', 'Energy-rich', 'Iron from black beans', 'Comfort food benefits'],
    funFact: 'April 14th is "Black Day" when singles eat jjajangmyeon together!',
    perfectFor: 'Someone who appreciates comfort food and nostalgic flavors',
    similarFoods: ['Spaghetti', 'Pad Thai', 'Dan dan noodles']
  },
  bulgogi: {
    id: 'bulgogi',
    name: 'Bulgogi',
    nameKo: '불고기',
    emoji: '🥩',
    category: 'Marinated Beef',
    description: 'You are sophisticated, refined, and universally loved. Like bulgogi, you have a perfect balance of sweetness and depth. You\'re approachable yet impressive, making you everyone\'s favorite.',
    personality: ['Sophisticated', 'Balanced', 'Popular', 'Elegant', 'Timeless'],
    flavorProfile: 'Sweet, Savory, Slightly smoky, Tender',
    bestPairedWith: ['Rice', 'Lettuce wraps', 'Soju', 'Japchae'],
    whenToEat: 'Special occasions, family dinners, or when introducing Korean food',
    popularIn: 'Everywhere - it\'s Korea\'s most famous export dish',
    healthBenefits: ['High protein', 'Iron', 'Vitamin B', 'Marination tenderizes meat'],
    funFact: 'The name means "fire meat" and it\'s been enjoyed since the Goguryeo era!',
    perfectFor: 'Someone who appreciates refined flavors and crowd-pleasers',
    similarFoods: ['Teriyaki', 'Yakiniku', 'Mongolian beef']
  },
  sundubu: {
    id: 'sundubu',
    name: 'Sundubu-jjigae',
    nameKo: '순두부찌개',
    emoji: '🍜',
    category: 'Soft Tofu Stew',
    description: 'You are warm, comforting, and nurturing. Like sundubu-jjigae, you have a fiery exterior but a soft, gentle heart. You\'re the friend who always knows how to warm people up on cold days.',
    personality: ['Nurturing', 'Warm', 'Gentle', 'Spicy', 'Healing'],
    flavorProfile: 'Spicy, Savory, Silky, Warming',
    bestPairedWith: ['Rice', 'Banchan', 'Raw egg', 'Kimchi'],
    whenToEat: 'Cold weather, hangover cure, or when needing comfort',
    popularIn: 'Korean homes and tofu villages',
    healthBenefits: ['High protein', 'Digestive aid', 'Warming properties', 'Low calorie'],
    funFact: 'The soft tofu is so silky it\'s often called "tofu brains"!',
    perfectFor: 'Someone who loves comforting, spicy soups and gentle warmth',
    similarFoods: ['Miso soup', 'Hot pot', 'Chili']
  },
  bingsu: {
    id: 'bingsu',
    name: 'Bingsu',
    nameKo: '빙수',
    emoji: '🍧',
    category: 'Shaved Ice Dessert',
    description: 'You are sweet, refreshing, and trendy. Like bingsu, you adapt to trends while staying true to your cool nature. You\'re the friend who always knows the latest cafes and brings joy to hot summer days.',
    personality: ['Sweet', 'Trendy', 'Refreshing', 'Creative', 'Delightful'],
    flavorProfile: 'Sweet, Cold, Creamy, Light',
    bestPairedWith: ['Coffee', 'Fresh fruit', 'Sweet toppings', 'Instagram'],
    whenToEat: 'Summer afternoons, dessert dates, cafe hopping',
    popularIn: 'Seoul cafes, especially Insadong and Gangnam',
    healthBenefits: ['Refreshing', 'Customizable toppings', 'Perfect for hot weather', 'Shareable'],
    funFact: 'Modern bingsu evolved from a simple shaved ice to elaborate dessert art!',
    perfectFor: 'Someone who loves sweet treats and aesthetic desserts',
    similarFoods: ['Shaved ice', 'Ice cream sundae', 'Halo-halo']
  },
  ramyeon: {
    id: 'ramyeon',
    name: 'Ramyeon',
    nameKo: '라면',
    emoji: '🍜',
    category: 'Instant Noodles',
    description: 'You are practical, versatile, and always there when needed. Like ramyeon, you\'re quick to warm up, easy to get along with, and can adapt to any situation. You\'re the reliable friend for late-night hangouts.',
    personality: ['Practical', 'Versatile', 'Quick', 'Comforting', 'Relatable'],
    flavorProfile: 'Spicy, Savory, Slurp-worthy, Addictive',
    bestPairedWith: ['Cheese', 'Eggs', 'Dumplings', 'Soju'],
    whenToEat: 'Late night, dorm life, camping, or whenever hunger strikes',
    popularIn: 'Everywhere - it\'s Korea\'s ultimate comfort food',
    healthBenefits: ['Quick energy', 'Customizable', 'Stress relief', 'Affordable'],
    funFact: 'Koreans consume 3.8 billion packs of ramyeon annually!',
    perfectFor: 'Someone who appreciates simple pleasures and late-night adventures',
    similarFoods: ['Instant ramen', 'Cup noodles', 'Pho']
  },
  kimbap: {
    id: 'kimbap',
    name: 'Kimbap',
    nameKo: '김밥',
    emoji: '🍱',
    category: 'Seaweed Rice Roll',
    description: 'You are organized, practical, and perfectly balanced. Like kimbap, you bring different elements together in perfect harmony. You\'re the friend who always has everything planned and makes life easier for everyone.',
    personality: ['Organized', 'Balanced', 'Practical', 'Wholesome', 'Prepared'],
    flavorProfile: 'Savory, Fresh, Balanced, Light',
    bestPairedWith: ['Pickled radish', 'Soup', 'Picnic blanket', 'Road trips'],
    whenToEat: 'Lunch boxes, picnics, road trips, or anytime on-the-go',
    popularIn: 'Street vendors, picnic spots, train stations',
    healthBenefits: ['Balanced nutrition', 'Portable', 'Vegetable-rich', 'Seaweed minerals'],
    funFact: 'It\'s Korea\'s favorite picnic food and road trip snack!',
    perfectFor: 'Someone who loves balanced, portable meals and outdoor activities',
    similarFoods: ['Sushi roll', 'Burrito', 'Spring roll']
  }
};

// Quiz Questions
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: '🌅 How do you start your perfect day?',
    options: [
      {
        text: 'A hearty, energizing breakfast to fuel the day',
        scores: { bibimbap: 3, bulgogi: 2, kimbap: 2 }
      },
      {
        text: 'Quick and spicy to wake me up',
        scores: { kimchi: 3, tteokbokki: 2, ramyeon: 2 }
      },
      {
        text: 'Something comforting and warm',
        scores: { sundubu: 3, jjajangmyeon: 2, ramyeon: 1 }
      },
      {
        text: 'Sweet and refreshing',
        scores: { bingsu: 3, kimbap: 1 }
      }
    ]
  },
  {
    id: 2,
    question: '👥 At a party, you are:',
    options: [
      {
        text: 'The center of attention, bringing everyone together',
        scores: { samgyeopsal: 3, tteokbokki: 2, ramyeon: 1 }
      },
      {
        text: 'The reliable friend everyone can count on',
        scores: { jjajangmyeon: 3, kimbap: 2, bulgogi: 1 }
      },
      {
        text: 'Adding spice and energy to the group',
        scores: { kimchi: 3, tteokbokki: 2, ramyeon: 1 }
      },
      {
        text: 'Creating harmony and making everyone feel included',
        scores: { bibimbap: 3, bulgogi: 2, sundubu: 1 }
      }
    ]
  },
  {
    id: 3,
    question: '🎨 What\'s your approach to life?',
    options: [
      {
        text: 'Bold and authentic - I stay true to myself',
        scores: { kimchi: 3, samgyeopsal: 2, tteokbokki: 1 }
      },
      {
        text: 'Balanced and harmonious - I seek peace',
        scores: { bibimbap: 3, bulgogi: 2, kimbap: 2 }
      },
      {
        text: 'Practical and adaptable - I go with the flow',
        scores: { ramyeon: 3, kimbap: 2, jjajangmyeon: 1 }
      },
      {
        text: 'Warm and nurturing - I care for others',
        scores: { sundubu: 3, jjajangmyeon: 2, bulgogi: 1 }
      }
    ]
  },
  {
    id: 4,
    question: '🌶️ How do you handle challenges?',
    options: [
      {
        text: 'Head-on with passion and fire!',
        scores: { kimchi: 3, tteokbokki: 3, samgyeopsal: 1 }
      },
      {
        text: 'With sophistication and strategy',
        scores: { bulgogi: 3, bibimbap: 2, kimbap: 1 }
      },
      {
        text: 'By providing comfort and support to myself and others',
        scores: { sundubu: 3, jjajangmyeon: 2 }
      },
      {
        text: 'Quick and practical solutions',
        scores: { ramyeon: 3, kimbap: 2 }
      }
    ]
  },
  {
    id: 5,
    question: '💝 In relationships, you are:',
    options: [
      {
        text: 'Essential and irreplaceable',
        scores: { kimchi: 3, bulgogi: 2, bibimbap: 1 }
      },
      {
        text: 'The social butterfly who brings people together',
        scores: { samgyeopsal: 3, tteokbokki: 2, ramyeon: 1 }
      },
      {
        text: 'Warm, nurturing, and comforting',
        scores: { sundubu: 3, jjajangmyeon: 2, bibimbap: 1 }
      },
      {
        text: 'Sweet and delightful',
        scores: { bingsu: 3, bulgogi: 2, kimbap: 1 }
      }
    ]
  },
  {
    id: 6,
    question: '🎭 Your personality is best described as:',
    options: [
      {
        text: 'Complex and layered, getting better with time',
        scores: { kimchi: 3, bulgogi: 2 }
      },
      {
        text: 'Colorful and multifaceted',
        scores: { bibimbap: 3, tteokbokki: 2, bingsu: 1 }
      },
      {
        text: 'Simple yet deeply satisfying',
        scores: { jjajangmyeon: 3, ramyeon: 2, kimbap: 1 }
      },
      {
        text: 'Indulgent and fun-loving',
        scores: { samgyeopsal: 3, bingsu: 2, tteokbokki: 1 }
      }
    ]
  },
  {
    id: 7,
    question: '☔ On a rainy day, you prefer:',
    options: [
      {
        text: 'Ordering delivery and staying cozy inside',
        scores: { jjajangmyeon: 3, ramyeon: 2, sundubu: 1 }
      },
      {
        text: 'Something warm and spicy to match the mood',
        scores: { sundubu: 3, kimchi: 2, tteokbokki: 1 }
      },
      {
        text: 'Grilling indoors with friends',
        scores: { samgyeopsal: 3, bulgogi: 2 }
      },
      {
        text: 'A balanced, wholesome meal',
        scores: { bibimbap: 3, kimbap: 2 }
      }
    ]
  },
  {
    id: 8,
    question: '🌟 What makes you special?',
    options: [
      {
        text: 'My bold personality and authentic nature',
        scores: { kimchi: 3, tteokbokki: 2 }
      },
      {
        text: 'My ability to bring people together',
        scores: { samgyeopsal: 3, bibimbap: 2, bulgogi: 1 }
      },
      {
        text: 'My versatility and reliability',
        scores: { ramyeon: 3, kimbap: 2, jjajangmyeon: 1 }
      },
      {
        text: 'My warmth and nurturing nature',
        scores: { sundubu: 3, jjajangmyeon: 2 }
      }
    ]
  },
  {
    id: 9,
    question: '🏆 Your ideal day includes:',
    options: [
      {
        text: 'A social gathering with lots of food and friends',
        scores: { samgyeopsal: 3, tteokbokki: 2, ramyeon: 1 }
      },
      {
        text: 'A balanced mix of activities and relaxation',
        scores: { bibimbap: 3, bulgogi: 2, kimbap: 1 }
      },
      {
        text: 'Cozy comfort and nostalgia',
        scores: { jjajangmyeon: 3, sundubu: 2, ramyeon: 1 }
      },
      {
        text: 'Something exciting and trendy',
        scores: { tteokbokki: 3, bingsu: 2, kimchi: 1 }
      }
    ]
  },
  {
    id: 10,
    question: '🍽️ Your food philosophy is:',
    options: [
      {
        text: 'Bold flavors that make a statement',
        scores: { kimchi: 3, samgyeopsal: 2, tteokbokki: 1 }
      },
      {
        text: 'Balance and harmony in every bite',
        scores: { bibimbap: 3, bulgogi: 2, kimbap: 1 }
      },
      {
        text: 'Comfort and familiarity above all',
        scores: { jjajangmyeon: 3, sundubu: 2, ramyeon: 1 }
      },
      {
        text: 'Sweet indulgence and joy',
        scores: { bingsu: 3, bulgogi: 1 }
      }
    ]
  }
];

// Calculate result
export function calculateFoodType(answers: number[][]): FoodResult {
  const scores: { [key: string]: number } = {};

  answers.forEach((answer, questionIndex) => {
    if (answer.length > 0 && quizQuestions[questionIndex]) {
      const question = quizQuestions[questionIndex];
      const selectedOption = question.options[answer[0]];
      
      Object.entries(selectedOption.scores).forEach(([foodType, points]) => {
        scores[foodType] = (scores[foodType] || 0) + points;
      });
    }
  });

  // Find the food type with highest score
  let maxScore = 0;
  let resultType = 'bibimbap'; // default

  Object.entries(scores).forEach(([foodType, score]) => {
    if (score > maxScore) {
      maxScore = score;
      resultType = foodType;
    }
  });

  return foodTypes[resultType];
}
