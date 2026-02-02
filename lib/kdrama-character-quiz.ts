// Types
export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    scores: { [key: string]: number };
  }[];
}

export interface CharacterResult {
  id: string;
  name: string;
  nameKo: string;
  emoji: string;
  archetype: string;
  description: string;
  personality: string[];
  loveStyle: string;
  representativeDramas: {
    title: string;
    year: number;
    character: string;
  }[];
  famousQuote: string;
  strengths: string[];
  challenges: string[];
  idealPartner: string;
  careerPath: string;
}

// Character Types
export const characterTypes: { [key: string]: CharacterResult } = {
  chaebol: {
    id: 'chaebol',
    name: 'The Chaebol Heir',
    nameKo: '재벌 2세',
    emoji: '👔',
    archetype: 'Wealthy & Powerful',
    description: 'You are sophisticated, confident, and accustomed to luxury. Behind your cold exterior lies a warm heart waiting for the right person to discover it.',
    personality: ['Confident', 'Ambitious', 'Protective', 'Reserved', 'Loyal'],
    loveStyle: 'You fall slowly but deeply. Once committed, you protect your loved ones fiercely and spare no expense to make them happy.',
    representativeDramas: [
      { title: 'The Heirs', year: 2013, character: 'Kim Tan' },
      { title: 'Boys Over Flowers', year: 2009, character: 'Gu Jun-pyo' },
      { title: 'What\'s Wrong with Secretary Kim', year: 2018, character: 'Lee Young-joon' }
    ],
    famousQuote: '"I can buy everything except your heart, but that\'s the only thing I want."',
    strengths: ['Leadership', 'Resourceful', 'Determined', 'Protective'],
    challenges: ['Pride', 'Trust issues', 'Workaholic tendencies'],
    idealPartner: 'Someone genuine who sees beyond your wealth',
    careerPath: 'Business executive, Entrepreneur, Investor'
  },
  prosecutor: {
    id: 'prosecutor',
    name: 'The Righteous Prosecutor',
    nameKo: '정의로운 검사',
    emoji: '⚖️',
    archetype: 'Justice Seeker',
    description: 'You have an unwavering sense of justice and fight for what\'s right. Your dedication to truth makes you both admirable and intimidating.',
    personality: ['Principled', 'Intelligent', 'Determined', 'Straightforward', 'Brave'],
    loveStyle: 'You approach love logically but can be surprisingly passionate. You value honesty and integrity above all.',
    representativeDramas: [
      { title: 'While You Were Sleeping', year: 2017, character: 'Jung Jae-chan' },
      { title: 'Suspicious Partner', year: 2017, character: 'Noh Ji-wook' },
      { title: 'Stranger', year: 2017, character: 'Hwang Si-mok' }
    ],
    famousQuote: '"I will find the truth, no matter how long it takes."',
    strengths: ['Analytical', 'Dedicated', 'Courageous', 'Fair-minded'],
    challenges: ['Stubborn', 'Workaholic', 'Difficulty compromising'],
    idealPartner: 'Someone who shares your values and challenges you intellectually',
    careerPath: 'Lawyer, Judge, Human rights activist'
  },
  doctor: {
    id: 'doctor',
    name: 'The Caring Doctor',
    nameKo: '따뜻한 의사',
    emoji: '👨‍⚕️',
    archetype: 'Healer & Protector',
    description: 'You are compassionate, skilled, and dedicated to helping others. Your gentle demeanor hides incredible strength and resilience.',
    personality: ['Empathetic', 'Patient', 'Responsible', 'Calm', 'Caring'],
    loveStyle: 'You show love through actions rather than words. You nurture and care for your partner with unwavering dedication.',
    representativeDramas: [
      { title: 'Doctor Stranger', year: 2014, character: 'Park Hoon' },
      { title: 'Hospital Playlist', year: 2020, character: 'Ik-jun' },
      { title: 'Descendants of the Sun', year: 2016, character: 'Kang Mo-yeon' }
    ],
    famousQuote: '"Saving lives isn\'t just my job, it\'s who I am."',
    strengths: ['Compassionate', 'Skilled', 'Reliable', 'Patient'],
    challenges: ['Emotional burden', 'Putting others first', 'Difficulty expressing feelings'],
    idealPartner: 'Someone who understands your demanding schedule and shares your compassion',
    careerPath: 'Medical professional, Researcher, Healthcare administrator'
  },
  chef: {
    id: 'chef',
    name: 'The Passionate Chef',
    nameKo: '열정적인 요리사',
    emoji: '👨‍🍳',
    archetype: 'Creative Artist',
    description: 'You express yourself through creativity and have a passion for bringing joy to others. Your warmth and authenticity draw people to you.',
    personality: ['Creative', 'Passionate', 'Warm', 'Perfectionist', 'Generous'],
    loveStyle: 'You express love through thoughtful gestures and creating special moments. Food is your love language.',
    representativeDramas: [
      { title: 'Pasta', year: 2010, character: 'Choi Hyun-wook' },
      { title: 'Oh My Ghost', year: 2015, character: 'Kang Sun-woo' },
      { title: 'Wok of Love', year: 2018, character: 'Seo Poong' }
    ],
    famousQuote: '"Every dish I make carries my heart in it."',
    strengths: ['Creative', 'Passionate', 'Attentive', 'Warm-hearted'],
    challenges: ['Perfectionism', 'Mood swings', 'Impulsive decisions'],
    idealPartner: 'Someone who appreciates your passion and supports your dreams',
    careerPath: 'Chef, Restaurant owner, Food critic'
  },
  idol: {
    id: 'idol',
    name: 'The K-Pop Idol',
    nameKo: '아이돌 스타',
    emoji: '🎤',
    archetype: 'Charming Performer',
    description: 'You shine on stage and captivate everyone with your talent. Behind the glamour, you work incredibly hard and value genuine connections.',
    personality: ['Charismatic', 'Hardworking', 'Friendly', 'Talented', 'Adaptable'],
    loveStyle: 'You seek someone who sees the real you beneath the celebrity persona. You value privacy and authenticity in relationships.',
    representativeDramas: [
      { title: 'Dream High', year: 2011, character: 'Go Hye-mi' },
      { title: 'The Producers', year: 2015, character: 'Cindy' },
      { title: 'Imitation', year: 2021, character: 'Ma-ha' }
    ],
    famousQuote: '"The stage is where I feel most alive."',
    strengths: ['Talented', 'Disciplined', 'Charming', 'Resilient'],
    challenges: ['Public scrutiny', 'Privacy issues', 'Maintaining authenticity'],
    idealPartner: 'Someone who understands your career demands and loves you for who you are',
    careerPath: 'Entertainer, Performer, Content creator'
  },
  student: {
    id: 'student',
    name: 'The Brilliant Student',
    nameKo: '우등생',
    emoji: '📚',
    archetype: 'Ambitious Scholar',
    description: 'You are intelligent, driven, and always striving to improve. Your determination and bright future make you stand out.',
    personality: ['Smart', 'Ambitious', 'Curious', 'Competitive', 'Responsible'],
    loveStyle: 'You approach love cautiously, balancing it with your goals. When you fall, you do so thoughtfully and deeply.',
    representativeDramas: [
      { title: 'Sky Castle', year: 2018, character: 'Kang Ye-seo' },
      { title: 'School 2017', year: 2017, character: 'Hyun Tae-woon' },
      { title: 'Reply 1988', year: 2015, character: 'Sung Duk-sun' }
    ],
    famousQuote: '"My dreams are bigger than any obstacle."',
    strengths: ['Intelligent', 'Disciplined', 'Goal-oriented', 'Analytical'],
    challenges: ['Pressure', 'Perfectionism', 'Difficulty relaxing'],
    idealPartner: 'Someone who motivates you and helps you balance work and life',
    careerPath: 'Academic, Researcher, Professional in any field'
  },
  detective: {
    id: 'detective',
    name: 'The Sharp Detective',
    nameKo: '명탐정',
    emoji: '🔍',
    archetype: 'Truth Finder',
    description: 'You have a keen eye for detail and can read people effortlessly. Your intuition and logic make you excellent at solving mysteries.',
    personality: ['Observant', 'Logical', 'Intuitive', 'Persistent', 'Brave'],
    loveStyle: 'You analyze relationships carefully but once you trust someone, you\'re all in. You protect your loved ones fiercely.',
    representativeDramas: [
      { title: 'Signal', year: 2016, character: 'Park Hae-young' },
      { title: 'Tunnel', year: 2017, character: 'Park Gwang-ho' },
      { title: 'Partners for Justice', year: 2018, character: 'Baek Beom' }
    ],
    famousQuote: '"Every clue tells a story, you just need to listen."',
    strengths: ['Analytical', 'Perceptive', 'Determined', 'Courageous'],
    challenges: ['Overthinking', 'Trust issues', 'Obsessive tendencies'],
    idealPartner: 'Someone patient who accepts your quirks and values truth',
    careerPath: 'Detective, Investigator, Criminal analyst'
  },
  reporter: {
    id: 'reporter',
    name: 'The Fearless Reporter',
    nameKo: '기자',
    emoji: '📰',
    archetype: 'Truth Teller',
    description: 'You are brave, curious, and committed to exposing the truth. Your tenacity and quick thinking help you navigate dangerous situations.',
    personality: ['Brave', 'Curious', 'Quick-thinking', 'Ethical', 'Persistent'],
    loveStyle: 'You seek a partner who can keep up with your fast-paced life and supports your mission for truth.',
    representativeDramas: [
      { title: 'Pinocchio', year: 2014, character: 'Choi In-ha' },
      { title: 'Healer', year: 2014, character: 'Chae Young-shin' },
      { title: 'Chicago Typewriter', year: 2017, character: 'Jeon Seol' }
    ],
    famousQuote: '"The truth deserves to be told, no matter the cost."',
    strengths: ['Courageous', 'Resourceful', 'Ethical', 'Adaptable'],
    challenges: ['Risky behavior', 'Workaholic', 'Difficulty trusting'],
    idealPartner: 'Someone who respects your independence and shares your values',
    careerPath: 'Journalist, News anchor, Investigative reporter'
  },
  designer: {
    id: 'designer',
    name: 'The Creative Designer',
    nameKo: '디자이너',
    emoji: '🎨',
    archetype: 'Artistic Visionary',
    description: 'You see beauty in everything and have a unique artistic vision. Your creativity and style set you apart from others.',
    personality: ['Creative', 'Stylish', 'Sensitive', 'Passionate', 'Independent'],
    loveStyle: 'You express love through aesthetic gestures and thoughtful details. You seek beauty and meaning in relationships.',
    representativeDramas: [
      { title: 'The King: Eternal Monarch', year: 2020, character: 'Luna' },
      { title: 'Touch Your Heart', year: 2019, character: 'Oh Yoon-seo' },
      { title: 'Her Private Life', year: 2019, character: 'Sung Duk-mi' }
    ],
    famousQuote: '"Design is not just what it looks like, it\'s how it makes you feel."',
    strengths: ['Creative', 'Detail-oriented', 'Innovative', 'Expressive'],
    challenges: ['Moody', 'Overly critical', 'Insecure'],
    idealPartner: 'Someone who appreciates your artistry and supports your creative journey',
    careerPath: 'Fashion designer, Graphic designer, Art director'
  },
  athlete: {
    id: 'athlete',
    name: 'The Determined Athlete',
    nameKo: '운동선수',
    emoji: '🏃',
    archetype: 'Competitor',
    description: 'You are disciplined, strong, and never give up. Your determination and competitive spirit inspire everyone around you.',
    personality: ['Determined', 'Disciplined', 'Competitive', 'Strong', 'Loyal'],
    loveStyle: 'You approach love with the same dedication as your sport. You\'re loyal, protective, and surprisingly romantic.',
    representativeDramas: [
      { title: 'Fight For My Way', year: 2017, character: 'Ko Dong-man' },
      { title: 'Weightlifting Fairy Kim Bok-joo', year: 2016, character: 'Kim Bok-joo' },
      { title: 'Run On', year: 2020, character: 'Ki Seon-gyeom' }
    ],
    famousQuote: '"Winning isn\'t everything, but wanting to win is."',
    strengths: ['Disciplined', 'Resilient', 'Motivating', 'Loyal'],
    challenges: ['Stubborn', 'Overly competitive', 'Difficulty expressing emotions'],
    idealPartner: 'Someone who supports your dreams and matches your energy',
    careerPath: 'Professional athlete, Coach, Sports analyst'
  },
  teacher: {
    id: 'teacher',
    name: 'The Inspiring Teacher',
    nameKo: '선생님',
    emoji: '👨‍🏫',
    archetype: 'Mentor & Guide',
    description: 'You are patient, wise, and dedicated to helping others grow. Your kindness and wisdom make you a role model.',
    personality: ['Patient', 'Wise', 'Caring', 'Inspiring', 'Dedicated'],
    loveStyle: 'You nurture relationships with patience and care. You believe in growth and support your partner\'s development.',
    representativeDramas: [
      { title: 'School 2013', year: 2012, character: 'Jung In-jae' },
      { title: 'Black Dog', year: 2019, character: 'Go Ha-neul' },
      { title: 'Mr. Sunshine', year: 2018, character: 'Go Ae-shin' }
    ],
    famousQuote: '"Teaching is not just a profession, it\'s a calling."',
    strengths: ['Patient', 'Wise', 'Supportive', 'Empathetic'],
    challenges: ['Overgiving', 'Difficulty setting boundaries', 'Self-sacrifice'],
    idealPartner: 'Someone who values your wisdom and gives back to you',
    careerPath: 'Educator, Counselor, Life coach'
  },
  entrepreneur: {
    id: 'entrepreneur',
    name: 'The Bold Entrepreneur',
    nameKo: '사업가',
    emoji: '💼',
    archetype: 'Risk Taker',
    description: 'You are bold, innovative, and not afraid to take risks. Your entrepreneurial spirit and vision set you apart.',
    personality: ['Bold', 'Innovative', 'Confident', 'Adaptable', 'Strategic'],
    loveStyle: 'You seek a partner who can match your ambition and be part of your journey. You balance work and love creatively.',
    representativeDramas: [
      { title: 'Start-Up', year: 2020, character: 'Seo Dal-mi' },
      { title: 'Itaewon Class', year: 2020, character: 'Park Sae-ro-yi' },
      { title: 'Record of Youth', year: 2020, character: 'Sa Hye-jun' }
    ],
    famousQuote: '"Success is not final, failure is not fatal: it is the courage to continue that counts."',
    strengths: ['Innovative', 'Resilient', 'Strategic', 'Confident'],
    challenges: ['Risky decisions', 'Workaholic', 'Impatient'],
    idealPartner: 'Someone who believes in your vision and supports your ambitions',
    careerPath: 'Business owner, Startup founder, Innovator'
  }
};

// Quiz Questions
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'How do you handle conflict?',
    options: [
      {
        text: 'Face it head-on with logic and evidence',
        scores: { prosecutor: 3, detective: 2, reporter: 2, entrepreneur: 1 }
      },
      {
        text: 'Try to understand all perspectives and mediate',
        scores: { doctor: 3, teacher: 3, designer: 1, student: 1 }
      },
      {
        text: 'Use my influence and resources to resolve it',
        scores: { chaebol: 3, entrepreneur: 2, athlete: 1 }
      },
      {
        text: 'Express my feelings through creative means',
        scores: { chef: 2, idol: 2, designer: 3, reporter: 1 }
      }
    ]
  },
  {
    id: 2,
    question: 'What\'s your ideal weekend activity?',
    options: [
      {
        text: 'Intense workout or sports competition',
        scores: { athlete: 3, entrepreneur: 1, prosecutor: 1 }
      },
      {
        text: 'Working on a passion project or learning something new',
        scores: { student: 3, designer: 2, chef: 2, detective: 1 }
      },
      {
        text: 'Networking event or business meeting',
        scores: { chaebol: 3, entrepreneur: 2, reporter: 1 }
      },
      {
        text: 'Quiet time helping others or volunteering',
        scores: { doctor: 3, teacher: 3, idol: 1 }
      }
    ]
  },
  {
    id: 3,
    question: 'How do you show love to someone?',
    options: [
      {
        text: 'Through grand gestures and expensive gifts',
        scores: { chaebol: 3, idol: 1, entrepreneur: 1 }
      },
      {
        text: 'By being there when they need me most',
        scores: { doctor: 3, teacher: 2, athlete: 2 }
      },
      {
        text: 'Through creative and thoughtful surprises',
        scores: { chef: 3, designer: 3, idol: 1 }
      },
      {
        text: 'By solving their problems and protecting them',
        scores: { prosecutor: 3, detective: 2, reporter: 1, student: 1 }
      }
    ]
  },
  {
    id: 4,
    question: 'What\'s your biggest strength?',
    options: [
      {
        text: 'My intelligence and analytical mind',
        scores: { student: 3, detective: 3, prosecutor: 2 }
      },
      {
        text: 'My creativity and unique perspective',
        scores: { chef: 3, designer: 3, idol: 2 }
      },
      {
        text: 'My determination and never-give-up attitude',
        scores: { athlete: 3, entrepreneur: 2, reporter: 2 }
      },
      {
        text: 'My empathy and ability to connect with others',
        scores: { doctor: 3, teacher: 3, chaebol: 1 }
      }
    ]
  },
  {
    id: 5,
    question: 'What motivates you most?',
    options: [
      {
        text: 'Success and achievement',
        scores: { chaebol: 3, student: 2, entrepreneur: 2, athlete: 1 }
      },
      {
        text: 'Helping others and making a difference',
        scores: { doctor: 3, teacher: 3, prosecutor: 1 }
      },
      {
        text: 'Creating something beautiful or meaningful',
        scores: { chef: 3, designer: 3, idol: 2 }
      },
      {
        text: 'Discovering truth and solving mysteries',
        scores: { detective: 3, reporter: 3, prosecutor: 1 }
      }
    ]
  },
  {
    id: 6,
    question: 'How do you deal with stress?',
    options: [
      {
        text: 'Work harder until I overcome it',
        scores: { entrepreneur: 3, student: 2, athlete: 2 }
      },
      {
        text: 'Talk to someone I trust',
        scores: { idol: 3, teacher: 2, doctor: 1 }
      },
      {
        text: 'Channel it into creative expression',
        scores: { chef: 3, designer: 3, reporter: 1 }
      },
      {
        text: 'Analyze it logically and make a plan',
        scores: { prosecutor: 3, detective: 3, chaebol: 1 }
      }
    ]
  },
  {
    id: 7,
    question: 'What\'s your approach to romance?',
    options: [
      {
        text: 'Cautious and thoughtful, taking time to open up',
        scores: { student: 3, detective: 2, chaebol: 2 }
      },
      {
        text: 'Passionate and expressive from the start',
        scores: { chef: 3, idol: 2, designer: 2 }
      },
      {
        text: 'Protective and devoted once committed',
        scores: { athlete: 3, prosecutor: 2, doctor: 2 }
      },
      {
        text: 'Balanced between independence and togetherness',
        scores: { entrepreneur: 3, reporter: 2, teacher: 1 }
      }
    ]
  },
  {
    id: 8,
    question: 'What\'s your ideal work environment?',
    options: [
      {
        text: 'High-stakes, fast-paced with room to lead',
        scores: { chaebol: 3, prosecutor: 2, entrepreneur: 2 }
      },
      {
        text: 'Collaborative space where I can help others',
        scores: { teacher: 3, doctor: 3, idol: 1 }
      },
      {
        text: 'Creative studio where I can express myself',
        scores: { chef: 3, designer: 3, reporter: 1 }
      },
      {
        text: 'Independent setting where I can investigate',
        scores: { detective: 3, student: 2, athlete: 1 }
      }
    ]
  },
  {
    id: 9,
    question: 'What\'s your biggest fear?',
    options: [
      {
        text: 'Failure and not living up to expectations',
        scores: { student: 3, athlete: 2, chaebol: 2 }
      },
      {
        text: 'Losing someone I care about',
        scores: { doctor: 3, teacher: 2, idol: 2 }
      },
      {
        text: 'Not being able to express myself',
        scores: { chef: 3, designer: 3, reporter: 1 }
      },
      {
        text: 'Not finding the truth or being deceived',
        scores: { detective: 3, prosecutor: 3, entrepreneur: 1 }
      }
    ]
  },
  {
    id: 10,
    question: 'How do you make important decisions?',
    options: [
      {
        text: 'Based on facts, logic, and careful analysis',
        scores: { prosecutor: 3, detective: 3, student: 2 }
      },
      {
        text: 'Following my intuition and gut feeling',
        scores: { designer: 3, chef: 2, idol: 2 }
      },
      {
        text: 'Considering the impact on others',
        scores: { doctor: 3, teacher: 3, reporter: 1 }
      },
      {
        text: 'Weighing risks versus potential rewards',
        scores: { entrepreneur: 3, chaebol: 2, athlete: 1 }
      }
    ]
  }
];

// Calculate Result
export function calculateCharacterType(answers: number[][]): CharacterResult {
  const scores: { [key: string]: number } = {};
  
  // Initialize scores
  Object.keys(characterTypes).forEach(type => {
    scores[type] = 0;
  });
  
  // Calculate scores
  answers.forEach((answer, questionIndex) => {
    const question = quizQuestions[questionIndex];
    answer.forEach(optionIndex => {
      const option = question.options[optionIndex];
      Object.entries(option.scores).forEach(([type, score]) => {
        scores[type] += score;
      });
    });
  });
  
  // Find highest score
  let maxScore = 0;
  let resultType = 'chaebol';
  
  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      resultType = type;
    }
  });
  
  return characterTypes[resultType];
}
