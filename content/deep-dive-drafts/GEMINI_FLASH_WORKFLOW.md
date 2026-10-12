# 딥리서치 없는 Gemini Flash 콘텐츠 운영안

확인 기준일: 2026-10-12. 모델명·가격은 변동될 수 있으므로 실제 사용 전 공식 가격표를 확인합니다.

## 권장 API 단계

| 단계 | 기본 선택 | API | 역할 |
|---|---|---|---|
| 근거 조사 | `gemini-3.5-flash-lite` | Gemini Interactions API + `google_search` grounding | 공식·1차 출처를 우선 검색하고, 모델이 반환한 URL 인용과 불확실성을 evidence brief로 저장 |
| 본문 작성 | `gemini-3.5-flash-lite` | Gemini `generate_content` | 조사 brief와 URL 목록만 사용해 900~1,800단어의 읽을 만한 초안 생성. 긴 분량이나 반복 구성은 강제하지 않음 |
| 자체 일관성 검사 | `gemini-3.5-flash-lite` | Gemini `generate_content` JSON 응답 | 초안 주장이 research brief와 일치하는지 검사. 독립적 사실 검증이라고 표시하지 않음 |
| 선택적 품질 승급 | `gemini-3.8-flash` | 필요할 때만 재작성/복잡한 수정 | Flash-Lite 결과가 부족하거나 사용자가 지정한 경우에만 사용 |
| 선택 이미지 | `gemini-3.1-flash-lite-image` | 이미지 생성 API | 글을 검수한 다음 선택적으로 커버 생성. 기본 비활성화 |

저가 기본 모델은 Google의 모델 표에서 최신 안정형 저비용 텍스트 모델로 안내되는 Gemini 3.5 Flash-Lite입니다. 이 모델은 Google Search grounding 지원 목록에도 있습니다. Free tier에서는 grounding을 사용할 수 없을 수 있으므로 **유료 계정/결제 사용 가능 여부를 먼저 확인**해야 합니다.

## 공식 단가 참고

- Gemini 3.5 Flash-Lite: 입력 **$0.30/100만 토큰**, 출력(사고 토큰 포함) **$2.50/100만 토큰**.
- Gemini 3.8 Flash: 2026-12-31까지 입력 **$0.75**, 출력 **$3.75/100만 토큰**. Google 표에는 2027-01-01부터 입력 $1.50, 출력 $7.50로 바뀐다고 표시됩니다.
- Gemini 3+ Google Search grounding: 모든 Gemini 3+ 모델이 공유하는 월 5,000건 무료 요청 이후 실행된 검색 쿼리 1,000건당 **$14**. 프롬프트 한 번에 여러 검색 쿼리가 생길 수 있으므로 API 호출 수와 과금 검색 수는 같지 않을 수 있습니다.
- Gemini 3.1 Flash-Lite Image의 1K 이미지: Google 가격표 기준 약 **$0.0336/장**. 생성 성공을 보장하지 않으며 재시도 비용은 별도입니다.

예시로 총 입력 20,000토큰, 출력 5,000토큰이라고 가정하면 Flash-Lite 텍스트 토큰 비용만 약 **$0.0185**입니다. 실제 비용은 프롬프트/본문 길이·응답 길이·재시도·검색 쿼리 수·현재 단가에 따라 달라지며 이미지 비용과 월 무료 grounding 소진 후 비용은 별도입니다. 사용 전 프로젝트의 결제·할당량을 확인하세요.

## 실행

프로젝트 루트에서 실행합니다. Python 패키지는 `scripts/deep_dive/requirements.txt`를 사용합니다.

```powershell
python -m pip install -r scripts/deep_dive/requirements.txt
python -m scripts.deep_dive topics list
python -m scripts.deep_dive topics list --category T
python -m scripts.deep_dive topics add --category T --title "Seoul airport transfer options for late arrivals"
python -m scripts.deep_dive generate --topics-file scripts/deep_dive/topic_batch_2026-10.json --category T --count 5 --publish
python -m scripts.deep_dive generate --topics-file scripts/deep_dive/topic_batch_2026-10.json --category M --count 5
python -m scripts.deep_dive generate --topic "Seoul airport transfer options for late arrivals" --category T --dry-run
python -m scripts.deep_dive generate --topic "Seoul airport transfer options for late arrivals" --category T
python -m scripts.deep_dive generate --topic "Seoul airport transfer options for late arrivals" --category T --publish
python -m scripts.deep_dive generate --topic "Seoul airport transfer options for late arrivals" --category T --publish --image
python -m scripts.deep_dive publish --slug seoul-airport-transfer-options-for-late-arrivals
python -m scripts.deep_dive improve --slug medical-emergencies-1330-vs-119-2026 --focus "recheck emergency numbers and fines against current official sources"
python -m scripts.deep_dive improve --slug medical-emergencies-1330-vs-119-2026 --focus "recheck emergency numbers and fines" --apply
```

- `topics list`: 새로 선별한 66개 주제 아이디어를 카테고리별로 보여 줍니다.
- `topics add`: 사용자 주제를 검증하고 `todo.md`의 새 번호로 추가합니다.
- 이번 30개 배치는 [topic_batch_2026-10.json](../../scripts/deep_dive/topic_batch_2026-10.json)에 저장되어 있습니다. 카테고리별 실행은 5개씩 나누며, 의료 주제(M)는 기본적으로 검토 초안에만 저장해야 합니다.
- 민감한 의료·법률·비자·세금 글을 `--publish`하려면 1차 출처를 확인한 뒤 `--sensitive-reviewed`도 명시해야 합니다. 기존 글의 `--apply` 역시 원문을 직접 확인한 사람이 실행해야 합니다.
- `generate`: 기본은 `content/deep-dive-drafts/flash-generated/`에 검토용 초안을 만듭니다. `--publish` 전에는 사이트 공개 폴더에 게시하지 않습니다.
- 가장 안전한 운영은 기본 초안을 먼저 사람이 확인한 뒤 `publish --slug ...`로 승격하는 것입니다. 이 승격은 API를 다시 호출하지 않으며, 이미지 경로가 있으면 파일 존재도 검사합니다.
- `improve`: 기존 글을 조사해 `content/deep-dive-drafts/revisions/`에 교체 초안을 만듭니다. `--apply`를 주면 원본의 백업을 만든 후에만 교체합니다.
- URL/slug 파일은 줄 단위 텍스트로 준비하고 `python -m scripts.deep_dive improve --slugs-file gsc-slugs.txt --limit 3 --focus "..."`로 최대 5개씩 처리합니다. 기본은 검토 초안이며 자동 게시하지 않습니다.
- 자동 생성은 API 비용, 할당량, Google 정책, 검수 병목 때문에 “무제한 게시”로 설정하지 않습니다. 기본 배치는 1개, 최대 5개이며 `--publish`는 명시 동의입니다. 생성물은 특히 의료·비자·법률·세금·안전 주제에서 출처 원문을 사람이 확인해야 합니다.
- 명시적으로 구 파이프라인을 사용해야 할 때만 `python -m scripts.deep_dive --legacy-deep-research -n 601`을 사용합니다.

## 색인 미포함 URL 보강 운영

1. Search Console에서 URL을 내보내고 canonical이 `https://koreaexperience.com/...`인지 먼저 확인합니다.
2. 각 URL에 `improve --slug <slug>`를 실행해 새로운 grounding 출처와 수정 초안을 생성합니다.
3. 공식 출처 링크, 핵심 주장, 최신성, 독창적 도움, 내부 링크를 검토하고 유지/보강/통합/삭제를 편집자가 결정합니다.
4. `--apply`는 리뷰가 끝난 URL에만 실행하고, 작은 배치로 빌드/배포한 뒤 Search Console에서 대표 URL을 재검사합니다.
5. “단어 수 늘리기”나 기계적인 게시량 증가를 색인 회복 전략으로 쓰지 않습니다. 기존 글의 의도 중복·근거 부족은 통합/제거가 더 나을 수 있습니다.

## 주제 선정 원칙

아이디어 목록은 계절별·지역별 검색 의도, 교통·예약·접근성·주문·에티켓의 실제 문제, 공식 정보로 확인 가능한 세부 질문을 중심으로 구성했습니다. 단순한 “Top 10” 나열, 근거 없는 가격 비교, 표본 없는 랭킹, 의료 결과 약속, 매년 숫자만 바꾼 반복 주제는 피합니다. 의료 분야 항목은 게시 전 사람의 1차 출처 검토가 필수입니다.

## 공식 출처

- [Gemini 모델](https://ai.google.dev/gemini-api/docs/models)
- [Gemini API 가격](https://ai.google.dev/gemini-api/docs/pricing)
- [Google Search grounding](https://ai.google.dev/gemini-api/docs/google-search)
- [Interactions API](https://ai.google.dev/gemini-api/docs/interactions-overview)
- [Google Gen AI Python SDK](https://github.com/googleapis/python-genai)
