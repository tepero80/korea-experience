#!/usr/bin/env python3
"""Second pass fix for remaining issues after initial batch fix."""

import re
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / "content" / "posts"

fixes_applied = 0

def fix_file(filepath, fix_func):
    global fixes_applied
    content = filepath.read_text(encoding='utf-8')
    new_content = fix_func(content)
    if new_content != content:
        filepath.write_text(new_content, encoding='utf-8')
        fixes_applied += 1
        print(f"  Fixed: {filepath.name}")
        return True
    return False

# 1. Fix KRW in frontmatter excerpts (line 4 area)
print("=== Fixing KRW in frontmatter ===")
krw_in_fm_files = [
    'k-beauty-ingredients-deep-dive-mugwort-propolis-and-heartleaf-2026.md',
    'korean-hair-care-shampoo-scalp-treatments.md',
    'korean-moisturizers-cream-vs-gel-formulas.md',
    'korean-sheet-mask-comparison-brands-and-prices.md',
    'korean-stationery-culture-cute-school-supplies.md',
    'olive-young-shopping-guide-must-buy-k-beauty-products.md',
    'tax-refund-for-tourists-how-to-claim.md',
    'bicycle-rental-systems-seoul-busan-jeju.md',
]

for fname in krw_in_fm_files:
    fp = CONTENT_DIR / fname
    if fp.exists():
        def fix_krw_in_fm(content):
            # Fix KRW in the entire content including frontmatter
            return re.sub(r'(\d[\d,]+)\s*KRW\b', r'₩\1', content)
        fix_file(fp, fix_krw_in_fm)

# 2. Fix too-long titles
print("\n=== Fixing long titles ===")
long_title_files = {
    'lotte-department-store-flagship-locations.md': 'Lotte Department Store Seoul: Complete Flagship Guide 2026',
    'shinsegae-duty-free-best-deals-for-tourists.md': 'Shinsegae Duty Free: Best Deals for Tourists 2026',
    'adventure-travel-rock-climbing-paragliding-and-rafting.md': 'Adventure Travel Korea: Paragliding, Rafting & More',
    'budget-backpacking-korea-hostels-street-food-and-free-activities.md': 'Budget Backpacking Korea: Hostels & Street Food Guide',
    'cultural-immersion-programs-language-and-craft-workshops.md': 'Korea Cultural Immersion: Language & Craft Workshops',
}

for fname, new_title in long_title_files.items():
    fp = CONTENT_DIR / fname
    if fp.exists():
        content = fp.read_text(encoding='utf-8')
        # Find and replace title in frontmatter
        old_title_match = re.search(r'^title:\s*["\'](.+?)["\']', content, re.MULTILINE)
        if not old_title_match:
            old_title_match = re.search(r'^title:\s*(.+)$', content, re.MULTILINE)
        if old_title_match:
            old_line = old_title_match.group(0)
            # Preserve quote style
            if old_line.startswith('title: "'):
                new_line = f'title: "{new_title}"'
            elif old_line.startswith("title: '"):
                new_line = f"title: '{new_title}'"
            else:
                new_line = f'title: "{new_title}"'
            
            if old_line != new_line:
                content = content.replace(old_line, new_line, 1)
                fp.write_text(content, encoding='utf-8')
                fixes_applied += 1
                print(f"  Fixed title: {fname}")
                print(f"    Old: {old_title_match.group(1)[:60]}...")
                print(f"    New: {new_title}")

# 3. Fix too-long excerpt
print("\n=== Fixing long excerpt ===")
fp = CONTENT_DIR / 'top-30-korean-skincare-products-worth-buying-2026.md'
if fp.exists():
    content = fp.read_text(encoding='utf-8')
    excerpt_match = re.search(r'^excerpt:\s*["\'](.+?)["\']', content, re.MULTILINE)
    if not excerpt_match:
        excerpt_match = re.search(r'^excerpt:\s*(.+)$', content, re.MULTILINE)
    if excerpt_match and len(excerpt_match.group(1)) > 160:
        old_excerpt = excerpt_match.group(1)
        # Truncate to ~155 chars at word boundary
        new_excerpt = old_excerpt[:155]
        last_space = new_excerpt.rfind(' ')
        if last_space > 120:
            new_excerpt = new_excerpt[:last_space]
        old_line = excerpt_match.group(0)
        if '"' in old_line[:10]:
            new_line = f'excerpt: "{new_excerpt}"'
        else:
            new_line = f"excerpt: '{new_excerpt}'"
        content = content.replace(old_line, new_line, 1)
        fp.write_text(content, encoding='utf-8')
        fixes_applied += 1
        print(f"  Fixed excerpt in top-30-korean-skincare-products-worth-buying-2026.md")
        print(f"    Truncated from {len(old_excerpt)} to {len(new_excerpt)} chars")

# 4. Fix remaining MDX: QuickFacts in kiosk guide
print("\n=== Fixing remaining MDX syntax ===")
fp = CONTENT_DIR / 'foreign-friendly-kiosk-survival-guide-what-to-do-when-your-overseas-credit-card-is-rejected.md'
if fp.exists():
    content = fp.read_text(encoding='utf-8')
    # Count QuickFacts opens and closes
    opens = len(re.findall(r'<QuickFacts[\s>]', content))
    closes = len(re.findall(r'</QuickFacts>', content))
    self_closing = len(re.findall(r'<QuickFacts[^>]*/>', content))
    effective = opens - self_closing
    missing = effective - closes
    
    if missing > 0:
        # Find the opening QuickFacts that isn't self-closing
        # Look for <QuickFacts ... > (not />)
        pattern = r'(<QuickFacts\s[^/]*?>)'
        matches = list(re.finditer(pattern, content))
        
        for match in matches:
            # Check if this opening has a corresponding close
            after = content[match.end():]
            next_close = after.find('</QuickFacts>')
            next_open = re.search(r'<QuickFacts[\s>]', after)
            
            if next_close == -1 or (next_open and next_open.start() < next_close):
                # This open tag has no close - find where to insert
                next_heading = re.search(r'\n##\s', after)
                if next_heading:
                    insert_pos = match.end() + next_heading.start()
                    content = content[:insert_pos] + '\n</QuickFacts>\n' + content[insert_pos:]
                else:
                    content = content.rstrip() + '\n\n</QuickFacts>\n'
                break
        
        fp.write_text(content, encoding='utf-8')
        fixes_applied += 1
        print(f"  Fixed QuickFacts in kiosk guide")

# 5. Fix lone ₩ symbols (₩ with no number)
print("\n=== Fixing lone ₩ symbols ===")
lone_won_files = [
    'hyundai-department-store-luxury-shopping.md',
    'k-fandom-economy-where-to-find-limited-edition-goods-without-a-fan-club-membership.md',
    'foreign-friendly-kiosk-survival-guide-what-to-do-when-your-overseas-credit-card-is-rejected.md',
]

for fname in lone_won_files:
    fp = CONTENT_DIR / fname
    if fp.exists():
        content = fp.read_text(encoding='utf-8')
        original = content
        # Fix ₩ followed by space then number (missing direct connection)
        content = re.sub(r'₩\s+(\d)', r'₩\1', content)
        # Fix standalone ₩ that should be "KRW" or removed
        # Only fix if ₩ is truly alone (not followed by any digit nearby)
        if content != original:
            fp.write_text(content, encoding='utf-8')
            fixes_applied += 1
            print(f"  Fixed lone ₩ in {fname}")

print(f"\n=== Total fixes applied: {fixes_applied} ===")
