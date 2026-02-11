import os

target_dir = r"c:\kc\korea-experience\content\deep-dive"

def fix_quotes(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    modified = False
    
    for line in lines:
        stripped = line.strip()
        if (stripped.startswith('title: "') or stripped.startswith('excerpt: "')) and stripped.endswith('""'):
            # Check if it's not actually an empty string like title: "" (which is valid-ish but unlikely here)
            # We assume it's valid content followed by double quotes.
            # Replace the last two chars with one
            # Find the last occurrence of "" and validly replace it?
            # Safer: replace the trailing "" with "
            
            # Reconstruct the line preserving indentation/newline
            # Assuming standard formatting title: "..."
            
            # rstrip only trailing whitespace/newlines
            content = line.rstrip()
            if content.endswith('""'):
                # Check if it is literally "" at the end.
                content = content[:-1] # Remove one quote
                line = content + '\n' # Add newline back
                modified = True
        
        new_lines.append(line)
        
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Fixed quotes: {os.path.basename(filepath)}")

if __name__ == "__main__":
    print("Starting quote fix process...")
    files = [f for f in os.listdir(target_dir) if f.endswith('.md')]
    for filename in files:
        fix_quotes(os.path.join(target_dir, filename))
    print("Done.")
