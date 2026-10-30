import Link from 'next/link';
import type { PostMetadata } from '@/lib/posts';
import Icon from './Icon';
import TrackedLink from './TrackedLink';
export default function NextSteps({
  current,
  posts,
}: {
  current: PostMetadata;
  posts: PostMetadata[];
}) {
  if (!posts.length) return null;
  return (
    <section className="next-steps">
      <p className="eyebrow">Keep your trip moving</p>
      <h2>What comes next?</h2>
      <div className="next-step-grid">
        {posts.slice(0, 3).map((post, index) => {
          const relation = current.editorial?.relations.find((r) => r.slug === post.slug);
          return (
            <TrackedLink
              key={post.id}
              href={`/blog/${post.slug}`}
              from={current.id}
              to={post.id}
              relation={relation?.type || 'context'}
            >
              <span className="eyebrow">
                {relation?.label || (index === 0 ? 'Your next step' : 'A useful companion')}
              </span>
              <h3>{post.title}</h3>
              <p>
                {relation?.reason ||
                  `Explore another reviewed guide for ${post.category.toLowerCase()}.`}
              </p>
              <Icon name="arrow" />
            </TrackedLink>
          );
        })}
      </div>
    </section>
  );
}
