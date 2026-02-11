import os

target_dir = r"c:\kc\korea-experience\content\deep-dive"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    modified = False
    
    for line in lines:
        original_line = line
        
        # Fix 1: YAML title/excerpt formatting
        # Pattern: title:"\"...\""  -> title: "..."
        # We need to be careful not to break valid yaml.
        
        if line.strip().startswith('title:"\\"') or line.strip().startswith('excerpt:"\\"'):
            # Replace start
            if line.strip().startswith('title:"\\"'):
                line = line.replace('title:"\\"', 'title: "')
            elif line.strip().startswith('excerpt:"\\"'):
                line = line.replace('excerpt:"\\"', 'excerpt: "')
            
            # Replace end quote if it's escaped
            # The line likely ends with \""\n or similar
            # Let's simple replace the rightmost \"" with "
            # But we must be careful if there are other escaped quotes inside.
            # Usually the generator wraps the whole thing in escaped quotes: \"Text\"
            # So we just want to remove the backslash before the last quote.
            
            # Find the last occurrence of \"
            last_escaped_quote_index = line.rfind('\\"')
            if last_escaped_quote_index != -1:
                # remove the backslash
                line = line[:last_escaped_quote_index] + line[last_escaped_quote_index+1:]
                
            modified = True

        # Fix 2: InfoBox double closing bracket
        if '<InfoBox' in line and '>>' in line:
            line = line.replace('>>', '>')
            modified = True
            
        new_lines.append(line)
        
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Fixed: {os.path.basename(filepath)}")
    else:
        # print(f"No changes: {os.path.basename(filepath)}")
        pass

if __name__ == "__main__":
    print("Starting fix process...")
    files = [f for f in os.listdir(target_dir) if f.endswith('.md')]
    for filename in files:
        fix_file(os.path.join(target_dir, filename))
    print("Done.")
