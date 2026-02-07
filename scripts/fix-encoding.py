#!/usr/bin/env python3
"""Fix encoding corruption in 11 affected markdown files."""
import os
import re

CONTENT_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', 'posts')
UFFFD = '\ufffd'

def fix_text_file(filename, replacements):
    """Fix files with U+FFFD replacement characters."""
    path = os.path.join(CONTENT_DIR, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    applied = 0
    for old_text, new_text in replacements:
        if old_text in content:
            content = content.replace(old_text, new_text)
            applied += 1
        else:
            print(f"  WARNING: Pattern not found in {filename}: {repr(old_text[:50])}")
    
    if content != original:
        # Verify no UFFFD remains
        remaining = content.count(UFFFD)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  FIXED: {filename} ({applied} replacements, {remaining} UFFFD remaining)")
    else:
        print(f"  NO CHANGE: {filename}")

def fix_byte_file(filename, byte_replacements):
    """Fix files with byte-level corruption (EUC-KR bytes in UTF-8 file)."""
    path = os.path.join(CONTENT_DIR, filename)
    with open(path, 'rb') as f:
        data = f.read()
    
    original = data
    applied = 0
    for old_bytes, new_bytes in byte_replacements:
        if old_bytes in data:
            data = data.replace(old_bytes, new_bytes)
            applied += 1
        else:
            print(f"  WARNING: Byte pattern not found in {filename}: {old_bytes.hex()}")
    
    if data != original:
        with open(path, 'wb') as f:
            f.write(data)
        print(f"  FIXED (bytes): {filename} ({applied} replacements)")
    else:
        print(f"  NO CHANGE (bytes): {filename}")

def main():
    print("=== Fixing encoding corruption in 11 files ===\n")
    
    # ================================================================
    # 1. best-korean-skin-clinics-in-gangnam-2026.md (23 UFFFD + extra ??)
    # ================================================================
    # Corruption pattern: Korean char first byte -> 0x3F(?), remaining -> UFFFD
    # Also: some ASCII chars (like ')') -> 0x3F(?)
    fix_text_file("best-korean-skin-clinics-in-gangnam-2026.md", [
        # Medical terms in Korean parentheses
        # Botox (보톡스): - 스) became ??
        (f"Botox (보톡??:", "Botox (보톡스):"),
        # Dermal Fillers (필러): - 필 became ?UFFFD
        (f"Dermal Fillers (?{UFFFD}러):", "Dermal Fillers (필러):"),
        # Rejuran Healer (리쥬란 힐러): - 쥬->UFFFD, 란->??, 힐->?UFFFD
        (f"Rejuran Healer (리{UFFFD}??{UFFFD} ?{UFFFD}러):", "Rejuran Healer (리쥬란 힐러):"),
        # Juvelook (쥬베룩): - 룩) became UFFFD?
        (f"Juvelook (쥬베{UFFFD}?:", "Juvelook (쥬베룩):"),
        # PicoPlus / PicoWay (피코플러스/ 피코웨이): 
        (f"PicoPlus / PicoWay (?{UFFFD}코?{UFFFD}러??/ ?{UFFFD}코?{UFFFD}이):", 
         "PicoPlus / PicoWay (피코플러스/ 피코웨이):"),
        # Ultherapy (울쎄라) & Shurink (슈링크):
        (f"Ultherapy (?{UFFFD}쎄?? & Shurink (?{UFFFD}링??:", 
         "Ultherapy (울쎄라) & Shurink (슈링크):"),
        # Fraxel (프락셀):
        (f"Fraxel (?{UFFFD}락?{UFFFD}):", "Fraxel (프락셀):"),
        # LDM (엘디엠):
        (f"LDM (?{UFFFD}디??:", "LDM (엘디엠):"),
        # Chanel Injection (샤넬주사)
        (f"Chanel Injection (?{UFFFD}넬주사)", "Chanel Injection (샤넬주사)"),
        # Exosomes (엑소좀):
        (f"Exosomes (?{UFFFD}소좀):", "Exosomes (엑소좀):"),
        # Thread Lifts (실리프팅):
        (f"Thread Lifts (?{UFFFD}리?{UFFFD}팅):", "Thread Lifts (실리프팅):"),
        # Thermage (써마지):
        (f"Thermage (?{UFFFD}마지):", "Thermage (써마지):"),
        # dermatologist (피부과전문의)
        (f"dermatologist (?{UFFFD}{UFFFD}?{UFFFD}??{UFFFD}문?? is", 
         "dermatologist (피부과전문의) is"),
        # Em dashes corrupted to ??
        ("tourists \u200b??from", "tourists —from"),  # try with zero-width space first
        ("considerations ??and", "considerations —and"),
        ("skin ??make", "skin —make"),
        # If the above didn't work (no zero-width space), try plain
        ("tourists ??from", "tourists —from"),
    ])
    
    # ================================================================
    # 2. 24-hours-in-seongsu-dong (17 UFFFD)
    # ================================================================
    fix_text_file("24-hours-in-seongsu-dong-luxury-dior-pop-up-vs-5-market-food-a-dualism-route.md", [
        # Seoul's -> Seoul?FFD s
        (f"Seoul?{UFFFD}s vibrant", "Seoul's vibrant"),
        # Seongsu Station (성수
        (f"Seongsu Station (?{UFFFD}수.", "Seongsu Station (성수)."),
        # Ttukseom Station (뚝섬
        (f"Ttukseom Station (?{UFFFD}섬,", "Ttukseom Station (뚝섬,"),
        # Café Onion Seongsu (어니언성수)
        (f"Onion Seongsu (?{UFFFD}니?{UFFFD}수)", "Onion Seongsu (어니언성수)"),
        # Daelim Warehouse (대림창고)
        (f"Warehouse (?{UFFFD}림창{UFFFD}?", "Warehouse (대림창고)"),
        # Ttukseom Market (뚝섬 시장)
        (f"Market (?{UFFFD}섬 ?{UFFFD}장)", "Market (뚝섬 시장)"),
        # Tteokbokki (떡볶이):
        (f"Tteokbokki (?{UFFFD}볶:", "Tteokbokki (떡볶이):"),
        # Odeng (오뎅):
        (f"Odeng (?{UFFFD}뎅):", "Odeng (오뎅):"),
        # Gyeranppang (계란빵):
        (f"Gyeranppang (계{UFFFD}?{UFFFD}?:", "Gyeranppang (계란빵):"),
        # Kimbap (김밥):
        (f"Kimbap (김{UFFFD}?:", "Kimbap (김밥):"),
        # pojangmacha (포장마차)
        (f"pojangmacha' (?{UFFFD}장마차)", "pojangmacha' (포장마차)"),
        # anju (안주
        (f"anju (?{UFFFD}주 -", "anju (안주 -"),
        # Here's
        (f"Here?{UFFFD}s a suggested", "Here's a suggested"),
    ])
    
    # ================================================================
    # 3. how-to-call-a-taxi (4 UFFFD) - em dashes
    # ================================================================
    fix_text_file("how-to-call-a-taxi-in-korea-without-a-local-phone-number-kakao-t-alternatives-for-tourists.md", [
        (f"times?{UFFFD}especially", "times—especially"),
        (f"travel?{UFFFD}when", "travel—when"),
        (f"carrier?{UFFFD}s roaming", "carrier's roaming"),
        (f"refusals?{UFFFD}a common", "refusals—a common"),
    ])
    
    # ================================================================
    # 4. k-fandom-economy (4 UFFFD)
    # ================================================================
    fix_text_file("k-fandom-economy-where-to-find-limited-edition-goods-without-a-fan-club-membership.md", [
        # 얼마예요? (How much?)
        (f'"?{UFFFD}마?{UFFFD}요? (Eolmayeyo?', '"얼마예요? (Eolmayeyo?'),
        # 이거 주세요 (Please give me this)
        (f'"?{UFFFD}거 주세??(Igeo juseyo', '"이거 주세요 (Igeo juseyo'),
        # em dash
        (f"market?{UFFFD}sometimes", "market—sometimes"),
    ])
    
    # ================================================================
    # 5. how-to-spend-a-rainy-evening (2 UFFFD)
    # ================================================================
    fix_text_file("how-to-spend-a-rainy-evening-in-seoul-best-lp-bars-and-traditional-makgeolli-houses.md", [
        # 사발 (bowl)
        (f"(?{UFFFD}발, sabal)", "(사발, sabal)"),
        # 감사합니다 (thank you) - partial corruption
        (f"(감사?{UFFFD}니", "(감사합니다,"),
    ])
    
    # ================================================================
    # 6. affordable-fine-dining (2 UFFFD) - em dashes
    # ================================================================
    fix_text_file("affordable-fine-dining-5-michelin-starred-lunch-menus-in-seoul-for-under-50.md", [
        (f"light?{UFFFD}you can", "light—you can"),
        (f"tasted?{UFFFD}firm,", "tasted—firm,"),
    ])
    
    # ================================================================
    # 7. best-korea-sim-cards (2 UFFFD) - em dashes
    # ================================================================
    fix_text_file("best-korea-sim-cards-for-long-term-travelers-beyond-airport-rentals-and-prepaid-limits.md", [
        (f"identical?{UFFFD}you get", "identical—you get"),
        (f"peninsula?{UFFFD}but you", "peninsula—but you"),
    ])
    
    # ================================================================
    # 8. do-i-need-a-k-eta (2 UFFFD) - em dashes
    # ================================================================
    fix_text_file("do-i-need-a-k-eta-in-2026-a-complete-guide-for-all-100-nationalities.md", [
        (f"airport?{UFFFD}a fate", "airport—a fate"),
        (f"faster?{UFFFD}often within", "faster—often within"),
    ])
    
    # ================================================================
    # 9. 2026-year-of-the-red-horse (1 UFFFD) - em dash
    # ================================================================
    fix_text_file("2026-year-of-the-red-horse-special-exhibitions-and-spiritual-spots-to-visit-for-luck.md", [
        (f"resilient?{UFFFD}perfect", "resilient—perfect"),
    ])
    
    # ================================================================
    # 10. korean-webtoon-to-drama-adaptations-timeline (byte-level)
    # EUC-KR 0xA1AF = ' (right single quote) stuck in UTF-8 file
    # ================================================================
    fix_byte_file("korean-webtoon-to-drama-adaptations-timeline.md", [
        # country's and It's - \xa1\xaf -> ' (apostrophe)
        (b'\xa1\xaf', b"'"),
    ])
    
    # ================================================================
    # 11. k-pop-merchandise-shopping-myeongdong-vs-online (byte-level)
    # EUC-KR bytes for 우체국 stuck in UTF-8 file
    # ================================================================
    fix_byte_file("k-pop-merchandise-shopping-myeongdong-vs-online.md", [
        # \xbf\xec\xc3\xbc\xb1\xb9 (EUC-KR for 우체국) -> UTF-8 우체국
        (b'\xbf\xec\xc3\xbc\xb1\xb9', '우체국'.encode('utf-8')),
    ])
    
    # ================================================================
    # Verification pass
    # ================================================================
    print("\n=== Verification ===")
    total_issues = 0
    for f in os.listdir(CONTENT_DIR):
        if not f.endswith('.md'):
            continue
        path = os.path.join(CONTENT_DIR, f)
        try:
            with open(path, 'r', encoding='utf-8') as fh:
                content = fh.read()
        except UnicodeDecodeError:
            print(f"  STILL BROKEN (UnicodeDecodeError): {f}")
            total_issues += 1
            continue
        
        ufffd_count = content.count(UFFFD)
        if ufffd_count > 0:
            print(f"  STILL HAS {ufffd_count} UFFFD: {f}")
            total_issues += 1
    
    if total_issues == 0:
        print("  All files clean! No encoding issues remaining.")
    else:
        print(f"\n  {total_issues} files still have issues.")

if __name__ == '__main__':
    main()
