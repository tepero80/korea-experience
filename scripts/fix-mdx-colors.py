"""
Fix MDX component colors to match amber/orange site theme.
Preserves semantic colors (green=pros, red=cons, amber=warning/luxury, green=budget).
Only changes blue/indigo/purple/cyan decorative colors.
"""
import os

BASE = os.path.join(os.path.dirname(__file__), '..', 'components', 'mdx')

# ── Per-file targeted replacements ──
FILE_REPLACEMENTS = {
    'KeyTakeaways.tsx': [
        # Container bg
        ('bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50', 'bg-amber-50'),
        ('border-2 border-blue-200', 'border-2 border-amber-200'),
        # Header
        ('bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600', 'bg-stone-800'),
        # Meta text
        ('text-blue-100', 'text-stone-300'),
        # Number badges
        ('bg-gradient-to-br from-blue-500 to-indigo-600', 'bg-amber-600'),
    ],
    'QuickFacts.tsx': [
        # Default header
        ('bg-gradient-to-r from-blue-600 to-indigo-600', 'bg-stone-800'),
        # Highlight variant
        ('bg-gradient-to-br from-blue-600 to-indigo-700', 'bg-gradient-to-br from-stone-700 to-stone-800'),
        ('text-blue-200', 'text-stone-300'),
        ('text-blue-100', 'text-stone-200'),
        # Hover
        ('hover:bg-gray-50', 'hover:bg-amber-50'),
    ],
    'StepGuide.tsx': [
        # Timeline line - rainbow → solid stone
        ('bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500', 'bg-stone-300'),
        # Step number badge
        ('bg-gradient-to-br from-blue-500 to-purple-600', 'bg-amber-600'),
        # Meta badges
        ('bg-blue-100 text-blue-700', 'bg-amber-100 text-amber-700'),
    ],
    'FAQAccordion.tsx': [
        # Header
        ('bg-gradient-to-r from-blue-600 to-indigo-600', 'bg-stone-800'),
        # Active number
        ('bg-blue-500 text-white', 'bg-amber-600 text-white'),
        # Inactive number hover
        ('bg-blue-100', 'bg-amber-100'),
        # Toggle icon bg when open
        ('bg-blue-100', 'bg-amber-100'),
        # Answer area
        ('bg-blue-50 border-l-4 border-blue-500', 'bg-amber-50 border-l-4 border-amber-400'),
        # Footer link
        ('text-blue-600', 'text-amber-700'),
    ],
    'StatCard.tsx': [
        # Hero variant
        ('bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700', 'bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900'),
        ('text-blue-200', 'text-amber-200'),
        ('text-blue-100', 'text-amber-100'),
        ('text-blue-200/60', 'text-amber-200/60'),
        # Gradient variant cycling colors
        ('from-blue-500 to-indigo-600', 'from-amber-500 to-orange-600'),
        ('from-purple-500 to-pink-600', 'from-orange-500 to-amber-600'),
        # Default header
        ('bg-gradient-to-r from-gray-800 to-gray-900', 'bg-stone-800'),
    ],
    'Timeline.tsx': [
        # Vertical line
        ('bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-500', 'bg-stone-300'),
        # Icon circle
        ('bg-gradient-to-br from-blue-500 to-cyan-500', 'bg-amber-600'),
        # Time label
        ('text-blue-600', 'text-amber-700'),
    ],
    'ComparisonTable.tsx': [
        # Inline style header → will handle separately
        ("style={{ background: 'linear-gradient(to right, #1e3a8a, #1e40af)' }}", "style={{ background: '#292524' }}"),
        # Row hover
        ('hover:bg-blue-50', 'hover:bg-amber-50'),
    ],
    'ExpertTip.tsx': [
        # local type
        ('from-cyan-500 to-blue-500', 'from-amber-500 to-orange-500'),
        ('from-cyan-50 to-blue-50', 'from-amber-50 to-orange-50'),
        ('border-cyan-200', 'border-amber-200'),
        ('from-cyan-400 to-blue-500', 'from-amber-400 to-orange-500'),
        # expert type
        ('from-purple-500 to-indigo-500', 'from-stone-600 to-stone-700'),
        ('from-purple-50 to-indigo-50', 'from-stone-50 to-stone-100'),
        ('border-purple-200', 'border-stone-200'),
        ('from-purple-400 to-indigo-500', 'from-stone-400 to-stone-600'),
        # personal type
        ('from-pink-500 to-rose-500', 'from-orange-500 to-amber-500'),
        ('from-pink-50 to-rose-50', 'from-orange-50 to-amber-50'),
        ('border-pink-200', 'border-orange-200'),
        ('from-pink-400 to-rose-500', 'from-orange-400 to-amber-500'),
        # influencer type  
        ('from-pink-500 to-purple-500', 'from-orange-500 to-amber-600'),
        ('from-pink-50 to-purple-50', 'from-orange-50 to-amber-50'),
        # editor type
        ('from-blue-600 to-indigo-600', 'from-stone-700 to-stone-800'),
        ('from-blue-50 to-indigo-50', 'from-stone-50 to-stone-100'),
        ('border-blue-200', 'border-stone-200'),
        ('from-blue-400 to-indigo-500', 'from-stone-400 to-stone-600'),
        # Verified badge
        ('bg-blue-500 text-white', 'bg-amber-600 text-white'),
    ],
    'PriceTable.tsx': [
        # Default table header
        ('bg-gradient-to-r from-blue-600 to-indigo-600 text-white', 'bg-stone-800 text-white'),
        # Default hover & recommended
        ('hover:bg-blue-50', 'hover:bg-amber-50'),
        ('bg-blue-50', 'bg-amber-50'),
        # Cards variant recommended
        ('border-2 border-blue-500', 'border-2 border-amber-500'),
        ('ring-4 ring-blue-100', 'ring-4 ring-amber-100'),
        ('bg-blue-500 text-white', 'bg-amber-600 text-white'),
        # Auto-detect dualism (non-luxury/budget)
        ('from-blue-50 to-indigo-50', 'from-amber-50 to-orange-50'),
        ('border-blue-200', 'border-amber-200'),
        ('from-blue-500 to-indigo-500', 'from-amber-500 to-orange-500'),
        ('text-blue-600', 'text-amber-600'),
        ('from-violet-50 to-purple-50', 'from-orange-50 to-amber-50'),
        ('border-violet-200', 'border-orange-200'),
        ('from-violet-500 to-purple-500', 'from-orange-500 to-amber-600'),
        ('text-violet-600', 'text-orange-600'),
    ],
    'InfoBox.tsx': [
        # note type: purple → stone
        ('from-purple-50 to-violet-50', 'from-stone-50 to-stone-100'),
        ('from-purple-500 to-violet-500', 'from-stone-500 to-stone-600'),
        ('border-purple-300', 'border-stone-300'),
        ('from-purple-400 to-violet-500', 'from-stone-400 to-stone-500'),
        # arc-free type: cyan → amber
        ('from-cyan-50 to-blue-50', 'from-amber-50 to-orange-50'),
        ('from-cyan-500 to-blue-500', 'from-amber-500 to-orange-500'),
        ('border-cyan-300', 'border-amber-300'),
        ('from-cyan-400 to-blue-500', 'from-amber-400 to-orange-500'),
        # info type: blue → stone
        ('from-blue-50 to-indigo-50', 'from-stone-50 to-stone-100'),
        ('from-blue-500 to-indigo-500', 'from-stone-500 to-stone-600'),
        ('border-blue-300', 'border-stone-300'),
        ('from-blue-400 to-indigo-500', 'from-stone-400 to-stone-500'),
    ],
    'BeforeAfter.tsx': [
        ('border-4 border-blue-500', 'border-4 border-amber-500'),
        ('text-blue-500', 'text-amber-600'),
    ],
    'PriceComparisonChart.tsx': [
        # Keep Korea=blue as country identifier, but change purple
        ('from-purple-500 to-purple-600', 'from-amber-500 to-amber-600'),
    ],
}


def process_file(filename: str, replacements: list):
    filepath = os.path.join(os.path.abspath(BASE), filename)
    if not os.path.exists(filepath):
        print(f'  ⚠ {filename} not found')
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)
        return True
    return False


def main():
    changed = 0
    for filename, replacements in FILE_REPLACEMENTS.items():
        if process_file(filename, replacements):
            changed += 1
            print(f'  ✓ {filename}')
        else:
            print(f'  · {filename} (no changes)')
    
    print(f'\nDone: {changed}/{len(FILE_REPLACEMENTS)} files updated')


if __name__ == '__main__':
    main()
