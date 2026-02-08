"""
Find and fix self-closing components that have erroneous closing tags added after them.
Pattern: <Component ... /> ... </Component>  (the </Component> is orphaned)
"""
import re
from pathlib import Path

d = Path('content/posts')
comps = ['KeyTakeaways','FAQAccordion','ExpertTip','InfoBox','StepGuide','ProsCons',
         'PriceTable','StatCard','QuickFacts','ComparisonTable','LocationCard','Timeline',
         'DualismRoute','BeforeAfter','PriceComparisonChart','ImageGallery','ResponsiveTable']

fixed_count = 0
files_fixed = set()

for f in sorted(d.glob('*.md')):
    content = f.read_text(encoding='utf-8')
    original = content
    
    for c in comps:
        # Find closing tags
        closing_pattern = rf'\n</{c}>\n'
        
        for match in list(re.finditer(closing_pattern, content)):
            close_pos = match.start()
            
            # Look backwards: find the most recent opening of this component
            before = content[:close_pos]
            
            # Check for self-closing version before this closing tag
            # The last occurrence of <Component ... /> before this </Component>
            self_close_matches = list(re.finditer(rf'<{c}\b[^>]*/>', before))
            open_matches = list(re.finditer(rf'<{c}\b[^>]*(?<!/)>', before))
            prev_close_matches = list(re.finditer(rf'</{c}>', before))
            
            # Count opens that are NOT self-closing
            true_opens = len(open_matches) - len(self_close_matches)
            already_closed = len(prev_close_matches)
            
            # If all true opens are already closed, this closing tag is orphaned
            if true_opens <= already_closed:
                # Remove this orphan closing tag
                content = content[:match.start()] + '\n' + content[match.end():]
                fixed_count += 1
                files_fixed.add(f.name)
                line_num = original[:match.start()].count('\n') + 1
                print(f"  Removed orphan </{c}> at line {line_num} in {f.name}")
                break  # restart scan for this file since positions changed
    
    if content != original:
        f.write_text(content, encoding='utf-8')

# Do a second pass for any remaining
for f in sorted(d.glob('*.md')):
    content = f.read_text(encoding='utf-8')
    original = content
    
    for c in comps:
        # Simpler approach: look for pattern where /> is followed (possibly with stuff between) by </Component>
        # but there's no non-self-closing <Component> between the /> and </Component>
        pattern = rf'(<{c}\b[^>]*/>\s*\n)(.*?)(\n</{c}>)'
        
        def check_and_remove(m):
            between = m.group(2)
            # Check if there's a non-self-closing open tag of same component in between
            has_open = re.search(rf'<{c}\b[^>]*(?<!/)>', between)
            if not has_open:
                global fixed_count
                fixed_count += 1
                files_fixed.add(f.name)
                return m.group(1) + between
            return m.group(0)
        
        content = re.sub(pattern, check_and_remove, content, flags=re.DOTALL)
    
    if content != original:
        f.write_text(content, encoding='utf-8')

print(f"\nTotal fixes: {fixed_count}")
print(f"Files fixed: {len(files_fixed)}")
for fn in sorted(files_fixed):
    print(f"  {fn}")
