import { Metadata } from 'next';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Korean Love Compatibility - Zodiac & Blood Type | Korea Experience' },
  description: 'Check your Korean love compatibility using zodiac signs, blood types, and birth dates. Get relationship advice and your couple nickname.',
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
        url: '/tools/love-compatibility/opengraph-image',
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
    images: ['/tools/love-compatibility/opengraph-image'],
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
  const toolSchema = generateWebApplicationSchema({
    name: 'Korean Love Compatibility Calculator',
    description: 'Check your Korean love compatibility using zodiac signs, blood types, and birth dates. Get relationship advice and your couple nickname.',
    url: `${SITE_CONFIG.url}/tools/love-compatibility`,
    imageUrl: `${SITE_CONFIG.url}/tools/love-compatibility/opengraph-image`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { name: 'Korean Love Compatibility Calculator', item: `${SITE_CONFIG.url}/tools/love-compatibility` },
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
