import Link from 'next/link';
import { getFeaturedPosts, getLaunchGuides, getAllPosts } from '@/lib/posts';
import { TRAVEL_CATEGORIES } from '@/lib/taxonomy';
import { PRACTICAL_TOOLS } from '@/lib/constants';
import BlogCard from '@/components/BlogCard';
import Icon from '@/components/site/Icon';
export default function Home() {
  const launch = getLaunchGuides();
  const featured = getFeaturedPosts();
  const picks = (featured.length ? featured : getAllPosts()).slice(0, 3);
  const seasonal = launch.filter((p) => p.editorial?.format === 'seasonal').slice(0, 2);
  return (
    <>
      <section className="home-hero wrap">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="tiny-line" /> A considered guide to Korea
          </div>
          <h1 className="display-title">
            Your Korea trip,
            <br />
            <em>made clearer.</em>
          </h1>
          <p className="hero-deck">
            The right neighborhood. A route that makes sense. The small details that make a big
            difference.
          </p>
          <div className="button-row">
            <Link href="/blog/category/plan-your-trip" className="button button-dark">
              Start planning <Icon name="next" />
            </Link>
            <Link href="/destinations" className="text-link">
              Find your place <Icon name="arrow" />
            </Link>
          </div>
          <div className="hero-note">
            <span>GOOD TO KNOW</span>
            <p>Practical guides, official sources, and tools you can actually use.</p>
          </div>
        </div>
        <figure className="hero-figure">
          <img
            src="/images/editorial/bukchon.webp"
            alt="Traditional tiled hanok roofs lining a quiet lane in Bukchon, Seoul"
            width="1280"
            height="1440"
            fetchPriority="high"
          />
          <figcaption>
            <span>
              <Icon name="pin" />
              Bukchon, Seoul
            </span>
            <Link href="/image-credits#bukchon">
              Photo & credit <Icon name="arrow" />
            </Link>
          </figcaption>
          <div className="hero-photo-label" aria-hidden="true">
            A little preparation.
            <br />
            More room to explore.
          </div>
        </figure>
      </section>
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
      <section className="wrap section-space">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A good place to begin</p>
            <h2 className="section-title">
              Fewer open tabs.
              <br />
              <em>Better next steps.</em>
            </h2>
          </div>
          <p className="section-intro">
            Start with the question on your mind. Each guide takes you from a clear answer to what
            comes next.
          </p>
        </div>
        <div className="guide-grid">
          {picks.map((p, i) => (
            <BlogCard key={p.slug} post={p} priority={i === 0} />
          ))}
        </div>
        <div className="section-end">
          <Link href="/blog" className="text-link">
            Explore the guide library <Icon name="next" />
          </Link>
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
            {PRACTICAL_TOOLS.slice(0, 4).map((t) => (
              <Link href={t.href} key={t.id}>
                <span className="tool-number">{t.icon}</span>
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
      {seasonal.length ? (
        <section className="season-section">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Think a little ahead</p>
                <h2 className="section-title">
                  The next season
                  <br />
                  <em>starts with a good plan.</em>
                </h2>
              </div>
              <p className="section-intro">
                Prepare for colder days, check official release dates, and leave room for a change
                of weather.
              </p>
            </div>
            <div className="season-grid">
              {seasonal.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`}>
                  <span className="eyebrow">{p.category}</span>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <span className="text-link">
                    Read the guide <Icon name="arrow" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
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
    </>
  );
}
