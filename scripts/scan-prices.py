import os, re

content_dir = 'content/posts'

for f in sorted(os.listdir(content_dir)):
    if not f.endswith('.md'):
        continue
    path = os.path.join(content_dir, f)
    try:
        with open(path, 'r', encoding='utf-8') as fh:
            content = fh.read()
    except:
        continue
    
    # Find numbers followed by ($X) NOT preceded by ₩
    matches = list(re.finditer(r'(?<![\u20a9\d])([\d,]+)\s*\(\$[\d.,]+(?:\s*(?:USD|KRW))?\)', content))
    
    suspicious = []
    for m in matches:
        num_str = m.group(1)
        full = m.group(0)
        pre_start = max(0, m.start() - 3)
        pre_ctx = content[pre_start:m.start()]
        if '\u20a9' in pre_ctx:
            continue
        if '$' in content[max(0, m.start()-5):m.start()]:
            continue
        if ',' in num_str or num_str.startswith('0'):
            suspicious.append(m)
    
    if suspicious:
        print(f'\n=== {f} ({len(suspicious)} suspicious) ===')
        for m in suspicious:
            start = max(0, m.start() - 30)
            end = min(len(content), m.end() + 5)
            ctx = content[start:end].replace('\n', ' ')
            print(f'  {ctx}')
