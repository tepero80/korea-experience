// Types
export interface CoupleNameResult {
  id: string;
  method: string;
  name: string;
  nameKo: string;
  description: string;
  vibe: string;
  example: string;
}

// Generate couple names
export function generateCoupleNames(name1: string, name2: string): CoupleNameResult[] {
  const clean1 = name1.trim();
  const clean2 = name2.trim();

  if (!clean1 || !clean2) {
    return [];
  }

  const results: CoupleNameResult[] = [];

  // Method 1: First syllables blend
  const firstBlend = clean1.substring(0, Math.min(2, clean1.length)) + 
                     clean2.substring(0, Math.min(2, clean2.length));
  results.push({
    id: 'first-blend',
    method: 'First Syllables Blend',
    name: firstBlend,
    nameKo: convertToKoreanStyle(firstBlend),
    description: 'Combines the first 2 letters of each name',
    vibe: 'Classic and sweet',
    example: 'Brad + Angelina = BrAn',
  });

  // Method 2: Last-First combo
  const lastFirst = clean1.substring(clean1.length - 2) + 
                   clean2.substring(0, 2);
  results.push({
    id: 'last-first',
    method: 'Last-First Combo',
    name: lastFirst,
    nameKo: convertToKoreanStyle(lastFirst),
    description: 'Last 2 letters of first name + First 2 of second',
    vibe: 'Unique and creative',
    example: 'Taylor + Travis = orTr',
  });

  // Method 3: Alternating letters
  let alternating = '';
  const maxLen = Math.max(clean1.length, clean2.length);
  for (let i = 0; i < Math.min(4, maxLen); i++) {
    if (i < clean1.length) alternating += clean1[i];
    if (i < clean2.length) alternating += clean2[i];
  }
  results.push({
    id: 'alternating',
    method: 'Alternating Letters',
    name: alternating.substring(0, 6),
    nameKo: convertToKoreanStyle(alternating.substring(0, 6)),
    description: 'Alternates letters from both names',
    vibe: 'Playful and intertwined',
    example: 'Kim + Lee = KLieem',
  });

  // Method 4: Mashup (first half of each)
  const mashup = clean1.substring(0, Math.ceil(clean1.length / 2)) +
                clean2.substring(0, Math.ceil(clean2.length / 2));
  results.push({
    id: 'mashup',
    method: 'Name Mashup',
    name: mashup,
    nameKo: convertToKoreanStyle(mashup),
    description: 'First half of each name combined',
    vibe: 'Balanced and harmonious',
    example: 'Sarah + John = SaJo',
  });

  // Method 5: Cute nickname style
  const cute = `${clean1.substring(0, 2)}${clean2.substring(clean2.length - 2)}`;
  results.push({
    id: 'cute',
    method: 'Cute Couple Style',
    name: cute + ' ♥',
    nameKo: convertToKoreanStyle(cute) + ' ♥',
    description: 'First letters + last letters with heart',
    vibe: 'Adorable and affectionate',
    example: 'Romeo + Juliet = Roet ♥',
  });

  return results;
}

// Convert to Korean-style romanization (simple approximation)
function convertToKoreanStyle(name: string): string {
  // Simple mapping to make it look Korean-ish
  const koreanStyleMap: { [key: string]: string } = {
    'a': '아', 'b': '비', 'c': '씨', 'd': '디', 'e': '에',
    'f': '에프', 'g': '지', 'h': '에이치', 'i': '이', 'j': '제이',
    'k': '케이', 'l': '엘', 'm': '엠', 'n': '엔', 'o': '오',
    'p': '피', 'q': '큐', 'r': '알', 's': '에스', 't': '티',
    'u': '유', 'v': '브이', 'w': '더블유', 'x': '엑스', 'y': '와이', 'z': '지',
  };

  let korean = '';
  const lower = name.toLowerCase();
  
  for (let i = 0; i < Math.min(4, lower.length); i++) {
    const char = lower[i];
    if (koreanStyleMap[char]) {
      // Use first character of Korean representation
      if (i === 0) {
        korean += koreanStyleMap[char];
      } else {
        // Simplified for brevity
        korean += koreanStyleMap[char].substring(0, 1);
      }
    }
  }

  return korean || name;
}

// Get cute couple emojis
export function getCoupleEmojis(): string[] {
  return [
    '💑', '💏', '👫', '💕', '💖',
    '💗', '💝', '💞', '❤️', '💓',
    '💘', '💌', '🌹', '💐', '🎀',
  ];
}

// Get relationship terms
export function getRelationshipTerms(): string[] {
  return [
    'Lovebirds', 'Sweethearts', 'Soulmates', 'Power Couple',
    'Dream Team', 'Perfect Match', 'Better Half', 'My Everything',
    'Forever Mine', 'True Love', 'Meant to Be', 'One & Only',
  ];
}
