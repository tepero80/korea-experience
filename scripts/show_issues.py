import json

with open('scripts/audit-results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== MDX SYNTAX ISSUES ===')
for r in data['results']:
    if 'mdx_syntax' in r.get('issues', {}):
        print(f"\n{r['file']}:")
        for issue in r['issues']['mdx_syntax']:
            print(f'  {issue}')

print('\n=== FAKE PHONES ===')
for r in data['results']:
    if 'fake_phones' in r.get('issues', {}):
        print(f"\n{r['file']}:")
        for issue in r['issues']['fake_phones']:
            print(f'  {issue}')

print('\n=== ENCODING ISSUES ===')
for r in data['results']:
    if 'encoding' in r.get('issues', {}):
        print(f"\n{r['file']}:")
        for issue in r['issues']['encoding']:
            print(f'  {issue}')

print('\n=== PRICE CONSISTENCY ===')
for r in data['results']:
    if 'price_consistency' in r.get('issues', {}):
        print(f"\n{r['file']}:")
        for issue in r['issues']['price_consistency']:
            print(f'  {issue}')
