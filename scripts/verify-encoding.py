import os

tests = {
    'best-korean-skin-clinics-in-gangnam-2026.md': [
        '(필러)', '(리쥬란 힐러)', '(쥬베룩)', '(피코플러스/ 피코웨이)',
        '(울쎄라)', '(슈링크)', '(프락셀)', '(엘디엠)', '(샤넬주사)',
        '(엑소좀)', '(실리프팅)', '(써마지)', '(피부과전문의)', '(보톡스)'
    ],
    '24-hours-in-seongsu-dong-luxury-dior-pop-up-vs-5-market-food-a-dualism-route.md': [
        '(성수)', '(뚝섬', '(어니언성수)', '(대림창고)', '(떡볶이)',
        '(오뎅)', '(계란빵)', '(김밥)', '(포장마차)', '(안주'
    ],
    'how-to-call-a-taxi-in-korea-without-a-local-phone-number-kakao-t-alternatives-for-tourists.md': [
        'times\u2014especially', 'travel\u2014when',
        "carrier's roaming", 'refusals\u2014a common'
    ],
    'korean-webtoon-to-drama-adaptations-timeline.md': [
        "country's dynamic", "It's a great"
    ],
    'k-pop-merchandise-shopping-myeongdong-vs-online.md': [
        '\uc6b0\uccb4\uad6d'  # 우체국
    ],
    'k-fandom-economy-where-to-find-limited-edition-goods-without-a-fan-club-membership.md': [
        '얼마예요', '이거 주세요'
    ],
    'affordable-fine-dining-5-michelin-starred-lunch-menus-in-seoul-for-under-50.md': [
        'light\u2014you can', 'tasted\u2014firm'
    ],
    'best-korea-sim-cards-for-long-term-travelers-beyond-airport-rentals-and-prepaid-limits.md': [
        'identical\u2014you get', 'peninsula\u2014but you'
    ],
    'do-i-need-a-k-eta-in-2026-a-complete-guide-for-all-100-nationalities.md': [
        'airport\u2014a fate', 'faster\u2014often'
    ],
    '2026-year-of-the-red-horse-special-exhibitions-and-spiritual-spots-to-visit-for-luck.md': [
        'resilient\u2014perfect'
    ],
    'how-to-spend-a-rainy-evening-in-seoul-best-lp-bars-and-traditional-makgeolli-houses.md': [
        '(사발, sabal)', '감사합니다'
    ],
}

CONTENT_DIR = 'content/posts'
total_ok = 0
total_fail = 0
for fn, terms in tests.items():
    path = os.path.join(CONTENT_DIR, fn)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    ok = [t for t in terms if t in c]
    fail = [t for t in terms if t not in c]
    if fail:
        print(f'PARTIAL: {fn[:50]}')
        for t in fail:
            print(f'  Missing: {repr(t)}')
        total_fail += len(fail)
    else:
        print(f'  OK: {fn[:50]} ({len(terms)} terms)')
    total_ok += len(ok)

print(f'\nTotal: {total_ok} OK, {total_fail} missing')
