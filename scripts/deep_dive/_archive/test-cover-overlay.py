"""
커버 이미지 후처리 테스트 스크립트
- AI: 텍스트 없는 순수 배경 이미지만 생성
- Pillow: 타이틀 + 브랜드 텍스트를 일관된 폰트/위치로 오버레이

테스트 대상: korean-toy-stores-unique-collectibles
"""

import os
import sys
import tempfile
from pathlib import Path
from dotenv import load_dotenv

# 프로젝트 루트
PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env.local")

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("❌ GEMINI_API_KEY가 .env.local에 없습니다")
    sys.exit(1)

IMAGE_MODEL = "gemini-3-pro-image-preview"  # 이미지 생성 모델
FONTS_DIR = Path(__file__).resolve().parent / "fonts"
IMAGES_DIR = PROJECT_ROOT / "public" / "images" / "deep-dive"

# ── 테스트 데이터 ──
TEST_TITLE = "Korean Toy Stores &\nUnique Collectibles"
TEST_SHORT_TITLE = "Korean Toy Stores &\nUnique Collectibles"
TEST_CATEGORY = "Shopping & K-Beauty"
TEST_SLUG = "korean-toy-stores-unique-collectibles-test"

# AI에게 보내는 순수 배경 이미지 프롬프트 (텍스트 없음!)
BG_IMAGE_PROMPT = """Create a professional editorial photograph for a blog about Korean toy stores and collectibles.

SCENE: The interior of a colorful, jam-packed Korean toy store in Hongdae, Seoul. Shelves overflowing with anime figures, Gundam model kits, Pop Mart blind boxes, and Bearbrick collectibles. Warm ambient lighting. A few shoppers browsing in the background.

COMPOSITION:
- Cinematic 16:9 wide-angle shot
- Rich, vibrant colors with warm lighting
- Modern editorial photography with cinematic color grading
- Sharp focus on the collectibles in the foreground, blurred background shoppers
- Bottom 20% of the frame should naturally be slightly darker (through shadows, shelving, or floor) — this is where text will be placed later

CRITICAL RULES:
- DO NOT include ANY text, letters, words, watermarks, or typography in the image
- DO NOT include any overlay, frosted glass, gradient bars, or text placeholders
- The image should be a PURE PHOTOGRAPH with ZERO text elements
- No signs with readable text, no book spines with visible titles, no brand logos
- If people appear, they must look natural and realistic — no cyberpunk, no neon
"""


def generate_background_image() -> Path | None:
    """AI로 텍스트 없는 배경 이미지 생성"""
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=API_KEY)

    print("🎨 텍스트 없는 배경 이미지 생성 중...")
    print(f"   모델: {IMAGE_MODEL}")

    try:
        response = client.models.generate_content(
            model=IMAGE_MODEL,
            contents=[BG_IMAGE_PROMPT],
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
            ),
        )

        # 임시 파일로 저장
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        raw_path = IMAGES_DIR / f"{TEST_SLUG}-raw.webp"

        from PIL import Image as PILImage

        for part in response.parts:
            if part.inline_data is not None:
                image = part.as_image()
                with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                    tmp_path = tmp.name
                image.save(tmp_path)
                pil_img = PILImage.open(tmp_path)
                pil_img.save(str(raw_path), format="WEBP", quality=90)
                Path(tmp_path).unlink(missing_ok=True)
                print(f"✅ 배경 이미지 저장: {raw_path.name} ({pil_img.size[0]}x{pil_img.size[1]})")
                return raw_path

        print("⚠️  이미지가 생성되지 않았습니다")
        return None

    except Exception as e:
        print(f"❌ 이미지 생성 실패: {e}")
        return None


def overlay_text(bg_path: Path, title: str, category: str, output_slug: str) -> Path | None:
    """Pillow로 배경 이미지 위에 텍스트 오버레이"""
    from PIL import Image, ImageDraw, ImageFont, ImageFilter

    img = Image.open(bg_path).convert("RGBA")
    W, H = img.size
    print(f"📐 이미지 크기: {W}x{H}")

    # ── 1) 하단 그라디언트 오버레이 ──
    gradient = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_grad = ImageDraw.Draw(gradient)
    # 하단 40%에 검은 그라디언트 (0→180 알파)
    grad_start = int(H * 0.6)
    for y in range(grad_start, H):
        progress = (y - grad_start) / (H - grad_start)
        alpha = int(200 * progress)  # max alpha 200
        draw_grad.line([(0, y), (W, y)], fill=(0, 0, 0, alpha))
    img = Image.alpha_composite(img, gradient)

    draw = ImageDraw.Draw(img)

    # ── 2) 폰트 로드 ──
    font_bold = FONTS_DIR / "Montserrat-Bold.ttf"
    font_semi = FONTS_DIR / "Montserrat-SemiBold.ttf"

    # 타이틀 폰트 크기: 이미지 높이의 ~4.5%
    title_font_size = max(28, int(H * 0.045))
    brand_font_size = max(14, int(H * 0.018))
    badge_font_size = max(12, int(H * 0.016))

    try:
        title_font = ImageFont.truetype(str(font_bold), title_font_size)
        brand_font = ImageFont.truetype(str(font_semi), brand_font_size)
        badge_font = ImageFont.truetype(str(font_semi), badge_font_size)
    except Exception as e:
        print(f"⚠️  폰트 로드 실패, 기본 폰트 사용: {e}")
        title_font = ImageFont.load_default()
        brand_font = ImageFont.load_default()
        badge_font = ImageFont.load_default()

    # ── 3) 타이틀 텍스트 (하단 좌측) ──
    padding_x = int(W * 0.04)  # 좌측 4% 패딩
    padding_bottom = int(H * 0.05)  # 하단 5% 패딩

    # 멀티라인 타이틀
    lines = title.split("\n")
    line_heights = []
    line_widths = []
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=title_font)
        line_widths.append(bbox[2] - bbox[0])
        line_heights.append(bbox[3] - bbox[1])

    total_text_height = sum(line_heights) + (len(lines) - 1) * int(title_font_size * 0.3)

    # 브랜드 텍스트 높이
    brand_text = "KOREA EXPERIENCE"
    brand_bbox = draw.textbbox((0, 0), brand_text, font=brand_font)
    brand_h = brand_bbox[3] - brand_bbox[1]

    # Y 시작 위치 계산 (하단에서 위로)
    brand_y = H - padding_bottom - brand_h
    title_block_y = brand_y - int(H * 0.02) - total_text_height

    # 타이틀 각 줄 그리기 (그림자 + 흰색)
    y_cursor = title_block_y
    for line in lines:
        # 부드러운 그림자
        shadow_offset = max(2, title_font_size // 20)
        draw.text(
            (padding_x + shadow_offset, y_cursor + shadow_offset),
            line,
            font=title_font,
            fill=(0, 0, 0, 120),
        )
        # 흰색 텍스트
        draw.text(
            (padding_x, y_cursor),
            line,
            font=title_font,
            fill=(255, 255, 255, 255),
        )
        bbox = draw.textbbox((0, 0), line, font=title_font)
        y_cursor += (bbox[3] - bbox[1]) + int(title_font_size * 0.3)

    # ── 4) 브랜드 텍스트 (타이틀 아래) ──
    # 자간 넓히기 (letter-spacing 시뮬레이션)
    spaced_brand = "  ".join(brand_text)
    draw.text(
        (padding_x + 2, brand_y + 2),
        spaced_brand,
        font=brand_font,
        fill=(0, 0, 0, 80),
    )
    draw.text(
        (padding_x, brand_y),
        spaced_brand,
        font=brand_font,
        fill=(255, 255, 255, 180),
    )

    # ── 5) 최종 저장 ──
    output_path = IMAGES_DIR / f"{output_slug}.webp"
    final = img.convert("RGB")
    final.save(str(output_path), format="WEBP", quality=88)
    
    file_size = output_path.stat().st_size
    print(f"✅ 최종 이미지 저장: {output_path.name} ({file_size // 1024}KB)")
    return output_path


def main():
    print("=" * 60)
    print("🧪 커버 이미지 후처리 테스트")
    print("=" * 60)
    print(f"제목: {TEST_TITLE}")
    print(f"카테고리: {TEST_CATEGORY}")
    print()

    # Step 1: AI로 텍스트 없는 배경 생성
    bg_path = generate_background_image()
    if not bg_path:
        print("❌ 배경 이미지 생성 실패, 종료")
        sys.exit(1)

    # Step 2: Pillow로 텍스트 오버레이
    print()
    result = overlay_text(bg_path, TEST_TITLE, TEST_CATEGORY, TEST_SLUG)
    if result:
        print()
        print(f"🎉 테스트 완료!")
        print(f"   원본(텍스트없음): {bg_path.name}")
        print(f"   최종(텍스트포함): {result.name}")
        print(f"   경로: {result}")


if __name__ == "__main__":
    main()
