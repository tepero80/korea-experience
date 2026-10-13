# Korea Experience

한국을 방문하거나 거주하는 해외 독자를 위한 영어 가이드 웹사이트입니다. 이 README는 **Gemini Flash 콘텐츠 운영의 기준 문서**입니다. 앞으로 새 콘텐츠 생성, 기존 URL 개선, 검수, 발행 요청은 여기의 절차와 저장소 CLI를 기준으로 진행합니다.

## 빠른 실행: “신규 콘텐츠 몇 개 만들어서 올려줘”

프로젝트 루트(`C:\kc\korea-experience`)에서 실행합니다. PowerShell 또는 터미널에서 `python`이 연결된 Python 3.11 환경을 사용하세요.

```powershell
# 0) 처음 한 번만 의존성 준비
python -m pip install -r scripts/deep_dive/requirements.txt

# 1) 현재 주제 후보 확인
python -m scripts.deep_dive topics list

# 2) 실제 API 호출 없이 선택된 주제와 slug 확인
python -m scripts.deep_dive generate --topics-file scripts/deep_dive/topic_batch_2026-10.json --count 2 --dry-run

# 3) Travel 카테고리 신규 글 2개를 근거 조사·작성·일관성 검사·커버 생성 후 발행
python -m scripts.deep_dive generate --topics-file scripts/deep_dive/topic_batch_2026-10.json --category T --count 2 --publish --image

# 4) 모든 변경 중복 확인 후 빌드
npm run build

# 5) 배포는 GitHub main push를 통해 연결된 Cloudflare Pages가 수행
```

`--count`는 한 번에 최대 5개입니다. 반복 생성 요청 시 기존 글과 정확히 겹치는 slug는 발행 모드에서 API 호출 전에 건너뜁니다.

이전에 선정한 30개 묶음은 [scripts/deep_dive/topic_batch_2026-10.json](scripts/deep_dive/topic_batch_2026-10.json)에 있습니다. 그 배치의 30개는 이미 모두 콘텐츠 파일로 공개 경로에 반영했습니다. 재사용하기보다, 새 요청이 오면 기존 게시물과 겹치지 않는 **새 주제 묶음**을 만듭니다.

## 콘텐츠와 주제 파일 위치

| 용도 | 경로 | 규칙 |
|---|---|---|
| 일반 게시물 | [content/posts](content/posts) | 기존 일반 블로그 Markdown |
| Deep Dive 공개 글 | [content/deep-dive](content/deep-dive) | 빌드·sitemap·검색 인덱스에 들어가는 게시 콘텐츠 |
| 생성 대기 주제 / 처리 상태 | [scripts/deep_dive/todo.md](scripts/deep_dive/todo.md) | `번호. [카테고리코드] 주제` 형식 |
| 주제 제안 카탈로그 | [scripts/deep_dive/topic_ideas.json](scripts/deep_dive/topic_ideas.json) | 새 주제 후보. 현재 66개 |
| 실행할 주제 배치 예시 | [scripts/deep_dive/topic_batch_2026-10.json](scripts/deep_dive/topic_batch_2026-10.json) | `{ "code": "T", "topic": "..." }` 배열 |
| 생성된 글/배경 | [public/images](public/images) | 공개 글은 `/images/<slug>.webp` 참조 |
| API, 가격, 품질 원칙 | [content/deep-dive-drafts/GEMINI_FLASH_WORKFLOW.md](content/deep-dive-drafts/GEMINI_FLASH_WORKFLOW.md) | 모델 ID와 가격은 실행 전에 Google 공식 자료로 갱신 확인 |
| 생성 CLI 구현 | [scripts/deep_dive/flash_pipeline.py](scripts/deep_dive/flash_pipeline.py) | 기본 CLI 진입점 |

새 주제를 `todo.md`에 직접 적거나 CLI로 추가할 수 있습니다.

```powershell
python -m scripts.deep_dive topics add --category T --title "New Korea travel question"
python -m scripts.deep_dive topics add --category M --title "New medical-tourism information topic"
```

추가 직후 출력되는 번호를 사용해 처리할 수 있습니다.

```powershell
python -m scripts.deep_dive generate --number 253 --dry-run
python -m scripts.deep_dive generate --number 253 --publish --image
```

직접 JSON 배치를 만드는 경우 카테고리 코드는 `M`, `T`, `K`, `L`, `F`, `S` 중 하나로 적고, 기존 게시물 및 비공개 검토 폴더와 제목·검색 의도가 겹치는 주제는 제외합니다.

## 카테고리 6개

| 코드 | 카테고리 |
|---|---|
| `M` | Medical Tourism |
| `T` | Travel & Tourism |
| `K` | K-Culture |
| `L` | Living in Korea |
| `F` | Food & Dining |
| `S` | Shopping & K-Beauty |

## 기본 생성 흐름

기본 `python -m scripts.deep_dive`는 Deep Research를 호출하지 않습니다.

1. **근거 수집:** `gemini-3.5-flash-lite` + Gemini Interactions API의 `google_search` grounding으로 검색합니다. URL citations가 3개 미만이면 생성을 중단합니다.
2. **초안 작성:** 같은 Flash-Lite가 근거 요약과 검색 citations를 바탕으로 답변 중심의 Markdown/MDX를 씁니다. 불필요한 분량이나 반복 표를 강제하지 않습니다.
3. **근거 연결:** 최종 `Sources`는 검색 결과에서 실제로 반환된 citation URL만 사용합니다.
4. **일관성 검사:** 같은 모델이 초안이 조사 결과와 맞는지 검사합니다. 이 단계는 독립적인 사실 검증이나 사람의 전문 검토를 대신하지 않습니다.
5. **이미지:** `--image`를 지정한 경우에만 `gemini-3.1-flash-lite-image`로 커버를 생성합니다. 이미지 생성 실패 시 텍스트 생성물까지 실패로 처리하지는 않지만, 공개 글에 이미지가 필요하면 발행 전 존재 여부를 확인합니다.
6. **로컬 품질 검사:** frontmatter, 제목·요약 길이, 본문 최소량, H2 섹션, 출처 개수와 citations 일치를 검사합니다. 최초 검사에서 실패하면 한 번만 보완 재작성하고, 여전히 실패하면 게시하지 않습니다.

주요 CLI:

```powershell
# 후보 목록 (선택적으로 카테고리 필터)
python -m scripts.deep_dive topics list
python -m scripts.deep_dive topics list --category F

# 기존 제안 배치에서 3개 생성 및 발행
python -m scripts.deep_dive generate --topics-file scripts/deep_dive/topic_batch_2026-10.json --category T --count 3 --publish --image

# 사용자가 요청한 새 주제 1개
python -m scripts.deep_dive generate --topic "How to use a Korean laundromat" --category L --publish --image

# GSC에서 저장한 URL 목록 중 2개 조사·갱신
python -m scripts.deep_dive improve --slugs-file gsc-slugs.txt --limit 2 --focus "recheck current information using official sources"
```

### 기존 URL 개선

Google Search Console에서 미색인 URL을 내보낸 다음 URL 또는 slug를 한 줄씩 텍스트 파일로 저장합니다. `improve`는 기존 원문을 보존하면서 공식 출처에 따라 수정 초안을 만들고, 검토 폴더에 저장합니다.

```powershell
# 1개 URL의 수정 초안 생성
python -m scripts.deep_dive improve --slug korean-citizenship-naturalization-process --focus "verify current eligibility, fees, and official application steps"

# URL/slug 목록에서 최대 5개까지 순차 처리
python -m scripts.deep_dive improve --slugs-file gsc-slugs.txt --limit 5 --focus "verify current official rules and remove unsupported claims"

# diff를 사람이 확인한 뒤 원문 백업과 함께 기존 URL에 반영
python -m scripts.deep_dive improve --slug korean-citizenship-naturalization-process --focus "verify current official requirements" --apply
```

- 기본 수정 초안: `content/deep-dive-drafts/revisions/`
- `--apply`는 기존 글의 백업을 만든 다음에만 교체합니다.
- 기존 글에 적용하면 날짜·canonical URL은 유지하고, 실질 변경이 있을 때만 `updated` 날짜를 추가합니다.
- 미색인 자체가 잘못된 HTTP 설정 때문일 수도 있으므로 GSC에서 canonical, 색인 상태, 실제 URL 응답을 먼저 분류합니다. 모든 제외 URL을 무조건 다시 쓰는 것은 권하지 않습니다.

## 새 글 생성 및 발행 기준

일반·여행·음식·문화·생활·쇼핑 글은 `--publish`를 쓰면 품질 게이트를 통과한 페이지를 `content/deep-dive/`에 저장하고, 커버를 `public/images/`에 저장합니다. 이후 빌드가 페이지, sitemap, 검색 인덱스, OG 이미지를 생성합니다.

```powershell
python -m scripts.deep_dive generate --topic "A specific reader question" --category T --publish --image
```

`--publish` 없이 실행하면 검토용 파일을 `content/deep-dive-drafts/flash-generated/`에 저장합니다. 기존 공개 파일을 덮어쓰지 않으며, 정확한 slug가 이미 게시돼 있으면 중복 생성을 건너뜁니다.

### 의료·법률·비자·세금 등 고위험 콘텐츠

고위험 글은 실제 공식 근거를 확인하지 않은 채 발행하면 안 됩니다. 이미 조사된 30개 묶음의 의료 글처럼 1차 자료를 다시 확인하고 근거에 맞게 정리한 경우에만 다음 옵션을 사용합니다.

```powershell
python -m scripts.deep_dive generate --topic "A healthcare system explainer" --category M --publish --image --sensitive-reviewed
```

`--sensitive-reviewed`는 작성자의 공식 출처 검토를 기록하는 확인 옵션이지, 코드가 의료 사실을 보증한다는 뜻은 아닙니다. 응급번호, 진료·수술 안전, 자격·등록, 보험, 치료 결과나 비행 가능 시기 같은 주장은 관련 정부·법령·의료기관 1차 출처로 확인합니다. 일반적인 정보에 머물도록 쓰고 진단·치료 조언, 보장된 결과, 보편적 안전 기간은 단정하지 않습니다. 확인 가능한 1차 자료가 없으면 발행 대신 초안으로 남깁니다.

## 환경 설정 및 결제

- API 키는 프로젝트 루트의 `.env.local`에서 `GEMINI_API_KEY`로 읽습니다. 키를 채팅, README, 로그, Git에 복사하지 마세요. `.env.local`은 Git에서 제외됩니다.
- 현재 SDK 요구사항은 [scripts/deep_dive/requirements.txt](scripts/deep_dive/requirements.txt)에 고정 범위로 적혀 있습니다.
- 무료 등급의 사용 가능 여부와 Google Search grounding 한도는 모델·계정별로 다릅니다. HTTP `402`는 Gemini API 선불 크레딧 잔액을 확인하라는 오류이고, `429`는 사용량/속도 제한 오류입니다.
- 모델 단가, 무료 grounding 요청 수, 할당량은 변동됩니다. 실행 직전에 [Gemini 모델](https://ai.google.dev/gemini-api/docs/models), [Gemini API 가격](https://ai.google.dev/gemini-api/docs/pricing), [Google Search grounding](https://ai.google.dev/gemini-api/docs/google-search)을 확인하세요. 실제 비용은 텍스트 토큰, 여러 개가 될 수 있는 검색 쿼리, 이미지, 재시도에 따라 달라집니다.
- 기본 실행은 1개, 배치는 한 번에 최대 5개입니다. 실패한 항목만 다시 실행하고, 이미 존재하는 초안은 출력 경로를 확인해 중복 과금을 막습니다. “무한 생성”은 API 제한과 Google 정책을 무시하거나 무제한 자동 게시한다는 뜻이 아닙니다.

## 빌드·로컬 확인·배포

이 저장소는 Next.js `output: export` 정적 사이트입니다. **`npm start`는 사용할 수 없습니다.**

```powershell
# 게시 콘텐츠를 검증·빌드하고 검색 인덱스 생성
npm run build

# 정적 결과를 로컬 HTTP로 확인할 때 (serve 사용 가능 환경)
npx serve out
```

Next.js 페이지의 정적 생성이 성공해야 배포 가능한 상태입니다. GitHub `main`에 푸시하면 연결된 Cloudflare Pages가 배포합니다. 푸시 전 변경사항과 이미지가 함께 들어갔는지 `git status`, `git diff --cached --stat`, `git diff --cached --check`로 확인하고, `.env.local`은 절대로 스테이징하지 않습니다.

## 운영 요청을 받았을 때의 기본 실행 절차

나중에 “새 콘텐츠 몇 개 만들어서 올려줘”라고 요청하면 이 순서로 수행합니다.

1. `git status` 및 배치 파일을 확인하고, 이미 올라간 slug와 검색 의도가 중복되는 주제를 제외합니다.
2. 요청한 수와 6개 카테고리에 맞춰 주제를 균형 있게 선택합니다. 주제가 정해져 있지 않으면 기존 [topic_ideas.json](scripts/deep_dive/topic_ideas.json) 또는 새 `topic_batch_*.json` 배치를 사용합니다.
3. `--dry-run`으로 slug와 카테고리를 확인합니다.
4. 5개 이하의 작은 배치로 실제 생성합니다. 요청이 게시까지 포함하면 `--publish --image`를 사용하고, 민감 주제는 법령·공식 기관 근거를 확인한 뒤에만 `--sensitive-reviewed`를 사용합니다.
5. 출처 개수와 품질 게이트 실패를 확인합니다. 오류 또는 구체적인 근거 문제가 있는 글은 자동으로 밀어붙이지 않고 고친 뒤 다시 검사합니다. 해결이 안 되면 해당 글만 draft로 남기고 다른 정상 결과는 계속 처리합니다.
6. `npm run build`로 전체 빌드를 검증하고 새 URL마다 HTML·sitemap·검색 인덱스, 이미지 참조를 확인합니다.
7. 이미지 파일과 콘텐츠만 스테이징해 `git diff --cached --check` 후 커밋 및 `git push origin main`합니다. 완료 보고에는 공개 게시 수, 보류 수와 이유, 커밋을 구분해서 적습니다.
8. Google Search Console에는 정식 canonical URL을 제출합니다. sitemap 포함은 색인을 보장하지 않습니다.

## 이전 파이프라인

Deep Research 기반의 과거 코드는 남아 있지만 신규 생성의 기본 경로가 아닙니다. 정말 필요할 때만 명시적으로 선택합니다.

```powershell
python -m scripts.deep_dive --legacy-deep-research -n 39
```

일반적인 신규 제작과 기존 미색인 글 개선은 Gemini Flash CLI를 사용합니다.
