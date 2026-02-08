"""
Fix remaining KRW: abbreviated amounts (30k KRW, 1.2M KRW) and JSX value strings.
Preserve KRW in legitimate currency code contexts.
"""
import re
from pathlib import Path

POSTS_DIR = Path('content/posts')
total_fixes = 0

for filepath in sorted(POSTS_DIR.glob('*.md')):
    content = filepath.read_text(encoding='utf-8')
    original = content
    
    # 1. "Xk KRW" → "₩Xk"  (30k KRW, 150k KRW, 500k KRW)
    content = re.sub(r'(\d[\d,.]*)[kK]\s+KRW', r'₩\1k', content)
    
    # 2. "XM KRW" → "₩XM"  (1.2M KRW, 15M KRW, 100M KRW)
    content = re.sub(r'(\d[\d,.]*)[mM]\s+KRW', r'₩\1M', content)
    
    # 3. ">Xk KRW" → ">₩Xk"  
    content = re.sub(r'>\s*(\d[\d,.]*)[kK]\s+KRW', r'>₩\1k', content)
    content = re.sub(r'>\s*(\d[\d,.]*)[mM]\s+KRW', r'>₩\1M', content)
    
    # 4. "XM - YM KRW" ranges (already as "XM KRW" handled above but for safety)
    content = re.sub(r'(\d[\d,.]*[kKmM])\s*-\s*(\d[\d,.]*[kKmM])\s+KRW', r'₩\1-₩\2', content)
    
    # 5. "~Xk KRW" → "~₩Xk"
    content = re.sub(r'~(\d[\d,.]*)[kK]\s+KRW', r'~₩\1k', content)
    content = re.sub(r'~(\d[\d,.]*)[mM]\s+KRW', r'~₩\1M', content)
    
    # 6. "X,XXX+ KRW" → "₩X,XXX+"
    content = re.sub(r'(\d[\d,]*)\+?\s+KRW', r'₩\1', content)
    
    # 7. "few thousand KRW" → "few thousand ₩" (or "a few thousand won")
    content = re.sub(r'thousand\s+KRW', 'thousand won', content)
    content = re.sub(r'hundred\s+KRW', 'hundred won', content)
    
    # 8. "pay in KRW" → "pay in won (₩)"
    content = re.sub(r'pay in KRW\b', 'pay in won (₩)', content)
    content = re.sub(r'in KRW\b(?!\s*/)', 'in won (₩)', content)
    
    # 9. "KRW figures" → "won figures"
    content = re.sub(r'\bKRW\s+figures', 'won figures', content)
    
    # 10. "the KRW" → "the won"
    content = re.sub(r'the KRW\b', 'the won', content)
    
    # 11. "cash (KRW/USD)" → "cash (₩/USD)"
    content = re.sub(r'\(KRW/', '(₩/', content)
    content = re.sub(r'/KRW\)', '/₩)', content)
    
    # 12. "KRW/kg" → "₩/kg"
    content = re.sub(r'KRW/', '₩/', content)
    
    # 13. "Avg KRW" → "Avg ₩"
    content = re.sub(r'Avg\s+KRW', 'Avg ₩', content)
    
    # 14. "KRW difference/gap" → "won difference/gap"
    content = re.sub(r'\bKRW\s+(difference|gap|amount|value)', r'won \1', content)
    
    # 15. "KRW fluctuating" → "won fluctuating"
    content = re.sub(r'\bKRW\s+(fluctuat)', r'won \1', content)
    
    if content != original:
        old_krw = len(re.findall(r'\bKRW\b', original))
        new_krw = len(re.findall(r'\bKRW\b', content))
        fixes = old_krw - new_krw
        if fixes > 0:
            total_fixes += fixes
        filepath.write_text(content, encoding='utf-8')

print(f"Fixed {total_fixes} more KRW instances")

# Final remaining check
remaining = 0
for filepath in sorted(POSTS_DIR.glob('*.md')):
    content = filepath.read_text(encoding='utf-8')
    for m in re.finditer(r'\bKRW\b', content):
        remaining += 1
        ctx_start = max(0, m.start()-30)
        ctx_end = min(len(content), m.end()+30)
        ctx = content[ctx_start:ctx_end].replace('\n', ' ').strip()
        print(f"  {filepath.name}: ...{ctx}...")

print(f"\nTotal remaining KRW: {remaining}")
