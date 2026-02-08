"""
Deep Dive Content Generator
============================
Gemini Deep Research API를 사용하여 deep-dive 드래프트를 자동 생성합니다.
Nano Banana Pro로 커버 이미지도 자동 생성합니다.

사용법:
  # 다음 번호 자동 감지 (todo.md 기반)
  python scripts/deep-research.py

  # 특정 번호 지정
  python scripts/deep-research.py --number 37

  # 번호 범위 (배치)
  python scripts/deep-research.py --from 37 --to 42

  # dry-run (API 호출 없이 프롬프트만 확인)
  python scripts/deep-research.py --number 37 --dry-run

  # 이미지만 생성 (기존 드래프트에서 COVER IMAGE 파싱)
  python scripts/deep-research.py --number 37 --image-only

  # 이미지 생성 건너뛰기
  python scripts/deep-research.py --number 37 --no-image

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
POLL_INTERVAL = 15  # seconds
MAX_WAIT = 3600     # 60 minutes

# 커버 이미지 프롬프트 템플릿
COVER_IMAGE_TEMPLATE = """Create a professional blog cover image for "Korea Experience", a premium Korea travel and lifestyle website.

LAYOUT REQUIREMENTS (CRITICAL — follow exactly):
- Cinematic 16:9 composition (will be used as 1200x630 OG image)
- The vivid editorial scene fills the ENTIRE frame
- Bottom 25%: a smooth dark-to-transparent gradient overlay for text readability
- Text overlay at bottom-left (with ~40px padding):
  - Main line: "{short_title}" in bold modern sans-serif (like Montserrat or DM Sans), white color, large size
  - Second line below: "KOREA EXPERIENCE" in small caps, letter-spacing wide, semi-transparent white (opacity ~70%)
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

TEXT RULES (VERY IMPORTANT):
- "{short_title}" must be spelled exactly, clearly readable, no typos
- "KOREA EXPERIENCE" must be spelled exactly in small caps
- Text should sit on the dark gradient area so it's always readable
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

        # 이미지 저장
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        output_path = IMAGES_DIR / f"{slug}.png"

        for part in response.parts:
            if part.inline_data is not None:
                image = part.as_image()
                image.save(str(output_path))
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


def process_item(
    num: int,
    items: dict,
    api_key: str,
    dry_run: bool = False,
    stream: bool = True,
    no_image: bool = False,
    image_only: bool = False,
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
    if not no_image:
        elements = parse_cover_image_elements(result)
        if elements:
            generate_cover_image(elements, item["category"], slug, api_key)
        else:
            print("⚠️  COVER IMAGE 섹션이 없어 이미지 생성을 건너뜁니다.")

    return True


def main():
    parser = argparse.ArgumentParser(description="Deep Dive Content Generator (Gemini Deep Research API)")
    parser.add_argument("--number", "-n", type=int, help="처리할 주제 번호")
    parser.add_argument("--from", dest="from_num", type=int, help="배치 시작 번호")
    parser.add_argument("--to", dest="to_num", type=int, help="배치 종료 번호")
    parser.add_argument("--dry-run", action="store_true", help="API 호출 없이 프롬프트만 확인")
    parser.add_argument("--no-stream", action="store_true", help="스트리밍 비활성화 (폴링 모드)")
    parser.add_argument("--no-image", action="store_true", help="커버 이미지 생성 건너뛰기")
    parser.add_argument("--image-only", action="store_true", help="기존 드래프트에서 커버 이미지만 생성")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key and not args.dry_run:
        print("❌ GEMINI_API_KEY가 .env.local에 설정되지 않았습니다.")
        sys.exit(1)

    items = parse_todo()
    print(f"📋 todo.md에서 {len(items)}개 주제 로드")

    use_stream = not args.no_stream

    if args.from_num and args.to_num:
        # 배치 모드
        success = 0
        for num in range(args.from_num, args.to_num + 1):
            if process_item(num, items, api_key, args.dry_run, use_stream, args.no_image, args.image_only):
                success += 1
        print(f"\n📊 배치 완료: {success}/{args.to_num - args.from_num + 1}")

    elif args.number:
        # 단일 번호
        process_item(args.number, items, api_key, args.dry_run, use_stream, args.no_image, args.image_only)

    else:
        # 자동 감지
        next_num = find_next_number(items)
        if next_num is None:
            print("✅ 모든 주제가 완료되었습니다!")
        else:
            print(f"🎯 다음 주제: #{next_num}")
            process_item(next_num, items, api_key, args.dry_run, use_stream, args.no_image, args.image_only)


if __name__ == "__main__":
    main()
