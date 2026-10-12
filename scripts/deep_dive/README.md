# Korea Experience 콘텐츠 생성기

기본 경로는 Gemini Deep Research 대신 **Gemini 3.5 Flash-Lite + Google Search grounding**을 사용합니다. API 단계·공식 단가·66개 주제 아이디어는 [운영안](../../content/deep-dive-drafts/GEMINI_FLASH_WORKFLOW.md), 아이디어 원본은 [topic_ideas.json](./topic_ideas.json)에서 확인할 수 있습니다.

## 준비

PowerShell에서 프로젝트 루트로 이동한 뒤 `.env.local`에 `GEMINI_API_KEY`를 설정하고 의존성을 설치합니다.

```powershell
python -m pip install -r scripts/deep_dive/requirements.txt
```

Python SDK: `google-genai>=2.24.0`. 모델은 환경 변수로 변경할 수 있습니다.

```dotenv
GEMINI_RESEARCH_MODEL=gemini-3.5-flash-lite
GEMINI_REVIEW_MODEL=gemini-3.5-flash-lite
GEMINI_CONVERT_MODEL=gemini-3.5-flash-lite
GEMINI_IMAGE_MODEL=gemini-3.1-flash-lite-image
```

## 명령

```powershell
# 66개 주제 전체 또는 카테고리별 목록
python -m scripts.deep_dive topics list
python -m scripts.deep_dive topics list --category T

# 사용자 주제를 todo.md에 추가 (성공하면 다음 번호를 출력)
python -m scripts.deep_dive topics add --category T --title "Seoul airport transfer options for late arrivals"

# API를 부르지 않고 실행 계획 확인
python -m scripts.deep_dive generate --topic "Seoul airport transfer options for late arrivals" --category T --dry-run

# 기본: grounded research + 초안 생성 + 저비용 일관성 점검. 결과는 검수 폴더에 저장
python -m scripts.deep_dive generate --topic "Seoul airport transfer options for late arrivals" --category T

# 30개 선정 배치 중 카테고리별 5개 생성 (코드: M/T/K/L/F/S)
python -m scripts.deep_dive generate --topics-file scripts/deep_dive/topic_batch_2026-10.json --category T --count 5 --publish
python -m scripts.deep_dive generate --topics-file scripts/deep_dive/topic_batch_2026-10.json --category M --count 5

# 사람이 초안을 검수한 다음 추가 API 호출 없이 발행
python -m scripts.deep_dive publish --slug seoul-airport-transfer-options-for-late-arrivals

# 이미지 생성은 별도 비용이 있어 요청할 때만 사용
python -m scripts.deep_dive generate --topic "Seoul airport transfer options for late arrivals" --category T --image

# 기존 게시물은 우선 검토용 수정 초안만 생성
python -m scripts.deep_dive improve --slug existing-post-slug --focus "recheck current official rules"

# Search Console에서 내보낸 URL 또는 slug 목록을 최대 5개씩 처리
python -m scripts.deep_dive improve --slugs-file gsc-slugs.txt --limit 3 --focus "verify claims with primary sources"

# 사람이 원문을 확인하고 변경을 승인한 뒤에만 기존 글을 백업 후 교체
python -m scripts.deep_dive improve --slug existing-post-slug --focus "verify current official rules" --apply
```

- 새 글 기본 출력: `content/deep-dive-drafts/flash-generated/`
- 수정 글 기본 출력: `content/deep-dive-drafts/revisions/`
- `--publish`로 바로 승격하거나 기존 글에 `--apply`하기 전에 사실·출처를 사람이 검토합니다. 의료·법률·비자·세금 등 민감 주제의 새 글은 `--sensitive-reviewed`가 추가로 필요합니다.
- 처리량은 기본 1개, 최대 5개로 제한합니다. 초안이 이미 있으면 중복 API 호출을 하지 않고 기존 초안 검토를 안내합니다. “무제한 생성”은 모델 호출 한도·검색 과금·검수 역량 때문에 무제한 자동 게시를 뜻하지 않습니다.

## 기존 Deep Research 경로

기존 흐름은 다음 플래그를 명시한 경우에만 실행합니다.

```powershell
python -m scripts.deep_dive --legacy-deep-research -n 39
python -m scripts.deep_dive --legacy-deep-research --from 39 --to 50
```

## 품질·색인 안전장치

- Google Search grounding에서 반환한 URL만 `Sources`에 허용하며, 최소 출처·길이·제목·요약·H2 품질을 로컬 검사합니다.
- Flash 검토는 조사 결과와 초안의 일관성 검사이지 독립적인 사실 검증은 아닙니다. 공식 출처 원문을 사람이 확인해야 합니다.
- `draft: true` 콘텐츠는 페이지 라우트, sitemap, 사이트 검색 및 내부 링크 인덱스에서 제외됩니다.
- 과거 Deep Research prompt는 `content/deep-dive-drafts/PROMPT.md`에 남아 있으며, 구 파이프라인에서만 사용합니다.

Google 모델, 가격, 검색 grounding 정책은 자주 변하므로 실행 전 [Gemini 모델](https://ai.google.dev/gemini-api/docs/models), [가격](https://ai.google.dev/gemini-api/docs/pricing), [Google Search grounding](https://ai.google.dev/gemini-api/docs/google-search)을 확인합니다.
