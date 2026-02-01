# 📚 콘텐츠 관리 시스템 사용 설명서

Korea Experience 블로그의 콘텐츠를 효율적으로 생성하고 관리하기 위한 완벽 가이드입니다.

---

## 🎯 시스템 개요

3가지 핵심 도구로 구성:
1. **포스트 관리 도구** (`npm run manage`) - 현재 상태 확인
2. **배치 생성 시스템** (`npm run batch`) - 자동 대량 생성
3. **개별 생성 도구** (`npm run generate`) - 수동 1개씩 생성

---

## 📊 1. 포스트 관리 도구

### 전체 포스트 목록 보기
```powershell
npm run manage list
```
**출력 예시:**
```
📚 전체 블로그 포스트 목록

총 3개 포스트

1. Best Rhinoplasty Clinics in Gangnam 2026
   카테고리: Medical Tourism | 날짜: 2026-02-01 | 단어수: 4,823
   파일: best-rhinoplasty-clinics-gangnam-2026.md

2. Seoul Travel Guide 2026 Hidden Gems
   카테고리: Travel & Tourism | 날짜: 2026-02-01 | 단어수: 3,542
   파일: seoul-travel-guide-2026-hidden-gems.md
```

### 카테고리별 통계 확인
```powershell
npm run manage stats
```
**출력 예시:**
```
📊 카테고리별 통계

총 포스트: 3개
총 단어수: 10,865개

📁 Medical Tourism
   포스트: 2개
   총 단어: 7,323개
   평균 단어: 3,662개

📁 Travel & Tourism
   포스트: 1개
   총 단어: 3,542개
   평균 단어: 3,542개

🎯 애드센스 승인 진행률
현재: 3개 / 목표: 30개 (10%)
남은 포스트: 27개
```

### 특정 카테고리 포스트만 보기
```powershell
npm run manage category "Medical Tourism"
```
**출력 예시:**
```
📁 Medical Tourism 카테고리 (2개)

1. Best Rhinoplasty Clinics in Gangnam 2026
   날짜: 2026-02-01 | 단어: 4,823개
   파일: best-rhinoplasty-clinics-gangnam-2026.md

2. Best Korean Skin Clinics in Gangnam 2026
   날짜: 2026-02-01 | 단어: 2,500개
   파일: best-korean-skin-clinics-in-gangnam-2026.md
```

### 카테고리별 부족한 포스트 확인
```powershell
npm run manage missing
```
**출력 예시:**
```
🔍 카테고리별 부족한 포스트

Medical Tourism: 2/8개 (6개 부족)
Travel & Tourism: 1/8개 (7개 부족)
K-Culture: 0/8개 (8개 부족)
Investment: 0/8개 (8개 부족)
```

---

## 📦 2. 배치 생성 시스템 (핵심 기능!)

### 배치 목록 확인
```powershell
npm run batch list
```
**출력 예시:**
```
📋 콘텐츠 생성 계획

0. Medical Tourism - Plastic Surgery
   카테고리: Medical Tourism
   포스트: 5개 (완료: 0개)
   상태: ⏳ 0/5

1. Medical Tourism - Dermatology
   카테고리: Medical Tourism
   포스트: 5개 (완료: 0개)
   상태: ⏳ 0/5

2. Medical Tourism - Practical Info
   카테고리: Medical Tourism
   포스트: 5개 (완료: 0개)
   상태: ⏳ 0/5

3. Travel & Tourism - Food & Shopping
   카테고리: Travel & Tourism
   포스트: 5개 (완료: 0개)
   상태: ⏳ 0/5

4. Travel & Tourism - Activities
   카테고리: Travel & Tourism
   포스트: 5개 (완료: 0개)
   상태: ⏳ 0/5

5. K-Culture
   카테고리: K-Culture
   포스트: 5개 (완료: 0개)
   상태: ⏳ 0/5

6. Investment
   카테고리: Investment
   포스트: 5개 (완료: 0개)
   상태: ⏳ 0/5
```

### 진행 상황 확인
```powershell
npm run batch progress
```
**출력 예시:**
```
📊 전체 진행 상황

1. Medical Tourism - Plastic Surgery
   ████░░░░░░ 2/5 (40%)

2. Medical Tourism - Dermatology
   ░░░░░░░░░░ 0/5 (0%)

총 진행률: 2/35 (6%)
애드센스 목표: 2/30 (7%)
```

### 특정 배치만 실행 (추천!)
```powershell
# 0번 배치 실행 (Medical Tourism - Plastic Surgery 5개)
npm run batch run 0

# 1번 배치 실행 (Medical Tourism - Dermatology 5개)
npm run batch run 1

# 3번 배치 실행 (Travel & Tourism - Food & Shopping 5개)
npm run batch run 3
```

**실행 과정:**
```
🚀 배치 1: Medical Tourism - Plastic Surgery

📝 생성 중 (1/5): Korea Plastic Surgery Cost Guide 2026
🤖 AI 콘텐츠 생성 중...
✅ 완료: content/posts/korea-plastic-surgery-cost-guide-2026.md
⏳ 3초 대기...

📝 생성 중 (2/5): Double Eyelid Surgery in Korea Complete Guide
🤖 AI 콘텐츠 생성 중...
✅ 완료: content/posts/double-eyelid-surgery-in-korea-complete-guide.md
⏳ 3초 대기...

...
```

### 전체 자동 생성 (35개 포스트)
```powershell
npm run batch run-all
```
⚠️ **주의**: 약 1-2시간 소요, 중간에 중단해도 진행상황 저장됨

**특징:**
- 이미 생성된 포스트는 자동으로 건너뜀
- 배치 사이 5초 대기 (API 안정성)
- 포스트 사이 3초 대기
- 언제든 중단 후 재실행 가능

---

## 🎨 3. 개별 생성 도구

### 1개씩 수동 생성
```powershell
npm run generate "제목" "카테고리"
```

**예시:**
```powershell
# 의료관광 포스트
npm run generate "Best Dental Clinics in Seoul 2026" "Medical Tourism"

# 여행 포스트
npm run generate "Busan Travel Guide 2026" "Travel & Tourism"

# 문화 포스트
npm run generate "Korean Traditional Tea Ceremony Guide" "K-Culture"

# 투자 포스트
npm run generate "Cryptocurrency Investment in Korea" "Investment"
```

---

## 🔄 실전 워크플로우

### 초보자 추천 워크플로우

**Day 1: 의료관광 집중 (15개)**
```powershell
# 1. 현재 상태 확인
npm run manage stats

# 2. 배치 0 실행 (성형외과 5개)
npm run batch run 0

# 3. 배치 1 실행 (피부과 5개)
npm run batch run 1

# 4. 배치 2 실행 (실용정보 5개)
npm run batch run 2

# 5. 빌드 & 배포
npm run build
git add -A
git commit -m "Add 15 medical tourism posts"
git push origin main

# 6. 진행 상황 확인
npm run manage stats
```

**Day 2: 여행 & 문화 (10개)**
```powershell
# 배치 3 실행 (음식/쇼핑 5개)
npm run batch run 3

# 배치 4 실행 (액티비티 5개)
npm run batch run 4

# 빌드 & 배포
npm run build
git add -A
git commit -m "Add 10 travel posts"
git push origin main
```

**Day 3: 문화 & 투자 (10개)**
```powershell
# 배치 5 실행 (K-Culture 5개)
npm run batch run 5

# 배치 6 실행 (Investment 5개)
npm run batch run 6

# 최종 빌드 & 배포
npm run build
git add -A
git commit -m "Add 10 K-Culture and Investment posts - Reach 35 total"
git push origin main

# 최종 확인
npm run manage stats
```

### 고급 사용자 워크플로우

**한 번에 전부 생성 (완전 자동화)**
```powershell
# 1. 전체 자동 생성 시작
npm run batch run-all

# (1-2시간 후 자동 완료)

# 2. 결과 확인
npm run manage stats

# 3. 빌드 & 배포
npm run build
git add -A
git commit -m "Complete content generation: 35 posts across 4 categories"
git push origin main
```

---

## 🛠️ 콘텐츠 계획 수정하기

### content-plan.json 편집

**위치**: `scripts/content-plan.json`

**구조:**
```json
{
  "batches": [
    {
      "name": "배치 이름",
      "category": "카테고리 (4개 중 하나)",
      "posts": [
        "포스트 제목 1 (키워드)",
        "포스트 제목 2",
        "포스트 제목 3"
      ]
    }
  ]
}
```

**카테고리 옵션 (정확히 일치해야 함):**
- `Medical Tourism`
- `Travel & Tourism`
- `K-Culture`
- `Investment`

**제목 작성 팁:**
- SEO 키워드 포함
- 60자 이내
- 명확하고 구체적으로
- 숫자/연도 포함 (예: "2026", "Top 5")

**예시 추가:**
```json
{
  "name": "Medical Tourism - Dental",
  "category": "Medical Tourism",
  "posts": [
    "Best Dental Clinics in Seoul for Foreigners 2026",
    "Korea Dental Implant Cost and Quality Guide",
    "Teeth Whitening in Korea Complete Guide"
  ]
}
```

수정 후:
```powershell
# 새로운 배치 번호 확인
npm run batch list

# 새 배치 실행
npm run batch run 7
```

---

## 📈 진행 상황 파일

### generation-progress.json

**위치**: `scripts/generation-progress.json`

**자동 생성됨** - 수동 편집 불필요

**내용 예시:**
```json
{
  "Medical Tourism:Korea Plastic Surgery Cost Guide 2026": true,
  "Medical Tourism:Double Eyelid Surgery in Korea Complete Guide": true,
  "Travel & Tourism:Best Korean BBQ Restaurants in Seoul 2026": true
}
```

**초기화 방법 (재시작하고 싶을 때):**
```powershell
# 파일 삭제
Remove-Item scripts\generation-progress.json

# 또는 내용을 빈 객체로 변경
echo "{}" > scripts\generation-progress.json
```

---

## ✅ 체크리스트

### 매 배치 후 확인사항

- [ ] `content/posts/` 폴더에 새 파일 생성 확인
- [ ] `npm run manage stats` 로 카운트 증가 확인
- [ ] Frontmatter 형식 정확한지 1-2개 샘플 확인
- [ ] `npm run build` 오류 없이 성공
- [ ] Git 커밋 & 푸시 완료

### 10개 단위 배포 체크리스트

- [ ] 총 10개 이상 포스트 생성 완료
- [ ] `npm run manage stats` 통계 확인
- [ ] `npm run build` 성공
- [ ] Git 커밋 메시지 명확하게 작성
- [ ] Git 푸시 완료
- [ ] Cloudflare Pages 배포 성공 확인 (2-3분)
- [ ] 실제 사이트에서 3-5개 포스트 확인

### 30개 완료 체크리스트

- [ ] `npm run manage stats` 에서 30개 이상 확인
- [ ] 4개 카테고리 모두 포스트 있는지 확인
- [ ] 모든 포스트 평균 1,500단어 이상
- [ ] 실제 사이트에서 블로그 리스트 확인
- [ ] 각 카테고리 필터 작동 확인
- [ ] Google AdSense 신청 준비 완료! 🎉

---

## 🚨 트러블슈팅

### 문제: "404 Not Found" 모델 오류
```
Error: models/gemini-X.X-flash is not found
```
**해결:**
```powershell
# scripts/generate-content.ts 파일에서 모델 확인
# 현재 작동하는 모델: gemini-2.5-flash
```

### 문제: YAML 파싱 오류
```
Error: incomplete explicit mapping pair
```
**해결:**
```markdown
# 잘못된 예
title: Korea's Best Clinics: A Guide

# 올바른 예
title: "Korea's Best Clinics: A Guide"
```
모든 콜론 포함 제목은 따옴표로 감싸기

### 문제: 인코딩 오류 (한글 깨짐)
**해결:** 이미 UTF-8 설정 완료, 발생 시 보고

### 문제: 배치 실행 중 중단됨
**해결:**
```powershell
# 진행 상황은 자동 저장됨
# 같은 명령어로 재실행하면 이어서 진행
npm run batch run 0
```

### 문제: 중복 파일명
**해결:**
```powershell
# 기존 파일 확인
npm run manage list

# 제목을 약간 변경해서 재생성
npm run generate "Best Korean BBQ Restaurants in Seoul 2026 Updated" "Travel & Tourism"
```

---

## 🎯 목표 달성 로드맵

### 현재 → 30개 (애드센스 신청)

```
📊 현재: 3개
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 1단계: 15개 (의료관광 집중)
   배치 0, 1, 2 실행
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 2단계: 25개 (여행 추가)
   배치 3, 4 실행
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 3단계: 30개+ (문화/투자)
   배치 5, 6 실행
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 애드센스 신청 가능!
```

---

## 📞 빠른 참조

```powershell
# 상태 확인
npm run manage stats

# 배치 목록
npm run batch list

# 진행률
npm run batch progress

# 배치 실행
npm run batch run [번호]

# 전체 실행
npm run batch run-all

# 개별 생성
npm run generate "제목" "카테고리"

# 빌드 & 배포
npm run build
git add -A
git commit -m "메시지"
git push origin main
```

---

## 🎉 성공 기준

✅ **30개 포스트 완성**
✅ **4개 카테고리 골고루 분산** (각 7-8개)
✅ **평균 2,000+ 단어**
✅ **빌드 오류 0개**
✅ **실제 사이트 정상 작동**

→ **Google AdSense 신청 준비 완료!** 🚀

---

**마지막 업데이트**: 2026-02-01
**버전**: 1.0
