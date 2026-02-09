"""Posts에서 image 필드 없는 파일 찾기"""
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
POSTS_DIR = PROJECT_ROOT / "content" / "posts"

def check_image_field(md_path):
    try:
        content = md_path.read_text(encoding='utf-8')
        content = content.lstrip('\ufeff')
        match = re.search(r'^---\r?\n(.*?)\r?\n---', content, re.DOTALL | re.MULTILINE)
        if match:
            frontmatter = match.group(1)
            has_image = 'image:' in frontmatter
            return has_image
    except:
        return None
    return False

missing = []
for md_path in POSTS_DIR.glob("*.md"):
    has_image = check_image_field(md_path)
    if has_image is False:
        missing.append(md_path.stem)

print(f"=== Image 필드 없는 Posts ({len(missing)}개) ===\n")
for slug in sorted(missing):
    print(f"  {slug}")
