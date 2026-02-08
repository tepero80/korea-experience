"""
Tool 커버 이미지 생성
====================
Gemini로 6개 Featured Tool 카드용 커버 이미지를 생성합니다.
결과: public/images/tools/{slug}.webp (960×540, 16:9)

실행:
  python scripts/generate-tool-covers.py
"""

import os
import sys
import time
import tempfile
from pathlib import Path

from dotenv import load_dotenv

# ── 경로 ──
PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env.local")

API_KEY = os.getenv("GEMINI_API_KEY", "")
IMAGE_MODEL = "gemini-3-pro-image-preview"
OUTPUT_DIR = PROJECT_ROOT / "public" / "images" / "tools"

# ── 6개 Featured Tools ──
TOOLS = [
    {
        "slug": "korean-name",
        "title": "Korean Name Generator",
        "prompt": (
            "A beautiful flat-lay photograph of traditional Korean calligraphy brushes, "
            "ink stone, and elegant handwritten Korean characters (hangul) on hanji paper. "
            "Soft natural light from a window, warm wooden desk surface. "
            "Modern minimalist Korean aesthetic with traditional elements."
        ),
    },
    {
        "slug": "korea-job-quiz",
        "title": "What Would Your Job Be in Korea?",
        "prompt": (
            "A vibrant split-image showing diverse Korean workplaces: a modern Seoul office "
            "with glass windows overlooking Gangnam skyline, a traditional Korean pottery studio, "
            "and a K-pop dance practice room. Cinematic lighting with warm tones. "
            "Professional editorial style showing Korean work culture diversity."
        ),
    },
    {
        "slug": "korean-city-quiz",
        "title": "Which Korean City Should You Live In?",
        "prompt": (
            "An aerial panoramic photograph showing the contrast of Korean cities — "
            "Seoul's Lotte Tower and Han River on one side, Busan's Haeundae Beach "
            "and colorful Gamcheon Culture Village on the other. Golden hour lighting, "
            "cinematic 16:9 wide composition showing Korea's urban beauty."
        ),
    },
    {
        "slug": "korean-food-quiz",
        "title": "What Korean Food Matches You?",
        "prompt": (
            "A stunning overhead shot of a Korean table spread (hanjeongsik) with "
            "various colorful banchan, steaming bibimbap, golden crispy fried chicken, "
            "and tteokbokki. Traditional brass chopsticks and ceramic bowls on a dark "
            "wooden table. Food photography with natural lighting and rich warm colors."
        ),
    },
    {
        "slug": "kdrama-character",
        "title": "Which K-Drama Character Are You?",
        "prompt": (
            "A cinematic photograph of a cozy Korean living room scene at night — "
            "a TV screen glowing softly, Korean snacks on a coffee table, "
            "fairy lights and warm ambient lighting. Romantic K-drama atmosphere with "
            "soft bokeh. Modern Seoul apartment interior with Han River view through window."
        ),
    },
    {
        "slug": "korean-nickname",
        "title": "Korean Nickname Generator",
        "prompt": (
            "A playful photograph of colorful Korean message cards and cute stickers "
            "scattered on a pastel pink desk. Korean emoticon characters, "
            "a smartphone showing Korean chat bubbles, and decorated name tags. "
            "Bright, cheerful K-pop inspired aesthetic with soft pastel tones."
        ),
    },
]

IMAGE_PROMPT_TEMPLATE = """Create a professional editorial photograph for a premium Korea lifestyle website.

SCENE: {scene}

STYLE:
- Cinematic 16:9 wide-angle shot
- Rich, vibrant colors with natural soft lighting 
- Modern editorial magazine quality
- Clean and visually compelling

CRITICAL RULES:
- DO NOT include ANY text, letters, words, watermarks, or typography
- DO NOT include any overlay, gradient bars, or text placeholders
- The image must be a PURE PHOTOGRAPH with ZERO text elements
- Minimize any readable signs or text on objects
"""


def generate_image(slug: str, prompt: str) -> Path | None:
    """Gemini로 이미지 생성 후 WEBP로 저장"""
    from google import genai
    from google.genai import types
    from PIL import Image as PILImage

    client = genai.Client(api_key=API_KEY)
    full_prompt = IMAGE_PROMPT_TEMPLATE.format(scene=prompt)

    try:
        response = client.models.generate_content(
            model=IMAGE_MODEL,
            contents=[full_prompt],
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
            ),
        )

        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        out_path = OUTPUT_DIR / f"{slug}.webp"

        for part in response.parts:
            if part.inline_data is not None:
                image = part.as_image()
                with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                    tmp_path = tmp.name
                image.save(tmp_path)

                # Resize to 960x540 (16:9)
                pil_img = PILImage.open(tmp_path)
                pil_img = pil_img.resize((960, 540), PILImage.LANCZOS)
                pil_img.save(str(out_path), format="WEBP", quality=88)
                Path(tmp_path).unlink(missing_ok=True)

                print(f"  ✅ Saved: {out_path.relative_to(PROJECT_ROOT)}")
                return out_path

        print(f"  ❌ No image in response for {slug}")
        return None

    except Exception as e:
        print(f"  ❌ Failed {slug}: {e}")
        return None


def main():
    if not API_KEY:
        print("❌ GEMINI_API_KEY not set in .env.local")
        sys.exit(1)

    print(f"🎨 Generating {len(TOOLS)} tool cover images...\n")
    
    success = 0
    for i, tool in enumerate(TOOLS):
        print(f"[{i+1}/{len(TOOLS)}] {tool['title']} ({tool['slug']})")
        result = generate_image(tool["slug"], tool["prompt"])
        if result:
            success += 1
        if i < len(TOOLS) - 1:
            print(f"  ⏳ Rate limit delay (5s)...")
            time.sleep(5)

    print(f"\n🎉 Done! {success}/{len(TOOLS)} images generated")
    print(f"📁 Output: public/images/tools/")


if __name__ == "__main__":
    main()
