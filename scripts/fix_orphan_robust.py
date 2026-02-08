"""
Robust orphan closing tag finder and fixer.
Properly handles multi-line JSX tags with > inside attribute strings.
"""
import re
from pathlib import Path

d = Path('content/posts')
comps = ['KeyTakeaways','FAQAccordion','ExpertTip','InfoBox','StepGuide','ProsCons',
         'PriceTable','StatCard','QuickFacts','ComparisonTable','LocationCard','Timeline',
         'DualismRoute','BeforeAfter','PriceComparisonChart','ImageGallery','ResponsiveTable']

def find_tag_end(content, start):
    """Find the end of a JSX tag starting at <Component, handling nested braces and quotes."""
    i = start
    depth = 0  # brace depth for {..}
    in_str = None  # quote char if inside string
    
    while i < len(content):
        ch = content[i]
        
        if in_str:
            if ch == '\\':
                i += 2
                continue
            if ch == in_str:
                in_str = None
            i += 1
            continue
        
        if ch in ('"', "'"):
            in_str = ch
            i += 1
            continue
        
        if ch == '{':
            depth += 1
            i += 1
            continue
        
        if ch == '}':
            depth -= 1
            i += 1
            continue
        
        if depth == 0:
            if ch == '/' and i + 1 < len(content) and content[i+1] == '>':
                return i + 2, True  # self-closing
            if ch == '>':
                return i + 1, False  # regular open
        
        i += 1
    
    return -1, False

def process_file(filepath):
    content = filepath.read_text(encoding='utf-8')
    original = content
    fixes = []
    
    changed = True
    while changed:
        changed = False
        for c in comps:
            # Find closing tags
            for match in re.finditer(rf'^</{c}>$', content, re.MULTILINE):
                close_start = match.start()
                close_end = match.end()
                
                # Count opens and closes before this point
                before = content[:close_start]
                
                open_count = 0
                self_close_count = 0
                
                # Find all opening tags
                for om in re.finditer(rf'<{c}\b', before):
                    end_pos, is_self_closing = find_tag_end(content, om.start())
                    if end_pos == -1:
                        continue
                    if end_pos <= close_start:
                        if is_self_closing:
                            self_close_count += 1
                        else:
                            open_count += 1
                
                prev_close_count = len(re.findall(rf'</{c}>', before))
                unclosed = open_count - prev_close_count
                
                if unclosed <= 0:
                    # This closing tag is orphaned - remove it
                    # Remove the line including trailing newline
                    end_with_nl = close_end
                    if end_with_nl < len(content) and content[end_with_nl] == '\n':
                        end_with_nl += 1
                    # Also remove preceding blank line if exists
                    start_remove = close_start
                    if start_remove > 0 and content[start_remove-1] == '\n':
                        start_remove -= 1
                    
                    content = content[:start_remove] + content[end_with_nl:]
                    line = original[:close_start].count('\n') + 1
                    fixes.append(f"  Removed </{c}> at line {line}")
                    changed = True
                    break
            
            if changed:
                break
    
    if content != original:
        filepath.write_text(content, encoding='utf-8')
    
    return fixes

total = 0
for f in sorted(d.glob('*.md')):
    fixes = process_file(f)
    if fixes:
        print(f"{f.name}:")
        for fix in fixes:
            print(fix)
        total += len(fixes)

print(f"\nTotal fixes: {total}")
