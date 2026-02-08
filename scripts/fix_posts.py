#!/usr/bin/env python3
"""
Batch fix script for all audit issues found in blog posts.
Fixes: frontmatter, KRW→₩, MDX syntax, fake phones, encoding.
"""

import os
import re
import math
from pathlib import Path
from datetime import datetime

CONTENT_DIR = Path(__file__).parent.parent / "content" / "posts"
AUDIT_DATE = "2026-02-08"

stats = {
    'frontmatter_fixed': 0,
    'krw_fixed': 0,
    'mdx_fixed': 0,
    'phones_fixed': 0,
    'encoding_fixed': 0,
    'files_modified': 0,
}

def get_today_posts():
    today_posts = []
    for f in CONTENT_DIR.glob("*.md"):
        mtime = datetime.fromtimestamp(f.stat().st_mtime)
        if mtime.strftime("%Y-%m-%d") == AUDIT_DATE:
            today_posts.append(f)
    return sorted(today_posts, key=lambda f: f.stat().st_mtime)

def estimate_read_time(content):
    """Estimate read time based on word count (~200 words/min for technical content)."""
    word_count = len(content.split())
    minutes = max(5, math.ceil(word_count / 200))
    return f"{minutes} min read"

def generate_tags(frontmatter_text, body):
    """Generate relevant tags based on content analysis."""
    # Common tag categories
    tag_keywords = {
        'Korean Food': ['food', 'restaurant', 'bbq', 'kimchi', 'ramyeon', 'noodle', 'street food', 'cafe', 'coffee', 'dining', 'eat', 'cook', 'recipe', 'snack', 'drink', 'soju', 'makgeolli'],
        'Seoul': ['seoul', 'gangnam', 'myeongdong', 'hongdae', 'itaewon', 'insadong', 'dongdaemun', 'namdaemun', 'bukchon', 'jongno'],
        'K-Beauty': ['beauty', 'skincare', 'cosmetic', 'makeup', 'skin', 'moisturizer', 'serum', 'k-beauty', 'kbeauty', 'derma'],
        'K-Pop': ['kpop', 'k-pop', 'idol', 'bts', 'blackpink', 'concert', 'photocard', 'fandom', 'fan'],
        'Shopping': ['shopping', 'shop', 'store', 'market', 'buy', 'purchase', 'brand', 'fashion', 'outlet', 'mall'],
        'Medical Tourism': ['medical', 'clinic', 'hospital', 'surgery', 'plastic surgery', 'dermatolog', 'dental', 'health', 'treatment', 'cosmetic surgery'],
        'Travel Tips': ['travel', 'trip', 'itinerary', 'guide', 'budget', 'hotel', 'accommodation', 'transport', 'subway', 'taxi', 'airport'],
        'Korean Culture': ['culture', 'tradition', 'temple', 'hanbok', 'confuci', 'palace', 'history', 'museum', 'festival'],
        'Busan': ['busan', 'haeundae', 'gamcheon', 'jagalchi'],
        'Jeju': ['jeju', 'hallasan'],
        'Budget Travel': ['budget', 'cheap', 'affordable', 'free', 'save', 'discount', 'deal'],
        'Nightlife': ['nightlife', 'bar', 'club', 'pub', 'night', 'drinking'],
        'Nature': ['nature', 'hiking', 'mountain', 'park', 'trail', 'beach', 'island'],
        'K-Drama': ['kdrama', 'k-drama', 'drama', 'filming', 'location'],
        'Technology': ['tech', 'app', 'digital', 'kiosk', 'phone', 'internet', 'wifi'],
        'Accommodation': ['hotel', 'hostel', 'airbnb', 'guesthouse', 'hanok', 'accommodation', 'stay'],
        'Wellness': ['spa', 'jjimjilbang', 'sauna', 'massage', 'yoga', 'meditation', 'wellnes'],
        'Photography': ['photo', 'instagram', 'camera', 'selfie'],
    }
    
    combined = (frontmatter_text + " " + body).lower()
    matched_tags = []
    
    for tag, keywords in tag_keywords.items():
        for kw in keywords:
            if kw in combined:
                matched_tags.append(tag)
                break
    
    # Limit to 5 most relevant tags
    return matched_tags[:5] if matched_tags else ['Korea Travel']

def fix_frontmatter(content, filepath):
    """Add missing tags, readTime, featured fields to frontmatter."""
    if not content.startswith("---"):
        return content, False
    
    end = content.find("---", 3)
    if end == -1:
        return content, False
    
    fm_text = content[3:end]
    body = content[end+3:]
    modified = False
    
    # Check and add missing fields
    if 'tags:' not in fm_text:
        tags = generate_tags(fm_text, body)
        tags_str = '\ntags:\n' + '\n'.join(f'  - "{t}"' for t in tags)
        fm_text = fm_text.rstrip() + tags_str + '\n'
        modified = True
    
    if 'readTime:' not in fm_text:
        read_time = estimate_read_time(body)
        fm_text = fm_text.rstrip() + f'\nreadTime: "{read_time}"\n'
        modified = True
    
    if 'featured:' not in fm_text:
        fm_text = fm_text.rstrip() + '\nfeatured: false\n'
        modified = True
    
    if modified:
        stats['frontmatter_fixed'] += 1
        return f"---{fm_text}---{body}", True
    
    return content, False

def fix_krw_symbols(content):
    """Convert 'number KRW' to '₩number' format."""
    original = content
    
    # Pattern: standalone number followed by KRW/Won
    # e.g., "50,000 KRW" → "₩50,000"
    # But NOT inside frontmatter or code blocks
    
    # Split into frontmatter and body
    if content.startswith("---"):
        end = content.find("---", 3)
        if end != -1:
            fm = content[:end+3]
            body = content[end+3:]
        else:
            fm = ""
            body = content
    else:
        fm = ""
        body = content
    
    # Fix patterns in body only
    # "50,000 KRW" → "₩50,000"
    body = re.sub(r'(\d[\d,]+)\s*KRW\b', r'₩\1', body)
    
    # "50,000 won" → "₩50,000" (case insensitive, but not "Korean won" etc.)
    body = re.sub(r'(\d[\d,]+)\s+won\b(?!\s+(?:currency|unit|is|was|are|were))', r'₩\1', body, flags=re.IGNORECASE)
    
    result = fm + body
    if result != original:
        stats['krw_fixed'] += 1
    return result

def fix_mdx_syntax(content, filename):
    """Fix unclosed MDX component tags."""
    original = content
    
    # Map of files to their specific MDX fixes
    mdx_fixes = {
        'korean-book-stores-english-section-guide.md': ('QuickFacts', '</QuickFacts>'),
        'chronic-pain-management-integrating-traditional-medicine-and-modern-tech-2026.md': ('Timeline', '</Timeline>'),
        'collecting-k-pop-photocards-the-global-market-and-trading-etiquette-2026.md': ('QuickFacts', '</QuickFacts>'),
        'korean-clinic-payment-methods-insurance-credit-cards-and-refunds.md': ('ComparisonTable', '</ComparisonTable>'),
        'korean-ginseng-and-health-tonics-what-to-buy-for-energy-2026.md': ('StepGuide', '</StepGuide>'),
        'foreign-friendly-kiosk-survival-guide-what-to-do-when-your-overseas-credit-card-is-rejected.md': ('QuickFacts', '</QuickFacts>'),
        'korean-home-fragrance-and-candles-bringing-the-seoul-scent-home-2026.md': ('ProsCons', '</ProsCons>'),
        'online-shopping-in-korea-coupang-vs-gmarket.md': ('StepGuide', '</StepGuide>'),
        'vegan-k-beauty-brands-the-best-animal-free-skincare-2026.md': ('QuickFacts', '</QuickFacts>'),
        'airport-limousine-bus-vs-arex-express-train.md': ('DualismRoute', '</DualismRoute>'),
    }
    
    if filename in mdx_fixes:
        comp_name, closing_tag = mdx_fixes[filename]
        opens = len(re.findall(f'<{comp_name}[\\s>]', content))
        closes = len(re.findall(f'</{comp_name}>', content))
        self_closing = len(re.findall(f'<{comp_name}[^>]*/>', content))
        
        effective_opens = opens - self_closing
        missing = effective_opens - closes
        
        if missing > 0:
            # Find the last opening tag and add closing tag after the content block
            # Strategy: find the opening tag, then find the next ## heading or end of file
            pattern = f'<{comp_name}[\\s>][^/]*?>'
            matches = list(re.finditer(pattern, content))
            
            for i in range(missing):
                # Work from the last unclosed tag
                idx = len(matches) - 1 - i
                if idx < 0:
                    break
                    
                match = matches[idx]
                start_pos = match.end()
                
                # Find the next ## heading after this opening tag
                next_heading = re.search(r'\n##\s', content[start_pos:])
                if next_heading:
                    insert_pos = start_pos + next_heading.start()
                    content = content[:insert_pos] + f'\n{closing_tag}\n' + content[insert_pos:]
                else:
                    # Add before EOF
                    content = content.rstrip() + f'\n\n{closing_tag}\n'
    
    if content != original:
        stats['mdx_fixed'] += 1
    return content

def fix_fake_phones(content, filename):
    """Remove or replace fake phone numbers."""
    original = content
    
    # Replace fake phone numbers with a generic note
    fake_patterns = [
        (r'\+82-\d-1234-\d{4}', '(check official website for phone number)'),
        (r'\+82-\d-0000-\d{4}', '(check official website for phone number)'),
        (r'02-1234-\d{4}', '(check official website for phone number)'),
        (r'010-1234-\d{4}', '(check official website for phone number)'),
    ]
    
    for pattern, replacement in fake_patterns:
        content = re.sub(pattern, replacement, content)
    
    if content != original:
        stats['phones_fixed'] += 1
    return content

def fix_encoding(content, filename):
    """Fix encoding artifacts."""
    original = content
    
    # Fix common encoding issues
    # ?? often replaces em-dash or other special chars
    if filename == 'k-fandom-economy-where-to-find-limited-edition-goods-without-a-fan-club-membership.md':
        content = content.replace('??sometimes', '— sometimes')
        content = content.replace('??and', '— and')
        content = content.replace('??5,000', '₩5,000')
        content = re.sub(r'(?<!\?)\?\?(?!\?)', '—', content)
    
    if content != original:
        stats['encoding_fixed'] += 1
    return content

def main():
    posts = get_today_posts()
    print(f"=== Batch Fix Script ({AUDIT_DATE}) ===")
    print(f"Processing {len(posts)} posts...\n")
    
    for post in posts:
        content_original = post.read_text(encoding='utf-8')
        content = content_original
        filename = post.name
        
        # Apply all fixes
        content, fm_changed = fix_frontmatter(content, post)
        content = fix_krw_symbols(content)
        content = fix_mdx_syntax(content, filename)
        content = fix_fake_phones(content, filename)
        content = fix_encoding(content, filename)
        
        # Write back if changed
        if content != content_original:
            post.write_text(content, encoding='utf-8')
            stats['files_modified'] += 1
            print(f"  ✅ Fixed: {filename}")
    
    print(f"\n{'='*50}")
    print(f"📊 FIX SUMMARY")
    print(f"{'='*50}")
    print(f"Files modified: {stats['files_modified']}")
    print(f"Frontmatter fixed: {stats['frontmatter_fixed']}")
    print(f"KRW→₩ fixed: {stats['krw_fixed']}")
    print(f"MDX syntax fixed: {stats['mdx_fixed']}")
    print(f"Fake phones fixed: {stats['phones_fixed']}")
    print(f"Encoding fixed: {stats['encoding_fixed']}")

if __name__ == '__main__':
    main()
