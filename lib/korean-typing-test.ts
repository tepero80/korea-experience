// Korean Typing Speed Test Data and Logic

export interface TypingText {
  id: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  text: string;
  description: string;
}

export interface TypingResult {
  wpm: number; // Words (characters) per minute
  accuracy: number; // Percentage
  totalChars: number;
  correctChars: number;
  incorrectChars: number;
  time: number; // seconds
  difficulty: string;
  rating: string;
  feedback: string;
  tips: string[];
}

export interface LeaderboardEntry {
  id: string;
  date: string;
  wpm: number;
  accuracy: number;
  difficulty: string;
}

// Typing test texts - organized by difficulty
export const typingTexts: TypingText[] = [
  // Beginner Level (짧고 쉬운 일상 문장)
  {
    id: 'beginner-1',
    difficulty: 'beginner',
    text: '안녕하세요. 저는 한국어를 배우고 있어요. 한글은 정말 아름다운 문자예요. 매일 조금씩 연습하면 실력이 늘어요.',
    description: 'Simple daily conversation',
  },
  {
    id: 'beginner-2',
    difficulty: 'beginner',
    text: '오늘은 날씨가 좋아요. 공원에 가서 산책을 하고 싶어요. 친구들과 함께 맛있는 음식을 먹을 거예요.',
    description: 'Talking about weather and plans',
  },
  {
    id: 'beginner-3',
    difficulty: 'beginner',
    text: '저는 커피를 좋아해요. 아침마다 카페에 가요. 라떼가 제일 맛있어요. 빵도 같이 먹어요.',
    description: 'About daily habits',
  },
  {
    id: 'beginner-4',
    difficulty: 'beginner',
    text: '한국 드라마를 보는 것이 재미있어요. 배우들이 멋져요. 이야기가 흥미로워요. 다음 편이 기대돼요.',
    description: 'Watching K-dramas',
  },
  {
    id: 'beginner-5',
    difficulty: 'beginner',
    text: '주말에는 집에서 쉬어요. 영화를 보거나 음악을 들어요. 가족과 시간을 보내는 것이 좋아요.',
    description: 'Weekend activities',
  },

  // Intermediate Level (중간 길이, 다양한 어휘)
  {
    id: 'intermediate-1',
    difficulty: 'intermediate',
    text: '한국의 전통 문화는 매우 다채롭고 흥미로워요. 한복은 아름다운 전통 의상이고, 김치는 건강에 좋은 발효 음식이에요. 설날과 추석 같은 명절에는 가족들이 모여서 함께 시간을 보내요.',
    description: 'Korean traditional culture',
  },
  {
    id: 'intermediate-2',
    difficulty: 'intermediate',
    text: '서울은 현대적인 도시와 전통이 조화를 이루는 곳이에요. 높은 빌딩 사이에 오래된 궁궐이 자리하고 있어요. 지하철로 어디든 쉽게 갈 수 있고, 밤늦게까지 활기가 넘쳐요.',
    description: 'About Seoul city',
  },
  {
    id: 'intermediate-3',
    difficulty: 'intermediate',
    text: '한국의 교육열은 세계적으로 유명해요. 많은 학생들이 대학 입시를 위해 열심히 공부해요. 학원에서 추가로 수업을 듣는 것이 일반적이에요. 부모님들은 자녀 교육에 많은 관심을 가져요.',
    description: 'Education in Korea',
  },
  {
    id: 'intermediate-4',
    difficulty: 'intermediate',
    text: '케이팝은 전 세계적으로 인기를 얻고 있어요. 멋진 안무와 중독성 있는 멜로디가 특징이에요. 팬들은 콘서트에 가거나 앨범을 수집해요. 한국어를 배우려는 외국인들도 많아졌어요.',
    description: 'K-pop phenomenon',
  },
  {
    id: 'intermediate-5',
    difficulty: 'intermediate',
    text: '한국 요리는 다양한 반찬과 함께 나와요. 밥, 국, 김치는 기본이고, 여러 종류의 밑반찬이 함께 제공돼요. 고기를 구워 먹는 삼겹살과 갈비도 인기가 많아요. 매운 음식을 좋아하는 사람들이 많아요.',
    description: 'Korean cuisine',
  },

  // Advanced Level (긴 문장, 복잡한 어휘, 빠른 타이핑 필요)
  {
    id: 'advanced-1',
    difficulty: 'advanced',
    text: '한국의 경제 발전은 지난 수십 년간 놀라운 속도로 이루어졌어요. 한국전쟁 이후 폐허가 된 나라에서 시작해서, 오늘날에는 세계 10위권의 경제 대국이 되었어요. 반도체, 자동차, 조선, 전자제품 등 다양한 산업 분야에서 글로벌 경쟁력을 갖추고 있어요. 삼성, 현대, LG 같은 기업들은 세계적으로 유명한 브랜드가 되었고, 혁신적인 기술 개발로 시장을 선도하고 있어요.',
    description: 'Korean economic development',
  },
  {
    id: 'advanced-2',
    difficulty: 'advanced',
    text: '한글은 1443년 세종대왕이 창제한 독창적인 문자 체계예요. 백성들이 쉽게 글을 읽고 쓸 수 있도록 만들어진 과학적인 문자로, 유네스코 세계기록유산으로 등재되었어요. 자음과 모음의 조합으로 이루어져 있으며, 발음 기관의 모양을 본떠서 만들어졌다는 점이 특징이에요. 배우기 쉽고 표현력이 뛰어나서 정보화 시대에 매우 적합한 문자로 평가받고 있어요.',
    description: 'Hangul writing system',
  },
  {
    id: 'advanced-3',
    difficulty: 'advanced',
    text: '한국의 정보통신 기술은 세계 최고 수준이에요. 초고속 인터넷 보급률이 매우 높고, 5G 네트워크를 세계에서 가장 먼저 상용화했어요. 스마트폰 사용률도 높아서 거의 모든 사람들이 모바일 기기를 통해 일상생활의 많은 부분을 처리해요. 배달 앱, 금융 앱, 교통 앱 등 다양한 서비스들이 발달했고, 전자정부 시스템도 잘 구축되어 있어요. 이러한 디지털 인프라는 코로나19 팬데믹 상황에서도 사회가 원활하게 작동하는 데 큰 역할을 했어요.',
    description: 'Korean IT infrastructure',
  },
  {
    id: 'advanced-4',
    difficulty: 'advanced',
    text: '한류는 1990년대 후반부터 시작된 한국 대중문화의 세계적 확산 현상을 의미해요. 처음에는 드라마를 중심으로 아시아 지역에서 인기를 얻었지만, 2000년대 들어 케이팝의 급성장과 함께 전 세계로 확산되었어요. 방탄소년단, 블랙핑크 같은 그룹들이 빌보드 차트 1위를 차지하고, 기생충과 오징어게임 같은 영화와 드라마가 국제적인 상을 받으면서 한국 문화에 대한 관심이 폭발적으로 증가했어요. 이는 한국어 학습 열풍으로 이어져서 전 세계적으로 한국어를 배우는 사람들이 크게 늘어났어요.',
    description: 'Korean Wave (Hallyu)',
  },
  {
    id: 'advanced-5',
    difficulty: 'advanced',
    text: '한국의 의료 시스템은 효율성과 접근성 면에서 높은 평가를 받고 있어요. 국민건강보험 제도를 통해 전 국민이 의료 혜택을 받을 수 있고, 병원 시설과 의료진의 수준도 매우 높아요. 특히 성형외과, 피부과, 안과 등의 분야에서는 세계적인 기술력을 인정받아 의료 관광객들이 많이 찾고 있어요. 최첨단 의료 장비와 숙련된 의료진, 합리적인 가격이 결합되어 한국을 의료 관광의 중심지로 만들고 있어요. 앞으로도 바이오 산업과 디지털 헬스케어 분야에서 더욱 발전할 것으로 기대되고 있어요.',
    description: 'Korean healthcare system',
  },
];

// Get random text by difficulty
export function getRandomText(difficulty: 'beginner' | 'intermediate' | 'advanced'): TypingText {
  const texts = typingTexts.filter(t => t.difficulty === difficulty);
  return texts[Math.floor(Math.random() * texts.length)];
}

// Calculate typing result
export function calculateTypingResult(
  originalText: string,
  typedText: string,
  timeInSeconds: number,
  difficulty: string
): TypingResult {
  const totalChars = originalText.length;
  const typedChars = typedText.length;
  
  // Calculate correct characters
  let correctChars = 0;
  for (let i = 0; i < Math.min(totalChars, typedChars); i++) {
    if (originalText[i] === typedText[i]) {
      correctChars++;
    }
  }
  
  const incorrectChars = typedChars - correctChars;
  
  // Calculate accuracy (0-100%)
  const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
  
  // Calculate WPM (Korean characters per minute)
  // For Korean, we count characters instead of "words"
  const wpm = Math.round((typedChars / timeInSeconds) * 60);
  
  // Determine rating based on WPM and difficulty
  let rating = '';
  let feedback = '';
  
  if (difficulty === 'beginner') {
    if (wpm >= 150 && accuracy >= 95) {
      rating = '🏆 Master';
      feedback = 'Outstanding! You type faster than 95% of people!';
    } else if (wpm >= 120 && accuracy >= 90) {
      rating = '⭐ Excellent';
      feedback = 'Great job! Your typing speed is excellent!';
    } else if (wpm >= 90 && accuracy >= 85) {
      rating = '👍 Good';
      feedback = 'Good work! Keep practicing to improve further.';
    } else if (wpm >= 60 && accuracy >= 75) {
      rating = '📝 Average';
      feedback = 'Not bad! With more practice, you can improve significantly.';
    } else {
      rating = '🌱 Beginner';
      feedback = 'Great start! Keep practicing every day to see improvement.';
    }
  } else if (difficulty === 'intermediate') {
    if (wpm >= 180 && accuracy >= 95) {
      rating = '🏆 Master';
      feedback = 'Incredible! You are a typing master!';
    } else if (wpm >= 140 && accuracy >= 90) {
      rating = '⭐ Excellent';
      feedback = 'Impressive! Your typing skills are excellent!';
    } else if (wpm >= 110 && accuracy >= 85) {
      rating = '👍 Good';
      feedback = 'Good job! You are above average!';
    } else if (wpm >= 80 && accuracy >= 75) {
      rating = '📝 Average';
      feedback = 'Decent speed! Keep practicing for better results.';
    } else {
      rating = '🌱 Developing';
      feedback = 'Keep going! Practice makes perfect.';
    }
  } else { // advanced
    if (wpm >= 200 && accuracy >= 95) {
      rating = '🏆 Master';
      feedback = 'Phenomenal! You are among the top 1% of typists!';
    } else if (wpm >= 160 && accuracy >= 90) {
      rating = '⭐ Excellent';
      feedback = 'Amazing! Your typing skills are top-notch!';
    } else if (wpm >= 130 && accuracy >= 85) {
      rating = '👍 Good';
      feedback = 'Well done! You have strong typing skills!';
    } else if (wpm >= 100 && accuracy >= 75) {
      rating = '📝 Average';
      feedback = 'Good effort! More practice will help you improve.';
    } else {
      rating = '🌱 Developing';
      feedback = 'Don\'t give up! Advanced texts are challenging.';
    }
  }
  
  // Generate personalized tips
  const tips: string[] = [];
  
  if (accuracy < 85) {
    tips.push('🎯 Focus on accuracy first, then speed. Slow down and type carefully.');
  }
  
  if (accuracy >= 95) {
    tips.push('✨ Excellent accuracy! Try to increase your speed gradually.');
  }
  
  if (wpm < 100) {
    tips.push('⌨️ Practice touch typing without looking at the keyboard.');
  }
  
  if (wpm >= 150) {
    tips.push('🚀 Amazing speed! Try more difficult texts to challenge yourself.');
  }
  
  tips.push('📅 Practice for 10-15 minutes daily for consistent improvement.');
  tips.push('💪 Take regular breaks to avoid finger fatigue.');
  
  if (difficulty === 'beginner') {
    tips.push('🎓 Try intermediate level when you consistently score above 90 WPM.');
  } else if (difficulty === 'intermediate') {
    tips.push('🎓 Challenge yourself with advanced texts when ready.');
  }
  
  return {
    wpm,
    accuracy: Math.round(accuracy * 10) / 10, // Round to 1 decimal
    totalChars,
    correctChars,
    incorrectChars,
    time: timeInSeconds,
    difficulty,
    rating,
    feedback,
    tips,
  };
}

// Leaderboard management (localStorage)
export function saveScore(result: TypingResult): void {
  if (typeof window === 'undefined') return;
  
  const entry: LeaderboardEntry = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    wpm: result.wpm,
    accuracy: result.accuracy,
    difficulty: result.difficulty,
  };
  
  const leaderboard = getLeaderboard();
  leaderboard.push(entry);
  
  // Keep only top 20 scores
  leaderboard.sort((a, b) => b.wpm - a.wpm);
  const topScores = leaderboard.slice(0, 20);
  
  localStorage.setItem('korean-typing-leaderboard', JSON.stringify(topScores));
}

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem('korean-typing-leaderboard');
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getPersonalBest(difficulty?: string): LeaderboardEntry | null {
  const leaderboard = getLeaderboard();
  
  const filtered = difficulty 
    ? leaderboard.filter(e => e.difficulty === difficulty)
    : leaderboard;
  
  if (filtered.length === 0) return null;
  
  return filtered.reduce((best, current) => 
    current.wpm > best.wpm ? current : best
  );
}

export function getDifficultyLabel(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'Beginner 초급';
    case 'intermediate':
      return 'Intermediate 중급';
    case 'advanced':
      return 'Advanced 고급';
    default:
      return difficulty;
  }
}
