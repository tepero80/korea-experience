"""
Convenience Store Must-Buys 파일을 PROPER convert.py 메서드로 변환
"""
import sys
from pathlib import Path

# Add deep_dive module to path
sys.path.insert(0, str(Path(__file__).parent / "deep_dive"))

from convert import convert_to_mdx, save_mdx

# 원본 TXT 파일 읽기
txt_path = Path(__file__).parent.parent / "content" / "deep-dive-drafts" / "47. [F] Convenience Store Must-Buys GS25 vs. CU.txt"
print(f"📖 Reading draft: {txt_path}")

draft_text = txt_path.read_text(encoding="utf-8")

# 변환 파라미터
category = "food"
slug = "convenience-store-must-buys-gs25-vs-cu"
image_path = "/images/convenience-store-gs25-cu.webp"
topic = "Convenience stores in Korea (GS25 vs CU comparison)"

print(f"\n🚀 Starting PROPER MDX conversion with Gemini Pro...")
print(f"   Category: {category}")
print(f"   Slug: {slug}")
print(f"   Image: {image_path}")
print(f"   Topic: {topic}")

# PROPER 변환 (Gemini Pro + MDX components)
mdx_content = convert_to_mdx(
    draft_text=draft_text,
    category=category,
    slug=slug,
    image_path=image_path,
    topic=topic
)

if mdx_content:
    # Save to content/deep-dive/
    output_path = save_mdx(mdx_content, slug)
    print(f"\n✅ SUCCESS: Properly converted with MDX components")
    print(f"   Output: {output_path}")
    print(f"\n🎯 Now delete the WRONG scripts/convert_txt_to_md.py")
else:
    print("\n❌ FAILED: MDX conversion returned None")
    sys.exit(1)
