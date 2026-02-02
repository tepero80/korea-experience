// Korean Zodiac Daily Fortune - Logic and Data

export interface ZodiacInfo {
  korean: string;
  english: string;
  emoji: string;
  element: string;
  personality: string;
}

export interface FortuneResult {
  zodiac: ZodiacInfo;
  date: string;
  dateFormatted: string;
  overallScore: number;
  loveScore: number;
  wealthScore: number;
  healthScore: number;
  careerScore: number;
  luckyColor: string;
  luckyNumber: number;
  advice: string;
  warning: string;
  detailedFortune: {
    love: string;
    wealth: string;
    health: string;
    career: string;
  };
}

// 12 Korean Zodiac Signs
export const ZODIAC_SIGNS: { [key: number]: ZodiacInfo } = {
  0: {
    korean: '원숭이띠',
    english: 'Monkey',
    emoji: '🐵',
    element: 'Metal',
    personality: 'Clever, curious, and playful'
  },
  1: {
    korean: '닭띠',
    english: 'Rooster',
    emoji: '🐔',
    element: 'Metal',
    personality: 'Confident, hardworking, and punctual'
  },
  2: {
    korean: '개띠',
    english: 'Dog',
    emoji: '🐶',
    element: 'Earth',
    personality: 'Loyal, honest, and friendly'
  },
  3: {
    korean: '돼지띠',
    english: 'Pig',
    emoji: '🐷',
    element: 'Water',
    personality: 'Generous, kind, and optimistic'
  },
  4: {
    korean: '쥐띠',
    english: 'Rat',
    emoji: '🐭',
    element: 'Water',
    personality: 'Intelligent, adaptable, and quick-witted'
  },
  5: {
    korean: '소띠',
    english: 'Ox',
    emoji: '🐮',
    element: 'Earth',
    personality: 'Diligent, reliable, and strong'
  },
  6: {
    korean: '호랑이띠',
    english: 'Tiger',
    emoji: '🐯',
    element: 'Wood',
    personality: 'Brave, confident, and competitive'
  },
  7: {
    korean: '토끼띠',
    english: 'Rabbit',
    emoji: '🐰',
    element: 'Wood',
    personality: 'Gentle, quiet, and elegant'
  },
  8: {
    korean: '용띠',
    english: 'Dragon',
    emoji: '🐉',
    element: 'Earth',
    personality: 'Powerful, enthusiastic, and confident'
  },
  9: {
    korean: '뱀띠',
    english: 'Snake',
    emoji: '🐍',
    element: 'Fire',
    personality: 'Wise, mysterious, and intuitive'
  },
  10: {
    korean: '말띠',
    english: 'Horse',
    emoji: '🐴',
    element: 'Fire',
    personality: 'Energetic, independent, and free-spirited'
  },
  11: {
    korean: '양띠',
    english: 'Sheep',
    emoji: '🐑',
    element: 'Earth',
    personality: 'Calm, gentle, and artistic'
  }
};

// Fortune message pools
const LOVE_MESSAGES = [
  "Romance is in the air! Someone special may notice you today.",
  "Great day for expressing your feelings. Be bold and honest!",
  "Focus on communication with your partner. Listen carefully.",
  "Single? Today is perfect for meeting new people. Go out!",
  "Existing relationships grow stronger. Plan something special.",
  "A small gesture of love will mean a lot today.",
  "Be patient with your loved one. Understanding is key.",
  "Passion runs high today! Enjoy intimate moments.",
  "Old friend may become something more. Keep your heart open.",
  "Today favors reconciliation. Reach out if needed.",
  "Your charm is magnetic today. Use it wisely!",
  "Romantic surprise may come from unexpected direction.",
  "Perfect day for a date night. Plan something memorable!",
  "Trust your instincts in matters of the heart.",
  "Someone from your past may resurface. Handle with care.",
  "Today's energy supports long-term commitment discussions.",
  "Show appreciation to your partner. Small acts count!",
  "Your love life needs attention. Make time for romance.",
  "Chemistry with someone new feels electric. Explore it!",
  "Honesty in relationships brings positive outcomes today.",
  "Romantic opportunity at social gathering. Be social!",
  "Your emotional warmth attracts the right people.",
  "Today is about quality time, not grand gestures.",
  "A heartfelt conversation strengthens your bond.",
  "Love yourself first, and others will follow.",
  "Flirtation comes naturally today. Enjoy the energy!",
  "Past relationship lessons help you make wise choices.",
  "Your ideal partner shares your values. Seek them out!",
  "Romantic texts or calls bring pleasant surprises.",
  "Today favors declarations of love. Speak from heart!"
];

const WEALTH_MESSAGES = [
  "Financial opportunity knocking! Stay alert for chances.",
  "Today favors saving over spending. Be conservative.",
  "A side hustle idea may prove profitable. Explore it!",
  "Invest in yourself today. Education pays dividends.",
  "Unexpected money may come from forgotten sources.",
  "Perfect day to review your budget and cut expenses.",
  "Business deal may materialize. Read the fine print!",
  "Your hard work finally pays off. Rewards coming!",
  "Avoid impulsive purchases. Think before you buy.",
  "Financial advice from experienced person proves valuable.",
  "Today favors long-term investments over quick gains.",
  "A creative money-making idea strikes. Pursue it!",
  "Collaboration brings financial benefits. Team up!",
  "Your financial intuition is strong today. Trust it.",
  "Old debt may be settled today. Clear the slate!",
  "Bargain hunting yields excellent finds. Shop smart!",
  "Revenue from past work arrives. Enjoy the fruits!",
  "Today is about building wealth slowly and steadily.",
  "A mentor's financial wisdom guides you well.",
  "Avoid lending money today. Protect your resources.",
  "Your talents can be monetized. Think creatively!",
  "Stock or crypto tip proves accurate. But verify first!",
  "Today favors negotiating better rates or prices.",
  "Passive income stream starts generating returns.",
  "Financial planning session brings clarity and peace.",
  "A lost item of value may be found today!",
  "Your generosity comes back multiplied. Give wisely.",
  "Real estate or property matters favor you today.",
  "Financial partnerships formed now prove beneficial.",
  "Your money mindset shifts positively. Abundance flows!"
];

const HEALTH_MESSAGES = [
  "Energy levels are high! Perfect day for exercise.",
  "Listen to your body. Rest if you need it.",
  "Hydration is key today. Drink plenty of water!",
  "Mental health matters. Take time to meditate.",
  "Your immune system is strong. But don't overdo it!",
  "Try a new healthy recipe. Nourish your body well.",
  "Morning workout sets positive tone for the day.",
  "Stress levels may rise. Practice deep breathing.",
  "Sleep quality improves tonight. Early to bed!",
  "Your posture needs attention. Stretch regularly.",
  "Outdoor activity boosts your mood significantly.",
  "Avoid junk food today. Choose nutritious options.",
  "A health check-up scheduled now brings good news.",
  "Your flexibility improves with gentle yoga practice.",
  "Take vitamins and supplements. Support your system!",
  "Mental clarity is excellent today. Use it wisely!",
  "Physical stamina impresses even yourself today.",
  "Digestive system sensitive. Eat light and clean.",
  "Your skin glows with proper care. Stay hydrated!",
  "Team sports or group fitness brings extra joy.",
  "Dancing or movement therapy lifts your spirits.",
  "Avoid overexertion. Balance activity with rest.",
  "Your healing abilities are enhanced today.",
  "Fresh air and sunshine work wonders for mood.",
  "Pain or discomfort diminishes with proper care.",
  "Your body craves certain nutrients. Listen to it!",
  "Stress management techniques prove very effective.",
  "Good day to start a new health habit or routine.",
  "Your vitality and zest for life are contagious!",
  "Mind-body connection is strong. Use it for healing."
];

const CAREER_MESSAGES = [
  "Your boss notices your dedication today. Well done!",
  "Perfect day to ask for that raise or promotion.",
  "A project comes together beautifully. Celebrate wins!",
  "Teamwork brings outstanding results. Collaborate more!",
  "Your creative solution impresses decision-makers.",
  "Networking today opens unexpected career doors.",
  "Job opportunity arrives through unlikely connection.",
  "Your expertise is in high demand. Showcase it!",
  "Presentation or pitch goes exceptionally well.",
  "Mentor's advice propels your career forward.",
  "A bold career move pays off. Trust yourself!",
  "Your professional reputation grows stronger.",
  "Deadline pressure brings out your best work.",
  "Conflict at work resolves in your favor.",
  "New skills learned prove immediately useful.",
  "Your leadership qualities shine through today.",
  "A side project attracts professional attention.",
  "Work-life balance improves with good boundaries.",
  "Your hard work finally gets the recognition deserved.",
  "Career path becomes clearer. Take next steps!",
  "Job interview scheduled goes better than expected.",
  "Clients or customers appreciate your service.",
  "Your innovative idea gets green light. Pursue it!",
  "Professional development opportunity arises. Take it!",
  "Your efficiency impresses everyone around you.",
  "Promotion discussions begin. Position yourself well!",
  "Contract or deal closes successfully. Celebrate!",
  "Your professional network expands meaningfully.",
  "A career risk taken now pays dividends later.",
  "Your contribution to team success is undeniable!"
];

const LUCKY_COLORS = [
  'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 
  'Orange', 'Gold', 'Silver', 'White', 'Black', 'Indigo',
  'Turquoise', 'Coral', 'Lavender', 'Emerald'
];

const ADVICE_MESSAGES = [
  "Focus on your goals today. Distractions fade away.",
  "Trust your intuition. Your gut feeling is accurate.",
  "Patience brings rewards. Don't rush important decisions.",
  "Smile more today. Your positive energy is contagious!",
  "Help someone in need. Karma returns multiplied.",
  "Take a calculated risk. Fortune favors the brave!",
  "Express gratitude. Count your blessings today.",
  "Stay humble in success. Pride precedes a fall.",
  "Learn from mistakes. Growth comes from reflection.",
  "Communicate clearly. Avoid misunderstandings.",
  "Prioritize self-care. You can't pour from empty cup.",
  "Be present in the moment. Stop worrying about tomorrow.",
  "Your creativity peaks today. Create something beautiful!",
  "Old wisdom guides you well. Listen to elders.",
  "Stay organized. Chaos leads to missed opportunities.",
  "Keep promises you make. Integrity matters most.",
  "Face challenges head-on. Avoiding makes them bigger.",
  "Your unique talents shine brightest today. Use them!",
  "Balance work and play. All work makes Jack dull.",
  "Forgive someone today. Release negative energy.",
  "Your words have power. Speak positively.",
  "Take the first step. Journey begins with courage.",
  "Quality over quantity in all things today.",
  "Your determination overcomes any obstacle.",
  "Stay flexible. Plans may need adjusting.",
  "Connect with nature. It recharges your spirit.",
  "Your kindness creates ripples of goodness.",
  "Think before acting. Impulse may lead astray.",
  "Your authenticity attracts right people.",
  "End the day with reflection. Journal your thoughts."
];

const WARNING_MESSAGES = [
  "Avoid gossip today. It may backfire badly.",
  "Don't lend money to anyone. It causes friction.",
  "Stay away from negative people. Protect your energy.",
  "Avoid making big financial decisions today.",
  "Don't sign contracts without reading carefully.",
  "Limit social media. It drains your productivity.",
  "Avoid late-night snacks. Your digestion suffers.",
  "Don't argue with authority figures today.",
  "Stay away from risky investments right now.",
  "Avoid revealing secrets. Confidentiality is key.",
  "Don't make promises you can't keep.",
  "Limit caffeine intake. You're jittery enough!",
  "Avoid toxic relationships. They drain you.",
  "Don't procrastinate. Deadlines approach fast.",
  "Stay away from drama. It's not worth it.",
  "Avoid impulsive online shopping today.",
  "Don't burn bridges. You may need them later.",
  "Limit sugar consumption. Energy crashes follow.",
  "Avoid confrontation with loved ones today.",
  "Don't ignore warning signs. Listen to intuition.",
  "Stay away from get-rich-quick schemes.",
  "Avoid overcommitting yourself. Say no when needed.",
  "Don't share personal information carelessly.",
  "Limit alcohol today. Moderation is wise.",
  "Avoid comparing yourself to others. Run your race!",
  "Don't make important calls when angry.",
  "Stay away from negative news. It affects mood.",
  "Avoid starting new projects today. Finish old ones!",
  "Don't trust too quickly. Verify first.",
  "Limit screen time before bed. Sleep quality matters."
];

// Helper: Get zodiac from birth year
export function getZodiacFromYear(year: number): ZodiacInfo {
  const zodiacIndex = (year - 4) % 12;
  const adjustedIndex = zodiacIndex < 0 ? zodiacIndex + 12 : zodiacIndex;
  return ZODIAC_SIGNS[adjustedIndex];
}

// Helper: Generate seeded random number (0-1)
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Helper: Get random item from array using seed
function getSeededItem<T>(array: T[], seed: number): T {
  const index = Math.floor(seededRandom(seed) * array.length);
  return array[index];
}

// Helper: Get score between min and max using seed
function getSeededScore(seed: number, min: number, max: number): number {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}

// Main: Generate daily fortune
export function generateDailyFortune(birthYear: number, todayDate: Date = new Date()): FortuneResult {
  const zodiac = getZodiacFromYear(birthYear);
  const zodiacIndex = (birthYear - 4) % 12;
  
  // Generate daily seed (same date + same zodiac = same fortune)
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth() + 1;
  const day = todayDate.getDate();
  const baseSeed = year * 10000 + month * 100 + day + zodiacIndex * 7;
  
  // Generate scores (each category gets different seed)
  const overallScore = getSeededScore(baseSeed, 60, 100);
  const loveScore = getSeededScore(baseSeed + 1, 50, 100);
  const wealthScore = getSeededScore(baseSeed + 2, 50, 100);
  const healthScore = getSeededScore(baseSeed + 3, 50, 100);
  const careerScore = getSeededScore(baseSeed + 4, 50, 100);
  
  // Select messages
  const loveFortune = getSeededItem(LOVE_MESSAGES, baseSeed + 10);
  const wealthFortune = getSeededItem(WEALTH_MESSAGES, baseSeed + 20);
  const healthFortune = getSeededItem(HEALTH_MESSAGES, baseSeed + 30);
  const careerFortune = getSeededItem(CAREER_MESSAGES, baseSeed + 40);
  const advice = getSeededItem(ADVICE_MESSAGES, baseSeed + 50);
  const warning = getSeededItem(WARNING_MESSAGES, baseSeed + 60);
  
  // Lucky elements
  const luckyColor = getSeededItem(LUCKY_COLORS, baseSeed + 70);
  const luckyNumber = getSeededScore(baseSeed + 80, 1, 99);
  
  // Format date
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const dateFormatted = todayDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return {
    zodiac,
    date: dateStr,
    dateFormatted,
    overallScore,
    loveScore,
    wealthScore,
    healthScore,
    careerScore,
    luckyColor,
    luckyNumber,
    advice,
    warning,
    detailedFortune: {
      love: loveFortune,
      wealth: wealthFortune,
      health: healthFortune,
      career: careerFortune
    }
  };
}

// Generate share text
export function generateShareText(fortune: FortuneResult): string {
  return `My Korean Zodiac Fortune Today: ${fortune.zodiac.emoji} ${fortune.zodiac.english} - ${fortune.overallScore}/100! Lucky color: ${fortune.luckyColor} 🎨 Lucky number: ${fortune.luckyNumber} 🔢`;
}

// Get color for display
export function getColorHex(colorName: string): string {
  const colorMap: { [key: string]: string } = {
    'Red': '#EF4444',
    'Blue': '#3B82F6',
    'Green': '#10B981',
    'Yellow': '#F59E0B',
    'Purple': '#A855F7',
    'Pink': '#EC4899',
    'Orange': '#F97316',
    'Gold': '#D97706',
    'Silver': '#9CA3AF',
    'White': '#F3F4F6',
    'Black': '#1F2937',
    'Indigo': '#6366F1',
    'Turquoise': '#14B8A6',
    'Coral': '#FB7185',
    'Lavender': '#C084FC',
    'Emerald': '#059669'
  };
  
  return colorMap[colorName] || '#A855F7';
}

// Get fortune grade
export function getFortuneGrade(score: number): { text: string; emoji: string } {
  if (score >= 90) return { text: 'Excellent', emoji: '🌟' };
  if (score >= 80) return { text: 'Very Good', emoji: '✨' };
  if (score >= 70) return { text: 'Good', emoji: '⭐' };
  if (score >= 60) return { text: 'Fair', emoji: '🌙' };
  return { text: 'Average', emoji: '☁️' };
}
