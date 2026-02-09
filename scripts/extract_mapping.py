import os, re

posts_dir = 'content/posts'
mapping = []
for f in os.listdir(posts_dir):
    if not f.endswith('.md'):
        continue
    with open(os.path.join(posts_dir, f), 'r', encoding='utf-8') as fp:
        content = fp.read(2000)
    m_img = re.search(r'image:\s*"?(/images/[^"\s]+)', content)
    m_title = re.search(r'title:\s*"(.+?)"', content)
    if m_img and m_title:
        slug = m_img.group(1).replace('/images/', '').replace('.webp', '')
        title = m_title.group(1)
        mapping.append((slug, title))

mapping.sort()
for slug, title in mapping:
    print(f'{slug} | {title}')
print(f'\nTotal: {len(mapping)}')
