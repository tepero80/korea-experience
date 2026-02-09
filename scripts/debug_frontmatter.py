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

md_file = Path("C:/kc/korea-experience/content/posts/best-rhinoplasty-clinics-gangnam-2026.md")
content = read_file_robust(md_file)

print(f"Content length: {len(content)}")
print(f"First 200 chars:")
print(repr(content[:200]))
print(f"\nTrying regex:")
fm_match = re.match(r"^---\r?\n(.*?)\r?\n---", content, re.DOTALL)
print(f"Match: {fm_match is not None}")

if not fm_match:
    print("\nTrying with BOM removal:")
    content_nobom = content.lstrip('\ufeff')
    fm_match = re.match(r"^---\r?\n(.*?)\r?\n---", content_nobom, re.DOTALL)
    print(f"Match: {fm_match is not None}")
