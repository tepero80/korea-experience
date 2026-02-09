"""Image 필드 없는 posts에 image 필드 추가"""
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
POSTS_DIR = PROJECT_ROOT / "content" / "posts"

missing_slugs = [
    "24-hour-seoul-itinerary-how-to-survive-the-city-that-never-sleeps-2026",
    "alien-registration-card-application-process",
    "best-rhinoplasty-clinics-gangnam-2026",
    "blepharoplasty-techniques-incisional-vs-non-incisional-double-eyelid-surgery",
    "breast-augmentation-in-korea-cost-clinics-and-recovery-2026",
    "breast-reduction-surgery-in-korea-specialized-clinics-and-recovery-tips-2026",
    "cryolipolysis-vs-fat-dissolving-injections-in-korea-which-is-for-you-2026",
    "cryptocurrency-in-korea-exchanges-and-regulations",
    "digital-nomad-visa-korea-requirements-and-application",
    "double-eyelid-surgery-in-korea-complete-guide",
    "ethnic-rhinoplasty-preserving-your-features-in-korea",
    "follow-up-care-for-international-patients-telemedicine-options",
    "full-mouth-dental-implants-in-korea-price-comparison-and-timeline-2026",
    "how-to-ship-k-beauty-globally-best-international-shipping-services-2026",
    "korea-digital-nomad-visa-f-1-d-complete-guide-2026",
    "korea-plastic-surgery-reviews-what-to-expect",
    "korean-pension-system-understanding-deductions",
    "korean-tax-return-guide-for-foreigners-how-to-get-money-back-2026",
    "lasik-and-lasek-eye-surgery-in-korea-complete-guide-2026",
    "liposuction-vs-coolsculpting-body-contouring-methods-compared",
    "male-plastic-surgery-trends-2026-jawline-definition-and-gynecomastia-2026",
    "moving-companies-in-korea-international-vs-local",
    "moving-to-korea-with-a-pet-quarantine-paperwork-and-flights-2026",
    "post-op-exercise-when-to-resume-gym-and-cardio",
    "post-surgery-swelling-timeline-what-to-expect-week-by-week",
    "pre-surgery-checklist-medications-to-avoid",
    "rhinoplasty-in-korea-complete-guide-cost-and-best-clinics-2026",
    "seoul-international-schools-complete-guide-for-expat-parents-2026",
    "shopping-for-curvy-sizes-in-korea-where-to-find-inclusive-fashion-2026",
    "silicone-vs-gore-tex-implants-for-rhinoplasty-in-korea",
    "skin-whitening-glutathione-iv-vs-topical-treatments",
    "teaching-english-in-korea-e-2-visa-process",
    "teaching-english-in-korea-epik-vs-hagwon-complete-guide-2026",
    "thread-lifting-in-korea-ultimate-guide-to-mint-and-silhouette-soft-2026",
    "under-eye-fat-repositioning-why-its-korea-most-popular-secret-surgery-2026",
    "understanding-pali-pali-culture-in-the-korean-workplace-2026",
    "v-line-surgery-korea-procedure-cost-recovery",
]

added = 0
errors = []

for slug in missing_slugs:
    md_file = POSTS_DIR / f"{slug}.md"
    
    if not md_file.exists():
        errors.append((slug, "File not found"))
        continue
    
    try:
        content = md_file.read_text(encoding='utf-8')
        content = content.lstrip('\ufeff')  # BOM 제거
        
        # frontmatter 찾기 (더 유연한 패턴)
        match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
        
        if not match:
            errors.append((slug, "No frontmatter"))
            continue
        
        frontmatter_content = match.group(1)
        full_match = match.group(0)
        
        # image 필드 추가 (frontmatter 마지막에)
        image_line = f'image: "/images/{slug}.webp"\n'
        new_frontmatter = f"---\n{frontmatter_content}\n{image_line}---\n"
        new_content = content.replace(full_match, new_frontmatter, 1)
        
        # 저장
        md_file.write_text(new_content, encoding='utf-8', newline='\n')
        added += 1
        
    except Exception as e:
        errors.append((slug, str(e)))

print(f"추가 완료: {added}개")
if errors:
    print(f"\n오류 ({len(errors)}개):")
    for slug, err in errors:
        print(f"  {slug}: {err}")
