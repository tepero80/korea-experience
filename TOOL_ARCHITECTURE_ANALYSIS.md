# Interactive Tools Architecture Analysis & Redesign Proposal

## 📊 현황 분석

### 기존 Tool 20개 전체 목록

| ID | Tool Name | Category | Type | Lines | Status |
|----|-----------|----------|------|-------|--------|
| 1 | Korean Name Generator | Discover Yourself | Generator | 537 | ✅ |
| 2 | What Would Your Job Be in Korea? | Discover Yourself | Quiz | 415 | ✅ |
| 3 | Which Korean City Should You Live In? | Discover Yourself | Quiz | ~350 | ✅ |
| 4 | What Korean Food Matches You? | Discover Yourself | Quiz | ~340 | ✅ |
| 5 | Which K-Drama Character Are You? | Discover Yourself | Quiz | ~380 | ✅ |
| 6 | Korean Love Compatibility | Love & Relationships | Calculator | ~420 | ✅ |
| 7 | Your Ideal Korean Partner Type | Love & Relationships | Quiz | ~400 | ✅ |
| 8 | Korean Couple Name Combiner | Love & Relationships | Generator | ~310 | ✅ |
| 9 | Your K-Drama Romance Trope | Love & Relationships | Quiz | ~390 | ✅ |
| 10 | K-Pop Stage Name Generator | Fun & Entertainment | Generator | 360 | ✅ |
| 11 | Korean Typing Speed Test | Fun & Entertainment | Game | 557 | ✅ |
| 12 | Korean Zodiac Fortune Today | Fun & Entertainment | Generator | ~330 | ✅ |
| 13 | Guess the Korean Food Photo | Fun & Entertainment | Game | 500 | ✅ |
| 14 | Your Korean Emoji Name | Fun & Entertainment | Generator | ~290 | ✅ |
| 15 | Korean Age Calculator | Plan Your Korea Trip | Calculator | 440 | ✅ |
| 16 | Korea Trip Budget Calculator | Plan Your Korea Trip | Calculator | 527 | ✅ |
| 17 | Medical Tourism Cost Estimator | Plan Your Korea Trip | Calculator | 552 | ✅ |
| 18 | Korean Business Name Generator | Life in Korea | Generator | ~370 | ✅ |
| 19 | Korean Beauty Routine Quiz | Life in Korea | Quiz | ~410 | ✅ |
| 20 | Korean Military Service Calculator | Life in Korea | Calculator | ~380 | ✅ |

**총계: 8,411 라인**

---

## 🔍 공통 기능 상세 분석

### 1. **SNS 공유 기능 (100% 중복)**

**현재 구현** (20개 tool 전부 동일 패턴):
```tsx
// 각 tool마다 4-5개 핸들러 중복
const handleShareTwitter = () => {
  const text = `내 결과는 ${result}! 🎉`;
  const url = `https://www.koreaexperience.com/tools/${slug}`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
};

const handleShareFacebook = () => {
  const url = `https://www.koreaexperience.com/tools/${slug}`;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

const handleShareInstagram = () => {
  navigator.clipboard.writeText(`내 결과는 ${result}! 🎉 ${window.location.href}`);
  alert('✅ Instagram에 공유할 내용이 복사되었어요!');
};

const handleShareThreads = () => {
  const text = `내 결과는 ${result}! 🎉`;
  const url = `https://www.koreaexperience.com/tools/${slug}`;
  window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
};

const handleCopyLink = () => {
  navigator.clipboard.writeText(window.location.href);
  alert('링크가 복사되었어요! ✅');
};
```

**UI 패턴** (모든 tool 동일):
```tsx
<div className="flex flex-wrap gap-3 justify-center">
  <button onClick={handleShareTwitter} className="...">
    Twitter 공유
  </button>
  <button onClick={handleShareFacebook} className="...">
    Facebook 공유
  </button>
  <button onClick={handleShareInstagram} className="...">
    Instagram 공유
  </button>
  <button onClick={handleShareThreads} className="...">
    Threads 공유
  </button>
  <button onClick={handleCopyLink} className="...">
    링크 복사
  </button>
</div>
```

**문제점:**
- 20개 tool × 5개 핸들러 = **100개 중복 함수**
- Alert 메시지 스타일 불일치 ("✅" vs "Copied!" vs "복사되었어요!")
- URL 생성 로직 하드코딩
- 공유 텍스트 생성 패턴 비일관적

---

### 2. **Canvas 이미지 다운로드 (100% 중복)**

**현재 구현** (각 tool마다 canvas 코드 중복):
```tsx
const handleDownload = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 800; // 또는 1200
  canvas.height = 500; // 또는 600, 630
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;

  // 그라데이션 배경 (모든 tool 유사)
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#4F46E5');
  gradient.addColorStop(1, '#7C3AED');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Tool별 커스텀 내용 렌더링
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px sans-serif';
  ctx.fillText(result.title, 50, 100);
  
  // ... 추가 렌더링 로직 (tool마다 다름)

  // 다운로드 처리 (모든 tool 동일)
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `korean-name-result.png`;
    link.click();
    URL.revokeObjectURL(url);
  });
};
```

**문제점:**
- Canvas 생성/설정 코드 **20번 중복**
- 그라데이션 생성 코드 **20번 중복**
- 다운로드 로직 **20번 중복**
- Canvas 크기 불일치 (800x500, 800x600, 1200x630 혼재)
- 폰트 로딩 없음 (시스템 폰트만 사용)

---

### 3. **OG Image 생성 (100% 중복)**

**현재 구현** (모든 tool에 opengraph-image.tsx):
```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-static';
export const revalidate = false;
export const alt = 'Korean Name Generator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ 
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // ... tool별 레이아웃
      }}>
        <div style={{ fontSize: 120 }}>🏷️</div>
        <h1>Korean Name Generator</h1>
        <p>Discover your perfect Korean name...</p>
      </div>
    ),
    { ...size }
  );
}
```

**문제점:**
- 20개 OG 이미지 파일에 동일한 보일러플레이트
- Gradient, 레이아웃, 브랜딩 요소 중복
- Tool별 차이는 emoji, title, description뿐

---

### 4. **메타데이터 생성 (80% 중복)**

**현재 구현** (각 tool page.tsx에):
```tsx
export const metadata: Metadata = {
  title: 'Korean Name Generator | Find Your Perfect Korean Name',
  description: 'Generate authentic Korean names with meanings and pronunciation. Discover your perfect Korean name based on your preferences.',
  keywords: 'korean name, korean name generator, korean names, hangul names',
  openGraph: {
    title: 'Korean Name Generator',
    description: 'Discover your perfect Korean name with meanings',
    url: 'https://www.koreaexperience.com/tools/korean-name',
    images: [{ url: '/tools/korean-name/opengraph-image' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Name Generator',
    description: 'Discover your perfect Korean name',
  },
};
```

**문제점:**
- URL, OG image path 수동 설정
- SEO 키워드 패턴 비일관적
- Twitter card 설정 중복

---

### 5. **Tool Types별 패턴**

#### **A. Quiz Type (8개 도구)**
- korea-job-quiz, korean-city-quiz, korean-food-quiz
- kdrama-character, ideal-korean-partner, kdrama-romance-trope
- korean-beauty-quiz

**공통 State 패턴:**
```tsx
const [currentQuestion, setCurrentQuestion] = useState(0);
const [answers, setAnswers] = useState<string[]>([]);
const [showResult, setShowResult] = useState(false);
const [result, setResult] = useState<ResultType | null>(null);
```

**공통 UI Flow:**
```tsx
{!showResult ? (
  // 질문 화면
  <div>
    <div className="progress-bar">{currentQuestion + 1} / {totalQuestions}</div>
    <h3>{questions[currentQuestion].question}</h3>
    <div className="options">
      {questions[currentQuestion].options.map(option => (
        <button onClick={() => handleAnswer(option.value)}>{option.label}</button>
      ))}
    </div>
  </div>
) : (
  // 결과 화면
  <ResultDisplay result={result} />
)}
```

#### **B. Calculator Type (5개 도구)**
- korean-age, trip-budget, medical-cost-estimator
- love-compatibility, military-service

**공통 State 패턴:**
```tsx
const [inputs, setInputs] = useState<InputType>({});
const [result, setResult] = useState<ResultType | null>(null);
const [errors, setErrors] = useState<Record<string, string>>({});
```

**공통 UI Flow:**
```tsx
<form onSubmit={handleCalculate}>
  <div className="input-fields">
    {/* 입력 필드들 */}
  </div>
  <button type="submit">Calculate</button>
</form>

{result && (
  <div className="result-breakdown">
    <h3>Results</h3>
    <div className="breakdown-items">
      {/* 상세 결과 */}
    </div>
  </div>
)}
```

#### **C. Generator Type (5개 도구)**
- korean-name, kpop-stage-name, business-name
- emoji-name, korean-zodiac-fortune

**공통 State 패턴:**
```tsx
const [input, setInput] = useState('');
const [options, setOptions] = useState<string[]>([]);
const [selectedResult, setSelectedResult] = useState<ResultType | null>(null);
```

**공통 UI Flow:**
```tsx
<form onSubmit={handleGenerate}>
  <input value={input} onChange={(e) => setInput(e.target.value)} />
  <button type="submit">Generate</button>
</form>

{options.length > 0 && (
  <div className="options-grid">
    {options.map(option => (
      <div onClick={() => setSelectedResult(option)}>{option}</div>
    ))}
  </div>
)}
```

#### **D. Game Type (2개 도구)**
- korean-typing-test, guess-korean-food

**공통 State 패턴:**
```tsx
const [gameStarted, setGameStarted] = useState(false);
const [score, setScore] = useState(0);
const [timeLeft, setTimeLeft] = useState(60);
const [gameOver, setGameOver] = useState(false);
const [leaderboard, setLeaderboard] = useState<Score[]>([]);
```

**공통 UI Flow:**
```tsx
{!gameStarted ? (
  <div className="game-start">
    <button onClick={startGame}>Start Game</button>
  </div>
) : !gameOver ? (
  <div className="game-play">
    <div className="timer">⏱️ {timeLeft}s</div>
    <div className="score">Score: {score}</div>
    {/* 게임 플레이 UI */}
  </div>
) : (
  <div className="game-over">
    <h3>Final Score: {score}</h3>
    <Leaderboard scores={leaderboard} />
    <button onClick={restartGame}>Play Again</button>
  </div>
)}
```

---

### 6. **Result Display 패턴 (60% 중복)**

**모든 tool의 결과 화면 공통 요소:**
```tsx
<div className="bg-white rounded-2xl p-8 shadow-lg">
  {/* 1. 결과 제목/메인 내용 */}
  <div className="result-header">
    <div className="text-6xl mb-4">{emoji}</div>
    <h2 className="text-3xl font-bold">{result.title}</h2>
  </div>

  {/* 2. 결과 설명 */}
  <div className="result-description">
    <p>{result.description}</p>
  </div>

  {/* 3. 상세 정보 (tool별 다름) */}
  <div className="result-details">
    {/* Calculator: breakdown */}
    {/* Quiz: personality analysis */}
    {/* Generator: variations */}
  </div>

  {/* 4. 공유 버튼 (100% 동일) */}
  <div className="share-buttons">
    {/* SNS 공유 버튼들 */}
  </div>

  {/* 5. 이미지 다운로드 (100% 동일) */}
  <button onClick={handleDownload}>Download Image</button>

  {/* 6. 다시하기 버튼 (100% 동일) */}
  <button onClick={handleReset}>Try Again</button>
</div>
```

---

### 7. **ToolLayout Component 사용 현황**

**현재 ToolLayout:**
```tsx
interface ToolLayoutProps {
  title: string;
  description: string;
  emoji: string;
  gradient?: string;
  children: ReactNode;
}

// 제공하는 것:
// - 헤더 (gradient + emoji + title + description)
// - Back to Tools 링크
// - 흰색 카드 컨테이너
```

**사용하는 Tool (30%):**
- medical-cost-estimator
- guess-korean-food
- (일부만 사용)

**사용하지 않는 Tool (70%):**
- korean-name, korean-age, korea-job-quiz 등
- 이유: ToolLayout이 커스텀 헤더 레이아웃 제한
- 각 tool이 독자적인 gradient/layout 선호

---

## 📦 새로운 아키텍처 제안

### Phase 1: Hooks 추출 (공통 로직 분리)

#### 1.1 `useToolShare` Hook
```tsx
// hooks/useToolShare.ts
interface UseToolShareProps {
  toolSlug: string;
  shareText: string | ((result: any) => string);
  result?: any;
}

export function useToolShare({ toolSlug, shareText, result }: UseToolShareProps) {
  const baseUrl = 'https://www.koreaexperience.com';
  const toolUrl = `${baseUrl}/tools/${toolSlug}`;
  
  const getText = () => {
    if (typeof shareText === 'function') {
      return shareText(result);
    }
    return shareText;
  };

  const shareTwitter = () => {
    const text = getText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(toolUrl)}`;
    window.open(url, '_blank');
  };

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(toolUrl)}`;
    window.open(url, '_blank');
  };

  const shareInstagram = async () => {
    const text = getText();
    await navigator.clipboard.writeText(`${text} ${toolUrl}`);
    // Toast notification instead of alert
    return true;
  };

  const shareThreads = () => {
    const text = getText();
    const url = `https://www.threads.net/intent/post?text=${encodeURIComponent(text + ' ' + toolUrl)}`;
    window.open(url, '_blank');
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(toolUrl);
    // Toast notification
    return true;
  };

  return {
    shareTwitter,
    shareFacebook,
    shareInstagram,
    shareThreads,
    copyLink,
    toolUrl
  };
}
```

**사용 예시:**
```tsx
// Before (537 lines → 5 handlers)
const handleShareTwitter = () => { /* ... */ };
const handleShareFacebook = () => { /* ... */ };
// ... 3 more handlers

// After (1 line)
const { shareTwitter, shareFacebook, shareInstagram, shareThreads, copyLink } = useToolShare({
  toolSlug: 'korean-name',
  shareText: (result) => `My Korean name is ${result.name}! 🏷️ Get yours at`,
  result
});
```

---

#### 1.2 `useCanvasDownload` Hook
```tsx
// hooks/useCanvasDownload.ts
interface CanvasConfig {
  width: number;
  height: number;
  background?: string | CanvasGradient;
  filename: string;
}

interface RenderFunction {
  (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;
}

export function useCanvasDownload(config: CanvasConfig) {
  const generateImage = (renderContent: RenderFunction) => {
    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // 기본 배경 (gradient 또는 단색)
    if (typeof config.background === 'string') {
      ctx.fillStyle = config.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#4F46E5');
      gradient.addColorStop(1, '#7C3AED');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Tool별 커스텀 렌더링
    renderContent(ctx, canvas);

    // 다운로드
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = config.filename;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  return { generateImage };
}
```

**사용 예시:**
```tsx
// Before (40+ lines of canvas code)
const handleDownload = () => {
  const canvas = document.createElement('canvas');
  // ... 40 lines
};

// After (clean!)
const { generateImage } = useCanvasDownload({
  width: 1200,
  height: 630,
  filename: 'korean-name-result.png'
});

const handleDownload = () => {
  generateImage((ctx, canvas) => {
    // Only tool-specific rendering
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(result.name, 50, 100);
    ctx.fillText(result.nameKo, 50, 180);
  });
};
```

---

#### 1.3 `useToast` Hook (Alert 대체)
```tsx
// hooks/useToast.ts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return { toasts, showToast };
}

// components/ToastContainer.tsx
export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
```

---

### Phase 2: Component 추출 (UI 패턴 통일)

#### 2.1 `ShareButtons` Component
```tsx
// components/tools/ShareButtons.tsx
interface ShareButtonsProps {
  toolSlug: string;
  shareText: string | ((result: any) => string);
  result?: any;
  variant?: 'compact' | 'full';
}

export function ShareButtons({ toolSlug, shareText, result, variant = 'full' }: ShareButtonsProps) {
  const { shareTwitter, shareFacebook, shareInstagram, shareThreads, copyLink } = useToolShare({
    toolSlug,
    shareText,
    result
  });
  const { showToast } = useToast();

  const handleInstagram = async () => {
    await shareInstagram();
    showToast('✅ Instagram에 공유할 내용이 복사되었어요!');
  };

  const handleCopyLink = async () => {
    await copyLink();
    showToast('✅ 링크가 복사되었어요!');
  };

  return (
    <div className={`flex flex-wrap gap-3 ${variant === 'compact' ? 'justify-start' : 'justify-center'}`}>
      <button 
        onClick={shareTwitter}
        className="share-btn share-btn-twitter"
      >
        <TwitterIcon /> Twitter
      </button>
      <button 
        onClick={shareFacebook}
        className="share-btn share-btn-facebook"
      >
        <FacebookIcon /> Facebook
      </button>
      <button 
        onClick={handleInstagram}
        className="share-btn share-btn-instagram"
      >
        <InstagramIcon /> Instagram
      </button>
      <button 
        onClick={shareThreads}
        className="share-btn share-btn-threads"
      >
        <ThreadsIcon /> Threads
      </button>
      <button 
        onClick={handleCopyLink}
        className="share-btn share-btn-copy"
      >
        <LinkIcon /> 링크 복사
      </button>
    </div>
  );
}
```

---

#### 2.2 Type별 Result 컴포넌트

**A. QuizResult Component:**
```tsx
// components/tools/results/QuizResult.tsx
interface QuizResultProps {
  emoji: string;
  title: string;
  description: string;
  personality?: {
    traits: string[];
    strengths: string[];
    tips: string[];
  };
  shareConfig: ShareConfig;
  onReset: () => void;
  onDownload?: () => void;
}

export function QuizResult({ 
  emoji, title, description, personality, 
  shareConfig, onReset, onDownload 
}: QuizResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="result-card"
    >
      <div className="result-header">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>

      <p className="result-description">{description}</p>

      {personality && (
        <div className="personality-details">
          <Section title="특징" items={personality.traits} />
          <Section title="강점" items={personality.strengths} />
          <Section title="팁" items={personality.tips} />
        </div>
      )}

      <div className="result-actions">
        <ShareButtons {...shareConfig} />
        {onDownload && (
          <button onClick={onDownload} className="btn-download">
            이미지 다운로드
          </button>
        )}
        <button onClick={onReset} className="btn-reset">
          다시하기
        </button>
      </div>
    </motion.div>
  );
}
```

**B. CalculatorResult Component:**
```tsx
// components/tools/results/CalculatorResult.tsx
interface CalculatorResultProps {
  title: string;
  mainValue: string | number;
  unit?: string;
  breakdown?: Array<{
    label: string;
    value: string | number;
    description?: string;
  }>;
  tips?: string[];
  shareConfig: ShareConfig;
  onReset: () => void;
  onDownload?: () => void;
}

export function CalculatorResult({ 
  title, mainValue, unit, breakdown, tips,
  shareConfig, onReset, onDownload 
}: CalculatorResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="result-card"
    >
      <div className="result-header">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="main-value">
          {mainValue} {unit && <span className="unit">{unit}</span>}
        </div>
      </div>

      {breakdown && (
        <div className="breakdown-section">
          <h3>상세 내역</h3>
          {breakdown.map((item, idx) => (
            <div key={idx} className="breakdown-item">
              <div className="breakdown-label">{item.label}</div>
              <div className="breakdown-value">{item.value}</div>
              {item.description && (
                <p className="breakdown-desc">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {tips && (
        <div className="tips-section">
          <h3>💡 팁</h3>
          <ul>
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="result-actions">
        <ShareButtons {...shareConfig} />
        {onDownload && (
          <button onClick={onDownload} className="btn-download">
            이미지 다운로드
          </button>
        )}
        <button onClick={onReset} className="btn-reset">
          다시 계산하기
        </button>
      </div>
    </motion.div>
  );
}
```

**C. GeneratorResult Component:**
```tsx
// components/tools/results/GeneratorResult.tsx
interface GeneratorResultProps {
  emoji: string;
  mainResult: {
    primary: string;
    secondary?: string;
    pronunciation?: string;
  };
  variations?: Array<{
    label: string;
    value: string;
  }>;
  meaning?: {
    title: string;
    description: string;
  };
  shareConfig: ShareConfig;
  onReset: () => void;
  onRegenerate?: () => void;
  onDownload?: () => void;
}

export function GeneratorResult({ 
  emoji, mainResult, variations, meaning,
  shareConfig, onReset, onRegenerate, onDownload 
}: GeneratorResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="result-card"
    >
      <div className="result-header">
        <div className="text-6xl mb-4">{emoji}</div>
        <h2 className="text-3xl font-bold">{mainResult.primary}</h2>
        {mainResult.secondary && (
          <h3 className="text-2xl text-gray-600">{mainResult.secondary}</h3>
        )}
        {mainResult.pronunciation && (
          <p className="pronunciation">[{mainResult.pronunciation}]</p>
        )}
      </div>

      {meaning && (
        <div className="meaning-section">
          <h3>{meaning.title}</h3>
          <p>{meaning.description}</p>
        </div>
      )}

      {variations && (
        <div className="variations-section">
          <h3>다른 옵션</h3>
          <div className="variations-grid">
            {variations.map((v, idx) => (
              <div key={idx} className="variation-item">
                <span className="variation-label">{v.label}</span>
                <span className="variation-value">{v.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="result-actions">
        <ShareButtons {...shareConfig} />
        {onDownload && (
          <button onClick={onDownload} className="btn-download">
            이미지 다운로드
          </button>
        )}
        {onRegenerate && (
          <button onClick={onRegenerate} className="btn-secondary">
            다시 생성
          </button>
        )}
        <button onClick={onReset} className="btn-reset">
          처음으로
        </button>
      </div>
    </motion.div>
  );
}
```

---

#### 2.3 `ProgressBar` Component (Quiz용)
```tsx
// components/tools/ProgressBar.tsx
interface ProgressBarProps {
  current: number;
  total: number;
  variant?: 'default' | 'gradient';
}

export function ProgressBar({ current, total, variant = 'default' }: ProgressBarProps) {
  const percentage = (current / total) * 100;
  
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-text">Question {current} of {total}</span>
        <span className="progress-percentage">{Math.round(percentage)}%</span>
      </div>
      <div className="progress-bar-bg">
        <motion.div 
          className={`progress-bar-fill ${variant === 'gradient' ? 'bg-gradient' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
```

---

### Phase 3: Enhanced ToolLayout

```tsx
// components/ToolLayout.tsx (v2)
interface ToolLayoutProps {
  // 헤더
  title: string;
  description: string;
  emoji: string;
  gradient?: string;
  
  // 메타데이터 (자동 생성)
  slug: string;
  category?: string;
  keywords?: string[];
  
  // 컨텐츠
  children: ReactNode;
  
  // Optional: Related Posts
  showRelatedPosts?: boolean;
  relatedPostsKeywords?: string[];
  
  // Optional: Monetization
  showAds?: boolean;
  adSlots?: Array<'top' | 'sidebar' | 'bottom'>;
}

export function ToolLayout({
  title, description, emoji, gradient = 'from-purple-600 to-pink-600',
  slug, category, keywords,
  children,
  showRelatedPosts = true,
  relatedPostsKeywords = [],
  showAds = false,
  adSlots = []
}: ToolLayoutProps) {
  // Auto-generate metadata
  useEffect(() => {
    document.title = `${title} | Korea Experience`;
  }, [title]);

  return (
    <>
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <ToolHeader 
              title={title}
              description={description}
              emoji={emoji}
              gradient={gradient}
            />

            {/* AdSense Top */}
            {showAds && adSlots.includes('top') && (
              <AdSlot position="top" />
            )}

            {/* Main Content */}
            <div className="mt-8">
              {children}
            </div>

            {/* Related Blog Posts */}
            {showRelatedPosts && (
              <RelatedPosts 
                toolSlug={slug}
                category={category}
                keywords={relatedPostsKeywords}
              />
            )}

            {/* AdSense Bottom */}
            {showAds && adSlots.includes('bottom') && (
              <AdSlot position="bottom" />
            )}

            {/* Back to Tools */}
            <BackToTools />
          </div>
        </div>
      </ToastProvider>
    </>
  );
}
```

---

### Phase 4: Related Posts Engine

```tsx
// components/tools/RelatedPosts.tsx
interface RelatedPostsProps {
  toolSlug: string;
  category?: string;
  keywords?: string[];
  maxPosts?: number;
}

export function RelatedPosts({ 
  toolSlug, category, keywords = [], maxPosts = 6 
}: RelatedPostsProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  
  useEffect(() => {
    const relatedPosts = getRelatedPosts(toolSlug, category, keywords, maxPosts);
    setPosts(relatedPosts);
  }, [toolSlug, category, keywords, maxPosts]);

  if (posts.length === 0) return null;

  return (
    <section className="related-posts-section">
      <div className="section-header">
        <h2 className="text-2xl font-bold">📚 관련 글 읽어보기</h2>
        <p className="text-gray-600">이 주제에 대해 더 알아보세요</p>
      </div>
      
      <div className="posts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {posts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
```

**Related Posts Algorithm:**
```tsx
// lib/related-posts.ts
interface RelatedPostsConfig {
  toolSlug: string;
  category?: string;
  keywords: string[];
  maxPosts: number;
}

export function getRelatedPosts(
  toolSlug: string, 
  category?: string, 
  keywords: string[] = [], 
  maxPosts: number = 6
): BlogPost[] {
  const allPosts = getAllPosts();
  
  // 점수 계산 로직
  const scoredPosts = allPosts.map(post => {
    let score = 0;
    
    // 1. Category 매칭 (+50점)
    if (category && post.category === category) {
      score += 50;
    }
    
    // 2. Keyword 매칭 (keyword당 +10점)
    keywords.forEach(keyword => {
      if (post.title.toLowerCase().includes(keyword.toLowerCase()) ||
          post.description?.toLowerCase().includes(keyword.toLowerCase()) ||
          post.tags?.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))) {
        score += 10;
      }
    });
    
    // 3. Tool 이름 매칭 (+30점)
    const toolName = toolSlug.replace(/-/g, ' ');
    if (post.title.toLowerCase().includes(toolName)) {
      score += 30;
    }
    
    // 4. 최신 글 우대 (최근 30일 +5점)
    const daysSincePublish = (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublish <= 30) {
      score += 5;
    }
    
    return { post, score };
  });
  
  // 점수 순으로 정렬 후 상위 N개 반환
  return scoredPosts
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPosts)
    .map(({ post }) => post);
}
```

**Tool별 Keywords 예시:**
```tsx
// korean-name tool
relatedPostsKeywords: [
  'korean name', 
  'hangul', 
  'korean culture', 
  'name meaning'
]

// trip-budget tool
relatedPostsKeywords: [
  'korea trip', 
  'travel budget', 
  'seoul', 
  'korea travel cost'
]

// medical-cost-estimator tool
relatedPostsKeywords: [
  'medical tourism', 
  'plastic surgery', 
  'korea hospital', 
  'medical procedure'
]
```

---

### Phase 5: Metadata Generator Utility

```tsx
// lib/tool-metadata.ts
interface ToolMetadata {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  emoji: string;
}

export function generateToolMetadata({
  slug, title, description, category, keywords, emoji
}: ToolMetadata): Metadata {
  const baseUrl = 'https://www.koreaexperience.com';
  const toolUrl = `${baseUrl}/tools/${slug}`;
  
  return {
    title: `${title} | Korea Experience`,
    description: description,
    keywords: keywords.join(', '),
    openGraph: {
      type: 'website',
      url: toolUrl,
      title: title,
      description: description,
      images: [{
        url: `${toolUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: title
      }],
      siteName: 'Korea Experience'
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [`${toolUrl}/opengraph-image`],
    },
    alternates: {
      canonical: toolUrl
    },
    robots: {
      index: true,
      follow: true
    }
  };
}
```

**사용 예시:**
```tsx
// app/tools/korean-name/page.tsx
export const metadata = generateToolMetadata({
  slug: 'korean-name',
  title: 'Korean Name Generator',
  description: 'Generate authentic Korean names with meanings and pronunciation. Discover your perfect Korean name based on your preferences.',
  category: 'Discover Yourself',
  keywords: ['korean name', 'korean name generator', 'hangul names', 'korean culture'],
  emoji: '🏷️'
});
```

---

### Phase 6: OG Image Generator Template

```tsx
// lib/og-image-generator.tsx
interface OGImageConfig {
  emoji: string;
  title: string;
  description: string;
  category?: string;
  gradient?: { from: string; to: string };
}

export function generateOGImage({
  emoji, title, description, category,
  gradient = { from: '#4F46E5', to: '#7C3AED' }
}: OGImageConfig) {
  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 120 }}>
          {emoji}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 style={{ 
            fontSize: 64, 
            fontWeight: 800, 
            color: 'white', 
            lineHeight: 1.1, 
            margin: 0, 
            maxWidth: '1000px' 
          }}>
            {title}
          </h1>
          <p style={{ 
            fontSize: 32, 
            color: 'rgba(255, 255, 255, 0.9)', 
            lineHeight: 1.3, 
            margin: 0, 
            maxWidth: '900px' 
          }}>
            {description}
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%' 
        }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: 'white' }}>
            🇰🇷 Korea Experience
          </span>
          {category && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              padding: '12px 28px', 
              borderRadius: '30px', 
              fontSize: 28, 
              color: 'white', 
              fontWeight: 600 
            }}>
              {category}
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

**사용 예시 (20개 tool에 재사용):**
```tsx
// app/tools/korean-name/opengraph-image.tsx
import { generateOGImage } from '@/lib/og-image-generator';

export const runtime = 'edge';
export const alt = 'Korean Name Generator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return generateOGImage({
    emoji: '🏷️',
    title: 'Korean Name Generator',
    description: 'Discover your perfect Korean name with meanings and pronunciation guide.',
    category: 'Discover Yourself'
  });
}
```

---

## 🚀 구현 순서 (Implementation Roadmap)

### **Week 1: Foundation (Hooks & Utils)**
- [ ] `useToolShare` hook 구현
- [ ] `useCanvasDownload` hook 구현
- [ ] `useToast` hook + ToastContainer 구현
- [ ] `generateToolMetadata` utility 구현
- [ ] `generateOGImage` utility 구현

### **Week 2: Components (UI Layer)**
- [ ] `ShareButtons` component
- [ ] `ProgressBar` component
- [ ] `QuizResult` component
- [ ] `CalculatorResult` component
- [ ] `GeneratorResult` component
- [ ] `GameResult` component

### **Week 3: Layout & Posts Integration**
- [ ] Enhanced `ToolLayout` v2
- [ ] `RelatedPosts` component
- [ ] Related posts algorithm 구현
- [ ] Tool별 keywords 매핑

### **Week 4: Migration (Tool별 적용)**
- [ ] 5개 도구 마이그레이션 (파일럿)
- [ ] 검증 및 피드백 수집
- [ ] 나머지 15개 도구 마이그레이션

### **Week 5: Monetization & Polish**
- [ ] AdSense 컴포넌트 통합
- [ ] Affiliate link 시스템 설계
- [ ] Performance 최적화
- [ ] SEO 검증

---

## 📈 기대 효과

### **Before → After 비교**

#### **새 도구 개발 시간:**
- **Before:** 2-4시간 (코드 중복으로 인한 복붙 & 수정)
- **After:** 15-30분 (템플릿 + 고유 로직만 작성)

#### **코드 라인 수 (평균 도구 기준):**
- **Before:** ~450 라인 (page.tsx + lib)
- **After:** ~180 라인 (70% 감소)

#### **공통 기능 코드:**
- **Before:** 20개 도구 × 100 라인 = 2,000 라인 중복
- **After:** Hooks & Components = 500 라인 (재사용)

#### **유지보수:**
- **Before:** 공유 버튼 수정 시 20개 파일 수정 필요
- **After:** ShareButtons 컴포넌트 1곳만 수정

---

## 🎯 새 도구 개발 템플릿 (Example)

```tsx
// app/tools/new-tool/page.tsx
'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { QuizResult } from '@/components/tools/results/QuizResult';
import { useToolShare, useCanvasDownload } from '@/hooks';
import { generateToolMetadata } from '@/lib/tool-metadata';

// 메타데이터 (자동 생성)
export const metadata = generateToolMetadata({
  slug: 'new-tool',
  title: 'New Tool Title',
  description: 'Tool description for SEO',
  category: 'Discover Yourself',
  keywords: ['keyword1', 'keyword2'],
  emoji: '🎯'
});

export default function NewToolPage() {
  const [result, setResult] = useState(null);
  
  // Hooks (공통 기능 자동 제공)
  const share = useToolShare({
    toolSlug: 'new-tool',
    shareText: (r) => `My result is ${r.title}! 🎯`,
    result
  });
  
  const { generateImage } = useCanvasDownload({
    width: 1200,
    height: 630,
    filename: 'new-tool-result.png'
  });

  // ✅ 이 도구만의 고유 로직 (20-30% of code)
  const handleSubmit = () => {
    const result = calculateUniqueLogic();
    setResult(result);
  };

  const handleDownload = () => {
    generateImage((ctx) => {
      // 이 도구만의 canvas 렌더링
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px sans-serif';
      ctx.fillText(result.title, 50, 100);
    });
  };

  return (
    <ToolLayout
      title="New Tool Title"
      description="Tool description"
      emoji="🎯"
      slug="new-tool"
      category="Discover Yourself"
      relatedPostsKeywords={['keyword1', 'keyword2']}
      showRelatedPosts={true}
      showAds={true}
      adSlots={['top', 'bottom']}
    >
      {!result ? (
        {/* 입력 폼 (도구별 다름) */}
        <form onSubmit={handleSubmit}>
          {/* ... */}
        </form>
      ) : (
        {/* 결과 (공통 컴포넌트 사용) */}
        <QuizResult
          emoji="🎯"
          title={result.title}
          description={result.description}
          personality={result.personality}
          shareConfig={{
            toolSlug: 'new-tool',
            shareText: (r) => `My result is ${r.title}! 🎯`,
            result
          }}
          onReset={() => setResult(null)}
          onDownload={handleDownload}
        />
      )}
    </ToolLayout>
  );
}
```

**총 코드:** ~100-150 라인 (기존 450 라인 대비 67% 감소)

---

## 💰 Monetization 전략

### AdSense 배치
```tsx
// components/AdSlot.tsx
interface AdSlotProps {
  position: 'top' | 'sidebar' | 'bottom' | 'in-result';
  format?: 'auto' | 'rectangle' | 'horizontal';
}

export function AdSlot({ position, format = 'auto' }: AdSlotProps) {
  return (
    <div className={`ad-container ad-${position}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

**권장 배치:**
- **상단 (Top):** 헤더 바로 아래 (모든 도구)
- **결과 하단 (In-Result):** 공유 버튼 위 (Quiz/Generator 결과)
- **Related Posts 사이 (Bottom):** 관련 글 위 (모든 도구)

### Affiliate Link 전략
```tsx
// components/tools/AffiliateCard.tsx
interface AffiliateCardProps {
  type: 'booking' | 'product' | 'course';
  title: string;
  description: string;
  link: string;
  image?: string;
}

export function AffiliateCard({ type, title, description, link, image }: AffiliateCardProps) {
  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="affiliate-card"
    >
      {image && <img src={image} alt={title} />}
      <div className="affiliate-content">
        <h4>{title}</h4>
        <p>{description}</p>
        <span className="affiliate-cta">자세히 보기 →</span>
      </div>
    </a>
  );
}
```

**Tool별 Affiliate 예시:**
- **trip-budget:** Booking.com 호텔 링크
- **medical-cost-estimator:** Medical tourism agency 링크
- **korean-typing-test:** Korean keyboard 제품 링크
- **korean-beauty-quiz:** K-Beauty 제품 링크 (Amazon Affiliate)

---

## 📝 Tool별 Related Posts Mapping

```tsx
// lib/tool-related-posts-config.ts
export const TOOL_RELATED_POSTS_CONFIG = {
  'korean-name': {
    category: 'Culture',
    keywords: ['korean name', 'hangul', 'korean culture', 'name meaning']
  },
  'korea-job-quiz': {
    category: 'Work & Study',
    keywords: ['korea job', 'working in korea', 'korean workplace', 'career']
  },
  'korean-city-quiz': {
    category: 'Travel',
    keywords: ['seoul', 'busan', 'jeju', 'korean city', 'where to live']
  },
  'korean-food-quiz': {
    category: 'Food & Dining',
    keywords: ['korean food', 'korean cuisine', 'restaurant', 'food guide']
  },
  'kdrama-character': {
    category: 'Entertainment',
    keywords: ['kdrama', 'korean drama', 'netflix korea', 'drama recommendation']
  },
  'love-compatibility': {
    category: 'Culture',
    keywords: ['korean dating', 'relationship', 'love', 'korean culture']
  },
  'korean-age': {
    category: 'Culture',
    keywords: ['korean age', 'age system', 'korean culture', 'birthday']
  },
  'trip-budget': {
    category: 'Travel',
    keywords: ['korea travel', 'travel budget', 'travel cost', 'trip planning', 'seoul budget']
  },
  'medical-cost-estimator': {
    category: 'Medical',
    keywords: ['medical tourism', 'plastic surgery', 'hospital', 'medical procedure', 'surgery cost']
  },
  // ... 나머지 도구들
};
```

---

## 🎨 Tailwind CSS 공통 스타일 (globals.css 추가)

```css
/* Tool 공통 스타일 */
@layer components {
  /* Result Card */
  .result-card {
    @apply bg-white rounded-2xl p-8 shadow-lg;
  }
  
  .result-header {
    @apply text-center mb-6;
  }
  
  .result-description {
    @apply text-lg text-gray-700 mb-6 leading-relaxed;
  }
  
  /* Share Buttons */
  .share-btn {
    @apply px-4 py-2 rounded-lg font-medium transition-all duration-200 
           flex items-center gap-2 hover:scale-105 hover:shadow-md;
  }
  
  .share-btn-twitter {
    @apply bg-[#1DA1F2] text-white hover:bg-[#1a8cd8];
  }
  
  .share-btn-facebook {
    @apply bg-[#4267B2] text-white hover:bg-[#365899];
  }
  
  .share-btn-instagram {
    @apply bg-gradient-to-br from-purple-600 to-pink-600 text-white;
  }
  
  .share-btn-threads {
    @apply bg-black text-white hover:bg-gray-800;
  }
  
  .share-btn-copy {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
  }
  
  /* Action Buttons */
  .btn-download {
    @apply px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
           text-white rounded-lg font-semibold hover:from-purple-700 
           hover:to-pink-700 transition-all duration-200 hover:scale-105;
  }
  
  .btn-reset {
    @apply px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 
           rounded-lg font-semibold hover:bg-purple-50 transition-all;
  }
  
  .btn-secondary {
    @apply px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold 
           hover:bg-gray-300 transition-all;
  }
  
  /* Progress Bar */
  .progress-container {
    @apply mb-6;
  }
  
  .progress-info {
    @apply flex justify-between mb-2 text-sm font-medium text-gray-700;
  }
  
  .progress-bar-bg {
    @apply w-full h-3 bg-gray-200 rounded-full overflow-hidden;
  }
  
  .progress-bar-fill {
    @apply h-full bg-purple-600 transition-all duration-300;
  }
  
  .progress-bar-fill.bg-gradient {
    @apply bg-gradient-to-r from-purple-600 to-pink-600;
  }
  
  /* Related Posts Section */
  .related-posts-section {
    @apply mt-12 bg-white rounded-2xl p-8 shadow-lg;
  }
  
  .section-header {
    @apply text-center mb-8;
  }
  
  .posts-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
  }
  
  /* Toast */
  .toast {
    @apply px-6 py-3 rounded-lg shadow-lg text-white font-medium 
           animate-slide-in-right;
  }
  
  .toast-success {
    @apply bg-green-500;
  }
  
  .toast-error {
    @apply bg-red-500;
  }
  
  .toast-info {
    @apply bg-blue-500;
  }
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
```

---

## 🧪 테스트 체크리스트

### Hooks 테스트
- [ ] useToolShare: 모든 SNS 공유 정상 작동
- [ ] useCanvasDownload: 이미지 생성 및 다운로드
- [ ] useToast: 알림 표시 및 자동 닫힘

### Components 테스트
- [ ] ShareButtons: 모든 버튼 클릭 동작
- [ ] QuizResult: 결과 표시 및 공유
- [ ] CalculatorResult: Breakdown 표시
- [ ] GeneratorResult: 변형 옵션 표시
- [ ] RelatedPosts: 관련 글 정확히 추천

### SEO 테스트
- [ ] 메타데이터 자동 생성 확인
- [ ] OG 이미지 정상 표시 (Twitter, Facebook)
- [ ] Canonical URL 설정
- [ ] Schema.org markup (선택 사항)

### Performance 테스트
- [ ] Canvas 생성 속도 (<100ms)
- [ ] Related posts 로딩 시간
- [ ] Lighthouse Score 90+ 유지

---

## 📊 Migration 순서 (파일럿 → 전체)

### Phase 1: 파일럿 (5개 도구)
1. **korean-name** (Generator type)
2. **korea-job-quiz** (Quiz type)
3. **korean-age** (Calculator type)
4. **korean-typing-test** (Game type)
5. **love-compatibility** (Compatibility type)

→ 각 타입별 1개씩 먼저 마이그레이션하여 검증

### Phase 2: 전체 마이그레이션 (15개)
- Quiz 타입 나머지 (7개)
- Calculator 타입 나머지 (4개)
- Generator 타입 나머지 (4개)

---

## 🎯 최종 목표

### 개발 속도
- **현재:** 새 도구 1개 개발 = 2-4시간
- **목표:** 새 도구 1개 개발 = 15-30분 (88% 시간 절감)

### 코드 품질
- **현재:** 8,411 라인 (중복 많음)
- **목표:** ~3,500 라인 (60% 감소, 재사용성 높음)

### 유지보수성
- **현재:** 공통 기능 수정 시 20개 파일 수정
- **목표:** 1개 컴포넌트/Hook만 수정

### 사용자 경험
- **현재:** 도구마다 UI/UX 미묘하게 다름
- **목표:** 일관된 UX, 빠른 로딩, Toast 알림

### SEO & 수익화
- **현재:** SEO 일부 누락, 수익화 없음
- **목표:** 완벽한 SEO, Related Posts로 체류시간 증가, AdSense + Affiliate 통합

---

## 🔥 Quick Start Guide (개발자용)

### 새 도구 만드는 법 (템플릿)

1. **폴더 생성:**
   ```bash
   mkdir app/tools/my-new-tool
   ```

2. **page.tsx 템플릿 복사:**
   ```tsx
   // app/tools/my-new-tool/page.tsx
   'use client';
   
   import { useState } from 'react';
   import ToolLayout from '@/components/ToolLayout';
   import { QuizResult } from '@/components/tools/results/QuizResult';
   import { useToolShare, useCanvasDownload } from '@/hooks';
   import { generateToolMetadata } from '@/lib/tool-metadata';
   
   export const metadata = generateToolMetadata({
     slug: 'my-new-tool',
     title: 'My New Tool',
     description: '...',
     category: 'Discover Yourself',
     keywords: ['keyword1', 'keyword2'],
     emoji: '🎯'
   });
   
   export default function MyNewToolPage() {
     // ... 고유 로직만 작성
   }
   ```

3. **Logic 파일 생성:**
   ```tsx
   // lib/my-new-tool.ts
   export interface MyResult {
     // ...
   }
   
   export function calculateResult(input: any): MyResult {
     // 고유 계산 로직
   }
   ```

4. **OG 이미지 생성:**
   ```tsx
   // app/tools/my-new-tool/opengraph-image.tsx
   import { generateOGImage } from '@/lib/og-image-generator';
   
   export default async function Image() {
     return generateOGImage({
       emoji: '🎯',
       title: 'My New Tool',
       description: '...',
       category: 'Discover Yourself'
     });
   }
   ```

5. **constants.ts에 등록:**
   ```tsx
   // lib/constants.ts
   export const ALL_TOOLS = [
     // ...
     { 
       id: 21, 
       href: '/tools/my-new-tool', 
       title: 'My New Tool', 
       category: 'Discover Yourself', 
       // ...
     },
   ];
   ```

**완료!** ✅ 15-30분 안에 완성

---

## 📚 다음 단계

1. **Hooks 구현 시작** (useToolShare, useCanvasDownload, useToast)
2. **ShareButtons 컴포넌트 구현**
3. **파일럿 도구 1개 마이그레이션** (korean-name 추천)
4. **검증 및 피드백**
5. **나머지 도구 마이그레이션**
6. **Related Posts 엔진 구현**
7. **AdSense 통합**

---

이 문서를 기반으로 단계별로 진행하시면 됩니다. 어떤 단계부터 시작할까요?
