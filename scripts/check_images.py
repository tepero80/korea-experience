import re
from pathlib import Path

posts = list(Path('content/posts').glob('*.md'))
has_image = 0
no_image = 0
image_paths = []

for p in posts:
    content = p.read_text(encoding='utf-8')
    fm = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if fm:
        img_match = re.search(r'^image:\s*(.+)$', fm.group(1), re.MULTILINE)
        if img_match:
            has_image += 1
            image_paths.append(img_match.group(1).strip().strip('"'))
        else:
            no_image += 1

print(f'Total posts: {len(posts)}')
print(f'Has image: {has_image}')
print(f'No image: {no_image}')
if image_paths:
    for p in sorted(set(image_paths))[:10]:
        print(f'  {p}')

# Check deep-dive images
dd_dir = Path('public/images/deep-dive')
if dd_dir.exists():
    dd_images = list(dd_dir.glob('*'))
    print(f'\nDeep-dive images: {len(dd_images)}')
    for img in sorted(dd_images)[:5]:
        print(f'  {img.name} ({img.stat().st_size // 1024}KB)')
else:
    print('\nNo deep-dive images dir')

# Check OG image handling in blog
print('\n--- OG image check ---')
og_file = Path('app/blog/[slug]/opengraph-image.tsx')
if og_file.exists():
    og_content = og_file.read_text(encoding='utf-8')
    if 'post.image' in og_content:
        print('OG image uses post.image field (custom cover)')
    else:
        print('OG image: no post.image reference')
