export interface QuizQuestion {
  question: string;
  options: {
    text: string;
    scores: { [key: string]: number };
  }[];
}

export interface PartnerType {
  id: string;
  name: string;
  nameKo: string;
  emoji: string;
  description: string;
  personality: string[];
  idealDate: string;
  celebrity: string;
  compatibility: string;
  strengths: string[];
  relationshipStyle: string;
  loveLanguage: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: "What's your ideal first date in Korea?",
    options: [
      { text: "Han River picnic at sunset with chicken and beer", scores: { romantic: 3, adventurous: 1, intellectual: 1 } },
      { text: "Visiting a trendy café in Gangnam", scores: { trendy: 3, social: 2 } },
      { text: "Hiking Namsan Tower together", scores: { adventurous: 3, active: 2 } },
      { text: "Exploring a traditional hanok village", scores: { intellectual: 3, traditional: 2 } },
      { text: "Karaoke and Korean BBQ", scores: { social: 3, fun: 2 } }
    ]
  },
  {
    question: "Which K-Drama couple dynamic appeals to you most?",
    options: [
      { text: "Opposites attract - rich meets poor", scores: { romantic: 3, dreamy: 2 } },
      { text: "Childhood friends to lovers", scores: { gentle: 3, loyal: 2 } },
      { text: "Boss and employee with banter", scores: { ambitious: 3, playful: 2 } },
      { text: "Fated connection across time/space", scores: { romantic: 3, dreamy: 3 } },
      { text: "Mutual respect and partnership", scores: { intellectual: 3, mature: 2 } }
    ]
  },
  {
    question: "Your partner surprises you with a gift. What would make you happiest?",
    options: [
      { text: "Handwritten letter with heartfelt words", scores: { romantic: 3, emotional: 2 } },
      { text: "Latest trending item (phone, fashion, etc.)", scores: { trendy: 3, practical: 1 } },
      { text: "Concert tickets to your favorite artist", scores: { adventurous: 2, fun: 3 } },
      { text: "Book or something meaningful to you", scores: { intellectual: 3, thoughtful: 2 } },
      { text: "Surprise weekend trip", scores: { adventurous: 3, spontaneous: 2 } }
    ]
  },
  {
    question: "What's most important in communication with your partner?",
    options: [
      { text: "Constant texting throughout the day", scores: { social: 3, clingy: 2 } },
      { text: "Deep late-night conversations", scores: { intellectual: 3, emotional: 2 } },
      { text: "Sharing memes and funny videos", scores: { fun: 3, playful: 2 } },
      { text: "Quality time over quantity of messages", scores: { mature: 3, balanced: 2 } },
      { text: "Actions speak louder than words", scores: { practical: 3, reserved: 2 } }
    ]
  },
  {
    question: "How do you want to celebrate your 100-day anniversary (백일)?",
    options: [
      { text: "Romantic dinner at a fancy restaurant", scores: { romantic: 3, traditional: 2 } },
      { text: "Create matching couple items together", scores: { creative: 3, trendy: 2 } },
      { text: "Take a photoshoot in Ihwa Mural Village", scores: { trendy: 3, social: 2 } },
      { text: "Quiet day at home watching movies", scores: { gentle: 3, homey: 2 } },
      { text: "Try something new like surfing or paragliding", scores: { adventurous: 3, spontaneous: 2 } }
    ]
  },
  {
    question: "Your partner's family invites you for Chuseok. How do you feel?",
    options: [
      { text: "Excited! I love meeting new people", scores: { social: 3, confident: 2 } },
      { text: "Nervous but will try my best", scores: { gentle: 2, respectful: 3 } },
      { text: "Ready to impress with my Korean culture knowledge", scores: { intellectual: 2, ambitious: 3 } },
      { text: "Prefer to wait until we're more serious", scores: { cautious: 3, practical: 2 } },
      { text: "Hope they're fun and laid-back", scores: { fun: 2, casual: 3 } }
    ]
  },
  {
    question: "What quality do you admire most in Korean dating culture?",
    options: [
      { text: "Wearing matching couple outfits", scores: { trendy: 3, romantic: 2 } },
      { text: "Taking care of each other's health", scores: { caring: 3, practical: 2 } },
      { text: "Planning thoughtful dates", scores: { romantic: 3, thoughtful: 2 } },
      { text: "Celebrating every small milestone", scores: { social: 2, sentimental: 3 } },
      { text: "Direct communication and honesty", scores: { mature: 3, straightforward: 2 } }
    ]
  },
  {
    question: "Your ideal way to spend a rainy day in Seoul?",
    options: [
      { text: "Cozy café-hopping in Hongdae", scores: { trendy: 3, social: 2 } },
      { text: "Indoor activities like bowling or arcade", scores: { fun: 3, playful: 2 } },
      { text: "Visiting museums or art galleries", scores: { intellectual: 3, cultural: 2 } },
      { text: "Stay home and cook Korean food together", scores: { homey: 3, practical: 2 } },
      { text: "Shopping in underground malls", scores: { trendy: 2, practical: 3 } }
    ]
  },
  {
    question: "What's your love language in a relationship?",
    options: [
      { text: "Physical touch and skinship", scores: { romantic: 3, affectionate: 2 } },
      { text: "Words of affirmation and compliments", scores: { emotional: 3, verbal: 2 } },
      { text: "Acts of service and helping each other", scores: { practical: 3, caring: 2 } },
      { text: "Quality time and undivided attention", scores: { mature: 3, loyal: 2 } },
      { text: "Thoughtful gifts and surprises", scores: { romantic: 2, generous: 3 } }
    ]
  },
  {
    question: "How would you handle a disagreement with your partner?",
    options: [
      { text: "Talk it out immediately, no matter how late", scores: { emotional: 3, direct: 2 } },
      { text: "Give each other space, then discuss calmly", scores: { mature: 3, balanced: 2 } },
      { text: "Make them laugh to ease the tension first", scores: { fun: 3, playful: 2 } },
      { text: "Apologize first even if I'm not fully wrong", scores: { gentle: 3, peacekeeping: 2 } },
      { text: "Find a compromise that works for both", scores: { practical: 3, fair: 2 } }
    ]
  }
];

export const partnerTypes: { [key: string]: PartnerType } = {
  romantic_dreamer: {
    id: 'romantic_dreamer',
    name: 'The Romantic Dreamer',
    nameKo: '로맨틱 드리머',
    emoji: '💕',
    description: 'You seek a partner who believes in destiny, grand romantic gestures, and fairy-tale love stories. They shower you with affection, remember every special moment, and make you feel like the main character in a K-Drama.',
    personality: ['Affectionate', 'Sentimental', 'Creative', 'Expressive'],
    idealDate: 'Han River sunset picnic with flowers, candles, and a handwritten love letter',
    celebrity: 'Park Seo-joon or Park Min-young style romance',
    compatibility: 'Best with someone who appreciates emotional depth and isn\'t afraid to be vulnerable',
    strengths: ['Makes you feel special every day', 'Remembers important dates', 'Creates magical moments', 'Writes heartfelt messages'],
    relationshipStyle: 'All-in, deeply emotional, and devoted. Loves celebrating every milestone from 100 days to monthly anniversaries.',
    loveLanguage: 'Words of affirmation and quality time'
  },
  trendy_socialite: {
    id: 'trendy_socialite',
    name: 'The Trendy Socialite',
    nameKo: '트렌디 소셜라이트',
    emoji: '✨',
    description: 'Your ideal partner is fashion-forward, socially connected, and always knows the hottest spots in Seoul. They take aesthetic Instagram-worthy photos, love trying new experiences, and keep you in the loop with Korean trends.',
    personality: ['Stylish', 'Outgoing', 'Confident', 'Social-media savvy'],
    idealDate: 'Photo shoot at trendy cafés in Seongsu-dong, followed by shopping in Gangnam',
    celebrity: 'BLACKPINK Jennie or BTS V style fashion icon',
    compatibility: 'Perfect for someone who loves staying current and enjoys social activities',
    strengths: ['Always looks great', 'Knows best restaurants/cafés', 'Fun social life', 'Great at capturing moments'],
    relationshipStyle: 'Modern, open about the relationship on social media, enjoys couple outfits and public displays of affection.',
    loveLanguage: 'Gifts and quality time'
  },
  adventurous_spirit: {
    id: 'adventurous_spirit',
    name: 'The Adventurous Spirit',
    nameKo: '모험가',
    emoji: '🏔️',
    description: 'You want a partner who\'s always up for adventure, whether hiking Korean mountains, trying extreme sports, or spontaneous road trips. They bring excitement and help you break out of your comfort zone.',
    personality: ['Energetic', 'Spontaneous', 'Fearless', 'Active'],
    idealDate: 'Hiking Seoraksan, followed by trying local street food and finding hidden gems',
    celebrity: 'Cha Eun-woo or Lee Sung-kyung energy and athleticism',
    compatibility: 'Best with someone who values experiences over material things',
    strengths: ['Never boring', 'Health-conscious', 'Great travel companion', 'Brings out your bold side'],
    relationshipStyle: 'Dynamic and exciting, plans spontaneous trips, loves outdoor activities together.',
    loveLanguage: 'Quality time and physical touch'
  },
  intellectual_companion: {
    id: 'intellectual_companion',
    name: 'The Intellectual Companion',
    nameKo: '지적 동반자',
    emoji: '📚',
    description: 'Your perfect match is thoughtful, cultured, and loves deep conversations. They enjoy museums, bookstores, philosophical discussions, and sharing knowledge. They respect your mind as much as your heart.',
    personality: ['Thoughtful', 'Curious', 'Articulate', 'Cultured'],
    idealDate: 'Exploring Seoul Museum of Art, then discussing ideas at a quiet hanok tea house',
    celebrity: 'Jung Hae-in or IU intellectual charm',
    compatibility: 'Ideal for someone who values mental connection and meaningful conversations',
    strengths: ['Stimulating conversations', 'Respects your opinions', 'Well-read and informed', 'Emotionally mature'],
    relationshipStyle: 'Balanced and mature, communicates openly, makes decisions together as equals.',
    loveLanguage: 'Quality time and words of affirmation'
  },
  gentle_nurturer: {
    id: 'gentle_nurturer',
    name: 'The Gentle Nurturer',
    nameKo: '다정한 보살핌이',
    emoji: '🌸',
    description: 'You seek someone who takes care of you like family - reminds you to dress warmly, cooks your favorite meals, and is genuinely concerned about your well-being. They create a warm, comfortable relationship.',
    personality: ['Caring', 'Patient', 'Reliable', 'Warm-hearted'],
    idealDate: 'Cooking homemade Korean food together, then watching dramas while cuddling',
    celebrity: 'Gong Yoo or Song Hye-kyo gentle warmth',
    compatibility: 'Perfect for someone who values emotional security and domestic harmony',
    strengths: ['Always considers your feelings', 'Great at conflict resolution', 'Makes you feel safe', 'Excellent listener'],
    relationshipStyle: 'Stable and nurturing, focuses on building a cozy life together, very family-oriented.',
    loveLanguage: 'Acts of service and physical touch'
  },
  fun_playmate: {
    id: 'fun_playmate',
    name: 'The Fun Playmate',
    nameKo: '재미있는 친구',
    emoji: '🎮',
    description: 'Your ideal partner is your best friend first - someone who makes you laugh until you cry, enjoys silly moments, and doesn\'t take life too seriously. They turn everyday moments into fun memories.',
    personality: ['Humorous', 'Playful', 'Easygoing', 'Entertaining'],
    idealDate: 'Korean BBQ with endless soju, karaoke until midnight, and arcade games',
    celebrity: 'Lee Kwang-soo or Park Na-rae comedic energy',
    compatibility: 'Great for someone who values laughter and doesn\'t want a serious/formal relationship',
    strengths: ['Makes you laugh constantly', 'Laid-back and chill', 'Doesn\'t stress over small things', 'Great at parties'],
    relationshipStyle: 'Casual and fun-loving, treats relationship like best friendship, enjoys shared hobbies and games.',
    loveLanguage: 'Quality time and physical touch'
  },
  ambitious_achiever: {
    id: 'ambitious_achiever',
    name: 'The Ambitious Achiever',
    nameKo: '성공가도',
    emoji: '💼',
    description: 'You want a driven partner who has clear goals and works hard for success. They inspire you to be your best self, support your ambitions, and together you build a powerful life.',
    personality: ['Goal-oriented', 'Disciplined', 'Intelligent', 'Motivating'],
    idealDate: 'Brunch at a sophisticated café discussing future plans, then visiting a luxury department store',
    celebrity: 'Park Seo-jun or Jun Ji-hyun confident success',
    compatibility: 'Best for someone equally ambitious who wants a power-couple dynamic',
    strengths: ['Financially responsible', 'Has life direction', 'Pushes you to grow', 'Makes strategic decisions'],
    relationshipStyle: 'Partnership-focused, plans for the future together, supports each other\'s career goals.',
    loveLanguage: 'Acts of service and gifts'
  },
  balanced_realist: {
    id: 'balanced_realist',
    name: 'The Balanced Realist',
    nameKo: '균형잡힌 현실주의자',
    emoji: '⚖️',
    description: 'Your perfect match is grounded, practical, and emotionally stable. They communicate clearly, make fair decisions, and create a healthy relationship built on mutual respect and understanding.',
    personality: ['Mature', 'Practical', 'Fair', 'Stable'],
    idealDate: 'Relaxed walk in Seoul Forest, followed by a nice meal and honest conversation',
    celebrity: 'Hyun Bin or Son Ye-jin mature stability',
    compatibility: 'Ideal for someone who wants a drama-free, long-term healthy relationship',
    strengths: ['Excellent communicator', 'Emotionally stable', 'Makes wise decisions', 'Respects boundaries'],
    relationshipStyle: 'Mature and balanced, focuses on long-term compatibility, handles conflicts constructively.',
    loveLanguage: 'Quality time and acts of service'
  }
};

export function calculatePartnerType(answers: number[][]): PartnerType {
  const scores: { [key: string]: number } = {
    romantic: 0,
    trendy: 0,
    adventurous: 0,
    intellectual: 0,
    gentle: 0,
    fun: 0,
    ambitious: 0,
    mature: 0
  };

  // Calculate scores based on answers
  answers.forEach((answer, questionIndex) => {
    if (answer.length > 0) {
      const selectedOption = quizQuestions[questionIndex].options[answer[0]];
      Object.entries(selectedOption.scores).forEach(([trait, value]) => {
        if (scores.hasOwnProperty(trait)) {
          scores[trait] += value;
        }
      });
    }
  });

  // Determine dominant type
  let maxScore = 0;
  let dominantType = 'romantic';
  
  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantType = type;
    }
  });

  // Map to partner type
  const typeMapping: { [key: string]: string } = {
    romantic: 'romantic_dreamer',
    trendy: 'trendy_socialite',
    adventurous: 'adventurous_spirit',
    intellectual: 'intellectual_companion',
    gentle: 'gentle_nurturer',
    fun: 'fun_playmate',
    ambitious: 'ambitious_achiever',
    mature: 'balanced_realist'
  };

  const partnerTypeId = typeMapping[dominantType] || 'romantic_dreamer';
  return partnerTypes[partnerTypeId];
}
