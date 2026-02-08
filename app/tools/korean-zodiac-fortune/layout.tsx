import { Metadata } from 'next';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Korean Zodiac Fortune | Daily Horoscope by 띠 | Korea Experience' },
  description: 'Check your daily Korean zodiac fortune (띠)! Get personalized insights on love, wealth, health, career, plus your lucky color and number.',
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
  const toolSchema = generateWebApplicationSchema({
    name: 'Korean Zodiac Fortune Today',
    description: 'Check your daily Korean zodiac fortune (띠)! Get personalized insights on love, wealth, health, career, plus your lucky color and number.',
    url: `${SITE_CONFIG.url}/tools/korean-zodiac-fortune`,
    imageUrl: `${SITE_CONFIG.url}/tools/korean-zodiac-fortune/opengraph-image`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { name: 'Korean Zodiac Fortune Today', item: `${SITE_CONFIG.url}/tools/korean-zodiac-fortune` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
