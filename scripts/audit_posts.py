#!/usr/bin/env python3
"""
Full quality audit script for batch-generated blog posts.
Checks for: broken ₩ symbols, missing frontmatter fields, encoding errors,
fake phone numbers, MDX component issues, and more.
"""

import os
import re
import json
from pathlib import Path
from datetime import datetime

CONTENT_DIR = Path(__file__).parent.parent / "content" / "posts"

# Posts generated today (2026-02-08) - check by file modification time
AUDIT_DATE = "2026-02-08"

issues_summary = {
    "broken_won": [],        # ₩ symbol issues
    "missing_tags": [],      # missing tags field
    "missing_readtime": [],  # missing readTime field
    "encoding_errors": [],   # ?? or other encoding artifacts
    "fake_phones": [],       # placeholder phone numbers
    "truncated_title": [],   # title issues
    "mdx_syntax": [],        # MDX component syntax issues
    "price_inconsistency": [],  # contradictory prices
    "missing_frontmatter": [],  # other missing frontmatter
    "empty_sections": [],    # empty or very short sections
    "broken_links": [],      # malformed links
    "other": [],
}

def parse_frontmatter(content):
    """Parse YAML frontmatter from markdown content."""
    if not content.startswith("---"):
        return None, content
    end = content.find("---", 3)
    if end == -1:
        return None, content
    fm_text = content[3:end].strip()
    fm = {}
    current_key = None
    current_value = []
    
    for line in fm_text.split("\n"):
        # Check for key: value pattern
        match = re.match(r'^(\w[\w\s]*?):\s*(.*)', line)
        if match and not line.startswith("  ") and not line.startswith("\t"):
            if current_key:
                val = "\n".join(current_value).strip()
                fm[current_key] = val
            current_key = match.group(1).strip()
            current_value = [match.group(2).strip()]
        else:
            if current_key:
                current_value.append(line)
    
    if current_key:
        val = "\n".join(current_value).strip()
        fm[current_key] = val
    
    body = content[end+3:].strip()
    return fm, body

def check_won_symbol(content, filename):
    """Check for broken ₩ (Won) symbols."""
    issues = []
    
    # Pattern: number without ₩ that looks like a Korean price
    # e.g., "1,400" in price context without ₩
    # Check for ",400" or similar patterns that suggest missing ₩
    
    # Check if file mentions Korean prices but ₩ is absent or broken
    has_price_context = bool(re.search(r'(price|cost|won|krw|budget|fee|charge|fare|₩)', content, re.IGNORECASE))
    
    if has_price_context:
        # Check for ₩ followed by nothing or broken
        broken_patterns = [
            (r'(?<!\w)₩\s*(?=\s|$|[^0-9,.])', "₩ symbol with no number following"),
            (r'(?<![₩\w])\d{1,3}(,\d{3})+\s*(won|KRW)', "Number with 'won/KRW' suffix instead of ₩ prefix"),
        ]
        for pattern, desc in broken_patterns:
            matches = re.finditer(pattern, content)
            for m in matches:
                line_num = content[:m.start()].count('\n') + 1
                issues.append(f"Line {line_num}: {desc} - '{m.group()}'")
    
    # Check for ?? which often indicates encoding issues with ₩
    if '??' in content and '???' not in content:  # ??? might be intentional
        for i, line in enumerate(content.split('\n'), 1):
            if '??' in line and '???' not in line:
                issues.append(f"Line {i}: Possible encoding error '??' - '{line.strip()[:80]}'")
    
    return issues

def check_frontmatter(fm, filename):
    """Check for missing or problematic frontmatter fields."""
    issues = []
    required = ['title', 'excerpt', 'date', 'category', 'author']
    recommended = ['tags', 'readTime', 'featured']
    
    if fm is None:
        issues.append("CRITICAL: No frontmatter found!")
        return issues
    
    for field in required:
        if field not in fm or not fm[field]:
            issues.append(f"CRITICAL: Missing required field '{field}'")
    
    for field in recommended:
        if field not in fm or not fm[field]:
            issues.append(f"WARNING: Missing recommended field '{field}'")
    
    # Check title length
    title = fm.get('title', '')
    if title:
        # Remove quotes
        title = title.strip("'\"")
        if len(title) > 70:
            issues.append(f"Title too long ({len(title)} chars): {title[:50]}...")
    
    # Check excerpt length
    excerpt = fm.get('excerpt', '')
    if excerpt:
        excerpt = excerpt.strip("'\"")
        if len(excerpt) > 160:
            issues.append(f"Excerpt too long ({len(excerpt)} chars)")
    
    return issues

def check_encoding(content, filename):
    """Check for encoding artifacts."""
    issues = []
    
    # Common encoding issues
    patterns = [
        (r'\?\?(?!\?)', "Double question mark (possible encoding error)"),
        (r'â€™', "Broken UTF-8 apostrophe"),
        (r'â€"', "Broken UTF-8 em-dash"),
        (r'â€œ', "Broken UTF-8 left quote"),
        (r'â€\x9d', "Broken UTF-8 right quote"),
        (r'Ã©', "Broken UTF-8 accented e"),
        (r'Ã¼', "Broken UTF-8 accented u"),
    ]
    
    for pattern, desc in patterns:
        matches = list(re.finditer(pattern, content))
        if matches:
            for m in matches[:3]:  # Show first 3 occurrences
                line_num = content[:m.start()].count('\n') + 1
                context = content[max(0,m.start()-20):m.end()+20].replace('\n', ' ')
                issues.append(f"Line {line_num}: {desc} - '...{context}...'")
    
    return issues

def check_fake_phones(content, filename):
    """Check for obviously fake phone numbers."""
    issues = []
    
    fake_patterns = [
        r'\+82-\d-1234-\d{4}',
        r'\+82-\d-0000-\d{4}',
        r'\+82-\d-5678-\d{4}',
        r'02-1234-\d{4}',
        r'010-1234-\d{4}',
        r'XXX-XXXX',
    ]
    
    for pattern in fake_patterns:
        matches = list(re.finditer(pattern, content))
        for m in matches:
            line_num = content[:m.start()].count('\n') + 1
            issues.append(f"Line {line_num}: Fake phone number detected: '{m.group()}'")
    
    return issues

def check_mdx_syntax(content, filename):
    """Check for MDX component syntax issues."""
    issues = []
    
    # Check for unclosed MDX components
    components = ['KeyTakeaways', 'QuickFacts', 'StatCard', 'FAQAccordion', 
                  'InfoBox', 'ComparisonTable', 'ExpertTip', 'PriceTable',
                  'LocationCard', 'ProsCons', 'StepGuide', 'Timeline',
                  'BeforeAfter', 'PriceComparisonChart', 'ImageGallery',
                  'ResponsiveTable', 'DualismRoute']
    
    for comp in components:
        opens = len(re.findall(f'<{comp}[\\s>]', content))
        closes = len(re.findall(f'</{comp}>', content))
        self_closing = len(re.findall(f'<{comp}[^>]*/>', content))
        
        effective_opens = opens - self_closing
        if effective_opens != closes:
            issues.append(f"Mismatched <{comp}>: {opens} opens ({self_closing} self-closing), {closes} closes")
    
    # Check for broken JSX attributes (missing quotes, etc.)
    jsx_issues = re.findall(r'<\w+[^>]*=[^"\'{\s][^>]*>', content)
    for issue in jsx_issues[:3]:
        if not re.match(r'<(img|br|hr|link|meta)', issue):
            line_num = content.find(issue)
            if line_num >= 0:
                line_num = content[:line_num].count('\n') + 1
                issues.append(f"Line {line_num}: Possible broken JSX attribute: '{issue[:60]}'")
    
    return issues

def check_content_quality(body, filename):
    """Check general content quality issues."""
    issues = []
    
    # Check for very short content
    word_count = len(body.split())
    if word_count < 500:
        issues.append(f"Content too short: {word_count} words (expected 2000+)")
    elif word_count < 1500:
        issues.append(f"Content somewhat short: {word_count} words (expected 2000+)")
    
    # Check for duplicate paragraphs
    paragraphs = [p.strip() for p in body.split('\n\n') if p.strip() and len(p.strip()) > 50]
    seen = set()
    for p in paragraphs:
        normalized = p.lower().strip()[:100]
        if normalized in seen:
            issues.append(f"Duplicate paragraph detected: '{p[:60]}...'")
        seen.add(normalized)
    
    # Check for placeholder text
    placeholders = ['[INSERT', '[TODO', '[PLACEHOLDER', 'Lorem ipsum', 'TBD', 'FIXME']
    for ph in placeholders:
        if ph.lower() in body.lower():
            issues.append(f"Placeholder text found: '{ph}'")
    
    # Check for empty headings
    empty_headings = re.findall(r'^#{1,6}\s*$', body, re.MULTILINE)
    if empty_headings:
        issues.append(f"Empty headings found: {len(empty_headings)}")
    
    return issues

def check_price_consistency(content, filename):
    """Check for price inconsistencies within the same post."""
    issues = []
    
    # Find all ₩ prices
    prices = {}
    lines = content.split('\n')
    for i, line in enumerate(lines, 1):
        # Find prices like ₩1,400 or ₩50,000
        found = re.findall(r'₩([\d,]+)', line)
        for price in found:
            price_val = price.replace(',', '')
            if price_val.isdigit():
                val = int(price_val)
                # Look for context (nearby text)
                context = line.strip()[:80]
                if val not in prices:
                    prices[val] = []
                prices[val].append((i, context))
    
    # Check for the same item mentioned with different prices
    # This is a simple heuristic - look for "base fare" or "starting" type phrases
    base_fare_prices = []
    for i, line in enumerate(lines, 1):
        match = re.search(r'(base fare|기본[요금]|starting|minimum)\D*₩([\d,]+)', line, re.IGNORECASE)
        if match:
            price = match.group(2).replace(',', '')
            base_fare_prices.append((int(price), i, line.strip()[:80]))
    
    if len(base_fare_prices) > 1:
        unique_prices = set(p[0] for p in base_fare_prices)
        if len(unique_prices) > 1:
            details = "; ".join([f"Line {p[1]}: ₩{p[0]:,}" for p in base_fare_prices])
            issues.append(f"Inconsistent base prices: {details}")
    
    return issues

def get_today_posts():
    """Get all posts modified today."""
    today_posts = []
    for f in CONTENT_DIR.glob("*.md"):
        mtime = datetime.fromtimestamp(f.stat().st_mtime)
        if mtime.strftime("%Y-%m-%d") == AUDIT_DATE:
            today_posts.append(f)
    return sorted(today_posts, key=lambda f: f.stat().st_mtime)

def audit_single_post(filepath):
    """Run all checks on a single post."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fm, body = parse_frontmatter(content)
    filename = filepath.name
    
    all_issues = {}
    
    # Run all checks
    fm_issues = check_frontmatter(fm, filename)
    if fm_issues:
        all_issues['frontmatter'] = fm_issues
    
    won_issues = check_won_symbol(content, filename)
    if won_issues:
        all_issues['won_symbol'] = won_issues
    
    enc_issues = check_encoding(content, filename)
    if enc_issues:
        all_issues['encoding'] = enc_issues
    
    phone_issues = check_fake_phones(content, filename)
    if phone_issues:
        all_issues['fake_phones'] = phone_issues
    
    mdx_issues = check_mdx_syntax(content, filename)
    if mdx_issues:
        all_issues['mdx_syntax'] = mdx_issues
    
    quality_issues = check_content_quality(body, filename)
    if quality_issues:
        all_issues['quality'] = quality_issues
    
    price_issues = check_price_consistency(content, filename)
    if price_issues:
        all_issues['price_consistency'] = price_issues
    
    return all_issues

def main():
    posts = get_today_posts()
    print(f"=== Blog Post Quality Audit ({AUDIT_DATE}) ===")
    print(f"Found {len(posts)} posts modified today\n")
    
    total_issues = 0
    critical_count = 0
    warning_count = 0
    files_with_issues = 0
    
    # Category tallies
    issue_tallies = {
        'frontmatter': 0,
        'won_symbol': 0,
        'encoding': 0,
        'fake_phones': 0,
        'mdx_syntax': 0,
        'quality': 0,
        'price_consistency': 0,
    }
    
    all_results = []
    
    for post in posts:
        issues = audit_single_post(post)
        mtime = datetime.fromtimestamp(post.stat().st_mtime).strftime("%H:%M")
        
        if issues:
            files_with_issues += 1
            issue_count = sum(len(v) for v in issues.values())
            total_issues += issue_count
            
            print(f"\n{'='*70}")
            print(f"📄 {post.name} (modified {mtime})")
            print(f"{'='*70}")
            
            for category, issue_list in issues.items():
                issue_tallies[category] = issue_tallies.get(category, 0) + 1
                for issue in issue_list:
                    if 'CRITICAL' in issue:
                        critical_count += 1
                        print(f"  🔴 [{category}] {issue}")
                    elif 'WARNING' in issue:
                        warning_count += 1
                        print(f"  🟡 [{category}] {issue}")
                    else:
                        print(f"  🔵 [{category}] {issue}")
            
            all_results.append({
                'file': post.name,
                'mtime': mtime,
                'issues': issues,
                'count': issue_count
            })
        else:
            all_results.append({
                'file': post.name,
                'mtime': mtime,
                'issues': {},
                'count': 0
            })
    
    # Summary
    print(f"\n\n{'='*70}")
    print(f"📊 AUDIT SUMMARY")
    print(f"{'='*70}")
    print(f"Total posts audited: {len(posts)}")
    print(f"Posts with issues: {files_with_issues}")
    print(f"Total issues found: {total_issues}")
    print(f"  🔴 Critical: {critical_count}")
    print(f"  🟡 Warning: {warning_count}")
    print(f"  🔵 Info: {total_issues - critical_count - warning_count}")
    print(f"\nIssue categories (files affected):")
    for cat, count in sorted(issue_tallies.items(), key=lambda x: -x[1]):
        if count > 0:
            print(f"  - {cat}: {count} files")
    
    # Write detailed results to JSON
    output_path = Path(__file__).parent / "audit-results.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({
            'date': AUDIT_DATE,
            'total_posts': len(posts),
            'files_with_issues': files_with_issues,
            'total_issues': total_issues,
            'critical': critical_count,
            'warnings': warning_count,
            'results': all_results,
        }, f, ensure_ascii=False, indent=2)
    print(f"\nDetailed results saved to: {output_path}")

if __name__ == '__main__':
    main()
