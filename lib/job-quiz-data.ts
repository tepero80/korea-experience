// Korea Job Quiz Data
// 16 Korean job results with detailed information

export interface JobResult {
  id: string;
  emoji: string;
  title: string;
  titleKorean: string;
  description: string;
  salary: string;
  location: string;
  pros: string[];
  cons: string[];
  skills: string[];
  personality: string;
  viralMessage: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    scores: { [jobId: string]: number };
  }[];
}

// 16 Korean Job Results
export const JOB_RESULTS: JobResult[] = [
  {
    id: 'kpop-manager',
    emoji: '🎤',
    title: 'K-Pop Idol Manager',
    titleKorean: '아이돌 매니저',
    description: 'Managing the next BTS or BLACKPINK! You thrive in the fast-paced entertainment industry, coordinating schedules, negotiations, and making stars shine.',
    salary: '₩35-80M/year ($30-70K)',
    location: 'Seoul (Gangnam, Apgujeong)',
    pros: [
      'Work with global superstars',
      'Dynamic and exciting environment',
      'Travel opportunities worldwide',
      'Be part of K-Pop wave'
    ],
    cons: [
      'Extremely long hours (12-16h days)',
      'High stress and pressure',
      'Irregular schedule',
      'Demanding personalities'
    ],
    skills: ['Communication', 'Multitasking', 'Crisis Management', 'Korean Language'],
    personality: 'Energetic, patient, and star-struck!',
    viralMessage: "I'd be a K-Pop Idol Manager in Korea! 🎤✨ Living the hallyu dream!"
  },
  {
    id: 'tech-engineer',
    emoji: '💼',
    title: 'Samsung/LG Engineer',
    titleKorean: '대기업 엔지니어',
    description: 'Building the future at Korea\'s tech giants. You\'re analytical, detail-oriented, and passionate about innovation in semiconductors, displays, or consumer electronics.',
    salary: '₩50-120M/year ($45-100K)',
    location: 'Seoul, Suwon, Gumi',
    pros: [
      'High salary and job security',
      'Cutting-edge technology',
      'Excellent benefits (housing, bonuses)',
      'Prestigious company name'
    ],
    cons: [
      'Hierarchical culture',
      'Long working hours',
      'Strict corporate environment',
      'Competitive pressure'
    ],
    skills: ['Engineering', 'Problem Solving', 'Technical Skills', 'Team Collaboration'],
    personality: 'Logical, ambitious, and tech-savvy',
    viralMessage: "I'd be a Samsung Engineer in Korea! 💼🔬 Innovation is my middle name!"
  },
  {
    id: 'cafe-owner',
    emoji: '☕',
    title: 'Cafe Owner',
    titleKorean: '카페 사장',
    description: 'Running your dream aesthetic cafe in Seoul! You love coffee culture, interior design, and creating cozy spaces for Instagram-worthy moments.',
    salary: '₩25-60M/year ($20-50K)',
    location: 'Seoul (Hongdae, Gangnam, Itaewon)',
    pros: [
      'Be your own boss',
      'Creative freedom',
      'Meet interesting people',
      'Instagram-famous potential'
    ],
    cons: [
      'High initial investment (₩100-300M)',
      'Competitive market',
      'Long hours (7 days/week)',
      'Thin profit margins'
    ],
    skills: ['Business Management', 'Design Sense', 'Customer Service', 'Social Media'],
    personality: 'Creative, entrepreneurial, and sociable',
    viralMessage: "I'd own an aesthetic cafe in Korea! ☕✨ Living the cozy dream!"
  },
  {
    id: 'plastic-surgery-consultant',
    emoji: '💉',
    title: 'Plastic Surgery Consultant',
    titleKorean: '성형외과 컨설턴트',
    description: 'Helping international clients achieve their beauty goals in Gangnam. You\'re the bridge between doctors and patients in Korea\'s booming medical tourism industry.',
    salary: '₩35-70M/year ($30-60K)',
    location: 'Seoul (Gangnam, Apgujeong)',
    pros: [
      'High demand industry',
      'Work with international clients',
      'Good commission potential',
      'Beauty industry insider'
    ],
    cons: [
      'Emotionally demanding',
      'Sales pressure',
      'Irregular hours (client schedules)',
      'Ethical considerations'
    ],
    skills: ['Multilingual', 'Sales', 'Medical Knowledge', 'Empathy'],
    personality: 'Persuasive, caring, and beauty-conscious',
    viralMessage: "I'd be a Plastic Surgery Consultant in Korea! 💉✨ Gangnam beauty expert!"
  },
  {
    id: 'game-developer',
    emoji: '🎮',
    title: 'Game Developer',
    titleKorean: '게임 개발자',
    description: 'Creating the next League of Legends or PUBG at companies like Riot Korea, Krafton, or NCSoft. You live and breathe gaming.',
    salary: '₩40-100M/year ($35-85K)',
    location: 'Seoul (Pangyo, Gangnam)',
    pros: [
      'Work on global hit games',
      'Creative and fun environment',
      'High salaries for seniors',
      'Gaming perks and events'
    ],
    cons: [
      'Crunch time hell',
      'Burnout risk',
      'Competitive job market',
      'Work-life balance issues'
    ],
    skills: ['Programming', 'Game Design', 'Teamwork', 'Passion for Gaming'],
    personality: 'Geeky, creative, and persistent',
    viralMessage: "I'd be a Game Developer in Korea! 🎮💻 Making the next PUBG!"
  },
  {
    id: 'kdrama-producer',
    emoji: '📺',
    title: 'K-Drama Producer',
    titleKorean: '드라마 PD',
    description: 'Producing the next Squid Game or Crash Landing on You. You\'re a storyteller at heart, managing productions that captivate millions globally.',
    salary: '₩40-150M/year ($35-130K)',
    location: 'Seoul (Yeouido, Sangam)',
    pros: [
      'Create cultural phenomena',
      'Work with top actors',
      'Global recognition',
      'Creative fulfillment'
    ],
    cons: [
      'Insane work hours (18h days)',
      'High pressure and stress',
      'Unpredictable schedule',
      'Competitive industry'
    ],
    skills: ['Storytelling', 'Leadership', 'Production Management', 'Creativity'],
    personality: 'Visionary, resilient, and drama-obsessed',
    viralMessage: "I'd be a K-Drama Producer in Korea! 📺🎬 Netflix here I come!"
  },
  {
    id: 'restaurant-owner',
    emoji: '🍜',
    title: 'Korean Restaurant Owner',
    titleKorean: '식당 사장',
    description: 'Serving authentic Korean cuisine! You\'re passionate about food and want to share Korean flavors - from BBQ to bibimbap to late-night soju spots.',
    salary: '₩30-80M/year ($25-70K)',
    location: 'Seoul, Busan (any city)',
    pros: [
      'Be your own boss',
      'Share Korean food culture',
      'Community connections',
      'Steady customer base possible'
    ],
    cons: [
      'Long hours (10-14h days)',
      'Physical labor',
      'Competitive market',
      'Thin margins, high costs'
    ],
    skills: ['Cooking', 'Business Management', 'Customer Service', 'Stamina'],
    personality: 'Hardworking, hospitable, and food-loving',
    viralMessage: "I'd own a Korean restaurant in Korea! 🍜🔥 Serving kimchi with love!"
  },
  {
    id: 'corporate-worker',
    emoji: '👔',
    title: 'Corporate Salary Worker',
    titleKorean: '회사원',
    description: 'The classic Korean office life! You value stability, benefits, and climbing the corporate ladder at a respectable company.',
    salary: '₩35-70M/year ($30-60K)',
    location: 'Seoul (Gangnam, Yeouido)',
    pros: [
      'Job security',
      'Stable income and benefits',
      'Clear career path',
      'Social status'
    ],
    cons: [
      'Office politics',
      'Hierarchical pressure',
      'Long hours (9-9-6)',
      'Limited creativity'
    ],
    skills: ['Organization', 'Team Collaboration', 'Office Software', 'Korean Business Culture'],
    personality: 'Reliable, traditional, and stable',
    viralMessage: "I'd be a Corporate Worker in Korea! 👔💼 Living the salary life!"
  },
  {
    id: 'english-teacher',
    emoji: '📚',
    title: 'English Teacher',
    titleKorean: '영어 선생님',
    description: 'Teaching English in Korea! Whether at hagwons or public schools, you\'re shaping young minds and experiencing Korean culture firsthand.',
    salary: '₩25-35M/year ($22-30K)',
    location: 'Seoul, Busan, any city',
    pros: [
      'Easy visa process',
      'Housing often provided',
      'Explore Korea while working',
      'Meaningful impact on students'
    ],
    cons: [
      'Moderate salary',
      'Demanding parents',
      'Repetitive lessons',
      'Limited career growth'
    ],
    skills: ['Teaching', 'Patience', 'Cultural Adaptation', 'English Proficiency'],
    personality: 'Patient, adventurous, and educational',
    viralMessage: "I'd be an English Teacher in Korea! 📚✏️ Teaching and traveling!"
  },
  {
    id: 'beauty-expert',
    emoji: '💄',
    title: 'K-Beauty Expert',
    titleKorean: '뷰티 전문가',
    description: 'Working in Korea\'s world-famous beauty industry! From skincare to makeup, you\'re at the cutting edge of K-Beauty trends.',
    salary: '₩30-60M/year ($25-50K)',
    location: 'Seoul (Myeongdong, Gangnam)',
    pros: [
      'Trendy industry',
      'Product discounts',
      'Creative work',
      'Social media opportunities'
    ],
    cons: [
      'Competitive market',
      'Sales pressure',
      'Standing all day',
      'Beauty standards pressure'
    ],
    skills: ['Skincare Knowledge', 'Sales', 'Trends Awareness', 'Customer Service'],
    personality: 'Beauty-obsessed, trendy, and sociable',
    viralMessage: "I'd be a K-Beauty Expert in Korea! 💄✨ Glass skin is my passion!"
  },
  {
    id: 'startup-founder',
    emoji: '🏢',
    title: 'Startup Founder',
    titleKorean: '스타트업 창업자',
    description: 'Building the next Coupang or Kakao! You\'re a risk-taker with big dreams in Korea\'s booming startup ecosystem.',
    salary: '₩0-∞ (high risk, high reward)',
    location: 'Seoul (Gangnam, Pangyo)',
    pros: [
      'Unlimited potential',
      'Full creative control',
      'Government support programs',
      'Vibrant startup scene'
    ],
    cons: [
      'High failure rate',
      'Financial instability',
      'Extreme work hours',
      'Constant stress'
    ],
    skills: ['Entrepreneurship', 'Leadership', 'Risk-Taking', 'Networking'],
    personality: 'Ambitious, visionary, and fearless',
    viralMessage: "I'd be a Startup Founder in Korea! 🏢🚀 Next unicorn incoming!"
  },
  {
    id: 'content-creator',
    emoji: '🎨',
    title: 'Content Creator / YouTuber',
    titleKorean: '유튜버 / 크리에이터',
    description: 'Creating viral content about Korean life! From food tours to K-Pop reactions, you\'re building your personal brand online.',
    salary: '₩10-100M/year (highly variable)',
    location: 'Seoul (anywhere with WiFi)',
    pros: [
      'Work from anywhere',
      'Creative freedom',
      'Potential viral success',
      'Meet fans and brands'
    ],
    cons: [
      'Unstable income',
      'Algorithm dependency',
      'Public scrutiny',
      'Burnout from constant content'
    ],
    skills: ['Video Editing', 'Social Media', 'Creativity', 'Self-Motivation'],
    personality: 'Creative, extroverted, and trend-savvy',
    viralMessage: "I'd be a Content Creator in Korea! 🎨📱 Subscribe to my channel!"
  },
  {
    id: 'medical-coordinator',
    emoji: '🏥',
    title: 'Medical Tourism Coordinator',
    titleKorean: '의료관광 코디네이터',
    description: 'Helping international patients navigate Korea\'s medical system - from cosmetic procedures to advanced treatments.',
    salary: '₩30-60M/year ($25-50K)',
    location: 'Seoul (Gangnam, Jung-gu)',
    pros: [
      'Growing industry',
      'Help people',
      'Multilingual advantage',
      'Medical knowledge gain'
    ],
    cons: [
      'Emotional stress',
      'Irregular hours',
      'High responsibility',
      'Complex regulations'
    ],
    skills: ['Multilingual', 'Medical Knowledge', 'Organization', 'Empathy'],
    personality: 'Caring, organized, and detail-oriented',
    viralMessage: "I'd be a Medical Tourism Coordinator in Korea! 🏥✈️ Healthcare hero!"
  },
  {
    id: 'marketing-director',
    emoji: '🎯',
    title: 'Marketing Director',
    titleKorean: '마케팅 디렉터',
    description: 'Driving brand success in Korea\'s competitive market. You understand trends, data, and how to make products go viral.',
    salary: '₩50-120M/year ($45-100K)',
    location: 'Seoul (Gangnam, Yeouido)',
    pros: [
      'High salary',
      'Creative + analytical work',
      'Influence brand success',
      'Dynamic environment'
    ],
    cons: [
      'High pressure',
      'Long hours',
      'Results-driven stress',
      'Competitive field'
    ],
    skills: ['Marketing Strategy', 'Data Analysis', 'Creativity', 'Leadership'],
    personality: 'Strategic, trendy, and ambitious',
    viralMessage: "I'd be a Marketing Director in Korea! 🎯📊 Making brands viral!"
  },
  {
    id: 'tour-guide',
    emoji: '🌏',
    title: 'Korea Tour Guide',
    titleKorean: '관광 가이드',
    description: 'Showing the world the best of Korea! From palaces to street food, you\'re passionate about sharing Korean culture with visitors.',
    salary: '₩25-45M/year ($20-40K)',
    location: 'Seoul, Busan, Jeju',
    pros: [
      'Meet people worldwide',
      'Explore Korea constantly',
      'Flexible schedule',
      'Share culture'
    ],
    cons: [
      'Seasonal work',
      'Physical demands',
      'Dealing with complaints',
      'Weather dependent'
    ],
    skills: ['Multilingual', 'Korean History', 'People Skills', 'Stamina'],
    personality: 'Outgoing, knowledgeable, and energetic',
    viralMessage: "I'd be a Tour Guide in Korea! 🌏📸 Showing Seoul to the world!"
  },
  {
    id: 'research-scientist',
    emoji: '🔬',
    title: 'Research Scientist',
    titleKorean: '연구원',
    description: 'Conducting cutting-edge research at Korean institutes like KAIST, Samsung Research, or government labs. You\'re driving innovation.',
    salary: '₩40-90M/year ($35-80K)',
    location: 'Seoul, Daejeon, Pohang',
    pros: [
      'Intellectual stimulation',
      'Contribute to advancement',
      'Stable environment',
      'Respect and prestige'
    ],
    cons: [
      'Academic politics',
      'Grant competition',
      'Publish-or-perish pressure',
      'Slow career progression'
    ],
    skills: ['Research', 'Critical Thinking', 'Writing', 'Specialized Knowledge'],
    personality: 'Curious, analytical, and patient',
    viralMessage: "I'd be a Research Scientist in Korea! 🔬🧪 Science rules!"
  }
];

// 10 Quiz Questions
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your ideal weekend activity?",
    options: [
      {
        text: "🎉 Attending K-Pop concerts or entertainment events",
        scores: { 'kpop-manager': 3, 'kdrama-producer': 2, 'content-creator': 2 }
      },
      {
        text: "💻 Working on side projects or learning new tech",
        scores: { 'tech-engineer': 3, 'game-developer': 3, 'startup-founder': 2 }
      },
      {
        text: "☕ Exploring trendy cafes and aesthetic spots",
        scores: { 'cafe-owner': 3, 'content-creator': 2, 'beauty-expert': 2 }
      },
      {
        text: "📚 Reading, studying, or peaceful activities",
        scores: { 'research-scientist': 3, 'english-teacher': 2, 'corporate-worker': 1 }
      }
    ]
  },
  {
    id: 2,
    question: "How do you handle stress?",
    options: [
      {
        text: "🏃 High-energy activities and social events",
        scores: { 'kpop-manager': 2, 'marketing-director': 2, 'tour-guide': 2 }
      },
      {
        text: "🧘 Meditation, spa, and self-care",
        scores: { 'beauty-expert': 3, 'medical-coordinator': 2, 'plastic-surgery-consultant': 2 }
      },
      {
        text: "🍺 Soju with friends and late-night food",
        scores: { 'restaurant-owner': 3, 'corporate-worker': 2, 'cafe-owner': 2 }
      },
      {
        text: "🎮 Gaming, movies, or solo hobbies",
        scores: { 'game-developer': 3, 'content-creator': 2, 'research-scientist': 1 }
      }
    ]
  },
  {
    id: 3,
    question: "What's your ideal work environment?",
    options: [
      {
        text: "🏢 Professional corporate office with structure",
        scores: { 'tech-engineer': 3, 'corporate-worker': 3, 'marketing-director': 2 }
      },
      {
        text: "🎨 Creative space with flexible vibes",
        scores: { 'content-creator': 3, 'kdrama-producer': 2, 'game-developer': 2 }
      },
      {
        text: "🏪 Own my own space, be the boss",
        scores: { 'cafe-owner': 3, 'restaurant-owner': 3, 'startup-founder': 3 }
      },
      {
        text: "🌍 Meet people constantly, dynamic settings",
        scores: { 'kpop-manager': 2, 'tour-guide': 3, 'medical-coordinator': 2 }
      }
    ]
  },
  {
    id: 4,
    question: "Money vs Passion - which matters more?",
    options: [
      {
        text: "💰 Show me the money! High salary is priority",
        scores: { 'tech-engineer': 3, 'plastic-surgery-consultant': 2, 'marketing-director': 2 }
      },
      {
        text: "❤️ Passion first! I'll do what I love",
        scores: { 'content-creator': 3, 'kdrama-producer': 2, 'tour-guide': 2 }
      },
      {
        text: "⚖️ Balance - decent pay + fulfilling work",
        scores: { 'english-teacher': 3, 'corporate-worker': 2, 'beauty-expert': 2 }
      },
      {
        text: "🚀 Risk it all for potential huge rewards",
        scores: { 'startup-founder': 3, 'game-developer': 2, 'restaurant-owner': 2 }
      }
    ]
  },
  {
    id: 5,
    question: "Team player or solo worker?",
    options: [
      {
        text: "👥 I thrive in team collaborations",
        scores: { 'tech-engineer': 2, 'game-developer': 2, 'kdrama-producer': 3 }
      },
      {
        text: "🎯 I prefer working independently",
        scores: { 'content-creator': 3, 'research-scientist': 2, 'cafe-owner': 2 }
      },
      {
        text: "🤝 I love interacting with customers/clients",
        scores: { 'tour-guide': 3, 'beauty-expert': 2, 'medical-coordinator': 2 }
      },
      {
        text: "👑 I want to lead and manage teams",
        scores: { 'kpop-manager': 3, 'marketing-director': 3, 'startup-founder': 2 }
      }
    ]
  },
  {
    id: 6,
    question: "Stability or Adventure?",
    options: [
      {
        text: "🔒 Give me job security and benefits",
        scores: { 'corporate-worker': 3, 'tech-engineer': 2, 'research-scientist': 2 }
      },
      {
        text: "🎢 I want excitement and unpredictability",
        scores: { 'kpop-manager': 3, 'kdrama-producer': 2, 'startup-founder': 2 }
      },
      {
        text: "🌱 Stable base but room for creativity",
        scores: { 'english-teacher': 2, 'marketing-director': 2, 'medical-coordinator': 2 }
      },
      {
        text: "🎲 High risk, high reward - let's gamble!",
        scores: { 'startup-founder': 3, 'content-creator': 2, 'restaurant-owner': 2 }
      }
    ]
  },
  {
    id: 7,
    question: "What's your Korean language level?",
    options: [
      {
        text: "🇰🇷 Fluent or near-fluent - I got this!",
        scores: { 'corporate-worker': 3, 'marketing-director': 2, 'kdrama-producer': 2 }
      },
      {
        text: "📝 Intermediate - I can survive",
        scores: { 'restaurant-owner': 2, 'beauty-expert': 2, 'tour-guide': 1 }
      },
      {
        text: "👋 Basic - hello, thank you, bye!",
        scores: { 'english-teacher': 3, 'content-creator': 2, 'game-developer': 1 }
      },
      {
        text: "🌐 English is fine - international work",
        scores: { 'tech-engineer': 2, 'plastic-surgery-consultant': 3, 'medical-coordinator': 3 }
      }
    ]
  },
  {
    id: 8,
    question: "How do you approach problems?",
    options: [
      {
        text: "🔬 Analytical and data-driven",
        scores: { 'research-scientist': 3, 'tech-engineer': 3, 'marketing-director': 2 }
      },
      {
        text: "🎨 Creative and intuitive solutions",
        scores: { 'content-creator': 3, 'kdrama-producer': 2, 'game-developer': 2 }
      },
      {
        text: "🤝 Talk it out with people",
        scores: { 'tour-guide': 2, 'kpop-manager': 2, 'medical-coordinator': 2 }
      },
      {
        text: "💪 Roll up sleeves and hustle through",
        scores: { 'restaurant-owner': 3, 'cafe-owner': 2, 'startup-founder': 2 }
      }
    ]
  },
  {
    id: 9,
    question: "Long-term planner or spontaneous?",
    options: [
      {
        text: "📊 I plan everything 5 years ahead",
        scores: { 'corporate-worker': 3, 'tech-engineer': 2, 'research-scientist': 2 }
      },
      {
        text: "🎯 I set goals but stay flexible",
        scores: { 'marketing-director': 3, 'startup-founder': 2, 'medical-coordinator': 2 }
      },
      {
        text: "🌊 I go with the flow",
        scores: { 'tour-guide': 3, 'content-creator': 2, 'cafe-owner': 1 }
      },
      {
        text: "⚡ YOLO - spontaneous decisions!",
        scores: { 'kpop-manager': 2, 'kdrama-producer': 2, 'beauty-expert': 2 }
      }
    ]
  },
  {
    id: 10,
    question: "What's your ideal working hours?",
    options: [
      {
        text: "⏰ Regular 9-6 schedule",
        scores: { 'corporate-worker': 3, 'english-teacher': 3, 'research-scientist': 2 }
      },
      {
        text: "🌙 Night owl - I peak at midnight",
        scores: { 'game-developer': 3, 'content-creator': 2, 'startup-founder': 2 }
      },
      {
        text: "📱 Flexible - I work on my terms",
        scores: { 'cafe-owner': 2, 'tour-guide': 2, 'beauty-expert': 2 }
      },
      {
        text: "💼 Whatever it takes - I'm dedicated",
        scores: { 'kpop-manager': 3, 'kdrama-producer': 3, 'marketing-director': 2 }
      }
    ]
  }
];
