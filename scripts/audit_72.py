"""
Deep content audit for the latest 72 generated posts.
(From "Hidden Gems In Seoul" to "Seongsu-dong" in generation-progress.json)
"""
import re, json, os, sys
from pathlib import Path
from collections import defaultdict

POSTS_DIR = Path('content/posts')
PROGRESS = json.load(open('scripts/generation-progress.json', 'r', encoding='utf-8'))

# The 72 target entries (from "Hidden Gems..." to end)
TARGET_TITLES = []
found_start = False
for key in PROGRESS:
    title = key.split(':', 1)[1] if ':' in key else key
    if 'Hidden Gems In Seoul Secret Spots Locals Love 2026' in title:
        found_start = True
    if found_start:
        TARGET_TITLES.append(title)

def title_to_slug(title):
    slug = title.lower().strip()
    slug = re.sub(r"[''']", "", slug)
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug

target_slugs = [title_to_slug(t) for t in TARGET_TITLES]
print(f"Target posts: {len(target_slugs)}")

# ── Patterns ──
FAKE_PHONE_PATTERNS = [
    r'555-\d{3,4}-?\d{4}',
    r'123-456-7890',
    r'\+1[-\s]?\d{3}[-\s]?\d{3}[-\s]?\d{4}',
    r'\+82[-\s]?10[-\s]?\d{4}[-\s]?0000',
    r'\b\d{3}-\d{3}-\d{4}\b(?![\d])',
]
FAKE_URL_PATTERNS = [
    r'example\.com', r'placeholder\.com', r'fake\w*\.com',
    r'www\.clinic-name', r'www\.hospital-name', r'booking\.clinic',
]
WRONG_CURRENCY = [r'\bKRW\s*\d', r'\d\s*KRW\b']
ENCODING_ISSUES = [
    r'â€™', r'â€"', r'â€œ', r'â€\x9d', r'Ã©', r'Ã¨', r'Ã¼',
    r'â€˜', r'â€¢', r'Â', r'\u200b', r'\ufeff',
]
AI_PATTERNS = [
    r'\bas an AI\b', r'\bI am an? (?:language model|AI|chatbot)\b',
    r'\bgenerated (?:by|with) (?:AI|GPT|Claude|ChatGPT)\b',
    r'\baccording to my training\b', r'\bmy knowledge cutoff\b',
    r'\bI don\'t have (?:personal|real) experience\b',
    r'\bI cannot (?:verify|confirm|guarantee)\b',
]
PLACEHOLDER_TEXT = [
    r'\[insert\b', r'\[your\s', r'\[name\b',
    r'\[clinic\s?name\]', r'\[hospital\s?name\]',
    r'\bTBD\b', r'\bTBA\b', r'lorem ipsum',
    r'xxx+', r'\[TODO\]', r'\[FIXME\]',
    r'\[city\s?name\]', r'\[brand\s?name\]', r'\[price\]',
    r'\[date\]', r'\[address\]', r'\[phone\]',
    r'\[restaurant\s?name\]', r'\[hotel\s?name\]',
]
FACT_ISSUES = [
    (r'Seoul.{0,20}capital of (?:North )?Korea', 'wrong capital description'),
    (r'Busan.{0,20}capital', 'Busan wrongly called capital'),
    (r'population.{0,20}(?:5[2-9]|[6-9]\d)\s*billion', 'wrong population scale'),
    (r'Korea.{0,30}(?:tropical|equator)', 'wrong climate description'),
    (r'Jeju.{0,30}mainland', 'Jeju is an island not mainland'),
]
OUTDATED_YEARS = [r'\b20(?:19|20|21|22)\b']
PRICE_PATTERNS = [
    (r'₩\s*(\d{1,2})\b(?!\s*(?:,|million|billion|만|억))', 'suspiciously low won price'),
    (r'₩\s*(\d{10,})', 'suspiciously high won price'),
]

# ── Check functions ──
def check_frontmatter(content, filename):
    issues = []
    fm_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not fm_match:
        issues.append(("CRITICAL", "No frontmatter found"))
        return issues
    fm = fm_match.group(1)
    
    required = ['title', 'excerpt', 'date', 'category', 'tags', 'readTime', 'featured']
    for field in required:
        if not re.search(rf'^{field}:', fm, re.MULTILINE):
            issues.append(("MEDIUM", f"Missing frontmatter: {field}"))
    
    title_match = re.search(r'^title:\s*["\']?(.*?)["\']?\s*$', fm, re.MULTILINE)
    if title_match:
        title = title_match.group(1)
        if len(title) > 80:
            issues.append(("LOW", f"Title too long ({len(title)} chars)"))
        if len(title) < 10:
            issues.append(("MEDIUM", f"Title too short ({len(title)} chars)"))
    
    excerpt_match = re.search(r'^excerpt:\s*["\']?(.*?)["\']?\s*$', fm, re.MULTILINE)
    if excerpt_match:
        excerpt = excerpt_match.group(1)
        if len(excerpt) > 200:
            issues.append(("LOW", f"Excerpt too long ({len(excerpt)} chars)"))
        if len(excerpt) < 30:
            issues.append(("MEDIUM", f"Excerpt too short ({len(excerpt)} chars)"))
    
    date_match = re.search(r'^date:\s*["\']?(\d{4}-\d{2}-\d{2})', fm, re.MULTILINE)
    if date_match:
        year = int(date_match.group(1)[:4])
        if year < 2024 or year > 2027:
            issues.append(("HIGH", f"Suspicious date year: {date_match.group(1)}"))
    
    tags_match = re.search(r'^tags:\s*\[(.*?)\]', fm, re.MULTILINE)
    if tags_match:
        tag_count = len([t for t in tags_match.group(1).split(',') if t.strip()])
        if tag_count < 1:
            issues.append(("MEDIUM", "No tags"))
        if tag_count > 15:
            issues.append(("LOW", f"Too many tags ({tag_count})"))
    
    return issues

def get_body(content):
    m = re.search(r'^---\n.*?\n---\n(.*)$', content, re.DOTALL)
    return m.group(1) if m else ""

def check_content_quality(content):
    issues = []
    body = get_body(content)
    if not body:
        return issues
    
    words = len(body.split())
    if words < 500:
        issues.append(("HIGH", f"Very short ({words} words)"))
    elif words < 800:
        issues.append(("MEDIUM", f"Short content ({words} words)"))
    if words > 8000:
        issues.append(("LOW", f"Very long ({words} words)"))
    
    h2_count = len(re.findall(r'^## ', body, re.MULTILINE))
    if h2_count < 2:
        issues.append(("MEDIUM", f"Too few H2 headers ({h2_count})"))
    
    # Empty sections
    for m in re.finditer(r'^(## .+)\n\n(?=## )', body, re.MULTILINE):
        issues.append(("MEDIUM", f"Empty section: {m.group(1)}"))
    
    return issues

def check_repetitive(content):
    issues = []
    body = get_body(content)
    paragraphs = [p.strip() for p in body.split('\n\n') if len(p.strip()) > 80]
    seen = {}
    for i, p in enumerate(paragraphs):
        norm = re.sub(r'\s+', ' ', p.lower())
        if norm in seen:
            issues.append(("HIGH", f"Paragraph repeated (para {seen[norm]+1} = para {i+1})"))
        else:
            seen[norm] = i
    
    # Duplicate consecutive sentences
    sentences = re.findall(r'[A-Z][^.!?]*[.!?]', body)
    for i in range(len(sentences) - 1):
        s1 = re.sub(r'\s+', ' ', sentences[i].lower().strip())
        s2 = re.sub(r'\s+', ' ', sentences[i+1].lower().strip())
        if len(s1) > 50 and s1 == s2:
            issues.append(("HIGH", f"Duplicate sentence: {s1[:60]}..."))
    
    return issues

def check_mdx(content):
    issues = []
    body = get_body(content)
    components = ['KeyTakeaways','FAQAccordion','ExpertTip','InfoBox','StepGuide','ProsCons',
                  'PriceTable','StatCard','QuickFacts','ComparisonTable','LocationCard','Timeline',
                  'DualismRoute','BeforeAfter','PriceComparisonChart','ImageGallery','ResponsiveTable']
    
    for comp in components:
        # self-closing: <Comp ... />
        self_closes = len(re.findall(rf'<{comp}\b[^>]*?/>', body, re.DOTALL))
        # opening (not self-closing): <Comp ...>
        opens = len(re.findall(rf'<{comp}\b(?:[^>]*[^/])?>(?!.*/>)', body))
        # We need a more careful count - opening tags that are NOT self-closing
        all_tags = re.findall(rf'<{comp}\b[^>]*>', body, re.DOTALL)
        opening_count = 0
        for tag in all_tags:
            if not tag.rstrip().endswith('/>'):
                opening_count += 1
        closes = len(re.findall(rf'</{comp}>', body))
        
        if closes > opening_count:
            issues.append(("CRITICAL", f"Orphan </{comp}> (opens={opening_count}, self-close={self_closes}, closes={closes})"))
        if opening_count > closes:
            issues.append(("HIGH", f"Unclosed <{comp}> (opens={opening_count}, closes={closes})"))
    
    return issues

def check_links(content):
    issues = []
    links = re.findall(r'\[([^\]]*)\]\(([^)]*)\)', content)
    for text, url in links:
        if url.startswith('http'):
            for pattern in FAKE_URL_PATTERNS:
                if re.search(pattern, url, re.IGNORECASE):
                    issues.append(("MEDIUM", f"Suspicious URL: {url}"))
                    break
    return issues

def check_broken_markdown(content):
    """Check for broken markdown syntax."""
    issues = []
    body = get_body(content)
    
    # Unclosed bold/italic (rough check)
    lines = body.split('\n')
    for i, line in enumerate(lines, 1):
        # Skip code blocks and MDX components
        if line.strip().startswith('```') or line.strip().startswith('<'):
            continue
        # Check for odd number of ** (bold markers)
        bold_count = len(re.findall(r'(?<!\*)\*\*(?!\*)', line))
        if bold_count % 2 != 0:
            issues.append(("LOW", f"Possibly unclosed bold on line ~{i}: {line[:60]}..."))
    
    # Broken image references
    for m in re.finditer(r'!\[([^\]]*)\]\(([^)]*)\)', body):
        img_path = m.group(2)
        if img_path and not img_path.startswith(('http', '/', '#')):
            issues.append(("LOW", f"Relative image path: {img_path}"))
    
    return issues

def check_table_consistency(content):
    """Check markdown tables have consistent columns."""
    issues = []
    body = get_body(content)
    # Find table blocks (consecutive lines starting with |)
    table_lines = []
    in_table = False
    for line in body.split('\n'):
        stripped = line.strip()
        if stripped.startswith('|') and stripped.endswith('|'):
            table_lines.append(stripped)
            in_table = True
        else:
            if in_table and table_lines:
                col_counts = [len(row.split('|')) for row in table_lines]
                if len(set(col_counts)) > 1:
                    issues.append(("MEDIUM", f"Inconsistent table columns: {set(col_counts)}"))
                table_lines = []
            in_table = False
    return issues

# ── Main audit ──
print("=" * 70)
print(f"DEEP AUDIT - {len(target_slugs)} Latest Posts")
print("=" * 70)

total_files = 0
total_issues = 0
severity_counts = {'CRITICAL': 0, 'HIGH': 0, 'MEDIUM': 0, 'LOW': 0}
all_issues = {}
missing_files = []
word_counts = []

for slug in target_slugs:
    candidates = list(POSTS_DIR.glob(f'{slug}*.md'))
    if not candidates:
        slug_parts = slug.split('-')[:5]
        partial = '-'.join(slug_parts)
        candidates = [f for f in POSTS_DIR.glob('*.md') if partial in f.stem]
    
    if not candidates:
        missing_files.append(slug)
        continue
    
    filepath = candidates[0]
    total_files += 1
    
    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        all_issues[filepath.stem] = [("CRITICAL", f"Cannot read: {e}")]
        continue
    
    file_issues = []
    body = get_body(content)
    word_counts.append((filepath.name, len(body.split())))
    
    # 1. Frontmatter
    file_issues.extend(check_frontmatter(content, filepath.name))
    
    # 2. Content quality
    file_issues.extend(check_content_quality(content))
    
    # 3. Fake phones
    for pattern in FAKE_PHONE_PATTERNS:
        for m in re.finditer(pattern, content, re.IGNORECASE):
            file_issues.append(("HIGH", f"Fake phone: {m.group()}"))
    
    # 4. Valid Korean phones
    for m in re.finditer(r'(?<!\d)(\d{2,3})-(\d{3,4})-(\d{4})(?!\d)', content):
        area = m.group(1)
        valid_areas = ['02','031','032','033','041','042','043','044',
                       '051','052','053','054','055','061','062','063','064',
                       '010','011','016','017','018','019','070','080']
        if area not in valid_areas and not area.startswith(('15','16','18')):
            # Check if it's in frontmatter (date format) - skip
            if re.match(r'20\d{2}', area):
                continue
            file_issues.append(("HIGH", f"Invalid phone area code: {m.group()}"))
    
    # 5. KRW currency
    for pattern in WRONG_CURRENCY:
        for m in re.finditer(pattern, content):
            file_issues.append(("MEDIUM", f"KRW instead of ₩: {m.group()}"))
    
    # 6. Encoding
    for pattern in ENCODING_ISSUES:
        if re.search(pattern, content):
            file_issues.append(("HIGH", f"Encoding artifact: {pattern}"))
    
    # 7. AI self-ref
    for pattern in AI_PATTERNS:
        for m in re.finditer(pattern, content, re.IGNORECASE):
            file_issues.append(("CRITICAL", f"AI self-reference: {m.group()}"))
    
    # 8. Placeholders
    for pattern in PLACEHOLDER_TEXT:
        for m in re.finditer(pattern, content, re.IGNORECASE):
            file_issues.append(("HIGH", f"Placeholder: {m.group()}"))
    
    # 9. URLs
    file_issues.extend(check_links(content))
    
    # 10. Facts
    for pattern, desc in FACT_ISSUES:
        for m in re.finditer(pattern, content, re.IGNORECASE):
            file_issues.append(("CRITICAL", f"Factual: {desc}"))
    
    # 11. Outdated years
    if body:
        for pattern in OUTDATED_YEARS:
            for m in re.finditer(pattern, body):
                ctx_start = max(0, m.start() - 60)
                ctx_end = min(len(body), m.end() + 60)
                ctx = body[ctx_start:ctx_end].replace('\n', ' ')
                if re.search(r'(?:currently|now|this year|as of) ?' + pattern, ctx, re.IGNORECASE):
                    file_issues.append(("HIGH", f"Outdated year as current: ...{ctx.strip()[:80]}..."))
    
    # 12. Repetitive
    file_issues.extend(check_repetitive(content))
    
    # 13. MDX
    file_issues.extend(check_mdx(content))
    
    # 14. Prices
    for pattern, desc in PRICE_PATTERNS:
        for m in re.finditer(pattern, content):
            ctx_start = max(0, m.start() - 30)
            ctx_end = min(len(content), m.end() + 30)
            ctx = content[ctx_start:ctx_end].replace('\n', ' ')
            file_issues.append(("MEDIUM", f"{desc}: ...{ctx}..."))
    
    # 15. Duplicate words
    for m in re.finditer(r'\b(\w{3,})\s+\1\b', content, re.IGNORECASE):
        word = m.group(1).lower()
        if word not in ('ha', 'very', 'so', 'bye', 'no', 'the', 'that', 'and', 'had', 'but'):
            file_issues.append(("LOW", f"Duplicate word: '{m.group()}'"))
    
    # 16. Tables
    file_issues.extend(check_table_consistency(content))
    
    # 17. Broken markdown
    file_issues.extend(check_broken_markdown(content))
    
    # 18. Check for unreasonable internal link targets
    internal_links = re.findall(r'\[([^\]]+)\]\(/([^)]+)\)', content)
    for text, path in internal_links:
        if path.startswith('blog/') or path.startswith('tools/'):
            continue
        if not path.startswith(('blog/', 'tools/', '#', 'about', 'contact')):
            file_issues.append(("LOW", f"Unusual internal link: /{path}"))
    
    if file_issues:
        all_issues[filepath.name] = file_issues
        for sev, _ in file_issues:
            severity_counts[sev] += 1
        total_issues += len(file_issues)

# ── Output ──
print(f"\nFiles found: {total_files}/{len(target_slugs)}")
if missing_files:
    print(f"Missing files ({len(missing_files)}):")
    for s in missing_files:
        print(f"  ✗ {s}")

print(f"\nTotal issues: {total_issues}")
print(f"  CRITICAL: {severity_counts['CRITICAL']}")
print(f"  HIGH:     {severity_counts['HIGH']}")
print(f"  MEDIUM:   {severity_counts['MEDIUM']}")
print(f"  LOW:      {severity_counts['LOW']}")

# Clean files
clean = total_files - len(all_issues)
print(f"\n✅ Clean files: {clean}/{total_files}")

# Word count stats
if word_counts:
    wc_vals = [w for _, w in word_counts]
    avg_wc = sum(wc_vals) / len(wc_vals)
    min_wc = min(word_counts, key=lambda x: x[1])
    max_wc = max(word_counts, key=lambda x: x[1])
    print(f"\n📊 Word Count Stats:")
    print(f"  Average: {avg_wc:.0f} words")
    print(f"  Min: {min_wc[1]} words ({min_wc[0]})")
    print(f"  Max: {max_wc[1]} words ({max_wc[0]})")

# Issues by severity
for sev_level in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']:
    files_with_this = [(f, [i for i in iss if i[0] == sev_level]) 
                       for f, iss in sorted(all_issues.items()) 
                       if any(i[0] == sev_level for i in iss)]
    
    if files_with_this:
        print(f"\n{'='*70}")
        print(f"  [{sev_level}] Issues ({sum(len(fi) for _, fi in files_with_this)})")
        print(f"{'='*70}")
        for filename, file_issues in files_with_this:
            print(f"\n  {filename}")
            for _, issue in file_issues:
                print(f"    → {issue}")

# Summary by issue type
print(f"\n{'='*70}")
print("  Issue Type Summary")
print(f"{'='*70}")
type_counts = defaultdict(int)
for f, iss in all_issues.items():
    for sev, msg in iss:
        # Extract type from message
        if 'frontmatter' in msg.lower():
            type_counts['Missing frontmatter'] += 1
        elif 'krw' in msg.lower() or 'currency' in msg.lower():
            type_counts['KRW currency'] += 1
        elif 'phone' in msg.lower():
            type_counts['Phone issues'] += 1
        elif 'placeholder' in msg.lower():
            type_counts['Placeholder text'] += 1
        elif 'ai self' in msg.lower():
            type_counts['AI self-reference'] += 1
        elif 'encoding' in msg.lower():
            type_counts['Encoding artifacts'] += 1
        elif 'orphan' in msg.lower() or 'unclosed' in msg.lower():
            type_counts['MDX tag issues'] += 1
        elif 'repeat' in msg.lower() or 'duplicate sent' in msg.lower():
            type_counts['Repetitive content'] += 1
        elif 'short' in msg.lower() and 'word' in msg.lower():
            type_counts['Short content'] += 1
        elif 'outdated' in msg.lower():
            type_counts['Outdated years'] += 1
        elif 'duplicate word' in msg.lower():
            type_counts['Duplicate words'] += 1
        elif 'table' in msg.lower():
            type_counts['Table issues'] += 1
        elif 'url' in msg.lower():
            type_counts['Suspicious URLs'] += 1
        elif 'factual' in msg.lower():
            type_counts['Factual issues'] += 1
        elif 'price' in msg.lower() or 'won' in msg.lower():
            type_counts['Price issues'] += 1
        elif 'empty section' in msg.lower():
            type_counts['Empty sections'] += 1
        elif 'bold' in msg.lower():
            type_counts['Markdown formatting'] += 1
        else:
            type_counts['Other'] += 1

for t, c in sorted(type_counts.items(), key=lambda x: -x[1]):
    print(f"  {t}: {c}")

print(f"\n{'='*70}")
print("AUDIT COMPLETE")
print(f"{'='*70}")
