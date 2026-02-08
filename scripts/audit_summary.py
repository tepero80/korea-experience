"""
Summarize audit results by issue type.
"""
import re, json, os
from pathlib import Path
from collections import defaultdict, Counter

POSTS_DIR = Path('content/posts')
PROGRESS = json.load(open('scripts/generation-progress.json', 'r', encoding='utf-8'))

def title_to_slug(title):
    slug = title.lower().strip()
    slug = re.sub(r"[''']", "", slug)
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug

expected_slugs = set()
for key in PROGRESS:
    title = key.split(':', 1)[1] if ':' in key else key
    expected_slugs.add(title_to_slug(title))

issue_type_counter = Counter()
issue_type_files = defaultdict(list)
missing_tags_files = []
missing_readtime_files = []
krw_files = []

for slug in sorted(expected_slugs):
    candidates = list(POSTS_DIR.glob(f'{slug}*.md'))
    if not candidates:
        slug_parts = slug.split('-')[:5]
        partial = '-'.join(slug_parts)
        candidates = [f for f in POSTS_DIR.glob('*.md') if partial in f.stem]
    if not candidates:
        continue
    
    filepath = candidates[0]
    try:
        content = filepath.read_text(encoding='utf-8')
    except:
        continue
    
    fm_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not fm_match:
        issue_type_counter['no_frontmatter'] += 1
        continue
    
    fm = fm_match.group(1)
    
    # Check tags
    if not re.search(r'^tags:', fm, re.MULTILINE):
        missing_tags_files.append(filepath.name)
    
    # Check readTime
    if not re.search(r'^readTime:', fm, re.MULTILINE):
        missing_readtime_files.append(filepath.name)
    
    # Count KRW occurrences
    krw_count = len(re.findall(r'\bKRW\b', content))
    if krw_count > 0:
        krw_files.append((filepath.name, krw_count))
    
    # Check for outdated years as current
    body_match = re.search(r'^---\n.*?\n---\n(.*)$', content, re.DOTALL)
    if body_match:
        body = body_match.group(1)
        for m in re.finditer(r'\b20(?:19|20|21|22)\b', body):
            ctx_start = max(0, m.start() - 60)
            ctx_end = min(len(body), m.end() + 60)
            context = body[ctx_start:ctx_end]
            if re.search(r'(?:currently|now|this year|as of) ?' + re.escape(m.group()), context, re.IGNORECASE):
                issue_type_counter['outdated_year_current'] += 1
                issue_type_files['outdated_year_current'].append(filepath.name)
    
    # Check fake phones
    for m in re.finditer(r'(?<!\d)(\d{2,3})-(\d{3,4})-(\d{4})(?!\d)', content):
        area = m.group(1)
        valid_areas = ['02', '031', '032', '033', '041', '042', '043', '044', 
                       '051', '052', '053', '054', '055', '061', '062', '063', '064',
                       '010', '011', '016', '017', '018', '019', '070', '080']
        if area not in valid_areas and not area.startswith('15') and not area.startswith('16') and not area.startswith('18'):
            issue_type_counter['invalid_phone'] += 1
            issue_type_files['invalid_phone'].append(f"{filepath.name}: {m.group()}")


print("=" * 70)
print("AUDIT SUMMARY BY ISSUE TYPE")
print("=" * 70)

print(f"\n1. Missing 'tags' in frontmatter: {len(missing_tags_files)} files")
if missing_tags_files:
    for f in missing_tags_files[:10]:
        print(f"   - {f}")
    if len(missing_tags_files) > 10:
        print(f"   ... and {len(missing_tags_files)-10} more")

print(f"\n2. Missing 'readTime' in frontmatter: {len(missing_readtime_files)} files")
if missing_readtime_files:
    for f in missing_readtime_files[:10]:
        print(f"   - {f}")
    if len(missing_readtime_files) > 10:
        print(f"   ... and {len(missing_readtime_files)-10} more")

print(f"\n3. KRW instead of won symbol: {len(krw_files)} files ({sum(c for _,c in krw_files)} total occurrences)")
if krw_files:
    for f, c in sorted(krw_files, key=lambda x: -x[1])[:10]:
        print(f"   - {f}: {c} occurrences")
    if len(krw_files) > 10:
        print(f"   ... and {len(krw_files)-10} more files")

print(f"\n4. Invalid phone numbers: {issue_type_counter['invalid_phone']}")
if 'invalid_phone' in issue_type_files:
    for item in issue_type_files['invalid_phone'][:10]:
        print(f"   - {item}")

print(f"\n5. Outdated year used as current: {issue_type_counter['outdated_year_current']}")
if 'outdated_year_current' in issue_type_files:
    for item in issue_type_files['outdated_year_current'][:10]:
        print(f"   - {item}")

# Now do the IMPORTANT checks - content-level issues
print(f"\n{'='*70}")
print("CONTENT-LEVEL SPOT CHECKS")
print("="*70)

# Check for suspicious $ amounts (non-Korean context)
suspicious_dollars = []
for slug in sorted(expected_slugs):
    candidates = list(POSTS_DIR.glob(f'{slug}*.md'))
    if not candidates:
        slug_parts = slug.split('-')[:5]
        partial = '-'.join(slug_parts)
        candidates = [f for f in POSTS_DIR.glob('*.md') if partial in f.stem]
    if not candidates:
        continue
    filepath = candidates[0]
    try:
        content = filepath.read_text(encoding='utf-8')
    except:
        continue
    
    body_match = re.search(r'^---\n.*?\n---\n(.*)$', content, re.DOTALL)
    if not body_match:
        continue
    body = body_match.group(1)
    
    # Check for USD $ with very wrong amounts for Korea context
    for m in re.finditer(r'\$(\d[\d,]*)', body):
        amount_str = m.group(1).replace(',', '')
        try:
            amount = int(amount_str)
        except:
            continue
        if amount > 50000:
            ctx_start = max(0, m.start()-40)
            ctx_end = min(len(body), m.end()+40)
            ctx = body[ctx_start:ctx_end].replace('\n', ' ').strip()
            suspicious_dollars.append((filepath.name, amount, ctx))

print(f"\n6. Suspiciously high USD amounts (>$50,000): {len(suspicious_dollars)}")
for f, amt, ctx in suspicious_dollars[:15]:
    print(f"   - {f}: ${amt:,} — ...{ctx[:80]}...")

# Check for placeholder-like content
placeholder_files = []
for slug in sorted(expected_slugs):
    candidates = list(POSTS_DIR.glob(f'{slug}*.md'))
    if not candidates:
        slug_parts = slug.split('-')[:5]
        partial = '-'.join(slug_parts)
        candidates = [f for f in POSTS_DIR.glob('*.md') if partial in f.stem]
    if not candidates:
        continue
    filepath = candidates[0]
    try:
        content = filepath.read_text(encoding='utf-8')
    except:
        continue
    
    for pattern in [r'\[insert\b', r'\[your\s', r'\[clinic\s?name', r'\bTBD\b', r'\bTBA\b', r'lorem ipsum', r'\[TODO\]']:
        for m in re.finditer(pattern, content, re.IGNORECASE):
            ctx_start = max(0, m.start()-20)
            ctx_end = min(len(content), m.end()+40)
            ctx = content[ctx_start:ctx_end].replace('\n', ' ')
            placeholder_files.append((filepath.name, ctx))

print(f"\n7. Placeholder/template text: {len(placeholder_files)}")
for f, ctx in placeholder_files[:20]:
    print(f"   - {f}: ...{ctx[:80]}...")

# Check for AI self-references
ai_files = []
for slug in sorted(expected_slugs):
    candidates = list(POSTS_DIR.glob(f'{slug}*.md'))
    if not candidates:
        slug_parts = slug.split('-')[:5]
        partial = '-'.join(slug_parts)
        candidates = [f for f in POSTS_DIR.glob('*.md') if partial in f.stem]
    if not candidates:
        continue
    filepath = candidates[0]
    try:
        content = filepath.read_text(encoding='utf-8')
    except:
        continue
    
    for pattern in [r'\bas an AI\b', r'\bI am an? (?:language model|AI)\b', r'\bmy training data\b', r'\bmy knowledge cutoff\b']:
        for m in re.finditer(pattern, content, re.IGNORECASE):
            ai_files.append((filepath.name, m.group()))

print(f"\n8. AI self-references: {len(ai_files)}")
for f, text in ai_files:
    print(f"   - {f}: '{text}'")

# Check encoding artifacts
enc_files = []
for slug in sorted(expected_slugs):
    candidates = list(POSTS_DIR.glob(f'{slug}*.md'))
    if not candidates:
        slug_parts = slug.split('-')[:5]
        partial = '-'.join(slug_parts)
        candidates = [f for f in POSTS_DIR.glob('*.md') if partial in f.stem]
    if not candidates:
        continue
    filepath = candidates[0]
    try:
        content = filepath.read_text(encoding='utf-8')
    except:
        continue
    
    for pattern in [r'â€™', r'â€"', r'â€œ', r'Ã©', r'Ã¨', r'Â']:
        if re.search(pattern, content):
            enc_files.append(filepath.name)
            break

print(f"\n9. Encoding artifacts: {len(enc_files)}")
for f in enc_files:
    print(f"   - {f}")

# Check for very short posts (< 800 words)
short_files = []
for slug in sorted(expected_slugs):
    candidates = list(POSTS_DIR.glob(f'{slug}*.md'))
    if not candidates:
        slug_parts = slug.split('-')[:5]
        partial = '-'.join(slug_parts)
        candidates = [f for f in POSTS_DIR.glob('*.md') if partial in f.stem]
    if not candidates:
        continue
    filepath = candidates[0]
    try:
        content = filepath.read_text(encoding='utf-8')
    except:
        continue
    body_match = re.search(r'^---\n.*?\n---\n(.*)$', content, re.DOTALL)
    if body_match:
        words = len(body_match.group(1).split())
        if words < 800:
            short_files.append((filepath.name, words))

print(f"\n10. Very short posts (<800 words): {len(short_files)}")
for f, w in sorted(short_files, key=lambda x: x[1]):
    print(f"   - {f}: {w} words")

# Check for wrong factual claims
fact_files = []
for slug in sorted(expected_slugs):
    candidates = list(POSTS_DIR.glob(f'{slug}*.md'))
    if not candidates:
        slug_parts = slug.split('-')[:5]
        partial = '-'.join(slug_parts)
        candidates = [f for f in POSTS_DIR.glob('*.md') if partial in f.stem]
    if not candidates:
        continue
    filepath = candidates[0]
    try:
        content = filepath.read_text(encoding='utf-8')
    except:
        continue
    
    checks = [
        (r'Seoul.{0,20}capital of (?:North |South )?Korea', None),  # This is actually correct for South Korea
        (r'Busan.{0,20}capital', 'Busan wrongly called capital'),
        (r'population.{0,20}(?:5[2-9]|[6-9]\d)\s*billion', 'wrong population (billions not millions)'),
        (r'Korea.{0,15}(?:tropical|equator)', 'wrong climate'),
        (r'(?:won|KRW).{0,10}(?:100|1000)\s*(?:to|=|per)\s*(?:1|one)\s*(?:dollar|USD)', 'wrong exchange rate'),
        (r'subway.{0,15}(?:\$[5-9]|\$\d{2,}|₩[5-9],?000)', 'subway fare too high'),
    ]
    
    for pattern, desc in checks:
        if desc is None:
            continue
        for m in re.finditer(pattern, content, re.IGNORECASE):
            ctx = content[max(0,m.start()-20):min(len(content),m.end()+30)].replace('\n',' ')
            fact_files.append((filepath.name, desc, ctx[:80]))

print(f"\n11. Factual red flags: {len(fact_files)}")
for f, desc, ctx in fact_files:
    print(f"   - {f}: {desc} — {ctx}")

print(f"\n{'='*70}")
print("DONE")
print(f"{'='*70}")
