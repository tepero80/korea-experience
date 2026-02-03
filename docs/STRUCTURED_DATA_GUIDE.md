# 구조화 데이터 (Structured Data) 사용 가이드

> 작성일: 2026-02-04  
> 목적: Rich Snippets으로 검색 결과 CTR 20-30% 향상

---

## ✅ 현재 구현됨

### 1. Article Schema (모든 블로그 글)
- **위치**: `app/blog/[slug]/page.tsx`
- **자동 적용**: 모든 블로그 포스트에 자동으로 적용됨
- **표시**: 작성자, 발행일, 카테고리

### 2. BreadcrumbList Schema (모든 블로그 글)
- **위치**: `app/blog/[slug]/page.tsx`
- **자동 적용**: Home › Blog › 글 제목 경로 표시
- **검색 결과 예시**:
  ```
  Home › Blog › Best Plastic Surgery Clinics in Seoul
  Korea Experience
  ```

---

## 📝 추가 구현 필요 (선택적)

### 3. FAQPage Schema - FAQ가 있는 글에 적용

**적용 대상 예시:**
- `best-korean-bbq-restaurants-in-seoul-2026.md` (Q: What is Korean BBQ? 등)
- `korea-plastic-surgery-cost-guide-2026.md` (Q: How much does rhinoplasty cost? 등)
- `korean-visa-types-guide-2026.md` (Q: What visa do I need? 등)

**구현 방법:**

#### 1단계: Frontmatter에 FAQ 추가
```markdown
---
title: 'Best Korean BBQ Restaurants in Seoul 2026'
category: 'Food & Dining'
faqs:
  - question: 'What is Korean BBQ?'
    answer: 'Korean BBQ is a dining experience where diners grill meat at their table...'
  - question: 'How much does Korean BBQ cost in Seoul?'
    answer: 'Prices range from $15-50 per person depending on the restaurant...'
  - question: 'Do I need reservations?'
    answer: 'Yes, popular restaurants require reservations, especially on weekends.'
---
```

#### 2단계: 블로그 페이지에서 FAQ 스키마 생성
```typescript
// app/blog/[slug]/page.tsx에 추가

import { generateFAQSchema } from '@/lib/schema';

// 페이지 컴포넌트 내부
const post = getPostBySlug(slug);

// FAQ 스키마 생성 (frontmatter에 faqs가 있는 경우만)
let faqSchema = null;
if (post.faqs && post.faqs.length > 0) {
  faqSchema = generateFAQSchema(post.faqs);
}

return (
  <main>
    {/* 기존 스키마들 */}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    
    {/* FAQ 스키마 (있는 경우만) */}
    {faqSchema && (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    )}
  </main>
);
```

**검색 결과 예시:**
```
Best Korean BBQ Restaurants in Seoul 2026
Korea Experience
▼ What is Korean BBQ?
  Korean BBQ is a dining experience where diners grill meat...
▼ How much does Korean BBQ cost in Seoul?
  Prices range from $15-50 per person depending on...
▼ Do I need reservations?
  Yes, popular restaurants require reservations...
```

---

### 4. HowTo Schema - 가이드/튜토리얼 글에 적용

**적용 대상 예시:**
- `how-to-get-plastic-surgery-in-korea-step-by-step.md`
- `seoul-subway-guide-how-to-use-public-transportation.md`
- `how-to-apply-for-korean-visa.md`

**구현 방법:**

#### 1단계: Frontmatter에 단계 추가
```markdown
---
title: 'How to Get Plastic Surgery in Korea: Step-by-Step Guide'
category: 'Medical Tourism'
howto:
  name: 'Get Plastic Surgery in Korea'
  description: 'Complete step-by-step guide to getting plastic surgery in Korea'
  totalTime: 'P2W'  # ISO 8601 duration (2 weeks)
  estimatedCost: '$5000-$15000'
  steps:
    - name: 'Research and Choose a Clinic'
      text: 'Research reputable clinics in Seoul, read reviews, compare prices...'
    - name: 'Book Initial Consultation'
      text: 'Contact the clinic via email or phone, book consultation appointment...'
    - name: 'Travel to Korea'
      text: 'Book flights and accommodation near the clinic...'
    - name: 'Attend Consultation'
      text: 'Meet with the surgeon, discuss your goals and expectations...'
    - name: 'Schedule Surgery'
      text: 'Confirm the procedure date and pre-surgery instructions...'
---
```

#### 2단계: 블로그 페이지에서 HowTo 스키마 생성
```typescript
import { generateHowToSchema } from '@/lib/schema';

let howToSchema = null;
if (post.howto) {
  howToSchema = generateHowToSchema(post.howto);
}

// JSX에 추가
{howToSchema && (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
)}
```

**검색 결과 예시:**
```
How to Get Plastic Surgery in Korea (5 steps)
⏱️ 2 weeks • 💰 $5,000-$15,000
Korea Experience
1. Research and Choose a Clinic
2. Book Initial Consultation
3. Travel to Korea
4. Attend Consultation
5. Schedule Surgery
```

---

### 5. Review Schema - 클리닉/레스토랑 리뷰 글에 적용

**적용 대상 예시:**
- `id-hospital-seoul-review.md`
- `best-korean-dermatology-clinic-review.md`
- `michelin-star-korean-restaurant-review.md`

**구현 방법:**

#### 1단계: Frontmatter에 리뷰 정보 추가
```markdown
---
title: 'ID Hospital Seoul Review: My Rhinoplasty Experience'
category: 'Plastic Surgery'
review:
  itemReviewed: 'ID Hospital Seoul'
  reviewRating: 4.8
  reviewBody: 'Excellent results, professional staff, and thorough aftercare...'
---
```

#### 2단계: 블로그 페이지에서 Review 스키마 생성
```typescript
import { generateReviewSchema } from '@/lib/schema';

let reviewSchema = null;
if (post.review) {
  reviewSchema = generateReviewSchema({
    itemReviewed: post.review.itemReviewed,
    reviewBody: post.review.reviewBody,
    reviewRating: post.review.reviewRating,
    author: SITE_CONFIG.author,
    datePublished: post.date,
  });
}

// JSX에 추가
{reviewSchema && (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />
)}
```

**검색 결과 예시:**
```
ID Hospital Seoul Review
⭐⭐⭐⭐⭐ 4.8/5
Korea Experience • Jan 15, 2026
"Excellent results, professional staff, and thorough aftercare..."
```

---

### 6. LocalBusiness Schema - 클리닉/레스토랑 소개 글에 적용

**적용 대상 예시:**
- `best-dermatology-clinics-in-seoul-for-foreigners.md`
- `gangnam-plastic-surgery-clinics-guide.md`
- `michelin-star-restaurants-seoul.md`

**구현 방법:**

#### 1단계: Frontmatter에 비즈니스 정보 추가
```markdown
---
title: 'Best Dermatology Clinics in Seoul for Foreigners'
category: 'Dermatology'
businesses:
  - name: 'Seoul Laser Clinic'
    description: 'Leading dermatology clinic in Gangnam specializing in laser treatments'
    address:
      streetAddress: '574 Sinsa-dong'
      addressLocality: 'Gangnam-gu'
      addressRegion: 'Seoul'
      postalCode: '06027'
      addressCountry: 'KR'
    telephone: '+82-2-3496-9783'
    priceRange: '$$$'
    url: 'https://koreaexperience.com/blog/seoul-laser-clinic'
---
```

#### 2단계: 블로그 페이지에서 LocalBusiness 스키마 생성
```typescript
import { generateLocalBusinessSchema } from '@/lib/schema';

const businessSchemas = [];
if (post.businesses && post.businesses.length > 0) {
  post.businesses.forEach(business => {
    businessSchemas.push(generateLocalBusinessSchema(business));
  });
}

// JSX에 추가
{businessSchemas.map((schema, index) => (
  <script 
    key={`business-${index}`}
    type="application/ld+json" 
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
  />
))}
```

**검색 결과 예시:**
```
Seoul Laser Clinic
📍 574 Sinsa-dong, Gangnam-gu, Seoul
📞 +82-2-3496-9783
💰 Price: $$$
⭐ 4.8 (320 reviews)
[Google Maps 보기] [웹사이트 방문]
```

---

## 🔍 검증 방법

### 1. Google Rich Results Test
```
https://search.google.com/test/rich-results
```
- 페이지 URL 입력
- 감지된 스키마 확인
- 에러/경고 확인

### 2. Schema.org Validator
```
https://validator.schema.org/
```
- JSON-LD 코드 복사/붙여넣기
- 유효성 검사

### 3. Google Search Console
- 배포 후 1-2주 내 "Rich Results" 보고서 확인
- 인덱싱된 Rich Snippets 통계 확인

---

## 📊 예상 효과

| 스키마 타입 | 적용 가능 글 수 | 예상 CTR 증가 |
|------------|----------------|--------------|
| Breadcrumb | 601개 (전체) | +10% |
| FAQ | ~100개 | +30% |
| HowTo | ~50개 | +25% |
| Review | ~30개 | +35% |
| LocalBusiness | ~20개 | +40% |

**전체 평균 CTR 증가: 20-30%**

---

## 🚀 구현 우선순위

### Phase 1 (즉시) ✅
- [x] Article Schema
- [x] Breadcrumb Schema

### Phase 2 (1주일 내)
- [ ] FAQ Schema (FAQ 섹션이 명확한 글 10-20개 선정)
- [ ] HowTo Schema (가이드 글 5-10개 선정)

### Phase 3 (2주일 내)
- [ ] Review Schema (리뷰 글에 적용)
- [ ] LocalBusiness Schema (클리닉/레스토랑 소개글에 적용)

---

## 💡 팁

1. **모든 글에 모든 스키마를 적용하지 마세요**
   - FAQ가 없는 글에 FAQSchema를 억지로 넣으면 패널티
   - 자연스럽게 해당 구조가 있는 글에만 적용

2. **스키마는 실제 컨텐츠와 일치해야 합니다**
   - FAQ 스키마의 답변은 실제 글 내용과 동일해야 함
   - 허위 정보 입력 시 Google 패널티

3. **정기적으로 검증하세요**
   - 월 1회 Rich Results Test로 검증
   - Search Console에서 에러 모니터링

---

*구조화 데이터 추가로 검색 노출 향상을 기대할 수 있습니다!*
