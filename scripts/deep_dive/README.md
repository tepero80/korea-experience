# Deep Dive Content Pipeline

Gemini Deep Research API를 사용한 딥다이브 콘텐츠 자동 생성 파이프라인입니다.

## 구조

```
scripts/deep_dive/
├── __init__.py          # 패키지 초기화
├── __main__.py          # python -m scripts.deep_dive 진입점
├── config.py            # 공유 설정 (경로, 모델, 카테고리 등)
├── topics.py            # todo.md 파서, 상태 추적, 슬러그 유틸
├── research.py          # Deep Research API 호출 (스트리밍/폴링)
├── convert.py           # MDX 변환 (Gemini Pro) + 자동 검증
├── cover.py             # 커버 이미지 생성 (Gemini → Pillow 오버레이)
├── links.py             # 내부 링크 자동 추천 (deep-dive 우선)
├── generate.py          # 전체 파이프라인 CLI (메인 진입점)
├── batch_covers.py      # 커버 이미지 일괄 교체 CLI
├── add_links.py         # 내부 링크 삽입 유틸 (레거시)
├── audit.py             # MDX 품질 감사 유틸
├── todo.md              # 600개 주제 목록 + 상태 추적
├── link-index.json      # 포스트 인덱스 캐시 (자동 생성)
├── README.md
├── fonts/
│   ├── Montserrat-Bold.ttf
│   └── Montserrat-SemiBold.ttf
└── _archive/            # 구 스크립트 백업
```

---

## 실행 방법

**프로젝트 루트에서 실행합니다:**

```bash
cd C:\kc\korea-experience
```

### 1. 특정 번호 1개

```bash
python -m scripts.deep_dive -n 39
```

todo.md의 39번 주제만 처리합니다.

### 2. 범위 지정

```bash
python -m scripts.deep_dive --from 39 --to 50
```

39번부터 50번까지 순서대로 처리합니다 (이미 done인 항목 포함).

### 3. 다음 미완료 N개

```bash
python -m scripts.deep_dive -c 10
python -m scripts.deep_dive -c 15
```

todo.md에서 아직 완료되지 않은 주제를 순서대로 10개(또는 15개) 처리합니다.
`done` 상태는 자동 건너뛰고, `partial`/`failed` 항목은 재처리됩니다.

### 4. 미완료 전체

```bash
python -m scripts.deep_dive --all
```

미완료 주제 전부를 한번에 처리합니다. `Ctrl+C`로 안전하게 중단할 수 있습니다.

### 기본 (인자 없음)

```bash
python -m scripts.deep_dive
```

다음 미완료 주제 1개를 자동으로 찾아 처리합니다.

---

## 옵션

| 옵션 | 설명 |
|------|------|
| `--dry-run` | API 호출 없이 프롬프트만 확인 |
| `--no-stream` | 스트리밍 대신 폴링 모드로 실행 |
| `--no-image` | 커버 이미지 생성 건너뛰기 |
| `--image-only` | 이미지만 생성 (드래프트 필요) |
| `--no-convert` | MDX 변환 건너뛰기 (드래프트 + 이미지만) |
| `--convert-only` | MDX 변환만 실행 (드래프트 필요) |
| `--backfill-covers` | 기존 MDX에 커버 이미지 일괄 생성 |
| `--backfill-limit N` | backfill 최대 N개만 처리 |

### 옵션 조합 예시

```bash
# 다음 5개 확인만 (API 호출 없음)
python -m scripts.deep_dive -c 5 --dry-run

# 39번 이미지만 재생성
python -m scripts.deep_dive -n 39 --image-only

# 미완료 전체 MDX 재변환
python -m scripts.deep_dive --all --convert-only

# 39~50번 리서치만 (이미지/변환 건너뛰기)
python -m scripts.deep_dive --from 39 --to 50 --no-image --no-convert
```

---

## todo.md 상태 추적

각 항목의 진행 상태가 자동으로 기록됩니다:

```markdown
# 완료된 항목
1. [M] Medical Tourism Visa  | done  | RIC  | 2026-02-08

# 일부만 완료
39. [K] Lovely Runner filming locations  | partial  | RI  | 2026-02-08

# 실패한 항목 (에러 메시지 포함)
40. [L] How to identify cult recruitment  | failed  | R  | 2026-02-08  | image API timeout

# 미시작 항목
41. [F] Drinking etiquette: pour and receive
```

| 필드 | 설명 |
|------|------|
| status | `done` / `partial` / `failed` / (없음=미시작) |
| steps | `R`esearch / `I`mage / `C`onvert (완료된 단계) |
| date | 마지막 업데이트 날짜 |
| error | 실패 원인 (있을 때만) |

- 3단계(RIC) 모두 완료 → 자동으로 `done`
- 재시도 성공 시 에러 자동 클리어
- `-c 10` 실행 시 `done`은 건너뛰고 `partial`/`failed`부터 재처리

---

## 내부 링크 자동화

MDX 변환 시 관련 포스트를 자동으로 추천하여 내부 링크를 삽입합니다:

1. **인덱스 빌드**: 전체 포스트(deep-dive + 일반) 인덱스를 JSON으로 캐시
2. **키워드 사전필터**: 주제 관련 후보 40개 추출 (deep-dive 가중치 +3)
3. **Gemini Flash 선별**: 후보 중 5~8개를 최종 추천 (★ deep-dive 우선)
4. **MDX 변환 프롬프트**에 추천 목록을 전달하여 자연스럽게 삽입
5. **생성 완료 후 인덱스 갱신** → 다음 글에서 방금 만든 글도 추천 대상

---

## 파이프라인 흐름

```
todo.md (600 topics)
    │
    ├─[R] Deep Research API (gemini-deep-research)
    │     └→ content/deep-dive-drafts/{num}. [{code}] {topic}.txt
    │
    ├─[I] Cover Image (gemini-3-pro-image-preview → Pillow overlay)
    │     └→ public/images/deep-dive/{slug}.webp
    │
    └─[C] MDX Conversion (gemini-3-pro-preview + 내부 링크 추천)
          └→ content/deep-dive/{slug}-2026.md
          └→ link-index.json 갱신
```

## 모듈별 임포트

```python
# 설정
from scripts.deep_dive.config import API_KEY, IMAGE_MODEL, CATEGORY_CODE_MAP

# 주제 관리 + 상태
from scripts.deep_dive.topics import parse_todo, find_next_number, update_status
from scripts.deep_dive.topics import STEP_RESEARCH, STEP_IMAGE, STEP_CONVERT

# 리서치
from scripts.deep_dive.research import build_prompt, run_deep_research_streaming

# 내부 링크
from scripts.deep_dive.links import build_index, recommend_links, refresh_index

# MDX 변환
from scripts.deep_dive.convert import convert_to_mdx, sanitize_mdx, save_mdx

# 커버 이미지
from scripts.deep_dive.cover import generate_cover, overlay_text
```

## 주제 추가

1. `scripts/deep_dive/todo.md`에 새 주제 추가:
   ```
   601. [T] New Topic Name Here
   ```
   카테고리 코드: `[M]` Medical, `[T]` Travel, `[K]` K-Culture, `[L]` Living, `[F]` Food, `[S]` Shopping

2. 실행:
   ```bash
   python -m scripts.deep_dive -n 601
   ```

## 필요 패키지

```bash
pip install google-genai python-dotenv Pillow
```

## 환경변수

`.env.local`에 `GEMINI_API_KEY` 설정 필요.
