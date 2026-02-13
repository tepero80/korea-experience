"""8개 파일의 ExpertTip quote 속성 내부 apostrophe escape"""
import re
from pathlib import Path

target_dir = Path(r"c:\kc\korea-experience\content\deep-dive")

files_to_fix = [
    "tax-refund-15000-minimum-2026.md",
    "tabling-app-for-waitlists-2026.md",
    "emergency-ready-app-english-alerts-2026.md",
    "understanding-pali-pali-culture-2026.md",
    "visiting-cheongwadae-blue-house-2026.md",
    "olive-young-discount-hacks-2026.md",
    "culinary-class-wars-2-restaurants-2026.md",
    "k-pop-dance-classes-trainee-experience-2026.md",
]

def escape_quotes_in_jsx_attrs(content):
    """JSX 속성 내부의 apostrophe와 특수문자 처리"""
    modified = False
    
    # ExpertTip quote 속성 찾기
    def fix_quote_attr(match):
        nonlocal modified
        full = match.group(0)
        quote_content = match.group(1)
        
        # 이미 escape 되어 있으면 스킵
        if r"\'" in quote_content:
            return full
        
        # apostrophe escape
        if "'" in quote_content:
            fixed_content = quote_content.replace("'", r"\'")
            modified = True
            return f'quote="{fixed_content}"'
        
        return full
    
    # quote="..." 패턴 찾기 (멀티라인 지원)
    content = re.sub(
        r'quote="([^"]+)"',
        fix_quote_attr,
        content,
        flags=re.DOTALL
    )
    
    # 이상한 문자 수정 (? 같은 것들)
    if "?�" in content or "?�" in content:
        content = content.replace("?�", " — ")
        content = content.replace("?�", " — ")
        modified = True
    
    return content, modified

if __name__ == "__main__":
    fixed_count = 0
    for filename in files_to_fix:
        filepath = target_dir / filename
        if not filepath.exists():
            print(f"❌ Not found: {filename}")
            continue
        
        content = filepath.read_text(encoding='utf-8', errors='ignore')
        new_content, was_modified = escape_quotes_in_jsx_attrs(content)
        
        if was_modified:
            filepath.write_text(new_content, encoding='utf-8')
            print(f"✅ Fixed: {filename}")
            fixed_count += 1
        else:
            print(f"⏭️  No changes: {filename}")
    
    print(f"\n📊 Fixed {fixed_count}/{len(files_to_fix)} files")
