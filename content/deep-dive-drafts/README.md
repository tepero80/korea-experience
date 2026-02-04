# Deep Dive Draft → MDX 변환 가이드

> 이 문서는 AI 에이전트가 Deep Research 드래프트 파일을 MDX로 변환할 때 참고하는 **완전한 가이드**입니다.

---

## 📋 빠른 시작 (AI 에이전트용)

사용자가 **"draft 파일 mdx로 변환해줘"** 라고 요청하면:

1. 이 폴더의 `.txt` 파일 목록 확인
2. **빈 파일 제외** (내용이 없거나 너무 짧은 파일)
3. **이미 변환된 파일 제외** (아래 목록 참조)
4. 남은 파일들을 MDX로 변환하여 `content/deep-dive/` 폴더에 저장
5. **드래프트 원본 파일은 절대 삭제하지 않음** (유지!)
6. `npm run build`로 빌드 검증

---

## ✅ 이미 변환 완료된 파일

| # | 드래프트 파일명 | MDX 파일명 | 변환일 |
|---|----------------|-----------|--------|
| 1 | `1. [M] Medical Tourism Visa (C-3-3) 2026 requirements.txt` | `medical-tourism-visa-c33-2026.md` | 2026-02-05 |
| 2 | `2. [T] Climate Card vs. T-money Which transit pass is best.txt` | `seoul-transit-climate-card-vs-tmoney-2026.md` | 2026-02-05 |
| 3 | `3. [K] 10 social rules that will make you look like a local.txt` | `korea-social-rules-local-guide-2026.md` | 2026-02-05 |

> ⚠️ **중요**: 새로 변환할 때마다 이 목록을 업데이트하세요!

---

## 📁 파일 구조

```
content/
├── deep-dive-drafts/          ← 드래프트 원본 (Gemini Deep Research 출력)
│   ├── PROMPT.md              ← Deep Research용 프롬프트 템플릿
│   ├── README.md              ← 이 파일
│   ├── todo.md                ← 전체 주제 목록 (600개)
│   └── *.txt                  ← 드래프트 파일들
│
└── deep-dive/                 ← 변환된 MDX 파일들
    └── *.md                   ← 최종 MDX 파일들
```

---

## 🔄 변환 프로세스

### Step 1: 드래프트 파일 구조 파악

드래프트 파일은 다음 섹션들을 포함합니다 (순서대로):

```
TITLE
EXCERPT
CATEGORY
KEY TAKEAWAYS (3개)
QUICK FACTS (테이블)
TIMELINE (테이블)
COMPARISON TABLE (테이블)
PROS AND CONS
STEP-BY-STEP GUIDE
EXPERT TIP
WARNINGS AND TIPS (Pro Tip, Warning, No-ARC Solution)
FAQ (5개)
SOURCES (5개 URL)
ARTICLE BODY (Section 1~5 + Conclusion)
```

> ⚠️ **중요 특성**: 
> - Gemini Deep Research에서 복사한 드래프트는 **줄바꿈 없이 연속**되어 있을 수 있음
> - 테이블은 마크다운이 아닌 **plain text**로 되어 있음 (수동 파싱 필요)
> - LaTeX 수식 사용: `$₩10,320$`, `$42\%$`, `$\approx$` 등 → 일반 텍스트로 변환

### Step 2: MDX 파일 생성

#### 2.1 Frontmatter 작성

```yaml
---
title: "[TITLE 섹션의 내용 - 따옴표로 감싸기]"
date: 2026-02-05  # 변환 당일 날짜
excerpt: "[EXCERPT 섹션의 내용]"
category: [CATEGORY 섹션의 내용]  # 6개 중 하나 (정확히 일치해야 함)
author: Korea Experience Team
deepDive: true
deepDiveOrder: [다음 순번]  # 기존 파일들의 deepDiveOrder 확인 후 +1
---
```

**deepDiveOrder 결정 방법:**
```powershell
# 기존 파일들의 deepDiveOrder 확인
Select-String -Path "C:\kc\korea-experience\content\deep-dive\*.md" -Pattern "deepDiveOrder" | Sort-Object
```
현재 가장 높은 값 + 1을 사용합니다. (현재: 4가 마지막)

**카테고리 옵션 (정확히 이 중 하나만 사용):**
- `Medical Tourism`
- `Travel & Tourism`
- `Food & Dining`
- `K-Culture`
- `Shopping & K-Beauty`
- `Living in Korea`

#### 2.2 파일명 규칙

- 소문자 + 하이픈 연결
- 2026이 포함된 주제는 파일명에도 포함
- 특수문자, 괄호 제거
- 예: `seoul-transit-climate-card-vs-tmoney-2026.md`

#### 2.3 컴포넌트 배치 순서 (권장)

실제 MDX 파일에서 컴포넌트는 본문 사이에 자연스럽게 배치됩니다:

```
1. 도입부 (1-2 문단) + **볼드로 핵심 답변**
2. <KeyTakeaways />
3. 첫 번째 본문 섹션 (2-3 문단)
4. <QuickFacts />
5. 배경/역사 섹션
6. <Timeline />
7. 비교/옵션 설명 섹션
8. <ComparisonTable />
9. <ProsCons />
10. How-To 섹션
11. <StepGuide />
12. <ExpertTip />
13. 추가 팁/규칙 섹션 (Rule 1, Rule 2... 등)
14. <InfoBox type="tip" />
15. <InfoBox type="warning" />
16. <InfoBox type="arc-free" />  ← 필수!
17. The Stuff Nobody Tells You 섹션
18. <FAQAccordion />
19. 결론/Action Plan
20. --- (구분선)
21. Sources 섹션
```

> 💡 **팁**: 컴포넌트는 관련 본문 바로 뒤에 배치하여 시각적 휴식을 줍니다.

---

## 🧩 MDX 컴포넌트 변환 가이드

### 1. KeyTakeaways

**드래프트 형식:**
```
KEY TAKEAWAYS
1. [첫 번째 포인트]
2. [두 번째 포인트]
3. [세 번째 포인트]
```

**MDX 변환:**
```jsx
<KeyTakeaways 
  points={[
    "첫 번째 포인트 내용",
    "두 번째 포인트 내용",
    "세 번째 포인트 내용"
  ]}
  readTime={12}
  lastUpdated="2026-02-05"
/>
```

**readTime 계산 기준:**
| 글자 수 (영문 기준) | readTime |
|-------------------|----------|
| 3,000-4,000 words | 10-12분 |
| 4,000-5,500 words | 12-15분 |
| 5,500-7,000 words | 15-18분 |
| 7,000+ words | 18-20분 |

---

### 2. QuickFacts

**드래프트 형식:**
```
QUICK FACTS
Label          Value
1-Day Card     ₩5,000
Base Fare      ₩1,400
```

**MDX 변환:**
```jsx
<QuickFacts
  title="[적절한 제목]"
  facts={[
    { label: "1-Day Card", value: "₩5,000", icon: "🎫" },
    { label: "Base Fare", value: "₩1,400", icon: "🚇" },
    { label: "Third Item", value: "Value", icon: "💳" }
  ]}
  columns={3}
/>
```

**아이콘 선택 가이드:**
| 카테고리 | 추천 아이콘 |
|---------|-----------|
| 비용/가격 | 💰 💳 🎫 💵 |
| 시간/기간 | ⏰ 📅 🕐 ⌛ |
| 인원/수량 | 👥 📊 📈 🔢 |
| 위치/장소 | 📍 🗺️ 🏥 🏢 |
| 교통 | 🚇 🚌 ✈️ 🚕 |
| 음식 | 🍜 🍖 ☕ 🍽️ |
| 문화 | 🎭 🎬 🎵 📸 |

---

### 3. Timeline

**드래프트 형식:**
```
TIMELINE
Year    Event              Description
2023    Announcement       Government unveils plan
2024    Pilot Launch       Test run begins
```

**MDX 변환:**
```jsx
<Timeline
  title="[타임라인 제목]"
  items={[
    { time: "2023", title: "Announcement", description: "Government unveils plan", icon: "📢" },
    { time: "Jan 2024", title: "Pilot Launch", description: "Test run begins", icon: "🚀" },
    { time: "2025", title: "Expansion", description: "Service expands nationwide", icon: "🗺️" },
    { time: "2026", title: "Current", description: "Full connectivity achieved", icon: "✨" }
  ]}
/>
```

---

### 4. ComparisonTable

**드래프트 형식:**
```
COMPARISON TABLE
Feature       Option A        Option B        Option C
Cost          ₩5,000          ₩3,000          ₩10,000
Best For      Tourists        Locals          Shoppers
```

**MDX 변환:**
```jsx
<ComparisonTable
  title="[비교표 제목]"
  headers={["Feature", "Option A", "Option B", "Option C"]}
  rows={[
    { feature: "Cost", option1: "₩5,000", option2: "₩3,000", option3: "₩10,000" },
    { feature: "Best For", option1: "Tourists", option2: "Locals", option3: "Shoppers" },
    { feature: "Requirements", option1: "None", option2: "ARC", option3: "Bank Account" }
  ]}
/>
```

> ⚠️ **주의**: 키 이름은 반드시 `feature`, `option1`, `option2`, `option3`으로 고정!

---

### 5. ProsCons

**드래프트 형식:**
```
PROS AND CONS
Pros:
1. Benefit Name: Explanation
2. Second Benefit: Explanation

Cons:
1. Drawback Name: Explanation
2. Second Drawback: Explanation
```

**MDX 변환:**
```jsx
<ProsCons
  title="[제목]"
  pros={[
    "Benefit Name: Full explanation here",
    "Second Benefit: Full explanation here",
    "Third Benefit: Full explanation here"
  ]}
  cons={[
    "Drawback Name: Full explanation here",
    "Second Drawback: Full explanation here",
    "Third Drawback: Full explanation here"
  ]}
  variant="cards"
/>
```

> **참고**: `variant="cards"` 는 모든 Deep Dive 글에서 사용합니다.

---

### 6. StepGuide ⚠️ 주의사항 있음

**드래프트 형식:**
```
STEP-BY-STEP GUIDE
Guide Title: How to Get Your Card
Total Time: 5 Minutes
Difficulty: Easy

Step 1: Find the Store
Description here
Pro Tip: Insider advice

Step 2: Buy the Card
Description here
Pro Tip: Insider advice
```

**MDX 변환:**
```jsx
<StepGuide
  title="How to Get Your Card"
  totalTime="5 Minutes"
  difficulty="easy"
  steps={[
    {
      title: "Find the Store",
      description: "Description here with 2-3 sentences.",
      tip: "Insider advice for this step."
    },
    {
      title: "Buy the Card",
      description: "Description here with 2-3 sentences.",
      tip: "Insider advice for this step."
    }
  ]}
/>
```

> 🚨 **매우 중요**: `difficulty` 값은 반드시 **소문자**로!
> 
> | ❌ 잘못됨 | ✅ 올바름 |
> |----------|----------|
> | `"Easy"` | `"easy"` |
> | `"Medium"` | `"medium"` |
> | `"Hard"` | `"hard"` |
> 
> 대문자 사용 시 빌드가 실패합니다!

---

### 7. ExpertTip

**드래프트 형식:**
```
EXPERT TIP
Name: Ji-hoon Park
Role: Urban Mobility Consultant, 12 years in Seoul
Quote: "The biggest mistake tourists make is..."
```

**MDX 변환:**
```jsx
<ExpertTip
  name="Ji-hoon Park"
  role="Urban Mobility Consultant"
  experience="12 years in Seoul"
  quote="The biggest mistake tourists make is... [전체 인용문]"
/>
```

---

### 8. InfoBox (3가지 타입) ⚠️ arc-free 필수

**드래프트 형식:**
```
WARNINGS AND TIPS

💡 Pro Tip
[Pro tip content]

⚠️ Warning
[Warning content]

📱 No Korean Phone/ARC? Here's What To Do
[No-ARC solution content]
```

**MDX 변환:**

```jsx
// 💡 Pro Tip
<InfoBox type="tip" title="Pro Tip: [제목]">
[Pro tip content]
</InfoBox>

// ⚠️ Warning
<InfoBox type="warning" title="[경고 제목]">
[Warning content]
</InfoBox>

// 📱 No-ARC Solution (필수!)
<InfoBox type="arc-free" title="No Korean Phone/ARC? Here's What To Do">
[Solution for tourists without Korean phone or ARC - apps, workarounds, etc.]
</InfoBox>
```

> 🚨 **필수**: 모든 Deep Dive 글에 `type="arc-free"` InfoBox가 반드시 있어야 합니다!
> 이것은 한국에 ARC(외국인등록증)나 한국 전화번호가 없는 관광객을 위한 솔루션입니다.

---

### 9. FAQAccordion

**드래프트 형식:**
```
FAQ
Q1: Can I use this at the airport?
Answer here in 2-3 sentences.

Q2: Is it valid in Busan?
Answer here.
```

**MDX 변환:**
```jsx
<FAQAccordion
  items={[
    {
      question: "Can I use this at the airport?",
      answer: "Answer here in 2-3 sentences."
    },
    {
      question: "Is it valid in Busan?",
      answer: "Answer here."
    }
  ]}
/>
```

---

## 📝 본문 마크다운 요소 가이드

컴포넌트 외에도 일반 마크다운 요소를 적절히 사용합니다:

### 제목 계층
```markdown
## 섹션 제목 (H2) - 주요 섹션 구분
### 소제목 (H3) - 섹션 내 하위 항목 (예: Rule 1, Rule 2...)
```

### 강조
```markdown
**볼드** - 핵심 답변, 중요 숫자, 앱 이름
*이탤릭* - 한국어 발음 표기 (예: *Jal meogeotseumnida*)
```

### 목록
```markdown
1. 번호 목록 - 순서가 있는 단계나 항목
2. 두 번째 항목

- 글머리 목록 - 순서 없는 나열
- 두 번째 항목
```

### 실제 사용 예시 (10 Rules 글에서)
```markdown
### Rule 1: The Two-Handed Exchange
Whether it's a business card, a gift, or your credit card at a shop, always use both hands. It signals respect and attentiveness.

### Rule 2: Never Tip (Seriously)
It's not illegal to tip, but it's culturally awkward...
```

---

## ⚠️ 중요 주의사항 (빌드 에러 방지)

### 1. 흔한 실수와 해결법

| 실수 | 결과 | 해결 |
|------|------|------|
| `difficulty="Medium"` | 빌드 실패 | `difficulty="medium"` (소문자!) |
| LaTeX 수식 `$$..$$` | 파싱 에러 | 일반 텍스트로 변환 |
| JSX 안에서 `"` 쌍따옴표 | 파싱 에러 | `'` 작은따옴표 사용 |
| `type="arc-free"` 누락 | 품질 문제 | 반드시 포함 |
| deepDiveOrder 중복 | 순서 문제 | 기존 파일 확인 후 설정 |

### 2. LaTeX 수식 변환

Deep Research가 수학 공식을 LaTeX로 출력합니다. **모든 LaTeX를 일반 텍스트로 변환**해야 합니다:

**블록 수식:**
```
❌ $$B_e = \frac{5,000}{1,550} \approx 3.22$$

✅ **Break-even = 5,000 ÷ 1,550 ≈ 3.22 rides**
```

**인라인 수식 (자주 발견됨):**
```
❌ $₩10,320$
✅ ₩10,320

❌ $42\%$
✅ 42%

❌ $\approx \$7.15$
✅ ~$7.15

❌ $₩20,000$ (7-day)
✅ ₩20,000 (7-day)
```

> 💡 **팁**: 드래프트에서 `$` 기호가 보이면 LaTeX 수식일 가능성이 높습니다. `\%`, `\approx`, `\frac` 등도 변환 대상입니다.

### 3. 따옴표 사용 규칙

JSX 속성 안에서는 작은따옴표 사용:

```jsx
// ❌ 잘못된 예 - 빌드 실패
description: "The "best" option is..."

// ✅ 올바른 예
description: "The 'best' option is..."
```

### 4. 특수문자 처리

```jsx
// ❌ 잘못된 예
value: "₩5,000 (1d) -> ₩20,000 (7d)"

// ✅ 올바른 예  
value: "₩5,000 (1d) to ₩20,000 (7d)"
```

---

## 📝 MDX 파일 전체 템플릿

```mdx
---
title: "[제목]"
date: 2026-02-05
excerpt: "[발췌문]"
category: [카테고리]
author: Korea Experience Team
deepDive: true
deepDiveOrder: [순번]
---

[도입부 - 친근한 톤으로 독자에게 말하듯이 작성]

**The short answer is: [핵심 답변을 볼드로 강조]**

<KeyTakeaways 
  points={[
    "첫 번째 포인트",
    "두 번째 포인트",
    "세 번째 포인트"
  ]}
  readTime={12}
  lastUpdated="2026-02-05"
/>

## [첫 번째 섹션 제목]

[본문 내용...]

<QuickFacts
  title="[제목]"
  facts={[
    { label: "Label 1", value: "Value 1", icon: "🎫" },
    { label: "Label 2", value: "Value 2", icon: "🚇" },
    { label: "Label 3", value: "Value 3", icon: "💳" }
  ]}
  columns={3}
/>

[추가 본문...]

## [역사/배경 섹션]

[본문...]

<Timeline
  title="[타임라인 제목]"
  items={[
    { time: "2023", title: "Event 1", description: "Description", icon: "📢" },
    { time: "2024", title: "Event 2", description: "Description", icon: "🚀" },
    { time: "2025", title: "Event 3", description: "Description", icon: "🗺️" },
    { time: "2026", title: "Event 4", description: "Description", icon: "✨" }
  ]}
/>

[추가 본문...]

## [비교 섹션]

[본문...]

<ComparisonTable
  title="[비교표 제목]"
  headers={["Feature", "Option A", "Option B", "Option C"]}
  rows={[
    { feature: "Feature 1", option1: "Value", option2: "Value", option3: "Value" },
    { feature: "Feature 2", option1: "Value", option2: "Value", option3: "Value" }
  ]}
/>

[추가 본문...]

<ProsCons
  title="[장단점 제목]"
  pros={[
    "장점 1: 설명",
    "장점 2: 설명",
    "장점 3: 설명"
  ]}
  cons={[
    "단점 1: 설명",
    "단점 2: 설명",
    "단점 3: 설명"
  ]}
  variant="cards"
/>

## [How-To 섹션]

<StepGuide
  title="[가이드 제목]"
  totalTime="[소요 시간]"
  difficulty="easy"
  steps={[
    {
      title: "Step 1 Title",
      description: "Step 1 description.",
      tip: "Pro tip for step 1."
    },
    {
      title: "Step 2 Title",
      description: "Step 2 description.",
      tip: "Pro tip for step 2."
    }
  ]}
/>

<ExpertTip
  name="[전문가 이름]"
  role="[직책]"
  experience="[경력]"
  quote="[인용문]"
/>

## [인사이더 팁 섹션]

[본문...]

<InfoBox type="tip" title="Pro Tip: [제목]">
[팁 내용]
</InfoBox>

<InfoBox type="warning" title="[경고 제목]">
[경고 내용]
</InfoBox>

<InfoBox type="arc-free" title="No Korean Phone/ARC? Here's What To Do">
[ARC 없는 관광객을 위한 솔루션 - 필수!]
</InfoBox>

## Frequently Asked Questions

<FAQAccordion
  items={[
    {
      question: "Question 1?",
      answer: "Answer 1."
    },
    {
      question: "Question 2?",
      answer: "Answer 2."
    },
    {
      question: "Question 3?",
      answer: "Answer 3."
    },
    {
      question: "Question 4?",
      answer: "Answer 4."
    },
    {
      question: "Question 5?",
      answer: "Answer 5."
    }
  ]}
/>

## [결론 섹션]

[마무리 및 액션 플랜 - 독자에게 명확한 첫 24시간 행동 계획 제시]

**You've got this!** [격려의 말로 마무리]

---

## Sources

> ⚠️ **중요**: Sources 섹션은 반드시 `---` 구분선으로 본문과 분리합니다!

- [Source 1](URL) - What data came from here
- [Source 2](URL) - What data came from here
- [Source 3](URL) - What data came from here
- [Source 4](URL) - What data came from here
- [Source 5](URL) - What data came from here
```

---

## 🔍 변환 후 검증

### 빌드 테스트 (필수!)

```powershell
cd C:\kc\korea-experience
npm run build
```

### 빌드 성공 메시지

```
✓ Compiled successfully
✓ Search index generated successfully
```

### 빌드 실패 시 체크리스트

1. ☐ `difficulty` 값이 소문자인가? (`easy`, `medium`, `hard`)
2. ☐ JSX 안에 이스케이프 안 된 `"` 쌍따옴표가 있는가?
3. ☐ LaTeX 수식 `$$`가 남아있는가?
4. ☐ 모든 컴포넌트의 괄호/중괄호가 제대로 닫혔는가?
5. ☐ frontmatter의 category가 6개 중 하나와 정확히 일치하는가?

### 개발 서버에서 확인

```powershell
npm run dev
# http://localhost:3000/blog/[slug] 에서 확인
```

---

## 📊 파일명 카테고리 코드

드래프트 파일명의 대괄호 안 글자가 카테고리를 나타냅니다:

| 코드 | 카테고리 | 예시 주제 |
|------|---------|----------|
| `[M]` | Medical Tourism | 성형, 피부과, 치과, 의료비자 |
| `[T]` | Travel & Tourism | 교통, 숙소, 관광지, 축제 |
| `[F]` | Food & Dining | 맛집, 배달앱, 식당 예약 |
| `[K]` | K-Culture | K-pop, K-drama, 한복, 예절 |
| `[S]` | Shopping & K-Beauty | 올리브영, 면세점, 쇼핑몰 |
| `[L]` | Living in Korea | 거주, 은행, 폰, 배달, 생활 |

---

## 🚀 작업 완료 후 체크리스트

1. ☐ 이 README의 "이미 변환 완료된 파일" 목록 업데이트
2. ☐ `npm run build`로 빌드 검증 통과
3. ☐ 개발 서버에서 페이지 렌더링 확인
4. ☐ 모든 컴포넌트가 제대로 표시되는지 확인
5. ☐ **드래프트 원본 파일 유지** (삭제하지 않음!)

---

## 📌 자주 발생하는 질문

### Q: 드래프트 파일이 마크다운 테이블로 안 되어 있어요
A: Gemini Deep Research UI에서 복사할 때 마크다운이 plain text로 변환됩니다. 변환 시 수동으로 테이블 구조를 파악해서 컴포넌트로 만들어야 합니다.

### Q: deepDiveOrder는 어떻게 정하나요?
A: `content/deep-dive/` 폴더의 기존 파일들을 확인하고, 가장 높은 숫자 + 1로 설정합니다.

### Q: 카테고리가 애매한 경우?
A: 파일명의 `[X]` 코드를 기준으로 결정합니다. 예: `[M]` → Medical Tourism

### Q: 빈 파일인지 어떻게 알 수 있나요?
A: 파일 크기가 0이거나, 내용이 TITLE/EXCERPT 등 구조만 있고 실제 내용이 없으면 빈 파일입니다.

---

*마지막 업데이트: 2026-02-05*
