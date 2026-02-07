#!/usr/bin/env python3
"""
600개 소스 데이터를 파싱하여 구조화된 JSON DB를 생성합니다.
원본 데이터: Deep Search로 수집한 6개 카테고리 × 100개 사이트
"""
import json
import re

# ========== RAW DATA ==========
# 카테고리별로 (name, url, subcategory) 튜플 리스트

MEDICAL_TOURISM = {
    "Government & Official Portals": [
        ("Medical Korea Official Portal", "https://www.medicalkorea.or.kr", "Official government medical tourism portal for foreign patients"),
        ("KHIDI (Korea Health Industry Development Institute)", "https://www.khidi.or.kr/eps", "Medical tourism statistics, policy, and hospital certification"),
        ("VisitKorea Medical & Wellness", "https://english.visitkorea.or.kr/svc/sp/medicalwellnessKorea", "KTO medical and wellness tourism theme page"),
        ("Gangnam Medical Tour Center", "http://medicaltour.gangnam.go.kr/en", "Gangnam district medical tourism information center"),
        ("Incheon Medical Tourism", "https://medical.incheon.go.kr/en", "Incheon city medical tourism portal"),
        ("Busan Medical Tourism", "https://english.busan.go.kr/visitbusan/medical-tourism", "Busan city medical tourism information"),
        ("Daegu Medical Tourism", "http://www.meditour.daegu.go.kr/eng", "Daegu city medical tourism portal"),
        ("Gyeonggi Medical Tourism", "http://www.gmto.or.kr/eng", "Gyeonggi province medical tourism organization"),
        ("Jeju Medical Tourism", "https://www.visitjeju.net/en/medical-wellness", "Jeju island medical and wellness tourism"),
        ("KOIHA (Healthcare Accreditation)", "http://www.koiha.or.kr/english", "Korea Institute for Healthcare Accreditation"),
    ],
    "Major Hospitals": [
        ("Asan Medical Center", "https://eng.amc.seoul.kr", "Top-tier hospital for severe diseases, cancer, organ transplants"),
        ("Seoul National University Hospital (SNUH)", "http://www.snuh.org/global/en", "Korea's leading national university hospital"),
        ("Samsung Medical Center (SMC)", "https://www.samsunghospital.com/gb/lang/english", "Samsung-affiliated hospital, precision medicine"),
        ("Severance Hospital (Yonsei)", "https://yuhs.severance.healthcare/yuhs-en", "Pioneer in international healthcare, robotic surgery"),
        ("Seoul St. Mary's Hospital", "https://www.cmcseoul.or.kr/en.common.main.main.do", "Catholic medical center, stem cell transplant leader"),
        ("SNU Bundang Hospital", "https://www.snubh.org/service/en/index.do", "Digital healthcare and minimally invasive surgery"),
        ("Korea University Anam Hospital", "http://anam.kumc.or.kr/language/eng", "Precision medicine and robotic surgery"),
        ("Kyung Hee University Medical Center", "http://www.khmc.or.kr/eng", "Korean-Western integrated medicine"),
        ("Konkuk University Medical Center", "https://www.kuh.ac.kr/english.do", "Cardiovascular disease and senior care"),
        ("Hanyang University Medical Center", "https://seoul.hanyangmc.or.kr/en", "General medical center with international services"),
        ("Chung-Ang University Hospital", "https://www.chmc.or.kr/en", "Comprehensive university hospital"),
        ("Ewha Womans University Medical Center", "https://www.eumc.ac.kr/en/main.do", "Women's health specialized medical center"),
        ("Ajou University Hospital", "http://global.ajoumc.or.kr/eng", "Trauma center and emergency medicine"),
        ("Pusan National University Hospital", "http://www.pnuh.or.kr/pnuh/en", "Southern region's largest hospital"),
        ("Chonnam National University Hospital", "https://www.cnuh.com/en", "Chonnam region major university hospital"),
        ("Kyungpook National University Hospital", "http://knuh.knu.ac.kr/eng", "Kyungpook region university hospital"),
        ("Inha University Hospital", "https://www.inha.com/en", "Incheon-based university hospital"),
        ("Gangnam Severance Hospital", "https://gs.severance.healthcare/gs-en", "Gangnam branch of Severance Hospital"),
        ("Gachon University Gil Medical Center", "https://www.gilhospital.com/en", "Incheon area major medical center"),
        ("Soonchunhyang University Hospital", "https://www.schmc.ac.kr/seoul/kor/index.do", "Multi-campus university hospital"),
    ],
    "Plastic Surgery & Dermatology": [
        ("JK Plastic Surgery", "https://www.jkplastic.com", "Government-certified plastic surgery center"),
        ("Banobagi Plastic Surgery", "https://eng.banobagi.com", "Global recognition, systematic aftercare"),
        ("ID Hospital", "https://eng.idhospital.com", "Facial contouring and jaw surgery specialist"),
        ("Wonjin Plastic Surgery", "https://wonjinbeauty.com", "Comprehensive cosmetic surgery center"),
        ("View Plastic Surgery", "https://www.viewclinic.com/eng", "Rhinoplasty and facial surgery specialist"),
        ("Pitangui Plastic Surgery", "https://www.pitangui-en.com", "Premium cosmetic surgery clinic"),
        ("Grand Plastic Surgery", "https://eng.grandsurgery.com", "Full-service cosmetic surgery"),
        ("BK Plastic Surgery", "https://english.bkhospital.com", "Eye and nose surgery specialist"),
        ("Meclinic Seoul", "https://www.meclinic.net", "Dermatology and aesthetic clinic"),
        ("Oracle Dermatology", "https://www.oraclemedicalgroup.com/en", "Major dermatology chain in Korea"),
        ("Arumdaun Nara Dermatology", "http://www.anclinic.com/english", "Established dermatology clinic network"),
        ("Hus'hu Dermatology", "https://hushuskin.com/en", "Skin treatment specialist"),
        ("Renewme Skin Clinic", "http://www.rnmeskin.com", "Skin renewal and anti-aging treatments"),
        ("Leaders Dermatology", "http://www.beautyleaders.co.kr/en", "Beauty-focused dermatology"),
        ("CNP Skin Clinic", "http://www.cnpskin.com/en", "Clinical dermatology and skincare"),
    ],
    "Specialized Clinics": [
        ("B&VIIT Eye Center", "https://english.bnviit.com", "AI-powered LASIK/LASEK surgery"),
        ("Bright Eye Clinic", "https://en.brighteyesclinic.com", "Gangnam eye surgery clinic"),
        ("HanGil Eye Hospital", "http://www.hangileye.co.kr/eng", "Government-designated ophthalmology hospital"),
        ("CHA Fertility Center", "https://seoul.chamc.co.kr/en", "World-class fertility treatment and IVF"),
        ("Maria Fertility Hospital", "https://www.mariababy.com/en", "Fertility and reproductive medicine"),
        ("MizMedi Women's Hospital", "https://www.mizmedi.com/en", "Women's health and fertility"),
        ("Wooridul Spine Hospital", "https://wooridul.com/en", "Spine surgery specialist"),
        ("Jaseng Hospital of Korean Medicine", "https://www.jaseng.net", "Non-surgical spine treatment, Korean medicine"),
        ("Himchan Hospital (Joints)", "http://www.himchanhospital.com/en", "Joint and orthopedic specialist"),
        ("Nanoori Hospital (Spine)", "http://en.nanoori.co.kr", "Spine and joint treatment"),
        ("Seoul National University Dental Hospital", "https://www.snudh.org/en/main/main.do", "Top dental hospital in Korea"),
        ("Yonsei University Dental Hospital", "https://yudh.severance.healthcare/yudh-en", "Yonsei dental care center"),
        ("Sejong Hospital (Heart)", "https://www.sejonghosp.co.kr", "Korea's only heart-specialized hospital"),
    ],
    "Wellness & Traditional Medicine": [
        ("Healience Seonmaeul", "http://www.healience.co.kr/wellness", "Korea's first wellness facility, digital detox"),
        ("Taekwondowon Wellness", "https://www.tpf.or.kr/tpf/english", "Taekwondo and meditation wellness"),
        ("Seoul K-Medi Center", "https://kmedi.ddm.go.kr", "Traditional Korean medicine cultural experience"),
        ("Forest Resom Spa", "https://www.resom.co.kr/forest/main/main.asp", "Forest spa and wellness resort"),
        ("WE Hospital (Jeju Wellness)", "http://www.wehotel.co.kr/en", "Hydrotherapy and medical spa"),
        ("Donguibogam Village (Sancheong)", "http://donguibogam-village.sancheong.go.kr", "Traditional medicine heritage village"),
    ],
    "Medical Facilitators & Information": [
        ("Seoul Guide Medical", "https://seoulguidemedical.com", "Medical tourism facilitator platform"),
        ("Himedi (Medical Platform)", "https://himedi.com/en", "Medical procedure booking platform"),
        ("MFDS (Food and Drug Safety)", "https://www.mfds.go.kr/eng", "Drug and medical device regulations"),
        ("NHIS (National Health Insurance)", "https://www.nhis.or.kr/english", "Health insurance for foreign residents"),
        ("HIRA (Health Insurance Review)", "https://www.hira.or.kr/eng", "Hospital and treatment cost transparency"),
        ("Medical Korea Information Center", "https://www.medicalkorea.or.kr/en/support", "Patient support and dispute resolution"),
        ("Korea Medical Dispute Mediation", "https://www.k-medi.or.kr/eng", "Medical dispute resolution service"),
        ("JCI Accredited Organizations", "https://www.jointcommissioninternational.org", "International hospital accreditation search"),
        ("Newsweek World's Best Hospitals", "https://www.newsweek.com/rankings/worlds-best-hospitals-2024/south-korea", "Global hospital rankings for Korea"),
        ("KIHASA (Health & Social Affairs)", "https://www.kihasa.re.kr/en", "Health policy research institute"),
    ],
}

TRAVEL_TOURISM = {
    "Government & Major Portals": [
        ("VisitKorea (Official)", "https://english.visitkorea.or.kr", "Korea's main official tourism portal"),
        ("Korea Tourism Organization (KTO)", "https://knto.or.kr/eng", "National tourism organization corporate site"),
        ("MCST (Ministry of Culture, Sports and Tourism)", "https://www.mcst.go.kr/english", "Government ministry overseeing tourism"),
        ("Korea Heritage Service", "https://english.khs.go.kr", "Cultural heritage and palace information"),
        ("1330 Korea Travel Helpline", "https://english.visitkorea.or.kr", "24-hour travel assistance hotline info"),
        ("Imagine Your Korea (YouTube)", "https://www.youtube.com/user/visitkorea", "Official Korea tourism YouTube channel"),
        ("K-MICE (Business Events)", "https://www.k-mice.or.kr/main/main.do", "Business and convention tourism portal"),
        ("Travel Safety Korea", "https://english.visitkorea.or.kr", "Travel safety information and alerts"),
        ("K-ETA (Electronic Travel Auth)", "https://www.k-eta.go.kr", "Electronic travel authorization system"),
        ("Korea.net (Tourism Section)", "https://www.korea.net", "Official government promotion portal"),
    ],
    "City & Province Tourism": [
        ("Visit Seoul", "https://english.visitseoul.net", "Seoul Metropolitan Government tourism portal"),
        ("Visit Busan", "https://www.visitbusan.net/en", "Busan city tourism portal"),
        ("Visit Jeju", "https://www.visitjeju.net/en", "Jeju island tourism portal"),
        ("Visit Incheon", "https://itour.incheon.go.kr", "Incheon city tourism portal"),
        ("Visit Gyeongju", "https://www.gyeongju.go.kr/tour/eng", "Ancient capital Gyeongju tourism"),
        ("Visit Gangwon", "https://www.gangwon.to/en", "Gangwon province tourism"),
        ("Visit Gyeonggi", "https://www.ggtour.or.kr/en", "Gyeonggi province tourism"),
        ("Visit Daegu", "https://tour.daegu.go.kr/eng", "Daegu city tourism"),
        ("Visit Gwangju", "https://tour.gwangju.go.kr/eng", "Gwangju city tourism"),
        ("Visit Daejeon", "https://www.daejeon.go.kr/tou/index.do", "Daejeon city tourism"),
        ("Visit Ulsan", "https://tour.ulsan.go.kr/tour/eng", "Ulsan city tourism"),
        ("Visit Suwon", "https://www.suwon.go.kr/visitsuwon", "Suwon city and Hwaseong Fortress"),
        ("Visit Jeonju", "https://tour.jeonju.go.kr/eng", "Jeonju Hanok Village and food capital"),
        ("Visit Gyeongsangbuk-do", "http://tour.gb.go.kr/en", "North Gyeongsang province tourism"),
        ("Visit Jeollanam-do", "https://www.namdokorea.com/en", "South Jeolla province tourism"),
        ("Visit Chungnam", "https://tour.chungnam.go.kr/en", "South Chungcheong province tourism"),
        ("Visit Andong", "https://www.andong.go.kr/tour/eng", "Andong traditional culture city"),
        ("Visit Pyeongchang", "https://tour.pc.go.kr/en", "Pyeongchang Winter Olympics legacy"),
    ],
    "Transportation": [
        ("KORAIL (KTX)", "https://www.letskorail.com", "Korea Railroad Corporation, train schedules and passes"),
        ("SRT (High-Speed Rail)", "https://etk.srail.kr/main.do", "Suseo-based high-speed rail service"),
        ("Incheon International Airport", "https://www.airport.kr/ap/en", "Main international airport services"),
        ("Gimpo International Airport", "https://www.airport.co.kr/gimpoeng", "Seoul domestic and short-haul airport"),
        ("T-money Official", "https://www.t-money.co.kr", "Transit card for all public transport"),
        ("Korea Expressway Corporation", "https://www.ex.co.kr/eng", "Highway information for road trips"),
        ("Seoul Metro", "http://www.seoulmetro.co.kr/en", "Seoul subway system guide"),
        ("Busan Port Authority", "https://www.busanpa.com/eng", "Cruise and ferry terminal info"),
        ("Korean Air", "https://www.koreanair.com", "National flag carrier airline"),
        ("Asiana Airlines", "https://flyasiana.com", "Major Korean airline"),
        ("Jeju Air", "https://www.jejuair.net/en", "Largest low-cost carrier"),
        ("Air Busan", "https://www.airbusan.com", "Busan-based airline"),
        ("Jin Air", "https://www.jinair.com", "Korean Air subsidiary LCC"),
    ],
    "Accommodation": [
        ("TempleStay Official", "https://eng.templestay.com", "Buddhist temple overnight stays"),
        ("Lotte Hotels & Resorts", "https://www.lottehotel.com", "Major Korean hotel chain"),
        ("Shilla Hotels", "https://www.shilla.net", "Samsung-affiliated luxury hotels"),
        ("Paradise City", "https://www.p-city.com", "Art-entertainment resort near Incheon Airport"),
        ("High1 Resort", "https://www.high1.com/eng", "Ski, golf, and casino highland resort"),
        ("Yongpyong Resort", "https://www.yongpyong.co.kr/en", "Major ski resort, Olympic venue"),
        ("LEGOLAND Korea", "https://www.legoland.kr/en", "Family-friendly theme park and resort"),
        ("Josun Hotels & Resorts", "https://www.josunhotel.com", "Heritage Korean hotel brand"),
        ("Walkerhill Hotels", "https://www.walkerhill.com/en", "Riverside luxury hotel complex"),
        ("Four Seasons Hotel Seoul", "https://www.fourseasons.com/seoul", "Ultra-luxury hotel in Gwanghwamun"),
        ("Benikea (KTO Hotel Brand)", "https://www.benikea.com", "KTO certified budget-friendly hotel chain"),
    ],
    "Attractions & Landmarks": [
        ("Lotte World Adventure", "https://adventure.lotteworld.com/eng", "Indoor-outdoor theme park in Seoul"),
        ("Everland Resort", "https://www.everland.com/web/everland/main.html", "Korea's largest theme park"),
        ("N Seoul Tower", "https://www.nseoultower.co.kr/eng", "Seoul's iconic Namsan Tower landmark"),
        ("National Museum of Korea", "https://www.museum.go.kr/site/eng/home", "National museum with free admission"),
        ("War Memorial of Korea", "https://www.warmemo.or.kr/eng", "Military history museum"),
        ("Nami Island", "https://namisum.com/en", "Famous K-Drama filming location"),
        ("Garden of Morning Calm", "http://www.morningcalm.co.kr/_eng", "Beautiful garden in Gapyeong"),
        ("COEX Aquarium", "https://www.coexaqua.com/en", "Gangnam's aquarium attraction"),
    ],
    "Travel Services": [
        ("Discover Seoul Pass", "https://www.discoverseoulpass.com", "All-in-one tourist attraction pass"),
        ("WOWPASS", "https://www.wowpass.io/?lang=en", "Tourist payment and exchange card"),
        ("Trazy", "https://www.trazy.com", "Korea travel booking platform"),
        ("Klook Korea", "https://www.klook.com/en-US/destinations/south-korea", "Activity and tour booking"),
        ("Lonely Planet Korea", "https://www.lonelyplanet.com/south-korea", "Travel guide and recommendations"),
        ("TripAdvisor South Korea", "https://www.tripadvisor.com/Tourism-g294196-South_Korea-Vacations.html", "Travel reviews and rankings"),
        ("TimeOut Seoul", "https://www.timeout.com/seoul", "City guide for events and dining"),
    ],
}

K_CULTURE = {
    "Major Cultural Institutions": [
        ("Korea.net (Official Hub)", "https://www.korea.net", "Government cultural promotion portal"),
        ("Korea Foundation", "https://www.kf.or.kr", "Public diplomacy and Korean studies support"),
        ("Academy of Korean Studies", "https://www.aks.ac.kr/index.do", "Korean studies research center"),
        ("National Museum of Korea", "https://www.museum.go.kr/site/eng/home", "National museum digital archive"),
        ("Korea Heritage Service", "https://english.khs.go.kr", "Heritage sites and palace information"),
        ("King Sejong Institute", "https://www.ksif.or.kr/eng", "Korean language education worldwide"),
        ("National Library of Korea", "https://www.nl.go.kr/english", "National digital archive and library"),
        ("Arts Council Korea", "https://www.arko.or.kr/eng", "Arts funding and international exchange"),
        ("KOCCA (Content Agency)", "https://www.kocca.kr/en", "Games, animation, and content industry"),
        ("K-Heritage TV", "https://www.k-heritage.tv", "Korean heritage video archive"),
    ],
    "Entertainment & K-Pop": [
        ("HYBE Official", "https://www.hybecorp.com/eng", "BTS, NewJeans parent company"),
        ("SM Entertainment", "https://www.smentertainment.com", "EXO, aespa, NCT agency"),
        ("JYP Entertainment", "https://www.jype.com", "TWICE, Stray Kids agency"),
        ("YG Entertainment", "https://www.ygfamily.com", "BLACKPINK, BIGBANG agency"),
        ("CJ ENM", "https://www.cjenm.com/en", "Global entertainment and media conglomerate"),
        ("Studio Dragon", "https://www.studiodragon.net/en", "Major K-Drama production company"),
        ("Kakao Entertainment", "https://www.kakaoent.com/en", "Content platform and entertainment"),
        ("Weverse (Fan Platform)", "https://weverse.io", "Global K-Pop fan community platform"),
        ("Mnet Plus", "https://www.mnetplus.world", "K-Pop audition and music show platform"),
        ("Circle Chart (Gaon)", "https://circlechart.kr", "Official Korean music chart"),
        ("Hanteo Global", "https://www.hanteochart.com", "Real-time album sales chart"),
        ("Soompi", "https://www.soompi.com", "Major K-Pop and K-Drama news site"),
        ("Allkpop", "https://www.allkpop.com", "K-Pop news and community"),
        ("Koreaboo", "https://www.koreaboo.com", "K-Pop and Korean culture news"),
    ],
    "Museums & Arts": [
        ("National Folk Museum", "https://www.nfm.go.kr/english", "Korean traditional lifestyle museum"),
        ("MMCA (Contemporary Art)", "https://www.mmca.go.kr/eng", "National Museum of Modern and Contemporary Art"),
        ("National Palace Museum", "https://www.gogung.go.kr/en", "Joseon royal treasures and culture"),
        ("Seoul Museum of Art (SeMA)", "https://sema.seoul.go.kr/en", "Seoul city contemporary art museum"),
        ("Leeum Samsung Museum", "https://www.leeum.org/en", "Samsung-founded art museum"),
        ("Seoul Arts Center", "https://www.sac.or.kr/site/eng/home", "Major performing arts venue"),
        ("Sejong Center", "https://www.sejongpac.or.kr/en", "Gwanghwamun performing arts center"),
        ("National Theater of Korea", "https://www.ntok.go.kr/en", "National performing arts theater"),
        ("National Gugak Center", "https://www.gugak.go.kr/eng", "Traditional Korean music center"),
        ("Dongdaemun Design Plaza (DDP)", "https://ddp.or.kr/index.html", "Zaha Hadid-designed cultural hub"),
        ("Lotte Concert Hall", "https://www.lotteconcerthall.com/eng", "World-class concert venue"),
        ("National Hangeul Museum", "https://www.hangeul.go.kr/eng", "Korean alphabet museum"),
    ],
    "Heritage Sites": [
        ("UNESCO World Heritage Korea", "https://heritage.unesco.or.kr", "UNESCO designated sites in Korea"),
        ("Hwaseong Fortress (Suwon)", "https://www.swcf.or.kr/english", "UNESCO World Heritage fortress"),
        ("Hahoe Folk Village", "http://www.hahoe.or.kr/english", "UNESCO traditional village in Andong"),
        ("Bulguksa Temple", "http://www.bulguksa.or.kr", "UNESCO Buddhist temple in Gyeongju"),
        ("Haeinsa Temple", "http://www.haeinsa.or.kr", "Home of Tripitaka Koreana woodblocks"),
    ],
    "Language & Education": [
        ("Talk To Me In Korean (TTMIK)", "https://talktomeinkorean.com", "Most popular Korean learning platform"),
        ("KoreanClass101", "https://www.koreanclass101.com", "Audio/video Korean lessons"),
        ("Study in Korea (NIIED)", "https://www.studyinkorea.go.kr", "Government study abroad portal"),
        ("TOPIK Official", "https://www.topik.go.kr", "Korean proficiency test information"),
        ("Sogang Korean Language", "https://klec.sogang.ac.kr", "University Korean language program"),
        ("Yonsei Korean Language Institute", "https://www.yskli.com", "Premier Korean language institute"),
        ("Duolingo Korean", "https://www.duolingo.com/course/ko/en/Learn-Korean", "Free Korean learning app"),
    ],
    "Film & Literature": [
        ("KOFIC (Korean Film Council)", "https://www.koreanfilm.or.kr", "Korean film industry authority"),
        ("KOFA (Korean Film Archive)", "https://www.kofa.or.kr/eng", "Korean film preservation and archive"),
        ("LTI Korea (Literature Translation)", "https://www.ltikorea.or.kr/en", "Korean literature overseas translation"),
        ("BIFF (Busan Film Festival)", "https://www.biff.kr/eng", "Asia's largest film festival"),
        ("BIFAN (Bucheon Fantastic Film Festival)", "https://www.bifan.kr/eng", "Genre and fantastic film festival"),
        ("HanCinema", "https://www.hancinema.net", "Korean movie and drama database"),
        ("Viki", "https://www.viki.com", "K-Drama streaming platform"),
        ("Kocowa", "https://www.kocowa.com", "Korean content streaming service"),
    ],
    "Cultural Centers & Webtoons": [
        ("Korean Cultural Center NY", "https://www.koreanculture.org", "NYC Korean culture promotion"),
        ("Korean Cultural Center London", "https://london.korean-culture.org", "London Korean culture center"),
        ("Korea Society (New York)", "https://www.koreasociety.org", "Korea-US cultural exchange"),
        ("Naver Webtoon", "https://www.webtoons.com/en", "World's largest webtoon platform"),
        ("Tapas (Kakao Webtoon)", "https://tapas.io", "Webtoon and web novel platform"),
        ("Tappytoon", "https://www.tappytoon.com", "Premium Korean webtoon translations"),
        ("Museum Kimchikan", "https://www.kimchikan.com/en", "Kimchi culture museum in Seoul"),
    ],
}

LIVING_IN_KOREA = {
    "Government & Immigration": [
        ("Hi Korea (Main Portal)", "https://www.hikorea.go.kr", "Main portal for foreign residents, visa booking"),
        ("Korea Immigration Service", "https://www.immigration.go.kr/immigration_eng", "Immigration policy and procedures"),
        ("Gov.kr (For Foreigners)", "https://www.gov.kr/portal/forForeignerGuidance", "Central government services portal"),
        ("NHIS (Health Insurance)", "https://www.nhis.or.kr/english", "National health insurance enrollment and benefits"),
        ("NPS (National Pension)", "https://www.nps.or.kr/jsppage/english/main.jsp", "Pension contributions and lump-sum refunds"),
        ("National Tax Service (Hometax)", "https://www.nts.go.kr/english/main.do", "Tax filing and year-end settlement"),
        ("Korea Customs Service", "https://www.customs.go.kr/english/main.do", "Import/export and customs regulations"),
        ("Consumer Agency Korea", "https://www.kca.go.kr/eng", "Consumer protection and dispute resolution"),
        ("Cyber Police Agency", "https://www.police.go.kr/eng", "Crime reporting and certificates"),
        ("Safe Korea (Disaster)", "https://www.safekorea.go.kr", "Emergency alerts and disaster information"),
    ],
    "Foreign Resident Support": [
        ("Seoul Global Center", "https://global.seoul.go.kr", "Legal, business, and living support for foreigners in Seoul"),
        ("Danuri (Multicultural Families)", "https://www.liveinkorea.kr/portal/main/intro.do", "Multicultural family integration support"),
        ("Busan Global City Foundation", "https://www.bfic.kr/new/english", "Busan foreign resident support"),
        ("Incheon Global Center", "https://www.incheon.go.kr/en/EN050101", "Incheon foreign resident services"),
        ("Support Center for Foreign Workers", "http://www.migrantok.org/english", "Labor rights and consultation for foreign workers"),
    ],
    "Banking & Finance": [
        ("Hana Bank (Global)", "https://www.kebhana.com/easyone_index_en.html", "Foreign resident banking with global centers"),
        ("Shinhan Bank (Global)", "https://www.shinhan.com/en", "SOL Global app, multilingual support"),
        ("KB Kookmin Bank (Global)", "https://omoney.kbstar.com/quics?page=C034894", "KB Welcome account for foreigners"),
        ("Woori Bank (Global)", "https://spib.wooribank.com/pib/Dream?withyou=ENENG0688", "Foreign resident dedicated app"),
        ("IBK Industrial Bank", "https://www.ibk.co.kr/en/main.do", "Worker remittance specialist"),
        ("Wise (Korea Transfer)", "https://wise.com/gb/blog/banks-in-south-korea", "International money transfer guide"),
        ("SentBe (Remittance)", "https://www.sentbe.com/en", "Korea-based expat remittance service"),
        ("WireBarley (Remittance)", "https://www.wirebarley.com", "Low-fee international transfer"),
    ],
    "Communication & Utilities": [
        ("KT Global Store", "https://roaming.kt.com", "Foreigner SIM cards and WiFi rental"),
        ("SK Telecom (Global)", "https://www.sktelecom.com/index_en.html", "Korea's #1 mobile carrier"),
        ("LG U+ (Global)", "https://www.lguplus.com/en", "Mobile and internet services"),
        ("K-water (Water)", "https://www.kwater.or.kr/eng", "Water utility services"),
        ("KEPCO (Electricity)", "https://www.kepco.co.kr/eng", "Electricity provider and billing"),
        ("Korea Post (EMS)", "https://www.epost.go.kr/main.retrieveMainEngPage.comm", "International mail and parcel service"),
        ("KakaoTalk", "https://www.kakaocorp.com/page/service/service/KakaoTalk", "Korea's essential messaging app"),
        ("Seoul Metro English", "http://www.seoulmetro.co.kr/en", "Subway maps and lost items"),
        ("Air Korea (Air Quality)", "https://www.airkorea.or.kr/eng", "Real-time air pollution monitoring"),
        ("Korea Meteorological Admin", "https://web.kma.go.kr/eng", "Weather forecasts and warnings"),
    ],
    "Employment & Jobs": [
        ("EPS (Employment Permit System)", "https://www.eps.go.kr", "Foreign worker employment permits"),
        ("Worknet (Official Jobs)", "https://www.work.go.kr", "Government job search portal"),
        ("EPIK (English Teaching)", "https://www.epik.go.kr", "Government English teaching program"),
        ("TaLK (Teach and Learn)", "https://www.talk.go.kr", "Rural area English teaching program"),
        ("CONTACT KOREA (KOTRA)", "https://www.kotra.or.kr/english", "Professional job matching for foreigners"),
    ],
    "Education": [
        ("Seoul Foreign School", "https://www.seoulforeign.org", "Oldest international school in Seoul"),
        ("Yongsan International School", "https://www.yiseoul.org", "Diverse international school in Hannam-dong"),
        ("Dwight School Seoul", "https://www.dwight.or.kr", "IB curriculum international school"),
        ("Dulwich College Seoul", "https://seoul.dulwich.org", "British curriculum school in Banpo"),
        ("Korea International School", "https://www.kis.or.kr", "Major international school"),
        ("Chadwick International (Songdo)", "https://www.chadwickinternational.org", "Large-campus American school"),
        ("NLCS Jeju", "https://www.nlcsjeju.kr", "British school in Jeju English village"),
        ("Branksome Hall Asia", "https://www.branksome.asia", "IB World School in Jeju"),
        ("Seoul National University", "https://en.snu.ac.kr", "Korea's top university"),
        ("KAIST", "https://www.kaist.ac.kr/en", "Korea's top science and technology university"),
        ("Yonsei University", "https://www.yonsei.ac.kr/en_sc", "Major private university"),
        ("Korea University", "https://www.korea.ac.kr/mbshome/mbs/en", "Major private university"),
        ("Sungkyunkwan University", "https://www.skku.edu/eng", "Historic university, Samsung-affiliated"),
    ],
    "Housing": [
        ("LH (Korea Land & Housing)", "https://www.lh.or.kr/eng", "Public housing corporation"),
        ("Seoul Homes", "https://seoulhomes.kr", "Expat housing search service"),
        ("ZigBang", "https://www.zigbang.com", "Major real estate search app"),
        ("Dabang", "https://www.dabangapp.com", "Popular room search platform"),
    ],
    "News & Community": [
        ("Arirang TV", "https://www.arirang.com", "24-hour English Korean broadcast"),
        ("KBS World", "https://world.kbs.co.kr/english", "Public broadcaster English service"),
        ("Yonhap News Agency", "https://en.yna.co.kr", "Korea's national news agency"),
        ("The Korea Herald", "https://www.koreaherald.com", "Major English-language newspaper"),
        ("The Korea Times", "https://www.koreatimes.co.kr", "Oldest English newspaper in Korea"),
        ("JoongAng Daily", "https://koreajoongangdaily.joins.com", "English edition of major daily"),
        ("Korea4Expats", "https://www.korea4expats.com", "Expat community and living guide"),
        ("Reddit r/korea", "https://www.reddit.com/r/korea", "Active Korea expat community"),
    ],
}

FOOD_DINING = {
    "Government & Organizations": [
        ("Hansik Promotion Institute", "https://www.hansik.or.kr/eng", "Korean cuisine globalization and promotion"),
        ("MAFRA (Agriculture Ministry)", "https://www.mafra.go.kr/english", "Agricultural and food policy"),
        ("K-Agro Trade (aT Center)", "https://www.at.or.kr/en", "Korean agro-food export support"),
        ("MFDS (Food Safety)", "https://www.mfds.go.kr/eng", "Food safety regulations and standards"),
        ("Korea Food Research Institute", "https://www.kfri.re.kr/eng", "Food science and functional food research"),
        ("K-Food Guide (VisitKorea)", "https://english.visitkorea.or.kr", "KTO food and restaurant theme guide"),
    ],
    "Major Food Companies": [
        ("CJ CheilJedang (Bibigo)", "https://www.cj.co.kr/en/brands/bibigo", "Global Korean food brand, dumplings and kimchi"),
        ("Nongshim (Shin Ramyun)", "http://eng.nongshim.com", "Korea's top instant noodle maker"),
        ("Ottogi", "https://www.ottogi.co.kr/en", "Curry, ramen, and sauce manufacturer"),
        ("Samyang Foods (Buldak)", "https://www.samyangfoods.com/eng", "Buldak hot chicken ramen brand"),
        ("Lotte Wellfood", "https://www.lottewellfood.com/en", "Confectionery and frozen food"),
        ("Pulmuone Global", "https://www.pulmuone.co.kr/en/main/Index.do", "Tofu, fresh noodles, health food"),
        ("Daesang (Jongga/Chungjungone)", "https://www.daesang.com/en", "Kimchi and fermented food leader"),
        ("Orion Global", "http://www.orionworld.com/en", "Choco Pie and snack brand"),
        ("SPC Group (Paris Baguette)", "https://www.spc.co.kr/en", "Bakery and cafe chain operator"),
        ("Dongwon F&B", "https://www.dongwon.com/en/business/food", "Tuna and seafood products"),
        ("Binggrae", "http://www.bing.co.kr/en", "Banana milk and Melona maker"),
        ("HiteJinro (Soju)", "https://www.hitejinro.com/en", "Korea's leading soju brand"),
        ("Korea Ginseng Corp (CheongKwanJang)", "https://www.kgc.co.kr/en", "Premium Korean red ginseng"),
    ],
    "Restaurant Guides & Delivery": [
        ("Michelin Guide Seoul", "https://guide.michelin.com/en/kr/city-seoul/restaurants", "Michelin rated restaurants in Seoul"),
        ("Michelin Guide Busan", "https://guide.michelin.com/en/kr/city-busan/restaurants", "Michelin rated restaurants in Busan"),
        ("CatchTable", "https://m.catchtable.net", "Restaurant reservation platform"),
        ("DiningCode", "https://www.diningcode.com", "Big-data restaurant rankings"),
        ("HappyCow Seoul (Vegan)", "https://www.happycow.net/asia/south_korea/seoul", "Vegan and vegetarian restaurant finder"),
        ("Shuttle Delivery", "https://www.shuttledelivery.co.kr/en", "English food delivery for expats"),
        ("Coupang Eats", "https://www.coupangeats.com", "Major food delivery platform"),
    ],
    "Restaurant Chains": [
        ("Paris Baguette (Global)", "https://parisbaguette.com", "Korea's largest bakery chain"),
        ("Genesis BBQ Global", "https://bbq.co.kr/en", "Major Korean fried chicken chain"),
        ("Kyochon Chicken Global", "https://www.kyochon.com/en", "Premium fried chicken brand"),
        ("Mom's Touch", "https://momstouch.co.kr/en", "Popular chicken burger chain"),
    ],
    "Recipes & Cooking": [
        ("Maangchi", "https://www.maangchi.com", "World's most popular Korean recipe site"),
        ("My Korean Kitchen", "https://mykoreankitchen.com", "Home-style Korean cooking blog"),
        ("Korean Bapsang", "https://www.koreanbapsang.com", "Traditional Korean recipe collection"),
        ("O'ngo Food Communications", "https://ongofood.com", "Seoul food tours and cooking classes"),
    ],
    "Traditional Drinks & Tea": [
        ("Korea Sool (Traditional Spirits)", "https://www.thesool.com/eng", "Traditional Korean liquor gallery and tasting"),
        ("O'sulloc (Jeju Tea)", "https://www.osulloc.com/kr/en", "Premium Jeju green tea brand and museum"),
    ],
    "Market & Regional Food Guides": [
        ("Temple Food Official", "https://eng.koreatemplefood.com", "Buddhist temple cuisine guide"),
        ("Gwangjang Market", "https://www.kwangjangmarket.or.kr/en", "Seoul's famous traditional food market"),
        ("Noryangjin Fish Market", "http://www.susansijang.co.kr/en", "Seoul's largest seafood market"),
        ("Jeju Food Guide", "https://www.visitjeju.net/en/taste", "Jeju island food and restaurants"),
        ("Busan Seafood Guide", "https://www.visitbusan.net/en/index.do", "Busan's famous seafood restaurants"),
        ("Jeonju Bibimbap Guide", "https://tour.jeonju.go.kr/eng", "Jeonju food capital information"),
    ],
}

SHOPPING_KBEAUTY = {
    "Beauty Platforms": [
        ("Olive Young Global", "https://global.oliveyoung.com", "Korea's #1 health and beauty retailer"),
        ("StyleKorean", "https://www.stylekorean.com", "Curated K-beauty global e-commerce"),
        ("YesStyle (K-Beauty)", "https://www.yesstyle.com/en/k-beauty", "K-Beauty and fashion multi-shop"),
        ("Soko Glam", "https://sokoglam.com", "Expert-curated K-beauty products"),
        ("Wishtrend", "https://www.wishtrend.com", "Ingredient-focused skincare platform"),
        ("Jolse", "https://jolse.com", "Budget-friendly K-beauty with samples"),
        ("Stylevana", "https://www.stylevana.com", "Asian beauty and fashion retailer"),
    ],
    "Prestige & Luxury Brands": [
        ("Amorepacific Global", "https://www.amorepacific.com/int/en", "Korea's largest beauty conglomerate"),
        ("Sulwhasoo", "https://www.sulwhasoo.com/int/en", "Premium Korean herbal skincare"),
        ("Laneige", "https://www.laneige.com/int/en", "Water science and hydration expert"),
        ("IOPE", "https://www.iope.com/int/en", "Cushion foundation pioneer, retinol research"),
        ("The History of Whoo", "https://www.whoo.co.kr/en", "Royal Korean luxury skincare"),
        ("Hera", "https://www.hera.com/int/en", "Contemporary Seoul luxury makeup"),
        ("Belif Global", "https://www.belifcosmetic.com/en", "Herbal skincare, famous bomb cream"),
    ],
    "Popular Brands": [
        ("Innisfree", "https://www.innisfree.com/int/en", "Jeju-inspired natural skincare"),
        ("Etude House", "https://www.etude.com/int/en", "Playful makeup for young generation"),
        ("Missha Global", "https://www.missha.com", "Affordable high-performance skincare"),
        ("Nature Republic", "https://www.naturerepublic.com/en", "Natural ingredient skincare"),
        ("Tonymoly", "https://www.tonymoly.com/en", "Creative packaging and fruit-based products"),
        ("Banila Co", "https://www.banila.com/en", "Famous Clean It Zero cleansing balm"),
        ("Clio Professional", "https://clubclio.shop", "Professional makeup for consumers"),
        ("Skinfood", "https://theskinfood.us", "Food-ingredient based skincare"),
    ],
    "Indie & Derma Brands": [
        ("COSRX", "https://www.cosrx.com", "Minimalist problem-skin solutions, global favorite"),
        ("Dr. Jart+", "https://www.drjart.com", "Derma-tech brand, Cica and Ceramidin lines"),
        ("Beauty of Joseon", "https://beautyofjoseon.com", "Modern hanbang, viral Rice sunscreen"),
        ("Round Lab", "https://roundlab.com", "Dokdo Toner and minimal beauty"),
        ("Anua", "https://anua.us", "Heartleaf toner, Olive Young bestseller"),
        ("Rom&nd", "https://romand.us", "Gen-Z favorite lip tints and makeup"),
        ("Mediheal", "https://medihealus.com", "Sheet mask pioneer brand"),
        ("Some By Mi", "https://www.somebymi.com/en", "AHA/BHA/PHA miracle line"),
        ("Dear, Klairs", "https://www.klairscosmetics.com", "Gentle sensitive skin specialist"),
        ("Neogen", "https://www.neogenlab.com", "Bio-peel and dermalogy products"),
        ("Medicube", "https://medicube.us", "At-home device and skincare brand"),
        ("Isntree", "https://isntree.com", "Hyaluronic acid and sun care specialist"),
    ],
    "Fashion Platforms": [
        ("Musinsa Global", "https://global.musinsa.com", "Korea's #1 online fashion platform"),
        ("W Concept (Global)", "https://us.wconcept.com", "Korean designer fashion platform"),
        ("Gentle Monster", "https://www.gentlemonster.com/en", "Iconic Korean eyewear brand"),
        ("Tamburins", "https://www.tamburins.com/en", "Artistic fragrance and hand cream brand"),
        ("Nonfiction", "https://nonfiction-beauty.com", "Premium fragrance lifestyle brand"),
        ("ADER Error", "https://en.adererror.com", "Experimental Korean streetwear"),
        ("Andersson Bell", "https://en.anderssonbell.com", "Gender-neutral Korean fashion brand"),
        ("Thisisneverthat", "https://thisisneverthat.com", "Korean streetwear staple"),
        ("Kooding", "https://www.kooding.com", "Korean fashion for international shoppers"),
    ],
    "Department Stores & Marts": [
        ("Lotte Department Store", "https://www.lotteshopping.com/en/main", "Korea's largest department store chain"),
        ("Shinsegae Department Store", "https://www.shinsegae.com/en/index.do", "High-end luxury shopping"),
        ("Hyundai Department Store", "https://www.ehyundai.com/en/index.do", "Innovative retail, The Hyundai Seoul"),
        ("Daiso Korea", "https://www.daiso.co.kr", "Budget lifestyle and variety store"),
    ],
    "Duty Free": [
        ("Lotte Duty Free", "https://eng.lottedfs.com", "Major airport and downtown duty free"),
        ("Shilla Duty Free", "https://www.shilladfs.com/en", "Samsung-affiliated premium duty free"),
        ("Shinsegae Duty Free", "https://www.ssgdf.com/en", "High-end duty free experience"),
        ("Incheon Airport Duty Free", "https://www.airport.kr/ap/en", "Airport duty free shopping info"),
    ],
    "Online Shopping": [
        ("Gmarket Global", "https://global.gmarket.co.kr", "Major Korean online marketplace"),
        ("Coupang", "https://www.coupang.com", "Korea's largest e-commerce, rocket delivery"),
        ("K-Pop Town", "https://www.kpoptown.com", "K-Pop albums and merchandise"),
        ("Ktown4u", "https://www.ktown4u.com", "K-Pop albums with chart counting"),
        ("Yes24 Global", "https://global.yes24.com", "Books, music, and tickets platform"),
    ],
}

def build_db():
    """구조화된 JSON DB 생성"""
    db = {
        "_meta": {
            "version": "1.0",
            "total_sources": 0,
            "last_updated": "2026-02-07",
            "description": "Curated authoritative English-language sources for Korea Experience blog, organized by category and subcategory. Collected via Deep Search from official government, corporate, and major platform sites."
        },
        "categories": {}
    }

    all_categories = {
        "Medical Tourism": MEDICAL_TOURISM,
        "Travel & Tourism": TRAVEL_TOURISM,
        "K-Culture": K_CULTURE,
        "Living in Korea": LIVING_IN_KOREA,
        "Food & Dining": FOOD_DINING,
        "Shopping & K-Beauty": SHOPPING_KBEAUTY,
    }

    total = 0
    for cat_name, subcats in all_categories.items():
        cat_data = {"subcategories": {}, "total": 0}
        for subcat_name, sources in subcats.items():
            cat_data["subcategories"][subcat_name] = [
                {"name": name, "url": url, "description": desc}
                for name, url, desc in sources
            ]
            cat_data["total"] += len(sources)
        total += cat_data["total"]
        db["categories"][cat_name] = cat_data

    db["_meta"]["total_sources"] = total

    # 카테고리별 통계 출력
    print(f"\n{'='*60}")
    print(f"📊 Sources DB 생성 완료")
    print(f"{'='*60}")
    for cat_name, cat_data in db["categories"].items():
        subcat_detail = ", ".join(f"{k}({len(v)})" for k, v in cat_data["subcategories"].items())
        print(f"\n  📂 {cat_name}: {cat_data['total']}개")
        print(f"     {subcat_detail}")
    print(f"\n  📌 TOTAL: {total}개 소스")

    return db

def main():
    import os
    db = build_db()
    
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sources-db.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2, ensure_ascii=False)
    
    print(f"\n  💾 저장: {output_path}")
    print(f"  📏 파일 크기: {os.path.getsize(output_path) / 1024:.1f} KB")

if __name__ == "__main__":
    main()
