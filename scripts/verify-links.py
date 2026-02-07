import os, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/generation-progress.json', encoding='utf-8') as f:
    progress = json.load(f)

slugs = set()
for k, v in progress.items():
    if v and ':' in k:
        title = k.split(':', 1)[1].strip().lower()
        slug = re.sub(r'[^a-z0-9\s-]', '', title).replace(' ', '-')
        slug = re.sub(r'-+', '-', slug).strip('-')
        slugs.add(slug)

has_links = 0
total_links = 0
no_links = []
for s in sorted(slugs):
    path = os.path.join('content/posts', s + '.md')
    if os.path.exists(path):
        text = open(path, encoding='utf-8-sig').read()
        cnt = len(re.findall(r'\]\(/blog/', text))
        total_links += cnt
        if cnt > 0:
            has_links += 1
        else:
            no_links.append(s)

print(f'283개 중 링크 있음: {has_links}/283')
print(f'총 내부 링크: {total_links}개')
print(f'평균: {total_links/283:.1f}개/파일')
if no_links:
    print(f'링크 없음({len(no_links)}개): {no_links}')
else:
    print('모든 파일에 내부 링크 있음!')
