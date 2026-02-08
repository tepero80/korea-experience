import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const runtime = 'nodejs';
export const alt = 'Korean Typing Speed Test';
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
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: 120, marginBottom: 20 }}>⌨️</div>
        
        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          Korean Typing Speed Test
        </div>
        
        {/* Description */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          Test your Hangul typing speed and accuracy
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          koreaexperience.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
