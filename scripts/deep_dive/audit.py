"""
Deep dive into specific issues found in audit
"""
import os, re, json

POSTS_DIR = 'content/posts'

# ============================================================
# 1. MDX_UNCLOSED: 22 files - Check actual severity
# ============================================================
print("=" * 70)
print("1. MDX UNCLOSED TAGS - DEEP ANALYSIS")
print("=" * 70)

unclosed_files = [
    'bts-tour-in-seoul-army-must-visit-locations-2026.md',
    'buying-a-used-car-in-korea-k-car-vs-encar-guide-2026.md',
    'collecting-k-pop-photocards-the-global-market-and-trading-etiquette-2026.md',
    'how-to-get-k-pop-concert-tickets-ticketing-guide.md',
    'k-beauty-shopping-guide-seoul-2026.md',
    'k-drama-cafe-culture-scene-filming-locations.md',
    'k-pop-dance-classes-for-beginners-cover-dance-studios.md',
    'k-pop-fan-meeting-events-how-to-participate.md',
    'k-pop-random-play-dance-events-in-seoul.md',
    'korean-driving-license-conversion-process.md',
]

component_names = ['KeyTakeaways', 'QuickFacts', 'FAQAccordion', 'Timeline', 'StepGuide', 
                   'ProsCons', 'PriceTable', 'ComparisonTable', 'InfoBox', 'ExpertTip',
                   'StatCard', 'LocationCard']

# Actually these might be self-closing with /> pattern
# Let's check more carefully
all_unclosed = []
for f in os.listdir(POSTS_DIR):
    if not f.endswith('.md'): continue
    path = os.path.join(POSTS_DIR, f)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    for comp in component_names:
        # Find all opening tags
        opens = list(re.finditer(rf'<{comp}\b', content))
        closes = list(re.finditer(rf'</{comp}>', content))
        self_closes = list(re.finditer(rf'<{comp}\b[^>]*/>', content))
        
        # Check if any opening is truly unclosed
        effective = len(opens) - len(self_closes) - len(closes)
        if effective != 0:
            all_unclosed.append((f, comp, len(opens), len(self_closes), len(closes)))

print(f"\nTotal unclosed component instances: {len(all_unclosed)}")
for fname, comp, opens, sc, closes in all_unclosed:
    print(f"\n  📄 {fname}")
    print(f"     <{comp}> opens={opens} selfClose={sc} close={closes}")
    # Show the actual tag context
    path = os.path.join(POSTS_DIR, fname)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    for m in re.finditer(rf'<{comp}\b', content):
        # Get ~200 chars after the tag opening
        snippet = content[m.start():m.start()+300].replace('\n', '\\n')
        # Check if this specific tag is self-closing or has a matching close
        tag_region = content[m.start():m.start()+500]
        if '/>' in tag_region[:tag_region.find('>')+2] if '>' in tag_region else False:
            tag_type = "SELF-CLOSING ✅"
        elif f'</{comp}>' in content[m.start():m.start()+2000]:
            tag_type = "HAS CLOSE TAG ✅"
        else:
            tag_type = "⚠️ TRULY UNCLOSED"
        print(f"     [{tag_type}] ...{snippet[:150]}...")

# ============================================================
# 2. MDX_BROKEN_PROPS: Check if false positive
# ============================================================
print("\n" + "=" * 70)
print("2. MDX BROKEN PROPS - FALSE POSITIVE CHECK")
print("=" * 70)

# The regex ="[^"]*"[^"]*" catches normal JSX like description="text" followed by another prop="text"
# This is almost certainly false positive. Let's verify with a sample
sample_files = ['50-must-try-korean-foods-complete-guide-2026.md', 'airbnb-vs-recovery-hotels-for-medical-tourists.md']
for fname in sample_files:
    path = os.path.join(POSTS_DIR, fname)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    matches = re.findall(r'="[^"]*"[^"]*"', content)
    print(f"\n  📄 {fname}: {len(matches)} matches")
    for m in matches[:3]:
        print(f"     {m[:100]}")

# ============================================================  
# 3. DEAD INTERNAL LINKS - Full list
# ============================================================
print("\n" + "=" * 70)
print("3. DEAD INTERNAL LINKS - FULL LIST")
print("=" * 70)

dead_targets = set()
dead_details = []
for f in os.listdir(POSTS_DIR):
    if not f.endswith('.md'): continue
    path = os.path.join(POSTS_DIR, f)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    for text, slug in re.findall(r'\[([^\]]+)\]\(/blog/([^)]+)\)', content):
        target_file = slug.rstrip('/') + '.md'
        if not os.path.exists(os.path.join(POSTS_DIR, target_file)):
            dead_targets.add(slug)
            dead_details.append((f, slug))

print(f"\nUnique dead link targets: {len(dead_targets)}")
for target in sorted(dead_targets):
    referencing = [d[0] for d in dead_details if d[1] == target]
    print(f"\n  ❌ /blog/{target}")
    print(f"     Referenced by: {', '.join(referencing[:5])}")

# ============================================================
# 4. H2 HEADINGS = 0 CHECK (3 files)
# ============================================================
print("\n" + "=" * 70)
print("4. FILES WITH 0 H2 HEADINGS")
print("=" * 70)

zero_h2_files = ['best-korean-bbq-restaurants-seoul-gangnam-edition-2026.md',
                 'finding-english-speaking-doctors-in-seoul.md',
                 'hanbok-rental-complete-guide-styles-and-pricing.md']

for fname in zero_h2_files:
    path = os.path.join(POSTS_DIR, fname)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    # Check what heading levels exist
    h1 = len(re.findall(r'^# ', content, re.MULTILINE))
    h2 = len(re.findall(r'^## ', content, re.MULTILINE))
    h3 = len(re.findall(r'^### ', content, re.MULTILINE))
    
    # Check if headings are inside JSX props
    jsx_headings = len(re.findall(r'title[=:]\s*"[^"]*"', content))
    
    print(f"\n  📄 {fname}")
    print(f"     H1={h1}, H2={h2}, H3={h3}, JSX titles={jsx_headings}")
    print(f"     Word count: {len(content.split())}")
    # Show first 500 chars of body
    fm_end = content.find('---', 3)
    body = content[fm_end+3:fm_end+800] if fm_end > 0 else content[:800]
    print(f"     Preview: {body[:300].replace(chr(10), ' ')[:200]}...")

# ============================================================
# 5. SOURCES SECTION - Verify in new (2/7) files
# ============================================================
print("\n" + "=" * 70)
print("5. SOURCES SECTION CHECK - NEW FILES (2/7)")
print("=" * 70)

import datetime
new_with_sources = 0
new_without_sources = 0
new_total = 0

for f in os.listdir(POSTS_DIR):
    if not f.endswith('.md'): continue
    path = os.path.join(POSTS_DIR, f)
    mtime = os.path.getmtime(path)
    dt = datetime.datetime.fromtimestamp(mtime)
    if dt.date() < datetime.date(2026, 2, 7):
        continue
    
    new_total += 1
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    if '## Sources' in content or '**Sources' in content or 'Sources &' in content:
        new_with_sources += 1
    else:
        new_without_sources += 1

print(f"\n  New files (2/7): {new_total}")
print(f"  With Sources: {new_with_sources}")
print(f"  Without Sources: {new_without_sources}")

# Check old (progress) files for sources
old_with = 0
old_without = 0
with open('scripts/generation-progress.json', 'r', encoding='utf-8') as f:
    progress = json.load(f)

def title_to_slug(title):
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug).strip('-')
    return slug

for key in progress:
    parts = key.split(':', 1)
    if len(parts) == 2:
        slug = title_to_slug(parts[1])
        path = os.path.join(POSTS_DIR, slug + '.md')
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as fh:
                content = fh.read()
            if '## Sources' in content or '**Sources' in content:
                old_with += 1
            else:
                old_without += 1

print(f"\n  Old files (progress.json): {len(progress)}")
print(f"  With Sources: {old_with}")
print(f"  Without Sources: {old_without}")
