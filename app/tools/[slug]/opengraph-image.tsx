import { ImageResponse } from 'next/og';
import { ALL_TOOLS } from '@/lib/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const revalidate = false;
export const alt = 'Korea Experience Tool';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export function generateStaticParams() {
  return ALL_TOOLS.map((tool) => ({
    slug: tool.href.split('/').pop() || '',
  }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = ALL_TOOLS.find(t => t.href === `/tools/${slug}`);

  if (!tool) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Tool Not Found
        </div>
      ),
      {
        ...size,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
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
        {/* Tool Emoji - Large */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 120,
          }}
        >
          {tool.icon}
        </div>

        {/* Title & Description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <h1
            style={{
              fontSize: tool.title.length > 30 ? 56 : 72,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.1,
              margin: 0,
              maxWidth: '1000px',
            }}
          >
            {tool.title}
          </h1>
          <p
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.3,
              margin: 0,
              maxWidth: '900px',
            }}
          >
            {tool.description.length > 100 
              ? tool.description.substring(0, 100) + '...' 
              : tool.description}
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
                fontSize: 36,
                fontWeight: 700,
                color: 'white',
              }}
            >
              🇰🇷 Korea Experience
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px 28px',
              borderRadius: '30px',
              fontSize: 28,
              color: 'white',
              fontWeight: 600,
            }}
          >
            Interactive Tool
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
