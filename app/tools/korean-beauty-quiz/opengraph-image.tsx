import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const alt = 'Korean Beauty Routine Quiz - Korea Experience';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFC0CB 0%, #FFB6D9 25%, #FF69B4 50%, #DA70D6 75%, #BA55D3 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '32px',
            padding: '60px 80px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #FF69B4 0%, #DA70D6 50%, #BA55D3 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '24px',
              display: 'flex',
            }}
          >
            ✨ Beauty Routine Quiz
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#666',
              textAlign: 'center',
              marginBottom: '20px',
              display: 'flex',
            }}
          >
            Discover Your Perfect K-Beauty Routine
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#999',
              display: 'flex',
            }}
          >
            Korea Experience
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
