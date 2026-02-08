"""
Find and remove orphan closing tags that appear after self-closing components.
Pattern: <Component ... /> followed by </Component> with no intervening <Component> open.
This is the correct approach - only targets the specific "self-close then close" pattern.
"""
import re
from pathlib import Path

d = Path('content/posts')
comps = ['KeyTakeaways','FAQAccordion','ExpertTip','InfoBox','StepGuide','ProsCons',
         'PriceTable','StatCard','QuickFacts','ComparisonTable','LocationCard','Timeline',
         'DualismRoute','BeforeAfter','PriceComparisonChart','ImageGallery','ResponsiveTable']

fixed_files = []
total_fixes = 0

for f in sorted(d.glob('*.md')):
    content = f.read_text(encoding='utf-8')
    original = content
    
    changed = True
    while changed:
        changed = False
        for c in comps:
            # Find all closing tags for this component
            close_pattern = rf'\n</({c})>\n'
            for match in re.finditer(close_pattern, content):
                close_pos = match.start()
                close_end = match.end()
                close_line = content[:close_pos].count('\n') + 1
                
                # Look at everything before this closing tag
                before = content[:close_pos]
                
                # Find the LAST opening of this component before this close
                # We need to find all <Component blocks (multi-line opening tags)
                # Pattern for opening: <Component followed by content until > or />
                all_tag_blocks = list(re.finditer(rf'<{c}\b[\s\S]*?(?:/>|>)', before))
                
                if not all_tag_blocks:
                    # No opening tag at all - this is an orphan
                    content = content[:close_pos] + content[close_end-1:]  # keep one \n
                    total_fixes += 1
                    fixed_files.append((f.name, close_line, c, "no opening tag"))
                    changed = True
                    break
                
                # Count self-closing and regular opens
                self_closes = 0
                opens = 0
                for tb in all_tag_blocks:
                    tag_text = tb.group()
                    if tag_text.rstrip().endswith('/>'):
                        self_closes += 1
                    else:
                        opens += 1
                
                # Count previous closing tags
                prev_closes = len(re.findall(rf'</{c}>', before))
                
                unclosed = opens - prev_closes
                
                if unclosed <= 0:
                    # All opens are already closed or self-closing - this close is orphan
                    content = content[:close_pos] + content[close_end-1:]
                    total_fixes += 1
                    fixed_files.append((f.name, close_line, c, f"opens={opens} self_closes={self_closes} prev_closes={prev_closes}"))
                    changed = True
                    break
            
            if changed:
                break
    
    if content != original:
        f.write_text(content, encoding='utf-8')

print(f"Total fixes: {total_fixes}")
print(f"Files affected:")
seen = set()
for fn, line, comp, reason in fixed_files:
    print(f"  {fn}:{line} - </{comp}> ({reason})")
    seen.add(fn)
print(f"\n{len(seen)} files modified")
