"""8개 파일의 모든 JSX 컴포넌트 props 검증 및 수정"""
import re
from pathlib import Path

target_dir = Path(r"c:\kc\korea-experience\content\deep-dive")

files_to_check = [
    "tax-refund-15000-minimum-2026.md",
    "tabling-app-for-waitlists-2026.md",
    "emergency-ready-app-english-alerts-2026.md",
    "understanding-pali-pali-culture-2026.md",
    "visiting-cheongwadae-blue-house-2026.md",
    "olive-young-discount-hacks-2026.md",
    "culinary-class-wars-2-restaurants-2026.md",
    "k-pop-dance-classes-trainee-experience-2026.md",
]

def fix_jsx_props(content):
    """JSX 컴포넌트 props의 문법 에러 수정"""
    modified = False
    
    # 1. QuickFacts의 닫히지 않은 따옴표 수정
    # Pattern: icon: "X }, where X might be missing closing quote
    def fix_unclosed_icon(match):
        nonlocal modified
        full = match.group(0)
        # 만약 icon: " }처럼 비어있으면 기본 이모지로 채움
        if re.search(r'icon:\s*"\s*[},\]]', full):
            modified = True
            return re.sub(r'icon:\s*"(\s*)[},\]]', r'icon: "📌"\1}', full)
        # 만약 icon: "?처럼 물음표만 있으면 이모지로 교체
        if re.search(r'icon:\s*"\?+"\s*[},]', full):
            modified = True
            return re.sub(r'icon:\s*"\?+"', r'icon: "📌"', full)
        return full
    
    # QuickFacts, Timeline 등의 배열 객체에서 검사
    content = re.sub(
        r'\{[^}]*icon:[^}]*\}',
        fix_unclosed_icon,
        content,
        flags=re.DOTALL
    )
    
    # 2. 깨진 이모지/문자 수정
    broken_chars = {
        '— ': "'",
        '— ': "'",
        '— �': '',
        '��': '',
        '??': '',
        ' — re': "'re",
        ' — ve': "'ve",
        ' — s': "'s",
        ' — t': "'t",
        ' — ll': "'ll",
        ' — d': "'d",
    }
    
    for broken, fixed in broken_chars.items():
        if broken in content:
            content = content.replace(broken, fixed)
            modified = True
    
    return content, modified

if __name__ == "__main__":
    fixed_count = 0
    for filename in files_to_check:
        filepath = target_dir / filename
        if not filepath.exists():
            print(f"❌ Not found: {filename}")
            continue
        
        try:
            content = filepath.read_text(encoding='utf-8', errors='ignore')
            new_content, was_modified = fix_jsx_props(content)
            
            if was_modified:
                filepath.write_text(new_content, encoding='utf-8')
                print(f"✅ Fixed: {filename}")
                fixed_count += 1
            else:
                print(f"⏭️  No changes: {filename}")
        except Exception as e:
            print(f"❌ Error in {filename}: {e}")
    
    print(f"\n📊 Fixed {fixed_count}/{len(files_to_check)} files")
