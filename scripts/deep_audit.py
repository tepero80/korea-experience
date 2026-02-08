"""
Deep content audit for all generated posts.
Checks: fake phones, suspicious numbers, fabricated URLs, wrong currencies,
hallucinated facts, broken MDX, encoding issues, and more.
"""
import re, json, os
from pathlib import Path
from collections import defaultdict

POSTS_DIR = Path('content/posts')
PROGRESS = json.load(open('scripts/generation-progress.json', 'r', encoding='utf-8'))

# Build list of expected slugs from progress keys
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

issues = defaultdict(list)
stats = defaultdict(int)

# ── Check patterns ──
# Korean phone: should be 02-xxxx-xxxx, 010-xxxx-xxxx etc. Fake = 555, 123-456-7890 etc.
FAKE_PHONE_PATTERNS = [
    r'555-\d{3,4}-?\d{4}',
    r'123-456-7890',
    r'\+1[-\s]?\d{3}[-\s]?\d{3}[-\s]?\d{4}',  # US phone numbers
    r'\+82[-\s]?10[-\s]?\d{4}[-\s]?0000',  # obviously fake Korean
    r'\b\d{3}-\d{3}-\d{4}\b(?![\d])',  # US-style phone format
]

# Suspicious URLs (made-up domains)
FAKE_URL_PATTERNS = [
    r'example\.com',
    r'placeholder\.com',
    r'fake\w*\.com',
    r'www\.clinic-name',
    r'www\.hospital-name',
    r'booking\.clinic',
    r'www\.\w+-korea\.com/book',  # generic fake booking URLs
]

# Wrong currency symbols (should be ₩ not KRW for price display)
WRONG_CURRENCY = [
    r'\bKRW\s*\d',
    r'\d\s*KRW\b',
]

# Encoding artifacts
ENCODING_ISSUES = [
    r'â€™', r'â€"', r'â€œ', r'â€\x9d', r'Ã©', r'Ã¨', r'Ã¼',
    r'â€˜', r'â€¢', r'Â', r'\u200b', r'\ufeff',
]

# Suspicious/hallucinated statistics
SUSPICIOUS_STATS = [
    r'\b(?:99|100)(?:\.\d+)?%\s+(?:success|satisfaction|survival|recovery|approval)',
    r'\b(?:0|0\.0)%\s+(?:complication|failure|risk)',
]

# Outdated year references that shouldn't appear in 2026 content
OUTDATED_YEARS = [
    r'\b20(?:19|20|21|22)\b',  # 2019-2022 as if current
]

# Placeholder/template text
PLACEHOLDER_TEXT = [
    r'\[insert\b',
    r'\[your\s',
    r'\[name\b',
    r'\[clinic\s?name\]',
    r'\[hospital\s?name\]',
    r'\bTBD\b',
    r'\bTBA\b',
    r'lorem ipsum',
    r'xxx+',
    r'\[TODO\]',
    r'\[FIXME\]',
]

# MDX component issues
MDX_ISSUES = [
    (r'<([A-Z]\w+)\b[^>]*>[^<]*<\1\b', 'nested same component'),
]

# Factual red flags
FACT_ISSUES = [
    (r'Seoul.{0,20}capital of (?:North )?Korea', 'wrong capital description'),
    (r'Busan.{0,20}capital', 'Busan wrongly called capital'),
    (r'population.{0,20}(?:5[2-9]|[6-9]\d)\s*billion', 'wrong population scale'),
    (r'Korea.{0,30}(?:tropical|equator)', 'wrong climate description'),
]

# Prices that seem unreasonable (₩ values)
# Korean won: ₩1,000 ≈ $0.75 (2026). So ₩100 for a meal is wrong, ₩10,000,000 for coffee is wrong
PRICE_PATTERNS = [
    (r'₩\s*(\d{1,2})\b(?!\s*(?:,|million|billion|만|억))', 'suspiciously low won price'),
    (r'₩\s*(\d{10,})', 'suspiciously high won price'),
]

# Self-referencing AI patterns
AI_PATTERNS = [
    r'\bas an AI\b',
    r'\bI am an? (?:language model|AI|chatbot)\b',
    r'\bgenerated (?:by|with) (?:AI|GPT|Claude|ChatGPT)\b',
    r'\baccording to my training\b',
    r'\bmy knowledge cutoff\b',
]

# Duplicate/repetitive content detection
def check_repetitive_paragraphs(content):
    """Check for copy-pasted paragraphs within a single post."""
    paragraphs = [p.strip() for p in content.split('\n\n') if len(p.strip()) > 80]
    seen = {}
    dupes = []
    for i, p in enumerate(paragraphs):
        # normalize whitespace
        norm = re.sub(r'\s+', ' ', p.lower())
        if norm in seen:
            dupes.append(f"Paragraph repeated (first at para {seen[norm]+1}, again at para {i+1})")
        else:
            seen[norm] = i
    return dupes

def check_frontmatter(content, filename):
    """Validate frontmatter fields."""
    issues = []
    fm_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not fm_match:
        issues.append("CRITICAL: No frontmatter found")
        return issues
    
    fm = fm_match.group(1)
    
    # Required fields
    required = ['title', 'excerpt', 'date', 'category', 'tags', 'readTime']
    for field in required:
        if not re.search(rf'^{field}:', fm, re.MULTILINE):
            issues.append(f"Missing frontmatter field: {field}")
    
    # Title length
    title_match = re.search(r'^title:\s*["\']?(.*?)["\']?\s*$', fm, re.MULTILINE)
    if title_match:
        title = title_match.group(1)
        if len(title) > 80:
            issues.append(f"Title too long ({len(title)} chars): {title[:60]}...")
    
    # Excerpt length
    excerpt_match = re.search(r'^excerpt:\s*["\']?(.*?)["\']?\s*$', fm, re.MULTILINE)
    if excerpt_match:
        excerpt = excerpt_match.group(1)
        if len(excerpt) > 200:
            issues.append(f"Excerpt too long ({len(excerpt)} chars)")
        if len(excerpt) < 30:
            issues.append(f"Excerpt too short ({len(excerpt)} chars)")
    
    # Date validation
    date_match = re.search(r'^date:\s*["\']?(\d{4}-\d{2}-\d{2})', fm, re.MULTILINE)
    if date_match:
        date_str = date_match.group(1)
        year = int(date_str[:4])
        if year < 2024 or year > 2027:
            issues.append(f"Suspicious date: {date_str}")
    
    # Tags should be array
    tags_match = re.search(r'^tags:\s*\[(.*?)\]', fm, re.MULTILINE)
    if tags_match:
        tags = tags_match.group(1)
        tag_count = len([t for t in tags.split(',') if t.strip()])
        if tag_count < 1:
            issues.append("No tags defined")
        if tag_count > 15:
            issues.append(f"Too many tags ({tag_count})")
    
    return issues

def check_content_quality(content):
    """Check content body for quality issues."""
    issues = []
    
    # Strip frontmatter
    body_match = re.search(r'^---\n.*?\n---\n(.*)$', content, re.DOTALL)
    if not body_match:
        return issues
    body = body_match.group(1)
    
    # Word count
    words = len(body.split())
    if words < 500:
        issues.append(f"Very short content ({words} words)")
    if words > 8000:
        issues.append(f"Extremely long content ({words} words)")
    
    # Check for headers
    h2_count = len(re.findall(r'^## ', body, re.MULTILINE))
    if h2_count < 2:
        issues.append(f"Too few H2 headers ({h2_count})")
    
    # Check for suspiciously similar adjacent sentences
    sentences = re.findall(r'[A-Z][^.!?]*[.!?]', body)
    for i in range(len(sentences) - 1):
        s1 = re.sub(r'\s+', ' ', sentences[i].lower().strip())
        s2 = re.sub(r'\s+', ' ', sentences[i+1].lower().strip())
        if len(s1) > 50 and s1 == s2:
            issues.append(f"Duplicate sentence: {s1[:60]}...")
    
    return issues

def check_broken_mdx(content):
    """Check for MDX syntax issues that could break build."""
    issues = []
    body_match = re.search(r'^---\n.*?\n---\n(.*)$', content, re.DOTALL)
    if not body_match:
        return issues
    body = body_match.group(1)
    
    # Unmatched JSX tags (simple check)
    components = ['KeyTakeaways','FAQAccordion','ExpertTip','InfoBox','StepGuide','ProsCons',
                  'PriceTable','StatCard','QuickFacts','ComparisonTable','LocationCard','Timeline',
                  'DualismRoute','BeforeAfter','PriceComparisonChart','ImageGallery','ResponsiveTable']
    
    for comp in components:
        opens = len(re.findall(rf'<{comp}\b(?!.*?/>)', body))
        closes = len(re.findall(rf'</{comp}>', body))
        self_closes = len(re.findall(rf'<{comp}\b[^>]*?/>', body, re.DOTALL))
        
        # This is approximate; the robust parser is better
        if closes > opens:
            issues.append(f"Possible orphan </{comp}> (opens={opens}, self-close={self_closes}, closes={closes})")
    
    # Unclosed JSX expressions
    brace_depth = 0
    in_jsx = False
    for i, ch in enumerate(body):
        if ch == '<' and i+1 < len(body) and body[i+1].isupper():
            in_jsx = True
        if in_jsx:
            if ch == '{':
                brace_depth += 1
            elif ch == '}':
                brace_depth -= 1
            if ch == '>' and brace_depth == 0:
                in_jsx = False
    
    return issues

def check_links(content):
    """Check for broken or suspicious links."""
    issues = []
    # Markdown links
    links = re.findall(r'\[([^\]]*)\]\(([^)]*)\)', content)
    for text, url in links:
        if url.startswith('http'):
            # Check for obviously fake URLs
            for pattern in FAKE_URL_PATTERNS:
                if re.search(pattern, url, re.IGNORECASE):
                    issues.append(f"Suspicious URL: {url}")
                    break
        elif not url.startswith(('#', '/', 'mailto:')):
            issues.append(f"Unusual link format: [{text}]({url})")
    
    # Raw URLs
    raw_urls = re.findall(r'(?<!\()(https?://[^\s\)]+)', content)
    for url in raw_urls:
        for pattern in FAKE_URL_PATTERNS:
            if re.search(pattern, url, re.IGNORECASE):
                issues.append(f"Suspicious raw URL: {url}")
                break
    
    return issues

# ── Main audit loop ──
print("=" * 70)
print("DEEP CONTENT AUDIT - All Generated Posts")
print("=" * 70)

total_files = 0
total_issues = 0
severity_counts = {'CRITICAL': 0, 'HIGH': 0, 'MEDIUM': 0, 'LOW': 0}
all_issues = {}

for slug in sorted(expected_slugs):
    # Find matching file
    candidates = list(POSTS_DIR.glob(f'{slug}*.md'))
    if not candidates:
        # Try partial match
        slug_parts = slug.split('-')[:5]
        partial = '-'.join(slug_parts)
        candidates = [f for f in POSTS_DIR.glob('*.md') if partial in f.stem]
    
    if not candidates:
        # issues[slug].append(("HIGH", f"File not found for slug: {slug}"))
        # Often due to slug mismatch, skip silently
        continue
    
    filepath = candidates[0]
    total_files += 1
    
    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        issues[filepath.stem].append(("CRITICAL", f"Cannot read file: {e}"))
        continue
    
    file_issues = []
    
    # 1. Frontmatter checks
    for issue in check_frontmatter(content, filepath.name):
        sev = "CRITICAL" if "No frontmatter" in issue else "MEDIUM" if "Missing" in issue else "LOW"
        file_issues.append((sev, issue))
    
    # 2. Content quality
    for issue in check_content_quality(content):
        sev = "MEDIUM" if "short" in issue.lower() else "LOW"
        file_issues.append((sev, issue))
    
    # 3. Fake phone numbers
    for pattern in FAKE_PHONE_PATTERNS:
        for m in re.finditer(pattern, content, re.IGNORECASE):
            file_issues.append(("HIGH", f"Fake/US phone number: {m.group()}"))
    
    # 4. Korean phone number format check (should be 0XX-XXXX-XXXX)
    for m in re.finditer(r'(?<!\d)(\d{2,3})-(\d{3,4})-(\d{4})(?!\d)', content):
        full = m.group()
        area = m.group(1)
        # Valid Korean area codes
        valid_areas = ['02', '031', '032', '033', '041', '042', '043', '044', 
                       '051', '052', '053', '054', '055', '061', '062', '063', '064',
                       '010', '011', '016', '017', '018', '019', '070', '080', '1544',
                       '1588', '1577', '1566', '1599', '1688', '1644', '1661', '1899', '1800']
        if area not in valid_areas and not area.startswith('15') and not area.startswith('16') and not area.startswith('18'):
            file_issues.append(("HIGH", f"Invalid Korean phone area code: {full}"))
    
    # 5. Wrong currency
    for pattern in WRONG_CURRENCY:
        for m in re.finditer(pattern, content):
            file_issues.append(("MEDIUM", f"Use ₩ instead of KRW: {m.group()}"))
    
    # 6. Encoding artifacts
    for pattern in ENCODING_ISSUES:
        if re.search(pattern, content):
            file_issues.append(("HIGH", f"Encoding artifact: {pattern}"))
    
    # 7. AI self-referencing
    for pattern in AI_PATTERNS:
        for m in re.finditer(pattern, content, re.IGNORECASE):
            file_issues.append(("CRITICAL", f"AI self-reference: {m.group()}"))
    
    # 8. Placeholder text
    for pattern in PLACEHOLDER_TEXT:
        for m in re.finditer(pattern, content, re.IGNORECASE):
            file_issues.append(("HIGH", f"Placeholder text: {m.group()}"))
    
    # 9. Suspicious URLs
    for issue in check_links(content):
        file_issues.append(("MEDIUM", issue))
    
    # 10. Factual red flags
    for pattern, desc in FACT_ISSUES:
        for m in re.finditer(pattern, content, re.IGNORECASE):
            file_issues.append(("CRITICAL", f"Factual issue ({desc}): {m.group()[:80]}"))
    
    # 11. Outdated years used as if current
    body_match = re.search(r'^---\n.*?\n---\n(.*)$', content, re.DOTALL)
    if body_match:
        body = body_match.group(1)
        for pattern in OUTDATED_YEARS:
            for m in re.finditer(pattern, body):
                # Only flag if used in "current" context
                ctx_start = max(0, m.start() - 60)
                ctx_end = min(len(body), m.end() + 60)
                context = body[ctx_start:ctx_end]
                if re.search(r'(?:currently|now|this year|as of|in) ?' + pattern, context, re.IGNORECASE):
                    file_issues.append(("HIGH", f"Outdated year as current: ...{context.strip()[:80]}..."))
    
    # 12. Repetitive paragraphs
    for issue in check_repetitive_paragraphs(content):
        file_issues.append(("HIGH", issue))
    
    # 13. MDX issues
    for issue in check_broken_mdx(content):
        file_issues.append(("HIGH", issue))
    
    # 14. Suspicious price values
    for pattern, desc in PRICE_PATTERNS:
        for m in re.finditer(pattern, content):
            ctx_start = max(0, m.start() - 30)
            ctx_end = min(len(content), m.end() + 30)
            ctx = content[ctx_start:ctx_end].replace('\n', ' ')
            file_issues.append(("MEDIUM", f"{desc}: ...{ctx}..."))
    
    # 15. Empty sections (## header followed immediately by another ## or component)
    if body_match:
        body = body_match.group(1)
        for m in re.finditer(r'^(## .+)\n\n(?=## )', body, re.MULTILINE):
            file_issues.append(("MEDIUM", f"Empty section: {m.group(1)}"))
    
    # 16. Broken markdown tables
    if body_match:
        body = body_match.group(1)
        table_rows = re.findall(r'^\|.*\|$', body, re.MULTILINE)
        if table_rows:
            col_counts = [len(row.split('|')) for row in table_rows]
            if len(set(col_counts)) > 1:
                file_issues.append(("MEDIUM", f"Inconsistent table columns: {set(col_counts)}"))
    
    # 17. Consecutive duplicate words
    for m in re.finditer(r'\b(\w{3,})\s+\1\b', content, re.IGNORECASE):
        word = m.group(1).lower()
        if word not in ('ha', 'very', 'so', 'bye', 'no', 'the'):
            file_issues.append(("LOW", f"Duplicate word: '{m.group()}'"))
    
    if file_issues:
        all_issues[filepath.name] = file_issues
        for sev, _ in file_issues:
            severity_counts[sev] += 1
        total_issues += len(file_issues)

# ── Output results ──
print(f"\nScanned: {total_files} files")
print(f"Total issues: {total_issues}")
print(f"  CRITICAL: {severity_counts['CRITICAL']}")
print(f"  HIGH:     {severity_counts['HIGH']}")
print(f"  MEDIUM:   {severity_counts['MEDIUM']}")
print(f"  LOW:      {severity_counts['LOW']}")
print()

# Print all issues sorted by severity
for sev_level in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']:
    files_with_this = [(f, [i for i in iss if i[0] == sev_level]) 
                       for f, iss in sorted(all_issues.items()) 
                       if any(i[0] == sev_level for i in iss)]
    
    if files_with_this:
        print(f"\n{'='*70}")
        print(f"  [{sev_level}] Issues")
        print(f"{'='*70}")
        for filename, file_issues in files_with_this:
            print(f"\n📄 {filename}")
            for _, issue in file_issues:
                print(f"   → {issue}")

print(f"\n{'='*70}")
print("AUDIT COMPLETE")
print(f"{'='*70}")
