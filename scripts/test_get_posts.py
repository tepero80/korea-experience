import sys
from pathlib import Path

sys.path.insert(0, 'C:/kc/korea-experience')
from scripts.batch_post_covers import get_all_posts

posts = get_all_posts()
print(f'get_all_posts 반환: {len(posts)}개')

no_image = [p for p in posts if not p['has_image']]
print(f'has_image=False: {len(no_image)}개')

for p in no_image[:5]:
    print(f'  - {p["slug"]}')
