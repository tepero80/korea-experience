"""
Comprehensive quality audit of all generated posts in generation-progress.json
Checks: encoding, currency, frontmatter, MDX components, internal links, content structure
"""
import os, re, json, sys
from collections import Counter, defaultdict

POSTS_DIR = 'content/posts'

# Load generation-progress.json to get list of generated files
with open('scripts/generation-progress.json', 'r', encoding='utf-8') as f:
    progress = json.load(f)

# Map progress keys to actual filenames
def title_to_slug(title):
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug).strip('-')
    return slug

generated_titles = {}
for key, val in progress.items():
    if val:
        parts = key.split(':', 1)
        if len(parts) == 2:
            cat, title = parts
            generated_titles[title_to_slug(title)] = {'category': cat, 'title': title}

# Find matching files
all_md_files = [f for f in os.listdir(POSTS_DIR) if f.endswith('.md')]
generated_files = []
for f in all_md_files:
    slug = f.replace('.md', '')
    if slug in generated_titles:
        generated_files.append(f)

print(f"=== AUDIT SCOPE ===")
print(f"Progress entries: {len(progress)}")
print(f"MD files in posts/: {len(all_md_files)}")
print(f"Matched generated files: {len(generated_files)}")
print()

# ============================================================
# AUDIT CHECKS
# ============================================================

issues = defaultdict(list)  # category -> list of (file, detail)
stats = Counter()

for filename in sorted(generated_files):
    filepath = os.path.join(POSTS_DIR, filename)
    
    # Read raw bytes for encoding check
    with open(filepath, 'rb') as f:
        raw = f.read()
    
    # Read as text
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError as e:
        issues['ENCODING_FATAL'].append((filename, f"Cannot decode as UTF-8: {e}"))
        continue
    
    lines = content.split('\n')
    stats['total_files'] += 1
    
    # ----------------------------------------------------------
    # 1. ENCODING CHECKS
    # ----------------------------------------------------------
    
    # 1a. U+FFFD replacement characters
    fffd_count = content.count('\ufffd')
    if fffd_count > 0:
        issues['ENCODING_FFFD'].append((filename, f"{fffd_count} replacement characters (U+FFFD)"))
    
    # 1b. NULL bytes
    null_count = raw.count(b'\x00')
    if null_count > 0:
        issues['ENCODING_NULL'].append((filename, f"{null_count} NULL bytes"))
    
    # 1c. Non-UTF8 high bytes (check for stray bytes > 0x7F that don't form valid UTF-8)
    # Already caught by UnicodeDecodeError above
    
    # 1d. Mojibake patterns (common corrupted sequences)
    mojibake_patterns = [r'Ã©', r'Ã¡', r'Ã³', r'Ã¼', r'Ã¶', r'â€™', r'â€"', r'â€œ', r'â€\x9d']
    for pat in mojibake_patterns:
        if pat in content:
            issues['ENCODING_MOJIBAKE'].append((filename, f"Mojibake pattern: {pat}"))
            break
    
    # ----------------------------------------------------------
    # 2. CURRENCY / PRICE CHECKS
    # ----------------------------------------------------------
    
    # 2a. Truncated ₩ prices: comma-starting numbers before ($X)
    truncated_won = re.findall(r'(?<![₩\w]),(\d{3})\s*\(\$', content)
    if truncated_won:
        issues['CURRENCY_TRUNCATED'].append((filename, f"{len(truncated_won)} comma-starting prices (e.g. ,{truncated_won[0]})"))
    
    # 2b. Missing ₩: bare numbers like "0,000 ($X)" without ₩
    bare_prices = re.findall(r'(?<![₩\d\w])(\d{1,2},\d{3}(?:,\d{3})*)\s*\(\$[\d.,]+', content)
    # Filter: check if ₩ is within 3 chars before
    real_bare = []
    for m in re.finditer(r'(?<![₩\d\w])(\d{1,2},\d{3}(?:,\d{3})*)\s*\(\$[\d.,]+', content):
        pre = content[max(0, m.start()-3):m.start()]
        if '₩' not in pre and 'KRW' not in content[max(0,m.start()-10):m.start()]:
            real_bare.append(m.group(1))
    if real_bare:
        issues['CURRENCY_NO_WON'].append((filename, f"{len(real_bare)} prices without ₩ symbol (e.g. {real_bare[0]})"))
    
    # 2c. Wrong currency format: $X,XXX when should be ₩X,XXX
    # This checks for dollar amounts that seem too high for USD context
    
    # ----------------------------------------------------------
    # 3. FRONTMATTER CHECKS
    # ----------------------------------------------------------
    
    # 3a. Valid frontmatter exists
    if not content.startswith('---'):
        issues['FRONTMATTER_MISSING'].append((filename, "No frontmatter delimiter"))
        continue
    
    fm_end = content.find('---', 3)
    if fm_end == -1:
        issues['FRONTMATTER_MALFORMED'].append((filename, "No closing --- delimiter"))
        continue
    
    frontmatter = content[3:fm_end].strip()
    body = content[fm_end+3:].strip()
    
    # 3b. Required fields
    required_fields = ['title', 'date', 'excerpt', 'category', 'author']
    for field in required_fields:
        if not re.search(rf'^{field}:', frontmatter, re.MULTILINE):
            issues['FRONTMATTER_FIELD_MISSING'].append((filename, f"Missing: {field}"))
    
    # 3c. Date format
    date_match = re.search(r'^date:\s*(.+)', frontmatter, re.MULTILINE)
    if date_match:
        date_val = date_match.group(1).strip()
        if not re.match(r'^\d{4}-\d{2}-\d{2}$', date_val):
            issues['FRONTMATTER_DATE_FORMAT'].append((filename, f"Bad date: {date_val}"))
    
    # 3d. JSX/HTML leaked into frontmatter
    if '<' in frontmatter or '{' in frontmatter:
        issues['FRONTMATTER_JSX_LEAK'].append((filename, "JSX or HTML in frontmatter"))
    
    # ----------------------------------------------------------
    # 4. MDX COMPONENT CHECKS
    # ----------------------------------------------------------
    
    # 4a. Unclosed JSX tags
    component_names = ['KeyTakeaways', 'QuickFacts', 'FAQAccordion', 'Timeline', 'StepGuide', 
                       'ProsCons', 'PriceTable', 'ComparisonTable', 'InfoBox', 'ExpertTip',
                       'StatCard', 'LocationCard']
    
    for comp in component_names:
        opens = len(re.findall(rf'<{comp}\b', body))
        closes = len(re.findall(rf'</{comp}>', body))
        self_closes = len(re.findall(rf'<{comp}\b[^>]*/>', body))
        
        effective_opens = opens - self_closes
        if effective_opens != closes:
            issues['MDX_UNCLOSED'].append((filename, f"<{comp}> open={opens} selfClose={self_closes} close={closes}"))
    
    # 4b. Broken JSX props (unescaped quotes in strings)
    broken_props = re.findall(r'="[^"]*"[^"]*"', body)
    if broken_props:
        issues['MDX_BROKEN_PROPS'].append((filename, f"{len(broken_props)} possibly broken prop strings"))
    
    # 4c. Missing KeyTakeaways
    if '<KeyTakeaways' not in body:
        issues['MDX_NO_KEYTAKEAWAYS'].append((filename, "Missing KeyTakeaways component"))
    
    # 4d. Missing FAQAccordion
    if '<FAQAccordion' not in body:
        issues['MDX_NO_FAQ'].append((filename, "Missing FAQAccordion component"))
    
    # ----------------------------------------------------------
    # 5. INTERNAL LINKS CHECK
    # ----------------------------------------------------------
    
    internal_links = re.findall(r'\[([^\]]+)\]\(/blog/([^)]+)\)', body)
    if not internal_links:
        issues['NO_INTERNAL_LINKS'].append((filename, "Zero internal links"))
    else:
        stats['total_internal_links'] += len(internal_links)
        # Check for dead links (target file doesn't exist)
        for text, slug in internal_links:
            target_file = slug.rstrip('/') + '.md'
            if not os.path.exists(os.path.join(POSTS_DIR, target_file)):
                issues['DEAD_INTERNAL_LINK'].append((filename, f"Dead link: /blog/{slug}"))
    
    # ----------------------------------------------------------
    # 6. CONTENT STRUCTURE CHECKS
    # ----------------------------------------------------------
    
    # 6a. Word count (rough, for body only)
    word_count = len(body.split())
    if word_count < 500:
        issues['CONTENT_TOO_SHORT'].append((filename, f"{word_count} words"))
    stats['total_words'] += word_count
    
    # 6b. H2 headings count
    h2_count = len(re.findall(r'^## ', body, re.MULTILINE))
    if h2_count < 2:
        issues['CONTENT_FEW_HEADINGS'].append((filename, f"Only {h2_count} H2 headings"))
    
    # 6c. Sources section
    if '## Sources' not in body and '## 출처' not in body and '**Sources' not in body:
        issues['NO_SOURCES'].append((filename, "No Sources section"))
    
    # ----------------------------------------------------------
    # 7. MISCELLANEOUS CHECKS
    # ----------------------------------------------------------
    
    # 7a. Placeholder text
    placeholders = ['TODO', 'FIXME', 'TBD', 'Lorem ipsum', 'placeholder', '[INSERT', 'XXXX']
    for ph in placeholders:
        if ph in content:
            issues['PLACEHOLDER_TEXT'].append((filename, f"Found: {ph}"))
            break
    
    # 7b. Repeated paragraphs (duplicate content)
    paragraphs = [p.strip() for p in body.split('\n\n') if len(p.strip()) > 100]
    seen = set()
    for p in paragraphs:
        if p in seen:
            issues['DUPLICATE_PARAGRAPH'].append((filename, f"Duplicate paragraph: {p[:80]}..."))
            break
        seen.add(p)
    
    # 7c. Very long lines (possible formatting issues)
    for i, line in enumerate(lines):
        if len(line) > 2000 and not line.strip().startswith('<'):
            issues['VERY_LONG_LINE'].append((filename, f"Line {i+1}: {len(line)} chars"))
            break
    
    # 7d. Empty file or nearly empty
    if len(content.strip()) < 100:
        issues['EMPTY_FILE'].append((filename, f"Only {len(content.strip())} chars"))
    
    # 7e. Korean text in body (should be English-only site)
    korean_chars = re.findall(r'[\uac00-\ud7af]', body)
    # Korean is expected in nameKo props and some food names, so only flag if excessive
    korean_outside_props = re.sub(r'nameKo="[^"]*"', '', body)
    korean_outside_props = re.sub(r'[\uac00-\ud7af]{1,10}', '', korean_outside_props, count=50)
    remaining_korean = len(re.findall(r'[\uac00-\ud7af]', korean_outside_props))
    # Don't flag - Korean food/location names are expected
    
    # 7f. Broken markdown links
    broken_md_links = re.findall(r'\[[^\]]*\]\([^)]*\s[^)]*\)', body)
    if broken_md_links:
        issues['BROKEN_MD_LINK'].append((filename, f"{len(broken_md_links)} links with spaces in URL"))

# ============================================================
# REPORT
# ============================================================

print("=" * 70)
print("COMPREHENSIVE QUALITY AUDIT REPORT")
print("=" * 70)
print(f"\nFiles audited: {stats['total_files']}")
print(f"Total words: {stats['total_words']:,}")
print(f"Avg words/file: {stats['total_words'] // max(1, stats['total_files']):,}")
print(f"Total internal links: {stats.get('total_internal_links', 0):,}")
print()

# Sort issues by severity
severity_order = [
    'ENCODING_FATAL', 'ENCODING_FFFD', 'ENCODING_NULL', 'ENCODING_MOJIBAKE',
    'CURRENCY_TRUNCATED', 'CURRENCY_NO_WON',
    'FRONTMATTER_MISSING', 'FRONTMATTER_MALFORMED', 'FRONTMATTER_FIELD_MISSING',
    'FRONTMATTER_DATE_FORMAT', 'FRONTMATTER_JSX_LEAK',
    'MDX_UNCLOSED', 'MDX_BROKEN_PROPS', 'MDX_NO_KEYTAKEAWAYS', 'MDX_NO_FAQ',
    'NO_INTERNAL_LINKS', 'DEAD_INTERNAL_LINK',
    'CONTENT_TOO_SHORT', 'CONTENT_FEW_HEADINGS', 'NO_SOURCES',
    'PLACEHOLDER_TEXT', 'DUPLICATE_PARAGRAPH', 'VERY_LONG_LINE',
    'EMPTY_FILE', 'BROKEN_MD_LINK'
]

critical_count = 0
warning_count = 0
info_count = 0

critical_cats = {'ENCODING_FATAL', 'ENCODING_FFFD', 'ENCODING_NULL', 'ENCODING_MOJIBAKE',
                 'CURRENCY_TRUNCATED', 'FRONTMATTER_MISSING', 'FRONTMATTER_MALFORMED',
                 'MDX_UNCLOSED', 'EMPTY_FILE'}
warning_cats = {'CURRENCY_NO_WON', 'FRONTMATTER_FIELD_MISSING', 'FRONTMATTER_DATE_FORMAT',
                'FRONTMATTER_JSX_LEAK', 'MDX_BROKEN_PROPS', 'MDX_NO_KEYTAKEAWAYS',
                'MDX_NO_FAQ', 'NO_INTERNAL_LINKS', 'DEAD_INTERNAL_LINK', 'CONTENT_TOO_SHORT',
                'PLACEHOLDER_TEXT', 'DUPLICATE_PARAGRAPH', 'BROKEN_MD_LINK'}

for cat in severity_order:
    if cat in issues and issues[cat]:
        count = len(issues[cat])
        if cat in critical_cats:
            level = "🔴 CRITICAL"
            critical_count += count
        elif cat in warning_cats:
            level = "🟡 WARNING"
            warning_count += count
        else:
            level = "🔵 INFO"
            info_count += count
        
        print(f"\n{level} [{cat}] — {count} files")
        print("-" * 50)
        for fname, detail in issues[cat][:10]:  # Show max 10
            print(f"  {fname}")
            print(f"    → {detail}")
        if count > 10:
            print(f"  ... and {count - 10} more")

# Categories with no issues
no_issue_cats = [cat for cat in severity_order if cat not in issues or not issues[cat]]

print(f"\n{'=' * 70}")
print(f"SUMMARY")
print(f"{'=' * 70}")
print(f"🔴 Critical issues: {critical_count}")
print(f"🟡 Warnings: {warning_count}")
print(f"🔵 Info: {info_count}")
print(f"✅ Clean categories: {len(no_issue_cats)}")
print()
print("Clean categories (no issues found):")
for cat in no_issue_cats:
    print(f"  ✅ {cat}")
