"""
Deep Dive 전체 파이프라인 CLI
===============================
Deep Research → 커버 이미지 → MDX 변환 전체 파이프라인을 실행합니다.

Usage:
  # 자동 감지 (다음 미완료 번호)
  python -m scripts.deep_dive.generate

  # 특정 번호
  python -m scripts.deep_dive.generate -n 39

  # 배치 (범위)
  python -m scripts.deep_dive.generate --from 39 --to 50

  # 옵션별 실행
  python -m scripts.deep_dive.generate -n 39 --dry-run
  python -m scripts.deep_dive.generate -n 39 --image-only
  python -m scripts.deep_dive.generate -n 39 --convert-only
  python -m scripts.deep_dive.generate -n 39 --no-image
  python -m scripts.deep_dive.generate -n 39 --no-convert

  # 기존 MDX에 커버 이미지 일괄 생성
  python -m scripts.deep_dive.generate --backfill-covers
"""

import argparse
import os
import re
import sys
import time
from pathlib import Path

# 프로젝트 루트를 sys.path에 추가
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from scripts.deep_dive.config import (
    API_KEY, DRAFTS_DIR, IMAGES_DIR, DEEP_DIVE_DIR,
    IMAGE_MODEL, COVER_IMAGE_TEMPLATE,
    CATEGORY_VISUAL_HINTS,
)
from scripts.deep_dive.topics import (
    parse_todo, find_next_number, get_existing_slugs, get_next_deep_dive_order,
    update_status, STEP_RESEARCH, STEP_IMAGE, STEP_CONVERT,
)
from scripts.deep_dive.research import (
    build_prompt, run_deep_research,
)
from scripts.deep_dive.convert import (
    convert_to_mdx, save_mdx, build_conversion_prompt,
)
from scripts.deep_dive.cover import generate_cover
from scripts.deep_dive.links import refresh_index


# ── 드래프트 커버 이미지 (원본 방식 — Gemini 텍스트 렌더링) ──

def parse_cover_image_elements(draft_text: str) -> dict | None:
    """드래프트에서 COVER IMAGE 섹션의 요소를 파싱합니다."""
    cover_match = re.search(
        r"##\s*COVER\s*IMAGE.*?\n(.*?)(?=\n##\s|\Z)",
        draft_text, re.DOTALL | re.IGNORECASE,
    )
    if not cover_match:
        cover_match = re.search(
            r"COVER\s*IMAGE\s*\n(.*?)(?=\n(?:OPTIONAL|SOURCES|ARTICLE|LOCATIONS|PRICE|KEY STAT|ROUTE)|\Z)",
            draft_text, re.DOTALL | re.IGNORECASE,
        )
    if not cover_match:
        return None

    section = cover_match.group(1)

    def extract_field(name: str) -> str:
        patterns = [
            rf"\*\*{name}:\*\*\s*(.+?)(?=\n\*\*|\n---|\Z)",
            rf"{name}:\s*(.+?)(?=\n[A-Z]|\n\*\*|\n---|\Z)",
        ]
        for pat in patterns:
            m = re.search(pat, section, re.IGNORECASE | re.DOTALL)
            if m:
                return m.group(1).strip().strip('"\'')
        return ""

    scene = extract_field("Scene")
    if not scene:
        return None

    return {
        "short_title": extract_field("Short Title") or "Korea Guide",
        "scene": scene,
        "key_objects": extract_field("Key Objects") or "Korean cityscape",
        "mood": extract_field("Mood") or "vibrant",
        "color_palette": extract_field("Color Palette") or "warm tones, soft blue",
    }


def generate_legacy_cover(elements: dict, category: str, slug: str, api_key: str) -> Path | None:
    """기존 방식: Gemini Image Model에게 텍스트 포함 이미지 직접 생성"""
    from google import genai
    from google.genai import types
    from PIL import Image as PILImage
    import tempfile

    client = genai.Client(api_key=api_key)
    prompt = COVER_IMAGE_TEMPLATE.format(
        short_title=elements["short_title"],
        category=category,
        scene=elements["scene"],
        key_objects=elements["key_objects"],
        mood=elements["mood"],
        color_palette=elements["color_palette"],
    )

    print(f"\n🎨 커버 이미지 생성 중...")
    print(f"   Short Title: \"{elements['short_title']}\"")

    try:
        response = client.models.generate_content(
            model=IMAGE_MODEL,
            contents=[prompt],
            config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
        )

        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
        output_path = IMAGES_DIR / f"{slug}.webp"

        for part in response.parts:
            if part.inline_data is not None:
                image = part.as_image()
                with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                    tmp_path = tmp.name
                image.save(tmp_path)
                PILImage.open(tmp_path).save(str(output_path), format="WEBP", quality=85)
                Path(tmp_path).unlink(missing_ok=True)
                print(f"✅ 저장: {output_path.name}")
                return output_path

        return None
    except Exception as e:
        print(f"⚠️  이미지 생성 실패: {e}")
        return None


def make_slug(topic: str) -> str:
    """토픽 이름에서 파일명용 slug를 생성합니다."""
    slug = topic.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    if len(slug) > 60:
        slug = slug[:60].rsplit("-", 1)[0]
    return slug


def get_draft_filepath(num: int, items: dict) -> Path:
    """드래프트 파일 경로를 찾거나 생성합니다."""
    existing = list(DRAFTS_DIR.glob(f"{num}.*txt"))
    if existing:
        return existing[0]
    item = items[num]
    filename = f"{num}. [{item['code']}] {item['topic']}.txt"
    return DRAFTS_DIR / filename


# ── 메인 처리 ──

def process_item(num, items, api_key, dry_run=False,
                 no_image=False, image_only=False, no_convert=False, convert_only=False,
                 force_research=False):
    """하나의 주제를 처리합니다."""
    if num not in items:
        print(f"❌ #{num}번은 todo.md에 없습니다.")
        return False

    item = items[num]
    filepath = get_draft_filepath(num, items)
    slug = make_slug(item["topic"])

    print(f"\n{'='*60}")
    print(f"📝 #{num}. [{item['code']}] {item['topic']}")
    print(f"   카테고리: {item['category']}")
    print(f"   슬러그: {slug}")
    print(f"{'='*60}")

    # --convert-only
    if convert_only:
        if not filepath.exists() or filepath.stat().st_size < 500:
            print(f"❌ 드래프트 파일이 없거나 너무 짧습니다.")
            update_status(num, error="draft file missing or too short")
            return False
        draft_text = filepath.read_text(encoding="utf-8")
        img_path = IMAGES_DIR / f"{slug}.webp"
        image_rel = f"/images/{slug}.webp" if img_path.exists() else None
        if dry_run:
            print(f"\n🔍 [DRY RUN] deepDiveOrder: {get_next_deep_dive_order()}, 이미지: {image_rel or '없음'}")
            return True
        mdx_content = convert_to_mdx(draft_text, item["category"], slug, image_rel, api_key,
                                       topic=item["topic"])
        if mdx_content:
            save_mdx(mdx_content, slug)
            update_status(num, add_step=STEP_CONVERT)
            refresh_index()  # 새 포스트 반영
        else:
            update_status(num, error="mdx conversion failed")
        return mdx_content is not None

    # --image-only
    if image_only:
        if not filepath.exists() or filepath.stat().st_size < 500:
            print(f"❌ 드래프트 파일이 없습니다.")
            update_status(num, error="draft file missing")
            return False
        draft_text = filepath.read_text(encoding="utf-8")
        elements = parse_cover_image_elements(draft_text)
        if not elements:
            print(f"⚠️  COVER IMAGE 섹션을 찾을 수 없습니다.")
            update_status(num, error="no COVER IMAGE section")
            return False
        if dry_run:
            print(f"\n🔍 [DRY RUN] Short Title: \"{elements['short_title']}\"")
            return True
        # Pillow 오버레이 방식 사용
        result = generate_cover(slug, item["topic"], item["category"])
        if result:
            update_status(num, add_step=STEP_IMAGE)
        else:
            update_status(num, error="image generation failed")
        return result is not None

    # 기존 드래프트 확인 (--force-research는 재사용 무시)
    if filepath.exists() and filepath.stat().st_size > 500 and not force_research:
        size_kb = filepath.stat().st_size // 1024
        print(f"⏭️  드래프트 재사용 ({size_kb}KB). 리서치 API 스킵 → ~$1.5-3 절약.")
        result = filepath.read_text(encoding="utf-8")
        update_status(num, add_step=STEP_RESEARCH)
    else:
        prompt = build_prompt(item["topic"], item["category"])

        if dry_run:
            print(f"\n🔍 [DRY RUN] 프롬프트 ({len(prompt):,}자)")
            print(prompt[:500])
            print("...")
            return True

        # Deep Research 실행
        try:
            result = run_deep_research(prompt, api_key)
        except Exception as e:
            print(f"❌ 에러: {e}")
            update_status(num, error=f"research failed: {e}")
            return False

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(result)
        print(f"💾 저장: {filepath.name} ({len(result):,}자)")
        update_status(num, add_step=STEP_RESEARCH)

    # 커버 이미지 — Pillow 오버레이 방식
    image_rel_path = None
    if not no_image:
        img_path = IMAGES_DIR / f"{slug}.webp"
        if img_path.exists() and img_path.stat().st_size > 1000:
            print(f"⏭️  커버 이미지 이미 존재 ({img_path.stat().st_size // 1024}KB). 스킵.")
            image_rel_path = f"/images/{slug}.webp"
            update_status(num, add_step=STEP_IMAGE)
        else:
            img_result = generate_cover(slug, item["topic"], item["category"])
            if img_result:
                image_rel_path = f"/images/{slug}.webp"
                update_status(num, add_step=STEP_IMAGE)
            else:
                print("⚠️  커버 이미지 생성 실패.")
                update_status(num, error="image generation failed")

    # MDX 변환
    if not no_convert:
        mdx_slug = f"{slug}-2026" if not slug.endswith("-2026") else slug
        mdx_path = DEEP_DIVE_DIR / f"{mdx_slug}.md"
        if mdx_path.exists() and mdx_path.stat().st_size > 1000:
            print(f"⏭️  MDX 파일 이미 존재 ({mdx_path.stat().st_size // 1024}KB). 스킵.")
            update_status(num, add_step=STEP_CONVERT)
        else:
            mdx_content = convert_to_mdx(result, item["category"], slug, image_rel_path, api_key,
                                         topic=item["topic"])
            if mdx_content:
                save_mdx(mdx_content, slug)
                update_status(num, add_step=STEP_CONVERT)
                refresh_index()  # 새 포스트 반영
                print(f"\n🎉 전체 파이프라인 완료!")
            else:
                print(f"\n⚠️  MDX 변환 실패. --convert-only로 재시도 가능.")
                update_status(num, error="mdx conversion failed")

    return True


# ── Backfill ──

COVER_ELEMENTS_PROMPT = """You are a creative director for "Korea Experience", a premium Korea travel blog.
Given a blog post's title, excerpt, and category, generate COVER IMAGE elements.

Output EXACTLY this format:
Short Title: [2-5 words, punchy headline]
Scene: [1-2 sentences, vivid photographic scene specific to Korea]
Key Objects: [3-5 concrete visual elements, comma-separated]
Mood: [1-2 words]
Color Palette: [2-3 color descriptions]

---
Title: "{title}"
Excerpt: "{excerpt}"
Category: {category}
"""


def backfill_covers(api_key, dry_run=False, limit=0):
    """기존 deep-dive MDX에 커버 이미지를 일괄 생성합니다."""
    from google import genai
    from google.genai import types

    print(f"\n🖼️  Deep-Dive 커버 이미지 Backfill\n{'='*60}")

    targets = []
    for md_file in sorted(DEEP_DIVE_DIR.glob("*.md")):
        content = md_file.read_text(encoding="utf-8")
        fm_match = re.match(r"---\n(.*?)\n---", content, re.DOTALL)
        if not fm_match:
            continue
        fm = fm_match.group(1)
        if re.search(r"^image:", fm, re.MULTILINE):
            continue

        title_m = re.search(r'^title:\s*"?(.+?)"?\s*$', fm, re.MULTILINE)
        excerpt_m = re.search(r'^excerpt:\s*"?(.+?)"?\s*$', fm, re.MULTILINE)
        category_m = re.search(r'^category:\s*(.+)$', fm, re.MULTILINE)
        if not title_m or not category_m:
            continue

        targets.append({
            "file": md_file, "slug": md_file.stem,
            "title": title_m.group(1).strip(),
            "excerpt": excerpt_m.group(1).strip() if excerpt_m else "",
            "category": category_m.group(1).strip(),
        })

    if limit > 0:
        targets = targets[:limit]

    print(f"📋 이미지 없는 파일: {len(targets)}개")
    if not targets:
        print("✅ 모든 파일에 이미지가 있습니다!")
        return

    if dry_run:
        for t in targets:
            print(f"   • {t['slug']} ({t['category']})")
        return

    success = failed = 0
    for i, t in enumerate(targets):
        print(f"\n[{i+1}/{len(targets)}] {t['slug']}")

        # Pillow 오버레이 방식으로 생성
        img_result = generate_cover(t["slug"], t["title"], t["category"], t["excerpt"])
        if not img_result:
            failed += 1
            continue

        # frontmatter에 image 추가
        image_rel = f"/images/{t['slug']}.webp"
        content = t["file"].read_text(encoding="utf-8")
        updated = re.sub(
            r"(deepDiveOrder:\s*\d+)",
            r'\1\nimage: "' + image_rel + r'"',
            content, count=1,
        )
        if updated == content:
            updated = re.sub(
                r"(author:\s*.+)",
                r'\1\nimage: "' + image_rel + r'"',
                content, count=1,
            )
        t["file"].write_text(updated, encoding="utf-8")
        print(f"   ✅ frontmatter 업데이트")
        success += 1

        if i < len(targets) - 1:
            time.sleep(5)

    print(f"\n📊 Backfill 완료: ✅ {success} / ❌ {failed} / 전체 {len(targets)}")


# ── CLI ──

def main():
    parser = argparse.ArgumentParser(
        description="Deep Dive Content Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
실행 모드:
  python -m scripts.deep_dive -n 39                 # 특정 번호 1개
  python -m scripts.deep_dive --from 39 --to 50     # 범위 지정
  python -m scripts.deep_dive -c 10                  # 다음 미완료 10개
  python -m scripts.deep_dive --all                  # 미완료 전체
  python -m scripts.deep_dive                        # 다음 미완료 1개 (기본)

옵션 조합:
  python -m scripts.deep_dive -c 5 --dry-run         # 다음 5개 확인만
  python -m scripts.deep_dive -n 39 --image-only     # 이미지만 생성
  python -m scripts.deep_dive --all --convert-only    # 전체 MDX 재변환
  python -m scripts.deep_dive --backfill-covers       # 커버 일괄 생성
        """,
    )
    # 실행 모드
    mode = parser.add_argument_group("실행 모드 (택1)")
    mode.add_argument("--number", "-n", type=int, help="특정 주제 번호 1개 처리")
    mode.add_argument("--from", dest="from_num", type=int, help="배치 시작 번호")
    mode.add_argument("--to", dest="to_num", type=int, help="배치 종료 번호")
    mode.add_argument("--count", "-c", type=int, help="다음 미완료 N개 순서대로 처리")
    mode.add_argument("--all", action="store_true", help="미완료 전체 처리")

    # 파이프라인 옵션
    pipe = parser.add_argument_group("파이프라인 옵션")
    pipe.add_argument("--dry-run", action="store_true", help="API 호출 없이 확인만")
    pipe.add_argument("--no-image", action="store_true", help="커버 이미지 건너뛰기")
    pipe.add_argument("--image-only", action="store_true", help="이미지만 생성")
    pipe.add_argument("--no-convert", action="store_true", help="MDX 변환 건너뛰기")
    pipe.add_argument("--convert-only", action="store_true", help="MDX 변환만")
    pipe.add_argument("--force-research", action="store_true",
                      help="기존 드래프트가 있어도 Deep Research를 강제 재실행 (비용 추가 발생)")
    pipe.add_argument("--backfill-covers", action="store_true", help="기존 MDX에 커버 일괄 생성")
    pipe.add_argument("--backfill-limit", type=int, default=0, help="backfill 최대 처리 수")
    pipe.add_argument("--sanitize", action="store_true",
                      help="기존 deep-dive MD 파일 전체를 sanitize_mdx로 정리")
    pipe.add_argument("--sanitize-check", action="store_true",
                      help="sanitize 필요 여부만 검사 (수정 없음, CI용)")
    args = parser.parse_args()

    api_key = API_KEY
    if not api_key and not args.dry_run and not args.sanitize and not args.sanitize_check:
        print("❌ GEMINI_API_KEY가 .env.local에 설정되지 않았습니다.")
        sys.exit(1)

    if args.sanitize or args.sanitize_check:
        sanitize_existing(dry_run=args.sanitize_check)
        return

    if args.backfill_covers:
        backfill_covers(api_key, args.dry_run, args.backfill_limit)
        return

    items = parse_todo()
    done_count = sum(1 for i in items.values() if i.get("status") == "done")
    print(f"📋 todo.md: {len(items)}개 주제 ({done_count} 완료, {len(items) - done_count} 남음)")

    # 공통 kwargs
    kwargs = dict(
        dry_run=args.dry_run,
        no_image=args.no_image, image_only=args.image_only,
        no_convert=args.no_convert, convert_only=args.convert_only,
        force_research=args.force_research,
    )

    # ① 특정 번호
    if args.number:
        process_item(args.number, items, api_key, **kwargs)

    # ② 범위 지정
    elif args.from_num and args.to_num:
        targets = list(range(args.from_num, args.to_num + 1))
        _run_batch(targets, items, api_key, kwargs)

    # ③ 다음 N개
    elif args.count:
        targets = _get_pending_numbers(items, args.count)
        if not targets:
            print("✅ 모든 주제가 완료되었습니다!")
        else:
            print(f"🎯 다음 {len(targets)}개: #{targets[0]}~#{targets[-1]}")
            _run_batch(targets, items, api_key, kwargs)

    # ④ 전체
    elif args.all:
        targets = _get_pending_numbers(items, limit=0)
        if not targets:
            print("✅ 모든 주제가 완료되었습니다!")
        else:
            print(f"🎯 미완료 전체 {len(targets)}개: #{targets[0]}~#{targets[-1]}")
            _run_batch(targets, items, api_key, kwargs)

    # ⑤ 기본: 다음 1개
    else:
        next_num = find_next_number(items)
        if next_num is None:
            print("✅ 모든 주제가 완료되었습니다!")
        else:
            print(f"🎯 다음 주제: #{next_num}")
            process_item(next_num, items, api_key, **kwargs)


def _get_pending_numbers(items: dict, limit: int = 0) -> list[int]:
    """미완료 주제 번호를 순서대로 반환합니다. limit=0이면 전체."""
    from .topics import STATUS_DONE
    pending = [
        num for num in sorted(items.keys())
        if items[num].get("status") != STATUS_DONE
    ]
    return pending if limit == 0 else pending[:limit]


def sanitize_existing(dry_run: bool = False):
    """기존 deep-dive MD 파일 전체를 sanitize_mdx로 정리합니다.

    --sanitize       : 실제 수정
    --sanitize-check : 수정 필요 여부 검출만 (CI / prebuild용)
    """
    from scripts.deep_dive.convert import sanitize_mdx

    md_files = sorted(DEEP_DIVE_DIR.glob("*.md"))
    mode = "CHECK" if dry_run else "FIX"
    print(f"\n🔍 Deep-Dive Sanitize ({mode})\n{'='*60}")
    print(f"📁 대상: {DEEP_DIVE_DIR}  ({len(md_files)}개 파일)\n")

    total_fixes = 0
    files_with_issues = []

    for md_file in md_files:
        content = md_file.read_text(encoding="utf-8")
        sanitized, fixes = sanitize_mdx(content)

        if fixes:
            total_fixes += len(fixes)
            files_with_issues.append((md_file.name, fixes))
            print(f"  {'⚠️' if dry_run else '🔧'} {md_file.name}")
            for f in fixes:
                print(f"      • {f}")

            if not dry_run:
                md_file.write_text(sanitized, encoding="utf-8")

    print(f"\n{'='*60}")
    if files_with_issues:
        print(f"📊 {len(files_with_issues)}개 파일, {total_fixes}건 {'발견' if dry_run else '수정'}")
        if dry_run:
            print("   → --sanitize 로 실행하면 자동 수정됩니다.")
            sys.exit(1)  # CI에서 실패 감지용
    else:
        print("✅ 모든 파일 정상!")


def _run_batch(targets: list[int], items: dict, api_key: str, kwargs: dict):
    """배치 실행 공통 로직."""
    success = failed = skipped = 0
    total = len(targets)
    for i, num in enumerate(targets):
        print(f"\n{'─'*60}")
        print(f"📦 [{i+1}/{total}]")
        if num not in items:
            print(f"⚠️  #{num}번은 todo.md에 없습니다. 스킵.")
            skipped += 1
            continue
        try:
            ok = process_item(num, items, api_key, **kwargs)
            if ok:
                success += 1
            else:
                failed += 1
        except KeyboardInterrupt:
            print(f"\n\n⛔ 사용자 중단 (Ctrl+C)")
            print(f"📊 중간 결과: ✅ {success} / ❌ {failed} / ⏭️ {skipped} / 전체 {total}")
            sys.exit(130)
        except Exception as e:
            print(f"❌ #{num} 예외: {e}")
            failed += 1

    print(f"\n{'═'*60}")
    print(f"📊 배치 완료: ✅ {success} / ❌ {failed} / ⏭️ {skipped} / 전체 {total}")


if __name__ == "__main__":
    main()
