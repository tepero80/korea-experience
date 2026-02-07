import json, re

# Read file to get title and category
with open('content/posts/24-hours-in-seongsu-dong-luxury-dior-pop-up-vs-5-market-food-a-dualism-route.md', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'^title:\s*"(.+?)"', content, re.MULTILINE)
title = m.group(1) if m else 'Unknown'

m2 = re.search(r'^category:\s*(.+)', content, re.MULTILINE)
cat = m2.group(1).strip() if m2 else 'Unknown'

print(f'Title: {title}')
print(f'Category: {cat}')

# Load content-plan
with open('scripts/content-plan.json', 'r', encoding='utf-8') as f:
    plan = json.load(f)

# Check if this exact title already exists
found = False
for b in plan['batches']:
    for p in b['posts']:
        if p.lower() == title.lower():
            print(f'Already in plan: {b["name"]} -> {p}')
            found = True

if not found:
    # Add as a new batch at the end
    new_batch = {
        "name": f"{cat} - Regen Fix",
        "category": cat,
        "posts": [title]
    }
    plan['batches'].append(new_batch)
    with open('scripts/content-plan.json', 'w', encoding='utf-8') as f:
        json.dump(plan, f, ensure_ascii=False, indent=2)
    print(f'Added to content-plan.json as: {new_batch["name"]}')
else:
    print('Already exists, no changes made.')
