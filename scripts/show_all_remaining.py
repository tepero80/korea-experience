import json

with open('scripts/audit-results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('=== ALL REMAINING ISSUES ===')
for r in data['results']:
    if r['count'] > 0:
        print(f"\n--- {r['file']} ({r['mtime']}) ---")
        for cat, issues in r['issues'].items():
            for issue in issues:
                print(f"  [{cat}] {issue}")
