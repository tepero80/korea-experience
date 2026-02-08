import { Metadata } from 'next';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Which K-Drama Character Are You? | Korea Experience' },
  description: 'Take our fun personality quiz to discover which K-Drama character archetype matches you! From chaebol heirs to prosecutors, find your K-Drama match.',
  keywords: [
    'kdrama character quiz',
    'korean drama personality test',
    'which kdrama character am i',
    'kdrama archetype quiz',
    'korean drama quiz',
    'kdrama personality test',
    'kdrama character personality',
    'korean drama characters',
    'kdrama quiz',
    'korean drama archetype',
    'kdrama character types',
    'korean drama character test'
  ],
  openGraph: {
    title: 'Which K-Drama Character Are You? | Korea Experience',
    description: 'Take our fun personality quiz to discover which K-Drama character archetype matches you!',
    type: 'website',
    url: 'https://koreaexperience.com/tools/kdrama-character',
    images: [
      {
        url: '/tools/kdrama-character/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korea Experience - K-Drama Character Quiz'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Which K-Drama Character Are You? | Korea Experience',
    description: 'Take our fun personality quiz to discover which K-Drama character archetype matches you!',
    images: ['/tools/kdrama-character/opengraph-image']
  },
  alternates: {
    canonical: 'https://koreaexperience.com/tools/kdrama-character'
  }
};

export default function KDramaCharacterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toolSchema = generateWebApplicationSchema({
    name: 'Which K-Drama Character Are You?',
    description: 'Take our fun personality quiz to discover which K-Drama character archetype matches you! From chaebol heirs to prosecutors, find your K-Drama match.',
    url: `${SITE_CONFIG.url}/tools/kdrama-character`,
    imageUrl: `${SITE_CONFIG.url}/tools/kdrama-character/opengraph-image`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { name: 'Which K-Drama Character Are You?', item: `${SITE_CONFIG.url}/tools/kdrama-character` },
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
