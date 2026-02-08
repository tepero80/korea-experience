"""
Fix remaining KRW patterns that the first pass missed.
Handles: X million KRW, X billion KRW, ranges, standalone (KRW), etc.
Preserves KRW in forex/exchange-rate contexts.
"""
import re
from pathlib import Path

POSTS_DIR = Path('content/posts')
total_fixes = 0

for filepath in sorted(POSTS_DIR.glob('*.md')):
    content = filepath.read_text(encoding='utf-8')
    original = content
    
    # 1. "X million KRW" → "₩X million"
    content = re.sub(r'(\d[\d,.]*)\s*million\s+KRW', r'₩\1 million', content)
    
    # 2. "X billion KRW" → "₩X billion"  
    content = re.sub(r'(\d[\d,.]*)\s*billion\s+KRW', r'₩\1 billion', content)
    
    # 3. Range patterns: "X,XXX - Y,YYY KRW" → "₩X,XXX - ₩Y,YYY"
    content = re.sub(
        r'(\d[\d,]*)\s*-\s*(\d[\d,]*)\s+KRW',
        r'₩\1 - ₩\2',
        content
    )
    content = re.sub(
        r'(\d[\d,]*)\s+to\s+(\d[\d,]*)\s+KRW',
        r'₩\1 to ₩\2',
        content
    )
    
    # 4. "X,XXX KRW" (any remaining standalone)
    content = re.sub(r'(\d[\d,]*(?:\.\d+)?)\s+KRW\b', r'₩\1', content)
    
    # 5. "KRW X,XXX" → "₩X,XXX"
    content = re.sub(r'\bKRW\s*(\d[\d,]*(?:\.\d+)?)', r'₩\1', content)
    
    # 6. "(KRW)" → "(₩)"
    content = re.sub(r'\(KRW\)', '(₩)', content)
    
    # 7. "KRW)" → "₩)" inside parentheses
    content = re.sub(r'KRW\)', '₩)', content)
    
    # 8. Remaining standalone KRW in price contexts (but NOT in forex contexts)
    # Keep "KRW/USD", "the KRW", "KRW exchange" etc.
    # Fix "the 30,000 KRW" type patterns (already handled by #4)
    
    # 9. Fix "Avg KRW/kg" type - these are fine as-is (unit label)
    
    if content != original:
        count = sum(1 for a, b in zip(original, content) if a != b)
        # Count actual KRW removals
        old_krw = len(re.findall(r'\bKRW\b', original))
        new_krw = len(re.findall(r'\bKRW\b', content))
        fixes = old_krw - new_krw
        if fixes > 0:
            total_fixes += fixes
            filepath.write_text(content, encoding='utf-8')

print(f"Fixed {total_fixes} remaining KRW instances across files")

# Verify what's left
remaining = 0
remaining_contexts = []
for filepath in sorted(POSTS_DIR.glob('*.md')):
    content = filepath.read_text(encoding='utf-8')
    for m in re.finditer(r'\bKRW\b', content):
        remaining += 1
        ctx_start = max(0, m.start()-30)
        ctx_end = min(len(content), m.end()+30)
        ctx = content[ctx_start:ctx_end].replace('\n', ' ').strip()
        remaining_contexts.append((filepath.name, ctx))

print(f"\nRemaining KRW instances: {remaining}")
for fname, ctx in remaining_contexts[:20]:
    print(f"  {fname}: ...{ctx}...")
