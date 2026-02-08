import re
from pathlib import Path

total = 0
for f in sorted(Path('content/posts').glob('*.md')):
    c = f.read_text(encoding='utf-8')
    o = c
    if 'cryptocurrency' in f.stem:
        continue
    
    c = re.sub(r'(\*{0,2})(\d[\d,.]*)\s*Million\s+KRW(\*{0,2})', r'\1₩\2 Million\3', c)
    c = re.sub(r'(\*{0,2})(\d[\d,.]*)\s*Billion\s+KRW(\*{0,2})', r'\1₩\2 Billion\3', c)
    c = re.sub(r'millions of KRW', 'millions of won', c)
    c = re.sub(r'Send KRW', 'Send won (₩)', c)
    c = re.sub(r'[Tt]ransfer KRW', 'Transfer won (₩)', c)
    c = re.sub(r'choose KRW', 'choose won (₩)', c)
    c = re.sub(r'investing KRW', 'investing won', c)
    c = re.sub(r'\(KRW\s', '(₩ ', c)
    c = re.sub(r'for KRW pairs', 'for won pairs', c)
    c = re.sub(r'Avg\.\s*KRW', 'Avg. ₩', c)
    c = re.sub(r'them to KRW', 'them to won', c)
    c = re.sub(r'Cost\s*\(KRW', 'Cost (₩', c)
    c = c.replace("'KRW'", "'₩'")
    c = re.sub(r'(\d[\d,.]*)\s*Million KRW\s+cash', r'₩\1 Million cash', c)
    c = re.sub(r'(\d[\d,.]*)\s*Million KRW\s+Rule', r'₩\1 Million Rule', c)
    
    if c != o:
        diff = len(re.findall(r'\bKRW\b', o)) - len(re.findall(r'\bKRW\b', c))
        total += max(0, diff)
        f.write_text(c, encoding='utf-8')

rem = 0
for f in Path('content/posts').glob('*.md'):
    rem += len(re.findall(r'\bKRW\b', f.read_text(encoding='utf-8')))
print(f'Fixed {total} more. Remaining: {rem}')
