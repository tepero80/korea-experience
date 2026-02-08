import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const revalidate = false;
export const alt = 'K-Drama Character Quiz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 120 }}>🎭</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 style={{ fontSize: 64, fontWeight: 800, color: 'white', lineHeight: 1.1, margin: 0, maxWidth: '1000px' }}>
            K-Drama Character Quiz
          </h1>
          <p style={{ fontSize: 32, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.3, margin: 0, maxWidth: '900px' }}>
            Find out which K-Drama character matches your personality perfectly.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: 'white' }}>🇰🇷 Korea Experience</span>
          <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '12px 28px', borderRadius: '30px', fontSize: 28, color: 'white', fontWeight: 600 }}>
            Interactive Tool
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
