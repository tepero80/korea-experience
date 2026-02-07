#!/usr/bin/env python3
"""Build comprehensive sources-db.json from curated 600-source dataset.
- Cleans all URLs to domain-only (strips paths like /en, /eng, etc.)
- Deduplicates within each subcategory by cleaned URL
- Saves to data/sources-db.json
"""

import json
import os
from urllib.parse import urlparse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
OUTPUT_PATH = os.path.join(PROJECT_DIR, "data", "sources-db.json")


def clean_url(raw: str) -> str:
    """Strip URL to https://host only."""
    url = raw.strip().rstrip("/")
    if not url.startswith("http"):
        url = "https://" + url
    p = urlparse(url)
    host = p.netloc
    if not host:
        # Handle bare domains like "example.com/path"
        host = p.path.split("/")[0]
    return f"https://{host}"


def entry(name, url, desc):
    return {"name": name, "url": clean_url(url), "desc": desc}


# ================================================================
# COMPLETE SOURCE DATABASE — 600 entries across 6 categories
# Format: (name, raw_domain_or_url, short_description)
# ================================================================

MEDICAL_TOURISM = {
    "Government & Public Portals": [
        ("메디컬 코리아", "medicalkorea.or.kr", "Official medical tourism portal"),
        ("KHIDI 한국보건산업진흥원", "khidi.or.kr", "Healthcare industry development"),
    ],
    "Major University Hospitals": [
        ("서울아산병원", "eng.amc.seoul.kr", "Top cancer & transplant hospital"),
        ("삼성서울병원", "smcpatients.com", "Digital precision medicine"),
        ("연세대 세브란스병원", "sev.yuhs.or.kr", "First modern hospital in Korea"),
        ("서울대학교병원", "snuh.org", "National central hospital"),
        ("가톨릭대 서울성모병원", "cmcseoul.or.kr", "Stem cell transplant leader"),
        ("아주대학교병원", "ajoumc.or.kr", "Gyeonggi trauma center"),
        ("인하대학교병원", "inhahospital.com", "Near Incheon airport"),
        ("전남대학교병원", "cnuh.com", "Gwangju/Jeonnam regional hub"),
        ("조선대학교병원", "chosunhospital.com", "International cooperation system"),
        ("부산대학교병원", "pnuh.or.kr", "Busan public medical hub"),
        ("제주대학교병원", "jejunuh.co.kr", "Jeju's only tertiary hospital"),
        ("한양대학교 의료원", "hyumc.com", "Rheumatic disease expertise"),
        ("고려대 안암병원", "anam.kumc.or.kr", "Robotic surgery leader"),
        ("고려대 구로병원", "guro.kumc.or.kr", "Infectious disease hub"),
        ("경북대학교병원", "knuh.org", "Daegu/Gyeongbuk tertiary hospital"),
        ("충남대학교병원", "cnuh.co.kr", "Daejeon cancer center"),
        ("순천향대 서울병원", "schmc.ac.kr", "Embassy area expat care"),
        ("이화여대 목동병원", "mokdong.eumc.ac.kr", "Women's & pediatric specialty"),
    ],
    "Plastic Surgery Clinics": [
        ("JK 성형외과", "jkplastic.com", "First govt-certified PS clinic"),
        ("바노바기 성형외과", "eng.banobagi.com", "Facial contouring specialist"),
        ("아이디병원", "idhospital.com", "Jaw surgery global leader"),
        ("원진 성형외과", "wonjinbeauty.com", "Total beauty care system"),
        ("뷰 성형외과", "viewclinic.com", "Breast & anti-aging focus"),
        ("DA 성형외과", "daprs.com", "Natural aesthetics approach"),
        ("드림 성형외과", "e-dream.co.kr", "Premium boutique surgery"),
        ("BK 성형외과", "bk-hospital.com", "Gangnam foreigner-focused PS"),
        ("시즈 성형외과", "shesplastic.com", "Busan PS tourism center"),
        ("라비앙 성형외과", "lavianps.com", "Dedicated aftercare system"),
    ],
    "Dermatology & Aesthetics": [
        ("오라클 피부과", "oraclemedicalgroup.com", "Largest derm network"),
        ("아름다운나라 피부과", "anacli.co.kr", "Laser & anti-aging awards"),
        ("올포스킨 피부과", "allforskin.com", "Daegu largest derm center"),
        ("후즈후 피부과", "hushuderma.com", "Thread lifting specialist"),
        ("리뉴미 피부과", "renewmeskin.com", "Acne & scar treatment"),
        ("차움", "chaum.com", "Premium anti-aging & checkup"),
        ("고운세상 피부과", "gowoonsesang.com", "Busan pigment treatment"),
        ("DM 피부과", "dmderm.com", "Science-based laser care"),
        ("종로연세의원", "jryonsei.com", "Affordable quality skincare"),
        ("고은미의원", "go-un.com", "Ulsan aesthetic center"),
    ],
    "Dental Clinics": [
        ("서울대 치과병원", "snudh.org", "National dental hospital"),
        ("후즈후 치과", "hushudental.com", "Cosmetic dentistry specialist"),
        ("에스플란트 치과병원", "splant.com", "Digital guided implants"),
        ("사과나무 치과병원", "appletreedental.com", "Comprehensive oral care"),
        ("에이플러스 치과", "aplusdental.co.kr", "Gangnam expat dental"),
        ("유펜아이비 치과", "upennivydental.com", "US-trained preservation care"),
        ("코코넛 치과", "coconutdental.com", "Digital prosthetics specialist"),
        ("덕영 치과병원", "dy-dental.com", "Daegu implant center"),
        ("미르 치과병원", "mirdental.co.kr", "Nationwide dental network"),
        ("스마트 치과", "smartdental.co.kr", "Digital dentistry precision"),
    ],
    "Eye & Vision Correction": [
        ("한길 안과병원", "hangileye.co.kr", "MOHW designated eye hospital"),
        ("비앤빛 강남밝은세상안과", "english.bnviit.com", "AI vision correction"),
        ("김안과병원", "kimeye.com", "Asia's largest eye hospital"),
        ("밝은세상 안과", "iloveseye.com", "Presbyopia & cataract"),
        ("드림 안과", "dreameye.co.kr", "Custom laser correction"),
        ("글로리 서울안과", "gloryseouleye.com", "Catalys cataract surgery"),
        ("하늘 안과", "skyeyeclinic.com", "Affordable LASIK/LASEK"),
        ("아이리움 안과", "eyereum.com", "Keratoconus specialist"),
        ("102 안과", "102eye.com", "Busan advanced correction"),
        ("수안과", "sooeye.com", "Retina & glaucoma specialist"),
    ],
    "Fertility & Reproductive Medicine": [
        ("차병원 여성의학연구소", "seoul.chamc.co.kr", "Global IVF leader"),
        ("마리아 병원", "mariababy.com", "30-year fertility expertise"),
        ("미즈메디 병원", "mizmedi.com", "Certified women's hospital"),
        ("제일병원", "cheilmc.co.kr", "Women's health legacy"),
        ("시엘 병원", "clhospital.com", "Gwangju fertility center"),
        ("아인병원", "ainwh.co.kr", "Incheon women's hospital"),
        ("차병원 강남", "gangnam.chamc.co.kr", "High-risk pregnancy hub"),
        ("미래와희망 산부인과", "mnhospital.com", "Premium postnatal care"),
        ("에이치엠 병원", "hmhospital.co.kr", "Women's health screening"),
        ("함춘 여성클리닉", "hamchoon.com", "Genetic counseling specialist"),
    ],
    "Korean Medicine & Wellness": [
        ("자생 한방병원", "jaseng.net", "Non-surgical spine treatment"),
        ("경희대 한방병원", "khuoh.or.kr", "Integrative medicine hub"),
        ("광동 한방병원", "ekwangdong.co.kr", "Five-element detox programs"),
        ("동서 한방병원", "dsh.or.kr", "Stroke rehabilitation system"),
        ("소람 한방병원", "soram.kr", "Integrative cancer immunotherapy"),
        ("청연 한방병원", "cyhani.com", "Sports rehab & pain care"),
        ("이문원 한의원", "leemoonwon.com", "Hair loss specialist"),
        ("모커리 한방병원", "mokuri.com", "Disc non-surgical treatment"),
        ("약손명가", "yaksonhouse.com", "Golgi therapy global network"),
        ("대구한의대병원", "dhu.ac.kr", "Traditional medicine checkup"),
    ],
    "Health Screening & Specialty": [
        ("차움 검진센터", "chaum.com", "Luxury anti-aging checkup"),
        ("인하 국제의료센터", "inha-imc.com", "Airport one-stop checkup"),
        ("한강수 병원", "hangangsoo.com", "Burn & skin reconstruction"),
        ("세종 병원 부천", "sejongh.co.kr", "Korea's only heart hospital"),
        ("동훈 어드밴스드", "drdonghoon.com", "Limb lengthening specialist"),
        ("김병준 레다스", "ledas.co.kr", "Varicose vein non-surgical"),
        ("심정 병원", "shimjeong.com", "Spine & joint rehab"),
        ("365mc 병원", "365mc.co.kr", "Liposuction specialist"),
        ("예스 병원", "yeshospital.com", "Minimally invasive spine"),
    ],
    "Medical Concierge & Agencies": [
        ("메디컬 애비뉴", "medicalavenuekorea.com", "10-year hospital matching"),
        ("닥파인더 코리아", "docfinderkorea.com", "Safe PS hospital guide"),
        ("유노고", "eunogo.com", "Premium beauty curation"),
        ("서울 가이드 메드", "seoulguidemed.com", "Medical concierge & interpreting"),
        ("신 메디컬", "shinmedical.com", "Medical tourism consulting"),
    ],
    "Regional Medical Hubs": [
        ("인천 의료원", "incheonmedical.or.kr", "Public medical hub for foreigners"),
        ("제주 한라병원", "hallahosp.co.kr", "Jeju's largest private hospital"),
        ("원광대학교병원", "wkuuh.org", "Jeonbuk medical tourism hub"),
        ("분당 제생병원", "jshospital.org", "Gyeonggi foreign patient care"),
    ],
}

TRAVEL_TOURISM = {
    "National Tourism Organization": [
        ("대한민국 구석구석", "korean.visitkorea.or.kr", "Korea's largest travel DB"),
        ("VisitKorea", "english.visitkorea.or.kr", "Official tourism portal (8 langs)"),
        ("한국관광공사", "knto.or.kr", "KTO corporate portal & stats"),
    ],
    "Regional Tourism Organizations": [
        ("Visit Seoul", "visitseoul.net", "Seoul city official tourism"),
        ("Visit Busan", "visitbusan.net", "Marine tourism & festivals"),
        ("경기 관광", "ggtour.or.kr", "DMZ, theme parks, heritage"),
        ("Visit Incheon", "travel.icn.go.kr", "Airport-linked tourism"),
        ("Visit Jeju", "visitjeju.net", "Oreum, cafes, forest trails"),
        ("Visit Gangwon", "gwto.or.kr", "Winter sports & east coast"),
        ("경북 관광", "gbtour.com", "Silla heritage & Confucian culture"),
        ("전북 관광", "jbct.or.kr", "Jeonju hanok & food culture"),
        ("전남 관광", "ijnto.or.kr", "Island & wetland eco-tourism"),
        ("Visit Daegu", "tour.daegu.go.kr", "Herbal medicine & modern alleys"),
        ("Visit Daejeon", "djto.kr", "Science & hot spring tourism"),
        ("Visit Gwangju", "gjto.or.kr", "Biennale & food-centric guide"),
        ("Visit Ulsan", "ulsan.go.kr", "Whale village & industrial tour"),
        ("충남 관광", "tour.chungnam.go.kr", "Baekje heritage & mud festival"),
        ("충북 관광", "chungbuk.go.kr", "Lake tourism & forest retreat"),
        ("경남 관광", "gnto.or.kr", "Hallyeohaesang national park"),
        ("세종 관광", "sejong.go.kr", "Smart city government tour"),
    ],
    "City & District Tourism": [
        ("강릉 관광", "gntour.go.kr", "Gyeongpo beach & coffee street"),
        ("전주 관광", "tour.jeonju.go.kr", "Hanok village & bibimbap"),
        ("안동 관광", "tourandong.com", "Hahoe village & scholar culture"),
        ("속초 관광", "sokchotour.com", "Seoraksan & seafood market"),
        ("경주 관광", "gyeongju.go.kr", "Open-air museum city"),
        ("여수 관광", "yeosu.go.kr", "Night sea & Odongdo island"),
        ("통영 관광", "utour.go.kr", "Korea's Naples, island tours"),
        ("고양 관광", "goyang.go.kr", "KINTEX & lake park area"),
        ("수원 관광", "suwon.go.kr", "UNESCO Hwaseong fortress"),
        ("목포 관광", "mokpo.go.kr", "Modern history & cable car"),
    ],
    "Aviation & Entry": [
        ("인천국제공항", "airport.kr", "World's top hub airport"),
        ("한국공항공사 KAC", "airport.co.kr", "14 domestic airports info"),
        ("K-ETA", "k-eta.go.kr", "Electronic travel authorization"),
        ("대한항공", "koreanair.com", "Flag carrier airline"),
        ("아시아나항공", "flyasiana.com", "Major FSC airline"),
        ("제주항공", "jejuair.net", "Korea's largest LCC"),
        ("진에어", "jinair.com", "Korean Air subsidiary LCC"),
        ("티웨이항공", "twayair.com", "Japan & SE Asia budget airline"),
        ("에어부산", "airbusan.com", "Busan-based LCC"),
        ("에어서울", "airseoul.com", "Incheon-based Japan routes"),
    ],
    "Rail & Public Transit": [
        ("코레일 Korail", "letskorail.com", "National railway & KTX"),
        ("코버스 Kobus", "kobus.co.kr", "Express bus booking"),
        ("티머니 T-money", "t-money.co.kr", "National transit card system"),
        ("캐시비 Cashbee", "cashbee.co.kr", "Regional transit card"),
        ("SRT", "srail.or.kr", "Suseo high-speed rail"),
        ("전국 시외버스", "txbus.t-money.co.kr", "Intercity bus booking"),
        ("인천항만공사", "icpa.or.kr", "International ferry terminal"),
        ("부산항만공사", "busanpa.com", "Cruise & ferry port info"),
    ],
    "Accommodation": [
        ("한국관광 품질인증", "kquality.visitkorea.or.kr", "Government-certified stays"),
        ("한옥스테이", "hanok.visitkorea.or.kr", "Traditional house stays"),
        ("베니키아 Benikea", "benikea.com", "KTO budget hotel brand"),
        ("스테이폴리오", "stayfolio.com", "Curated design stays"),
        ("야놀자 Yanolja", "yanolja.com", "Korea's largest booking platform"),
        ("여기어때", "yeogieottae.com", "Real-time booking & deals"),
        ("신라호텔", "shilla.net", "Korea's luxury hotel brand"),
        ("롯데호텔", "lottehotel.com", "Major hotel chain"),
        ("조선호텔앤리조트", "josunhotel.com", "100-year heritage brand"),
        ("굿스테이", "goodstay.or.kr", "KTO budget accommodation"),
    ],
    "Theme Parks & Landmarks": [
        ("롯데월드 어드벤처", "lotteworld.com", "World's largest indoor park"),
        ("에버랜드 리조트", "everland.com", "Korea's largest theme park"),
        ("남산 서울타워", "nseoultower.co.kr", "Iconic landmark tower"),
        ("코엑스 아쿠아리움", "coexaqua.com", "Urban aquarium Gangnam"),
        ("하이커 그라운드", "hikr.visitkorea.or.kr", "K-content experience hall"),
        ("남이섬 Naminara", "namisum.com", "Fairy tale eco-destination"),
        ("아침고요수목원", "morningcalm.co.kr", "Garden of Morning Calm"),
        ("경복궁", "royalpalace.go.kr", "Joseon's main royal palace"),
        ("창덕궁", "cdg.go.kr", "UNESCO secret garden palace"),
    ],
    "Nature & National Parks": [
        ("국립공원공단", "knps.or.kr", "22 national parks info"),
        ("제주 올레", "jejuolle.org", "World-famous walking trails"),
        ("순천만 국가정원", "scbay.suncheon.go.kr", "Top 5 coastal wetland"),
        ("숲나들e", "foresttrip.go.kr", "Forest retreat reservation"),
        ("DMZ 생태관광", "dmz.go.kr", "DMZ security & eco-tour"),
        ("국립수목원", "koreaplants.go.kr", "UNESCO biosphere reserve"),
        ("대관령 양떼목장", "sheepfarm.co.kr", "Alpine grassland ranch"),
        ("서울숲", "seoulforest.or.kr", "Seongsu eco park"),
        ("한강공원", "hangang.seoul.go.kr", "11 riverside parks guide"),
        ("울릉도/독도", "ulleung.go.kr", "Mysterious volcanic island"),
    ],
    "MICE & Business Tourism": [
        ("서울 컨벤션뷰로", "miceseoul.com", "Seoul MICE support"),
        ("부산 관광 MICE", "bto.or.kr", "Busan MICE infrastructure"),
        ("킨텍스 KINTEX", "kintex.com", "Korea's largest convention center"),
        ("코엑스 COEX", "coex.co.kr", "Gangnam MICE complex"),
        ("벡스코 BEXCO", "bexco.co.kr", "Busan convention center"),
        ("제주 컨벤션뷰로", "jejumice.or.kr", "Resort MICE destination"),
        ("인천 MICE", "incheoncvb.or.kr", "Songdo Convensia hub"),
        ("엑스코 EXCO", "exco.co.kr", "Daegu convention center"),
        ("대전 컨벤션뷰로", "micedaejeon.com", "Science city MICE"),
        ("경주 하이코", "crowncity.kr", "Historic city MICE"),
    ],
    "Booking & Help Services": [
        ("트래지 Trazy", "trazy.com", "Korea activity booking OTA"),
        ("클룩 한국", "klook.com", "Global activity platform"),
        ("크리에이트립", "creatrip.com", "Local trend booking platform"),
        ("1330 헬프라인", "visitkorea.or.kr", "24h multilingual helpline"),
        ("코리아 그랜드세일", "vkc.or.kr", "Foreign shopping festival"),
        ("템플스테이", "templestay.com", "Temple stay reservation"),
        ("무슬림 프렌들리", "muslimfriendly.visitkorea.or.kr", "Halal & prayer room guide"),
        ("배리어프리 관광", "access.visitkorea.or.kr", "Accessible tourism guide"),
    ],
}

K_CULTURE = {
    "Cultural Policy & Exchange": [
        ("문화체육관광부 MCST", "mcst.go.kr", "Central culture policy ministry"),
        ("한국국제문화교류진흥원 KOFICE", "kofice.or.kr", "Hallyu exchange promotion"),
        ("한국국제교류재단 KF", "kf.or.kr", "Public diplomacy foundation"),
        ("해외문화홍보원 KOCIS", "korea.net", "National image promotion"),
    ],
    "National & Public Museums": [
        ("국립중앙박물관", "museum.go.kr", "Korea's main national museum"),
        ("국립민속박물관", "nfm.go.kr", "Traditional life museum"),
        ("국립대한민국역사박물관", "nmch.go.kr", "Modern & contemporary history"),
        ("국립경주박물관", "gyeongju.museum.go.kr", "Silla dynasty treasures"),
        ("국립부여박물관", "buyeo.museum.go.kr", "Baekje culture exhibition"),
        ("국립공주박물관", "gongju.museum.go.kr", "Muryeong tomb artifacts"),
        ("국립광주박물관", "gwangju.museum.go.kr", "Sinan underwater relics"),
        ("국립제주박물관", "jeju.museum.go.kr", "Island maritime history"),
        ("국립대구박물관", "daegu.museum.go.kr", "Yeongnam prehistoric relics"),
        ("국립전주박물관", "jeonju.museum.go.kr", "Royal culture exhibition"),
        ("국립청주박물관", "cheongju.museum.go.kr", "Metal craft showcase"),
        ("국립김해박물관", "gimhae.museum.go.kr", "Gaya kingdom artifacts"),
        ("국립춘천박물관", "chuncheon.museum.go.kr", "Gangwon paleolithic relics"),
        ("국립나주박물관", "naju.museum.go.kr", "Jar burial culture"),
        ("국립익산박물관", "iksan.museum.go.kr", "Mireuksa UNESCO artifacts"),
        ("전쟁기념관", "warmemo.or.kr", "War history & peace education"),
    ],
    "Contemporary Art & Galleries": [
        ("국립현대미술관 MMCA", "mmca.go.kr", "National contemporary art"),
        ("리움 삼성미술관", "leeum.org", "Samsung art museum"),
        ("아트선재센터", "artsonje.org", "Experimental contemporary art"),
        ("금호미술관", "kumhomuseum.com", "Young artist support"),
        ("아모레퍼시픽 미술관", "apma.amorepacific.com", "Corporate art museum"),
        ("국제갤러리", "kukjegallery.com", "Leading commercial gallery"),
        ("현대갤러리", "galleryhyundai.com", "Modern Korean art pioneer"),
        ("PKM 갤러리", "pkmgallery.com", "Contemporary art frontline"),
        ("학고재", "hakgojae.com", "Tradition meets modernity"),
        ("가나아트", "ganaart.com", "Public-friendly exhibitions"),
    ],
    "K-Pop Entertainment": [
        ("하이브 HYBE", "hybecorp.com", "BTS, NewJeans label"),
        ("SM 엔터테인먼트", "smentertainment.com", "K-Pop pioneer label"),
        ("YG 엔터테인먼트", "ygfamily.com", "BLACKPINK label"),
        ("JYP 엔터테인먼트", "jype.com", "TWICE, Stray Kids label"),
        ("카카오 엔터테인먼트", "kakaoent.com", "Music, webtoon, media"),
        ("CJ ENM", "cjenm.com", "MAMA awards & K-culture events"),
        ("스타쉽 엔터테인먼트", "starship-ent.com", "IVE, MONSTA X label"),
        ("큐브 엔터테인먼트", "cubeent.co.kr", "(G)I-DLE label"),
        ("FNC 엔터테인먼트", "fncent.com", "Band-type idol label"),
        ("P NATION", "pnation.com", "PSY's artist collective"),
    ],
    "Film & Video Content": [
        ("영화진흥위원회 KOFIC", "kofic.or.kr", "Korean film promotion"),
        ("한국영상자료원 KOFA", "kmdb.or.kr", "Film archive & database"),
        ("서울영상위원회", "seoulfc.or.kr", "Seoul filming support"),
        ("부산영상위원회", "bfc.or.kr", "BIFF-based film support"),
        ("한국드라마제작사협회", "kdfa.or.kr", "K-Drama production assoc"),
        ("부산국제영화제 BIFF", "biff.kr", "Asia's major film festival"),
        ("전주국제영화제 JIFF", "jeonjiff.org", "Indie film festival"),
        ("부천판타스틱영화제 BIFAN", "bifan.kr", "Genre film festival"),
        ("한국콘텐츠진흥원 KOCCA", "kocca.kr", "Content industry promotion"),
        ("스튜디오 드래곤", "studiodragon.net", "Hit K-Drama producer"),
    ],
    "Traditional Performing Arts": [
        ("국립국악원", "gugak.go.kr", "1400-year national music"),
        ("국립극장 NTOK", "ntok.go.kr", "Traditional performance venue"),
        ("정동극장", "jeongdong.or.kr", "Tourist traditional shows"),
        ("한국문화재재단", "chf.or.kr", "Heritage preservation & events"),
        ("국악방송", "gugakfm.co.kr", "Traditional music broadcasting"),
        ("한국문화집 KOUS", "kous.or.kr", "Cultural arts education space"),
        ("남산국악당", "hanokmaeul.or.kr", "Namsan gugak theater"),
        ("한국공예디자인문화진흥원", "kcdf.or.kr", "Craft design modernization"),
        ("세계도자재단", "kocef.org", "Ceramic art biennale organizer"),
    ],
    "Hangeul & Language": [
        ("국립국어원", "korean.go.kr", "Korean language standardization"),
        ("세종학당재단", "ksif.or.kr", "Global Korean language education"),
        ("국립한글박물관", "hangeul.go.kr", "Hangeul history museum"),
        ("외솔회", "oisoll.or.kr", "Hangeul research society"),
        ("한글문화연대", "urimal.org", "Easy Korean usage campaign"),
        ("TOPIK 한국어능력시험", "topik.go.kr", "Korean proficiency test"),
        ("한글파크", "hangeulpark.com", "Korean education materials"),
        ("세종대왕 기념사업회", "sejongkorea.org", "King Sejong heritage"),
        ("한국문화정보원", "kcisa.or.kr", "Cultural big data service"),
    ],
    "Heritage & Palaces": [
        ("국가유산청", "cha.go.kr", "Heritage administration"),
        ("종묘 관리소", "jongmyo.cha.go.kr", "UNESCO royal shrine"),
        ("유네스코 한국위원회", "unesco.or.kr", "Korean UNESCO committee"),
        ("고궁박물관", "gogung.go.kr", "Royal palace museum"),
        ("창경궁 관리소", "cgg.cha.go.kr", "Night palace viewing"),
        ("덕수궁 관리소", "deoksugung.go.kr", "Korean Empire history"),
        ("남한산성 세계유산", "gg.go.kr", "UNESCO fortress heritage"),
        ("국외소재문화유산재단", "oversea.cha.go.kr", "Overseas heritage repatriation"),
        ("대한불교 조계종", "jogye.or.kr", "Korean Buddhism & temples"),
        ("세계유산축전", "whf.or.kr", "UNESCO heritage festival"),
    ],
    "Arts Support & Foundations": [
        ("한국문화예술위원회 ARKO", "arko.or.kr", "Artist creation support"),
        ("서울문화재단 SFAC", "sfac.or.kr", "Seoul arts infrastructure"),
        ("경기문화재단", "ggcf.kr", "Gyeonggi cultural policy"),
        ("부산문화재단", "bscf.or.kr", "Busan cultural identity"),
        ("인천문화재단", "ifac.or.kr", "Incheon arts education"),
        ("대구문화예술진흥원", "dgfc.or.kr", "Daegu opera & arts"),
        ("예술경영지원센터", "gokams.or.kr", "Arts market activation"),
        ("한국예술인복지재단", "kawf.kr", "Artist welfare services"),
        ("한국문학번역원 LTI", "ltikorea.or.kr", "Literature translation"),
        ("대산문화재단", "daesan.or.kr", "Private literary foundation"),
    ],
    "Digital Archives & Media": [
        ("KTV 국민방송", "ktv.go.kr", "Public policy video archive"),
        ("사이버 문학광장", "munhak.or.kr", "Digital literature service"),
        ("한국학중앙연구원", "aks.ac.kr", "Korean studies research"),
        ("문화 데이터 광장", "culture.go.kr", "Cultural open data portal"),
        ("한국학 진흥사업단", "ksy.aks.ac.kr", "Korean studies support"),
        ("DA-Arts 다아트", "daarts.or.kr", "Contemporary art archive"),
        ("아리랑TV", "arirang.com", "English culture channel"),
        ("한국 공공도서관협의회", "kpla.or.kr", "Public library network"),
    ],
}

LIVING_IN_KOREA = {
    "Immigration & Visa": [
        ("하이코리아 HiKorea", "hikorea.go.kr", "Main expat government portal"),
        ("출입국외국인정책본부", "immigration.go.kr", "Immigration policy & stats"),
        ("K-ETA", "k-eta.go.kr", "Electronic travel authorization"),
        ("비자 네비게이터", "visa.go.kr", "Visa type finder guide"),
    ],
    "E-Government & Administration": [
        ("정부24 Gov.kr", "gov.kr", "Central online civil services"),
        ("행정안전부 MOIS", "mois.go.kr", "Local admin policy ministry"),
    ],
    "Study Abroad & Scholarships": [
        ("Study in Korea", "studyinkorea.go.kr", "Official study abroad portal"),
        ("국립국제교육원 NIIED", "niied.go.kr", "GKS scholarship admin"),
        ("서울대학교 SNU", "snu.ac.kr", "Korea's top national university"),
        ("KAIST", "kaist.ac.kr", "Science & technology institute"),
        ("연세대학교", "yonsei.ac.kr", "Top private university"),
        ("고려대학교", "korea.ac.kr", "SKY university"),
        ("성균관대학교", "skku.edu", "Historic Samsung-linked university"),
        ("포항공과대학교 POSTECH", "postech.ac.kr", "Elite science university"),
        ("한양대학교", "hanyang.ac.kr", "Engineering powerhouse"),
        ("이화여자대학교", "ewha.ac.kr", "World's largest women's university"),
        ("국민대학교", "kookmin.ac.kr", "Automotive & design focus"),
        ("서강대학교", "sogang.ac.kr", "Humanities & global education"),
    ],
    "Korean Language Centers": [
        ("서울대 한국어교육센터", "lei.snu.ac.kr", "Systematic curriculum"),
        ("고려대 한국어센터", "klceng.korea.ac.kr", "Communication-focused method"),
        ("서강대 한국어센터", "klec.sogang.ac.kr", "Speaking-intensive program"),
        ("연세대 한국어학당", "kli.yonsei.ac.kr", "Oldest Korean language school"),
        ("한양대 국제교육원", "iie.hanyang.ac.kr", "Practical Korean education"),
        ("경희대 국제교육원", "iie.ac.kr", "Korean studies integration"),
        ("이화여대 언어교육원", "elc.ewha.ac.kr", "Multi-national student support"),
        ("한국외대 한국어센터", "hufs.ac.kr", "Multilingual faculty support"),
        ("부산대 한국어교육원", "pnukli.pusan.ac.kr", "Busan regional program"),
        ("제주대 국제교류본부", "intl.jejunu.ac.kr", "Jeju study & leisure combo"),
    ],
    "Healthcare & Social Security": [
        ("국민건강보험공단 NHIS", "nhis.or.kr", "National health insurance"),
        ("국민연금공단 NPS", "nps.or.kr", "Foreign pension & refund"),
        ("건강보험심사평가원 HIRA", "hira.or.kr", "Medical cost assessment"),
        ("질병관리청 KDCA", "kdca.go.kr", "Disease control & quarantine"),
        ("119 응급센터", "119.go.kr", "Multilingual emergency medical"),
    ],
    "Employment & Labor": [
        ("고용노동부 MOEL", "moel.go.kr", "Labor rights central ministry"),
        ("외국인고용시스템 EPS", "eps.go.kr", "Foreign worker employment"),
        ("한국산업인력공단", "hrdkorea.or.kr", "Skilled workforce certification"),
        ("워크넷 Worknet", "work.go.kr", "National job portal"),
        ("사람인 Saramin", "saramin.co.kr", "Korea's largest job platform"),
        ("잡코리아", "jobkorea.co.kr", "Corporate recruitment platform"),
        ("피플앤잡", "peoplenjob.com", "Foreign company positions"),
        ("컨택 코리아 KOTRA", "contactkorea.go.kr", "Global talent recruitment"),
        ("중앙노동위원회", "nlrc.go.kr", "Labor dispute resolution"),
    ],
    "Legal & Law Firms": [
        ("김앤장 법률사무소", "kimchang.com", "Korea's top law firm"),
        ("법무법인 광장 BKL", "bkl.co.kr", "International litigation firm"),
        ("법무법인 태평양", "shinkim.com", "Global legal advisory"),
        ("법무법인 율촌", "yulchon.com", "Tax & inheritance specialist"),
        ("법무법인 화우", "yoonyang.com", "Corporate litigation firm"),
        ("법무법인 지평", "jipyong.com", "Asia legal network"),
        ("IPG 리걸", "ipglegal.com", "Expat criminal/civil boutique"),
        ("대한법률구조공단", "klac.or.kr", "Free legal aid service"),
        ("대한변호사협회", "koreanbar.or.kr", "Lawyer search & ethics"),
    ],
    "Banking & Finance": [
        ("KB국민은행", "kbstar.com", "Foreign-friendly banking"),
        ("신한은행", "shinhan.com", "Global banking center"),
        ("하나은행", "hanabank.com", "Strong forex expertise"),
        ("우리은행", "wooribank.com", "Migrant worker products"),
        ("카카오뱅크", "kakaobank.com", "100% mobile banking"),
        ("토스 Toss", "toss.im", "Innovative fintech super-app"),
        ("센트비 SentBe", "sentbe.com", "Low-fee remittance service"),
        ("한패스 Hanpass", "hanpass.com", "Convenience store remittance"),
        ("금융감독원", "fss.or.kr", "Financial consumer protection"),
        ("한국거래소 KRX", "krx.co.kr", "Capital market information"),
    ],
    "Global Support Centers": [
        ("서울 글로벌센터", "global.seoul.go.kr", "Seoul expat support hub"),
        ("인천 글로벌센터", "incheonglobalcenter.org", "Incheon global community"),
        ("부산 글로벌센터", "bfg.or.kr", "Southern region support"),
        ("대구 글로벌센터", "dgic.or.kr", "Student & worker support"),
        ("광주 국제교류센터", "gic.or.kr", "Gwangju networking & info"),
        ("대전 글로벌센터", "dic.or.kr", "Science talent settlement"),
        ("이촌 글로벌센터", "ichon.seoul.go.kr", "Yongsan Japanese expat area"),
        ("이태원 글로벌센터", "itaewon.seoul.go.kr", "Multicultural district hub"),
        ("서래 글로벌센터", "serae.seoul.go.kr", "French/European expat area"),
        ("다누리 포털", "liveinkorea.kr", "Multicultural family support"),
    ],
    "Emergency & Safety": [
        ("기상청", "kma.go.kr", "Real-time weather & disaster"),
        ("경찰청", "police.go.kr", "Crime reporting & service"),
        ("사이버수사국", "cyber.go.kr", "Online crime reporting"),
        ("도로교통공단", "koroad.or.kr", "Foreign license renewal"),
        ("재난안전포털", "safekorea.go.kr", "Disaster response system"),
        ("한국소비자원", "kca.go.kr", "Consumer protection disputes"),
        ("해양경찰청", "kcg.go.kr", "Maritime emergency response"),
        ("국방부", "mnd.go.kr", "National security notices"),
        ("관세청", "customs.go.kr", "Customs & import clearance"),
    ],
    "Housing & Daily Infrastructure": [
        ("KB부동산", "kbland.kr", "Real estate price index"),
        ("직방 Zigbang", "zigbang.com", "Korea's largest housing app"),
        ("다방 Dabang", "dabangapp.com", "Mobile housing search"),
        ("네이버 부동산", "land.naver.com", "Largest property listings"),
        ("한국토지주택공사 LH", "lh.or.kr", "Public housing for foreigners"),
        ("서울교통공사", "seoulmetro.co.kr", "Seoul subway system"),
        ("사회통합프로그램 KIIP", "socinet.go.kr", "Immigrant integration program"),
        ("인베스트 코리아", "investkorea.org", "Foreign investor support"),
        ("서울 스타트업 허브", "hub.sba.kr", "Startup office & consulting"),
    ],
}

FOOD_DINING = {
    "Hansik Promotion & Policy": [
        ("한식포털 Hansik", "hansik.or.kr", "Korean food globalization HQ"),
        ("농림축산식품부 MAFRA", "mafra.go.kr", "Agriculture & food ministry"),
        ("한국농수산식품유통공사 aT", "at.or.kr", "K-Food export agency"),
    ],
    "Food Research & Science": [
        ("한국식품연구원 KFRI", "kfri.re.kr", "Food science research"),
        ("세계김치연구소", "wikim.re.kr", "Kimchi science & globalization"),
        ("한국식품과학회", "kosfost.or.kr", "Food science academia"),
        ("식품산업협회", "kfia.or.kr", "Food industry rights"),
        ("건강기능식품협회", "khff.or.kr", "Health supplement quality"),
        ("국가식품클러스터", "foodpolis.kr", "Food R&D innovation complex"),
    ],
    "Traditional Markets": [
        ("광장시장", "kwangjangmarket.co.kr", "Korea's first permanent market"),
        ("남대문시장", "namdaemunmarket.co.kr", "Korea's largest traditional market"),
        ("노량진 수산시장", "susanmarket.co.kr", "Urban seafood market"),
        ("마장동 축산시장", "mjmm.co.kr", "Premium meat market district"),
        ("자갈치시장", "jagalchimarket.kr", "Busan iconic fish market"),
        ("서문시장", "seomun.daegu.kr", "Joseon-era top 3 market"),
        ("제주 동문시장", "jejudongmun.kr", "Jeju's largest market & night market"),
        ("망원시장", "mangwonmarket.kr", "Hip market for young & foreigners"),
        ("경동 한약재시장", "kyungdongmarket.co.kr", "Korea's largest herbal market"),
        ("소상공인시장진흥공단 SEMAS", "semas.or.kr", "Traditional market digitalization"),
    ],
    "Gourmet Guides": [
        ("미슐랭 가이드 한국", "guide.michelin.com", "Michelin-rated restaurants"),
        ("블루리본 서베이", "bluer.co.kr", "Korea's first restaurant guide"),
        ("캐치테이블", "catchtable.net", "Hot restaurant booking"),
        ("식신", "siksinhot.com", "User-rated dining data"),
        ("망고플레이트", "mangoplate.com", "Trendy cafe & food curation"),
        ("다이닝코드", "diningcode.com", "Ad-free big data restaurants"),
        ("포잉 Poing", "poing.co.kr", "Premium dining curation"),
        ("레드테이블", "redtable.kr", "Multilingual menu service"),
        ("로컬푸드 가이드", "kfoodguide.visitkorea.or.kr", "Official food tourism guide"),
        ("식로", "sikro.kr", "Route-based food recommendations"),
    ],
    "Special Diets & Dietary": [
        ("비건 코리아", "vegan.or.kr", "Korean vegan culture & restaurants"),
        ("할랄 코리아", "halalkorea.or.kr", "KMF halal certification guide"),
        ("한국 사찰음식", "koreatemplefood.com", "Buddhist temple cuisine"),
        ("베제투스", "vegetus.kr", "Vegan patisserie & chef info"),
        ("한국비건인증원", "koreavegan.org", "Vegan certification guide"),
        ("해피카우 한국", "happycow.net", "Global vegan platform (Korea)"),
        ("베베쿡", "bebe-cook.com", "Baby food brand guide"),
        ("한국슬로푸드협회", "slowfood.or.kr", "Traditional food preservation"),
        ("천식알레르기학회", "allergy.or.kr", "Allergen management info"),
    ],
    "Traditional Beverages & Drinks": [
        ("막걸리 협회", "makgeolli.or.kr", "Traditional rice wine standards"),
        ("전통주 갤러리", "thesool.com", "Traditional liquor gallery"),
        ("한국 차 위원회", "koreatea.or.kr", "Korean tea culture & industry"),
        ("하동 야생차", "hadong.go.kr", "UNESCO heritage tea region"),
        ("보성 녹차", "boseong.go.kr", "Korea's largest green tea region"),
        ("한국 커피 협회", "kca.or.kr", "Specialty coffee culture & education"),
        ("한국수제맥주협회", "koreacraftbrewers.com", "Craft brewery map & info"),
        ("와인 코리아", "winekorea.kr", "Domestic winery information"),
        ("오미자 산업화지원단", "omija.go.kr", "Five-flavor berry products"),
    ],
    "Regional Food Specialties": [
        ("한우 자조금관리위", "hanwooboard.or.kr", "Premium Korean beef brand"),
        ("제주 흑돼지", "jeju.go.kr", "Jeju black pork guide"),
        ("안동 찜닭", "andong.go.kr", "Andong braised chicken origin"),
        ("춘천 음식", "tour.chuncheon.go.kr", "Dakgalbi & makguksu guide"),
        ("수원 갈비", "suwon.go.kr", "Suwon galbi heritage"),
        ("여수 특산물", "yeosu.go.kr", "Southern sea food specialties"),
        ("경주 황남빵", "hwangnam.co.kr", "Historic Gyeongju pastry"),
        ("전주 비빔밥", "jeonjubibimbap.com", "UNESCO creative food city"),
        ("대구 미식", "daegufood.go.kr", "Daegu's 10 signature dishes"),
        ("부산 미식", "busan.go.kr", "Busan dwaeji-gukbap & milmyeon"),
    ],
    "Culinary Education": [
        ("궁중음식연구원", "food.co.kr", "Royal cuisine master class"),
        ("CJ 더키친", "cjthekitchen.co.kr", "Modern hansik recipe archive"),
        ("온고 푸드", "ongofood.com", "Foreigner cooking classes & tours"),
        ("서울 쿠킹클럽", "seoulcookingclub.com", "Hands-on Korean cooking"),
        ("떡 박물관", "tteokmuseum.org", "Traditional rice cake education"),
        ("김치 아카데미", "kimchacademy.com", "Kimchi making & fermentation"),
        ("르꼬르동블루 숙명", "lcbsm.ac.kr", "Global chef fusion education"),
        ("한국조리예술학원", "korea-culinary.com", "Master chef training center"),
        ("푸드앤컬처 아카데미", "koreanrecipe.co.kr", "Culture-food fusion program"),
        ("막걸리 학교", "makgeollischool.com", "Traditional brewing school"),
    ],
    "Food Industry & Safety": [
        ("식품외식유통협회", "ikfda.or.kr", "Food distribution association"),
        ("외식산업협회", "kfria.or.kr", "Restaurant industry support"),
        ("식약처 MFDS", "mfds.go.kr", "Food safety standards authority"),
        ("K-푸드 로고", "kfoodlogo.com", "Export food certification"),
        ("식품안전정보원", "foodsafetykorea.go.kr", "Food hazard monitoring"),
        ("농촌경제연구원 KREI", "krei.re.kr", "Agriculture industry research"),
        ("검역본부 APQA", "qia.go.kr", "Import quarantine regulations"),
        ("KATI 수출정보", "kati.net", "K-Food export data"),
        ("식품저널", "foodnews.co.kr", "Food industry news media"),
    ],
    "Food Tech & Delivery": [
        ("배달의민족", "baemin.com", "Korea's top food delivery app"),
        ("쿠팡이츠", "coupangeats.com", "Rocket delivery food service"),
        ("요기요", "yogiyo.co.kr", "Major food delivery app"),
        ("셔틀 딜리버리", "shuttledelivery.co.kr", "Multilingual food delivery"),
        ("마켓컬리", "kurly.com", "Dawn fresh food delivery"),
        ("오아시스 마켓", "oasis.co.kr", "Organic fresh food delivery"),
        ("윙잇", "wingeat.com", "HMR & meal kit platform"),
        ("쿠캣 마켓", "cookatmarket.com", "Recipe-linked food shopping"),
    ],
    "Food Media & Channels": [
        ("가스트로투어 서울", "gastrotourseoul.com", "Expert food tour magazine"),
        ("서울 푸디", "seoulfoodie.com", "English Seoul dining trends"),
        ("10 매거진 푸드", "10mag.com", "Expat hidden gem guide"),
        ("마이서울푸드", "myseoulfood.com", "Verified foreigner reviews"),
        ("젠김치 ZenKimchi", "zenkimchi.com", "Western perspective on hansik"),
        ("팻걸 서울", "fatgirlseoul.com", "Local & legacy restaurant guide"),
        ("이터 서울 Eater", "eater.com", "Global food platform (Seoul)"),
        ("타임아웃 서울", "timeout.com", "Editor's pick restaurants & bars"),
        ("푸드트립 코리아", "foodtrip.korea.kr", "Seasonal regional food routes"),
    ],
}

SHOPPING_KBEAUTY = {
    "Department Stores": [
        ("롯데백화점", "lotteshopping.com", "Korea's largest retail network"),
        ("신세계백화점", "shinsegae.com", "Premium luxury shopping"),
        ("현대백화점", "ehyundai.com", "Trendy popup & lifestyle"),
        ("갤러리아백화점", "dept.galleria.co.kr", "Apgujeong high-end luxury"),
        ("AK플라자", "akplaza.com", "Regional lifestyle shopping"),
        ("더현대 서울", "thehyundaiseoul.com", "Future retail landmark"),
        ("롯데 프리미엄 아울렛", "lotteoutlets.com", "Affordable luxury outlet"),
        ("신세계 사이먼 아울렛", "premiumoutlets.co.kr", "American-style outlet"),
        ("현대 프리미엄 아울렛", "hyundaioutlets.com", "Family outdoor brands"),
    ],
    "Duty Free Shopping": [
        ("신라면세점", "shilladfs.com", "Global duty-free leader"),
        ("롯데면세점", "lottedfs.com", "World's 2nd largest duty-free"),
        ("신세계면세점", "ssgdfs.com", "Myeongdong Hallyu duty-free"),
        ("현대면세점", "hddfs.com", "Gangnam & airport duty-free"),
        ("동화면세점", "dwhdfs.com", "Korea's first downtown duty-free"),
        ("JDC면세점", "jdcdutyfree.com", "Jeju traveler duty-free"),
        ("JTO제주면세점", "jtoview.com", "Jeju public duty-free"),
        ("면세뉴스", "kdfnews.com", "Duty-free industry media"),
        ("시티면세점", "citydfs.com", "Gateway budget duty-free"),
    ],
    "K-Beauty Brands": [
        ("설화수 Sulwhasoo", "sulwhasoo.com", "Luxury hanbang skincare"),
        ("라네즈 Laneige", "laneige.com", "Water science skincare"),
        ("이니스프리 Innisfree", "innisfree.com", "Jeju naturalism brand"),
        ("헤라 Hera", "hera.com", "Contemporary Seoul beauty"),
        ("닥터자르트 Dr.Jart+", "drjart.com", "Derma-tech skincare"),
        ("COSRX", "cosrx.com", "Minimalist problem-skin care"),
        ("미샤 Missha", "missha.com", "Affordable quality skincare"),
        ("에뛰드 Etude", "etude.com", "Fun colorful makeup"),
        ("바닐라코 Banila Co", "banila.com", "Cleansing balm pioneer"),
        ("클리오 Clio", "clubclio.co.kr", "Professional color makeup"),
        ("메디힐 Mediheal", "mediheal.com", "Sheet mask world leader"),
        ("3CE", "stylenanda.com", "Trendy color cosmetics"),
        ("네이처리퍼블릭", "naturerepublic.com", "Nature-powered skincare"),
        ("더페이스샵", "thefaceshop.com", "Natural skincare brand"),
        ("어뮤즈 Amuse", "amusebeauty.com", "Vegan certified beauty"),
        ("마녀공장", "manyo.co.kr", "Ingredient-obsessed clean beauty"),
        ("라운드랩 Round Lab", "roundlab.co.kr", "Dokdo toner, minimal beauty"),
        ("조선미녀 BOJ", "beautyofjoseon.com", "Modern hanbang beauty"),
        ("스킨1004", "skin1004.com", "Centella soothing specialist"),
        ("올리브영 Olive Young", "oliveyoung.com", "Korea's #1 beauty retailer"),
    ],
    "Beauty Concierge & Medical Aesthetics": [
        ("아가스킨", "agaskinbeauty.com", "Global K-Beauty curator"),
        ("스타일스토리", "stylestory.com.au", "Korea beauty ecosystem consulting"),
        ("유노고 Eunogo", "eunogo.com", "Premium clinic curation"),
        ("한국클리닉가이드", "koreaclinicguide.com", "Foreign patient checklist"),
        ("강남 메디컬투어", "medicaltour.gangnam.go.kr", "Gangnam medical beauty hub"),
        ("메디컬컨시어지협회", "koreamedicalconcierge.or.kr", "Medical guide standardization"),
        ("마이뷰티트립", "mybeautytrip.com", "Beauty procedure booking"),
        ("글로우레시피", "glowrecipe.com", "Curated K-Beauty editorial"),
    ],
    "Hair & Styling Salons": [
        ("준오헤어 Juno Hair", "junohair.com", "Korea's largest salon chain"),
        ("순시키헤어 Soonsiki", "soonsiki.com", "Hongdae trend-setting salon"),
        ("박준 뷰티랩", "parkjun.com", "Pioneer Korean hair brand"),
        ("제니하우스", "jennyhouse.co.kr", "Celebrity styling & wedding"),
        ("에이엠톤 AM:TON", "amton.co.kr", "Custom styling specialist"),
        ("빗앤붓", "bitandboot.com", "K-Pop idol styling salon"),
        ("오휘스파", "ohuispa.com", "Luxury brand face & body spa"),
        ("약손명가", "yaksonhouse.com", "Golgi facial contouring therapy"),
        ("찹헤어 CHOP Hair", "chophair.com", "Gangnam foreigner-friendly salon"),
    ],
    "Beauty Associations & Regulation": [
        ("대한화장품협회 KCA", "kcia.or.kr", "Cosmetics industry standards"),
        ("국제뷰티산업교역협회 IBITA", "ibita.or.kr", "Beauty trade matching"),
        ("한국뷰티산업무역협회 KBITA", "kbita.or.kr", "SME beauty export support"),
        ("대한피부과의사회", "akd.or.kr", "Dermatologist skin health guide"),
        ("한국화장품산업연구원", "kcii.re.kr", "Global skin research"),
        ("인터참 코리아", "intercharmkorea.com", "Korea's largest B2B beauty expo"),
        ("K-뷰티 엑스포", "k-beautyexpo.co.kr", "Asia K-Beauty industry fest"),
        ("코스메틱 코리아", "cosmetickorea.com", "Beauty industry news portal"),
        ("한국화장품공업협동조합", "kcma.or.kr", "Cosmetics manufacturer union"),
        ("K-뷰티 월드 네트워크", "k-beauty.or.kr", "Global beauty expert network"),
    ],
    "Beauty B2B & Manufacturing": [
        ("한국콜마 Kolmar", "kolmar.co.kr", "World-class ODM/OEM manufacturer"),
        ("코스맥스 Cosmax", "cosmax.com", "Global brand manufacturer"),
        ("메이크팩토리 Mayk", "mayk-factory.com", "Brand-manufacturer B2B platform"),
        ("실리콘투 Silicon2", "silicon2.co.kr", "Global beauty distribution"),
        ("스타일코리안", "stylekorean.com", "K-Beauty direct shopping"),
        ("예스스타일 YesStyle", "yesstyle.com", "Asian fashion & beauty platform"),
        ("졸스 Jolse", "jolse.com", "K-Beauty global store"),
        ("소코글램 Soko Glam", "sokoglam.com", "US K-Beauty curation pioneer"),
        ("뷰티넷 코리아", "beautynetkorea.com", "Affordable global shipping"),
        ("위시트렌드 Wishtrend", "wishtrend.com", "Ingredient-focused curation"),
    ],
    "Tax Refund Services": [
        ("글로벌 텍스프리", "global-taxfree.com", "Korea's largest tax refund"),
        ("글로벌블루 Korea", "globalblue.com", "World #1 tax refund (Korea)"),
        ("큐브 리펀드", "kuberefund.com", "Mobile tax refund system"),
        ("한국면세점협회", "kdfa.or.kr", "Duty-free policy research"),
    ],
    "Fashion Platforms": [
        ("무신사 Musinsa", "musinsa.com", "Korea's top fashion platform"),
        ("W컨셉", "wconcept.co.kr", "Designer brand curation"),
        ("29CM", "29cm.co.kr", "Storytelling lifestyle select"),
        ("스타일난다 StyleNanda", "stylenanda.com", "K-Street fashion global brand"),
        ("루킨 Lewkin", "lewkin.com", "Gen-Z K-Fashion direct"),
        ("코디북", "codibook.net", "Styling & shopping system"),
        ("믹스엑스믹스", "mixxmix.com", "K-Pop idol fashion items"),
        ("임블리 Im Vely", "imvely.com", "Influencer lifestyle mall"),
        ("츄 Chuu", "chuu.co.kr", "Famous -5kg jeans brand"),
        ("66걸즈", "66girls.com", "Affordable daily K-Fashion"),
    ],
    "Shopping Districts": [
        ("명동 관광", "junggu.seoul.kr", "World beauty roadshop mecca"),
        ("인사동 공예거리", "jongno.go.kr", "Traditional craft galleries"),
        ("동대문 패션타운", "dft.co.kr", "24h fashion wholesale hub"),
        ("강남 관광", "gangnam.go.kr", "Garosugil design streets"),
        ("스타필드 Starfield", "starfield.co.kr", "Mega lifestyle theme mall"),
    ],
}


def build():
    ALL_CATEGORIES = {
        "Medical Tourism": MEDICAL_TOURISM,
        "Travel & Tourism": TRAVEL_TOURISM,
        "K-Culture": K_CULTURE,
        "Living in Korea": LIVING_IN_KOREA,
        "Food & Dining": FOOD_DINING,
        "Shopping & K-Beauty": SHOPPING_KBEAUTY,
    }

    db = {
        "meta": {
            "version": "2.0",
            "lastUpdated": "2026-02-07",
            "description": "Curated authoritative sources for Korea Experience blog",
            "categories": 6,
            "totalSources": 0,
        },
        "categories": {},
    }

    total = 0
    for cat_name, subcats in ALL_CATEGORIES.items():
        db["categories"][cat_name] = {"subcategories": {}}
        cat_total = 0
        for sub_name, entries in subcats.items():
            seen = set()
            deduped = []
            for name, url, desc in entries:
                cleaned = clean_url(url)
                if cleaned not in seen:
                    seen.add(cleaned)
                    deduped.append({"name": name, "url": cleaned, "desc": desc})
            db["categories"][cat_name]["subcategories"][sub_name] = deduped
            cat_total += len(deduped)
        total += cat_total

    db["meta"]["totalSources"] = total

    # Ensure output directory
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    print(f"✅ Saved {total} sources to {OUTPUT_PATH}")
    print()
    for cat_name in ALL_CATEGORIES:
        subcats = db["categories"][cat_name]["subcategories"]
        sub_count = len(subcats)
        cat_total = sum(len(v) for v in subcats.values())
        print(f"  {cat_name:<25} {sub_count:>2} subcategories  {cat_total:>3} sources")
    print(f"\n  {'TOTAL':<25} {'':>2}               {total:>3} sources")


if __name__ == "__main__":
    build()
