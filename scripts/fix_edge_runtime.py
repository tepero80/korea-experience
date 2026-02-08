from pathlib import Path

count = 0
for f in Path('app/tools').rglob('opengraph-image.tsx'):
    c = f.read_text(encoding='utf-8')
    old = "export const runtime = 'edge';"
    new = "export const runtime = 'nodejs';"
    if old in c:
        c = c.replace(old, new)
        f.write_text(c, encoding='utf-8')
        count += 1
        print(f'  Fixed: {f}')

print(f'\nFixed {count} files: edge -> nodejs')
