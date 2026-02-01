// Korean Age Calculator - Logic and Utilities

export interface KoreanAgeResult {
  internationalAge: number; // 만 나이
  koreanAge: number; // 한국식 나이 (세는 나이)
  yearAge: number; // 연 나이
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  zodiacSign: ZodiacSign;
  explanation: string;
}

export interface ZodiacSign {
  korean: string;
  english: string;
  emoji: string;
  years: number[]; // Example years for this zodiac
  personality: string;
  luckyColor: string;
  compatibility: string[];
}

// 12지신 (Chinese Zodiac)
export const ZODIAC_SIGNS: { [key: number]: ZodiacSign } = {
  0: {
    korean: '원숭이띠',
    english: 'Monkey',
    emoji: '🐵',
    years: [1980, 1992, 2004, 2016, 2028],
    personality: 'Clever, curious, and mischievous. Quick thinker!',
    luckyColor: 'White, Blue, Gold',
    compatibility: ['Rat', 'Dragon']
  },
  1: {
    korean: '닭띠',
    english: 'Rooster',
    emoji: '🐔',
    years: [1981, 1993, 2005, 2017, 2029],
    personality: 'Confident, hardworking, and honest. Always punctual!',
    luckyColor: 'Gold, Brown, Yellow',
    compatibility: ['Ox', 'Snake']
  },
  2: {
    korean: '개띠',
    english: 'Dog',
    emoji: '🐶',
    years: [1982, 1994, 2006, 2018, 2030],
    personality: 'Loyal, honest, and friendly. Best companion!',
    luckyColor: 'Red, Green, Purple',
    compatibility: ['Rabbit', 'Horse', 'Tiger']
  },
  3: {
    korean: '돼지띠',
    english: 'Pig',
    emoji: '🐷',
    years: [1983, 1995, 2007, 2019, 2031],
    personality: 'Generous, kind, and optimistic. Enjoys good food!',
    luckyColor: 'Yellow, Grey, Brown',
    compatibility: ['Rabbit', 'Goat']
  },
  4: {
    korean: '쥐띠',
    english: 'Rat',
    emoji: '🐭',
    years: [1984, 1996, 2008, 2020, 2032],
    personality: 'Intelligent, adaptable, and quick-witted. Natural leader!',
    luckyColor: 'Blue, Gold, Green',
    compatibility: ['Dragon', 'Monkey']
  },
  5: {
    korean: '소띠',
    english: 'Ox',
    emoji: '🐮',
    years: [1985, 1997, 2009, 2021, 2033],
    personality: 'Diligent, reliable, and strong. Never gives up!',
    luckyColor: 'White, Yellow, Green',
    compatibility: ['Rat', 'Snake', 'Rooster']
  },
  6: {
    korean: '호랑이띠',
    english: 'Tiger',
    emoji: '🐯',
    years: [1986, 1998, 2010, 2022, 2034],
    personality: 'Brave, confident, and competitive. Born leader!',
    luckyColor: 'Blue, Grey, Orange',
    compatibility: ['Horse', 'Dog']
  },
  7: {
    korean: '토끼띠',
    english: 'Rabbit',
    emoji: '🐰',
    years: [1987, 1999, 2011, 2023, 2035],
    personality: 'Gentle, quiet, and elegant. Peace-loving!',
    luckyColor: 'Red, Pink, Purple',
    compatibility: ['Goat', 'Pig', 'Dog']
  },
  8: {
    korean: '용띠',
    english: 'Dragon',
    emoji: '🐲',
    years: [1988, 2000, 2012, 2024, 2036],
    personality: 'Confident, intelligent, and enthusiastic. Most powerful!',
    luckyColor: 'Gold, Silver, Grey',
    compatibility: ['Rat', 'Monkey', 'Rooster']
  },
  9: {
    korean: '뱀띠',
    english: 'Snake',
    emoji: '🐍',
    years: [1989, 2001, 2013, 2025, 2037],
    personality: 'Wise, enigmatic, and intuitive. Deep thinker!',
    luckyColor: 'Black, Red, Yellow',
    compatibility: ['Ox', 'Rooster']
  },
  10: {
    korean: '말띠',
    english: 'Horse',
    emoji: '🐴',
    years: [1990, 2002, 2014, 2026, 2038],
    personality: 'Energetic, independent, and free-spirited. Loves adventure!',
    luckyColor: 'Yellow, Green',
    compatibility: ['Tiger', 'Goat', 'Dog']
  },
  11: {
    korean: '양띠',
    english: 'Goat',
    emoji: '🐐',
    years: [1991, 2003, 2015, 2027, 2039],
    personality: 'Gentle, sympathetic, and artistic. Creative soul!',
    luckyColor: 'Green, Red, Purple',
    compatibility: ['Rabbit', 'Horse', 'Pig']
  }
};

// Calculate Korean Age
export function calculateKoreanAge(birthDate: Date): KoreanAgeResult {
  const today = new Date();
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth() + 1;
  const birthDay = birthDate.getDate();
  
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  // 1. International Age (만 나이) - Western age
  let internationalAge = currentYear - birthYear;
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    internationalAge--;
  }

  // 2. Korean Age (세는 나이) - Traditional Korean age (deprecated since 2023)
  // Born = 1 year old, +1 every January 1st
  const koreanAge = currentYear - birthYear + 1;

  // 3. Year Age (연 나이) - Official Korean age system (used since June 2023)
  // Same as international age but counts year difference
  const yearAge = currentYear - birthYear;

  // Get zodiac sign
  const zodiacIndex = birthYear % 12;
  const zodiacSign = ZODIAC_SIGNS[zodiacIndex];

  // Explanation
  const explanation = `Born in ${birthYear}, you are ${internationalAge} years old internationally (만 나이). ` +
    `In the traditional Korean system (세는 나이), you would be ${koreanAge} years old. ` +
    `As of June 2023, Korea officially uses the international age system!`;

  return {
    internationalAge,
    koreanAge,
    yearAge,
    birthYear,
    birthMonth,
    birthDay,
    zodiacSign,
    explanation
  };
}

// Get zodiac sign by birth year
export function getZodiacSign(year: number): ZodiacSign {
  const index = year % 12;
  return ZODIAC_SIGNS[index];
}

// Format date for display
export function formatBirthDate(year: number, month: number, day: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[month - 1]} ${day}, ${year}`;
}

// Generate share text
export function generateShareText(result: KoreanAgeResult): string {
  return `I'm ${result.internationalAge} years old, but ${result.koreanAge} in Korean age! 🎂 I'm a ${result.zodiacSign.emoji} ${result.zodiacSign.english}!`;
}

// Get age difference explanation
export function getAgeDifferenceExplanation(result: KoreanAgeResult): string {
  const diff = result.koreanAge - result.internationalAge;
  
  if (diff === 1) {
    return "You're 1 year older in the Korean system! This happens when you haven't had your birthday yet this year.";
  } else if (diff === 2) {
    return "You're 2 years older in the Korean system! This is the maximum difference and occurs for babies born late in the year.";
  } else {
    return "Your Korean age matches your international age - you're born early in the year!";
  }
}

// Famous people born in the same year (sample data)
export function getFamousPeople(year: number): string[] {
  const famousPeople: { [key: number]: string[] } = {
    1990: ['Emma Watson', 'Jennifer Lawrence', 'Kristen Stewart'],
    1991: ['Ed Sheeran', 'Tyler, the Creator', 'Emma Roberts'],
    1992: ['Selena Gomez', 'Demi Lovato', 'Miley Cyrus'],
    1993: ['Ariana Grande', 'Victoria Justice', 'Zayn Malik'],
    1994: ['Justin Bieber', 'Harry Styles', 'Dakota Fanning'],
    1995: ['Kendall Jenner', 'Dove Cameron', 'Maisie Williams'],
    1996: ['Zendaya', 'Hailee Steinfeld', 'Ella Purnell'],
    1997: ['Chloë Grace Moretz', 'Bella Thorne', 'Camila Mendes'],
    1998: ['Shawn Mendes', 'Jaden Smith', 'Peyton List'],
    1999: ['Billie Eilish', 'Willow Smith', 'Yara Shahidi'],
    2000: ['Millie Bobby Brown', 'Willow Shields', 'Malu Trevejo'],
    2001: ['Olivia Rodrigo', 'JoJo Siwa', 'Maddie Ziegler'],
    2002: ['Charli D\'Amelio', 'Dixie D\'Amelio', 'Addison Rae']
  };

  return famousPeople[year] || ['Many talented people!'];
}
