# Korea Experience SEO 개선 TODO

> 목표: Google 검색 상위 노출 + AI 인용 → 방문객 폭발적 증가
> 현실적으로 효과 있는 것만 정리. 뜬구름 잡는 건 뺌

---

## ✅ 완료

- [x] Article schema 수정 (image, author.url, ISO dates)
- [x] Open Graph published_time ISO 포맷
- [x] ExpertTip Comment schema 제거
- [x] LocalBusiness aggregateRating 조건부 처리
- [x] 유효하지 않은 blog 카테고리 → /blog 리다이렉트
- [x] **1단계: 내부 링크 + 크롤링 문제 해결** (commit df504f0)
  - RelatedPosts 체인 링크 (645/645 커버리지, 고아 0개)
  - Dead 내부 링크 15개 수정
  - Sitemap lastmod 고정 날짜로 변경
  - Math.random() 제거 (결정적 SSG 빌드)
  - searchParams SSG 호환 (Next.js 16)
- [x] **2단계: 스키마 최적화 + UX 개선**
  - Article → BlogPosting 변경 (lib/schema.ts)
  - FAQPage JSON-LD 자동 주입 (~37개 포스트, blog/[slug]/page.tsx)
  - FAQAccordion microdata 제거 → JSON-LD 단일 소스로 통일
  - Medical Disclaimer: Medical Tourism 카테고리만 표시

---

## 현재 사이트의 진짜 문제점 (솔직한 진단)

| 문제 | 심각도 | 현실 |
|---|---|---|
| ~~**645개 포스트가 서로 고립됨**~~ | ✅ 해결 | RelatedPosts 체인 링크로 645/645 커버리지 달성 |
| ~~**RelatedPosts가 Deep Dive 31개만 추천**~~ | ✅ 해결 | 모든 포스트 포함, 카테고리별 이웃 체인 |
| ~~**일부 내부 링크가 존재하지 않는 slug 참조**~~ | ✅ 해결 | 15개 dead link 수정 완료 |
| **dateModified가 항상 datePublished와 동일** | 🏠 보류 | AI 전량 생성 워크플로. 재생성 스크립트 만들 때 자동 스탬프 |
| ~~**sitemap lastmod가 매 빌드마다 바뀔**~~ | ✅ 해결 | 고정 날짜로 변경 |
| **카테고리별 랜딩 페이지 없음** | 🟡 중간 | /blog?category=X는 크롤 불가. sitemap에도 없음 |
| ~~**FAQPage schema 함수만 있고 미사용**~~ | ✅ 해결 | ~37개 포스트에 JSON-LD 자동 주입 |

---

## ~~🔴 1단계: 내부 링크 + 크롤링 문제 해결~~ ✅ 완료 (commit df504f0)

> **645개 전체 포스트가 RelatedPosts 체인으로 연결됨. 고아 0개.**

### 1-1. RelatedPosts를 일반 포스트도 포함하도록 수정
- [x] `getRelatedPosts()`에서 `deepDive === true` 필터 제거
- [x] 같은 카테고리 내 이웃 체인 로직 (이전/다음 포스트 보장)
- [x] `Math.random()` 제거 (SSG에서 빌드마다 결과 바뀌는 문제)

### 1-2. Dead 내부 링크 감사 및 수정
- [x] 7개 파일에서 15개 dead link 수정
- [x] yourwebsite.com / koreaexperience.com 절대 URL → 상대 경로

### 1-3. Sitemap lastmod 수정
- [x] 정적 페이지: `lastmod`를 고정 날짜(2025-06-20)로 변경
- [x] 블로그 포스트: frontmatter date 사용

---

## ~~🟠 2단계: 스키마 최적화 + UX 개선~~ ✅ 완료

> lastUpdated 수동 관리는 삭제. AI 전량 생성 워크플로에서 수작업 날짜 관리는 비현실적.
> dateModified는 현재 datePublished와 동일 — 추후 재생성 스크립트 만들 때 자동 스탬프 고려.

### 2-1. Article → BlogPosting 변경
- [x] `@type: 'Article'` → `'BlogPosting'` (lib/schema.ts)

### 2-2. FAQPage JSON-LD 주입
- [x] 포스트 본문에서 FAQAccordion items 정규식 추출
- [x] generateFAQSchema() JSON-LD 자동 주입 (~37개 포스트)
- [x] FAQAccordion 컴포넌트에서 microdata 제거 → JSON-LD 단일 소스로 통일

### 2-3. Medical Disclaimer 조건부 표시
- [x] Medical Tourism 카테고리만 표시 (기존: 모든 포스트에 표시)

---

## 🟢 3단계: 콘텐츠 품질 향상 (미실행)

### 3-1. KeyTakeaways 적용 확대
- [ ] 현재: 44/645 (6.8%) → 점진적 확대
- [ ] 새로 생성하는 포스트에는 의무 적용
- [ ] 기존 포스트는 중요도 높은 것부터 순차 추가
- **현실**: 614개 일괄 수정은 비현실적. 점진적으로

### 3-2. 카테고리별 허브 페이지
- [ ] /blog/guide/medical-tourism 같은 허브 페이지 생성
- [ ] 3,000자+ 포괄 가이드 + 하위 포스트 링크 목록
- [ ] sitemap에 추가
- **효과**: 빅키워드 랭킹. 콘텐츠 제작 비용이 큼

### 3-3. reviewedBy 스키마 (의료 포스트 한정)
- [ ] 실제 전문가 이름/자격이 있어야 의미 있음
- **주의**: 가짜 프로필은 역효과

---

## ❌ 삭제: 현재 불필요하거나 효과 미미

| 항목 | 삭제 이유 |
|---|---|
| **ISR/엣지 컴퓨팅** | SSG + Cloudflare Pages가 최적. 서버 불필요 |
| **위키데이터 엔티티 매핑** | Google이 이걸 보는 증거 없음 |
| **MedicalWebPage 스키마** | Article/BlogPosting으로 충분. 실질 효과 불분명 |
| **저자 프로필 시스템** | 가짜 전문가 프로필은 역효과. 실제 저자가 생기면 그때 |
| **출처/참고문헌 시스템** | 645개에 출처 추가는 비현실적 |
| **동영상/멀티모달** | 콘텐츠 제작 비용 대비 ROI 낮음 |
| **TaxRefundCalculator** | 좋지만 지금 급한 건 아님. 크롤링 문제가 선행 |
| **MedicalTourismPlanner** | 위와 동일 |
| **시맨틱 내부 링크 자동화 (본문 키워드 매칭)** | 오탐 위험. RelatedPosts 개선이 현실적 |

---

## 📌 핵심 수치 (2026.02.06 기준)

| 항목 | 수치 |
|---|---|
| 총 포스트 | 645 (Deep Dive 31 + 일반 614) |
| 내부 링크 있는 포스트 | **645/645 (100%)** ✅ |
| KeyTakeaways 적용 | 44개 (6.8%) |
| FAQPage JSON-LD 적용 | ~37개 ✅ |
| Google 인덱싱 | 13개 (2%) — 크롤링 개선 후 증가 예상 |
| Google 크롤링 대기 | 21개 |
| Google 발견(미크롤링) | 129개 |
| RelatedPosts 추천 대상 | **전체 645개** ✅ |

> **결론: 1~2단계 완료. 크롤링 + 스키마 문제 해결됨.**
> Google이 재크롤링하면서 인덱싱 수가 증가할 것으로 예상.
> 다음 우선순위: 카테고리 허브 페이지 + KeyTakeaways 확대.
