import re
from pathlib import Path

def read_file_robust(file_path: Path) -> str:
    """여러 인코딩을 시도하여 파일 읽기"""
    encodings = ["utf-8", "cp1252", "latin-1"]
    for enc in encodings:
        try:
            return file_path.read_text(encoding=enc)
        except (UnicodeDecodeError, UnicodeError):
            continue
    return file_path.read_text(encoding="utf-8", errors="replace")

posts_dir = Path("C:/kc/korea-experience/content/posts")
failed = []

for md_file in sorted(posts_dir.glob("*.md")):
    content = read_file_robust(md_file)
    fm_match = re.match(r"^---\r?\n(.*?)\r?\n---", content, re.DOTALL)
    if not fm_match:
        failed.append(md_file.stem)

print(f"Frontmatter 파싱 실패: {len(failed)}개")
for slug in failed[:10]:
    print(f"  - {slug}")
if len(failed) > 10:
    print(f"  ... 외 {len(failed)-10}개")
