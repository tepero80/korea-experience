const sharp = require('sharp');

const width = 1200;
const height = 630;

// Create SVG string
const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9333ea;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#db2777;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9333ea;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#grad1)"/>
  
  <text x="600" y="220" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">
    Korea Experience
  </text>
  
  <text x="600" y="300" font-family="Arial, sans-serif" font-size="36" fill="rgba(255,255,255,0.9)" text-anchor="middle">
    Your Gateway to Korea
  </text>
  
  <text x="240" y="450" font-size="60">🏥</text>
  <text x="420" y="450" font-size="60">✈️</text>
  <text x="600" y="450" font-size="60">🎭</text>
  <text x="780" y="450" font-size="60">🏠</text>
  <text x="960" y="450" font-size="60">🍜</text>
  
  <text x="240" y="520" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">Medical</text>
  <text x="420" y="520" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">Travel</text>
  <text x="600" y="520" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">Culture</text>
  <text x="780" y="520" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">Living</text>
  <text x="960" y="520" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">Food</text>
  
  <text x="600" y="590" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)" text-anchor="middle">
    koreaexperience.com
  </text>
</svg>
`;

// Convert SVG to PNG
sharp(Buffer.from(svg))
  .png()
  .toFile('public/og-image.png')
  .then(() => {
    console.log('✅ og-image.png created successfully!');
  })
  .catch(err => {
    console.error('❌ Error creating og-image.png:', err);
  });
