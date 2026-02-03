import { ImageResponse } from 'next/og';

interface OGImageConfig {
  emoji: string;
  title: string;
  description: string;
  category?: string;
  gradient?: { from: string; to: string };
}

export function generateOGImage({
  emoji,
  title,
  description,
  category,
  gradient = { from: '#4F46E5', to: '#7C3AED' }
}: OGImageConfig) {
  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
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
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 120 }}>
          {emoji}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 style={{ 
            fontSize: 64, 
            fontWeight: 800, 
            color: 'white', 
            lineHeight: 1.1, 
            margin: 0, 
            maxWidth: '1000px' 
          }}>
            {title}
          </h1>
          <p style={{ 
            fontSize: 32, 
            color: 'rgba(255, 255, 255, 0.9)', 
            lineHeight: 1.3, 
            margin: 0, 
            maxWidth: '900px' 
          }}>
            {description}
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%' 
        }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: 'white' }}>
            🇰🇷 Korea Experience
          </span>
          {category && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              padding: '12px 28px', 
              borderRadius: '30px', 
              fontSize: 28, 
              color: 'white', 
              fontWeight: 600 
            }}>
              {category}
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
