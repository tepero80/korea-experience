import Link from 'next/link';
import type { PostMetadata } from '@/lib/posts';
import Icon from './site/Icon';
export default function BlogCard({
  post,
  priority = false,
}: {
  post: PostMetadata;
  showDeepDiveBadge?: boolean;
  priority?: boolean;
}) {
  return (
    <Link href={`/blog/${post.slug}`} className="guide-card">
      {post.image ? (
        <div className="guide-card-image">
          <img
            src={post.image}
            alt=""
            width="960"
            height="640"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      ) : (
        <div className="guide-card-noimage" aria-hidden="true">
          <span>
            Korea
            <br />
            <em>Experience</em>
          </span>
        </div>
      )}
      <div className="guide-card-copy">
        <span className="eyebrow">{post.category}</span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="guide-card-bottom">
          <span>{post.reviewed ? 'Reviewed guide' : post.readTime}</span>
          <Icon name="arrow" />
        </div>
      </div>
    </Link>
  );
}
