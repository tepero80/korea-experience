"""
Deep Dive 공유 설정
====================
모든 deep-dive 스크립트가 참조하는 경로, 모델명, 카테고리 매핑 등.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# ── 경로 ──
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scripts"
DEEP_DIVE_SCRIPTS = SCRIPTS_DIR / "deep_dive"

CONTENT_DIR = PROJECT_ROOT / "content"
DEEP_DIVE_DIR = CONTENT_DIR / "deep-dive"
POSTS_DIR = CONTENT_DIR / "posts"
DRAFTS_DIR = CONTENT_DIR / "deep-dive-drafts"
TODO_FILE = DEEP_DIVE_SCRIPTS / "todo.md"
PROMPT_FILE = DRAFTS_DIR / "PROMPT.md"
README_FILE = DRAFTS_DIR / "README.md"

IMAGES_DIR = PROJECT_ROOT / "public" / "images" / "deep-dive"
FONTS_DIR = DEEP_DIVE_SCRIPTS / "fonts"

# ── 환경변수 ──
load_dotenv(PROJECT_ROOT / ".env.local")
API_KEY = os.getenv("GEMINI_API_KEY", "")

# ── 모델 ──
IMAGE_MODEL = "gemini-3-pro-image-preview"      # 이미지 생성
SCENE_MODEL = "gemini-2.5-flash"                 # Scene description / 커버 요소
CONVERT_MODEL = "gemini-3-pro-preview"           # MDX 변환
RESEARCH_AGENT = "deep-research-pro-preview-12-2025"  # Deep Research API

# ── 타이밍 ──
RATE_LIMIT_DELAY = 5       # 이미지 생성 간 대기 (초)
POLL_INTERVAL = 15         # Deep Research 폴링 (초)
MAX_WAIT = 3600            # Deep Research 최대 대기 (초)

# ── 카테고리 ──
CATEGORY_CODE_MAP = {
    "M": "Medical Tourism",
    "T": "Travel & Tourism",
    "K": "K-Culture",
    "L": "Living in Korea",
    "F": "Food & Dining",
    "S": "Shopping & K-Beauty",
}

CATEGORY_VISUAL_HINTS = {
    "Medical Tourism": "clean clinical setting, modern Korean hospital or clinic, medical equipment, professional atmosphere",
    "Travel & Tourism": "beautiful Korean landscape, tourist destination, traditional or modern Korean architecture",
    "K-Culture": "vibrant Korean pop culture scene, entertainment, colorful Korean street life",
    "Food & Dining": "appetizing Korean food, restaurant interior, street food market, cooking scene",
    "Shopping & K-Beauty": "Korean beauty products, shopping district, cosmetics store, fashion",
    "Living in Korea": "everyday Korean city life, apartment area, neighborhood scene, daily routine",
}

# ── MDX 검증 ──
VALID_COMPONENTS = [
    "KeyTakeaways", "FAQAccordion", "ExpertTip", "InfoBox", "StepGuide",
    "ProsCons", "PriceTable", "StatCard", "QuickFacts", "ComparisonTable",
    "LocationCard", "Timeline", "DualismRoute",
]

ARRAY_PROPS = [
    "highlights", "points", "pros", "cons", "items", "facts",
    "stats", "steps", "rows", "headers", "stops",
]


# ── 커버 이미지 프롬프트 (legacy — Gemini에게 텍스트 렌더링 위임) ──
COVER_IMAGE_TEMPLATE = """Create a professional blog cover image for "Korea Experience".

LAYOUT:
- Cinematic 16:9, vivid editorial scene fills entire frame
- Bottom 20%: scene naturally darker (for text overlay)
- Text at bottom-left (~40px padding):
  - Main: "{short_title}" bold modern sans-serif, clean white, subtle shadow
  - Below: "KOREA EXPERIENCE" small caps, letter-spacing wide, semi-transparent white
- Top-right: pill badge "{category}" white on dark semi-transparent

SCENE: {scene}
INCLUDE: {key_objects}
STYLE: {mood} mood, {color_palette} palette, modern editorial, cinematic grading

TEXT RULES:
- "{short_title}" spelled exactly, no typos
- "KOREA EXPERIENCE" spelled exactly
- Text: clean white, NO heavy outlines/glow/frosted glass/gradient overlays
"""


def require_api_key():
    """API 키가 없으면 오류 메시지와 함께 종료"""
    if not API_KEY:
        print("❌ GEMINI_API_KEY가 .env.local에 설정되지 않았습니다.")
        raise SystemExit(1)
    return API_KEY
