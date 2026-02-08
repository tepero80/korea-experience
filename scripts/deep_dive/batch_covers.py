"""
커버 이미지 일괄 생성/교체 CLI
================================
기존 deep-dive 포스트의 커버 이미지를 Pillow 오버레이 방식으로 일괄 교체합니다.

Usage:
  python -m scripts.deep-dive.batch-covers                    # 전체
  python -m scripts.deep-dive.batch-covers --start 5          # 5번째부터
  python -m scripts.deep-dive.batch-covers --only some-slug   # 특정 슬러그만
  python -m scripts.deep-dive.batch-covers --dry-run          # 목록만 확인
"""

import sys
import os
import json
import time
import argparse
from pathlib import Path

# 프로젝트 루트를 sys.path에 추가
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from scripts.deep_dive.config import RATE_LIMIT_DELAY
from scripts.deep_dive.topics import get_deep_dive_posts
from scripts.deep_dive.cover import generate_cover

PROGRESS_FILE = Path(__file__).resolve().parent / "cover-progress.json"


def load_progress() -> dict:
    if PROGRESS_FILE.exists():
        return json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
    return {}


def save_progress(progress: dict):
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2, ensure_ascii=False), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Deep-Dive 커버 이미지 일괄 교체")
    parser.add_argument("--start", type=int, default=1, help="시작 번호 (1-based)")
    parser.add_argument("--only", type=str, help="특정 슬러그만 처리")
    parser.add_argument("--dry-run", action="store_true", help="실행 없이 목록만 출력")
    parser.add_argument("--skip-done", action="store_true", default=True, help="완료 항목 건너뛰기")
    args = parser.parse_args()

    posts = get_deep_dive_posts()
    print(f"📋 Deep-Dive 포스트: {len(posts)}개")

    if args.only:
        posts = [p for p in posts if p["slug"] == args.only]
        if not posts:
            print(f"❌ 슬러그 '{args.only}'를 찾을 수 없습니다")
            sys.exit(1)

    progress = load_progress()

    if args.dry_run:
        for i, post in enumerate(posts, 1):
            done = "✅" if progress.get(post["slug"]) else "⬜"
            print(f"  {done} {i:2d}. {post['slug']} | {post['title'][:50]}")
        done_count = sum(1 for p in posts if progress.get(p["slug"]))
        print(f"\n완료: {done_count}/{len(posts)}")
        return

    # 필터링
    posts_to_process = posts[args.start - 1:]
    if args.skip_done:
        posts_to_process = [p for p in posts_to_process if not progress.get(p["slug"])]

    total = len(posts_to_process)
    print(f"🚀 처리 대상: {total}개 (시작: #{args.start})\n")

    success = fail = 0
    for i, post in enumerate(posts_to_process, 1):
        print(f"\n{'='*60}")
        print(f"[{i}/{total}] {post['slug']}")
        print(f"  제목: {post['title']}")
        print(f"  카테고리: {post['category']}")

        try:
            result = generate_cover(
                slug=post["slug"],
                title=post["title"],
                category=post["category"],
                excerpt=post["excerpt"],
            )
            if result:
                progress[post["slug"]] = True
                save_progress(progress)
                success += 1
            else:
                progress[post["slug"]] = False
                save_progress(progress)
                fail += 1
        except Exception as e:
            print(f"  ❌ 예외 발생: {e}")
            progress[post["slug"]] = False
            save_progress(progress)
            fail += 1

        if i < total:
            print(f"  ⏳ 대기 중 ({RATE_LIMIT_DELAY}초)...")
            time.sleep(RATE_LIMIT_DELAY)

    print(f"\n{'='*60}")
    print(f"🎉 완료! 성공: {success}, 실패: {fail}, 전체: {total}")
    print(f"   진행률: {sum(1 for v in progress.values() if v)}/{len(posts)}")


if __name__ == "__main__":
    main()
