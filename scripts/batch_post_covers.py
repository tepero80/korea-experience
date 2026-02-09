"""
content/posts 커버 이미지 일괄 생성 스크립트
=============================================
deep_dive/cover.py의 파이프라인을 재사용하여
content/posts의 모든 포스트에 대표 이미지를 생성합니다.

파이프라인: Scene Description → Background Image (Gemini) → Text Overlay (Pillow)

Usage:
  python scripts/batch_post_covers.py                     # 전체 실행
  python scripts/batch_post_covers.py --start 100         # 100번째부터
  python scripts/batch_post_covers.py --only some-slug    # 특정 슬러그만
  python scripts/batch_post_covers.py --dry-run            # 목록만 확인
  python scripts/batch_post_covers.py --limit 10           # 10개만 실행
"""

import sys
import os
import re
import json
import time
import argparse
from pathlib import Path

# 프로젝트 루트를 sys.path에 추가
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from scripts.deep_dive.config import RATE_LIMIT_DELAY, CATEGORY_VISUAL_HINTS
from scripts.deep_dive.cover import generate_cover

POSTS_DIR = PROJECT_ROOT / "content" / "posts"
IMAGES_OUTPUT_DIR = PROJECT_ROOT / "public" / "images" / "posts"
PROGRESS_FILE = PROJECT_ROOT / "scripts" / "cover-progress-posts.json"


def load_progress() -> dict:
    if PROGRESS_FILE.exists():
        return json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
    return {}


def save_progress(progress: dict):
    PROGRESS_FILE.write_text(
        json.dumps(progress, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )


def get_all_posts() -> list[dict]:
    """content/posts의 모든 .md 파일에서 frontmatter 파싱"""
    posts = []
    for md_file in sorted(POSTS_DIR.glob("*.md")):
        content = md_file.read_text(encoding="utf-8")
        fm_match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
        if not fm_match:
            continue

        fm = fm_match.group(1)

        title_m = re.search(r'^title:\s*["\']?(.*?)["\']?\s*$', fm, re.MULTILINE)
        cat_m = re.search(r'^category:\s*["\']?(.*?)["\']?\s*$', fm, re.MULTILINE)
        excerpt_m = re.search(r'^excerpt:\s*["\']?(.*?)["\']?\s*$', fm, re.MULTILINE)
        image_m = re.search(r'^image:\s*(.+)$', fm, re.MULTILINE)

        title = title_m.group(1) if title_m else md_file.stem
        category = cat_m.group(1) if cat_m else "Travel & Tourism"
        excerpt = excerpt_m.group(1) if excerpt_m else ""
        has_image = bool(image_m)

        posts.append({
            "slug": md_file.stem,
            "title": title,
            "category": category,
            "excerpt": excerpt,
            "has_image": has_image,
            "file": md_file,
        })

    return posts


def add_image_to_frontmatter(md_file: Path, image_path: str):
    """포스트 frontmatter에 image 필드 추가"""
    content = md_file.read_text(encoding="utf-8")
    fm_match = re.match(r"^(---\n)(.*?)(\n---)", content, re.DOTALL)
    if not fm_match:
        return

    fm = fm_match.group(2)

    # 이미 image 필드가 있으면 교체
    if re.search(r"^image:", fm, re.MULTILINE):
        fm = re.sub(r"^image:.*$", f'image: "{image_path}"', fm, flags=re.MULTILINE)
    else:
        # featured 뒤에 추가 (또는 frontmatter 끝에)
        if "featured:" in fm:
            fm = re.sub(
                r"(^featured:.*$)",
                rf'\1\nimage: "{image_path}"',
                fm,
                flags=re.MULTILINE,
            )
        else:
            fm += f'\nimage: "{image_path}"'

    new_content = fm_match.group(1) + fm + fm_match.group(3) + content[fm_match.end():]
    md_file.write_text(new_content, encoding="utf-8")


def generate_post_cover(slug: str, title: str, category: str, excerpt: str) -> Path | None:
    """포스트용 커버 이미지 생성 (deep_dive/cover.py 파이프라인 재사용, 저장 경로만 변경)"""
    from scripts.deep_dive.cover import (
        generate_scene_description,
        generate_background_image,
        overlay_text,
        make_short_title,
    )
    from scripts.deep_dive.config import IMAGES_DIR as DD_IMAGES_DIR

    IMAGES_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    short_title = make_short_title(title)
    print(f"  📝 Scene 생성...")

    scene = generate_scene_description(title, category, excerpt)
    print(f"  Scene: {scene[:80]}...")
    print(f"  🎨 이미지 생성...")

    bg_path = generate_background_image(scene, slug)
    if not bg_path:
        print(f"  ❌ 배경 이미지 생성 실패")
        return None

    from PIL import Image as PILImage
    bg_img = PILImage.open(bg_path)
    print(f"  ✅ 배경: {bg_img.size[0]}x{bg_img.size[1]}")
    print(f"  🔤 오버레이...")

    # overlay_text는 IMAGES_DIR에 저장하므로, 임시로 실행 후 파일 이동
    result = overlay_text(bg_path, short_title, slug)
    if not result:
        print(f"  ❌ 오버레이 실패")
        return None

    # deep-dive 디렉토리에서 posts 디렉토리로 이동
    final_path = IMAGES_OUTPUT_DIR / f"{slug}.webp"
    if result != final_path:
        import shutil
        shutil.move(str(result), str(final_path))

    # raw 파일 정리
    for attempt in range(5):
        try:
            if bg_path.exists():
                time.sleep(0.5)
                bg_path.unlink()
                break
        except OSError:
            if attempt < 4:
                time.sleep(1)

    file_size = final_path.stat().st_size
    print(f"  ✅ 완료: {final_path.name} ({file_size // 1024}KB)")
    return final_path


def main():
    parser = argparse.ArgumentParser(description="content/posts 커버 이미지 일괄 생성")
    parser.add_argument("--start", type=int, default=1, help="시작 번호 (1-based)")
    parser.add_argument("--only", type=str, help="특정 슬러그만 처리")
    parser.add_argument("--dry-run", action="store_true", help="목록만 확인")
    parser.add_argument("--limit", type=int, default=0, help="최대 처리 개수 (0=무제한)")
    parser.add_argument("--skip-done", action="store_true", default=True, help="완료 건너뛰기")
    parser.add_argument("--delay", type=int, default=RATE_LIMIT_DELAY, help="API 호출 간 대기 초")
    args = parser.parse_args()

    posts = get_all_posts()
    print(f"📋 content/posts: {len(posts)}개")

    if args.only:
        posts = [p for p in posts if p["slug"] == args.only]
        if not posts:
            print(f"❌ 슬러그 '{args.only}'를 찾을 수 없습니다")
            sys.exit(1)

    progress = load_progress()

    if args.dry_run:
        for i, post in enumerate(posts, 1):
            done = "✅" if progress.get(post["slug"]) else "⬜"
            print(f"  {done} {i:3d}. {post['slug'][:60]}")
        done_count = sum(1 for p in posts if progress.get(p["slug"]))
        print(f"\n완료: {done_count}/{len(posts)}")
        return

    # 필터링
    posts_to_process = posts[args.start - 1:]
    if args.skip_done:
        posts_to_process = [p for p in posts_to_process if not progress.get(p["slug"])]

    if args.limit > 0:
        posts_to_process = posts_to_process[:args.limit]

    total = len(posts_to_process)
    print(f"🚀 처리 대상: {total}개 (시작: #{args.start}, delay: {args.delay}초)\n")

    success = fail = 0
    start_time = time.time()

    for i, post in enumerate(posts_to_process, 1):
        print(f"\n{'='*60}")
        print(f"[{i}/{total}] {post['slug']}")
        print(f"  제목: {post['title'][:60]}")
        print(f"  카테고리: {post['category']}")

        try:
            result = generate_post_cover(
                slug=post["slug"],
                title=post["title"],
                category=post["category"],
                excerpt=post["excerpt"],
            )

            if result:
                # frontmatter에 image 필드 추가
                image_web_path = f"/images/posts/{post['slug']}.webp"
                add_image_to_frontmatter(post["file"], image_web_path)
                print(f"  📝 frontmatter 업데이트 완료")

                progress[post["slug"]] = True
                save_progress(progress)
                success += 1
            else:
                progress[post["slug"]] = False
                save_progress(progress)
                fail += 1

        except Exception as e:
            print(f"  ❌ 예외: {e}")
            import traceback
            traceback.print_exc()
            progress[post["slug"]] = False
            save_progress(progress)
            fail += 1

        # 경과 시간 & 예상 남은 시간
        elapsed = time.time() - start_time
        avg_per_item = elapsed / i
        remaining = avg_per_item * (total - i)
        print(f"  ⏱️ {elapsed/60:.1f}분 경과, 약 {remaining/60:.1f}분 남음")

        if i < total:
            time.sleep(args.delay)

    elapsed = time.time() - start_time
    print(f"\n{'='*60}")
    print(f"🎉 완료! 성공: {success}, 실패: {fail}, 전체: {total}")
    print(f"   총 소요: {elapsed/60:.1f}분")
    done_total = sum(1 for v in progress.values() if v)
    print(f"   전체 진행률: {done_total}/{len(posts)}")


if __name__ == "__main__":
    main()
