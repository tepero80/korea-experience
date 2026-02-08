"""
Find closing tags where the corresponding component was actually self-closing.
The issue: fix_posts.py added </Component> after self-closing <Component .../> 
but before the next heading, creating orphan closing tags.
"""
import re
from pathlib import Path

d = Path('content/posts')
comps = ['KeyTakeaways','FAQAccordion','ExpertTip','InfoBox','StepGuide','ProsCons',
         'PriceTable','StatCard','QuickFacts','ComparisonTable','LocationCard','Timeline',
         'DualismRoute','BeforeAfter','PriceComparisonChart','ImageGallery','ResponsiveTable']

fixed_files = []

for f in sorted(d.glob('*.md')):
    content = f.read_text(encoding='utf-8')
    original = content
    
    for c in comps:
        # Find all closing tags
        close_matches = list(re.finditer(rf'^</{c}>$', content, re.MULTILINE))
        if not close_matches:
            continue
            
        for cm in reversed(close_matches):  # reverse to not mess up positions
            close_start = cm.start()
            close_end = cm.end()
            
            # Count all non-self-closing opens before this close
            before = content[:close_start]
            
            # Multi-line opening tags: <Component\n  ...\n/>  or <Component\n  ...\n>
            # Find self-closing: ends with />
            sc_count = len(re.findall(rf'<{c}\b[\s\S]*?/>', before))
            # Find all opens (both self-closing and not)
            all_opens = len(re.findall(rf'<{c}\b', before))
            # True opens = all - self-closing
            true_opens = all_opens - sc_count
            # Previous closes
            prev_closes = len(re.findall(rf'</{c}>', before))
            
            unclosed = true_opens - prev_closes
            
            if unclosed <= 0:
                # This closing tag has no matching open - remove it
                # Also remove surrounding blank lines
                # Check if preceded and followed by newlines
                pre = content[:close_start]
                post = content[close_end:]
                if pre.endswith('\n') and post.startswith('\n'):
                    content = pre + post[1:]  # remove one extra newline
                else:
                    content = pre + post
                    
                line_num = original[:close_start].count('\n') + 1
                print(f"  Removed orphan </{c}> at line {line_num} in {f.name}")
    
    if content != original:
        f.write_text(content, encoding='utf-8')
        fixed_files.append(f.name)

print(f"\nFixed {len(fixed_files)} files:")
for fn in fixed_files:
    print(f"  {fn}")
