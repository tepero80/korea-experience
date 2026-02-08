"""Find posts where closing tags exist without matching opening tags (build breakers)."""
import re
from pathlib import Path

d = Path('content/posts')
comps = ['KeyTakeaways','FAQAccordion','ExpertTip','InfoBox','StepGuide','ProsCons',
         'PriceTable','StatCard','QuickFacts','ComparisonTable','LocationCard','Timeline',
         'DualismRoute','BeforeAfter','PriceComparisonChart','ImageGallery','ResponsiveTable']

problems = []
for f in sorted(d.glob('*.md')):
    content = f.read_text(encoding='utf-8')
    for c in comps:
        closing_tags = list(re.finditer(rf'</{c}>', content))
        if not closing_tags:
            continue
        
        # For each closing tag, check if there's a corresponding non-self-closing open tag before it
        for ct in closing_tags:
            # Look backwards from closing tag for an opening tag
            before = content[:ct.start()]
            # Find all opening tags (not self-closing)
            opens = list(re.finditer(rf'<{c}\b[^>]*(?<!/)>', before))
            # Find all self-closing tags
            self_closes = list(re.finditer(rf'<{c}\b[^>]*/>', before))
            # Find all other closing tags before this one
            prev_closes = list(re.finditer(rf'</{c}>', before))
            
            open_count = len(opens) - len(self_closes)
            close_count = len(prev_closes)
            
            if open_count <= close_count:
                line_num = content[:ct.start()].count('\n') + 1
                problems.append(f"{f.name}:{line_num} - orphan </{c}> (no matching open tag)")

if problems:
    print(f"Found {len(problems)} orphan closing tags:\n")
    for p in problems:
        print(f"  {p}")
else:
    print("No orphan closing tags found")
