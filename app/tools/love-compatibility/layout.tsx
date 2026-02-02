import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Korean Love Compatibility Calculator - Zodiac & Blood Type Match | Korea Experience',
  description: 'Check your love compatibility using Korean zodiac signs, blood types, and birth dates! Get detailed relationship advice, strengths, weaknesses, and your couple nickname. Based on Korean traditional compatibility methods.',
  keywords: [
    'korean love compatibility',
    'love compatibility calculator',
    'zodiac compatibility',
    'blood type compatibility',
    'korean zodiac',
    'couple compatibility test',
    'relationship compatibility',
    'korean astrology',
    'blood type personality',
    'couple nickname generator',
    'love match calculator',
    'korean dating compatibility'
  ],
  openGraph: {
    title: 'Korean Love Compatibility Calculator - Zodiac & Blood Type Match',
    description: 'Check your love compatibility using Korean zodiac signs and blood types! Get personalized relationship advice and your couple nickname 💕',
    type: 'website',
    url: 'https://koreaexperience.com/tools/love-compatibility',
    images: [
      {
        url: 'https://koreaexperience.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Korean Love Compatibility Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Love Compatibility Calculator - Zodiac & Blood Type Match',
    description: 'Check your love compatibility using Korean zodiac signs and blood types! Get personalized relationship advice and your couple nickname 💕',
    images: ['https://koreaexperience.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://koreaexperience.com/tools/love-compatibility',
  },
};

export default function LoveCompatibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
