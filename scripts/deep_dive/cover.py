"""
커버 이미지 생성 모듈
=====================
Gemini로 배경 이미지 생성 → Pillow로 텍스트 오버레이

사용:
  from deep_dive.cover import generate_cover, overlay_text, make_short_title
"""

import re
import base64
import io
from pathlib import Path

from .config import (
    API_KEY, IMAGE_MODEL, SCENE_MODEL, IMAGES_DIR, FONTS_DIR,
    CATEGORY_VISUAL_HINTS, RATE_LIMIT_DELAY,
)

# ── 프롬프트 ──

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


# ── 유틸 ──

def make_short_title(title: str) -> str:
    """긴 타이틀을 2줄 이내로 줄임 (잘림 없이)"""
    if ":" in title:
        parts = title.split(":", 1)
        return parts[0].strip() + "\n" + parts[1].strip()
    if len(title) > 30:
        words = title.split()
        mid = len(words) // 2
        return " ".join(words[:mid]) + "\n" + " ".join(words[mid:])
    return title


# ── Scene 생성 ──

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
        return response.text.strip().strip('"')
    except Exception as e:
        print(f"  ⚠️ Scene 생성 실패: {e}")
        return f"A professional editorial photograph related to {title}. Modern Korean setting with cinematic lighting."


# ── 배경 이미지 생성 ──

def generate_background_image(scene: str, slug: str) -> Path | None:
    """텍스트 없는 배경 이미지 생성 (Gemini Image Model)"""
    from google import genai
    from PIL import Image as PILImage

    client = genai.Client(api_key=API_KEY)
    prompt = BG_IMAGE_TEMPLATE.format(scene=scene)

    try:
        interaction = client.interactions.create(
            model=IMAGE_MODEL,
            input=prompt,
            response_format={
                "type": "image",
                "mime_type": "image/jpeg",
                "aspect_ratio": "16:9",
                "image_size": "1K",
            },
        )

        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        raw_path = IMAGES_DIR / f"{slug}-raw.webp"
        output_image = getattr(interaction, "output_image", None)
        image_data = getattr(output_image, "data", None)
        if not image_data:
            raise RuntimeError("Image response did not contain output_image.data")
        pil_img = PILImage.open(io.BytesIO(base64.b64decode(image_data)))
        pil_img.convert("RGB").save(str(raw_path), format="WEBP", quality=90)
        return raw_path
    except Exception as e:
        print(f"  ❌ 이미지 생성 실패: {e}")
        return None


# ── 텍스트 오버레이 ──

def overlay_text(bg_path: Path, title: str, output_slug: str) -> Path | None:
    """Pillow로 배경 이미지 위에 타이틀 + 브랜드 텍스트 오버레이"""
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

    # 폰트 크기 자동 축소 (텍스트가 이미지 폭 초과 시)
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

    # 타이틀 그리기 (그림자 + 본문)
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


# ── 전체 커버 파이프라인 ──

def generate_cover(slug: str, title: str, category: str, excerpt: str = "",
                   verbose: bool = True) -> Path | None:
    """Scene → Background → Overlay 전체 커버 이미지 파이프라인

    Returns:
        생성된 이미지 Path 또는 실패 시 None
    """
    short_title = make_short_title(title)

    if verbose:
        print(f"  Short: {short_title}")
        print(f"  📝 Scene description 생성...")

    scene = generate_scene_description(title, category, excerpt)
    if verbose:
        print(f"  Scene: {scene[:100]}...")
        print(f"  🎨 배경 이미지 생성 중...")

    bg_path = generate_background_image(scene, slug)
    if not bg_path:
        if verbose:
            print(f"  ❌ 배경 이미지 생성 실패")
        return None

    if verbose:
        from PIL import Image as PILImage
        bg_img = PILImage.open(bg_path)
        print(f"  ✅ 배경: {bg_img.size[0]}x{bg_img.size[1]}")
        print(f"  🔤 텍스트 오버레이 중...")

    result = overlay_text(bg_path, short_title, slug)
    if not result:
        if verbose:
            print(f"  ❌ 오버레이 실패")
        return None

    if verbose:
        file_size = result.stat().st_size
        print(f"  ✅ 완료: {result.name} ({file_size // 1024}KB)")

    return result
