import json
import re
from pathlib import Path

def read_robust(file_path):
    encodings = ["utf-8", "cp1252", "latin-1"]
    for enc in encodings:
        try:
            return file_path.read_text(encoding=enc)
        except:
            continue
    return file_path.read_text(encoding="utf-8", errors="replace")

posts_dir = Path("C:/kc/korea-experience/content/posts")
progress = {}

for md_file in posts_dir.glob("*.md"):
    content = read_robust(md_file).lstrip('\ufeff')
    fm_match = re.match(r"^---\r?\n(.*?)\r?\n---", content, re.DOTALL)
    
    if fm_match:
        fm = fm_match.group(1)
        has_image = bool(re.search(r'^image:', fm, re.MULTILINE))
        progress[md_file.stem] = has_image

progress_file = Path("C:/kc/korea-experience/scripts/cover-progress-posts.json")
json.dump(progress, open(progress_file, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)

completed = sum(1 for v in progress.values() if v)
pending = sum(1 for v in progress.values() if not v)

print(f"Progress 복구 완료:")
print(f"  완료: {completed}개")
print(f"  남음: {pending}개")
print(f"  전체: {len(progress)}개")
