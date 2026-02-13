"""visiting-cheongwadae 파일의 인코딩 문제 수정"""
from pathlib import Path

filepath = Path(r"c:\kc\korea-experience\content\deep-dive\visiting-cheongwadae-blue-house-2026.md")

content = filepath.read_text(encoding='utf-8', errors='ignore')

# 잘못된 문자들 수정
replacements = [
    (' — re', "'re"),
    (' — ve', "'ve"),
    (' — s', "'s"),
    (' — ', "'"),
    ('— ', "'"),
    ('— ', "'"),
    ('— �', ""),
    ('��', ""),
    ('??', ""),
    ('Don — t', "Don't"),
    ('isn — t', "isn't"),
    ('can — t', "can't"),
    ('won — t', "won't"),
    ('doesn — t', "doesn't"),
]

for old, new in replacements:
    content = content.replace(old, new)

filepath.write_text(content, encoding='utf-8')
print(f"✅ Fixed encoding issues in {filepath.name}")
