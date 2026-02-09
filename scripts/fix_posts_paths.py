"""Posts 파일들의 이미지 경로 수정 (UTF-8 안전)"""
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
POSTS_DIR = PROJECT_ROOT / "content" / "posts"

fixed = 0
errors = []

for md_file in POSTS_DIR.glob("*.md"):
    try:
        # UTF-8로 읽기
        content = md_file.read_text(encoding='utf-8')
        
        # 경로 변경
        if '"/images/posts/' in content:
            new_content = content.replace('"/images/posts/', '"/images/')
            
            # UTF-8로 저장 (BOM 없이, LF로)
            md_file.write_text(new_content, encoding='utf-8', newline='\n')
            fixed += 1
    except Exception as e:
        errors.append((md_file.name, str(e)))

print(f"수정 완료: {fixed}개")
if errors:
    print(f"오류: {len(errors)}개")
