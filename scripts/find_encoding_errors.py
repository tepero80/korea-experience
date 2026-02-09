from pathlib import Path

posts_dir = Path("C:/kc/korea-experience/content/posts")

for md_file in sorted(posts_dir.glob("*.md")):
    try:
        md_file.read_text(encoding="utf-8")
    except UnicodeDecodeError as e:
        print(f"ERROR: {md_file.name}")
        print(f"  Position: {e.start}")
        print(f"  Byte: {hex(e.object[e.start])}")
