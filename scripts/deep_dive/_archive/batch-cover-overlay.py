"""
Deep-Dive 커버 이미지 일괄 교체 스크립트
- Step 1: Gemini 텍스트 모델로 scene description 생성
- Step 2: Gemini 이미지 모델로 텍스트 없는 배경 이미지 생성
- Step 3: Pillow로 타이틀 + 브랜드 텍스트 오버레이

Usage:
  python scripts/batch-cover-overlay.py              # 전체 38개 교체
  python scripts/batch-cover-overlay.py --start 5    # 5번째부터
  python scripts/batch-cover-overlay.py --only slug   # 특정 슬러그만
  python scripts/batch-cover-overlay.py --dry-run     # 실행 없이 목록만
"""

import os
import re
import sys
import json
import time
import argparse
import tempfile
from pathlib import Path
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env.local")

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("❌ GEMINI_API_KEY가 .env.local에 없습니다")
    sys.exit(1)

IMAGE_MODEL = "gemini-3-pro-image-preview"
SCENE_MODEL = "gemini-2.5-flash"
FONTS_DIR = Path(__file__).resolve().parent / "fonts"
IMAGES_DIR = PROJECT_ROOT / "public" / "images" / "deep-dive"
DEEP_DIVE_DIR = PROJECT_ROOT / "content" / "deep-dive"
PROGRESS_FILE = Path(__file__).resolve().parent / "cover-progress.json"

# ── 카테고리별 시각적 힌트 ──
CATEGORY_VISUAL_HINTS = {
    "Medical Tourism": "clean clinical setting, modern Korean hospital or clinic, medical equipment, professional atmosphere",
    "Travel & Tourism": "beautiful Korean landscape, tourist destination, traditional or modern Korean architecture",
    "K-Culture": "vibrant Korean pop culture scene, entertainment, colorful Korean street life",
    "Food & Dining": "appetizing Korean food, restaurant interior, street food market, cooking scene",
    "Shopping & K-Beauty": "Korean beauty products, shopping district, cosmetics store, fashion",
    "Living in Korea": "everyday Korean city life, apartment area, neighborhood scene, daily routine",
}

# ── Scene Description 생성 프롬프트 ──
SCENE_PROMPT_TEMPLATE = """You are a visual director creating scene descriptions for blog cover images about Korea.

Given this blog post info:
- Title: "{title}"
- Category: {category}
- Excerpt: "{excerpt}"

Create a SHORT scene description (2-3 sentences max) for a professional editorial photograph. The scene should:
1. Be visually compelling and directly related to the topic
2. Include specific visual elements (objects, settings, lighting)
3. Have a {visual_hint} feel
4. Work well as a 16:9 cinematic image

Respond with ONLY the scene description, nothing else. No quotes, no labels."""

# ── 배경 이미지 프롬프트 ──
BG_IMAGE_TEMPLATE = """Create a professional editorial photograph for a premium Korea travel blog.

SCENE: {scene}

COMPOSITION:
- Cinematic 16:9 wide-angle shot
- Rich, vibrant colors with natural lighting
- Modern editorial photography with cinematic color grading
- Bottom 20% of the frame should naturally be slightly darker (through shadows or natural composition) — text will be placed there later

CRITICAL RULES:
- DO NOT include ANY text, letters, words, watermarks, or typography in the image
- DO NOT include any overlay, frosted glass, gradient bars, or text placeholders
- The image must be a PURE PHOTOGRAPH with ZERO text elements
- Minimize readable text on signs, products, or books in the scene
- If people appear, they must look natural and realistic — no cyberpunk, no neon, no sci-fi
"""


def load_progress() -> dict:
    if PROGRESS_FILE.exists():
        return json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
    return {}


def save_progress(progress: dict):
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2, ensure_ascii=False), encoding="utf-8")


def get_deep_dive_posts() -> list[dict]:
    """deep-dive 디렉토리에서 포스트 정보 추출"""
    posts = []
    for md_file in sorted(DEEP_DIVE_DIR.glob("*.md")):
        content = md_file.read_text(encoding="utf-8")
        # 프론트매터 파싱
        fm_match = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
        if not fm_match:
            continue
        fm = fm_match.group(1)

        title = re.search(r'title:\s*"(.+?)"', fm)
        category = re.search(r'category:\s*(.+)', fm)
        excerpt = re.search(r'excerpt:\s*"(.+?)"', fm)
        image = re.search(r'image:\s*"?(/images/deep-dive/[^"\s]+)"?', fm)

        if not title or not image:
            continue

        slug = image.group(1).replace("/images/deep-dive/", "").replace(".webp", "")

        posts.append({
            "slug": slug,
            "title": title.group(1),
            "category": (category.group(1).strip() if category else "Travel & Tourism"),
            "excerpt": (excerpt.group(1)[:200] if excerpt else ""),
            "image_path": image.group(1),
            "md_file": md_file.name,
        })
    return posts


def make_short_title(title: str) -> str:
    """긴 타이틀을 2줄 이내로 줄임 (잘림 없이)"""
    # 콜론으로 분리
    if ":" in title:
        parts = title.split(":", 1)
        main = parts[0].strip()
        sub = parts[1].strip()
        return main + "\n" + sub
    # 콜론 없는 경우 - 단어 기준 중간에서 줄바꿈
    if len(title) > 30:
        words = title.split()
        mid = len(words) // 2
        return " ".join(words[:mid]) + "\n" + " ".join(words[mid:])
    return title


def generate_scene_description(title: str, category: str, excerpt: str) -> str:
    """Gemini 텍스트 모델로 scene description 생성"""
    from google import genai

    client = genai.Client(api_key=API_KEY)
    visual_hint = CATEGORY_VISUAL_HINTS.get(category, "modern Korean aesthetic")

    prompt = SCENE_PROMPT_TEMPLATE.format(
        title=title,
        category=category,
        excerpt=excerpt[:300],
        visual_hint=visual_hint,
    )

    try:
        response = client.models.generate_content(
            model=SCENE_MODEL,
            contents=[prompt],
        )
        scene = response.text.strip().strip('"')
        return scene
    except Exception as e:
        print(f"  ⚠️ Scene 생성 실패: {e}")
        return f"A professional editorial photograph related to {title}. Modern Korean setting with cinematic lighting."


def generate_background_image(scene: str, slug: str) -> Path | None:
    """텍스트 없는 배경 이미지 생성"""
    from google import genai
    from google.genai import types
    from PIL import Image as PILImage

    client = genai.Client(api_key=API_KEY)
    prompt = BG_IMAGE_TEMPLATE.format(scene=scene)

    try:
        response = client.models.generate_content(
            model=IMAGE_MODEL,
            contents=[prompt],
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
            ),
        )

        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        raw_path = IMAGES_DIR / f"{slug}-raw.webp"

        for part in response.parts:
            if part.inline_data is not None:
                image = part.as_image()
                with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                    tmp_path = tmp.name
                image.save(tmp_path)
                pil_img = PILImage.open(tmp_path)
                pil_img.save(str(raw_path), format="WEBP", quality=90)
                Path(tmp_path).unlink(missing_ok=True)
                return raw_path

        return None
    except Exception as e:
        print(f"  ❌ 이미지 생성 실패: {e}")
        return None


def overlay_text(bg_path: Path, title: str, output_slug: str) -> Path | None:
    """Pillow로 배경 이미지 위에 텍스트 오버레이"""
    from PIL import Image, ImageDraw, ImageFont

    img = Image.open(bg_path).convert("RGBA")
    W, H = img.size

    # 하단 그라디언트
    gradient = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_grad = ImageDraw.Draw(gradient)
    grad_start = int(H * 0.6)
    for y in range(grad_start, H):
        progress = (y - grad_start) / (H - grad_start)
        alpha = int(200 * progress)
        draw_grad.line([(0, y), (W, y)], fill=(0, 0, 0, alpha))
    img = Image.alpha_composite(img, gradient)

    draw = ImageDraw.Draw(img)

    # 폰트
    font_bold = FONTS_DIR / "Montserrat-Bold.ttf"
    font_semi = FONTS_DIR / "Montserrat-SemiBold.ttf"
    title_font_size = max(28, int(H * 0.045))
    brand_font_size = max(14, int(H * 0.018))

    try:
        title_font = ImageFont.truetype(str(font_bold), title_font_size)
        brand_font = ImageFont.truetype(str(font_semi), brand_font_size)
    except Exception:
        title_font = ImageFont.load_default()
        brand_font = ImageFont.load_default()

    padding_x = int(W * 0.04)
    padding_bottom = int(H * 0.05)
    max_text_width = W - padding_x * 2

    # 타이틀 줄 계산 (폰트 크기 자동 축소)
    lines = title.split("\n")
    while title_font_size > 18:
        try:
            title_font = ImageFont.truetype(str(font_bold), title_font_size)
        except Exception:
            title_font = ImageFont.load_default()
        fits = True
        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=title_font)
            if (bbox[2] - bbox[0]) > max_text_width:
                fits = False
                break
        if fits:
            break
        title_font_size -= 1

    line_heights = []
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=title_font)
        line_heights.append(bbox[3] - bbox[1])

    total_text_height = sum(line_heights) + (len(lines) - 1) * int(title_font_size * 0.3)

    brand_text = "KOREA EXPERIENCE"
    brand_bbox = draw.textbbox((0, 0), brand_text, font=brand_font)
    brand_h = brand_bbox[3] - brand_bbox[1]

    brand_y = H - padding_bottom - brand_h
    title_block_y = brand_y - int(H * 0.02) - total_text_height

    # 타이틀 그리기
    y_cursor = title_block_y
    for line in lines:
        shadow_offset = max(2, title_font_size // 20)
        draw.text((padding_x + shadow_offset, y_cursor + shadow_offset), line, font=title_font, fill=(0, 0, 0, 120))
        draw.text((padding_x, y_cursor), line, font=title_font, fill=(255, 255, 255, 255))
        bbox = draw.textbbox((0, 0), line, font=title_font)
        y_cursor += (bbox[3] - bbox[1]) + int(title_font_size * 0.3)

    # 브랜드 텍스트
    spaced_brand = "  ".join(brand_text)
    draw.text((padding_x + 2, brand_y + 2), spaced_brand, font=brand_font, fill=(0, 0, 0, 80))
    draw.text((padding_x, brand_y), spaced_brand, font=brand_font, fill=(255, 255, 255, 180))

    # 저장
    output_path = IMAGES_DIR / f"{output_slug}.webp"
    final = img.convert("RGB")
    final.save(str(output_path), format="WEBP", quality=88)
    return output_path


def process_single(post: dict, index: int, total: int) -> bool:
    """단일 포스트 커버 이미지 처리"""
    slug = post["slug"]
    title = post["title"]
    category = post["category"]
    excerpt = post["excerpt"]

    short_title = make_short_title(title)

    print(f"\n{'='*60}")
    print(f"[{index}/{total}] {slug}")
    print(f"  제목: {title}")
    print(f"  Short: {short_title}")
    print(f"  카테고리: {category}")

    # Step 1: Scene description
    print(f"  📝 Scene description 생성...")
    scene = generate_scene_description(title, category, excerpt)
    print(f"  Scene: {scene[:100]}...")

    # Step 2: 배경 이미지 생성
    print(f"  🎨 배경 이미지 생성 중...")
    bg_path = generate_background_image(scene, slug)
    if not bg_path:
        print(f"  ❌ 배경 이미지 생성 실패")
        return False

    from PIL import Image as PILImage
    bg_img = PILImage.open(bg_path)
    print(f"  ✅ 배경: {bg_img.size[0]}x{bg_img.size[1]}")

    # Step 3: 텍스트 오버레이
    print(f"  🔤 텍스트 오버레이 중...")
    result = overlay_text(bg_path, short_title, slug)
    if not result:
        print(f"  ❌ 오버레이 실패")
        return False

    file_size = result.stat().st_size
    print(f"  ✅ 완료: {result.name} ({file_size // 1024}KB)")

    # raw 파일 정리 (파일 잠금 시 무시)
    try:
        time.sleep(1)
        bg_path.unlink(missing_ok=True)
    except OSError:
        pass  # Windows 파일 잠금 시 무시, 나중에 수동 정리

    return True


def main():
    parser = argparse.ArgumentParser(description="Deep-Dive 커버 이미지 일괄 교체")
    parser.add_argument("--start", type=int, default=1, help="시작 번호 (1-based)")
    parser.add_argument("--only", type=str, help="특정 슬러그만 처리")
    parser.add_argument("--dry-run", action="store_true", help="실행 없이 목록만 출력")
    parser.add_argument("--skip-done", action="store_true", default=True, help="이미 완료된 항목 건너뛰기")
    args = parser.parse_args()

    posts = get_deep_dive_posts()
    print(f"📋 Deep-Dive 포스트: {len(posts)}개")

    if args.only:
        posts = [p for p in posts if p["slug"] == args.only]
        if not posts:
            print(f"❌ 슬러그 '{args.only}'를 찾을 수 없습니다")
            sys.exit(1)

    progress = load_progress()

    if args.dry_run:
        for i, post in enumerate(posts, 1):
            done = "✅" if progress.get(post["slug"]) else "⬜"
            print(f"  {done} {i:2d}. {post['slug']} | {post['title'][:50]}")
        done_count = sum(1 for p in posts if progress.get(p["slug"]))
        print(f"\n완료: {done_count}/{len(posts)}")
        return

    # 시작 인덱스 적용
    posts_to_process = posts[args.start - 1:]

    # 이미 완료된 항목 건너뛰기
    if args.skip_done:
        posts_to_process = [p for p in posts_to_process if not progress.get(p["slug"])]

    total = len(posts_to_process)
    print(f"🚀 처리 대상: {total}개 (시작: #{args.start})")
    print()

    success = 0
    fail = 0

    for i, post in enumerate(posts_to_process, 1):
        try:
            ok = process_single(post, i, total)
            if ok:
                progress[post["slug"]] = True
                save_progress(progress)
                success += 1
            else:
                progress[post["slug"]] = False
                save_progress(progress)
                fail += 1
        except Exception as e:
            print(f"  ❌ 예외 발생: {e}")
            progress[post["slug"]] = False
            save_progress(progress)
            fail += 1

        # API 속도 제한 방지
        if i < total:
            print(f"  ⏳ 대기 중 (5초)...")
            time.sleep(5)

    print(f"\n{'='*60}")
    print(f"🎉 완료! 성공: {success}, 실패: {fail}, 전체: {total}")
    print(f"   진행률: {sum(1 for v in progress.values() if v)}/{len(posts)}")


if __name__ == "__main__":
    main()
