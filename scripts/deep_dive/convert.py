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

═══════════════════════════════════════════════
COMPONENT PROP SPECIFICATIONS (MUST follow EXACTLY):
═══════════════════════════════════════════════

<KeyTakeaways points={{["point 1", "point 2"]}} />
  - points: string[] (REQUIRED)

<QuickFacts facts={{[{{ label: "Price", value: "₩50,000", icon: "💰" }}]}} />
  - facts: {{ label, value, icon?, note? }}[] (REQUIRED — NOT "data")

<Timeline items={{[{{ time: "2024", title: "Event", description: "Details" }}]}} />
  - items: {{ time?, title, description, icon? }}[] (REQUIRED — NOT "events", NOT "year"/"event")

<ComparisonTable headers={{['Feature', 'Option A', 'Option B']}} rows={{[{{ feature: 'Speed', option1: 'Fast', option2: 'Slow' }}]}} />
  - headers: string[] (REQUIRED)
  - rows: {{ feature, option1, option2, option3?, ... }}[] (REQUIRED — NOT "items", NOT "cell1"/"item1")

<ProsCons pros={{["pro 1", "pro 2"]}} cons={{["con 1", "con 2"]}} />
  - pros: string[] (REQUIRED)
  - cons: string[] (REQUIRED)

<StepGuide title="Guide Title" steps={{[{{ title: "Step 1", description: "Details", tip: "Helpful tip" }}]}} />
  - title: string (REQUIRED)
  - steps: {{ title, description, tip?, duration?, icon? }}[] (REQUIRED — use "description" NOT "text")

<ExpertTip name="Expert Name" role="Title, X years experience" quote="Quote text here" />
  - name: string (REQUIRED)
  - role: string (REQUIRED)
  - quote: string (REQUIRED)
  - Do NOT include avatar prop (no avatar images exist)

<InfoBox type="tip" title="Title">Content here</InfoBox>
  - type: "tip" | "warning" | "info" | "danger" | "note" | "arc-free" (REQUIRED)
  - Content goes as CHILDREN between tags, NOT as a "text" prop

<FAQAccordion items={{[{{ question: "Q?", answer: "A." }}]}} />
  - items: {{ question, answer }}[] (REQUIRED — NOT "questions")

PROP RULES (CRITICAL — violations cause runtime errors):
- ALWAYS use the EXACT prop names listed above
- String props with apostrophes: use backslash escape \\'
- Do NOT invent prop names like "data", "events", "questions", "text", "cell1"
- Do NOT add avatar prop to ExpertTip
- InfoBox content MUST be children, not a text="" prop
═══════════════════════════════════════════════

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

    # ── Frontmatter title/excerpt 따옴표 보정 ──
    # 1. 이중 이스케이핑 제거: title: "\"Text\"" → title: "Text"
    def fix_escaped_quotes(content, field):
        # Pattern: title: "\"Text\"" or title:"\\"Text\\""
        pattern = re.compile(
            rf'^({field}:\s*)"\\\"(.+?)\\\""\s*$', re.MULTILINE
        )
        m = pattern.search(content)
        if m:
            cleaned_val = m.group(2)
            content = content[:m.start()] + f'{m.group(1)}"{cleaned_val}"' + content[m.end():]
            fixes.append(f'Frontmatter: removed escaped quotes from {field}')
        return content
    
    content = fix_escaped_quotes(content, 'title')
    content = fix_escaped_quotes(content, 'excerpt')
    
    # 2. 이중 따옴표로 끝나는 경우: title: "Text"" → title: "Text"
    def fix_double_trailing(content, field):
        pattern = re.compile(
            rf'^({field}:\s*"[^"]+)""\s*$', re.MULTILINE
        )
        m = pattern.search(content)
        if m:
            content = content[:m.start()] + f'{m.group(1)}"' + content[m.end():]
            fixes.append(f'Frontmatter: removed double trailing quote from {field}')
        return content
    
    content = fix_double_trailing(content, 'title')
    content = fix_double_trailing(content, 'excerpt')

    # 3. 콜론, 앰퍼샌드 등 YAML 특수문자가 포함된 경우 따옴표로 감싸기
    def quote_frontmatter_field(content, field):
        pattern = re.compile(
            rf'^({field}:\s*)(?!")(.+)$', re.MULTILINE
        )
        m = pattern.search(content)
        if m and any(ch in m.group(2) for ch in [':', '&', '#', '{', '}', '[', ']', ',', '>', '|', '*', '?', '!', '%', '@', '`']):
            val = m.group(2).strip().replace('"', '\\"')
            content = content[:m.start()] + f'{m.group(1)}"{val}"' + content[m.end():]
            fixes.append(f'Frontmatter: quoted {field} (special chars)')
        return content

    content = quote_frontmatter_field(content, 'title')
    content = quote_frontmatter_field(content, 'excerpt')

    # ── InfoBox 닫는 꺾쇠 중복 제거 (>> → >) ──
    if re.search(r'<InfoBox\b[^>]*>>', content):
        content = re.sub(r'(<InfoBox\b[^>]*?)>>', r'\1>', content)
        fixes.append('InfoBox: removed duplicate closing bracket (>>)')

    # 코드블록 래퍼 제거
    if content.startswith("```markdown") or content.startswith("```mdx") or content.startswith("```"):
        content = re.sub(r"^```(?:markdown|mdx)?\n", "", content)
        content = re.sub(r"\n```\s*$", "", content)
        fixes.append("Removed code block wrapper")

    # ── 잘못된 prop 이름 교정 ──
    prop_fixes = [
        # QuickFacts: data → facts
        (r'(<QuickFacts\b[^>]*)\bdata\s*=', r'\1facts=', 'QuickFacts: data → facts'),
        # Timeline: events → items, year → time, event → title
        (r'(<Timeline\b[^>]*)\bevents\s*=', r'\1items=', 'Timeline: events → items'),
        # ComparisonTable: items → rows
        (r'(<ComparisonTable\b[^>]*)\bitems\s*=\s*\{', r'\1rows={', 'ComparisonTable: items → rows'),
        # FAQAccordion: questions → items
        (r'(<FAQAccordion\b[^>]*)\bquestions\s*=', r'\1items=', 'FAQAccordion: questions → items'),
    ]
    for pattern, repl, desc in prop_fixes:
        new_content = re.sub(pattern, repl, content)
        if new_content != content:
            fixes.append(desc)
            content = new_content

    # Timeline 객체 키 교정: year → time, event → title
    # Only within <Timeline ...> blocks
    timeline_block = re.search(r'<Timeline\b[^>]*items=\{[^}]*\}[^/]*/>', content, re.DOTALL)
    if not timeline_block:
        timeline_block = re.search(r'<Timeline\b.*?/>', content, re.DOTALL)
    if timeline_block:
        block = timeline_block.group(0)
        new_block = block
        if re.search(r'\byear\s*:', new_block):
            new_block = re.sub(r'\byear\s*:', 'time:', new_block)
            fixes.append('Timeline keys: year → time')
        if re.search(r'\bevent\s*:', new_block):
            new_block = re.sub(r'\bevent\s*:', 'title:', new_block)
            fixes.append('Timeline keys: event → title')
        if new_block != block:
            content = content.replace(block, new_block)

    # ComparisonTable 객체 키 교정: cell* → option*, item* → option*
    comp_blocks = list(re.finditer(r'<ComparisonTable\b.*?/>', content, re.DOTALL))
    for m in reversed(comp_blocks):
        block = m.group(0)
        new_block = block
        for i in range(1, 7):
            if f'cell{i}:' in new_block:
                new_block = new_block.replace(f'cell{i}:', f'option{i}:')
                fixes.append(f'ComparisonTable keys: cell{i} → option{i}')
            if f'item{i}:' in new_block:
                new_block = new_block.replace(f'item{i}:', f'option{i}:')
                fixes.append(f'ComparisonTable keys: item{i} → option{i}')
        if new_block != block:
            content = content.replace(block, new_block)

    # StepGuide 키 교정: text → description
    step_blocks = list(re.finditer(r'<StepGuide\b.*?/>', content, re.DOTALL))
    for m in reversed(step_blocks):
        block = m.group(0)
        if re.search(r"\btext\s*:", block):
            new_block = re.sub(r'\btext\s*:', 'description:', block)
            content = content.replace(block, new_block)
            fixes.append('StepGuide keys: text → description')

    # ExpertTip avatar prop 제거
    if re.search(r'(<ExpertTip\b[^>]*)\s+avatar="[^"]*"', content):
        content = re.sub(r'(<ExpertTip\b[^>]*)\s+avatar="[^"]*"', r'\1', content)
        fixes.append('ExpertTip: removed avatar prop')

    # InfoBox: text="..." → children 변환
    infobox_text_pat = re.compile(r'<InfoBox\b([^>]*)\btext="([^"]*)"([^>]*)/>',  re.DOTALL)
    def fix_infobox_text(m):
        attrs = m.group(1) + m.group(3)
        text_content = m.group(2)
        fixes.append('InfoBox: text prop → children')
        return f'<InfoBox{attrs}>{text_content}</InfoBox>'
    content = infobox_text_pat.sub(fix_infobox_text, content)

    # InfoBox: type 누락 시 title로 추론
    def fix_infobox_type(m):
        attrs = m.group(1)
        if 'type=' not in attrs:
            title_match = re.search(r'title="([^"]*)"', attrs)
            title = title_match.group(1).lower() if title_match else ''
            if 'warning' in title or 'caution' in title or 'danger' in title:
                inferred = 'warning'
            elif 'tip' in title or 'pro tip' in title:
                inferred = 'tip'
            elif 'arc' in title:
                inferred = 'arc-free'
            else:
                inferred = 'info'
            attrs = f' type="{inferred}"' + attrs
            fixes.append(f'InfoBox: added type="{inferred}"')
        return f'<InfoBox{attrs}>'
    content = re.sub(r'<InfoBox\b([^>]*>)', fix_infobox_type, content)

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
