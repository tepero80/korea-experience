"""
내부 링크 관리 모듈
====================
포스트 인덱스를 빌드하고, 주어진 주제에 가장 관련 높은 포스트를 추천합니다.
Deep-dive 포스트를 우선 추천하고, 부족하면 일반 포스트로 보충합니다.

사용:
  from scripts.deep_dive.links import build_index, recommend_links

인덱스 캐시:
  scripts/deep_dive/link-index.json  (자동 생성/갱신)
"""

import json
import re
import time
from pathlib import Path

from .config import (
    API_KEY, SCENE_MODEL,        # Flash 모델 — 빠르고 저렴
    DEEP_DIVE_DIR, POSTS_DIR,
    DEEP_DIVE_SCRIPTS,
)

INDEX_FILE = DEEP_DIVE_SCRIPTS / "link-index.json"

# ── 인덱스 빌드 ──

def _extract_frontmatter(filepath: Path) -> dict | None:
    """MD 파일에서 frontmatter를 파싱합니다."""
    try:
        text = filepath.read_text(encoding="utf-8-sig")
    except Exception:
        try:
            text = filepath.read_text(encoding="cp949")
        except Exception:
            return None

    fm_match = re.match(r"^---\s*\n(.*?)\n---", text, re.DOTALL)
    if not fm_match:
        return None
    fm = fm_match.group(1)

    title_m = re.search(r'title:\s*"?([^"\n]+)"?', fm)
    cat_m = re.search(r'category:\s*(.+)', fm)
    excerpt_m = re.search(r'excerpt:\s*"?([^"\n]+)"?', fm)
    deep_m = re.search(r'deepDive:\s*true', fm, re.IGNORECASE)

    if not title_m:
        return None

    title = title_m.group(1).strip()

    # 키워드 추출: 제목에서 불용어 제거 후 3글자 이상 단어
    stopwords = {
        "the", "and", "for", "how", "what", "why", "with", "your", "from",
        "that", "this", "are", "was", "will", "can", "all", "our", "you",
        "best", "top", "guide", "complete", "ultimate", "2026", "2025",
        "korea", "korean", "seoul",
    }
    keywords = [
        w.lower() for w in re.findall(r'[a-zA-Z]+', title)
        if len(w) >= 3 and w.lower() not in stopwords
    ]

    return {
        "slug": filepath.stem,
        "title": title,
        "category": cat_m.group(1).strip() if cat_m else "",
        "excerpt": excerpt_m.group(1).strip()[:200] if excerpt_m else "",
        "keywords": keywords,
        "deep_dive": bool(deep_m),
    }


def build_index(force: bool = False) -> list[dict]:
    """전체 포스트 인덱스를 빌드하고 JSON으로 캐시합니다.

    Args:
        force: True면 캐시 무시하고 재빌드

    Returns:
        [{"slug", "title", "category", "excerpt", "keywords", "deep_dive"}]
    """
    # 캐시 체크: 파일이 있고 1시간 이내면 재사용
    if not force and INDEX_FILE.exists():
        age = time.time() - INDEX_FILE.stat().st_mtime
        if age < 3600:
            data = json.loads(INDEX_FILE.read_text(encoding="utf-8"))
            return data

    index = []

    # Deep-dive 포스트 (우선)
    if DEEP_DIVE_DIR.exists():
        for f in sorted(DEEP_DIVE_DIR.glob("*.md")):
            entry = _extract_frontmatter(f)
            if entry:
                index.append(entry)

    # 일반 포스트
    if POSTS_DIR.exists():
        for f in sorted(POSTS_DIR.glob("*.md")):
            if f.suffix == ".bak":
                continue
            entry = _extract_frontmatter(f)
            if entry:
                index.append(entry)

    # 캐시 저장
    INDEX_FILE.write_text(
        json.dumps(index, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"📇 링크 인덱스 빌드: {sum(1 for e in index if e['deep_dive'])} deep-dive + "
          f"{sum(1 for e in index if not e['deep_dive'])} posts = {len(index)}개")

    return index


def refresh_index():
    """캐시를 강제 재빌드합니다."""
    return build_index(force=True)


# ── 키워드 기반 사전 필터 ──

def _keyword_score(entry: dict, topic_keywords: list[str]) -> int:
    """키워드 겹침 점수를 계산합니다."""
    entry_kw = set(entry["keywords"])
    topic_kw = set(topic_keywords)
    return len(entry_kw & topic_kw)


def _prefilter(index: list[dict], topic: str, category: str,
               exclude_slug: str = "", top_n: int = 40) -> list[dict]:
    """키워드 매칭으로 후보를 사전 필터링합니다."""
    stopwords = {
        "the", "and", "for", "how", "what", "why", "with", "your", "from",
        "that", "this", "are", "was", "will", "can", "all", "our", "you",
        "best", "top", "guide", "complete", "ultimate", "2026", "2025",
        "korea", "korean", "seoul",
    }
    topic_keywords = [
        w.lower() for w in re.findall(r'[a-zA-Z]+', topic)
        if len(w) >= 3 and w.lower() not in stopwords
    ]

    scored = []
    for entry in index:
        if entry["slug"] == exclude_slug:
            continue
        kw_score = _keyword_score(entry, topic_keywords)
        # 같은 카테고리 보너스
        cat_bonus = 2 if entry["category"] == category else 0
        # deep-dive 보너스
        dd_bonus = 3 if entry["deep_dive"] else 0
        scored.append((kw_score + cat_bonus + dd_bonus, entry))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [e for _, e in scored[:top_n]]


# ── Gemini 기반 추천 ──

RECOMMEND_PROMPT = """You are an internal link strategist for "Korea Experience", a Korea travel blog.

Given a new article topic and a list of existing posts, select the 5-8 most relevant posts to link FROM the new article.

RULES:
1. Prioritize [DEEP DIVE] posts — they are flagship content
2. Choose posts that a reader of the new article would ACTUALLY want to click
3. Prefer topical overlap (same category, related subject)
4. Include at least 1-2 posts from different categories for cross-linking
5. Return ONLY the slugs, one per line, most relevant first

NEW ARTICLE:
  Topic: {topic}
  Category: {category}

CANDIDATE POSTS:
{candidates}

OUTPUT (slugs only, one per line, 5-8 lines):"""


def recommend_links(topic: str, category: str, slug: str = "",
                    api_key: str = "", count: int = 8) -> list[dict]:
    """주어진 주제에 가장 관련 높은 포스트를 추천합니다.

    Deep-dive 우선, 부족하면 일반 포스트로 보충합니다.

    Args:
        topic: 새 글 주제
        category: 카테고리명
        slug: 자기 자신의 슬러그 (제외용)
        api_key: Gemini API key
        count: 추천 개수

    Returns:
        [{"slug", "title", "deep_dive"}] — 추천 순서대로
    """
    index = build_index()

    if not index:
        print("⚠️  링크 인덱스가 비어있습니다.")
        return []

    # 1단계: 키워드 사전 필터 → 상위 40개 후보
    candidates = _prefilter(index, topic, category, exclude_slug=slug, top_n=40)

    if not candidates:
        return []

    # 후보 목록 포맷
    candidate_lines = []
    for c in candidates:
        tag = "[DEEP DIVE] " if c["deep_dive"] else ""
        candidate_lines.append(f"  {tag}{c['slug']}  —  {c['title']}  ({c['category']})")
    candidates_text = "\n".join(candidate_lines)

    # 2단계: Gemini Flash로 최종 선별
    api_key = api_key or API_KEY
    if not api_key:
        # API 없으면 키워드 점수 기반 fallback
        print("⚠️  API key 없음 → 키워드 점수 기반 추천")
        return _fallback_recommend(candidates, count)

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        prompt = RECOMMEND_PROMPT.format(
            topic=topic, category=category, candidates=candidates_text,
        )

        response = client.models.generate_content(
            model=SCENE_MODEL,  # gemini-2.5-flash — 빠르고 저렴
            contents=[prompt],
            config=types.GenerateContentConfig(temperature=0.2, max_output_tokens=1024),
        )

        result_text = response.text.strip()
        recommended_slugs = [
            line.strip() for line in result_text.splitlines()
            if line.strip() and not line.strip().startswith("#")
        ]

        # 슬러그로 인덱스에서 찾기
        slug_map = {e["slug"]: e for e in index}
        recommended = []
        for rs in recommended_slugs[:count]:
            # 정확 매칭
            if rs in slug_map:
                recommended.append(slug_map[rs])
                continue
            # 부분 매칭 (LLM이 약간 다르게 출력할 수 있음)
            clean = rs.strip("- ").strip()
            if clean in slug_map:
                recommended.append(slug_map[clean])

        if len(recommended) < 3:
            # LLM 결과 부족 → fallback 보충
            existing = {r["slug"] for r in recommended}
            for c in candidates:
                if c["slug"] not in existing:
                    recommended.append(c)
                    if len(recommended) >= count:
                        break

        print(f"🔗 내부 링크 추천 {len(recommended)}개 "
              f"(deep-dive: {sum(1 for r in recommended if r['deep_dive'])})")
        return recommended[:count]

    except Exception as e:
        print(f"⚠️  Gemini 추천 실패: {e} → 키워드 기반 fallback")
        return _fallback_recommend(candidates, count)


def _fallback_recommend(candidates: list[dict], count: int) -> list[dict]:
    """API 없이 키워드 점수 기반으로 추천합니다. Deep-dive 우선."""
    # deep-dive 먼저, 일반 포스트 뒤에
    dd = [c for c in candidates if c["deep_dive"]]
    normal = [c for c in candidates if not c["deep_dive"]]

    result = dd[:count]
    remaining = count - len(result)
    if remaining > 0:
        result.extend(normal[:remaining])

    print(f"🔗 내부 링크 fallback 추천 {len(result)}개 "
          f"(deep-dive: {sum(1 for r in result if r['deep_dive'])})")
    return result[:count]


# ── 프롬프트용 포맷 ──

def format_links_for_prompt(recommended: list[dict]) -> str:
    """MDX 변환 프롬프트에 넣을 추천 링크 섹션을 생성합니다."""
    if not recommended:
        return ""

    lines = ["RECOMMENDED INTERNAL LINKS (use 3-5 of these, prioritize ★ deep-dive posts):"]
    for r in recommended:
        star = "★ " if r["deep_dive"] else "  "
        lines.append(f"  {star}/blog/{r['slug']}  —  \"{r['title']}\"")

    lines.append("")
    lines.append("Insert links naturally in context using [descriptive anchor text](/blog/slug) format.")
    lines.append("Do NOT dump all links in one section. Spread them across relevant paragraphs.")

    return "\n".join(lines)
