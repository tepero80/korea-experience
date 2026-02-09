"""1024x1024 사이즈 이미지 중 오버레이가 없는 것들 찾기"""
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).parent.parent
IMAGES_DIR = PROJECT_ROOT / "public" / "images"

def main():
    # -raw가 아닌 .webp 파일들만 확인
    images = [f for f in IMAGES_DIR.glob("*.webp") if not f.stem.endswith("-raw")]
    
    no_overlay = []
    with_overlay = []
    
    for img_path in images:
        try:
            with Image.open(img_path) as img:
                width, height = img.size
                
                # 1024x1024는 오버레이가 없는 원본
                # 오버레이가 추가되면 높이가 늘어남 (1024x1224 등)
                if width == 1024 and height == 1024:
                    no_overlay.append(img_path.name)
                else:
                    with_overlay.append((img_path.name, f"{width}x{height}"))
        except Exception as e:
            print(f"❌ 오류: {img_path.name} - {e}")
    
    print(f"\n=== 오버레이 없는 이미지 (1024x1024) ===")
    print(f"총 {len(no_overlay)}개\n")
    for name in sorted(no_overlay):
        print(f"  - {name}")
    
    print(f"\n=== 오버레이 있는 이미지 ===")
    print(f"총 {len(with_overlay)}개")
    print(f"샘플 (처음 5개):")
    for name, size in sorted(with_overlay)[:5]:
        print(f"  - {name}: {size}")

if __name__ == "__main__":
    main()
