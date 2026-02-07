#!/usr/bin/env python3
"""
기존 생성된 포스트에 Sources 섹션을 후처리로 추가하는 스크립트.
- generation-progress.json 기반 283개 파일 대상
- frontmatter의 category를 읽어 카테고리별 공식 소스 삽입
- 이미 ## Sources가 있으면 스킵
"""

import json
import os
import re
import glob

# ========== 카테고리별 소스 매핑 ==========
CATEGORY_SOURCES = {
    "Travel & Tourism": [
        "- [Korea Tourism Organization](https://english.visitkorea.or.kr) - Official tourism information, travel guides, and festival schedules",
        "- [Visit Seoul](https://english.visitseoul.net) - Seoul Metropolitan Government official tourism portal",
        "- [Incheon International Airport](https://www.airport.kr/co_en/index.do) - Airport services and transportation information",
        "- [KORAIL](https://www.letskorail.com) - Korea Railroad Corporation official site for train schedules and passes",
        "- [Korea Meteorological Administration](https://www.kma.go.kr) - Official weather and climate data",
    ],
    "Food & Dining": [
        "- [Korea Tourism Organization](https://english.visitkorea.or.kr) - Official Korean food and restaurant guides",
        "- [Visit Seoul](https://english.visitseoul.net) - Seoul dining guides and market information",
        "- [Michelin Guide Korea](https://guide.michelin.com/kr/en) - Restaurant ratings and reviews for Korea",
        "- [Korean Food Foundation](https://www.hansik.or.kr) - Traditional Korean cuisine and food culture resources",
    ],
    "Medical Tourism": [
        "- [Korea Health Industry Development Institute (KHIDI)](https://www.khidi.or.kr) - Medical tourism statistics and policy",
        "- [Visit Medical Korea](https://www.medicalkorea.or.kr/en) - Official government medical tourism portal",
        "- [Ministry of Food and Drug Safety](https://www.mfds.go.kr) - Drug and medical device regulations",
        "- [Korea Tourism Organization](https://english.visitkorea.or.kr) - Medical tourism visitor information",
    ],
    "Living in Korea": [
        "- [Korea Immigration Service](https://www.immigration.go.kr/immigration_eng/index.do) - Visa and immigration information",
        "- [HiKorea](https://www.hikorea.go.kr) - Government portal for foreign residents",
        "- [Seoul Metropolitan Government](https://english.seoul.go.kr) - City services for residents and expats",
        "- [National Health Insurance Service](https://www.nhis.or.kr/english.do) - Health insurance for foreign residents",
    ],
    "K-Culture": [
        "- [Korea Tourism Organization](https://english.visitkorea.or.kr) - Korean culture, K-Pop, and entertainment guides",
        "- [Visit Seoul](https://visit.seoul.kr) - Cultural events and experiences in Seoul",
        "- [Korean Cultural Center](https://www.kocis.go.kr/eng) - Korean culture and arts promotion",
        "- [Korea JoongAng Daily](https://koreajoongangdaily.joins.com) - English-language Korean news and culture coverage",
    ],
    "Shopping & K-Beauty": [
        "- [Korea Tourism Organization](https://english.visitkorea.or.kr) - Shopping guides and tax refund information",
        "- [Olive Young Global](https://global.oliveyoung.com) - Korea's largest health and beauty retailer",
        "- [Visit Seoul](https://english.visitseoul.net) - Shopping districts and market guides",
        "- [Incheon International Airport Duty Free](https://www.airport.kr/co_en/index.do) - Duty-free shopping information",
    ],
}

DEFAULT_SOURCES = [
    "- [Korea Tourism Organization](https://english.visitkorea.or.kr) - Official tourism and cultural information",
    "- [Visit Seoul](https://english.visitseoul.net) - Seoul Metropolitan Government tourism portal",
    "- [Korea.net](https://www.korea.net) - Official gateway to information about Korea",
]


def title_to_slug(title: str) -> str:
    """Title을 slug로 변환 (generate-content.ts의 방식과 동일)"""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug.strip())
    slug = re.sub(r'-+', '-', slug)
    return slug


def extract_category(content: str) -> str:
    """frontmatter에서 category 추출"""
    match = re.search(r'^category:\s*["\']?(.+?)["\']?\s*$', content, re.MULTILINE)
    return match.group(1).strip() if match else ""


def get_sources_for_category(category: str) -> list:
    """카테고리에 맞는 소스 반환"""
    if category in CATEGORY_SOURCES:
        return CATEGORY_SOURCES[category]
    
    # 부분 매칭
    for key in CATEGORY_SOURCES:
        if (category.lower().split()[0] in key.lower() or 
            key.lower().split()[0] in category.lower()):
            return CATEGORY_SOURCES[key]
    
    return DEFAULT_SOURCES


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(base_dir)
    posts_dir = os.path.join(project_dir, "content", "posts")
    
    # generation-progress.json 로드
    progress_path = os.path.join(base_dir, "generation-progress.json")
    with open(progress_path, "r", encoding="utf-8") as f:
        progress = json.load(f)
    
    print(f"📋 generation-progress.json: {len(progress)} entries")
    
    # Key → slug 매핑 생성
    slug_map = {}
    for key in progress:
        parts = key.split(":", 1)
        if len(parts) == 2:
            category, title = parts
            slug = title_to_slug(title)
            slug_map[slug] = category
    
    print(f"🔗 Slug map: {len(slug_map)} entries")
    
    # 파일 처리
    updated = 0
    skipped_has_sources = 0
    skipped_not_found = 0
    errors = 0
    category_stats = {}
    
    for slug, progress_category in slug_map.items():
        filepath = os.path.join(posts_dir, f"{slug}.md")
        
        if not os.path.exists(filepath):
            skipped_not_found += 1
            continue
        
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            print(f"  ❌ Error reading {slug}.md: {e}")
            errors += 1
            continue
        
        # 이미 Sources가 있으면 스킵
        if "## Sources" in content:
            skipped_has_sources += 1
            continue
        
        # frontmatter에서 category 추출 (progress의 category보다 정확)
        file_category = extract_category(content)
        category = file_category or progress_category
        
        # 소스 가져오기
        sources = get_sources_for_category(category)
        
        # Sources 섹션 추가
        sources_section = "\n\n---\n\n## Sources\n\n" + "\n".join(sources) + "\n"
        new_content = content.rstrip() + sources_section
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        
        updated += 1
        cat_key = category or "Unknown"
        category_stats[cat_key] = category_stats.get(cat_key, 0) + 1
    
    # 결과 출력
    print(f"\n{'='*60}")
    print(f"✅ Sources 추가 완료: {updated} files")
    print(f"⏭️  이미 Sources 있음: {skipped_has_sources} files")
    print(f"🔍 파일 없음 (스킵): {skipped_not_found} files")
    print(f"❌ 에러: {errors} files")
    print(f"\n📊 카테고리별 처리:")
    for cat, count in sorted(category_stats.items()):
        src_count = len(get_sources_for_category(cat))
        print(f"   {cat}: {count} files ({src_count} sources each)")


if __name__ == "__main__":
    main()
