"""
Deep Dive 문서에 내부 링크를 자동 삽입하는 스크립트
- 각 문서에 관련성 높은 포스트 3-5개를 자연스럽게 링크
- 키워드 매칭으로 적절한 위치를 찾아 삽입
"""
import os, re, glob, sys
sys.stdout.reconfigure(encoding='utf-8')

DEEP_DIR = r'c:\kc\korea-experience\content\deep-dive'
POSTS_DIR = r'c:\kc\korea-experience\content\posts'

# ========== 1. Build post index ==========
post_index = {}
for f in glob.glob(os.path.join(POSTS_DIR, '*.md')):
    slug = os.path.basename(f).replace('.md', '')
    if slug.endswith('.bak'): continue
    try:
        head = open(f, encoding='utf-8-sig').read()[:600]
    except:
        try: head = open(f, encoding='cp949').read()[:600]
        except: continue
    tm = re.search(r'^title:\s*"?([^"\n]+)"?', head, re.M)
    cm = re.search(r'^category:\s*(.+)$', head, re.M)
    title = tm.group(1).strip() if tm else slug
    cat = cm.group(1).strip() if cm else ''
    post_index[slug] = {'title': title, 'category': cat}

post_slugs = set(post_index.keys())

# ========== 2. Define link insertions per deep dive ==========
# Format: deep_dive_slug -> list of (target_slug, search_keywords, anchor_text, link_sentence)
# link_sentence uses {link} placeholder where the markdown link goes

LINK_MAP = {
    'catchtable-global-michelin-reservation-guide-2026': [
        ('michelin-star-korean-restaurants-seoul-2026',
         ['michelin', 'star', 'restaurant'],
         'Michelin star restaurants in Seoul',
         'For a broader look at award-winning dining, see our guide to {link}.'),
        ('affordable-fine-dining-5-michelin-starred-lunch-menus-in-seoul-for-under-50',
         ['lunch', 'affordable', 'budget', 'price'],
         'affordable Michelin-starred lunch menus under $50',
         'If you are watching your budget, explore our list of {link}.'),
        ('late-night-dining-24-hour-restaurants-in-seoul',
         ['dinner', 'late', 'night', 'evening'],
         'late night dining options in Seoul',
         'For after-hours dining, check out our guide to {link}.'),
    ],
    'dmz-visit-guide-2026': [
        ('dmz-tour-from-seoul-complete-guide-and-what-to-expect-2026',
         ['tour', 'book', 'ticket', 'registration'],
         'booking a DMZ tour from Seoul',
         'For booking details and tour comparisons, see our complete guide to {link}.'),
        ('exploring-korea-dmz-jsa-vs-tunnel-tours-which-is-better-2026',
         ['jsa', 'tunnel', 'panmunjom', 'joint security'],
         'JSA vs tunnel tour comparison',
         'Not sure which tour type to choose? Read our {link}.'),
        ('best-day-trips-from-seoul-2026',
         ['day trip', 'seoul', 'outside'],
         'best day trips from Seoul',
         'The DMZ is just one option. Explore other {link} for more ideas.'),
    ],
    'exosome-therapy-seoul-guide-2026': [
        ('korean-skin-care-treatments-what-clinics-offer',
         ['skin', 'treatment', 'clinic', 'procedure'],
         'Korean skin care treatments available at clinics',
         'For a full overview of procedures, see our guide to {link}.'),
        ('best-korean-skin-clinics-in-gangnam-2026',
         ['gangnam', 'clinic', 'dermatology'],
         'best skin clinics in Gangnam',
         'Looking for a clinic? Browse our curated list of {link}.'),
        ('anti-aging-treatments-in-korea-botox-fillers-and-more-2026',
         ['anti-aging', 'botox', 'filler', 'collagen', 'rejuvenation'],
         'anti-aging treatments in Korea including Botox and fillers',
         'Exosomes are just one part of the anti-aging landscape. Learn about {link}.'),
    ],
    'halal-dining-itaewon-2026': [
        ('halal-korean-food-muslim-friendly-restaurants',
         ['halal', 'muslim', 'certified'],
         'halal Korean food and Muslim-friendly restaurants',
         'For a nationwide perspective, see our complete guide to {link}.'),
        ('finding-halal-food-in-seoul-top-restaurants-and-supermarkets-2026',
         ['supermarket', 'grocery', 'ingredients', 'cook'],
         'finding halal food in Seoul including supermarkets',
         'Need halal groceries too? Check our guide to {link}.'),
        ('halal-medical-tourism-finding-muslim-friendly-clinics',
         ['medical', 'hospital', 'health'],
         'halal medical tourism and Muslim-friendly clinics',
         'Combining your trip with healthcare? Read about {link}.'),
    ],
    'incheon-airport-survival-guide-2026': [
        ('airport-limousine-bus-vs-arex-express-train',
         ['arex', 'limousine', 'bus', 'train', 'transport'],
         'AREX vs limousine bus for airport transfers',
         'For a detailed transport comparison, read our breakdown of {link}.'),
        ('seoul-transportation-guide-for-tourists-2026',
         ['subway', 'metro', 'transit', 'city'],
         'Seoul transportation for tourists',
         'Once you arrive in the city, our {link} guide covers everything.'),
        ('korea-travel-sim-cards-vs-esim-comparison',
         ['sim', 'esim', 'phone', 'data', 'wifi'],
         'Korea SIM cards vs eSIM options',
         'Before leaving the airport, pick up connectivity. Compare your {link} options.'),
    ],
    'jeju-car-rental-no-arc-2026': [
        ('jeju-island-complete-travel-guide-best-time-to-visit-2026',
         ['jeju', 'visit', 'travel', 'guide'],
         'complete Jeju Island travel guide',
         'For a full island overview, see our {link}.'),
        ('the-digital-nomad-guide-to-jeju-island-best-cafes-and-internet-speed-2026',
         ['cafe', 'work', 'remote', 'wifi', 'nomad'],
         'digital nomad guide to Jeju',
         'Working remotely from Jeju? Check our {link} for the best cafes and Wi-Fi.'),
        ('bicycle-rental-systems-seoul-busan-jeju',
         ['bicycle', 'bike', 'alternative', 'transport'],
         'bicycle rental systems including Jeju',
         'For car-free alternatives, explore our guide to {link}.'),
    ],
    'kiosk-card-rejection-guide-2026': [
        ('foreign-friendly-kiosk-survival-guide-what-to-do-when-your-overseas-credit-card-is-rejected',
         ['kiosk', 'rejected', 'declined', 'card'],
         'kiosk survival guide for foreign cards',
         'For step-by-step troubleshooting, see our detailed {link}.'),
        ('t-money-vs-wowpass-vs-namane-a-data-backed-comparison-of-the-best-tourist-cards-in-2026',
         ['wowpass', 'namane', 't-money', 'prepaid', 'tourist card'],
         'T-Money vs Wowpass vs Namane comparison',
         'A prepaid tourist card can solve most kiosk problems. Read our {link}.'),
        ('credit-cards-in-korea-which-banks-accept-foreigners',
         ['bank', 'credit card', 'debit', 'account'],
         'credit cards in Korea for foreigners',
         'For a long-term solution, see our guide to {link}.'),
    ],
    'korea-cherry-blossom-forecast-2026': [
        ('cherry-blossom-season-in-korea-when-and-where-2026',
         ['season', 'when', 'where', 'bloom'],
         'cherry blossom season in Korea',
         'For a broader seasonal overview, read our guide to {link}.'),
        ('spring-in-korea-cherry-blossoms-and-festivals',
         ['spring', 'festival', 'event'],
         'spring festivals in Korea beyond cherry blossoms',
         'Cherry blossoms are just the start. Discover other {link}.'),
        ('korea-s-flower-festivals-tulips-roses-and-cosmos',
         ['flower', 'tulip', 'rose', 'cosmos'],
         "Korea's other flower festivals including tulips and cosmos",
         "Love flowers? Don't miss {link} later in the year."),
    ],
    'korea-recycling-bunrisugeo-guide-2026': [
        ('recycling-rules-in-korea-sorting-and-penalties',
         ['sorting', 'penalty', 'fine', 'rules'],
         'recycling rules in Korea including sorting and penalties',
         'For the official rules and penalty structure, see our guide to {link}.'),
        ('korean-apartment-etiquette-what-neighbors-expect-2026',
         ['neighbor', 'apartment', 'noise', 'etiquette'],
         'Korean apartment etiquette',
         'Recycling is just one aspect of apartment life. Learn about {link}.'),
        ('finding-apartments-real-estate-apps-in-english',
         ['apartment', 'rent', 'housing', 'move'],
         'finding apartments with English-friendly real estate apps',
         'Still looking for a place? Start with our guide to {link}.'),
    ],
    'korea-social-rules-local-guide-2026': [
        ('korean-work-culture-office-etiquette-for-foreigners',
         ['work', 'office', 'business', 'colleague'],
         'Korean work culture and office etiquette',
         'If you are working in Korea, also read our guide to {link}.'),
        ('korean-etiquette-for-business-meetings-business-cards-and-bowing-2026',
         ['meeting', 'business card', 'bow', 'greeting'],
         'Korean business meeting etiquette',
         'For professional settings specifically, see our guide to {link}.'),
        ('korean-apartment-etiquette-what-neighbors-expect-2026',
         ['apartment', 'neighbor', 'noise', 'living'],
         'Korean apartment etiquette and what neighbors expect',
         'Living with Korean neighbors? Read about {link}.'),
    ],
    'korean-bowing-etiquette-2026': [
        ('korean-etiquette-for-business-meetings-business-cards-and-bowing-2026',
         ['business', 'meeting', 'card', 'professional'],
         'Korean business meeting etiquette including cards and bowing',
         'For the full business context, see our guide to {link}.'),
        ('korean-work-culture-office-etiquette-for-foreigners',
         ['office', 'work', 'colleague', 'workplace'],
         'Korean work culture and office etiquette',
         'Bowing extends into the workplace. Learn more about {link}.'),
        ('korean-drinking-culture-soju-makgeolli-and-pocha-guide-2026',
         ['drink', 'soju', 'social', 'gather'],
         'Korean drinking culture and etiquette',
         'Social bowing also appears in drinking settings. Explore our guide to {link}.'),
    ],
    'korean-drinking-etiquette-2026': [
        ('korean-drinking-culture-soju-makgeolli-and-pocha-guide-2026',
         ['soju', 'makgeolli', 'pocha', 'bar'],
         'Korean drinking culture with soju, makgeolli, and pocha',
         'For a deeper dive into the drinks themselves, see our guide to {link}.'),
        ('zero-sugar-soju-healthy-drinking-trends-korea-2026',
         ['zero', 'sugar', 'health', 'low calorie', 'diet'],
         'zero-sugar soju and healthy drinking trends',
         'Watching your calories? Read about the rise of {link}.'),
        ('best-korean-bbq-restaurants-in-seoul-2026',
         ['bbq', 'grill', 'meat', 'samgyeopsal', 'food'],
         'best Korean BBQ restaurants in Seoul',
         'Drinking and BBQ go hand in hand. Find the {link} for the perfect pairing.'),
    ],
    'korean-prayer-pose-etiquette-guide-2026': [
        ('korean-etiquette-for-business-meetings-business-cards-and-bowing-2026',
         ['business', 'bow', 'greeting', 'meeting'],
         'Korean business etiquette including bowing',
         'For proper greeting gestures in professional settings, see our guide to {link}.'),
        ('korean-work-culture-office-etiquette-for-foreigners',
         ['work', 'office', 'colleague', 'professional'],
         'Korean work culture for foreigners',
         'Gestures matter in the workplace too. Read about {link}.'),
        ('essential-korean-phrases-for-tourists-2026',
         ['phrase', 'word', 'language', 'speak', 'say'],
         'essential Korean phrases for tourists',
         'Pair the right gestures with the right words. Learn {link}.'),
    ],
    'korean-taxi-guide-no-arc-2026': [
        ('taxi-apps-in-korea-kakao-vs-uber-alternatives',
         ['kakao', 'uber', 'app', 'ride'],
         'Korean taxi apps including Kakao T and Uber alternatives',
         'For a full app-by-app breakdown, see our guide to {link}.'),
        ('how-to-call-a-taxi-in-korea-without-a-local-phone-number-kakao-t-alternatives-for-tourists',
         ['phone', 'number', 'tourist', 'foreigner', 'call'],
         'calling a taxi in Korea without a local phone number',
         'No Korean phone number? Read our specific guide to {link}.'),
        ('seoul-transportation-guide-for-tourists-2026',
         ['subway', 'bus', 'metro', 'transport'],
         'Seoul transportation for tourists',
         'Taxis are one piece of the puzzle. See our complete {link} guide.'),
    ],
    'kpop-fandom-economy-guide-2026': [
        ('k-pop-merchandise-shopping-myeongdong-vs-online',
         ['merchandise', 'merch', 'shop', 'buy', 'store'],
         'K-Pop merchandise shopping in Myeongdong vs online',
         'Ready to shop? Compare your options with our guide to {link}.'),
        ('how-to-get-k-pop-concert-tickets-ticketing-guide',
         ['ticket', 'concert', 'show', 'performance'],
         'getting K-Pop concert tickets',
         'Attending a live show? Read our guide to {link}.'),
        ('k-fandom-economy-where-to-find-limited-edition-goods-without-a-fan-club-membership',
         ['limited', 'edition', 'exclusive', 'fan club'],
         'finding limited-edition K-Pop goods without a fan club membership',
         'For rare finds, see our guide to {link}.'),
    ],
    'licensed-medical-coordinator-guide-2026': [
        ('korea-medical-tourism-visa-how-to-apply',
         ['visa', 'entry', 'passport', 'apply'],
         'applying for a Korea medical tourism visa',
         'Before booking a coordinator, secure your visa. See our guide to {link}.'),
        ('medical-tourism-package-deals-worth-it-or-tourist-trap',
         ['package', 'deal', 'agency', 'broker'],
         'whether medical tourism packages are worth it',
         'Wondering about all-in-one packages? Read our analysis of {link}.'),
        ('best-plastic-surgery-clinics-for-foreigners-in-seoul',
         ['clinic', 'surgery', 'plastic', 'hospital'],
         'best plastic surgery clinics for foreigners in Seoul',
         'Already have a coordinator? Browse our list of {link}.'),
    ],
    'medical-tourism-visa-c33-2026': [
        ('korea-medical-tourism-visa-how-to-apply',
         ['apply', 'application', 'document', 'submit'],
         'step-by-step Korea medical tourism visa application',
         'For a streamlined application walkthrough, see our {link} guide.'),
        ('best-plastic-surgery-clinics-for-foreigners-in-seoul',
         ['clinic', 'surgery', 'hospital', 'gangnam'],
         'best plastic surgery clinics for foreigners',
         'Once your visa is approved, browse our list of {link}.'),
        ('korean-medical-tourism-recovery-hotels-and-aftercare-guide-2026',
         ['recovery', 'hotel', 'aftercare', 'healing'],
         'medical tourism recovery hotels and aftercare',
         'Plan your recovery too. Read about {link}.'),
        ('halal-medical-tourism-finding-muslim-friendly-clinics',
         ['muslim', 'halal', 'religious'],
         'halal medical tourism and Muslim-friendly clinics in Korea',
         'Muslim travelers can find specialized support. See our guide to {link}.'),
    ],
    'michelin-seoul-lunch-under-50-2026': [
        ('michelin-star-korean-restaurants-seoul-2026',
         ['michelin', 'star', 'award', 'guide'],
         'Michelin star restaurants in Seoul',
         'For the full Michelin landscape, see our guide to {link}.'),
        ('affordable-fine-dining-5-michelin-starred-lunch-menus-in-seoul-for-under-50',
         ['affordable', 'lunch', 'menu', 'set'],
         'affordable Michelin-starred lunch menus in Seoul',
         'Want even more options? Browse our expanded list of {link}.'),
        ('best-korean-bbq-restaurants-in-seoul-2026',
         ['bbq', 'grill', 'meat', 'korean'],
         'best Korean BBQ restaurants in Seoul',
         'Prefer BBQ over fine dining? Check out our {link} guide.'),
    ],
    'namane-vs-wowpass-guide-2026': [
        ('t-money-vs-wowpass-vs-namane-a-data-backed-comparison-of-the-best-tourist-cards-in-2026',
         ['t-money', 'comparison', 'data', 'tourist card'],
         'data-backed T-Money vs Wowpass vs Namane comparison',
         'For a deeper data analysis, read our {link}.'),
        ('seoul-transportation-guide-for-tourists-2026',
         ['subway', 'bus', 'transport', 'metro'],
         'Seoul transportation guide for tourists',
         'These cards power your transit rides. See our complete {link}.'),
        ('korea-travel-sim-cards-vs-esim-comparison',
         ['sim', 'esim', 'phone', 'data'],
         'Korea SIM card vs eSIM comparison',
         'Pair your transit card with the right connectivity. Compare {link}.'),
    ],
    'olive-young-must-buys-2026': [
        ('olive-young-shopping-guide-must-buy-k-beauty-products',
         ['product', 'buy', 'best', 'recommend'],
         'Olive Young shopping guide with must-buy K-beauty products',
         'For a broader product selection, see our {link}.'),
        ('smart-shopping-at-olive-young-using-the-app-and-maximizing-sales-2026',
         ['app', 'sale', 'discount', 'coupon', 'save'],
         'smart shopping at Olive Young using the app',
         'Want to save more? Learn about {link} and maximizing sales.'),
        ('korean-beauty-store-comparison-olive-young-vs-lalavla',
         ['lalavla', 'chicor', 'alternative', 'compare'],
         'Olive Young vs Lalavla store comparison',
         'Considering alternatives? Read our {link}.'),
    ],
    'order-baemin-without-arc-2026': [
        ('korean-food-delivery-apps-coupang-eats-to-baemin-guide-2026',
         ['coupang', 'delivery', 'app', 'order'],
         'Korean food delivery apps from Coupang Eats to Baemin',
         'For a full app-by-app comparison, see our guide to {link}.'),
        ('how-to-order-food-in-korean-restaurants-phrases-guide-2026',
         ['restaurant', 'phrase', 'speak', 'order'],
         'ordering food in Korean restaurants with useful phrases',
         'Prefer eating out? Learn the essential phrases in our guide to {link}.'),
        ('50-must-try-korean-foods-complete-guide-2026',
         ['food', 'dish', 'try', 'taste'],
         '50 must-try Korean foods',
         'Not sure what to order? Browse our list of {link} for inspiration.'),
    ],
    'pdrn-salmon-dna-vs-juvelook-2026': [
        ('korean-skin-care-treatments-what-clinics-offer',
         ['treatment', 'procedure', 'clinic', 'skin'],
         'Korean skin care treatments at clinics',
         'For a broader treatment overview, see our guide to {link}.'),
        ('best-korean-skin-clinics-in-gangnam-2026',
         ['gangnam', 'clinic', 'dermatology', 'doctor'],
         'best skin clinics in Gangnam',
         'Looking for a trusted clinic? Browse our list of {link}.'),
        ('acne-scar-treatment-korea-best-options',
         ['scar', 'acne', 'texture', 'pore'],
         'acne scar treatment options in Korea',
         'PDRN and Juvelook are also used for scars. Read about {link}.'),
    ],
    'personal-color-analysis-hongdae-2026': [
        ('personal-color-analysis-in-seoul-is-it-worth-150-dollars-review-2026',
         ['worth', 'price', 'review', 'cost', 'value'],
         'whether personal color analysis in Seoul is worth $150',
         'Is it worth the investment? Read our honest review of {link}.'),
        ('hongdae-shopping-street-indie-brands-and-vintage',
         ['hongdae', 'indie', 'brand', 'vintage', 'shop'],
         'Hongdae shopping street with indie brands and vintage finds',
         'After your session, explore the {link} nearby.'),
        ('myeongdong-shopping-guide-beauty-and-fashion',
         ['myeongdong', 'beauty', 'fashion', 'cosmetic'],
         'Myeongdong shopping guide for beauty and fashion',
         'For mainstream K-beauty shopping, see our {link}.'),
    ],
    'seongsu-popup-guide-2026': [
        ('24-hours-in-seongsu-dong-luxury-dior-pop-up-vs-5-market-food-a-dualism-route',
         ['seongsu', 'dior', 'luxury', 'route', 'walk'],
         '24-hour Seongsu-dong itinerary from luxury pop-ups to street food',
         'Want a full day plan? Follow our {link}.'),
        ('best-coffee-shops-in-seoul-2026',
         ['coffee', 'cafe', 'latte', 'roast'],
         'best coffee shops in Seoul',
         'Seongsu is a cafe paradise. Discover more of the {link}.'),
        ('shopping-at-the-hyundai-seoul-a-guide-to-korea-coolest-mall-2026',
         ['hyundai', 'mall', 'shopping', 'trendy'],
         "shopping at The Hyundai Seoul, Korea's coolest mall",
         'For another trendy shopping destination, check out our guide to {link}.'),
    ],
    'seoul-street-food-prices-2026': [
        ('korean-street-food-guide-30-foods-to-try-2026',
         ['tteokbokki', 'hotteok', 'food', 'snack', 'try'],
         '30 Korean street foods you must try',
         'Not sure what to eat? Start with our list of {link}.'),
        ('exploring-korea-traditional-market-street-food-tours-2026',
         ['market', 'tour', 'gwangjang', 'namdaemun'],
         'traditional market street food tours',
         'For guided market experiences, see our guide to {link}.'),
        ('seoul-food-markets-guide-gwangjang-to-noryangjin-2026',
         ['gwangjang', 'noryangjin', 'seafood', 'market'],
         "Seoul's food markets from Gwangjang to Noryangjin",
         'Prefer a sit-down market meal? Explore our guide to {link}.'),
    ],
    'seoul-transit-climate-card-vs-tmoney-2026': [
        ('t-money-vs-wowpass-vs-namane-a-data-backed-comparison-of-the-best-tourist-cards-in-2026',
         ['wowpass', 'namane', 'tourist', 'compare'],
         'T-Money vs Wowpass vs Namane tourist card comparison',
         'For a tourist-focused comparison, read our {link}.'),
        ('seoul-transportation-guide-for-tourists-2026',
         ['subway', 'bus', 'route', 'transport'],
         'Seoul transportation guide for tourists',
         'Pair your card choice with our complete {link}.'),
        ('airport-limousine-bus-vs-arex-express-train',
         ['airport', 'arex', 'limousine', 'incheon'],
         'AREX vs airport limousine bus comparison',
         'Both cards work on airport routes. See our {link}.'),
    ],
    'smile-pro-vs-lasik-seoul-2026': [
        ('smile-pro-eye-surgery-the-2026-tech-upgrade-from-lasik-2026',
         ['smile', 'pro', 'upgrade', 'technology'],
         'SMILE Pro eye surgery as a 2026 tech upgrade from LASIK',
         'For the technology deep-dive, read our guide to {link}.'),
        ('lasik-and-lasek-eye-surgery-in-korea-complete-guide-2026',
         ['lasik', 'lasek', 'eye', 'complete'],
         'complete LASIK and LASEK eye surgery guide for Korea',
         'Want the full picture? See our {link}.'),
        ('best-plastic-surgery-clinics-for-foreigners-in-seoul',
         ['clinic', 'foreigner', 'hospital', 'surgery'],
         'best surgery clinics for foreigners in Seoul',
         'Looking for a clinic? Browse our list of {link}.'),
    ],
    'tax-refund-instant-vs-airport-2026': [
        ('tax-refund-for-tourists-how-to-claim',
         ['claim', 'refund', 'process', 'how'],
         'how to claim your Korea tax refund as a tourist',
         'For step-by-step instructions, see our guide on {link}.'),
        ('duty-free-shopping-in-korea-complete-guide-2026',
         ['duty', 'free', 'shop', 'store'],
         'duty-free shopping in Korea',
         'Tax refunds and duty-free are different strategies. Compare with our {link} guide.'),
        ('shinsegae-duty-free-best-deals-for-tourists',
         ['shinsegae', 'department', 'lotte', 'brand'],
         'Shinsegae duty-free best deals for tourists',
         'For brand-specific deals, see our guide to {link}.'),
    ],
    'vegan-hanok-restaurants-seoul-2026': [
        ('vegan-and-vegetarian-guide-to-korean-food-2026',
         ['vegan', 'vegetarian', 'plant', 'diet'],
         'vegan and vegetarian guide to Korean food',
         'For a broader dietary guide, see our {link}.'),
        ('vegetarian-and-vegan-korean-cuisine',
         ['cuisine', 'dish', 'menu', 'option'],
         'vegetarian and vegan Korean cuisine overview',
         'Want more options beyond hanok settings? Read our {link}.'),
        ('korean-temple-food-vegetarian-buddhist-meals',
         ['temple', 'buddhist', 'monk', 'spiritual'],
         'Korean temple food and vegetarian Buddhist meals',
         'For a spiritual dining experience, explore {link}.'),
    ],
    'vintage-thrifting-dongmyo-gwangjang-2026': [
        ('vintage-shopping-in-dongmyo-a-treasure-hunter-guide-2026',
         ['dongmyo', 'flea', 'treasure', 'vintage'],
         'vintage shopping in Dongmyo',
         'For Dongmyo-specific tips, see our detailed {link} guide.'),
        ('thrifting-in-seoul-best-charity-shops-and-flea-markets-2026',
         ['thrift', 'charity', 'flea', 'secondhand'],
         'thrifting in Seoul with charity shops and flea markets',
         'Want even more secondhand spots? Browse our guide to {link}.'),
        ('gwangjang-market-complete-food-guide',
         ['gwangjang', 'food', 'bindaetteok', 'eat'],
         'Gwangjang Market food guide',
         'After thrifting at Gwangjang, refuel with our {link}.'),
    ],
    'why-google-maps-doesnt-work-in-korea': [
        ('how-to-use-naver-maps-like-a-local-tips-for-english-speakers-2026',
         ['naver', 'map', 'navigation', 'english'],
         'using Naver Maps like a local',
         'The best alternative is Naver. Learn about {link}.'),
        ('taxi-apps-in-korea-kakao-vs-uber-alternatives',
         ['kakao', 'taxi', 'ride', 'app'],
         'Korean taxi apps including Kakao and Uber alternatives',
         'For getting around without maps, see our guide to {link}.'),
        ('rent-a-car-in-korea-international-license-and-navigation-app-guide-2026',
         ['car', 'rental', 'drive', 'navigation', 'gps'],
         'renting a car in Korea with navigation app tips',
         'Driving in Korea? Navigation is critical. Read our guide to {link}.'),
    ],
}

# ========== 3. Process each deep dive ==========
total_links_added = 0
files_modified = 0

for dd_file in sorted(glob.glob(os.path.join(DEEP_DIR, '*.md'))):
    dd_slug = os.path.basename(dd_file).replace('.md', '')
    
    if dd_slug not in LINK_MAP:
        print(f"⏭️  {dd_slug} — no link map defined, skipping")
        continue
    
    try:
        content = open(dd_file, encoding='utf-8-sig').read()
    except:
        content = open(dd_file, encoding='cp949').read()
    
    original = content
    links_added = 0
    
    for target_slug, keywords, anchor_text, sentence_template in LINK_MAP[dd_slug]:
        # Verify target exists
        if target_slug not in post_slugs:
            print(f"  ⚠️  Target not found: {target_slug}")
            continue
        
        # Check if link already exists
        if f'/blog/{target_slug}' in content:
            continue
        
        # Build the link and sentence
        link_md = f'[{anchor_text}](/blog/{target_slug})'
        sentence = sentence_template.replace('{link}', link_md)
        
        # Find the best paragraph to insert after
        lines = content.split('\n')
        best_line = -1
        best_score = 0
        
        for i, line in enumerate(lines):
            # Skip frontmatter, headings, components, empty lines
            if line.strip().startswith('---') or line.strip().startswith('#') or \
               line.strip().startswith('<') or line.strip().startswith('/>') or \
               line.strip() == '' or line.strip().startswith('|') or \
               line.strip().startswith('-') or line.strip().startswith('*'):
                continue
            
            # Score this line by keyword matches
            line_lower = line.lower()
            score = sum(1 for kw in keywords if kw.lower() in line_lower)
            
            # Prefer lines that are substantial (not too short)
            if len(line.strip()) < 50:
                score -= 1
            
            if score > best_score:
                best_score = score
                best_line = i
        
        if best_line >= 0 and best_score >= 1:
            # Insert after the best matching line, with a blank line
            lines.insert(best_line + 1, '')
            lines.insert(best_line + 2, sentence)
            content = '\n'.join(lines)
            links_added += 1
        else:
            # Fallback: insert before the FAQ or Sources section
            faq_match = re.search(r'^## (?:Frequently Asked|FAQ|Sources)', content, re.M)
            if faq_match:
                insert_pos = faq_match.start()
                insert_text = f'\n{sentence}\n\n'
                content = content[:insert_pos] + insert_text + content[insert_pos:]
                links_added += 1
    
    if links_added > 0 and content != original:
        with open(dd_file, 'w', encoding='utf-8') as f:
            f.write(content)
        files_modified += 1
        total_links_added += links_added
        print(f"✅ {dd_slug} — {links_added} links added")
    else:
        print(f"⏭️  {dd_slug} — no changes needed")

print(f"\n{'='*60}")
print(f"DONE: {total_links_added} links added across {files_modified} files")
