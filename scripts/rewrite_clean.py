"""Complete file rewrite to remove any hidden null bytes"""
from pathlib import Path

file_path = Path("content/deep-dive/convenience-store-must-buys-gs25-vs-cu-2026.md")

# Read and clean
content = file_path.read_text(encoding='utf-8')

# Write back with explicit UTF-8, no BOM
file_path.write_text(content, encoding='utf-8', newline='\n')

print(f"✅ 파일 재작성 완료: {file_path}")
print(f"   Length: {len(content)} chars")
