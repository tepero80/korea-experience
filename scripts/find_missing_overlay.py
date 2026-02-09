"""md에 image 있지만 실제 이미지는 오버레이 없는 것 찾기"""
from pathlib import Path
import re
from PIL import Image

PROJECT_ROOT = Path(__file__).parent.parent
POSTS_DIR = PROJECT_ROOT / "content" / "posts"
IMAGES_DIR = PROJECT_ROOT / "public" / "images"

def get_image_from_md(md_path):
    """md 파일에서 image 필드 추출"""
    try:
        content = md_path.read_text(encoding='utf-8')
        content = content.lstrip('\ufeff')
        match = re.search(r'^---\r?\n(.*?)\r?\n---', content, re.DOTALL | re.MULTILINE)
        if match:
            frontmatter = match.group(1)
            img_match = re.search(r'image:\s*"?(/images/[^"\s]+)', frontmatter)
            if img_match:
                return img_match.group(1)
    except:
        pass
    return None

def main():
    missing_overlay = []
    
    for md_path in POSTS_DIR.glob("*.md"):
        img_path_str = get_image_from_md(md_path)
        if not img_path_str:
            continue
        
        # /images/slug.webp -> public/images/slug.webp
        img_filename = img_path_str.replace("/images/", "")
        img_file = IMAGES_DIR / img_filename
        
        if not img_file.exists():
            continue
        
        # 이미지 사이즈 확인
        with Image.open(img_file) as im:
            if im.size == (1024, 1024):
                missing_overlay.append({
                    'slug': md_path.stem,
                    'image': img_filename,
                    'size': im.size
                })
    
    print(f"=== 오버레이 없는 이미지 ({len(missing_overlay)}개) ===\n")
    for item in missing_overlay[:20]:
        print(f"  {item['slug']}")
    
    if len(missing_overlay) > 20:
        print(f"  ... 외 {len(missing_overlay) - 20}개")

if __name__ == "__main__":
    main()
