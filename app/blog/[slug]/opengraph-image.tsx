import { ImageResponse } from 'next/og';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Use Node.js runtime since we need to read files
export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const revalidate = false;
export const alt = 'Korea Experience Blog Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Post Not Found
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // If the post has a custom cover image, use it directly
  if (post.image) {
    const imagePath = join(process.cwd(), 'public', post.image);
    if (existsSync(imagePath)) {
      const imageBuffer = readFileSync(imagePath);
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  }

  // Fallback: generate OG image with code
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Category Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '12px 24px',
            borderRadius: '30px',
            fontSize: 24,
            color: 'white',
            fontWeight: 600,
          }}
        >
          {post.category}
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <h1
            style={{
              fontSize: post.title.length > 60 ? 52 : 64,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.2,
              margin: 0,
              maxWidth: '1000px',
            }}
          >
            {post.title}
          </h1>
          <p
            style={{
              fontSize: 28,
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.4,
              margin: 0,
              maxWidth: '900px',
            }}
          >
            {post.excerpt.length > 120 ? post.excerpt.substring(0, 120) + '...' : post.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: 'white',
              }}
            >
              🇰🇷 Korea Experience
            </span>
          </div>
          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
