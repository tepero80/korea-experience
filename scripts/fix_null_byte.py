"""파일에 null byte 확인 및 제거"""
from pathlib import Path
import sys

file_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(r"C:\kc\korea-experience\content\deep-dive\convenience-store-must-buys-gs25-vs-cu-2026.md")
content = file_path.read_bytes()

print(f"파일 크기: {len(content)} bytes")
print(f"마지막 20 bytes: {content[-20:]}")
null_byte = b'\x00'
has_null = null_byte in content
print(f"Null byte 있음: {has_null}")

if has_null:
    # null byte 위치 찾기
    null_pos = content.index(b'\x00')
    print(f"\nNull byte 위치: {null_pos}")
    print(f"주변 내용 (before): {content[null_pos-30:null_pos]}")
    print(f"주변 내용 (after): {content[null_pos+1:null_pos+30]}")
    
    # null byte 제거
    cleaned = content.replace(b'\x00', b'')
    file_path.write_bytes(cleaned)
    print(f"\n✅ Null byte 제거 완료")
