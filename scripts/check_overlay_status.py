"""raw 파일과 최종 파일 매핑 확인"""
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
IMAGES_DIR = PROJECT_ROOT / "public" / "images"

def main():
    # raw 파일들
    raw_files = {f.stem.replace("-raw", "") for f in IMAGES_DIR.glob("*-raw.webp")}
    
    # 최종 파일들
    final_files = {f.stem for f in IMAGES_DIR.glob("*.webp") if not f.stem.endswith("-raw")}
    
    # raw는 있는데 최종이 없는 것들 (오버레이 안됨)
    no_overlay = raw_files - final_files
    
    # 최종만 있고 raw가 없는 것들 (오버레이 완료 후 raw 삭제됨)
    overlay_done = final_files - raw_files
    
    # 둘 다 있는 것들 (오버레이 완료했지만 raw 남아있음)
    both_exist = raw_files & final_files
    
    print(f"=== 상태 ===")
    print(f"raw만 있음 (오버레이 필요): {len(no_overlay)}개")
    print(f"최종만 있음 (완료/raw삭제됨): {len(overlay_done)}개")
    print(f"둘 다 있음 (완료/raw보관): {len(both_exist)}개")
    print(f"전체 이미지: {len(final_files)}개")
    
    if no_overlay:
        print(f"\n=== 오버레이 필요한 이미지 (샘플 10개) ===")
        for slug in sorted(no_overlay)[:10]:
            print(f"  - {slug}")
    
    # 401개 1024x1024 이미지가 어떤 상태인지 확인
    from PIL import Image
    size_1024 = []
    for img_path in IMAGES_DIR.glob("*.webp"):
        if img_path.stem.endswith("-raw"):
            continue
        with Image.open(img_path) as im:
            if im.size == (1024, 1024):
                size_1024.append(img_path.stem)
    
    # 1024x1024 중에 raw가 있는 것
    size_1024_with_raw = [s for s in size_1024 if s in raw_files]
    size_1024_no_raw = [s for s in size_1024 if s not in raw_files]
    
    print(f"\n=== 1024x1024 이미지 분석 ===")
    print(f"전체: {len(size_1024)}개")
    print(f"  - raw 있음 (오버레이 여부 불확실): {len(size_1024_with_raw)}개")
    print(f"  - raw 없음 (오버레이 완료 추정): {len(size_1024_no_raw)}개")

if __name__ == "__main__":
    main()
