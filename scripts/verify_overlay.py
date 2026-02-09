"""이미지에 텍스트 오버레이가 실제로 있는지 확인"""
from pathlib import Path
from PIL import Image
import numpy as np

PROJECT_ROOT = Path(__file__).parent.parent
IMAGES_DIR = PROJECT_ROOT / "public" / "images"

def analyze_image(img_path):
    """이미지 하단 200px를 분석 (오버레이가 있으면 하단에 텍스트)"""
    with Image.open(img_path) as img:
        width, height = img.size
        
        # 하단 200px 영역
        bottom_region = img.crop((0, height - 200, width, height))
        
        # RGB 배열로 변환
        pixels = np.array(bottom_region)
        
        # 색상 분산 계산 (텍스트가 있으면 분산이 높음)
        variance = pixels.var()
        
        # 평균 밝기
        mean_brightness = pixels.mean()
        
        return {
            "size": f"{width}x{height}",
            "variance": round(variance, 2),
            "brightness": round(mean_brightness, 2),
        }

def main():
    # 1024x1024 샘플 5개
    samples_1024 = []
    for img in IMAGES_DIR.glob("*.webp"):
        if img.stem.endswith("-raw"):
            continue
        with Image.open(img) as im:
            if im.size == (1024, 1024):
                samples_1024.append(img)
                if len(samples_1024) >= 5:
                    break
    
    # 1376x768 샘플 (오버레이가 있다고 추정)
    samples_overlay = []
    for img in IMAGES_DIR.glob("*.webp"):
        if img.stem.endswith("-raw"):
            continue
        with Image.open(img) as im:
            if im.size != (1024, 1024):
                samples_overlay.append(img)
                if len(samples_overlay) >= 3:
                    break
    
    print("=== 1024x1024 샘플 분석 ===")
    for img_path in samples_1024:
        result = analyze_image(img_path)
        print(f"\n{img_path.name}")
        print(f"  크기: {result['size']}")
        print(f"  하단 분산: {result['variance']}")
        print(f"  하단 밝기: {result['brightness']}")
    
    print("\n\n=== 1376x768 (오버레이 추정) 샘플 분석 ===")
    for img_path in samples_overlay:
        result = analyze_image(img_path)
        print(f"\n{img_path.name}")
        print(f"  크기: {result['size']}")
        print(f"  하단 분산: {result['variance']}")
        print(f"  하단 밝기: {result['brightness']}")

if __name__ == "__main__":
    main()
