// Types
export interface StageNameInput {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'neutral';
  concept: 'cute' | 'cool' | 'elegant' | 'powerful';
}

export interface StageNameResult {
  stageName: string;
  stageNameKo: string;
  meaning: string;
  concept: string;
  similarity: {
    idol: string;
    percentage: number;
    reason: string;
  };
  groupSuggestion: {
    groupName: string;
    groupNameKo: string;
    concept: string;
  };
}

// K-Pop Stage Name Elements
const nameElements = {
  cute: {
    male: ['Haru', 'Yuki', 'Mochi', 'Peach', 'Sunny', 'Cherry', 'Sky', 'Luna', 'Star', 'Honey'],
    female: ['Luna', 'Yuna', 'Mina', 'Hana', 'Lily', 'Bella', 'Coco', 'Nana', 'Mimi', 'Lulu'],
    neutral: ['Ari', 'Soo', 'Min', 'Kai', 'Jae', 'Yeon', 'Hee', 'Ji', 'Bin', 'Won']
  },
  cool: {
    male: ['Ace', 'Blaze', 'Storm', 'Rex', 'Knight', 'Raven', 'Phoenix', 'Atlas', 'Titan', 'Zion'],
    female: ['Jinx', 'Storm', 'Raven', 'Blaze', 'Nova', 'Phoenix', 'Onyx', 'Frost', 'Echo', 'Viper'],
    neutral: ['Jay', 'Kai', 'Zen', 'Ash', 'Ray', 'Sky', 'Neo', 'Sol', 'Max', 'Nyx']
  },
  elegant: {
    male: ['Ren', 'Kai', 'Zen', 'Leo', 'Noah', 'Elijah', 'Julian', 'Gabriel', 'Sebastian', 'Vincent'],
    female: ['Aria', 'Luna', 'Grace', 'Elle', 'Sofia', 'Claire', 'Bella', 'Aurora', 'Celeste', 'Diana'],
    neutral: ['Sage', 'Rain', 'River', 'Sky', 'Ocean', 'Dawn', 'Eden', 'Haven', 'Peace', 'Bliss']
  },
  powerful: {
    male: ['Khan', 'Thor', 'Zeus', 'Dragon', 'King', 'Tiger', 'Lion', 'Hawk', 'Wolf', 'Maximus'],
    female: ['Queen', 'Tiger', 'Dragon', 'Athena', 'Valkyrie', 'Empress', 'Vixen', 'Lioness', 'Siren', 'Goddess'],
    neutral: ['Storm', 'Thunder', 'Lightning', 'Blaze', 'Flame', 'Steel', 'Iron', 'Diamond', 'Power', 'Force']
  }
};

const koreanNameElements = {
  cute: ['루나', '유나', '하나', '미나', '나나', '모모', '사나', '다현', '채영', '지효'],
  cool: ['제이', '카이', '에이스', '스톰', '블레이즈', '레이븐', '피닉스', '제노', '타오', '크리스'],
  elegant: ['아리아', '세라', '그레이스', '엘', '소피아', '클레어', '벨라', '오로라', '세레스', '다이애나'],
  powerful: ['킹', '퀸', '타이거', '드래곤', '라이언', '에이전트', '파워', '포스', '블레이즈', '스톰']
};

// Real K-Pop Idols for Similarity
const kpopIdols = {
  cute: [
    { name: 'Jungkook (BTS)', reason: 'Playful and youthful energy' },
    { name: 'Mina (TWICE)', reason: 'Sweet and elegant charm' },
    { name: 'Yeonjun (TXT)', reason: 'Bright and energetic presence' },
    { name: 'Wonyoung (IVE)', reason: 'Fresh and lovely image' }
  ],
  cool: [
    { name: 'G-Dragon (BIGBANG)', reason: 'Trendsetting and charismatic' },
    { name: 'CL (2NE1)', reason: 'Bold and powerful style' },
    { name: 'Taeyong (NCT)', reason: 'Sharp and intense presence' },
    { name: 'Jennie (BLACKPINK)', reason: 'Confident and fierce aura' }
  ],
  elegant: [
    { name: 'Taeyeon (SNSD)', reason: 'Graceful and sophisticated' },
    { name: 'Kai (EXO)', reason: 'Refined and artistic' },
    { name: 'Irene (Red Velvet)', reason: 'Classic beauty and poise' },
    { name: 'V (BTS)', reason: 'Artistic and timeless charm' }
  ],
  powerful: [
    { name: 'RM (BTS)', reason: 'Strong leadership and presence' },
    { name: 'Hwasa (MAMAMOO)', reason: 'Commanding and confident' },
    { name: 'Bang Chan (Stray Kids)', reason: 'Powerful and charismatic' },
    { name: 'Soyeon ((G)I-DLE)', reason: 'Fierce and impactful' }
  ]
};

// Group Name Elements
const groupPrefixes = {
  cute: ['Sweet', 'Cherry', 'Candy', 'Star', 'Dream', 'Angel', 'Happy', 'Lovely', 'Pretty', 'Shine'],
  cool: ['Black', 'Dark', 'Fire', 'Storm', 'Thunder', 'Night', 'Shadow', 'Ice', 'Steel', 'Blade'],
  elegant: ['Royal', 'Crystal', 'Pearl', 'Diamond', 'Silk', 'Velvet', 'Grace', 'Rose', 'Crown', 'Gold'],
  powerful: ['Supreme', 'Alpha', 'Titan', 'Phoenix', 'Dragon', 'Empire', 'Kingdom', 'Dynasty', 'Legion', 'Force']
};

const groupSuffixes = {
  cute: ['Hearts', 'Angels', 'Stars', 'Dreams', 'Wings', 'Lights', 'Flowers', 'Gems', 'Clouds', 'Rays'],
  cool: ['Squad', 'Crew', 'Gang', 'Unit', 'Force', 'Team', 'Elite', 'Legion', 'Warriors', 'Knights'],
  elegant: ['Royals', 'Elite', 'Society', 'Court', 'Dynasty', 'Reign', 'Empire', 'Noble', 'Class', 'Order'],
  powerful: ['Kings', 'Queens', 'Emperors', 'Titans', 'Gods', 'Warriors', 'Champions', 'Legends', 'Heroes', 'Masters']
};

const groupKoreanNames = {
  cute: ['스위트하트', '체리블로썸', '캔디팝', '스타라이트', '드림걸스', '엔젤위시', '해피빈', '러블리', '프리티', '샤인'],
  cool: ['블랙스완', '다크나이트', '파이어', '스톰', '썬더', '나이트크루', '쉐도우', '아이스', '스틸', '블레이드'],
  elegant: ['로얄티', '크리스탈', '펄', '다이아몬드', '실크로드', '벨벳', '그레이스', '로제', '크라운', '골든'],
  powerful: ['슈프림', '알파', '타이탄', '피닉스', '드래곤', '엠파이어', '킹덤', '다이너스티', '리전', '포스']
};

// Helper Functions
function getInitials(firstName: string, lastName: string): string {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

function calculateSimilarity(concept: string): number {
  // Generate a realistic similarity percentage (60-95%)
  return Math.floor(Math.random() * 35) + 60;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Main Generation Function
export function generateKpopStageName(input: StageNameInput): StageNameResult {
  const { firstName, lastName, gender, concept } = input;
  
  // Generate stage name based on concept and gender
  let stageName: string;
  let stageNameKo: string;
  
  // Use initials or first name initial + concept element
  const initial = firstName.charAt(0).toUpperCase();
  const namePool = nameElements[concept][gender];
  
  // 50% chance to use full concept name, 50% to combine with initial
  if (Math.random() > 0.5) {
    stageName = getRandomElement(namePool);
  } else {
    const conceptName = getRandomElement(namePool);
    stageName = initial + conceptName.charAt(0).toUpperCase() + conceptName.slice(1).toLowerCase();
  }
  
  // Generate Korean name
  stageNameKo = getRandomElement(koreanNameElements[concept]);
  
  // Generate meaning based on concept
  const meanings = {
    cute: `Your name represents sweetness, charm, and youthful energy. Perfect for a bright and cheerful idol who captures hearts!`,
    cool: `Your name embodies confidence, edge, and trendsetting style. Ideal for a charismatic performer who stands out!`,
    elegant: `Your name signifies grace, sophistication, and timeless beauty. Perfect for a refined artist with classic appeal!`,
    powerful: `Your name radiates strength, leadership, and commanding presence. Ideal for a fierce performer who owns the stage!`
  };
  
  // Get similar idol
  const idolPool = kpopIdols[concept];
  const similarIdol = getRandomElement(idolPool);
  const similarity = calculateSimilarity(concept);
  
  // Generate group suggestion
  const groupPrefix = getRandomElement(groupPrefixes[concept]);
  const groupSuffix = getRandomElement(groupSuffixes[concept]);
  const groupName = `${groupPrefix} ${groupSuffix}`;
  const groupNameKo = getRandomElement(groupKoreanNames[concept]);
  
  const groupConcepts = {
    cute: 'Fresh and youthful concept with bright energy',
    cool: 'Urban and trendy concept with edgy vibes',
    elegant: 'Sophisticated and mature concept with class',
    powerful: 'Bold and impactful concept with strong presence'
  };
  
  return {
    stageName,
    stageNameKo,
    meaning: meanings[concept],
    concept: concept.charAt(0).toUpperCase() + concept.slice(1),
    similarity: {
      idol: similarIdol.name,
      percentage: similarity,
      reason: similarIdol.reason
    },
    groupSuggestion: {
      groupName,
      groupNameKo,
      concept: groupConcepts[concept]
    }
  };
}
