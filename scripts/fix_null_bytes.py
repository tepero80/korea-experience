"""Remove null bytes from convenience store file"""
from pathlib import Path

file_path = Path("content/deep-dive/convenience-store-must-buys-gs25-vs-cu-2026.md")

# Read with UTF-8
content = file_path.read_bytes()

# Remove null bytes
cleaned = content.replace(b'\x00', b'')

# Write back
file_path.write_bytes(cleaned)

print(f"✅ Null bytes 제거 완료: {file_path}")
print(f"   Before: {len(content)} bytes")
print(f"   After: {len(cleaned)} bytes")
