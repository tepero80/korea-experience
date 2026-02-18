"""
Deep Dive 사전 검증 스크립트
============================
빌드 전 deep-dive MD 파일의 일반적인 문제를 빠르게 검출합니다.
sanitize_mdx 전체를 돌리는 것보다 훨씬 빠른 경량 검사입니다.

사용:
  python -m scripts.deep_dive.validate          # 검사만 (exit 1 on error)
  python -m scripts.deep_dive.validate --fix    # 자동 수정
"""

import re
import sys
from pathlib import Path

DEEP_DIVE_DIR = Path(__file__).resolve().parent.parent.parent / "content" / "deep-dive"

# ── 검사 규칙 ──

CHECKS = [
    # (이름, 정규식, 설명)
    ("bom",
     re.compile(r'\A\ufeff'),
     "UTF-8 BOM 존재 (제거 필요)"),

    ("escaped-quotes",
     re.compile(r'^(title|excerpt):\s*"\\\"', re.MULTILINE),
     "이중 이스케이핑: title/excerpt에 \\\" 존재"),

    ("missing-colon-space",
     re.compile(r'^(title|excerpt|category|author):(?! )', re.MULTILINE),
     "콜론 뒤 공백 누락"),

    ("double-bracket",
     re.compile(r'<\w+\b[^>]*>>'),
     "JSX 컴포넌트 닫는 꺾쇠 중복 (>>)"),

    ("unclosed-infobox",
     re.compile(r'<InfoBox\b[^/]*?/>\s*\n\s*\S', re.DOTALL),
     "InfoBox 자체 닫힘이지만 children 있음 (닫는 태그 필요)"),

    ("missing-frontmatter",
     re.compile(r'\A\ufeff?(?!---)'),
     "frontmatter (---) 누락"),

    ("double-trailing-quote",
     re.compile(r'^(title|excerpt):\s*"[^"]+""$', re.MULTILINE),
     "이중 후행 따옴표"),
]


def validate(fix: bool = False) -> int:
    """deep-dive 파일 검증. fix=True이면 sanitize_mdx로 자동 수정."""
    md_files = sorted(DEEP_DIVE_DIR.glob("*.md"))
    if not md_files:
        print("⚠️  deep-dive 파일이 없습니다.")
        return 0

    errors = []
    for md_file in md_files:
        content = md_file.read_text(encoding="utf-8")
        for name, pattern, desc in CHECKS:
            if pattern.search(content):
                errors.append((md_file.name, name, desc))

    if not errors:
        print(f"✅ {len(md_files)}개 deep-dive 파일 검증 통과")
        return 0

    print(f"\n❌ {len(errors)}건의 문제 발견:\n")
    for fname, check, desc in errors:
        print(f"  {fname}: [{check}] {desc}")

    if fix:
        print(f"\n🔧 sanitize_mdx로 자동 수정 중...")
        from scripts.deep_dive.convert import sanitize_mdx

        fixed_files = set()
        for fname, _, _ in errors:
            if fname in fixed_files:
                continue
            fpath = DEEP_DIVE_DIR / fname
            content = fpath.read_text(encoding="utf-8")
            sanitized, fixes = sanitize_mdx(content)
            if fixes:
                fpath.write_text(sanitized, encoding="utf-8")
                fixed_files.add(fname)
                print(f"  ✅ {fname} ({len(fixes)}건 수정)")

        print(f"\n📊 {len(fixed_files)}개 파일 수정 완료")
        return 0

    print(f"\n💡 자동 수정: python -m scripts.deep_dive.validate --fix")
    return 1


if __name__ == "__main__":
    do_fix = "--fix" in sys.argv
    sys.exit(validate(fix=do_fix))
