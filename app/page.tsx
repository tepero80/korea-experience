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
  { slug: 'first-trip-to-korea-planning-guide', photoId: 'gyeongbokgung' },
  { slug: 'airport-limousine-bus-vs-arex-express-train', photoId: 'incheon-t1-songdo-bus-orientation' },
  { slug: 'seoul-neighborhood-chooser-for-first-time-visitors-where-to-stay-by-trip-style', photoId: 'bukchon-evening' },
  { slug: 'gwangjang-market-complete-food-guide', photoId: 'gwangjang' },
  { slug: 'seoul-to-busan-weekend-planner-train-neighborhood-base-and-route-choices', photoId: 'busan-dongbaekseom-nurimaru-2024' },
  { slug: 'jeju-island-complete-travel-guide-best-time-to-visit-2026', photoId: 'jeju-seongsan-town-from-ilchulbong-blue-hour-2024' },
];

const featuredRegions = [
  { id: 'seoul', photoId: 'archive-seoul-han-river-jamwon-sunset-2023', focus: 'Palaces & river walks' },
  { id: 'busan', photoId: 'busan-base-haeundae-panorama', focus: 'Beaches & markets' },
  { id: 'jeju', photoId: 'jeju-seongsan-ilchulbong-visitor-approach-2022', focus: 'Volcanic coast & trails' },
  { id: 'gyeongju', photoId: 'gyeongju-bulguksa-temple', focus: 'Silla temples & tombs' },
  { id: 'jeonju', photoId: 'jeonju-hanok-rooftops-overview', focus: 'Hanok lanes & local food' },
  { id: 'sokcho', photoId: 'archive-seoraksan-rocky-valley-autumn-2015', focus: 'Mountain trails & coast' },
  { id: 'suwon', photoId: 'suwon', focus: 'Fortress walks' },
  { id: 'tongyeong', photoId: 'tongyeong-mireuksan-island-panorama-2013', focus: 'Harbors & island ferries' },
];

export const metadata = {
  title: { absolute: SITE_CONFIG.title },
  alternates: { canonical: SITE_CONFIG.url + '/', types: GUIDE_FEED_TYPES },
};
export default function Home() {
  const guides = getAllPosts();
  const picks = featuredGuides.flatMap(({ slug, photoId }) => {
    const post = guides.find((guide) => guide.slug === slug && guide.indexable && guide.reviewed);
    const photo = mediaFor(photoId);
    return post && photo?.credit.kind === 'photograph' ? [{ post, photo }] : [];
  });
  const destinations = getDestinations();
  const photoCards = featuredRegions.flatMap(({ id, photoId, focus }) => {
    const region = destinations.find((region) => region.id === id && region.indexable);
    const photo = mediaFor(photoId);
    return region && photo?.credit.kind === 'photograph' ? [{ region, photo, focus }] : [];
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
                  sizes="(max-width: 900px) calc((100vw - 52px) / 2), (max-width: 1320px) calc((100vw - 100px) / 4), 300px"
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
          {picks.map(({ post, photo }) => (
            <BlogCard key={post.slug} post={post} coverPhoto={photo} />
          ))}
        </div>
        <details className="home-photo-credits">
          <summary>Guide photo credits</summary>
          <ul>
            {picks.map(({ post, photo }) => (
              <li key={photo.id}>
                <a href={`/image-credits#${photo.id}`}>
                  {post.title} · {photo.credit.author} · {photo.credit.license}
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
            <a href="/blog/seoul-in-winter-complete-guide-ice-skating-and-more-2026">
              <h3>Seoul festivals &amp; ice skating</h3>
              <p>Find the lights, check rink dates and keep an indoor option for cold evenings.</p>
              <span className="text-link">
                Plan a winter evening <Icon name="arrow" />
              </span>
            </a>
            <a href="/blog/winter-ski-resorts-comparison-vivaldi-park-vs-yongpyong-vs-alpensia-2026">
              <h3>Ski resorts for a day or overnight</h3>
              <p>
                Compare Vivaldi Park, Yongpyong and Alpensia by return transport and time on the
                slopes.
              </p>
              <span className="text-link">
                Compare the three resorts <Icon name="arrow" />
              </span>
            </a>
          </div>
          <div className="season-more">
            <a href="/blog/korea-winter-packing-checklist" className="text-link">
              Winter packing checklist <Icon name="arrow" />
            </a>
            <a href="/blog/best-time-to-visit-korea-month-by-month-weather" className="text-link">
              Compare Korea by month <Icon name="arrow" />
            </a>
          </div>
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
