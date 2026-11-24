import Link from 'next/link';
import type { PostMetadata } from '@/lib/posts';
import Icon from './site/Icon';
import { generatedArchiveCoverHash, mediaFor, type EditorialMedia } from '@/lib/media';

const featuredCardSizes = '(max-width: 700px) calc((100vw - 52px) / 2), (max-width: 900px) calc((100vw - 100px) / 2), (max-width: 1360px) calc((100vw - 124px) / 3), 420px';
const leadCardSizes = '(max-width: 700px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 80px), (max-width: 1360px) calc((100vw - 124px) / 3), 420px';

export default function BlogCard({
  post,
  priority = false,
  feature,
}: {
  post: PostMetadata;
  showDeepDiveBadge?: boolean;
  priority?: boolean;
  feature?: { photo: EditorialMedia; title: string; summary: string; lead: boolean };
}) {
  const coverPhoto = feature?.photo;
  const media = coverPhoto ?? mediaFor(post.editorial?.heroMediaId);
  const image = coverPhoto?.src ?? post.image;
  const generatedArchiveCover = Boolean(generatedArchiveCoverHash(post.slug, image));
  // Home visitors can arrive at a fragment before choosing a guide. Retain that position on Back.
  const CardLink = feature ? 'a' : Link;
  return (
    <CardLink href={`/blog/${post.slug}`} className="guide-card">
      {image ? (
        <div className="guide-card-image">
          <img
            src={image}
            srcSet={media?.srcSet}
            sizes={feature
              ? (feature.lead ? leadCardSizes : featuredCardSizes)
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
        <h3>{feature?.title ?? post.title}</h3>
        <p>{feature?.summary ?? post.excerpt}</p>
        {feature ? null : (
          <div className="guide-card-bottom">
            <span>{post.reviewed ? 'Reviewed guide' : post.readTime}</span>
            <Icon name="arrow" />
          </div>
        )}
      </div>
    </CardLink>
  );
}
