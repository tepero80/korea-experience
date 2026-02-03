export interface NicknameResult {
  nickname: string;
  nicknameKo: string;
  pronunciation: string;
  meaning: string;
  category: string;
}

// Korean syllable components for cute style
const cuteKoreanPrefixes = [
  { ko: '애교', en: 'Aegyo', meaning: 'Charming' },
  { ko: '귀요미', en: 'Kiyomi', meaning: 'Cutie' },
  { ko: '달콤', en: 'Dalkom', meaning: 'Sweet' },
  { ko: '보들', en: 'Bodeul', meaning: 'Soft' },
  { ko: '콩', en: 'Kong', meaning: 'Bean' },
  { ko: '복숭아', en: 'Boksunga', meaning: 'Peach' },
  { ko: '꿀', en: 'Kkul', meaning: 'Honey' },
  { ko: '토끼', en: 'Tokki', meaning: 'Bunny' },
];

const cuteSuffixes = [
  { ko: '이', en: 'i', meaning: 'Little One' },
  { ko: '양', en: 'yang', meaning: 'Miss' },
  { ko: '쨩', en: 'jjang', meaning: 'Best' },
  { ko: '공주', en: 'Gongju', meaning: 'Princess' },
  { ko: '별', en: 'Byeol', meaning: 'Star' },
];

// Cool style
const coolPrefixes = [
  { ko: '블랙', en: 'Black', meaning: 'Dark' },
  { ko: '화이트', en: 'White', meaning: 'Pure' },
  { ko: '퓨어', en: 'Pure', meaning: 'Pure' },
  { ko: '다크', en: 'Dark', meaning: 'Mysterious' },
  { ko: '아이스', en: 'Ice', meaning: 'Cool' },
  { ko: '실버', en: 'Silver', meaning: 'Silver' },
  { ko: '문', en: 'Moon', meaning: 'Moon' },
  { ko: '스타', en: 'Star', meaning: 'Star' },
];

const coolSuffixes = [
  { ko: '킹', en: 'King', meaning: 'King' },
  { ko: '퀸', en: 'Queen', meaning: 'Queen' },
  { ko: '로드', en: 'Lord', meaning: 'Lord' },
  { ko: '맨', en: 'Man', meaning: 'Hero' },
  { ko: '나이트', en: 'Knight', meaning: 'Knight' },
];

// Unique style
const uniquePrefixes = [
  { ko: '환상', en: 'Hwansang', meaning: 'Fantasy' },
  { ko: '무지개', en: 'Mujigae', meaning: 'Rainbow' },
  { ko: '신비', en: 'Sinbi', meaning: 'Mystery' },
  { ko: '드림', en: 'Dream', meaning: 'Dream' },
  { ko: '스카이', en: 'Sky', meaning: 'Sky' },
  { ko: '오션', en: 'Ocean', meaning: 'Ocean' },
  { ko: '소울', en: 'Soul', meaning: 'Soul' },
  { ko: '피닉스', en: 'Phoenix', meaning: 'Phoenix' },
];

const uniqueSuffixes = [
  { ko: '천사', en: 'Cheonsa', meaning: 'Angel' },
  { ko: '요정', en: 'Yojeong', meaning: 'Fairy' },
  { ko: '마법사', en: 'Mabeopsa', meaning: 'Wizard' },
  { ko: '전설', en: 'Jeonseol', meaning: 'Legend' },
  { ko: '영웅', en: 'Yeongung', meaning: 'Hero' },
];

// Get first letter of name for consistent selection
function getNameIndex(name: string): number {
  const firstChar = name.charAt(0).toLowerCase();
  return firstChar.charCodeAt(0) % 8;
}

export function generateKoreanNickname(
  name: string,
  style: 'cute' | 'cool' | 'unique'
): NicknameResult[] {
  const results: NicknameResult[] = [];
  const nameIndex = getNameIndex(name);
  const nameLower = name.toLowerCase();
  
  let prefixes, suffixes, category;
  
  switch (style) {
    case 'cute':
      prefixes = cuteKoreanPrefixes;
      suffixes = cuteSuffixes;
      category = '귀여운';
      break;
    case 'cool':
      prefixes = coolPrefixes;
      suffixes = coolSuffixes;
      category = '쿨한';
      break;
    case 'unique':
      prefixes = uniquePrefixes;
      suffixes = uniqueSuffixes;
      category = '유니크한';
      break;
  }
  
  // Generate 6 options
  for (let i = 0; i < 6; i++) {
    const prefixIdx = (nameIndex + i) % prefixes.length;
    const suffixIdx = (nameIndex + i + 3) % suffixes.length;
    
    const prefix = prefixes[prefixIdx];
    const suffix = suffixes[suffixIdx];
    
    // Create nickname
    const nickname = `${prefix.en}${suffix.en}`;
    const nicknameKo = `${prefix.ko}${suffix.ko}`;
    const pronunciation = nickname.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);
    const meaning = `${prefix.meaning} ${suffix.meaning}`;
    
    results.push({
      nickname,
      nicknameKo,
      pronunciation,
      meaning,
      category
    });
  }
  
  return results;
}
