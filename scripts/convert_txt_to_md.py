"""TXT 파일을 MD로 변환"""
from pathlib import Path
import re

txt_path = Path(r"C:\kc\korea-experience\content\deep-dive-drafts\47. [F] Convenience Store Must-Buys GS25 vs. CU.txt")
output_path = Path(r"C:\kc\korea-experience\content\deep-dive\convenience-store-must-buys-gs25-vs-cu-2026.md")

# UTF-8로 읽기
content = txt_path.read_text(encoding='utf-8')

# Title 추출
title_match = re.search(r'## TITLE\n(.+?)\n', content)
title = title_match.group(1) if title_match else ""

# Excerpt 추출
excerpt_match = re.search(r'## EXCERPT\n(.+?)\n\n', content, re.DOTALL)
excerpt = excerpt_match.group(1).strip() if excerpt_match else ""

# Category 추출
category_match = re.search(r'## CATEGORY\n(.+?)\n', content)
category = category_match.group(1) if category_match else ""

# 본문 추출 (--- 이후)
body_match = re.search(r'---\n\n(.+)', content, re.DOTALL)
body = body_match.group(1) if body_match else ""

# MD frontmatter + body 생성
md_content = f"""---
title: "{title}"
date: 2026-02-09
excerpt: {excerpt}
category: {category}
author: Korea Experience Team
deepDive: true
deepDiveOrder: 47
image: "/images/convenience-store-must-buys-gs25-vs-cu.webp"
---

{body}"""

# UTF-8로 저장
output_path.write_text(md_content, encoding='utf-8', newline='\n')
print(f"변환 완료: {output_path}")
