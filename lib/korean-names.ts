// Korean surnames with their meanings and frequencies
export const KOREAN_SURNAMES = [
  { korean: '김', romanized: 'Kim', meaning: 'Gold', frequency: 21.6 },
  { korean: '이', romanized: 'Lee', meaning: 'Plum', frequency: 14.8 },
  { korean: '박', romanized: 'Park', meaning: 'Gourd', frequency: 8.5 },
  { korean: '최', romanized: 'Choi', meaning: 'Best', frequency: 4.7 },
  { korean: '정', romanized: 'Jung', meaning: 'Righteous', frequency: 4.3 },
  { korean: '강', romanized: 'Kang', meaning: 'River', frequency: 2.4 },
  { korean: '조', romanized: 'Cho', meaning: 'Morning', frequency: 2.1 },
  { korean: '윤', romanized: 'Yoon', meaning: 'Allow', frequency: 2.1 },
  { korean: '장', romanized: 'Jang', meaning: 'Long', frequency: 2.0 },
  { korean: '임', romanized: 'Lim', meaning: 'Forest', frequency: 1.7 },
  { korean: '한', romanized: 'Han', meaning: 'Korea', frequency: 1.5 },
  { korean: '오', romanized: 'Oh', meaning: 'Five', frequency: 1.4 },
  { korean: '서', romanized: 'Seo', meaning: 'West', frequency: 1.2 },
  { korean: '신', romanized: 'Shin', meaning: 'Spirit', frequency: 1.2 },
  { korean: '권', romanized: 'Kwon', meaning: 'Authority', frequency: 1.1 },
  { korean: '황', romanized: 'Hwang', meaning: 'Yellow', frequency: 1.1 },
  { korean: '안', romanized: 'Ahn', meaning: 'Peace', frequency: 1.0 },
  { korean: '송', romanized: 'Song', meaning: 'Pine', frequency: 0.9 },
  { korean: '류', romanized: 'Ryu', meaning: 'Willow', frequency: 0.9 },
  { korean: '전', romanized: 'Jeon', meaning: 'Field', frequency: 0.8 },
];

// Korean name syllables with meanings (for given names)
export const NAME_SYLLABLES = {
  // Syllables starting with consonants
  wisdom: [
    { korean: '지', romanized: 'Ji', meaning: 'Wisdom' },
    { korean: '슬', romanized: 'Seul', meaning: 'Wise' },
    { korean: '현', romanized: 'Hyun', meaning: 'Worthy' },
    { korean: '철', romanized: 'Chul', meaning: 'Philosophy' },
  ],
  beauty: [
    { korean: '미', romanized: 'Mi', meaning: 'Beauty' },
    { korean: '아', romanized: 'A', meaning: 'Elegant' },
    { korean: '연', romanized: 'Yeon', meaning: 'Lotus' },
    { korean: '화', romanized: 'Hwa', meaning: 'Flower' },
  ],
  strength: [
    { korean: '강', romanized: 'Kang', meaning: 'Strong' },
    { korean: '용', romanized: 'Yong', meaning: 'Dragon' },
    { korean: '석', romanized: 'Seok', meaning: 'Stone' },
    { korean: '무', romanized: 'Mu', meaning: 'Warrior' },
  ],
  brightness: [
    { korean: '빛', romanized: 'Bit', meaning: 'Light' },
    { korean: '별', romanized: 'Byul', meaning: 'Star' },
    { korean: '햇', romanized: 'Haet', meaning: 'Sun' },
    { korean: '달', romanized: 'Dal', meaning: 'Moon' },
  ],
  nature: [
    { korean: '하', romanized: 'Ha', meaning: 'Sky' },
    { korean: '나', romanized: 'Na', meaning: 'I/Me' },
    { korean: '솔', romanized: 'Sol', meaning: 'Pine' },
    { korean: '바', romanized: 'Ba', meaning: 'Sea' },
  ],
  virtue: [
    { korean: '선', romanized: 'Sun', meaning: 'Good' },
    { korean: '의', romanized: 'Ui', meaning: 'Righteous' },
    { korean: '정', romanized: 'Jung', meaning: 'Upright' },
    { korean: '예', romanized: 'Ye', meaning: 'Courtesy' },
  ],
  prosperity: [
    { korean: '복', romanized: 'Bok', meaning: 'Fortune' },
    { korean: '영', romanized: 'Young', meaning: 'Glory' },
    { korean: '수', romanized: 'Soo', meaning: 'Longevity' },
    { korean: '금', romanized: 'Geum', meaning: 'Gold' },
  ],
  joy: [
    { korean: '희', romanized: 'Hee', meaning: 'Joy' },
    { korean: '웃', romanized: 'Ut', meaning: 'Smile' },
    { korean: '춘', romanized: 'Chun', meaning: 'Spring' },
    { korean: '기', romanized: 'Gi', meaning: 'Energy' },
  ],
};

// Common Korean given name combinations with meanings
export const POPULAR_GIVEN_NAMES = {
  male: [
    { korean: '민준', romanized: 'Min-jun', meaning: 'Quick & Talented', syllables: ['Min', 'Jun'] },
    { korean: '서준', romanized: 'Seo-jun', meaning: 'Auspicious & Handsome', syllables: ['Seo', 'Jun'] },
    { korean: '예준', romanized: 'Ye-jun', meaning: 'Talented & Handsome', syllables: ['Ye', 'Jun'] },
    { korean: '도윤', romanized: 'Do-yun', meaning: 'Path & Allow', syllables: ['Do', 'Yun'] },
    { korean: '시우', romanized: 'Si-woo', meaning: 'Begin & Universe', syllables: ['Si', 'Woo'] },
    { korean: '주원', romanized: 'Joo-won', meaning: 'Main & Origin', syllables: ['Joo', 'Won'] },
    { korean: '하준', romanized: 'Ha-jun', meaning: 'Summer & Talented', syllables: ['Ha', 'Jun'] },
    { korean: '지훈', romanized: 'Ji-hoon', meaning: 'Wisdom & Merit', syllables: ['Ji', 'Hoon'] },
    { korean: '건우', romanized: 'Gun-woo', meaning: 'Strong & Universe', syllables: ['Gun', 'Woo'] },
    { korean: '우진', romanized: 'Woo-jin', meaning: 'Universe & Precious', syllables: ['Woo', 'Jin'] },
  ],
  female: [
    { korean: '서연', romanized: 'Seo-yeon', meaning: 'Auspicious & Beautiful', syllables: ['Seo', 'Yeon'] },
    { korean: '서윤', romanized: 'Seo-yoon', meaning: 'Auspicious & Allow', syllables: ['Seo', 'Yoon'] },
    { korean: '지우', romanized: 'Ji-woo', meaning: 'Wisdom & Universe', syllables: ['Ji', 'Woo'] },
    { korean: '하은', romanized: 'Ha-eun', meaning: 'Summer & Grace', syllables: ['Ha', 'Eun'] },
    { korean: '민서', romanized: 'Min-seo', meaning: 'Quick & Auspicious', syllables: ['Min', 'Seo'] },
    { korean: '지민', romanized: 'Ji-min', meaning: 'Wisdom & Quick', syllables: ['Ji', 'Min'] },
    { korean: '수아', romanized: 'Soo-ah', meaning: 'Excellence & Beautiful', syllables: ['Soo', 'Ah'] },
    { korean: '예은', romanized: 'Ye-eun', meaning: 'Talent & Grace', syllables: ['Ye', 'Eun'] },
    { korean: '지아', romanized: 'Ji-ah', meaning: 'Wisdom & Beautiful', syllables: ['Ji', 'Ah'] },
    { korean: '은서', romanized: 'Eun-seo', meaning: 'Grace & Auspicious', syllables: ['Eun', 'Seo'] },
  ],
};

// English to Korean syllable mapping (phonetic approximation)
export const ENGLISH_TO_KOREAN_MAP: { [key: string]: string[] } = {
  // A sounds
  a: ['아', '애'],
  al: ['알', '앨'],
  an: ['안', '앤'],
  ar: ['아', '알'],
  
  // B sounds
  b: ['비', '배'],
  ba: ['바', '배'],
  be: ['베', '비'],
  ben: ['벤'],
  bo: ['보'],
  
  // C sounds
  c: ['씨', '시'],
  ca: ['카', '캐'],
  ch: ['치', '차'],
  cho: ['초', '조'],
  chris: ['크리스', '크'],
  
  // D sounds
  d: ['디', '데'],
  da: ['다', '대'],
  dan: ['단', '댄'],
  de: ['데', '디'],
  do: ['도'],
  
  // E sounds
  e: ['이', '에'],
  ed: ['에드', '드'],
  el: ['엘', '일'],
  em: ['엠', '임'],
  er: ['어', '얼'],
  
  // F sounds
  f: ['프', '피'],
  
  // G sounds
  g: ['지', '기'],
  ga: ['가', '개'],
  ge: ['게', '지'],
  
  // H sounds
  h: ['히', '해'],
  ha: ['하', '해'],
  he: ['히', '헤'],
  
  // I sounds
  i: ['이', '아이'],
  
  // J sounds
  j: ['제', '지'],
  ja: ['자', '재'],
  je: ['제', '지'],
  jo: ['조', '죠'],
  
  // K sounds
  k: ['키', '케'],
  ka: ['카', '캐'],
  ke: ['케', '키'],
  
  // L sounds
  l: ['엘', '리'],
  la: ['라', '래'],
  le: ['리', '레'],
  li: ['리', '라이'],
  lo: ['로'],
  
  // M sounds
  m: ['엠', '미'],
  ma: ['마', '매'],
  mi: ['미', '마이'],
  mo: ['모'],
  
  // N sounds
  n: ['엔', '니'],
  na: ['나', '내'],
  ni: ['니', '나이'],
  no: ['노'],
  
  // O sounds
  o: ['오', '어'],
  
  // P sounds
  p: ['피', '페'],
  pa: ['파', '패'],
  pe: ['페', '피'],
  
  // R sounds
  r: ['알', '리'],
  ra: ['라', '래'],
  ri: ['리', '라이'],
  ro: ['로'],
  
  // S sounds
  s: ['에스', '시'],
  sa: ['사', '새'],
  se: ['세', '시'],
  sh: ['시', '샤'],
  so: ['소'],
  st: ['스트', '스'],
  
  // T sounds
  t: ['티', '테'],
  ta: ['타', '태'],
  te: ['테', '티'],
  th: ['스', '쓰'],
  to: ['토'],
  
  // U sounds
  u: ['유', '우'],
  
  // V sounds
  v: ['브이', '비'],
  va: ['바', '배'],
  vi: ['비', '바이'],
  
  // W sounds
  w: ['더블유', '우'],
  
  // Y sounds
  y: ['와이', '이'],
  
  // Z sounds
  z: ['지', '제'],
};

// Gender detection based on common English name patterns
export const GENDER_HINTS: { [key: string]: 'male' | 'female' } = {
  // Male names
  john: 'male',
  james: 'male',
  michael: 'male',
  david: 'male',
  robert: 'male',
  william: 'male',
  richard: 'male',
  joseph: 'male',
  thomas: 'male',
  charles: 'male',
  daniel: 'male',
  matthew: 'male',
  christopher: 'male',
  andrew: 'male',
  joshua: 'male',
  
  // Female names
  mary: 'female',
  jennifer: 'female',
  linda: 'female',
  patricia: 'female',
  elizabeth: 'female',
  sarah: 'female',
  jessica: 'female',
  emily: 'female',
  sophia: 'female',
  olivia: 'female',
  emma: 'female',
  ava: 'female',
  isabella: 'female',
  mia: 'female',
  charlotte: 'female',
};
