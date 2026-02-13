"""최근 deep-dive 파일들의 frontmatter 이중 이스케이핑 수정"""
import re
from pathlib import Path

target_dir = Path(r"c:\kc\korea-experience\content\deep-dive")

files_to_fix = [
    "tax-refund-15000-minimum-2026.md",
    "emergency-ready-app-english-alerts-2026.md",
    "olive-young-discount-hacks-2026.md",
    "culinary-class-wars-2-restaurants-2026.md",
]

def fix_frontmatter(filepath):
    """이중 이스케이핑 제거: title:"\"Text\"" → title: "Text" """
    content = filepath.read_text(encoding='utf-8')
    original = content
    
    # Pattern: title:"\"...\""  or  excerpt:"\"...\""
    # Replace with: title: "..."
    content = re.sub(
        r'^(title|excerpt):"\\\"(.+?)\\\""\s*$',
        r'\1: "\2"',
        content,
        flags=re.MULTILINE
    )
    
    if content != original:
        filepath.write_text(content, encoding='utf-8')
        print(f"✅ Fixed: {filepath.name}")
        return True
    else:
        print(f"⏭️  No changes: {filepath.name}")
        return False

if __name__ == "__main__":
    fixed_count = 0
    for filename in files_to_fix:
        filepath = target_dir / filename
        if filepath.exists():
            if fix_frontmatter(filepath):
                fixed_count += 1
        else:
            print(f"❌ Not found: {filename}")
    
    print(f"\n📊 Fixed {fixed_count}/{len(files_to_fix)} files")
