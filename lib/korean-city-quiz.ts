// Types
export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    scores: {
      seoul: number;
      busan: number;
      jeju: number;
      daejeon: number;
      daegu: number;
      gwangju: number;
      incheon: number;
      suwon: number;
    };
  }[];
}

export interface CityResult {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  personality: string;
  avgRent: string;
  avgRentUSD: string;
  livingCost: string;
  livingCostUSD: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  funFact: string;
  emoji: string;
}

// Quiz Questions (8 questions)
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your ideal daily routine?",
    options: [
      {
        text: "Fast-paced city life with endless options",
        scores: { seoul: 3, busan: 1, jeju: 0, daejeon: 1, daegu: 1, gwangju: 1, incheon: 2, suwon: 2 }
      },
      {
        text: "Balanced work-life with nature nearby",
        scores: { seoul: 1, busan: 2, jeju: 3, daejeon: 2, daegu: 2, gwangju: 2, incheon: 1, suwon: 2 }
      },
      {
        text: "Relaxed pace with beach vibes",
        scores: { seoul: 0, busan: 3, jeju: 3, daejeon: 1, daegu: 1, gwangju: 1, incheon: 2, suwon: 1 }
      },
      {
        text: "Academic/research-oriented environment",
        scores: { seoul: 2, busan: 1, jeju: 0, daejeon: 3, daegu: 2, gwangju: 2, incheon: 1, suwon: 2 }
      }
    ]
  },
  {
    id: 2,
    question: "How important is nightlife and entertainment?",
    options: [
      {
        text: "Essential! I love bars, clubs, and late-night activities",
        scores: { seoul: 3, busan: 2, jeju: 1, daejeon: 1, daegu: 2, gwangju: 2, incheon: 2, suwon: 1 }
      },
      {
        text: "Nice to have, but not necessary",
        scores: { seoul: 2, busan: 2, jeju: 2, daejeon: 2, daegu: 2, gwangju: 2, incheon: 2, suwon: 2 }
      },
      {
        text: "I prefer quiet evenings",
        scores: { seoul: 0, busan: 1, jeju: 3, daejeon: 2, daegu: 1, gwangju: 1, incheon: 1, suwon: 2 }
      }
    ]
  },
  {
    id: 3,
    question: "What's your budget range for monthly rent?",
    options: [
      {
        text: "Under $500 - I'm budget conscious",
        scores: { seoul: 0, busan: 2, jeju: 1, daejeon: 3, daegu: 3, gwangju: 3, incheon: 1, suwon: 2 }
      },
      {
        text: "$500-800 - Moderate budget",
        scores: { seoul: 1, busan: 3, jeju: 2, daejeon: 2, daegu: 2, gwangju: 2, incheon: 3, suwon: 3 }
      },
      {
        text: "$800-1,200 - Comfortable living",
        scores: { seoul: 2, busan: 2, jeju: 2, daejeon: 1, daegu: 1, gwangju: 1, incheon: 2, suwon: 2 }
      },
      {
        text: "Over $1,200 - Premium options",
        scores: { seoul: 3, busan: 1, jeju: 3, daejeon: 0, daegu: 0, gwangju: 0, incheon: 1, suwon: 1 }
      }
    ]
  },
  {
    id: 4,
    question: "How do you prefer to get around?",
    options: [
      {
        text: "Advanced subway system is a must",
        scores: { seoul: 3, busan: 2, jeju: 0, daejeon: 1, daegu: 2, gwangju: 1, incheon: 2, suwon: 2 }
      },
      {
        text: "Mix of public transport and walking",
        scores: { seoul: 2, busan: 2, jeju: 1, daejeon: 3, daegu: 2, gwangju: 2, incheon: 2, suwon: 3 }
      },
      {
        text: "I prefer driving my own car",
        scores: { seoul: 0, busan: 2, jeju: 3, daejeon: 2, daegu: 2, gwangju: 2, incheon: 2, suwon: 2 }
      }
    ]
  },
  {
    id: 5,
    question: "What's your career focus?",
    options: [
      {
        text: "Tech, startups, or finance",
        scores: { seoul: 3, busan: 1, jeju: 0, daejeon: 2, daegu: 1, gwangju: 1, incheon: 2, suwon: 2 }
      },
      {
        text: "Education or research",
        scores: { seoul: 2, busan: 2, jeju: 1, daejeon: 3, daegu: 2, gwangju: 3, incheon: 1, suwon: 2 }
      },
      {
        text: "Tourism or hospitality",
        scores: { seoul: 1, busan: 3, jeju: 3, daejeon: 0, daegu: 1, gwangju: 1, incheon: 2, suwon: 1 }
      },
      {
        text: "Manufacturing or traditional industries",
        scores: { seoul: 1, busan: 2, jeju: 0, daejeon: 1, daegu: 3, gwangju: 2, incheon: 3, suwon: 2 }
      }
    ]
  },
  {
    id: 6,
    question: "What type of community vibe do you want?",
    options: [
      {
        text: "International and diverse",
        scores: { seoul: 3, busan: 2, jeju: 2, daejeon: 1, daegu: 1, gwangju: 1, incheon: 3, suwon: 1 }
      },
      {
        text: "Traditional Korean culture",
        scores: { seoul: 1, busan: 2, jeju: 2, daejeon: 2, daegu: 3, gwangju: 3, incheon: 1, suwon: 2 }
      },
      {
        text: "Mix of modern and traditional",
        scores: { seoul: 2, busan: 3, jeju: 1, daejeon: 2, daegu: 2, gwangju: 2, incheon: 2, suwon: 3 }
      },
      {
        text: "Laid-back island lifestyle",
        scores: { seoul: 0, busan: 1, jeju: 3, daejeon: 0, daegu: 0, gwangju: 0, incheon: 1, suwon: 0 }
      }
    ]
  },
  {
    id: 7,
    question: "How important is access to nature?",
    options: [
      {
        text: "Not important - I'm a city person",
        scores: { seoul: 3, busan: 1, jeju: 0, daejeon: 1, daegu: 1, gwangju: 1, incheon: 2, suwon: 2 }
      },
      {
        text: "Nice to have parks nearby",
        scores: { seoul: 2, busan: 2, jeju: 1, daejeon: 3, daegu: 2, gwangju: 2, incheon: 2, suwon: 3 }
      },
      {
        text: "Very important - mountains or beaches",
        scores: { seoul: 1, busan: 3, jeju: 3, daejeon: 2, daegu: 2, gwangju: 2, incheon: 2, suwon: 1 }
      },
      {
        text: "Essential - I need nature everywhere",
        scores: { seoul: 0, busan: 2, jeju: 3, daejeon: 1, daegu: 1, gwangju: 1, incheon: 1, suwon: 1 }
      }
    ]
  },
  {
    id: 8,
    question: "What's your ideal weekend activity?",
    options: [
      {
        text: "Shopping and cafe hopping",
        scores: { seoul: 3, busan: 2, jeju: 1, daejeon: 1, daegu: 2, gwangju: 1, incheon: 2, suwon: 2 }
      },
      {
        text: "Beach or water activities",
        scores: { seoul: 0, busan: 3, jeju: 3, daejeon: 0, daegu: 0, gwangju: 0, incheon: 2, suwon: 0 }
      },
      {
        text: "Museums and cultural sites",
        scores: { seoul: 2, busan: 2, jeju: 1, daejeon: 2, daegu: 3, gwangju: 3, incheon: 1, suwon: 2 }
      },
      {
        text: "Hiking and outdoor sports",
        scores: { seoul: 1, busan: 2, jeju: 2, daejeon: 3, daegu: 2, gwangju: 2, incheon: 1, suwon: 3 }
      }
    ]
  }
];

// City Results
export const cityResults: Record<string, CityResult> = {
  seoul: {
    id: 'seoul',
    name: 'Seoul',
    nameKo: '서울',
    emoji: '🏙️',
    description: 'The vibrant capital city that never sleeps! Seoul offers endless opportunities, world-class infrastructure, and the ultimate urban lifestyle.',
    personality: 'Ambitious, Fast-paced, Trendsetter',
    avgRent: '₩1,000,000 - ₩2,000,000',
    avgRentUSD: '$750 - $1,500/month',
    livingCost: '₩2,500,000 - ₩4,000,000',
    livingCostUSD: '$1,900 - $3,000/month',
    pros: [
      'Best job opportunities in Korea',
      'World-class public transportation',
      'Vibrant nightlife and entertainment',
      'International community',
      'Endless shopping and dining options',
      'Major hub for tech and finance'
    ],
    cons: [
      'Most expensive city in Korea',
      'High competition and stress',
      'Crowded and hectic pace',
      'Smaller living spaces',
      'Air pollution concerns'
    ],
    bestFor: [
      'Career-focused professionals',
      'Young entrepreneurs',
      'K-pop and entertainment enthusiasts',
      'Those seeking maximum convenience',
      'International expats'
    ],
    funFact: 'Seoul has more coffee shops per capita than any other city in the world! ☕'
  },
  busan: {
    id: 'busan',
    name: 'Busan',
    nameKo: '부산',
    emoji: '🏖️',
    description: 'Korea\'s second-largest city combines beach life with urban amenities. Perfect for those who want city convenience with a coastal lifestyle.',
    personality: 'Laid-back, Friendly, Beach-lover',
    avgRent: '₩500,000 - ₩900,000',
    avgRentUSD: '$400 - $700/month',
    livingCost: '₩1,800,000 - ₩2,800,000',
    livingCostUSD: '$1,400 - $2,100/month',
    pros: [
      'Beautiful beaches and seafood',
      'More affordable than Seoul',
      'Friendly and welcoming locals',
      'Great work-life balance',
      'Major port city with job opportunities',
      'International film festival hub'
    ],
    cons: [
      'Strong local dialect (Busan satoori)',
      'Fewer expat communities than Seoul',
      'Less diverse job market',
      'Humid summers',
      'Limited English speakers'
    ],
    bestFor: [
      'Beach and ocean lovers',
      'Those seeking affordable coastal living',
      'Foodies (especially seafood)',
      'People wanting slower pace than Seoul',
      'Maritime industry professionals'
    ],
    funFact: 'Busan hosts Asia\'s largest film festival - the Busan International Film Festival (BIFF)! 🎬'
  },
  jeju: {
    id: 'jeju',
    name: 'Jeju Island',
    nameKo: '제주도',
    emoji: '🌴',
    description: 'Korea\'s tropical paradise island! UNESCO World Heritage sites, stunning nature, and a unique island culture make Jeju truly special.',
    personality: 'Nature-lover, Adventurous, Free-spirited',
    avgRent: '₩500,000 - ₩1,200,000',
    avgRentUSD: '$400 - $900/month',
    livingCost: '₩1,700,000 - ₩2,500,000',
    livingCostUSD: '$1,300 - $1,900/month',
    pros: [
      'Stunning natural beauty',
      'No visa required for many nationalities',
      'Clean air and healthy environment',
      'Unique island culture',
      'Growing expat community',
      'Perfect for remote workers'
    ],
    cons: [
      'Limited job opportunities',
      'Need a car to get around',
      'Isolated from mainland',
      'Smaller international community',
      'Higher cost of imported goods',
      'Strong winds in winter'
    ],
    bestFor: [
      'Remote workers and digital nomads',
      'Nature and hiking enthusiasts',
      'Those seeking island lifestyle',
      'Retirees',
      'Tourism industry professionals'
    ],
    funFact: 'Jeju has its own language, Jejueo, which UNESCO lists as critically endangered! 🗣️'
  },
  daejeon: {
    id: 'daejeon',
    name: 'Daejeon',
    nameKo: '대전',
    emoji: '🔬',
    description: 'Korea\'s "Science City" and tech hub! Home to major research institutes and universities, perfect for academics and innovators.',
    personality: 'Intellectual, Innovative, Balanced',
    avgRent: '₩400,000 - ₩700,000',
    avgRentUSD: '$300 - $550/month',
    livingCost: '₩1,500,000 - ₩2,200,000',
    livingCostUSD: '$1,100 - $1,700/month',
    pros: [
      'Major research and tech hub',
      'Very affordable living costs',
      'Excellent universities',
      'Central location (1.5hrs to Seoul)',
      'Good public transportation',
      'Clean and well-organized city'
    ],
    cons: [
      'Smaller city feel',
      'Limited nightlife',
      'Fewer international restaurants',
      'Small expat community',
      'Less tourist attractions'
    ],
    bestFor: [
      'Researchers and scientists',
      'University students',
      'Tech professionals',
      'Families seeking affordability',
      'Those wanting proximity to Seoul'
    ],
    funFact: 'Daejeon is home to KAIST, Korea\'s MIT, and over 30 government research institutes! 🎓'
  },
  daegu: {
    id: 'daegu',
    name: 'Daegu',
    nameKo: '대구',
    emoji: '🏭',
    description: 'Korea\'s textile capital with rich history! Known for traditional Korean culture, hot summers, and warm-hearted people.',
    personality: 'Traditional, Authentic, Hardworking',
    avgRent: '₩400,000 - ₩650,000',
    avgRentUSD: '$300 - $500/month',
    livingCost: '₩1,500,000 - ₩2,100,000',
    livingCostUSD: '$1,100 - $1,600/month',
    pros: [
      'Very affordable cost of living',
      'Rich traditional culture',
      'Famous for delicious food',
      'Strong manufacturing industry',
      'Friendly locals',
      'Less crowded than major cities'
    ],
    cons: [
      'Hottest summers in Korea',
      'Strong local dialect',
      'Small expat community',
      'Limited English support',
      'Fewer entertainment options'
    ],
    bestFor: [
      'Those interested in traditional Korea',
      'Budget-conscious individuals',
      'Manufacturing industry workers',
      'Korean language learners',
      'People seeking authentic Korean experience'
    ],
    funFact: 'Daegu is famous for its delicious apples and is the birthplace of chimaek (chicken + beer)! 🍗🍺'
  },
  gwangju: {
    id: 'gwangju',
    name: 'Gwangju',
    nameKo: '광주',
    emoji: '🎨',
    description: 'The "City of Light" and cultural capital of southwestern Korea! Known for democracy movement, art, and the best Korean food.',
    personality: 'Creative, Progressive, Culinary',
    avgRent: '₩350,000 - ₩600,000',
    avgRentUSD: '$270 - $450/month',
    livingCost: '₩1,400,000 - ₩2,000,000',
    livingCostUSD: '$1,050 - $1,500/month',
    pros: [
      'Most affordable major city',
      'Famous for amazing food',
      'Strong arts and culture scene',
      'Friendly and progressive locals',
      'Growing tech sector',
      'Rich historical significance'
    ],
    cons: [
      'Furthest from Seoul',
      'Very small expat community',
      'Limited international connections',
      'Strong local dialect',
      'Fewer job opportunities'
    ],
    bestFor: [
      'Artists and creatives',
      'Foodies and culinary enthusiasts',
      'Budget travelers',
      'Korean history enthusiasts',
      'Teachers and educators'
    ],
    funFact: 'Gwangju hosts the Gwangju Biennale, one of Asia\'s most prestigious contemporary art festivals! 🎨'
  },
  incheon: {
    id: 'incheon',
    name: 'Incheon',
    nameKo: '인천',
    emoji: '✈️',
    description: 'Korea\'s gateway city with the main international airport! A growing metropolitan area with great connectivity.',
    personality: 'Cosmopolitan, Connected, Growing',
    avgRent: '₩500,000 - ₩900,000',
    avgRentUSD: '$400 - $700/month',
    livingCost: '₩1,800,000 - ₩2,500,000',
    livingCostUSD: '$1,400 - $1,900/month',
    pros: [
      'Direct airport access',
      'Growing job market',
      'New modern infrastructure',
      'Port city opportunities',
      'Less crowded than Seoul',
      'Good balance of urban and coastal'
    ],
    cons: [
      'Still developing in some areas',
      'Can feel like Seoul\'s suburb',
      'Less cultural attractions',
      'Commute to Seoul can be long',
      'Identity crisis (not quite Seoul)'
    ],
    bestFor: [
      'Frequent travelers',
      'Logistics professionals',
      'Those wanting Seoul access with lower costs',
      'Families seeking modern apartments',
      'Airport industry workers'
    ],
    funFact: 'Incheon is home to Korea\'s first Chinatown, established in 1883! 🥟'
  },
  suwon: {
    id: 'suwon',
    name: 'Suwon',
    nameKo: '수원',
    emoji: '🏰',
    description: 'Historic city with UNESCO heritage fortress! Close to Seoul but offers lower costs and great quality of life.',
    personality: 'Historic, Family-friendly, Balanced',
    avgRent: '₩450,000 - ₩800,000',
    avgRentUSD: '$350 - $600/month',
    livingCost: '₩1,600,000 - ₩2,300,000',
    livingCostUSD: '$1,200 - $1,800/month',
    pros: [
      'UNESCO World Heritage site',
      '30 minutes to Seoul',
      'Samsung headquarters nearby',
      'Great for families',
      'Good schools and universities',
      'Affordable yet modern'
    ],
    cons: [
      'Can feel like commuter town',
      'Less nightlife than Seoul',
      'Small international community',
      'Need to commute for major events',
      'Limited distinct identity'
    ],
    bestFor: [
      'Samsung employees',
      'Families with children',
      'History enthusiasts',
      'Those seeking Seoul access affordably',
      'University students'
    ],
    funFact: 'Suwon\'s Hwaseong Fortress is a UNESCO site and you can walk the entire 5.7km fortress wall! 🏰'
  }
};

// Calculate quiz result
export function calculateCityResult(answers: number[][]): string {
  const scores: Record<string, number> = {
    seoul: 0,
    busan: 0,
    jeju: 0,
    daejeon: 0,
    daegu: 0,
    gwangju: 0,
    incheon: 0,
    suwon: 0
  };

  // Calculate scores based on answers
  answers.forEach((questionAnswers, questionIndex) => {
    const question = quizQuestions[questionIndex];
    questionAnswers.forEach(optionIndex => {
      const option = question.options[optionIndex];
      Object.entries(option.scores).forEach(([city, score]) => {
        scores[city] += score;
      });
    });
  });

  // Find city with highest score
  let maxScore = 0;
  let resultCity = 'seoul';
  
  Object.entries(scores).forEach(([city, score]) => {
    if (score > maxScore) {
      maxScore = score;
      resultCity = city;
    }
  });

  return resultCity;
}
