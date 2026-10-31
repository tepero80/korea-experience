import { createHash } from 'node:crypto';
import fs from 'node:fs';
import type { PostMetadata } from './posts';
export function cardFingerprint(
  post: Pick<PostMetadata, 'title' | 'excerpt' | 'category' | 'checkedAt' | 'image' | 'editorial'>,
) {
  const imageHash = post.image
    ? createHash('sha256')
        .update(fs.readFileSync('public' + post.image))
        .digest('hex')
    : undefined;
  return createHash('sha256')
    .update(
      JSON.stringify({
        version: 5,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        checkedAt: post.checkedAt,
        image: post.image,
        imageHash,
        conditions: post.editorial?.conditions,
        shareFacts: post.editorial?.shareFacts,
        credit: post.editorial?.imageCredit,
      }),
    )
    .digest('hex');
}
