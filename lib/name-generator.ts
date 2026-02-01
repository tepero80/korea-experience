import {
  KOREAN_SURNAMES,
  POPULAR_GIVEN_NAMES,
  ENGLISH_TO_KOREAN_MAP,
  GENDER_HINTS,
  NAME_SYLLABLES,
} from './korean-names';

export interface GeneratedKoreanName {
  fullName: {
    korean: string;
    romanized: string;
  };
  surname: {
    korean: string;
    romanized: string;
    meaning: string;
  };
  givenName: {
    korean: string;
    romanized: string;
    meaning: string;
  };
  gender: 'male' | 'female' | 'neutral';
  transliterationNote: string;
}

/**
 * Detect gender from English name
 */
function detectGender(name: string): 'male' | 'female' | 'neutral' {
  const lowerName = name.toLowerCase().trim();
  
  if (GENDER_HINTS[lowerName]) {
    return GENDER_HINTS[lowerName];
  }
  
  // Common female name endings
  if (lowerName.endsWith('a') || lowerName.endsWith('ie') || lowerName.endsWith('y')) {
    return 'female';
  }
  
  // If no clear indication, return neutral
  return 'neutral';
}

/**
 * Select a random Korean surname weighted by frequency
 */
function selectSurname(): typeof KOREAN_SURNAMES[0] {
  // Weighted random selection based on frequency
  const totalFrequency = KOREAN_SURNAMES.reduce((sum, s) => sum + s.frequency, 0);
  let random = Math.random() * totalFrequency;
  
  for (const surname of KOREAN_SURNAMES) {
    random -= surname.frequency;
    if (random <= 0) {
      return surname;
    }
  }
  
  return KOREAN_SURNAMES[0]; // Fallback to Kim
}

/**
 * Convert English name to Korean phonetic approximation
 */
function englishToKorean(englishName: string): string {
  const name = englishName.toLowerCase().trim();
  let korean = '';
  let i = 0;
  
  while (i < name.length) {
    let matched = false;
    
    // Try to match 4-character sequences first, then 3, 2, 1
    for (let len = 4; len >= 1; len--) {
      const substring = name.substring(i, i + len);
      if (ENGLISH_TO_KOREAN_MAP[substring]) {
        const options = ENGLISH_TO_KOREAN_MAP[substring];
        korean += options[Math.floor(Math.random() * options.length)];
        i += len;
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      // Skip character if no mapping found
      i++;
    }
  }
  
  return korean || '이름'; // Fallback to generic "name"
}

/**
 * Romanize Korean text (simplified)
 */
function romanizeKorean(korean: string): string {
  // This is a simplified romanization
  // In production, you'd use a proper Korean romanization library
  const romanizationMap: { [key: string]: string } = {
    '김': 'Kim', '이': 'Lee', '박': 'Park', '최': 'Choi', '정': 'Jung',
    '강': 'Kang', '조': 'Cho', '윤': 'Yoon', '장': 'Jang', '임': 'Lim',
    '한': 'Han', '오': 'Oh', '서': 'Seo', '신': 'Shin', '권': 'Kwon',
    '황': 'Hwang', '안': 'Ahn', '송': 'Song', '류': 'Ryu', '전': 'Jeon',
  };
  
  return romanizationMap[korean] || korean;
}

/**
 * Generate a meaningful Korean given name based on gender
 */
function generateGivenName(gender: 'male' | 'female' | 'neutral'): {
  korean: string;
  romanized: string;
  meaning: string;
} {
  // Select from popular names based on gender
  const namePool = gender === 'female' 
    ? POPULAR_GIVEN_NAMES.female 
    : gender === 'male'
    ? POPULAR_GIVEN_NAMES.male
    : Math.random() > 0.5 ? POPULAR_GIVEN_NAMES.female : POPULAR_GIVEN_NAMES.male;
  
  const randomName = namePool[Math.floor(Math.random() * namePool.length)];
  return randomName;
}

/**
 * Generate a custom Korean name by combining syllables
 */
function generateCustomName(): {
  korean: string;
  romanized: string;
  meaning: string;
} {
  const categories = Object.keys(NAME_SYLLABLES) as Array<keyof typeof NAME_SYLLABLES>;
  
  // Pick two random categories
  const category1 = categories[Math.floor(Math.random() * categories.length)];
  const category2 = categories[Math.floor(Math.random() * categories.length)];
  
  const syllable1 = NAME_SYLLABLES[category1][Math.floor(Math.random() * NAME_SYLLABLES[category1].length)];
  const syllable2 = NAME_SYLLABLES[category2][Math.floor(Math.random() * NAME_SYLLABLES[category2].length)];
  
  return {
    korean: syllable1.korean + syllable2.korean,
    romanized: `${syllable1.romanized}-${syllable2.romanized}`,
    meaning: `${syllable1.meaning} & ${syllable2.meaning}`,
  };
}

/**
 * Main function to generate a Korean name from an English name
 */
export function generateKoreanName(englishName: string, preferCustom: boolean = false): GeneratedKoreanName {
  if (!englishName || englishName.trim().length === 0) {
    throw new Error('English name is required');
  }
  
  // Detect gender
  const gender = detectGender(englishName);
  
  // Select surname
  const surname = selectSurname();
  
  // Generate or select given name
  const givenName = preferCustom 
    ? generateCustomName()
    : generateGivenName(gender);
  
  // Create full name
  const fullNameKorean = surname.korean + givenName.korean;
  const fullNameRomanized = `${surname.romanized} ${givenName.romanized}`;
  
  // Transliteration note
  const phoneticApprox = englishToKorean(englishName);
  const transliterationNote = phoneticApprox 
    ? `Phonetic approximation of "${englishName}" in Korean: ${phoneticApprox}`
    : `Generated a meaningful Korean name inspired by "${englishName}"`;
  
  return {
    fullName: {
      korean: fullNameKorean,
      romanized: fullNameRomanized,
    },
    surname: {
      korean: surname.korean,
      romanized: surname.romanized,
      meaning: surname.meaning,
    },
    givenName: {
      korean: givenName.korean,
      romanized: givenName.romanized,
      meaning: givenName.meaning,
    },
    gender,
    transliterationNote,
  };
}

/**
 * Generate multiple Korean name options
 */
export function generateMultipleNames(englishName: string, count: number = 5): GeneratedKoreanName[] {
  const names: GeneratedKoreanName[] = [];
  
  for (let i = 0; i < count; i++) {
    // Mix of popular names and custom combinations
    const preferCustom = i >= Math.floor(count / 2);
    names.push(generateKoreanName(englishName, preferCustom));
  }
  
  return names;
}
