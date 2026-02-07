import sys, os, re, glob, json
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

posts_dir = r'C:\kc\korea-experience\content\posts'
deep_dir = r'C:\kc\korea-experience\content\deep-dive'

# Load batch slugs
with open(r'C:\kc\korea-experience\scripts\generation-progress.json', encoding='utf-8') as f:
    progress = json.load(f)

def title_to_slug(title):
    slug = title.lower().strip()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')

batch_slugs = set()
for k, v in progress.items():
    if v:
        t = k.split(':', 1)[1] if ':' in k else k
        batch_slugs.add(title_to_slug(t))

# Build metadata for ALL posts
all_posts = {}
stop = {'the','a','an','in','of','to','for','and','or','is','it','as','at','by','on','with','from',
        'your','how','what','why','when','where','best','top','guide','complete','ultimate','tips',
        '2026','2025','korea','korean','seoul','new','also','about','more','than','just','every',
        'like','most','many','can','will','has','had','have','not','but','all','been','their','our',
        'into','you','its','get','one','two','that','this','are','was','were','should'}

for d in [posts_dir, deep_dir]:
    for fpath in glob.glob(os.path.join(d, '*.md')):
        slug = os.path.basename(fpath).replace('.md', '')
        try:
            with open(fpath, encoding='utf-8-sig') as f:
                raw = f.read(600)
        except:
            with open(fpath, encoding='utf-8', errors='replace') as f:
                raw = f.read(600)
        
        title_m = re.search(r'title:\s*["\']?(.+?)["\']?\s*$', raw, re.MULTILINE)
        cat_m = re.search(r'category:\s*["\']?(.+?)["\']?\s*$', raw, re.MULTILINE)
        title = title_m.group(1).strip('"\'') if title_m else slug
        category = cat_m.group(1).strip('"\'') if cat_m else 'Other'
        keywords = set(re.findall(r'[a-z]{3,}', slug)) | set(re.findall(r'[a-z]{3,}', title.lower()))
        keywords -= stop
        all_posts[slug] = {'title': title, 'category': category, 'keywords': keywords}

print(f"메타데이터 로드: {len(all_posts)}개 포스트, 배치 대상: {len(batch_slugs)}개")

def find_related(target_slug, n=4):
    target = all_posts.get(target_slug)
    if not target: return []
    scores = []
    for slug, meta in all_posts.items():
        if slug == target_slug: continue
        overlap = len(target['keywords'] & meta['keywords'])
        cat_bonus = 2 if meta['category'] == target['category'] else 0
        score = overlap + cat_bonus
        if score >= 3:
            scores.append((slug, score, meta['title']))
    scores.sort(key=lambda x: -x[1])
    return scores[:n]

JSX_RE = re.compile(r'^<(KeyTakeaways|QuickFacts|FAQAccordion|Timeline|StepGuide|ProsCons|PriceTable|ComparisonTable|InfoBox|ExpertTip|StatCard|LocationCard)\b')

def find_safe_lines(lines):
    """Find paragraph lines NOT inside JSX blocks"""
    safe = []
    in_jsx = False
    for i, line in enumerate(lines):
        s = line.strip()
        if JSX_RE.match(s):
            in_jsx = True
        if in_jsx:
            if s.endswith('/>'):
                in_jsx = False
            continue
        if (len(s) > 60 and not s.startswith('#') and not s.startswith('<') and 
            not s.startswith('-') and not s.startswith('*') and not s.startswith('|') and
            not s.startswith('```') and not s.startswith('>') and not s.startswith('!') and
            not re.match(r'^\d+\.', s) and '](/blog/' not in s and '](http' not in s):
            safe.append(i)
    return safe

templates = [
    "For more details, check out our guide on [{title}](/blog/{slug}).",
    "You might also enjoy our article about [{title}](/blog/{slug}).",
    "Related reading: [{title}](/blog/{slug}).",
    "Learn more in our comprehensive guide to [{title}](/blog/{slug}).",
]

total_links = 0
files_done = 0
no_match = 0

for slug in sorted(batch_slugs):
    fpath = os.path.join(posts_dir, f'{slug}.md')
    if not os.path.exists(fpath): continue
    
    try:
        with open(fpath, encoding='utf-8-sig') as f:
            text = f.read()
    except:
        with open(fpath, encoding='utf-8', errors='replace') as f:
            text = f.read()
    
    fm_match = re.match(r'^---\r?\n(.*?)\r?\n---', text, re.DOTALL)
    if not fm_match: continue
    
    frontmatter = text[:fm_match.end()]
    body = text[fm_match.end():]
    
    if '](/blog/' in body: continue  # already has links
    
    related = find_related(slug)
    if not related:
        # Fallback: pick random same-category posts
        cat = all_posts[slug]['category']
        same_cat = [s for s in all_posts if s != slug and all_posts[s]['category'] == cat]
        if same_cat:
            import random
            random.seed(hash(slug))
            picks = random.sample(same_cat, min(4, len(same_cat)))
            related = [(s, 2, all_posts[s]['title']) for s in picks]
        else:
            no_match += 1
            continue
    
    lines = body.split('\n')
    safe = find_safe_lines(lines)
    if not safe:
        no_match += 1
        continue
    
    n = min(len(related), len(safe), 4)
    step = len(safe) // (n + 1)
    positions = [safe[min((j+1)*step, len(safe)-1)] for j in range(n)]
    
    inserted = 0
    for i, pos in enumerate(sorted(positions, reverse=True)):
        if i >= n: break
        r_slug, _, r_title = related[n - 1 - i]
        t_clean = re.sub(r'\s*\d{4}\s*$', '', r_title)
        if len(t_clean) > 65:
            t_clean = re.sub(r'\s*[:|]\s*.*$', '', t_clean)
        if len(t_clean) > 65:
            t_clean = t_clean[:62] + '...'
        tmpl = templates[hash(r_slug) % len(templates)]
        sentence = tmpl.replace('{title}', t_clean).replace('{slug}', r_slug)
        lines.insert(pos + 1, '')
        lines.insert(pos + 2, sentence)
        inserted += 1
    
    if inserted > 0:
        new_text = frontmatter + '\n'.join(lines)
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_text)
        total_links += inserted
        files_done += 1

print(f"\n✅ 완료!")
print(f"  수정된 파일: {files_done}/283")
print(f"  추가된 내부 링크: {total_links}개")
print(f"  매칭 실패: {no_match}개")
print(f"  평균: {total_links/max(files_done,1):.1f}개/파일")
