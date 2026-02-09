"""
todo.md 파서 및 주제 관리 모듈
================================
todo.md에서 주제 목록을 파싱하고, 다음 처리할 번호를 찾습니다.
상태 추적: 각 항목의 완료 여부, 단계별 진행 상태, 에러 기록.

사용:
  from deep_dive.topics import parse_todo, find_next_number, get_deep_dive_posts
  from deep_dive.topics import update_status, STATUS_DONE, STEP_RESEARCH
"""

import re
from datetime import date
from pathlib import Path

from .config import (
    TODO_FILE, DRAFTS_DIR, DEEP_DIVE_DIR,
    CATEGORY_CODE_MAP,
)

# ── 상태 상수 ──
STATUS_DONE = "done"
STATUS_PARTIAL = "partial"
STATUS_FAILED = "failed"
STATUS_PENDING = ""          # 아직 시작 안 함

STEP_RESEARCH = "R"          # Deep Research 완료
STEP_IMAGE = "I"             # 커버 이미지 생성 완료
STEP_CONVERT = "C"           # MDX 변환 완료

# 전체 파이프라인 단계 집합
ALL_STEPS = {STEP_RESEARCH, STEP_IMAGE, STEP_CONVERT}

# ── 라인 형식 ──
# 기본: "1. [M] Topic name"
# 상태 포함: "1. [M] Topic name  | done | RIC | 2026-02-08"
# 에러 포함: "1. [M] Topic name  | failed | RI | 2026-02-08 | image API timeout"
_LINE_RE = re.compile(
    r"^(\d+)\.\s*\[([A-Z])\]\s*(.+?)(?:\s*\|\s*(done|partial|failed)\s*\|\s*([RIC]*)\s*\|\s*([\d-]+)(?:\s*\|\s*(.+))?)?\s*$"
)


def parse_todo() -> dict[int, dict]:
    """todo.md에서 주제 목록을 파싱합니다.

    Returns:
        {번호: {"number", "code", "topic", "category",
                "status", "steps", "date", "error"}} 딕셔너리
    """
    items = {}
    with open(TODO_FILE, "r", encoding="utf-8") as f:
        for line in f:
            m = _LINE_RE.match(line.strip())
            if not m:
                # 기존 형식 fallback (상태 없음)
                m2 = re.match(r"(\d+)\.\s*\[([A-Z])\]\s*(.+)", line.strip())
                if m2:
                    num = int(m2.group(1))
                    items[num] = {
                        "number": num,
                        "code": m2.group(2),
                        "topic": m2.group(3).strip(),
                        "category": CATEGORY_CODE_MAP.get(m2.group(2), "Unknown"),
                        "status": STATUS_PENDING,
                        "steps": "",
                        "date": "",
                        "error": "",
                    }
                continue

            num = int(m.group(1))
            cat_code = m.group(2)
            items[num] = {
                "number": num,
                "code": cat_code,
                "topic": m.group(3).strip(),
                "category": CATEGORY_CODE_MAP.get(cat_code, "Unknown"),
                "status": m.group(4) or STATUS_PENDING,
                "steps": m.group(5) or "",
                "date": m.group(6) or "",
                "error": (m.group(7) or "").strip(),
            }
    return items


def _format_line(item: dict) -> str:
    """항목 딕셔너리를 todo.md 라인 문자열로 변환합니다."""
    base = f"{item['number']}. [{item['code']}] {item['topic']}"
    if not item.get("status"):
        return base
    parts = [base, item["status"], item.get("steps", ""), item.get("date", "")]
    if item.get("error"):
        parts.append(item["error"])
    return "  | ".join(parts)


def update_status(number: int, *,
                  status: str | None = None,
                  add_step: str | None = None,
                  error: str | None = None) -> bool:
    """todo.md의 특정 번호 항목 상태를 업데이트합니다.

    Args:
        number: 주제 번호
        status: 'done', 'partial', 'failed' 또는 None(자동 판단)
        add_step: 추가할 단계 ('R', 'I', 'C')
        error: 에러 메시지 (있으면 status를 'failed'로 설정)

    Returns:
        성공 여부
    """
    lines = TODO_FILE.read_text(encoding="utf-8").splitlines()
    today = date.today().isoformat()
    updated = False

    for i, line in enumerate(lines):
        m = _LINE_RE.match(line.strip())
        if not m:
            m2 = re.match(r"(\d+)\.\s*\[([A-Z])\]\s*(.+)", line.strip())
            if m2 and int(m2.group(1)) == number:
                # 상태 없는 기존 라인 → 새로 생성
                item = {
                    "number": number,
                    "code": m2.group(2),
                    "topic": m2.group(3).strip(),
                    "status": "",
                    "steps": "",
                    "date": today,
                    "error": "",
                }
                _apply_update(item, status=status, add_step=add_step, error=error, today=today)
                lines[i] = _format_line(item)
                updated = True
                break
            continue

        if int(m.group(1)) != number:
            continue

        item = {
            "number": number,
            "code": m.group(2),
            "topic": m.group(3).strip(),
            "status": m.group(4) or "",
            "steps": m.group(5) or "",
            "date": m.group(6) or "",
            "error": (m.group(7) or "").strip(),
        }
        _apply_update(item, status=status, add_step=add_step, error=error, today=today)
        lines[i] = _format_line(item)
        updated = True
        break

    if updated:
        TODO_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return updated


def _apply_update(item: dict, *, status: str | None, add_step: str | None,
                  error: str | None, today: str):
    """item dict에 업데이트를 적용합니다."""
    if add_step and add_step not in item["steps"]:
        # 순서 유지: R → I → C
        steps_set = set(item["steps"]) | {add_step}
        item["steps"] = "".join(s for s in "RIC" if s in steps_set)

    if error:
        item["error"] = error
        item["status"] = STATUS_FAILED
    elif status:
        item["status"] = status
        if status == STATUS_DONE:
            item["error"] = ""
    else:
        # 자동 판단: 3단계 모두 완료 → done, 1개 이상 → partial
        if set(item["steps"]) >= ALL_STEPS:
            item["status"] = STATUS_DONE
            item["error"] = ""   # 모든 단계 완료 시 에러 클리어
        elif item["steps"]:
            item["status"] = STATUS_PARTIAL
            # 새 단계가 성공적으로 추가됐으면 기존 에러 클리어
            if add_step:
                item["error"] = ""

    item["date"] = today


def find_next_number(items: dict) -> int | None:
    """아직 완료되지 않은 가장 작은 번호를 찾습니다.
    
    상태 기반으로 판단하되, 상태가 없으면 드래프트 파일 존재 여부로 판단합니다.
    """
    for num in sorted(items.keys()):
        item = items[num]
        # 상태가 done이면 스킵
        if item.get("status") == STATUS_DONE:
            continue
        # 상태가 없으면 기존 방식 (드래프트 파일 체크)
        if not item.get("status"):
            txt_files = list(DRAFTS_DIR.glob(f"{num}.*"))
            if not txt_files:
                return num
            for f in txt_files:
                if f.suffix == ".txt" and f.stat().st_size < 100:
                    return num
        else:
            # partial 또는 failed → 재처리 대상
            return num
    return None


def get_deep_dive_posts() -> list[dict]:
    """content/deep-dive/ 에서 기존 포스트 정보를 추출합니다.

    Returns:
        [{"slug", "title", "category", "excerpt", "image_path", "md_file"}]
    """
    posts = []
    for md_file in sorted(DEEP_DIVE_DIR.glob("*.md")):
        content = md_file.read_text(encoding="utf-8")
        fm_match = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
        if not fm_match:
            continue
        fm = fm_match.group(1)

        title = re.search(r'title:\s*"(.+?)"', fm)
        category = re.search(r'category:\s*(.+)', fm)
        excerpt = re.search(r'excerpt:\s*"(.+?)"', fm)
        image = re.search(r'image:\s*"?(/images/[^"\s]+)"?', fm)

        if not title or not image:
            continue

        slug = image.group(1).replace("/images/", "").replace(".webp", "")

        posts.append({
            "slug": slug,
            "title": title.group(1),
            "category": (category.group(1).strip() if category else "Travel & Tourism"),
            "excerpt": (excerpt.group(1)[:200] if excerpt else ""),
            "image_path": image.group(1),
            "md_file": md_file.name,
        })
    return posts


def get_existing_slugs() -> list[str]:
    """content/posts/ + content/deep-dive/ 의 기존 slug 목록을 반환합니다."""
    from .config import POSTS_DIR
    slugs = []
    for d in [POSTS_DIR, DEEP_DIVE_DIR]:
        if d.exists():
            for f in sorted(d.glob("*.md")):
                slugs.append(f.stem)
    return slugs


def get_next_deep_dive_order() -> int:
    """현재 가장 높은 deepDiveOrder + 1을 반환합니다."""
    max_order = 0
    for md_file in DEEP_DIVE_DIR.glob("*.md"):
        content = md_file.read_text(encoding="utf-8")
        m = re.search(r"deepDiveOrder:\s*(\d+)", content)
        if m:
            max_order = max(max_order, int(m.group(1)))
    return max_order + 1
