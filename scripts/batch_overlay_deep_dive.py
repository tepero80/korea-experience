"""
Deep Dive Raw 이미지에 텍스트 오버레이 일괄 적용
==================================================
public/images/deep-dive/*-raw.webp → *.webp
"""

import sys
from pathlib import Path

# 프로젝트 루트를 sys.path에 추가
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from scripts.deep_dive.cover import overlay_text, make_short_title
from scripts.deep_dive.topics import parse_todo

def main():
    items = parse_todo()
    
    # deep-dive raw 파일 목록
    images_dir = project_root / "public" / "images" / "deep-dive"
    raw_files = list(images_dir.glob("*-raw.webp"))
    
    print(f"📋 {len(raw_files)}개의 raw 파일 발견")
    
    # 최종 이미지가 없는 것만 필터링
    to_process = []
    for raw_file in raw_files:
        final_name = raw_file.name.replace("-raw.webp", ".webp")
        final_path = images_dir / final_name
        if not final_path.exists():
            to_process.append(raw_file)
    
    print(f"🎯 {len(to_process)}개 처리 필요 (최종 이미지 없음)")
    
    if not to_process:
        print("✅ 모든 이미지에 텍스트 오버레이 완료됨")
        return
    
    # slug별로 title 찾기
    slug_to_title = {}
    for num, item in items.items():
        from scripts.deep_dive.topics import make_slug
        slug = make_slug(item["topic"])
        slug_to_title[slug] = item["topic"]
    
    # 처리
    success = 0
    failed = []
    
    for i, raw_file in enumerate(to_process, 1):
        slug = raw_file.stem.replace("-raw", "")
        title = slug_to_title.get(slug)
        
        if not title:
            print(f"[{i}/{len(to_process)}] ⏭️  {slug} (title 없음)")
            continue
        
        short_title = make_short_title(title)
        print(f"[{i}/{len(to_process)}] 🔤 {slug[:50]}...")
        
        try:
            result = overlay_text(raw_file, short_title, slug)
            if result:
                success += 1
                print(f"  ✅ {result.name}")
            else:
                failed.append(slug)
                print(f"  ❌ 실패")
        except Exception as e:
            failed.append(slug)
            print(f"  ❌ 에러: {e}")
    
    print(f"\n{'='*60}")
    print(f"📊 완료: ✅ {success} / ❌ {len(failed)} / 전체 {len(to_process)}")
    
    if failed:
        print(f"\n실패 목록:")
        for slug in failed[:10]:
            print(f"  - {slug}")
        if len(failed) > 10:
            print(f"  ... 외 {len(failed) - 10}개")

if __name__ == "__main__":
    main()
