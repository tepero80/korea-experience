import { guideHeroPhotograph } from '@/lib/media';
import type { PostMetadata } from '@/lib/posts';
import Icon from './Icon';
import PhotoCredit from './PhotoCredit';
import TrackedLink from './TrackedLink';
import styles from './NextSteps.module.css';

export default function NextSteps({
  current,
  posts,
}: {
  current: PostMetadata;
  posts: PostMetadata[];
}) {
  if (!posts.length) return null;
  const recommendations = posts.slice(0, 3);
  const desktopPhotoSize = recommendations.length === 2 ? '640px' : '416px';
  return (
    <section className="next-steps" aria-labelledby="next-steps-title">
      <p className="eyebrow">Keep your trip moving</p>
      <h2 id="next-steps-title">What comes next?</h2>
      <div className={styles.grid}>
        {recommendations.map((post, index) => {
          const relation = current.editorial?.relations.find((r) => r.slug === post.slug);
          const photo = guideHeroPhotograph(post.editorial?.heroMediaId, post.image);
          return (
            <div className={styles.card} key={post.id}>
              <TrackedLink
                href={`/blog/${post.slug}`}
                from={current.id}
                to={post.id}
                relation={relation?.type || 'context'}
              >
                {photo ? (
                  <img
                    className={styles.photo}
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes={`(max-width: 640px) calc(100vw - 40px), (max-width: 1019px) 46vw, ${desktopPhotoSize}`}
                    width={photo.width}
                    height={photo.height}
                    style={{ objectPosition: photo.focal }}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <div className={styles.copy}>
                  <span className="eyebrow">
                    {relation?.label || (index === 0 ? 'Your next step' : 'A useful companion')}
                  </span>
                  <h3>{post.title}</h3>
                  <p>
                    {relation?.reason ||
                      `Explore another reviewed guide for ${post.category.toLowerCase()}.`}
                  </p>
                  <Icon name="arrow" />
                </div>
              </TrackedLink>
              {photo ? (
                <div className={styles.credit}>
                  <PhotoCredit credit={photo.credit} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
