"""
Batch fix for 337 files missing tags/readTime and 324 files with KRW.
Also fixes the 1 placeholder text.
"""
import re, json, math
from pathlib import Path
from collections import Counter

POSTS_DIR = Path('content/posts')
PROGRESS = json.load(open('scripts/generation-progress.json', 'r', encoding='utf-8'))

# Category -> tag mapping
CATEGORY_TAGS = {
    'Food & Dining': ['Korean Food', 'Seoul', 'Korean Culture', 'Travel Tips', 'Restaurant Guide'],
    'K-Culture': ['K-Pop', 'K-Drama', 'Korean Culture', 'Seoul', 'Hallyu'],
    'Living in Korea': ['Expat Life', 'Seoul', 'Korean Culture', 'Visa', 'Living Abroad'],
    'Medical Tourism': ['Medical Tourism', 'Seoul', 'Plastic Surgery', 'K-Beauty', 'Healthcare'],
    'Shopping & K-Beauty': ['K-Beauty', 'Shopping', 'Seoul', 'Skincare', 'Korean Fashion'],
    'Travel & Tourism': ['Travel Tips', 'Seoul', 'Korea Travel', 'Tourism', 'Budget Travel'],
}

# Specific keyword -> extra tags
KEYWORD_TAGS = {
    'busan': 'Busan',
    'jeju': 'Jeju',
    'gangnam': 'Gangnam',
    'bbq': 'Korean BBQ',
    'kimchi': 'Kimchi',
    'skincare': 'Skincare',
    'kpop': 'K-Pop',
    'k-pop': 'K-Pop',
    'kdrama': 'K-Drama',
    'k-drama': 'K-Drama',
    'hanbok': 'Hanbok',
    'temple': 'Temple Stay',
    'visa': 'Visa',
    'apartment': 'Housing',
    'subway': 'Transportation',
    'taxi': 'Transportation',
    'coffee': 'Coffee',
    'street food': 'Street Food',
    'halal': 'Halal',
    'vegan': 'Vegan',
    'vegetarian': 'Vegetarian',
    'budget': 'Budget Travel',
    'hiking': 'Hiking',
    'nightlife': 'Nightlife',
    'soju': 'Soju',
    'makgeolli': 'Makgeolli',
    'dental': 'Dental',
    'hair transplant': 'Hair Transplant',
    'botox': 'Botox',
    'filler': 'Fillers',
    'olive young': 'Olive Young',
    'myeongdong': 'Myeongdong',
    'hongdae': 'Hongdae',
    'itaewon': 'Itaewon',
    'insadong': 'Insadong',
    'dmz': 'DMZ',
    'cherry blossom': 'Cherry Blossom',
    'autumn': 'Autumn',
    'winter': 'Winter',
    'noodle': 'Noodles',
    'market': 'Markets',
    'duty free': 'Duty Free',
    'phone': 'Phone',
    'sim card': 'SIM Card',
    'bank': 'Banking',
    'webtoon': 'Webtoon',
    'esport': 'Esports',
    'concert': 'Concert',
    'photo': 'Photography',
}

fixes = {'tags': 0, 'readTime': 0, 'featured': 0, 'krw': 0, 'placeholder': 0}

for filepath in sorted(POSTS_DIR.glob('*.md')):
    content = filepath.read_text(encoding='utf-8')
    original = content
    
    fm_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not fm_match:
        continue
    
    fm = fm_match.group(1)
    fm_end = fm_match.end()
    body_after = content[fm_end:]
    
    changed = False
    
    # 1. Add tags if missing
    if not re.search(r'^tags:', fm, re.MULTILINE):
        # Determine category
        cat_match = re.search(r'^category:\s*(.+)$', fm, re.MULTILINE)
        category = cat_match.group(1).strip() if cat_match else ''
        
        # Base tags from category
        base_tags = CATEGORY_TAGS.get(category, ['Korean Culture', 'Seoul', 'Travel Tips'])
        
        # Additional tags from content keywords
        content_lower = content.lower()
        extra_tags = set()
        for keyword, tag in KEYWORD_TAGS.items():
            if keyword in content_lower:
                extra_tags.add(tag)
        
        # Combine, deduplicate, limit to 5-7
        all_tags = list(dict.fromkeys(base_tags + sorted(extra_tags)))[:7]
        
        tags_yaml = 'tags:\n' + '\n'.join(f'  - "{tag}"' for tag in all_tags)
        
        # Insert before --- closing
        fm = fm + '\n' + tags_yaml
        changed = True
        fixes['tags'] += 1
    
    # 2. Add readTime if missing
    if not re.search(r'^readTime:', fm, re.MULTILINE):
        # Calculate from word count
        body_match = re.search(r'^---\n.*?\n---\n(.*)$', content, re.DOTALL)
        if body_match:
            words = len(body_match.group(1).split())
            minutes = max(5, math.ceil(words / 200))
            fm = fm + f'\nreadTime: "{minutes} min read"'
            changed = True
            fixes['readTime'] += 1
    
    # 3. Add featured if missing
    if not re.search(r'^featured:', fm, re.MULTILINE):
        fm = fm + '\nfeatured: false'
        changed = True
        fixes['featured'] += 1
    
    if changed:
        content = f'---\n{fm}\n---{body_after}'
    
    # 4. KRW → ₩ conversion
    # Pattern: "X,XXX KRW" or "KRW X,XXX" or "X KRW"
    def replace_krw(text):
        count = 0
        # "1,000 KRW" → "₩1,000"
        def sub1(m):
            nonlocal count
            count += 1
            return f'₩{m.group(1)}'
        text = re.sub(r'(\d[\d,]*(?:\.\d+)?)\s*KRW\b', sub1, text)
        
        # "KRW 1,000" → "₩1,000"
        def sub2(m):
            nonlocal count
            count += 1
            return f'₩{m.group(1)}'
        text = re.sub(r'\bKRW\s*(\d[\d,]*(?:\.\d+)?)', sub2, text)
        
        # Standalone "KRW" in prose (not in numbers)
        # "Korean won (KRW)" → "Korean won (₩)"
        text = re.sub(r'\(KRW\)', '(₩)', text)
        
        return text, count
    
    content, krw_count = replace_krw(content)
    if krw_count > 0:
        fixes['krw'] += krw_count
    
    # 5. Fix placeholder text: [Clinic Name]
    if '[Clinic Name]' in content:
        # Replace with generic appropriate text
        content = content.replace('[Clinic Name]', 'the clinic name')
        fixes['placeholder'] += 1
    
    if content != original:
        filepath.write_text(content, encoding='utf-8')

print("=" * 60)
print("BATCH FIX COMPLETE")
print("=" * 60)
print(f"Tags added:      {fixes['tags']} files")
print(f"readTime added:  {fixes['readTime']} files")
print(f"featured added:  {fixes['featured']} files")
print(f"KRW → ₩:        {fixes['krw']} replacements")
print(f"Placeholders:    {fixes['placeholder']} fixes")
