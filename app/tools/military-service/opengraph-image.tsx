import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const alt = 'Korean Military Service Calculator - Korea Experience';
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
          background: 'linear-gradient(135deg, #2D5016 0%, #4A7C59 50%, #6B8E23 100%)',
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
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #2D5016 0%, #4A7C59 50%, #6B8E23 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '24px',
              display: 'flex',
            }}
          >
            🪖 Military Service Calculator
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
            Check Your Korean Military Requirements
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
