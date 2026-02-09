"""Check for null bytes in file"""
from pathlib import Path

file_path = Path("content/deep-dive/convenience-store-must-buys-gs25-vs-cu-2026.md")

# Read raw bytes
raw = file_path.read_bytes()

# Find null bytes
null_positions = [i for i, b in enumerate(raw) if b == 0]

if null_positions:
    print(f"❌ Found {len(null_positions)} null bytes at positions:")
    for pos in null_positions[:10]:  # Show first 10
        start = max(0, pos - 20)
        end = min(len(raw), pos + 20)
        context = raw[start:end]
        print(f"   Position {pos}: {context!r}")
else:
    print("✅ No null bytes found")

# Check frontmatter ending
front_matter_end = raw.find(b'---\n\n') or raw.find(b'---\r\n\r\n')
if front_matter_end > 0:
    fm_region = raw[:front_matter_end + 10]
    print(f"\n📝 Frontmatter region (first 300 bytes):")
    print(fm_region[:300].decode('utf-8', errors='replace'))
