import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { TRAVEL_CATEGORIES } from '@/lib/taxonomy';
import { GUIDE_FEED_TYPES, PRIMARY_TRAVEL_TOOLS, SITE_CONFIG } from '@/lib/constants';
import BlogCard from '@/components/BlogCard';
import Icon from '@/components/site/Icon';
import Search from '@/components/Search';
import DiscoveryLink from '@/components/site/DiscoveryLink';
import { mediaFor } from '@/lib/media';
import { getDestinations } from '@/lib/destinations';
import { HOME_DESCRIPTION, HOME_FEATURE, HOME_TITLE } from '@/lib/home-feature';

const featuredGuides = [
  {
    slug: 'first-trip-to-korea-planning-guide',
    photoId: 'archive-namsan-dusk-panorama-2011',
    title: 'Your first Korea trip',
    summary: 'Pick a route and know what to book first.',
  },
  {
    slug: 'airport-limousine-bus-vs-arex-express-train',
    photoId: 'airport-concourse',
    title: 'Incheon Airport to your hotel',
    summary: 'Choose the train, bus or taxi for your arrival.',
  },
  {
    slug: 'seoul-neighborhood-chooser-for-first-time-visitors-where-to-stay-by-trip-style',
    photoId: 'hotel-hongdae-street',
    title: 'Where to stay in Seoul',
    summary: 'Compare four neighborhoods before booking.',
  },
  {
    slug: 'seoul-3-day-itinerary-perfect-first-time-visitor-guide-2026',
    photoId: 'seoul-geunjeongjeon',
    title: 'Three days in Seoul',
    summary: 'Group palaces, markets and neighborhoods by day.',
  },
  {
    slug: 'gwangjang-market-complete-food-guide',
    photoId: 'archive-gwangjang-jeon-counter-2026',
    title: 'What to eat at Gwangjang Market',
    summary: 'Find the food alley and place your first order.',
  },
  {
    slug: 'hanbok-rental-complete-guide-styles-and-pricing',
    photoId: 'exp-c-hanbok-palace-pond',
    title: 'Rent hanbok for a palace visit',
    summary: 'Check admission and allow time for the return.',
  },
  {
    slug: 'seoul-to-busan-weekend-planner-train-neighborhood-base-and-route-choices',
    photoId: 'busan-dongbaekseom-nurimaru-2024',
    title: 'Two days in Busan without a car',
    summary: 'Split the old port and the coast into two days.',
  },
  {
    slug: 'jeju-island-complete-travel-guide-best-time-to-visit-2026',
    photoId: 'jeju-seongsan-town-from-ilchulbong-blue-hour-2024',
    title: 'Three days on Jeju',
    summary: 'Choose a base and plan island outings by bus.',
  },
  {
    slug: 'best-time-to-visit-korea-month-by-month-weather',
    photoId: 'autumn-fortress-walk',
    title: 'When to visit Korea',
    summary: 'Compare weather and travel trade-offs by month.',
  },
];

const featuredRegions = [
  { id: 'seoul', photoId: 'seoul-eunpyeong-hanok-and-bukhansan-2020', focus: 'Hanok lanes & city walks' },
  { id: 'busan', photoId: 'busan-haedong-yonggungsa-coast', focus: 'Beaches & coastal temples' },
  { id: 'jeju', photoId: 'jeju-jeongbang-coastal-waterfall-2017', focus: 'Waterfalls & volcanic coast' },
  { id: 'gyeongju', photoId: 'gyeongju-tombs-2022', focus: 'Silla tombs & temples' },
  { id: 'jeonju', photoId: 'jeonju-gyeonggijeon-courtyard', focus: 'Hanok lanes & market food' },
  { id: 'sokcho', photoId: 'archive-seoraksan-rocky-valley-autumn-2015', focus: 'Mountain trails & coast' },
  { id: 'suwon', photoId: 'suwon-daytrip-janganmun-gate', focus: 'Fortress gates & walls' },
  { id: 'tongyeong', photoId: 'tongyeong-gangguan-waterfront-boats-2009', focus: 'Harbor walks & ferries' },
  { id: 'andong', photoId: 'andong-wolyeonggyo-river-daylight', focus: 'River walks & folk villages' },
  { id: 'suncheon', photoId: 'suncheon-garden-lake-mounds', focus: 'Gardens & wetlands' },
  { id: 'yeosu', photoId: 'yeosu-maritime-cable-cars', focus: 'Cable cars & island walks' },
  { id: 'gwangju', photoId: 'gwangju-national-museum-courtyard-2015', focus: 'Art & history museums' },
];

const winterGuides = [
  {
    href: '/blog/seoul-in-winter-complete-guide-ice-skating-and-more-2026',
    photoId: 'seoul-plaza-winter-ice-rink-2007',
    location: 'Seoul Plaza ice rink · December 2007',
    title: 'Seoul festivals & ice skating',
    summary: 'Find the lights, check rink dates and keep an indoor option for cold evenings.',
    action: 'Plan a winter evening',
  },
  {
    href: '/blog/winter-ski-resorts-comparison-vivaldi-park-vs-yongpyong-vs-alpensia-2026',
    photoId: 'archive-yongpyong-alpine-center-snow-2018',
    location: 'Yongpyong Alpine Center · February 2018',
    title: 'Ski resorts for a day or overnight',
    summary: 'Compare Vivaldi Park, Yongpyong and Alpensia by return transport and time on the slopes.',
    action: 'Compare the three resorts',
  },
];

export const metadata = {
  title: { absolute: SITE_CONFIG.title },
  alternates: { canonical: SITE_CONFIG.url + '/', types: GUIDE_FEED_TYPES },
};
export default function Home() {
  const guides = getAllPosts();
  const picks = featuredGuides.flatMap(({ slug, photoId, title, summary }) => {
    const post = guides.find((guide) => guide.slug === slug && guide.indexable && guide.reviewed);
    const photo = mediaFor(photoId);
    return post && photo?.credit.kind === 'photograph' ? [{ post, photo, title, summary }] : [];
  });
  const destinations = getDestinations();
  const photoCards = featuredRegions.flatMap(({ id, photoId, focus }) => {
    const region = destinations.find((region) => region.id === id && region.indexable);
    const photo = mediaFor(photoId);
    return region && photo?.credit.kind === 'photograph' ? [{ region, photo, focus }] : [];
  });
  const winterCards = winterGuides.map((guide) => {
    const photo = mediaFor(guide.photoId);
    return { ...guide, photo: photo?.credit.kind === 'photograph' ? photo : undefined };
  });
  const featurePhoto = mediaFor(HOME_FEATURE.photoId);
  const showFeature = featurePhoto?.credit.kind === 'photograph' && destinations.some(
    (region) => region.id === HOME_FEATURE.region && region.indexable,
  );
  const hasGangwonGuides = destinations.some((region) => region.area === 'Gangwon' && region.indexable);
  return (
    <div className="home-magazine editorial-travel-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': SITE_CONFIG.url + '/#website',
            url: SITE_CONFIG.url + '/',
            name: SITE_CONFIG.name,
            alternateName: ['KoreaExperience', 'koreaexperience.com'],
            inLanguage: 'en',
            publisher: { '@id': SITE_CONFIG.url + '/#organization' },
          }).replace(/</g, '\\u003c'),
        }}
      />
      <section className="magazine-opening wrap" aria-labelledby="home-title">
        <div className="magazine-heading">
          <h1 id="home-title">{HOME_TITLE}</h1>
          <p>{HOME_DESCRIPTION}</p>
          <div className="home-hero-actions">
            <nav className="home-entry-links" aria-label="Start exploring Korea">
              <DiscoveryLink event="home_first_trip" href="/blog/first-trip-to-korea-planning-guide">
                Plan your first trip
              </DiscoveryLink>
              <DiscoveryLink event="home_destinations" href="#explore-destinations">
                Explore destinations
              </DiscoveryLink>
            </nav>
            <Search variant="hero" />
          </div>
        </div>
        {showFeature && featurePhoto ? (
          <div className="magazine-feature">
            <figure>
              <img
                src={featurePhoto.src}
                srcSet={featurePhoto.srcSet}
                sizes="(max-width: 760px) 100vw, (max-width: 1360px) 55vw, 704px"
                alt={featurePhoto.alt}
                width={featurePhoto.width}
                height={featurePhoto.height}
                style={{ objectPosition: featurePhoto.focal }}
                fetchPriority="high"
              />
              <figcaption>
                <span>{HOME_FEATURE.place}</span>
                <a href={`/image-credits#${featurePhoto.id}`}>Photo credit</a>
              </figcaption>
            </figure>
            <DiscoveryLink className="magazine-feature-link" event="home_destination" href={`/destinations/${HOME_FEATURE.region}`}>
              <span><strong>{HOME_FEATURE.title}</strong><span>{HOME_FEATURE.description}</span></span>
              <Icon name="arrow" />
            </DiscoveryLink>
          </div>
        ) : null}
      </section>
      <section className="wrap home-destinations" aria-labelledby="explore-destinations">
        <div className="home-destination-heading">
          <h2 className="section-title" id="explore-destinations" tabIndex={-1}>
            Explore destinations
          </h2>
          <DiscoveryLink className="text-link" event="home_all_destinations" href="/destinations">
            All {destinations.length} destinations <Icon name="next" />
          </DiscoveryLink>
        </div>
        <ul className="home-destination-grid">
          {photoCards.map(({ region, photo, focus }) => (
            <li key={region.id}>
              <DiscoveryLink className="home-destination-card" event="home_destination" href={`/destinations/${region.id}`}>
                <img
                  src={photo.src}
                  srcSet={photo.srcSet}
                  sizes="(max-width: 700px) calc((100vw - 52px) / 2), (max-width: 900px) calc((100vw - 108px) / 3), (max-width: 1360px) calc((100vw - 140px) / 4), 305px"
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  style={{ objectPosition: photo.focal }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="home-destination-caption">
                  <span><strong>{region.name}</strong><span>{focus}</span></span>
                  <Icon name="arrow" />
                </div>
              </DiscoveryLink>
            </li>
          ))}
        </ul>
        <details className="home-photo-credits">
          <summary>Photo credits</summary>
          <ul>
            {photoCards.map(({ region, photo }) => (
              <li key={photo.id}>
                <a href={`/image-credits#${photo.id}`}>
                  {region.name} · {photo.credit.author} · {photo.credit.license}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </section>
      <nav className="wrap home-quick-links" aria-label="Popular starting points">
        <Link href="/blog/airport-limousine-bus-vs-arex-express-train">Airport to hotel</Link>
        <Link href="/tools/itinerary">Your day-by-day plan</Link>
        <Link href="/blog/korea-travel-problem-solving-guide">Need help now?</Link>
        <a href="#winter-trip-planning">Winter trip planning</a>
        {hasGangwonGuides ? <a href="/destinations#gangwon">Explore Gangwon</a> : null}
      </nav>
      <section className="journey-band" aria-label="Plan your journey">
        <div className="wrap journey-band-inner">
          {[
            {
              n: '01',
              title: 'Before you go',
              text: 'Dates, budget & a useful plan',
              href: '/blog/category/plan-your-trip',
            },
            {
              n: '02',
              title: 'Land & settle in',
              text: 'Airport, transport & your base',
              href: '/blog/category/airports-transport',
            },
            {
              n: '03',
              title: 'Make it your own',
              text: 'Places, food & experiences',
              href: '/blog/category/places-itineraries',
            },
          ].map((s) => (
            <Link href={s.href} key={s.n}>
              <span className="journey-number">{s.n}</span>
              <div>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </div>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      </section>
      <section className="wrap section-space home-reads" aria-labelledby="first-useful-reads">
        <div className="section-heading">
          <h2 className="section-title" id="first-useful-reads">Your first useful reads</h2>
          <Link href="/blog" className="text-link">
            Explore the guide library <Icon name="next" />
          </Link>
        </div>
        <div className="guide-grid">
          {picks.map(({ post, ...feature }, index) => (
            <BlogCard key={post.slug} post={post} feature={{ ...feature, lead: index === 0 }} />
          ))}
        </div>
        <details className="home-photo-credits">
          <summary>Guide photo credits</summary>
          <ul>
            {picks.map(({ photo, title }) => (
              <li key={photo.id}>
                <a href={`/image-credits#${photo.id}`}>
                  {title} · {photo.credit.author} · {photo.credit.license}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </section>
      {/* Keep the fragment and its outgoing links in native browser history so Back restores focus and position. */}
      <section className="season-section" aria-labelledby="winter-trip-planning">
        <div className="wrap">
          <div className="section-heading">
            <h2 className="section-title" id="winter-trip-planning" tabIndex={-1}>
              Winter travel in Korea
            </h2>
            <p className="section-intro">
              Plan a winter evening in Seoul or choose a ski day you can get to and back from.
            </p>
          </div>
          <div className="season-grid">
            {winterCards.map(({ href, photo, location, title, summary, action }) => (
              <a href={href} key={href}>
                {photo ? (
                  <img
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1360px) calc((100vw - 105px) / 2), 628px"
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    style={{ objectPosition: photo.focal }}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <div className="season-card-copy">
                  {photo ? <span className="season-card-location">{location}</span> : null}
                  <h3>{title}</h3>
                  <p>{summary}</p>
                  <span className="text-link">
                    {action} <Icon name="arrow" />
                  </span>
                </div>
              </a>
            ))}
          </div>
          <div className="season-more">
            <a href="/blog/korea-winter-packing-checklist" className="text-link">
              Winter packing checklist <Icon name="arrow" />
            </a>
            <a href="/blog/best-time-to-visit-korea-month-by-month-weather" className="text-link">
              Compare Korea by month <Icon name="arrow" />
            </a>
          </div>
          <details className="home-photo-credits">
            <summary>Winter photo credits</summary>
            <ul>
              {winterCards.map(({ photo, location }) => photo ? (
                <li key={photo.id}>
                  <a href={`/image-credits#${photo.id}`}>
                    {location} · {photo.credit.author} · {photo.credit.license}
                  </a>
                </li>
              ) : null)}
            </ul>
          </details>
        </div>
      </section>
      <section className="tools-band">
        <div className="wrap tools-feature">
          <div>
            <p className="eyebrow">Less guesswork</p>
            <h2 className="section-title">
              Make a plan
              <br />
              <em>that fits you.</em>
            </h2>
            <p>
              Compare the options, adjust the assumptions, and keep the details together. No account
              needed to get started.
            </p>
            <Link href="/tools" className="button button-dark">
              Open the travel toolkit <Icon name="arrow" />
            </Link>
          </div>
          <div className="tool-feature-list">
            {PRIMARY_TRAVEL_TOOLS.map((t, index) => (
              <Link href={t.href} key={t.id}>
                <span className="tool-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                </div>
                <Icon name="arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Follow your curiosity</p>
            <h2 className="section-title">
              What do you
              <br />
              <em>need to know?</em>
            </h2>
          </div>
          <Link href="/destinations" className="text-link">
            Browse by destination <Icon name="arrow" />
          </Link>
        </div>
        <div className="category-grid">
          {TRAVEL_CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/blog/category/${c.slug}`}>
              <span className="category-number">{c.icon}</span>
              <h3>{c.name}</h3>
              <p>{c.question}</p>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      </section>
      <section className="wrap trust-strip">
        <div>
          <p className="eyebrow">Useful. Traceable. Open to correction.</p>
          <h2>
            Good travel information
            <br />
            should help you decide.
          </h2>
        </div>
        <div>
          <p>
            We show where important information comes from, when we checked it, and what you still
            need to confirm with the operator.
          </p>
          <Link href="/editorial-policy" className="text-link">
            Our editorial standards <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </div>
  );
}
