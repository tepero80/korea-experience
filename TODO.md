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

---

## 현재 사이트의 진짜 문제점 (솔직한 진단)

| 문제 | 심각도 | 현실 |
|---|---|---|
| **645개 포스트가 서로 고립됨** | 🔴 치명적 | 내부 링크 거의 0. 크롤러가 관계 파악 불가. PageRank 전달 안 됨 |
| **RelatedPosts가 Deep Dive 31개만 추천** | 🔴 치명적 | 614개 일반 포스트는 어디서도 추천되지 않음 → 크롤링 안 됨 |
| **일부 내부 링크가 존재하지 않는 slug 참조** | 🟠 높음 | 404 에러 → Google 신뢰도 하락 |
| **dateModified가 항상 datePublished와 동일** | 🟠 높음 | Google이 "업데이트 안 된 글"로 인식 |
| **sitemap lastmod가 매 빌드마다 바뀜** | 🟠 높음 | 정적 페이지의 lastmod = new Date() → Google에 거짓 신호 |
| **카테고리별 랜딩 페이지 없음** | 🟡 중간 | /blog?category=X는 크롤 불가. sitemap에도 없음 |
| **FAQPage schema 함수만 있고 미사용** | 🟡 중간 | FAQAccordion 쓰는 포스트에도 JSON-LD 없음 |

---

## 🔴 1단계: 내부 링크 + 크롤링 문제 해결 (가장 급함)

> **지금 645개 중 13개만 인덱싱된 근본 원인이 이것**

### 1-1. RelatedPosts를 일반 포스트도 포함하도록 수정
- [ ] `getRelatedPosts()`에서 `deepDive === true` 필터 제거
- [ ] 같은 카테고리 포스트 중 최신순 3개 추천 (랜덤 제거 → 결정적으로)
- [ ] `Math.random()` 제거 (SSG에서 빌드마다 결과 바뀌는 문제)
- **왜 급함**: 614개 포스트가 어디서도 링크되지 않으면 Google이 크롤링 자체를 안 함
- **효과**: 모든 포스트가 최소 3개 이상의 다른 포스트에서 링크됨 → 크롤링 속도 대폭 개선

### 1-2. Dead 내부 링크 감사 및 수정
- [ ] 스크립트: 모든 MD 파일에서 `/blog/...` 링크 추출 → 실제 slug 존재 여부 확인
- [ ] 존재하지 않는 링크 제거 또는 올바른 slug로 수정
- **왜 급함**: 404 링크는 Google 신뢰도를 직접 깎음

### 1-3. Sitemap lastmod 수정
- [ ] 정적 페이지: `lastmod`를 실제 수정일로 고정 (new Date() 제거)
- [ ] 블로그 포스트: frontmatter의 date 사용 (추후 lastUpdated 추가 시 반영)
- **왜 급함**: 매 빌드마다 정적 페이지 lastmod 변경 → Google이 크롤 예산 낭비

---

## 🟠 2단계: dateModified + Freshness 신호

### 2-1. lastUpdated 필드 추가
- [ ] PostMetadata에 `lastUpdated?: string` 추가
- [ ] frontmatter에서 `lastUpdated` 읽어오기
- [ ] generateArticleSchema의 dateModified에 실제 lastUpdated 전달
- [ ] sitemap.ts에서 lastUpdated가 있으면 그 날짜를 lastmod로 사용
- [ ] Deep Dive 31개에 `lastUpdated: 2026-02-06` 추가
- **효과**: Google Freshness 부스트. 특히 의료/비자 같은 시간 민감 콘텐츠

### 2-2. BlogCard에 "Updated" 날짜 표시
- [ ] lastUpdated가 date와 다르면 "Updated Feb 6, 2026" 뱃지 표시
- **효과**: 사용자 신뢰 + CTR 향상

---

## 🟡 3단계: 스키마 최적화

### 3-1. Article → BlogPosting 변경
- [ ] `@type: 'Article'` → `'BlogPosting'`
- **왜**: 블로그 콘텐츠에 더 정확한 타입. Google이 콘텐츠 유형을 정확히 분류

### 3-2. reviewedBy 스키마 (의료 포스트 한정)
- [ ] ArticleSchemaProps에 `reviewedBy` 추가
- [ ] 의료 카테고리 포스트에만 적용
- [ ] 포스트 상단에 "Reviewed by..." 배지 UI
- **주의**: 실제 전문가 이름/자격이 있어야 의미 있음. 가짜 프로필은 역효과

### 3-3. FAQPage JSON-LD 활용
- [ ] FAQAccordion 쓰는 포스트에 generateFAQSchema() JSON-LD 주입
- **효과**: FAQ 리치 결과 가능. 단 2026년부터 정부/보건 사이트 한정이라 효과 제한적

---

## 🟢 4단계: 콘텐츠 품질 향상

### 4-1. KeyTakeaways 적용 확대
- [ ] 현재: 44/645 (6.8%) → 점진적 확대
- [ ] 새로 생성하는 포스트에는 의무 적용
- [ ] 기존 포스트는 중요도 높은 것부터 순차 추가
- **현실**: 614개 일괄 수정은 비현실적. 점진적으로

### 4-2. 카테고리별 필러 페이지
- [ ] /blog/guide/medical-tourism 같은 허브 페이지 생성
- [ ] 3,000자+ 포괄 가이드 + 하위 포스트 링크 목록
- [ ] sitemap에 추가
- **효과**: 빅키워드 랭킹. 콘텐츠 제작 비용이 큼

### 4-3. Medical Disclaimer 조건부 표시
- [ ] 의료 관련 카테고리일 때만 표시
- **효과**: UX 개선. SEO 직접 영향은 미미

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
| 내부 링크 있는 포스트 | ~4개 (0.6%) ← **치명적** |
| KeyTakeaways 적용 | 44개 (6.8%) |
| Google 인덱싱 | 13개 (2%) |
| Google 크롤링 대기 | 21개 |
| Google 발견(미크롤링) | 129개 |
| RelatedPosts 추천 대상 | Deep Dive 31개만 (일반 614개 제외됨) |

> **결론: 지금 가장 급한 건 1단계(내부 링크)다.**
> 645개 포스트가 서로 연결 안 되어 있어서 Google이 크롤링을 못 하고 있다.
> 스키마 최적화, AI 인용 같은 건 Google이 우리 페이지를 먼저 크롤링해야 의미가 있다.
