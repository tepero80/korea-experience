"""
Bulk replace color classes in all tool page.tsx files.
Uses Python to preserve UTF-8 encoding and emoji characters.
"""
import os
import glob

TOOLS_DIR = os.path.join(os.path.dirname(__file__), '..', 'app', 'tools')

# ── Gradient replacements (order matters: longer patterns first) ──
GRADIENT_REPLACEMENTS = [
    # Multi-stop gradients
    ('from-purple-600 via-pink-600 to-purple-700', 'from-amber-600 via-orange-600 to-amber-700'),
    ('from-purple-600 to-pink-600', 'from-amber-600 to-orange-600'),
    ('from-purple-500 to-pink-500', 'from-amber-500 to-orange-500'),
    ('from-purple-500 via-pink-500 to-purple-600', 'from-amber-500 via-orange-500 to-amber-600'),
    ('from-violet-600 via-pink-500 to-violet-600', 'from-amber-600 via-orange-500 to-amber-600'),
    ('from-violet-600 via-purple-600 to-fuchsia-600', 'from-amber-600 via-orange-600 to-amber-700'),
    ('from-violet-600 to-fuchsia-600', 'from-amber-600 to-orange-600'),
    ('from-pink-600 via-purple-600 to-pink-600', 'from-amber-600 via-orange-600 to-amber-600'),
    ('from-pink-500 via-fuchsia-500 to-pink-500', 'from-amber-500 via-orange-500 to-amber-500'),
    ('from-pink-500 via-rose-500 to-pink-500', 'from-amber-500 via-orange-500 to-amber-500'),
    ('from-pink-500 to-purple-600', 'from-amber-500 to-orange-600'),
    ('from-pink-600 to-purple-600', 'from-amber-600 to-orange-600'),
    ('from-sky-500 via-blue-500 to-violet-600', 'from-amber-500 via-orange-500 to-amber-600'),
    ('from-green-500 via-blue-500 to-purple-500', 'from-amber-500 via-orange-500 to-amber-600'),
    ('from-green-600 to-green-700', 'from-amber-600 to-orange-700'),
    ('from-purple-600 to-blue-600', 'from-amber-600 to-orange-600'),
    ('from-orange-500 via-red-500 to-orange-600', 'from-amber-600 via-orange-600 to-amber-700'),
    ('from-orange-500 to-red-600', 'from-amber-600 to-orange-600'),
    ('from-orange-500 to-red-500', 'from-amber-600 to-orange-600'),
    ('from-pink-500 via-purple-500 via-blue-500 via-green-500 to-yellow-500', 'from-amber-500 via-orange-500 to-amber-600'),
    ('from-blue-600 to-cyan-600', 'from-amber-600 to-orange-600'),
    ('from-blue-600 to-purple-600', 'from-amber-600 to-orange-600'),
    ('from-violet-600 to-orange-500', 'from-amber-600 to-orange-500'),
    ('from-violet-600 to-pink-600', 'from-amber-600 to-orange-600'),
    ('from-sky-500 to-violet-600', 'from-amber-500 to-orange-600'),
    ('from-sky-600 to-violet-600', 'from-amber-600 to-orange-600'),
    ('from-indigo-600 to-purple-600', 'from-amber-600 to-orange-600'),
    ('from-orange-500 to-fuchsia-500', 'from-amber-500 to-orange-500'),
    # Hover gradients
    ('hover:from-blue-700 hover:to-cyan-700', 'hover:from-amber-700 hover:to-orange-700'),
    ('hover:from-purple-700 hover:to-pink-700', 'hover:from-amber-700 hover:to-orange-700'),
    ('hover:from-pink-700 hover:to-purple-700', 'hover:from-amber-700 hover:to-orange-700'),
    ('hover:from-pink-600 hover:to-rose-600', 'hover:from-amber-700 hover:to-orange-700'),
    ('hover:from-pink-600 hover:to-fuchsia-600', 'hover:from-amber-700 hover:to-orange-700'),
    ('hover:from-purple-600 hover:to-pink-600', 'hover:from-amber-700 hover:to-orange-700'),
    ('hover:from-violet-600 hover:to-pink-600', 'hover:from-amber-700 hover:to-orange-700'),
    ('hover:from-violet-700 hover:to-pink-700', 'hover:from-amber-700 hover:to-orange-700'),
    ('hover:from-fuchsia-600 hover:to-pink-600', 'hover:from-amber-700 hover:to-orange-700'),
    ('hover:from-fuchsia-600 hover:to-violet-600', 'hover:from-amber-700 hover:to-orange-700'),
    ('hover:from-sky-600 hover:to-violet-700', 'hover:from-amber-600 hover:to-orange-700'),
    ('hover:from-purple-600', 'hover:from-amber-700'),
    # via in gradients
    ('via-purple-100', 'via-amber-100'),
    ('via-pink-500 to-red-500', 'via-orange-500 to-amber-600'),
    ('via-pink-500 to-orange-500', 'via-orange-500 to-amber-600'),
    ('via-pink-600', 'via-orange-600'),
    # from/to for bg washes
    ('from-purple-50', 'from-amber-50'),
    ('to-purple-50', 'to-amber-50'),
    ('from-purple-100', 'from-amber-100'),
    ('to-purple-100', 'to-amber-100'),
    ('from-pink-50', 'from-orange-50'),
    ('to-pink-50', 'to-orange-50'),
    ('from-pink-100', 'from-orange-100'),
    ('to-pink-100', 'to-orange-100'),
    ('from-violet-100', 'from-amber-100'),
    ('to-violet-100', 'to-amber-100'),
    ('from-violet-50', 'from-amber-50'),
    ('to-violet-50', 'to-amber-50'),
    ('from-blue-50', 'from-amber-50'),
    ('to-blue-50', 'to-amber-50'),
    ('from-cyan-50', 'from-orange-50'),
    ('to-cyan-50', 'to-orange-50'),
    ('from-rose-50', 'from-orange-50'),
    ('to-rose-50', 'to-orange-50'),
    ('from-indigo-50', 'from-amber-50'),
    ('from-fuchsia-100', 'from-orange-100'),
    ('to-fuchsia-100', 'to-orange-100'),
    ('from-sky-100', 'from-amber-100'),
    ('from-green-100 via-blue-100 to-amber-100', 'from-amber-100 via-orange-100 to-amber-100'),
    ('from-green-50 to-emerald-50', 'from-amber-50 to-orange-50'),
    ('from-orange-50 to-red-50', 'from-orange-50 to-amber-50'),
    ('from-blue-50 to-indigo-50', 'from-amber-50 to-orange-50'),
]

# ── Solid color replacements ──
SOLID_REPLACEMENTS = [
    # purple → amber
    ('text-purple-100', 'text-amber-100'),
    ('text-purple-200', 'text-amber-200'),
    ('text-purple-300', 'text-amber-300'),
    ('text-purple-500', 'text-amber-600'),
    ('text-purple-600', 'text-amber-700'),
    ('text-purple-700', 'text-amber-700'),
    ('text-purple-800', 'text-amber-800'),
    ('text-purple-900', 'text-amber-900'),
    ('bg-purple-50', 'bg-amber-50'),
    ('bg-purple-100', 'bg-amber-100'),
    ('bg-purple-200', 'bg-amber-200'),
    ('bg-purple-500', 'bg-amber-600'),
    ('bg-purple-600', 'bg-amber-600'),
    ('bg-purple-700', 'bg-amber-700'),
    ('border-purple-100', 'border-amber-100'),
    ('border-purple-200', 'border-amber-200'),
    ('border-purple-300', 'border-amber-300'),
    ('border-purple-400', 'border-amber-400'),
    ('border-purple-500', 'border-amber-500'),
    ('border-purple-600', 'border-amber-600'),
    ('hover:bg-purple-700', 'hover:bg-amber-700'),
    ('hover:bg-purple-50', 'hover:bg-amber-50'),
    ('hover:text-purple-700', 'hover:text-amber-700'),
    ('hover:border-purple-600', 'hover:border-amber-600'),
    ('focus:ring-purple-500', 'focus:ring-amber-500'),
    ('focus:ring-purple-200', 'focus:ring-amber-200'),
    ('focus:ring-purple-100', 'focus:ring-amber-100'),
    ('focus:border-purple-500', 'focus:border-amber-500'),
    ('ring-purple-500', 'ring-amber-500'),
    # pink → orange
    ('text-pink-100', 'text-orange-100'),
    ('text-pink-200', 'text-orange-200'),
    ('text-pink-300', 'text-orange-300'),
    ('text-pink-500', 'text-orange-500'),
    ('text-pink-600', 'text-orange-600'),
    ('text-pink-700', 'text-orange-700'),
    ('text-pink-800', 'text-orange-800'),
    ('text-pink-900', 'text-stone-900'),
    ('bg-pink-50', 'bg-orange-50'),
    ('bg-pink-100', 'bg-orange-100'),
    ('bg-pink-200', 'bg-orange-200'),
    ('bg-pink-500', 'bg-orange-500'),
    ('bg-pink-600', 'bg-orange-600'),
    ('border-pink-100', 'border-orange-100'),
    ('border-pink-200', 'border-orange-200'),
    ('border-pink-300', 'border-orange-300'),
    ('border-pink-500', 'border-orange-500'),
    ('border-pink-600', 'border-orange-600'),
    ('hover:bg-pink-600', 'hover:bg-orange-600'),
    ('hover:bg-pink-700', 'hover:bg-orange-700'),
    ('hover:bg-pink-100', 'hover:bg-orange-100'),
    ('focus:ring-pink-500', 'focus:ring-amber-500'),
    ('focus:ring-pink-200', 'focus:ring-amber-200'),
    ('focus:border-pink-500', 'focus:border-amber-500'),
    # violet → amber
    ('text-violet-100', 'text-amber-100'),
    ('text-violet-500', 'text-amber-600'),
    ('text-violet-600', 'text-amber-600'),
    ('text-violet-700', 'text-amber-700'),
    ('bg-violet-50', 'bg-amber-50'),
    ('bg-violet-100', 'bg-amber-100'),
    ('border-violet-200', 'border-amber-200'),
    ('border-violet-500', 'border-amber-500'),
    ('hover:border-violet-300', 'hover:border-amber-300'),
    # fuchsia → orange
    ('text-fuchsia-500', 'text-orange-500'),
    ('text-fuchsia-600', 'text-orange-600'),
    ('text-fuchsia-700', 'text-orange-700'),
    ('text-fuchsia-900', 'text-stone-900'),
    ('bg-fuchsia-50', 'bg-orange-50'),
    ('bg-fuchsia-100', 'bg-orange-100'),
    ('border-fuchsia-200', 'border-orange-200'),
    # rose → orange
    ('text-rose-500', 'text-orange-500'),
    ('text-rose-600', 'text-orange-600'),
    ('text-rose-700', 'text-orange-700'),
    ('bg-rose-50', 'bg-orange-50'),
    ('bg-rose-100', 'bg-orange-100'),
    ('border-rose-200', 'border-orange-200'),
    ('border-rose-500', 'border-orange-500'),
    # blue → amber (UI elements, NOT social share brand colors)
    ('bg-blue-50', 'bg-amber-50'),
    ('bg-blue-100', 'bg-amber-100'),
    ('bg-blue-200', 'bg-amber-200'),
    ('bg-blue-400', 'bg-amber-500'),
    ('bg-blue-500', 'bg-amber-600'),
    ('bg-blue-600', 'bg-amber-600'),
    ('bg-blue-700', 'bg-amber-700'),
    ('bg-blue-800', 'bg-amber-800'),
    ('text-blue-600', 'text-amber-700'),
    ('text-blue-700', 'text-amber-700'),
    ('text-blue-800', 'text-stone-800'),
    ('text-blue-900', 'text-stone-900'),
    ('border-blue-100', 'border-amber-100'),
    ('border-blue-200', 'border-amber-200'),
    ('border-blue-300', 'border-amber-300'),
    ('border-blue-500', 'border-amber-500'),
    ('border-blue-600', 'border-amber-600'),
    ('hover:bg-blue-500', 'hover:bg-amber-600'),
    ('hover:bg-blue-700', 'hover:bg-amber-700'),
    ('hover:bg-blue-800', 'hover:bg-amber-800'),
    ('hover:border-blue-300', 'hover:border-amber-300'),
    ('accent-blue-600', 'accent-amber-600'),
    ('prose-blue', 'prose-amber'),
    # sky → amber
    ('text-sky-500', 'text-amber-600'),
    ('text-sky-600', 'text-amber-600'),
    ('bg-sky-50', 'bg-amber-50'),
    ('border-sky-200', 'border-amber-200'),
    ('border-sky-500', 'border-amber-500'),
    # indigo → amber
    ('text-indigo-500', 'text-amber-600'),
    ('text-indigo-600', 'text-amber-600'),
    ('text-indigo-700', 'text-amber-700'),
    ('bg-indigo-50', 'bg-amber-50'),
    ('border-indigo-200', 'border-amber-200'),
    ('border-indigo-500', 'border-amber-500'),
    # cyan → orange
    ('text-cyan-500', 'text-orange-500'),
    ('text-cyan-600', 'text-orange-600'),
    ('bg-cyan-50', 'bg-orange-50'),
    # green → amber (UI only, not semantic green for correct/success)
    ('border-green-500', 'border-amber-500'),
    ('text-green-600', 'text-amber-600'),
    ('text-green-700', 'text-amber-700'),
]

# ── Canvas gradient hex colors (JS) ──
CANVAS_REPLACEMENTS = [
    ('#ec4899', '#d97706'),   # pink → amber-600
    ('#EC4899', '#d97706'),
    ('#a855f7', '#ea580c'),   # purple → orange-600
    ('#9333ea', '#d97706'),   # purple-600 → amber-600
    ('#7c3aed', '#d97706'),   # violet-600 → amber-600
    ('#d946ef', '#ea580c'),   # fuchsia → orange-600
    ('#c026d3', '#ea580c'),   # fuchsia-600 → orange-600
    ('#8B5CF6', '#d97706'),   # purple → amber-600
    ('#f43f5e', '#ea580c'),   # rose-500 → orange-600
]

# ── Background replacements (page-level) ──
BG_REPLACEMENTS = [
    # ToolLayout gradient backgrounds → white
    ('bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50', 'bg-white'),
    # Standalone page backgrounds
    ('min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50', 'min-h-screen bg-white'),
    ('min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50', 'min-h-screen bg-white'),
    ('min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50', 'min-h-screen bg-white'),
    ('min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 py-12 px-4', 'min-h-screen bg-white py-12 px-4'),
    ('min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8', 'min-h-screen bg-white py-8'),
    # Back to Tools link
    ('text-purple-600 hover:text-purple-800', 'text-amber-700 hover:text-amber-900'),
]

# ── ToolLayout-specific gradient prop removal ──
import re
GRADIENT_PROP_PATTERN = re.compile(r'\s*gradient="[^"]*"')


def process_file(filepath: str) -> bool:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Remove gradient= prop from ToolLayout usage
    content = GRADIENT_PROP_PATTERN.sub('', content)
    
    # Apply all replacements
    for old, new in BG_REPLACEMENTS + GRADIENT_REPLACEMENTS + SOLID_REPLACEMENTS + CANVAS_REPLACEMENTS:
        content = content.replace(old, new)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)
        return True
    return False


def main():
    tools_dir = os.path.abspath(TOOLS_DIR)
    pattern = os.path.join(tools_dir, '**', 'page.tsx')
    files = glob.glob(pattern, recursive=True)
    
    changed = 0
    for f in sorted(files):
        # Skip [slug] dynamic route
        if '[slug]' in f:
            continue
        rel = os.path.relpath(f, tools_dir)
        if process_file(f):
            changed += 1
            print(f'  ✓ {rel}')
        else:
            print(f'  · {rel} (no changes)')
    
    print(f'\nDone: {changed}/{len(files)} files updated')


if __name__ == '__main__':
    main()
