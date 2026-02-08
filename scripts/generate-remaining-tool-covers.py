"""
나머지 Tool 커버 이미지 생성
============================
기존 6개 제외 나머지 16개 Tool 카드용 커버 이미지를 Gemini로 생성합니다.
결과: public/images/tools/{slug}.webp (960×540, 16:9)

실행:
  python scripts/generate-remaining-tool-covers.py
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

# ── 16개 나머지 Tools ──
TOOLS = [
    # Love & Relationships
    {
        "slug": "love-compatibility",
        "title": "Korean Love Compatibility",
        "prompt": (
            "A romantic Korean couple scene with matching couple rings on a wooden table, "
            "alongside traditional Korean love fortune papers (사주) and cherry blossom petals. "
            "Soft pink and warm lighting. Seoul Namsan Tower love locks blurred in background. "
            "Dreamy romantic Korean aesthetic."
        ),
    },
    {
        "slug": "ideal-korean-partner",
        "title": "Your Ideal Korean Partner Type",
        "prompt": (
            "An elegant Korean cafe date setting with two cups of café latte art (heart-shaped), "
            "a small bouquet of roses, and a Korean drama script book on a marble table. "
            "Warm golden hour light streaming through large cafe windows in Gangnam. "
            "Romantic modern Korean dating culture aesthetic."
        ),
    },
    {
        "slug": "couple-name",
        "title": "Korean Couple Name Combiner",
        "prompt": (
            "A charming flat-lay of Korean couple items: matching phone cases with cute characters, "
            "couple bracelets, a polaroid photo frame, and colorful Korean letter stickers on "
            "a pastel mint desk. Bright cheerful lighting, Instagram-worthy Korean couple aesthetic."
        ),
    },
    {
        "slug": "kdrama-romance-trope",
        "title": "Your K-Drama Romance Trope",
        "prompt": (
            "A cinematic rainy street scene in a Korean alley at night — warm street lights "
            "reflecting off wet cobblestones, a single transparent umbrella lying on a bench, "
            "traditional Korean hanok rooftops visible. Moody romantic K-Drama atmosphere "
            "with soft bokeh rain drops."
        ),
    },

    # Fun & Entertainment
    {
        "slug": "kpop-stage-name",
        "title": "K-Pop Stage Name Generator",
        "prompt": (
            "A glamorous K-Pop concert stage setup with colorful LED lights, "
            "a sparkling microphone on a stand, lightstick accessories scattered around, "
            "and a backstage mirror with bright vanity lights. Vibrant neon purple and pink "
            "concert lighting atmosphere."
        ),
    },
    {
        "slug": "korean-typing-test",
        "title": "Korean Typing Speed Test",
        "prompt": (
            "A sleek modern Korean keyboard with Korean (hangul) characters on the keycaps, "
            "lit by soft RGB backlighting in blue and purple tones. A clean minimal desk setup "
            "with a monitor showing Korean text. Modern tech aesthetic with warm ambient lighting."
        ),
    },
    {
        "slug": "korean-zodiac-fortune",
        "title": "Korean Zodiac Fortune Today",
        "prompt": (
            "A mystical Korean fortune-telling scene with traditional Korean zodiac animal figures, "
            "a crystal ball, incense smoke, and old Korean fortune cards (점카드) on a dark velvet cloth. "
            "Moody candlelight with golden warm tones. Traditional Korean shamanic aesthetic "
            "meets modern mystical vibes."
        ),
    },
    {
        "slug": "guess-korean-food",
        "title": "Guess the Korean Food Photo",
        "prompt": (
            "A close-up macro food photography shot of Korean dishes — extreme close-up of "
            "golden crispy Korean fried chicken with gochujang glaze, steam rising from "
            "a bubbling kimchi jjigae, and perfectly rolled kimbap cross-section. "
            "Rich vibrant food photography with dramatic lighting."
        ),
    },
    {
        "slug": "emoji-name",
        "title": "Your Korean Emoji Name",
        "prompt": (
            "A colorful creative composition of 3D emoji figurines arranged on a bright yellow "
            "background — smiling faces, hearts, stars, and Korean-themed objects like kimchi, "
            "hanbok, and Korean flag elements. Pop art style with bold primary colors. "
            "Fun playful digital art aesthetic."
        ),
    },

    # Plan Your Korea Trip
    {
        "slug": "korean-age",
        "title": "Korean Age Calculator",
        "prompt": (
            "A Korean first birthday (돌잔치) table setup with traditional items: "
            "colorful rice cakes (무지개떡), fruits, a thread spool, and a small Korean fan. "
            "Beautiful traditional Korean decorations with modern pastel touches. "
            "Bright warm natural lighting on an elegant traditional Korean table."
        ),
    },
    {
        "slug": "trip-budget",
        "title": "Korea Trip Budget Calculator",
        "prompt": (
            "An aesthetic travel flat-lay: Korean won bills and coins, a Korean passport stamp, "
            "a Seoul metro card (T-money), Korean snack packaging, and a small notebook "
            "with a map of Korea. Bright overhead shot on a clean white marble surface. "
            "Modern travel planning aesthetic."
        ),
    },
    {
        "slug": "medical-cost-estimator",
        "title": "Medical Tourism Cost Estimator",
        "prompt": (
            "A pristine modern Korean medical clinic interior — sleek white reception area "
            "with warm wood accents, a comfortable waiting lounge with Korean aesthetics, "
            "and lush indoor plants. Bright clean natural lighting through floor-to-ceiling windows. "
            "Premium Korean medical tourism facility atmosphere."
        ),
    },
    {
        "slug": "convenience-store-meals",
        "title": "Convenience Store Meal Builder",
        "prompt": (
            "A colorful display of Korean convenience store (편의점) food: "
            "triangle kimbap, cup ramyeon with egg, Korean banana milk, tteokbokki cups, "
            "and sandwiches arranged on the store counter under bright fluorescent lights. "
            "Authentic Korean convenience store food photography aesthetic."
        ),
    },

    # Life in Korea
    {
        "slug": "business-name",
        "title": "Korean Business Name Generator",
        "prompt": (
            "A sophisticated Korean business district scene — modern glass office buildings "
            "in Gangnam reflecting golden sunset light, with a traditional Korean shop sign "
            "(간판) in the foreground on a charming side street. Modern meets traditional "
            "Korean business aesthetic."
        ),
    },
    {
        "slug": "korean-beauty-quiz",
        "title": "Korean Beauty Routine Quiz",
        "prompt": (
            "A luxurious K-Beauty product flat-lay: Korean skincare bottles with minimalist design, "
            "jade roller, sheet masks, gua sha tool, and fresh flower petals on a pale pink "
            "marble surface. Soft natural light with dewy water droplets. "
            "Premium K-Beauty editorial product photography."
        ),
    },
    {
        "slug": "military-service",
        "title": "Korean Military Service Calculator",
        "prompt": (
            "A dignified photograph of Korean military dog tags on a folded Korean flag, "
            "with a military beret and a calendar in the background. Respectful composition "
            "with soft directional lighting. Muted earth tones with subtle Korean military "
            "green accents. Honorable and respectful aesthetic."
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

    # 이미 존재하는 이미지는 스킵
    existing = set()
    if OUTPUT_DIR.exists():
        existing = {f.stem for f in OUTPUT_DIR.glob("*.webp")}

    tools_to_generate = [t for t in TOOLS if t["slug"] not in existing]

    if not tools_to_generate:
        print("✅ All images already exist!")
        return

    print(f"🎨 Generating {len(tools_to_generate)} tool cover images (skipping {len(TOOLS) - len(tools_to_generate)} existing)...\n")

    success = 0
    for i, tool in enumerate(tools_to_generate):
        print(f"[{i+1}/{len(tools_to_generate)}] {tool['title']} ({tool['slug']})")
        result = generate_image(tool["slug"], tool["prompt"])
        if result:
            success += 1
        if i < len(tools_to_generate) - 1:
            print(f"  ⏳ Rate limit delay (5s)...")
            time.sleep(5)

    print(f"\n🎉 Done! {success}/{len(tools_to_generate)} images generated")
    print(f"📁 Output: public/images/tools/")


if __name__ == "__main__":
    main()
