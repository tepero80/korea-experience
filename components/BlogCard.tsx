import Link from 'next/link';
import type { PostMetadata } from '@/lib/posts';
import Icon from './site/Icon';
import { generatedArchiveCoverHash, mediaFor, type EditorialMedia } from '@/lib/media';
export default function BlogCard({
  post,
  priority = false,
  coverPhoto,
}: {
  post: PostMetadata;
  showDeepDiveBadge?: boolean;
  priority?: boolean;
  coverPhoto?: EditorialMedia;
}) {
  const media = coverPhoto ?? mediaFor(post.editorial?.heroMediaId);
  const image = coverPhoto?.src ?? post.image;
  const generatedArchiveCover = Boolean(generatedArchiveCoverHash(post.slug, image));
  return (
    <Link href={`/blog/${post.slug}`} className="guide-card">
      {image ? (
        <div className="guide-card-image">
          <img
            src={image}
            srcSet={media?.srcSet}
            sizes={coverPhoto
              ? '(max-width: 560px) calc(100vw - 40px), (max-width: 900px) calc((100vw - 64px) / 2), 400px'
              : '(max-width: 700px) calc(100vw - 40px), (max-width: 1000px) 45vw, 400px'}
            alt=""
            style={{
              objectPosition: media?.focal,
              objectFit: media?.credit.kind === 'illustration' ? 'contain' : 'cover',
            }}
            width={coverPhoto?.width ?? 960}
            height={coverPhoto?.height ?? 640}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
          {generatedArchiveCover ? (
            <span className="guide-card-image-label">AI-generated illustration</span>
          ) : null}
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
