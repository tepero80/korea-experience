"""
MDX 변환 모듈
==============
드래프트를 MDX 포맷으로 변환합니다 (Gemini Pro 사용).

사용:
  from deep_dive.convert import convert_to_mdx, sanitize_mdx, save_mdx
"""

import re
import time
from pathlib import Path

from .config import (
    API_KEY, CONVERT_MODEL, DEEP_DIVE_DIR, IMAGES_DIR,
    VALID_COMPONENTS, ARRAY_PROPS,
)
from .topics import get_existing_slugs, get_next_deep_dive_order
from .links import recommend_links, format_links_for_prompt


def build_conversion_prompt(draft_text: str, category: str, slug: str,
                            image_path: str | None, today: str,
                            topic: str = "", api_key: str = "") -> str:
    """드래프트를 MDX로 변환하는 프롬프트를 생성합니다."""
    deep_dive_order = get_next_deep_dive_order()

    # 추천 내부 링크 (deep-dive 우선)
    recommended = recommend_links(topic or slug, category, slug=slug, api_key=api_key)
    link_section = format_links_for_prompt(recommended)

    # fallback: 추천이 비어있으면 기존 방식
    if not link_section:
        existing_slugs = get_existing_slugs()
        link_section = ("INTERNAL LINKS (MANDATORY 3-5):\n"
                        "Embed naturally using: [anchor text](/blog/slug)\n"
                        "ONLY use slugs from this list:\n"
                        + "\n".join(f"  /blog/{s}" for s in existing_slugs[:100]))

    image_frontmatter = ""
    if image_path:
        image_frontmatter = f'image: "{image_path}"'

    return f"""You are an expert MDX content converter for the Korea Experience blog.
Convert the following Deep Research draft into a production-ready MDX blog post.

CRITICAL RULES:
1. Output ONLY the MDX content. Start directly with --- for frontmatter.
2. Do NOT wrap output in code blocks. No ```markdown or ```mdx.
3. English only — no Korean characters in the output.
4. All content from the draft must be preserved — do not omit information.

FRONTMATTER (exact format):
---
title: "[SEO title - MUST be ≤70 characters, include main keyword]"
date: {today}
excerpt: "[Compelling summary - MUST be ≤160 characters, include specific data]"
category: {category}
author: Korea Experience Team
deepDive: true
deepDiveOrder: {deep_dive_order}
{image_frontmatter}
---

TITLE RULES:
- MUST be 70 characters or fewer
- Use natural sentence case (only capitalize first word, proper nouns, acronyms)

EXCERPT RULES:
- MUST be 160 characters or fewer
- Include specific data points (prices, percentages, year)
- Do NOT use colons (:) inside the excerpt

STRUCTURE: Opening paragraph → KeyTakeaways → QuickFacts → Body (4-6 H2s) →
Timeline → ComparisonTable → ProsCons → StepGuide → ExpertTip →
InfoBox (arc-free MANDATORY) → FAQAccordion (MANDATORY) → Conclusion → Sources

{link_section}

LATEX CONVERSION: Remove ALL LaTeX $ delimiters, keep currency $ signs.

ICON RULE: ALL icon props MUST use emoji characters: "💰" "📅" "🏥"

JSX RULES:
- Array props: points={{["a", "b"]}}
- Boolean: rating={{4.5}} verified={{true}}
- No double quotes inside strings — use single quotes

MINIMUM: 3,000+ words, 5-7 components, 4-6 H2 sections,
KeyTakeaways + FAQAccordion + InfoBox arc-free all MANDATORY.

---

DRAFT TO CONVERT:

{draft_text}
"""


def sanitize_mdx(content: str) -> tuple[str, list[str]]:
    """MDX 내용을 자동 검증/수정합니다."""
    fixes = []

    # 코드블록 래퍼 제거
    if content.startswith("```markdown") or content.startswith("```mdx") or content.startswith("```"):
        content = re.sub(r"^```(?:markdown|mdx)?\n", "", content)
        content = re.sub(r"\n```\s*$", "", content)
        fixes.append("Removed code block wrapper")

    # difficulty 대소문자 수정
    def fix_difficulty(m):
        val = m.group(1)
        lower = val.lower()
        if lower != val:
            fixes.append(f'difficulty="{val}" → difficulty="{lower}"')
        return f'difficulty="{lower}"'
    content = re.sub(r'difficulty="(Easy|Medium|Hard|EASY|MEDIUM|HARD)"', fix_difficulty, content, flags=re.IGNORECASE)

    # 배열 props {} 누락 수정
    array_pat = r'(' + '|'.join(ARRAY_PROPS) + r')\s*=\s*\['
    def fix_array(m):
        attr = m.group(1)
        fixes.append(f"{attr}=[] → {attr}={{[]}}")
        return f"{attr}={{["
    content = re.sub(array_pat, fix_array, content)

    # 잘못된 닫는 태그 수정
    def fix_closing_tag(m):
        tag = m.group(1)
        if tag in VALID_COMPONENTS:
            return m.group(0)
        for valid in VALID_COMPONENTS:
            if valid.lower() in tag.lower() or tag.lower() in valid.lower():
                fixes.append(f"</{tag}> → </{valid}>")
                return f"</{valid}>"
        return m.group(0)
    content = re.sub(r"</([A-Z][a-zA-Z]+)>", fix_closing_tag, content)

    # LaTeX 잔여 제거
    latex_inline = re.findall(r"\$[^$]*\\[a-zA-Z][^$]*\$|\$₩[\d,]+\$", content)
    for expr in latex_inline:
        inner = expr.strip("$")
        clean = inner.replace("\\%", "%").replace("\\approx", "~").replace("\\times", "×")
        clean = re.sub(r"\\frac\{([^}]+)\}\{([^}]+)\}", r"\1/\2", clean)
        clean = re.sub(r"\\[a-zA-Z]+", "", clean).strip()
        if clean != inner:
            content = content.replace(expr, clean)
            fixes.append(f"LaTeX: {expr[:30]} → {clean[:30]}")

    # 내부 링크 검증
    existing_slugs = set(get_existing_slugs())
    def fix_link(m):
        anchor, slug = m.group(1), m.group(2)
        if slug in existing_slugs:
            return m.group(0)
        slug_words = [w for w in slug.split("-") if len(w) > 3]
        for s in existing_slugs:
            if slug_words and sum(1 for w in slug_words if w in s) >= max(1, len(slug_words) * 0.75):
                fixes.append(f"Link fixed: /blog/{slug} → /blog/{s}")
                return f"[{anchor}](/blog/{s})"
        fixes.append(f"Link removed (no match): /blog/{slug}")
        return anchor
    content = re.sub(r"\[([^\]]+)\]\(/blog/([a-z0-9-]+)\)", fix_link, content)

    return content, fixes


def convert_to_mdx(draft_text: str, category: str, slug: str,
                   image_path: str | None, api_key: str = "",
                   topic: str = "") -> str | None:
    """Gemini Pro를 사용하여 드래프트를 MDX로 변환합니다."""
    from google import genai
    from google.genai import types

    api_key = api_key or API_KEY
    client = genai.Client(api_key=api_key)

    today = time.strftime("%Y-%m-%d")
    prompt = build_conversion_prompt(
        draft_text, category, slug, image_path, today,
        topic=topic, api_key=api_key,
    )

    print(f"\n📝 MDX 변환 중...")
    print(f"   모델: {CONVERT_MODEL}")
    print(f"   프롬프트: {len(prompt):,}자")

    try:
        response = client.models.generate_content(
            model=CONVERT_MODEL,
            contents=[prompt],
            config=types.GenerateContentConfig(temperature=0.3, max_output_tokens=65536),
        )

        result = response.text
        if not result:
            print("⚠️  MDX 변환 결과가 비어있습니다.")
            return None

        sanitized, fixes = sanitize_mdx(result)
        if fixes:
            print(f"🔧 자동 수정 {len(fixes)}건:")
            for f in fixes[:10]:
                print(f"   • {f}")
        else:
            print("✅ MDX 검증 통과")

        word_count = len(sanitized.split())
        print(f"   단어 수: ~{word_count:,}")
        return sanitized

    except Exception as e:
        print(f"⚠️  MDX 변환 실패: {e}")
        return None


def save_mdx(content: str, slug: str) -> Path:
    """MDX 파일을 content/deep-dive/에 저장합니다."""
    DEEP_DIVE_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{slug}-2026.md" if not slug.endswith("-2026") else f"{slug}.md"
    filepath = DEEP_DIVE_DIR / filename
    filepath.write_text(content, encoding="utf-8")
    print(f"💾 MDX 저장: content/deep-dive/{filename}")
    return filepath
