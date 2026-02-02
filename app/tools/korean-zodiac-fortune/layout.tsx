import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Korean Zodiac Fortune Today | Daily Horoscope Based on 띠 | Korea Experience',
  description: 'Check your daily fortune based on Korean zodiac (띠)! Get personalized insights on love, wealth, health, and career. Discover your lucky color and number. Updated daily! 🔮',
  keywords: [
    'korean zodiac fortune',
    'korean horoscope',
    '띠 fortune',
    'daily fortune korea',
    'korean zodiac today',
    'saju fortune',
    'korean astrology',
    'zodiac luck',
    'daily horoscope korean',
    'korean fortune telling',
    'lucky color today',
    'lucky number korean'
  ],
  openGraph: {
    title: 'Korean Zodiac Fortune Today | Daily Horoscope 🔮',
    description: 'Check your daily fortune based on Korean zodiac! Love, wealth, health & career insights. Get your lucky color & number! Updated every day! ✨',
    type: 'website',
    url: 'https://www.koreaexperience.com/tools/korean-zodiac-fortune',
    siteName: 'Korea Experience',
    locale: 'en_US',
    images: [
      {
        url: '/tools/korean-zodiac-fortune/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korea Experience - Korean Zodiac Fortune Today'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Zodiac Fortune Today | Daily Horoscope 🔮',
    description: 'Check your daily fortune based on Korean zodiac! Love, wealth, health & career insights. Updated every day! ✨',
    images: ['/tools/korean-zodiac-fortune/opengraph-image'],
    creator: '@koreaexperience',
  },
  alternates: {
    canonical: 'https://www.koreaexperience.com/tools/korean-zodiac-fortune',
  },
  authors: [{ name: 'Korea Experience' }],
  creator: 'Korea Experience',
  publisher: 'Korea Experience',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
