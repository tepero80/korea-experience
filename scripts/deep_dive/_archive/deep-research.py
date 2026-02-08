"""
Deep Dive Content Generator
============================
Gemini Deep Research API를 사용하여 deep-dive 드래프트를 자동 생성하고,
Nano Banana Pro로 커버 이미지, Gemini Pro로 MDX 변환까지 한번에 처리합니다.

전체 파이프라인: Deep Research → 커버 이미지 → MDX 변환 → content/deep-dive/ 저장

사용법:
  # 다음 번호 자동 감지 (todo.md 기반) — 전체 파이프라인
  python scripts/deep-research.py

  # 특정 번호 지정 — 전체 파이프라인
  python scripts/deep-research.py --number 37

  # 번호 범위 (배치) — 전체 파이프라인
  python scripts/deep-research.py --from 37 --to 42

  # dry-run (API 호출 없이 프롬프트만 확인)
  python scripts/deep-research.py --number 37 --dry-run

  # 이미지만 생성 (기존 드래프트에서 COVER IMAGE 파싱)
  python scripts/deep-research.py --number 37 --image-only

  # MDX 변환만 실행 (기존 드래프트에서)
  python scripts/deep-research.py --number 37 --convert-only

  # 이미지 생성 건너뛰기
  python scripts/deep-research.py --number 37 --no-image

  # MDX 변환 건너뛰기 (드래프트+이미지만)
  python scripts/deep-research.py --number 37 --no-convert

필요 패키지:
  pip install google-genai python-dotenv Pillow
"""

import argparse
import os
import re
import sys
import time
from pathlib import Path
from dotenv import load_dotenv

# 프로젝트 루트 기준 경로
PROJECT_ROOT = Path(__file__).parent.parent
DRAFTS_DIR = PROJECT_ROOT / "content" / "deep-dive-drafts"
TODO_FILE = DRAFTS_DIR / "todo.md"
PROMPT_FILE = DRAFTS_DIR / "PROMPT.md"
IMAGES_DIR = PROJECT_ROOT / "public" / "images" / "deep-dive"

# .env.local 로드
load_dotenv(PROJECT_ROOT / ".env.local")

AGENT_NAME = "deep-research-pro-preview-12-2025"
IMAGE_MODEL = "gemini-3-pro-image-preview"
CONVERT_MODEL = "gemini-3-pro-preview"  # MDX 변환용
COVER_MODEL = "gemini-2.5-flash"  # 커버 요소 생성용 (backfill)
POLL_INTERVAL = 15  # seconds
MAX_WAIT = 3600     # 60 minutes

# MDX 변환 경로
DEEP_DIVE_DIR = PROJECT_ROOT / "content" / "deep-dive"
POSTS_DIR = PROJECT_ROOT / "content" / "posts"
README_FILE = DRAFTS_DIR / "README.md"

# 커버 이미지 프롬프트 템플릿
COVER_IMAGE_TEMPLATE = """Create a professional blog cover image for "Korea Experience", a premium Korea travel and lifestyle website.

LAYOUT REQUIREMENTS (CRITICAL — follow exactly):
- Cinematic 16:9 composition (will be used as 1200x630 OG image)
- The vivid editorial scene fills the ENTIRE frame
- Bottom 20%: the scene naturally transitions to a slightly darker tone (no artificial gradient bar, no blur, no frosted glass — the scene itself should just be compositionally darker at the bottom)
- Text overlay at bottom-left (with ~40px padding):
  - Main line: "{short_title}" in bold modern sans-serif (like Montserrat or DM Sans), clean white color, medium size (roughly 3-4% of image height — NOT too large), with only a very subtle soft shadow for minimal depth
  - Second line below: "KOREA EXPERIENCE" in small caps, letter-spacing wide, semi-transparent white (opacity ~70%), small size, same subtle soft shadow
- Top-right corner: a small rounded pill badge showing "{category}" in white text on a semi-transparent dark background

SCENE DESCRIPTION:
{scene}

INCLUDE THESE ELEMENTS naturally in the scene: {key_objects}

VISUAL STYLE:
- {mood} mood with {color_palette} color palette
- Modern editorial photography with slightly cinematic color grading
- Korean urban/cultural aesthetic feel
- Sharp focus on main subject, subtle depth of field on background
- Professional magazine-quality composition
- If people appear, they must look completely natural and realistic — NO cyberpunk, NO futuristic styling, NO neon face paint, NO sci-fi elements on people. People should look like real everyday humans in natural poses and clothing.

TEXT RULES (VERY IMPORTANT):
- "{short_title}" must be spelled exactly, clearly readable, no typos
- "KOREA EXPERIENCE" must be spelled exactly in small caps
- Text should be clean white directly on the image — NO heavy dark outlines, NO thick shadows, NO glow effects, NO blur behind text, NO frosted glass, NO semi-transparent boxes, NO gradient overlays behind the text
- Keep text styling minimal and elegant, like a professional magazine cover
- Do NOT add any extra text, watermarks, or stock-photo indicators
- The text should look like it was professionally typeset, not pasted on

The final image should work perfectly as both a social media preview card and a blog article hero image.
"""


def parse_todo() -> dict[int, dict]:
    """todo.md에서 주제 목록을 파싱합니다."""
    items = {}
    with open(TODO_FILE, "r", encoding="utf-8") as f:
        for line in f:
            # 패턴: "37. [M] Plastic Surgery Shadow Doctors"
            m = re.match(r"(\d+)\.\s*\[([A-Z])\]\s*(.+)", line.strip())
            if m:
                num = int(m.group(1))
                cat_code = m.group(2)
                topic = m.group(3).strip()
                cat_map = {
                    "M": "Medical Tourism",
                    "T": "Travel & Tourism",
                    "K": "K-Culture",
                    "L": "Living in Korea",
                    "F": "Food & Dining",
                    "S": "Shopping & K-Beauty",
                }
                items[num] = {
                    "number": num,
                    "code": cat_code,
                    "topic": topic,
                    "category": cat_map.get(cat_code, "Unknown"),
                }
    return items


def find_next_number(items: dict) -> int | None:
    """드래프트 폴더에서 아직 내용이 채워지지 않은 가장 작은 번호를 찾습니다."""
    for num in sorted(items.keys()):
        txt_files = list(DRAFTS_DIR.glob(f"{num}.*"))
        if not txt_files:
            return num
        # 파일이 있어도 비어있으면 아직 할 것
        for f in txt_files:
            if f.suffix == ".txt" and f.stat().st_size < 100:
                return num
    return None


def build_prompt(topic: str, category: str) -> str:
    """PROMPT.md 템플릿을 읽고 주제를 삽입합니다."""
    with open(PROMPT_FILE, "r", encoding="utf-8") as f:
        template = f.read()

    # PROMPT.md의 [10 social rules...] 부분을 실제 주제로 교체
    prompt = re.sub(
        r"\[.*?\]",
        f"[{topic}]",
        template,
        count=1,  # 첫 번째 대괄호만 교체
    )

    # 카테고리 힌트 추가 (프롬프트 마지막에)
    prompt += f"\n\n---\n## CATEGORY HINT\nThis topic belongs to: **{category}**\n"
    prompt += f"Topic to research: **{topic}**\n"

    return prompt


def get_draft_filepath(num: int, items: dict) -> Path:
    """드래프트 파일 경로를 찾거나 생성합니다."""
    # 기존 파일이 있으면 그 경로 사용
    existing = list(DRAFTS_DIR.glob(f"{num}.*txt"))
    if existing:
        return existing[0]

    # 없으면 새로 생성
    item = items[num]
    filename = f"{num}. [{item['code']}] {item['topic']}.txt"
    return DRAFTS_DIR / filename


def run_deep_research(prompt: str, api_key: str) -> str:
    """Deep Research API를 호출하고 결과를 반환합니다."""
    from google import genai

    client = genai.Client(api_key=api_key)

    print("🔬 Deep Research 시작...")
    print(f"   에이전트: {AGENT_NAME}")

    interaction = client.interactions.create(
        input=prompt,
        agent=AGENT_NAME,
        background=True,
    )

    interaction_id = interaction.id
    print(f"   Interaction ID: {interaction_id}")

    start_time = time.time()
    last_status = None

    while True:
        elapsed = time.time() - start_time
        if elapsed > MAX_WAIT:
            raise TimeoutError(f"⏰ {MAX_WAIT}초 초과. Interaction ID: {interaction_id}")

        interaction = client.interactions.get(interaction_id)
        status = interaction.status

        if status != last_status:
            mins = int(elapsed // 60)
            secs = int(elapsed % 60)
            print(f"   [{mins:02d}:{secs:02d}] 상태: {status}")
            last_status = status

        if status == "completed":
            result = interaction.outputs[-1].text
            mins = int(elapsed // 60)
            secs = int(elapsed % 60)
            print(f"✅ 완료! ({mins}분 {secs}초, {len(result):,}자)")
            return result

        elif status in ("failed", "cancelled"):
            raise RuntimeError(f"❌ 실패: {status}")

        time.sleep(POLL_INTERVAL)


def run_deep_research_streaming(prompt: str, api_key: str) -> str:
    """Deep Research API를 스트리밍 모드로 호출합니다."""
    from google import genai

    client = genai.Client(api_key=api_key)

    print("🔬 Deep Research 시작 (스트리밍 모드)...")
    print(f"   에이전트: {AGENT_NAME}")

    stream = client.interactions.create(
        input=prompt,
        agent=AGENT_NAME,
        background=True,
        stream=True,
        agent_config={
            "type": "deep-research",
            "thinking_summaries": "auto",
        },
    )

    interaction_id = None
    full_text = []
    start_time = time.time()

    for chunk in stream:
        if chunk.event_type == "interaction.start":
            interaction_id = chunk.interaction.id
            print(f"   Interaction ID: {interaction_id}")

        if chunk.event_type == "content.delta":
            if chunk.delta.type == "text":
                full_text.append(chunk.delta.text)
                # 진행률 표시 (점으로)
                print(".", end="", flush=True)
            elif chunk.delta.type == "thought_summary":
                elapsed = time.time() - start_time
                mins = int(elapsed // 60)
                secs = int(elapsed % 60)
                thought = chunk.delta.content.text[:80]
                print(f"\n   [{mins:02d}:{secs:02d}] 💭 {thought}...")

        elif chunk.event_type == "interaction.complete":
            elapsed = time.time() - start_time
            mins = int(elapsed // 60)
            secs = int(elapsed % 60)
            result = "".join(full_text)
            print(f"\n✅ 완료! ({mins}분 {secs}초, {len(result):,}자)")
            return result

    # 스트림이 끝났지만 complete 이벤트가 없는 경우 — 폴링으로 전환
    if interaction_id:
        print("\n⚠️ 스트림 종료 — 폴링으로 전환...")
        return _poll_for_result(client, interaction_id, start_time)

    raise RuntimeError("❌ 스트림에서 결과를 받지 못했습니다.")


def _poll_for_result(client, interaction_id: str, start_time: float) -> str:
    """스트리밍 실패 시 폴링으로 전환합니다."""
    while True:
        elapsed = time.time() - start_time
        if elapsed > MAX_WAIT:
            raise TimeoutError(f"⏰ {MAX_WAIT}초 초과.")

        interaction = client.interactions.get(interaction_id)

        if interaction.status == "completed":
            result = interaction.outputs[-1].text
            mins = int(elapsed // 60)
            secs = int(elapsed % 60)
            print(f"✅ 완료! ({mins}분 {secs}초, {len(result):,}자)")
            return result
        elif interaction.status in ("failed", "cancelled"):
            raise RuntimeError(f"❌ 실패: {interaction.status}")

        time.sleep(POLL_INTERVAL)


# ============================================================
# 커버 이미지 생성 (Nano Banana Pro)
# ============================================================

def parse_cover_image_elements(draft_text: str) -> dict | None:
    """드래프트에서 COVER IMAGE 섹션의 요소를 파싱합니다."""
    # COVER IMAGE 섹션 찾기
    cover_match = re.search(
        r"##\s*COVER\s*IMAGE.*?\n(.*?)(?=\n##\s|\Z)",
        draft_text,
        re.DOTALL | re.IGNORECASE,
    )
    if not cover_match:
        # ## 헤더 없이 plain text로 된 경우도 시도
        cover_match = re.search(
            r"COVER\s*IMAGE\s*\n(.*?)(?=\n(?:OPTIONAL|SOURCES|ARTICLE|LOCATIONS|PRICE|KEY STAT|ROUTE)|\Z)",
            draft_text,
            re.DOTALL | re.IGNORECASE,
        )
    if not cover_match:
        return None

    section = cover_match.group(1)

    def extract_field(name: str) -> str:
        """**Name:** value 또는 Name: value 패턴 추출"""
        patterns = [
            rf"\*\*{name}:\*\*\s*(.+?)(?=\n\*\*|\n---|\Z)",
            rf"{name}:\s*(.+?)(?=\n[A-Z]|\n\*\*|\n---|\Z)",
        ]
        for pat in patterns:
            m = re.search(pat, section, re.IGNORECASE | re.DOTALL)
            if m:
                return m.group(1).strip().strip('"\'')
        return ""

    short_title = extract_field("Short Title")
    scene = extract_field("Scene")
    key_objects = extract_field("Key Objects")
    mood = extract_field("Mood")
    color_palette = extract_field("Color Palette")

    if not scene:
        return None

    return {
        "short_title": short_title or "Korea Guide",
        "scene": scene,
        "key_objects": key_objects or "Korean cityscape",
        "mood": mood or "vibrant",
        "color_palette": color_palette or "warm tones, soft blue",
    }


def generate_cover_image(
    elements: dict,
    category: str,
    slug: str,
    api_key: str,
) -> Path | None:
    """Nano Banana Pro로 커버 이미지를 생성합니다."""
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)

    prompt = COVER_IMAGE_TEMPLATE.format(
        short_title=elements["short_title"],
        category=category,
        scene=elements["scene"],
        key_objects=elements["key_objects"],
        mood=elements["mood"],
        color_palette=elements["color_palette"],
    )

    print(f"\n🎨 커버 이미지 생성 중...")
    print(f"   모델: {IMAGE_MODEL}")
    print(f"   Short Title: \"{elements['short_title']}\"")
    print(f"   Scene: {elements['scene'][:80]}...")

    try:
        response = client.models.generate_content(
            model=IMAGE_MODEL,
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(
                    aspect_ratio="16:9",
                    image_size="2K",
                ),
            ),
        )

        # 이미지 저장 (genai Image → 임시 PNG → Pillow → WebP)
        from PIL import Image as PILImage
        import tempfile
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        output_path = IMAGES_DIR / f"{slug}.webp"

        for part in response.parts:
            if part.inline_data is not None:
                image = part.as_image()
                # genai Image는 파일 경로만 지원 → 임시 PNG로 저장 후 WebP 변환
                with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                    tmp_path = tmp.name
                image.save(tmp_path)
                pil_img = PILImage.open(tmp_path)
                pil_img.save(str(output_path), format="WEBP", quality=85)
                Path(tmp_path).unlink(missing_ok=True)
                print(f"✅ 커버 이미지 저장: {output_path.relative_to(PROJECT_ROOT)}")
                return output_path

        print("⚠️  이미지가 생성되지 않았습니다 (응답에 이미지 없음)")
        return None

    except Exception as e:
        print(f"⚠️  이미지 생성 실패: {e}")
        return None


def make_slug(topic: str) -> str:
    """토픽 이름에서 파일명용 slug를 생성합니다."""
    slug = topic.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    # 길이 제한
    if len(slug) > 60:
        slug = slug[:60].rsplit("-", 1)[0]
    return slug


# ============================================================
# MDX 변환 (Gemini Pro)
# ============================================================

VALID_COMPONENTS = [
    "KeyTakeaways", "FAQAccordion", "ExpertTip", "InfoBox", "StepGuide",
    "ProsCons", "PriceTable", "StatCard", "QuickFacts", "ComparisonTable",
    "LocationCard", "Timeline", "DualismRoute",
]

ARRAY_PROPS = [
    "highlights", "points", "pros", "cons", "items", "facts",
    "stats", "steps", "rows", "headers", "stops",
]


def get_existing_slugs() -> list[str]:
    """content/posts/ + content/deep-dive/ 의 기존 slug 목록을 반환합니다."""
    slugs = []
    for d in [POSTS_DIR, DEEP_DIVE_DIR]:
        if d.exists():
            for f in d.glob("*.md"):
                slugs.append(f.stem)
    return sorted(set(slugs))


def get_next_deep_dive_order() -> int:
    """현재 가장 높은 deepDiveOrder + 1을 반환합니다."""
    max_order = 0
    if DEEP_DIVE_DIR.exists():
        for f in DEEP_DIVE_DIR.glob("*.md"):
            content = f.read_text(encoding="utf-8")[:500]
            m = re.search(r"deepDiveOrder:\s*(\d+)", content)
            if m:
                max_order = max(max_order, int(m.group(1)))
    return max_order + 1


def build_conversion_prompt(draft_text: str, category: str, slug: str, image_path: str | None, today: str) -> str:
    """드래프트를 MDX로 변환하는 프롬프트를 생성합니다."""
    existing_slugs = get_existing_slugs()
    deep_dive_order = get_next_deep_dive_order()

    # 슬러그 목록 (카테고리별 최대 20개)
    slug_lines = "\n".join(f"  /blog/{s}" for s in existing_slugs[:100])

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
- The draft TITLE is usually too long — rewrite it shorter while keeping the main keyword

EXCERPT RULES:
- MUST be 160 characters or fewer
- Include specific data points (prices, percentages, year)
- Do NOT use colons (:) inside the excerpt

STRUCTURE (follow this order):

1. Opening paragraph: Direct answer to what the reader is searching for.
   Then: **The short answer:** [1-2 sentence bold summary]

2. <KeyTakeaways> — from KEY TAKEAWAYS section
   ```jsx
   <KeyTakeaways
     points={{["point 1", "point 2", "point 3"]}}
     readTime={{CALCULATED_READ_TIME}}
     lastUpdated="{today}"
   />
   ```
   readTime: 3000-4000 words=10-12, 4000-5500=12-15, 5500-7000=15-18, 7000+=18-20

3. <QuickFacts> — from QUICK FACTS section
   ```jsx
   <QuickFacts title="..." facts={{[{{ label: "...", value: "...", icon: "..." }}]}} columns={{3}} />
   ```

4. Body sections with ## H2 headings (from ARTICLE BODY)

5. <Timeline> — from TIMELINE section (embed in relevant body section)
   ```jsx
   <Timeline title="..." items={{[{{ time: "...", title: "...", description: "...", icon: "..." }}]}} />
   ```

6. <ComparisonTable> — from COMPARISON TABLE section
   ```jsx
   <ComparisonTable title="..." headers={{["Feature", "A", "B"]}} rows={{[{{ feature: "...", option1: "...", option2: "..." }}]}} />
   ```
   Key names: feature, option1, option2, option3 (fixed names!)

7. <ProsCons> — from PROS AND CONS section
   ```jsx
   <ProsCons title="..." pros={{["..."]}} cons={{["..."]}} variant="cards" />
   ```

8. <StepGuide> — from STEP-BY-STEP GUIDE section
   ```jsx
   <StepGuide title="..." totalTime="..." difficulty="easy" steps={{[{{ title: "...", description: "...", tip: "..." }}]}} />
   ```
   ⚠️ difficulty MUST be lowercase: "easy", "medium", or "hard"

9. <ExpertTip> — from EXPERT TIP section (Deep-Dive style, self-closing)
   ```jsx
   <ExpertTip name="..." role="..." experience="..." quote="..." />
   ```

10. <InfoBox> — from WARNINGS AND TIPS section
    ```jsx
    <InfoBox type="tip" title="Pro Tip: ...">content</InfoBox>
    <InfoBox type="warning" title="...">content</InfoBox>
    <InfoBox type="arc-free" title="No Korean Phone/ARC? Here's What To Do">solution</InfoBox>
    ```
    ⚠️ arc-free InfoBox is MANDATORY in every article!

11. OPTIONAL — <LocationCard> if LOCATIONS section exists:
    ```jsx
    <LocationCard name="..." nameKo="..." type="..." address="..." hours="..." priceRange="..." rating={{4.5}} transit="..." highlights={{["..."]}} tip="..." />
    ```

12. OPTIONAL — <PriceTable> if PRICE TABLE section exists:
    ```jsx
    <PriceTable title="..." variant="dualism" items={{[{{ name: "...", price: "...", tag: "luxury", description: "..." }}]}} />
    ```

13. OPTIONAL — <StatCard> if KEY STATISTICS section exists:
    ```jsx
    <StatCard title="..." variant="gradient" stats={{[{{ value: "...", label: "...", icon: "..." }}]}} source="..." />
    ```

14. OPTIONAL — <DualismRoute> if ROUTE COMPARISON section exists (Travel only):
    ```jsx
    <DualismRoute title="..." area="..." totalBudget={{{{ luxury: "...", budget: "..." }}}} totalTime="..." stops={{[...]}} recommendation="..." />
    ```
    ⚠️ totalBudget uses double curly braces!

15. <FAQAccordion> — from FAQ section (MANDATORY, 5+ questions)
    ```jsx
    <FAQAccordion items={{[{{ question: "...", answer: "..." }}]}} />
    ```

16. Conclusion section with action plan. End with encouraging closing.

17. --- (horizontal rule)
    ## Sources
    - [Source Name](URL) - Brief description of what data came from this source
    Rules for Sources:
    - Select only 5-8 HIGH-QUALITY sources (government sites, major news outlets, academic papers, official organizations)
    - EXCLUDE Reddit, Wikipedia, YouTube, forums, individual clinic websites, and travel blogs
    - Each source MUST have a "- description" explaining what data was referenced
    - Format: `- [Publication Name](URL) - What specific data or facts came from this source`

INTERNAL LINKS (MANDATORY 3-5):
Embed naturally throughout the body using: [anchor text](/blog/slug)
ONLY use slugs from this list:
{slug_lines}

LATEX CONVERSION (CRITICAL):
- $₩10,320$ → ₩10,320
- $42\\%$ → 42%
- $\\approx$ → ~
- $3,000 - $7,000 → $3,000–$7,000 (use en-dash for ranges, keep $ for USD)
- $$formula$$ → plain text explanation
- Remove ALL LaTeX $ delimiters and commands, but KEEP currency $ signs

ICON RULE (CRITICAL):
- ALL icon props MUST use emoji characters, NOT text strings
- CORRECT: icon: "💰"  icon: "📅"  icon: "🏥"
- WRONG:   icon: "money"  icon: "calendar"  icon: "hospital"

JSX RULES:
- Array props MUST use curly braces: points={{["a", "b"]}}
- Boolean: rating={{4.5}} verified={{true}}
- No double quotes inside strings — use single quotes: "The 'best' option"
- All components must be properly closed (self-closing /> or matching </Tag>)
- HEADING hierarchy: use ## H2 for sections, ### H3 for subsections only

MINIMUM REQUIREMENTS:
- At least 3,000 words of body content
- At least 5-7 visual components
- At least 4-6 ## H2 sections
- KeyTakeaways right after intro (MANDATORY)
- FAQAccordion near the end (MANDATORY)
- InfoBox type="arc-free" (MANDATORY)

---

DRAFT TO CONVERT:

{draft_text}
"""


def sanitize_mdx(content: str) -> tuple[str, list[str]]:
    """MDX 내용을 자동 검증/수정합니다."""
    fixes = []

    # 0. 코드블록 래퍼 제거
    if content.startswith("```markdown") or content.startswith("```mdx") or content.startswith("```"):
        content = re.sub(r"^```(?:markdown|mdx)?\n", "", content)
        content = re.sub(r"\n```\s*$", "", content)
        fixes.append("Removed code block wrapper")

    # 1. difficulty 대소문자 수정
    def fix_difficulty(m):
        val = m.group(1)
        lower = val.lower()
        if lower != val:
            fixes.append(f'difficulty="{val}" → difficulty="{lower}"')
        return f'difficulty="{lower}"'

    content = re.sub(r'difficulty="(Easy|Medium|Hard|EASY|MEDIUM|HARD)"', fix_difficulty, content, flags=re.IGNORECASE)

    # 2. 배열 props에 {} 누락: highlights=["..."] → highlights={["..."]}
    array_pat = r'(' + '|'.join(ARRAY_PROPS) + r')\s*=\s*\['
    def fix_array(m):
        attr = m.group(1)
        fixes.append(f"{attr}=[] → {attr}={{[]}}")
        return f"{attr}={{["
    content = re.sub(array_pat, fix_array, content)

    # 3. 잘못된 닫는 태그 수정
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

    # 4. LaTeX 잔여 제거 (통화 $는 건드리지 않음)
    # LaTeX 수식은 보통 \명령어를 포함하거나 ₩ 같은 통화기호를 감쌈
    latex_inline = re.findall(r"\$[^$]*\\[a-zA-Z][^$]*\$|\$₩[\d,]+\$", content)
    for expr in latex_inline:
        inner = expr.strip("$")
        # 간단한 변환
        clean = inner.replace("\\%", "%").replace("\\approx", "~").replace("\\times", "×")
        clean = re.sub(r"\\frac\{([^}]+)\}\{([^}]+)\}", r"\1/\2", clean)
        clean = re.sub(r"\\[a-zA-Z]+", "", clean).strip()
        if clean != inner:
            content = content.replace(expr, clean)
            fixes.append(f"LaTeX: {expr[:30]} → {clean[:30]}")

    # 5. 내부 링크 검증
    existing_slugs = set(get_existing_slugs())

    def fix_link(m):
        anchor = m.group(1)
        slug = m.group(2)
        if slug in existing_slugs:
            return m.group(0)
        # 유사 슬러그 찾기
        slug_words = [w for w in slug.split("-") if len(w) > 3]
        for s in existing_slugs:
            if slug_words and sum(1 for w in slug_words if w in s) >= max(1, len(slug_words) * 0.75):
                fixes.append(f"Link fixed: /blog/{slug} → /blog/{s}")
                return f"[{anchor}](/blog/{s})"
        fixes.append(f"Link removed (no match): /blog/{slug}")
        return anchor

    content = re.sub(r"\[([^\]]+)\]\(/blog/([a-z0-9-]+)\)", fix_link, content)

    # 6. 속성명에 점(.) 포함 제거
    content = re.sub(r"^(\s+)(\w+)\.\s*=", lambda m: f"{m.group(1)}{m.group(2)}=", content, flags=re.MULTILINE)

    return content, fixes


def convert_to_mdx(
    draft_text: str,
    category: str,
    slug: str,
    image_path: str | None,
    api_key: str,
) -> str | None:
    """Gemini Pro를 사용하여 드래프트를 MDX로 변환합니다."""
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)

    today = time.strftime("%Y-%m-%d")
    prompt = build_conversion_prompt(draft_text, category, slug, image_path, today)

    print(f"\n📝 MDX 변환 중...")
    print(f"   모델: {CONVERT_MODEL}")
    print(f"   프롬프트: {len(prompt):,}자")

    try:
        response = client.models.generate_content(
            model=CONVERT_MODEL,
            contents=[prompt],
            config=types.GenerateContentConfig(
                temperature=0.3,  # 정확한 변환을 위해 낮은 temperature
                max_output_tokens=65536,
            ),
        )

        result = response.text
        if not result:
            print("⚠️  MDX 변환 결과가 비어있습니다.")
            return None

        # 자동 검증/수정
        sanitized, fixes = sanitize_mdx(result)
        if fixes:
            print(f"🔧 자동 수정 {len(fixes)}건:")
            for f in fixes[:10]:
                print(f"   • {f}")
            if len(fixes) > 10:
                print(f"   ... 외 {len(fixes) - 10}건")
        else:
            print("✅ MDX 검증 통과 — 수정 불필요")

        # 단어 수 확인
        word_count = len(sanitized.split())
        print(f"   단어 수: ~{word_count:,}")

        return sanitized

    except Exception as e:
        print(f"⚠️  MDX 변환 실패: {e}")
        return None


def save_mdx(content: str, slug: str) -> Path:
    """MDX 파일을 content/deep-dive/에 저장합니다."""
    DEEP_DIVE_DIR.mkdir(parents=True, exist_ok=True)
    # slug에 -2026이 안 붙어있으면 추가
    if not slug.endswith("-2026"):
        filename = f"{slug}-2026.md"
    else:
        filename = f"{slug}.md"
    filepath = DEEP_DIVE_DIR / filename
    filepath.write_text(content, encoding="utf-8")
    print(f"💾 MDX 저장: content/deep-dive/{filename}")
    return filepath


def process_item(
    num: int,
    items: dict,
    api_key: str,
    dry_run: bool = False,
    stream: bool = True,
    no_image: bool = False,
    image_only: bool = False,
    no_convert: bool = False,
    convert_only: bool = False,
):
    """하나의 주제를 처리합니다."""
    if num not in items:
        print(f"❌ #{num}번은 todo.md에 없습니다.")
        return False

    item = items[num]
    filepath = get_draft_filepath(num, items)
    slug = make_slug(item["topic"])

    print(f"\n{'='*60}")
    print(f"📝 #{num}. [{item['code']}] {item['topic']}")
    print(f"   카테고리: {item['category']}")
    print(f"   파일: {filepath.name}")
    print(f"   슬러그: {slug}")
    print(f"{'='*60}")

    # --convert-only: 기존 드래프트에서 MDX 변환만 실행
    if convert_only:
        if not filepath.exists() or filepath.stat().st_size < 500:
            print(f"❌ 드래프트 파일이 없거나 너무 짧습니다.")
            return False
        draft_text = filepath.read_text(encoding="utf-8")
        # 이미지 경로 확인
        img_path = IMAGES_DIR / f"{slug}.webp"
        image_rel = f"/images/deep-dive/{slug}.webp" if img_path.exists() else None
        if dry_run:
            prompt = build_conversion_prompt(draft_text, item["category"], slug, image_rel, time.strftime("%Y-%m-%d"))
            print(f"\n🔍 [DRY RUN] MDX 변환 프롬프트 ({len(prompt):,}자)")
            print(f"   deepDiveOrder: {get_next_deep_dive_order()}")
            print(f"   이미지: {image_rel or '없음'}")
            return True
        mdx_content = convert_to_mdx(draft_text, item["category"], slug, image_rel, api_key)
        if mdx_content:
            save_mdx(mdx_content, slug)
        return mdx_content is not None

    # --image-only: 기존 드래프트에서 이미지만 생성
    if image_only:
        if not filepath.exists() or filepath.stat().st_size < 500:
            print(f"❌ 드래프트 파일이 없거나 너무 짧습니다.")
            return False
        draft_text = filepath.read_text(encoding="utf-8")
        elements = parse_cover_image_elements(draft_text)
        if not elements:
            print(f"⚠️  COVER IMAGE 섹션을 찾을 수 없습니다.")
            return False
        if dry_run:
            prompt = COVER_IMAGE_TEMPLATE.format(
                short_title=elements["short_title"],
                category=item["category"],
                scene=elements["scene"],
                key_objects=elements["key_objects"],
                mood=elements["mood"],
                color_palette=elements["color_palette"],
            )
            print(f"\n🔍 [DRY RUN] 이미지 프롬프트 ({len(prompt):,}자):")
            print("-" * 40)
            print(prompt)
            print("-" * 40)
            return True
        generate_cover_image(elements, item["category"], slug, api_key)
        return True

    # 이미 내용이 있는 파일 스킵
    if filepath.exists() and filepath.stat().st_size > 500:
        print(f"⏭️  이미 내용이 있습니다 ({filepath.stat().st_size:,} bytes). 스킵.")
        return True

    # 프롬프트 생성
    prompt = build_prompt(item["topic"], item["category"])

    if dry_run:
        print(f"\n🔍 [DRY RUN] 프롬프트 ({len(prompt):,}자):")
        print("-" * 40)
        # 프롬프트의 처음과 마지막 표시
        print(prompt[:500])
        print("...")
        print(prompt[-300:])
        print("-" * 40)
        return True

    # Deep Research 실행
    try:
        if stream:
            result = run_deep_research_streaming(prompt, api_key)
        else:
            result = run_deep_research(prompt, api_key)
    except Exception as e:
        print(f"❌ 에러: {e}")
        return False

    # 결과 저장
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(result)

    print(f"💾 저장: {filepath.name} ({len(result):,}자)")

    # 커버 이미지 생성
    image_rel_path = None
    if not no_image:
        elements = parse_cover_image_elements(result)
        if elements:
            img_result = generate_cover_image(elements, item["category"], slug, api_key)
            if img_result:
                image_rel_path = f"/images/deep-dive/{slug}.webp"
        else:
            print("⚠️  COVER IMAGE 섹션이 없어 이미지 생성을 건너뜁니다.")

    # MDX 변환
    if not no_convert:
        mdx_content = convert_to_mdx(result, item["category"], slug, image_rel_path, api_key)
        if mdx_content:
            save_mdx(mdx_content, slug)
            print(f"\n🎉 전체 파이프라인 완료: 드래프트 → 이미지 → MDX")
        else:
            print(f"\n⚠️  MDX 변환 실패. 드래프트는 저장되어 있으니 --convert-only로 재시도 가능합니다.")

    return True


# ============================================================
# 기존 Deep-Dive MDX에 커버 이미지 일괄 생성 (Backfill)
# ============================================================

COVER_ELEMENTS_PROMPT = """You are a creative director for "Korea Experience", a premium Korea travel blog.

Given a blog post's title, excerpt, and category, generate COVER IMAGE elements for an AI image generator.

RULES:
- Short Title: 2-5 words, ALL CAPS, punchy magazine-style headline. Max 30 characters.
- Scene: 1-2 sentences describing a vivid, photographic scene that captures the article's essence. Be specific to Korea.
- Key Objects: 3-5 concrete visual elements that should appear in the image, comma-separated.
- Mood: One or two words describing the feeling (e.g., "vibrant", "serene and elegant", "dramatic").
- Color Palette: 2-3 color descriptions (e.g., "warm amber, deep navy, cherry blossom pink").

Output EXACTLY this format (no extra text):
Short Title: [YOUR TITLE]
Scene: [YOUR SCENE]
Key Objects: [YOUR OBJECTS]
Mood: [YOUR MOOD]
Color Palette: [YOUR COLORS]

---
Title: "{title}"
Excerpt: "{excerpt}"
Category: {category}
"""


def generate_cover_elements(title: str, excerpt: str, category: str, api_key: str) -> dict | None:
    """Gemini Pro로 커버 이미지 요소를 생성합니다."""
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)

    prompt = COVER_ELEMENTS_PROMPT.format(title=title, excerpt=excerpt, category=category)

    try:
        response = client.models.generate_content(
            model=COVER_MODEL,
            contents=[prompt],
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=500,
            ),
        )

        text = response.text
        if not text:
            return None

        # 파싱
        def extract(name: str) -> str:
            m = re.search(rf"{name}:\s*(.+)", text, re.IGNORECASE)
            return m.group(1).strip().strip('"\'') if m else ""

        short_title = extract("Short Title")
        scene = extract("Scene")
        key_objects = extract("Key Objects")
        mood = extract("Mood")
        color_palette = extract("Color Palette")

        if not scene or not short_title:
            return None

        return {
            "short_title": short_title,
            "scene": scene,
            "key_objects": key_objects or "Korean cityscape",
            "mood": mood or "vibrant",
            "color_palette": color_palette or "warm tones, soft blue",
        }

    except Exception as e:
        print(f"   ⚠️  요소 생성 실패: {e}")
        return None


def backfill_covers(api_key: str, dry_run: bool = False, limit: int = 0):
    """기존 deep-dive MDX 파일에 커버 이미지를 일괄 생성합니다."""
    print(f"\n{'='*60}")
    print(f"🖼️  기존 Deep-Dive 커버 이미지 Backfill")
    print(f"{'='*60}")

    if not DEEP_DIVE_DIR.exists():
        print("❌ content/deep-dive/ 폴더가 없습니다.")
        return

    # image 필드가 없는 MDX 파일 찾기
    targets = []
    for md_file in sorted(DEEP_DIVE_DIR.glob("*.md")):
        content = md_file.read_text(encoding="utf-8")
        # frontmatter에서 image 필드 확인
        fm_match = re.match(r"---\n(.*?)\n---", content, re.DOTALL)
        if not fm_match:
            continue
        frontmatter = fm_match.group(1)

        if re.search(r"^image:", frontmatter, re.MULTILINE):
            continue  # 이미 이미지가 있음

        # title, excerpt, category 추출
        title_m = re.search(r'^title:\s*"?(.+?)"?\s*$', frontmatter, re.MULTILINE)
        excerpt_m = re.search(r'^excerpt:\s*"?(.+?)"?\s*$', frontmatter, re.MULTILINE)
        category_m = re.search(r'^category:\s*(.+)$', frontmatter, re.MULTILINE)

        if not title_m or not category_m:
            continue

        slug = md_file.stem  # e.g., "why-google-maps-doesnt-work-in-korea"
        targets.append({
            "file": md_file,
            "slug": slug,
            "title": title_m.group(1).strip(),
            "excerpt": excerpt_m.group(1).strip() if excerpt_m else "",
            "category": category_m.group(1).strip(),
        })

    print(f"📋 이미지 없는 파일: {len(targets)}개")

    if limit > 0:
        targets = targets[:limit]
        print(f"   (--backfill-limit {limit} 적용)")

    if not targets:
        print("✅ 모든 파일에 이미지가 이미 있습니다!")
        return

    for i, t in enumerate(targets):
        print(f"\n[{i+1}/{len(targets)}] {t['slug']}")

    if dry_run:
        print(f"\n🔍 [DRY RUN] {len(targets)}개 파일에 대해 커버 이미지를 생성합니다.")
        for t in targets:
            print(f"   • {t['slug']} ({t['category']})")
            print(f"     Title: {t['title'][:60]}...")
        return

    # 처리 시작
    success = 0
    failed = 0
    for i, t in enumerate(targets):
        print(f"\n{'─'*50}")
        print(f"[{i+1}/{len(targets)}] {t['slug']}")
        print(f"   제목: {t['title'][:60]}")
        print(f"   카테고리: {t['category']}")

        # 1. Gemini Pro로 커버 이미지 요소 생성
        print(f"   🤖 커버 요소 생성 중...")
        elements = generate_cover_elements(t["title"], t["excerpt"], t["category"], api_key)
        if not elements:
            print(f"   ❌ 요소 생성 실패 — 스킵")
            failed += 1
            continue

        print(f"   Short Title: \"{elements['short_title']}\"")
        print(f"   Scene: {elements['scene'][:60]}...")

        # 2. Nano Banana Pro로 이미지 생성
        img_path = generate_cover_image(elements, t["category"], t["slug"], api_key)
        if not img_path:
            print(f"   ❌ 이미지 생성 실패 — 스킵")
            failed += 1
            continue

        # 3. MDX frontmatter에 image 필드 추가
        image_rel = f"/images/deep-dive/{t['slug']}.webp"
        content = t["file"].read_text(encoding="utf-8")
        # author: 줄 뒤에 image 추가 (또는 deepDiveOrder 뒤에)
        updated = re.sub(
            r"(deepDiveOrder:\s*\d+)",
            r'\1\nimage: "' + image_rel + r'"',
            content,
            count=1,
        )
        if updated == content:
            # deepDiveOrder가 없으면 author 뒤에
            updated = re.sub(
                r"(author:\s*.+)",
                r'\1\nimage: "' + image_rel + r'"',
                content,
                count=1,
            )

        t["file"].write_text(updated, encoding="utf-8")
        print(f"   ✅ frontmatter 업데이트 완료")
        success += 1

        # Rate limit 방지 — 5초 대기
        if i < len(targets) - 1:
            print(f"   ⏳ 5초 대기...")
            time.sleep(5)

    print(f"\n{'='*60}")
    print(f"📊 Backfill 완료: ✅ {success} / ❌ {failed} / 전체 {len(targets)}")
    print(f"{'='*60}")


def main():
    parser = argparse.ArgumentParser(description="Deep Dive Content Generator (Gemini Deep Research API)")
    parser.add_argument("--number", "-n", type=int, help="처리할 주제 번호")
    parser.add_argument("--from", dest="from_num", type=int, help="배치 시작 번호")
    parser.add_argument("--to", dest="to_num", type=int, help="배치 종료 번호")
    parser.add_argument("--dry-run", action="store_true", help="API 호출 없이 프롬프트만 확인")
    parser.add_argument("--no-stream", action="store_true", help="스트리밍 비활성화 (폴링 모드)")
    parser.add_argument("--no-image", action="store_true", help="커버 이미지 생성 건너뛰기")
    parser.add_argument("--image-only", action="store_true", help="기존 드래프트에서 커버 이미지만 생성")
    parser.add_argument("--no-convert", action="store_true", help="MDX 변환 건너뛰기 (드래프트+이미지만)")
    parser.add_argument("--convert-only", action="store_true", help="기존 드래프트에서 MDX 변환만 실행")
    parser.add_argument("--backfill-covers", action="store_true", help="기존 deep-dive MDX에 커버 이미지 일괄 생성")
    parser.add_argument("--backfill-limit", type=int, default=0, help="backfill 시 최대 처리 개수 (0=전체)")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key and not args.dry_run:
        print("❌ GEMINI_API_KEY가 .env.local에 설정되지 않았습니다.")
        sys.exit(1)

    # --backfill-covers 모드
    if args.backfill_covers:
        backfill_covers(api_key, args.dry_run, args.backfill_limit)
        return

    items = parse_todo()
    print(f"📋 todo.md에서 {len(items)}개 주제 로드")

    use_stream = not args.no_stream

    if args.from_num and args.to_num:
        # 배치 모드
        success = 0
        for num in range(args.from_num, args.to_num + 1):
            if process_item(num, items, api_key, args.dry_run, use_stream, args.no_image, args.image_only, args.no_convert, args.convert_only):
                success += 1
        print(f"\n📊 배치 완료: {success}/{args.to_num - args.from_num + 1}")

    elif args.number:
        # 단일 번호
        process_item(args.number, items, api_key, args.dry_run, use_stream, args.no_image, args.image_only, args.no_convert, args.convert_only)

    else:
        # 자동 감지
        next_num = find_next_number(items)
        if next_num is None:
            print("✅ 모든 주제가 완료되었습니다!")
        else:
            print(f"🎯 다음 주제: #{next_num}")
            process_item(next_num, items, api_key, args.dry_run, use_stream, args.no_image, args.image_only, args.no_convert, args.convert_only)


if __name__ == "__main__":
    main()
