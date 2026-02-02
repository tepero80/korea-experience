// Types
export interface Person {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  bloodType: 'A' | 'B' | 'O' | 'AB';
}

export interface CompatibilityResult {
  score: number;
  grade: string;
  emoji: string;
  zodiacMatch: {
    person1Zodiac: string;
    person2Zodiac: string;
    compatibility: string;
  };
  bloodTypeMatch: {
    compatibility: string;
    percentage: number;
  };
  strengths: string[];
  weaknesses: string[];
  advice: string;
  coupleNickname: string;
  coupleNicknameKo: string;
}

// Korean Zodiac Signs (띠)
const zodiacSigns = [
  { korean: '쥐띠', english: 'Rat', years: [1960, 1972, 1984, 1996, 2008, 2020] },
  { korean: '소띠', english: 'Ox', years: [1961, 1973, 1985, 1997, 2009, 2021] },
  { korean: '호랑이띠', english: 'Tiger', years: [1962, 1974, 1986, 1998, 2010, 2022] },
  { korean: '토끼띠', english: 'Rabbit', years: [1963, 1975, 1987, 1999, 2011, 2023] },
  { korean: '용띠', english: 'Dragon', years: [1964, 1976, 1988, 2000, 2012, 2024] },
  { korean: '뱀띠', english: 'Snake', years: [1965, 1977, 1989, 2001, 2013, 2025] },
  { korean: '말띠', english: 'Horse', years: [1966, 1978, 1990, 2002, 2014, 2026] },
  { korean: '양띠', english: 'Sheep', years: [1967, 1979, 1991, 2003, 2015, 2027] },
  { korean: '원숭이띠', english: 'Monkey', years: [1968, 1980, 1992, 2004, 2016, 2028] },
  { korean: '닭띠', english: 'Rooster', years: [1969, 1981, 1993, 2005, 2017, 2029] },
  { korean: '개띠', english: 'Dog', years: [1970, 1982, 1994, 2006, 2018, 2030] },
  { korean: '돼지띠', english: 'Pig', years: [1971, 1983, 1995, 2007, 2019, 2031] }
];

// Zodiac Compatibility Matrix (1-10 scale)
const zodiacCompatibility: { [key: string]: { [key: string]: number } } = {
  'Rat': { 'Rat': 7, 'Ox': 9, 'Tiger': 5, 'Rabbit': 6, 'Dragon': 9, 'Snake': 7, 'Horse': 4, 'Sheep': 5, 'Monkey': 9, 'Rooster': 6, 'Dog': 5, 'Pig': 7 },
  'Ox': { 'Rat': 9, 'Ox': 6, 'Tiger': 4, 'Rabbit': 7, 'Dragon': 7, 'Snake': 9, 'Horse': 5, 'Sheep': 4, 'Monkey': 6, 'Rooster': 9, 'Dog': 5, 'Pig': 7 },
  'Tiger': { 'Rat': 5, 'Ox': 4, 'Tiger': 6, 'Rabbit': 7, 'Dragon': 6, 'Snake': 4, 'Horse': 9, 'Sheep': 7, 'Monkey': 5, 'Rooster': 5, 'Dog': 9, 'Pig': 8 },
  'Rabbit': { 'Rat': 6, 'Ox': 7, 'Tiger': 7, 'Rabbit': 7, 'Dragon': 5, 'Snake': 7, 'Horse': 7, 'Sheep': 9, 'Monkey': 6, 'Rooster': 4, 'Dog': 8, 'Pig': 9 },
  'Dragon': { 'Rat': 9, 'Ox': 7, 'Tiger': 6, 'Rabbit': 5, 'Dragon': 6, 'Snake': 8, 'Horse': 7, 'Sheep': 6, 'Monkey': 9, 'Rooster': 9, 'Dog': 4, 'Pig': 7 },
  'Snake': { 'Rat': 7, 'Ox': 9, 'Tiger': 4, 'Rabbit': 7, 'Dragon': 8, 'Snake': 7, 'Horse': 6, 'Sheep': 7, 'Monkey': 8, 'Rooster': 9, 'Dog': 6, 'Pig': 5 },
  'Horse': { 'Rat': 4, 'Ox': 5, 'Tiger': 9, 'Rabbit': 7, 'Dragon': 7, 'Snake': 6, 'Horse': 6, 'Sheep': 8, 'Monkey': 6, 'Rooster': 6, 'Dog': 8, 'Pig': 7 },
  'Sheep': { 'Rat': 5, 'Ox': 4, 'Tiger': 7, 'Rabbit': 9, 'Dragon': 6, 'Snake': 7, 'Horse': 8, 'Sheep': 7, 'Monkey': 7, 'Rooster': 6, 'Dog': 7, 'Pig': 9 },
  'Monkey': { 'Rat': 9, 'Ox': 6, 'Tiger': 5, 'Rabbit': 6, 'Dragon': 9, 'Snake': 8, 'Horse': 6, 'Sheep': 7, 'Monkey': 7, 'Rooster': 7, 'Dog': 6, 'Pig': 7 },
  'Rooster': { 'Rat': 6, 'Ox': 9, 'Tiger': 5, 'Rabbit': 4, 'Dragon': 9, 'Snake': 9, 'Horse': 6, 'Sheep': 6, 'Monkey': 7, 'Rooster': 5, 'Dog': 4, 'Pig': 7 },
  'Dog': { 'Rat': 5, 'Ox': 5, 'Tiger': 9, 'Rabbit': 8, 'Dragon': 4, 'Snake': 6, 'Horse': 8, 'Sheep': 7, 'Monkey': 6, 'Rooster': 4, 'Dog': 6, 'Pig': 8 },
  'Pig': { 'Rat': 7, 'Ox': 7, 'Tiger': 8, 'Rabbit': 9, 'Dragon': 7, 'Snake': 5, 'Horse': 7, 'Sheep': 9, 'Monkey': 7, 'Rooster': 7, 'Dog': 8, 'Pig': 7 }
};

// Blood Type Compatibility
const bloodTypeCompatibility: { [key: string]: { [key: string]: number } } = {
  'A': { 'A': 85, 'B': 65, 'O': 90, 'AB': 75 },
  'B': { 'A': 65, 'B': 80, 'O': 70, 'AB': 90 },
  'O': { 'A': 90, 'B': 70, 'O': 75, 'AB': 80 },
  'AB': { 'A': 75, 'B': 90, 'O': 80, 'AB': 85 }
};

// Helper Functions
function getZodiacSign(year: number): { korean: string; english: string } {
  const zodiac = zodiacSigns.find(z => z.years.includes(year));
  if (!zodiac) {
    // Calculate for years not in the array
    const baseYear = 1960;
    const index = (year - baseYear) % 12;
    const adjustedIndex = index < 0 ? index + 12 : index;
    return { korean: zodiacSigns[adjustedIndex].korean, english: zodiacSigns[adjustedIndex].english };
  }
  return { korean: zodiac.korean, english: zodiac.english };
}

function calculateBirthNumberCompatibility(person1: Person, person2: Person): number {
  // Simple numerology: sum all digits and compare
  const sum1 = String(person1.birthYear + person1.birthMonth + person1.birthDay).split('').reduce((a, b) => a + parseInt(b), 0);
  const sum2 = String(person2.birthYear + person2.birthMonth + person2.birthDay).split('').reduce((a, b) => a + parseInt(b), 0);
  
  const diff = Math.abs(sum1 - sum2);
  return Math.max(50, 100 - (diff * 5));
}

function generateCoupleNickname(person1: Person, person2: Person): { english: string; korean: string } {
  const prefixes = ['Sweet', 'Love', 'Heart', 'Dream', 'Star', 'Moon', 'Sun', 'Sky'];
  const suffixes = ['Birds', 'Hearts', 'Souls', 'Lights', 'Stars', 'Angels', 'Wings', 'Gems'];
  const koreanPrefixes = ['달콤한', '사랑의', '하트', '드림', '별빛', '달빛', '햇살', '하늘'];
  const koreanSuffixes = ['커플', '하트', '연인', '별', '천사', '날개', '보석', '둥지'];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const koreanPrefix = koreanPrefixes[Math.floor(Math.random() * koreanPrefixes.length)];
  const koreanSuffix = koreanSuffixes[Math.floor(Math.random() * koreanSuffixes.length)];
  
  // Combine first letters of names
  const initial1 = person1.name.charAt(0).toUpperCase();
  const initial2 = person2.name.charAt(0).toUpperCase();
  
  return {
    english: `${prefix}${initial1}${initial2}`,
    korean: `${koreanPrefix}${koreanSuffix}`
  };
}

// Main Calculation Function
export function calculateLoveCompatibility(person1: Person, person2: Person): CompatibilityResult {
  // 1. Zodiac Compatibility (40% weight)
  const zodiac1 = getZodiacSign(person1.birthYear);
  const zodiac2 = getZodiacSign(person2.birthYear);
  const zodiacScore = (zodiacCompatibility[zodiac1.english][zodiac2.english] / 10) * 40;
  
  // 2. Blood Type Compatibility (30% weight)
  const bloodScore = (bloodTypeCompatibility[person1.bloodType][person2.bloodType] / 100) * 30;
  
  // 3. Birth Number Compatibility (20% weight)
  const birthScore = (calculateBirthNumberCompatibility(person1, person2) / 100) * 20;
  
  // 4. Random factor for variety (10% weight)
  const randomFactor = (Math.random() * 20 + 80) / 100 * 10;
  
  // Total Score
  const totalScore = Math.round(zodiacScore + bloodScore + birthScore + randomFactor);
  
  // Grade and Emoji
  let grade = '';
  let emoji = '';
  if (totalScore >= 90) {
    grade = 'Perfect Match! 💯';
    emoji = '💕💕💕';
  } else if (totalScore >= 80) {
    grade = 'Excellent Match! ⭐';
    emoji = '💕💕';
  } else if (totalScore >= 70) {
    grade = 'Great Match! 😊';
    emoji = '💕';
  } else if (totalScore >= 60) {
    grade = 'Good Match 👍';
    emoji = '💖';
  } else if (totalScore >= 50) {
    grade = 'Fair Match 🤔';
    emoji = '💗';
  } else {
    grade = 'Challenging Match 💪';
    emoji = '💔';
  }
  
  // Zodiac Match Description
  const zodiacCompatibilityScore = zodiacCompatibility[zodiac1.english][zodiac2.english];
  let zodiacCompat = '';
  if (zodiacCompatibilityScore >= 9) {
    zodiacCompat = 'Your zodiac signs are highly compatible! You share similar values and life goals.';
  } else if (zodiacCompatibilityScore >= 7) {
    zodiacCompat = 'Your zodiac signs complement each other well. You bring balance to the relationship.';
  } else if (zodiacCompatibilityScore >= 5) {
    zodiacCompat = 'Your zodiac signs have moderate compatibility. Understanding and patience are key.';
  } else {
    zodiacCompat = 'Your zodiac signs present some challenges, but love can overcome differences with effort.';
  }
  
  // Blood Type Compatibility Description
  const bloodCompat = bloodTypeCompatibility[person1.bloodType][person2.bloodType];
  let bloodCompatDesc = '';
  if (bloodCompat >= 85) {
    bloodCompatDesc = 'Your blood types are very compatible! You naturally understand each other.';
  } else if (bloodCompat >= 70) {
    bloodCompatDesc = 'Your blood types work well together with good communication.';
  } else {
    bloodCompatDesc = 'Your blood types suggest different personalities, which can be complementary.';
  }
  
  // Strengths (based on score)
  const strengthsOptions = [
    'Deep emotional connection',
    'Strong communication skills',
    'Shared values and goals',
    'Great sense of humor together',
    'Supportive of each other\'s dreams',
    'Natural chemistry and attraction',
    'Ability to resolve conflicts peacefully',
    'Mutual respect and trust',
    'Adventurous spirit as a couple',
    'Balanced giving and receiving'
  ];
  
  const strengths = [];
  const numStrengths = totalScore >= 80 ? 5 : totalScore >= 60 ? 4 : 3;
  for (let i = 0; i < numStrengths; i++) {
    strengths.push(strengthsOptions[Math.floor(Math.random() * strengthsOptions.length)]);
  }
  
  // Weaknesses (based on score)
  const weaknessesOptions = [
    'May need to work on communication during stress',
    'Different approaches to problem-solving',
    'Occasional misunderstandings due to different backgrounds',
    'Need to balance independence and togetherness',
    'May have different social needs',
    'Financial priorities might differ',
    'Different energy levels at times',
    'Need to compromise on lifestyle choices'
  ];
  
  const weaknesses = [];
  const numWeaknesses = totalScore >= 80 ? 2 : totalScore >= 60 ? 3 : 4;
  for (let i = 0; i < numWeaknesses; i++) {
    weaknesses.push(weaknessesOptions[Math.floor(Math.random() * weaknessesOptions.length)]);
  }
  
  // Advice
  let advice = '';
  if (totalScore >= 80) {
    advice = 'You have an excellent foundation! Continue nurturing your relationship with open communication, quality time together, and never take each other for granted. Keep the romance alive with small gestures of love.';
  } else if (totalScore >= 60) {
    advice = 'You have a solid relationship with room to grow. Focus on understanding each other\'s differences and turning them into strengths. Regular date nights and honest conversations will strengthen your bond.';
  } else {
    advice = 'Every relationship takes work, and yours may need extra effort. Don\'t be discouraged! Focus on building trust, improving communication, and finding common ground. Consider couples activities to strengthen your connection.';
  }
  
  // Generate Couple Nickname
  const nickname = generateCoupleNickname(person1, person2);
  
  return {
    score: totalScore,
    grade,
    emoji,
    zodiacMatch: {
      person1Zodiac: `${zodiac1.english} (${zodiac1.korean})`,
      person2Zodiac: `${zodiac2.english} (${zodiac2.korean})`,
      compatibility: zodiacCompat
    },
    bloodTypeMatch: {
      compatibility: bloodCompatDesc,
      percentage: bloodCompat
    },
    strengths: [...new Set(strengths)].slice(0, numStrengths),
    weaknesses: [...new Set(weaknesses)].slice(0, numWeaknesses),
    advice,
    coupleNickname: nickname.english,
    coupleNicknameKo: nickname.korean
  };
}
