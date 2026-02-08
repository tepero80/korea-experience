import { Metadata } from 'next';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Korean Couple Name Combiner - Cute Nicknames | Korea Experience' },
  description: 'Combine two names to create the perfect couple nickname! Get 5 unique variations in English and Korean. Perfect for couples, best friends, and K-drama fans. 💕',
  keywords: [
    'couple name combiner',
    'couple nickname generator',
    'ship name generator',
    'korean couple name',
    'couple name maker',
    'relationship nickname',
    'couple name ideas',
    'korean couple nickname',
    'cute couple names',
    'combine names together',
    'couple ship name',
    'relationship name generator'
  ],
  openGraph: {
    title: 'Korean Couple Name Combiner | Create Your Perfect Nickname 💕',
    description: 'Combine two names to create the perfect couple nickname! Get 5 unique variations in English and Korean.',
    type: 'website',
    url: 'https://www.koreaexperience.com/tools/couple-name',
    siteName: 'Korea Experience',
    locale: 'en_US',
    images: [
      {
        url: '/tools/couple-name/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korea Experience - Korean Couple Name Combiner'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Couple Name Combiner | Create Your Perfect Nickname 💕',
    description: 'Combine two names to create the perfect couple nickname! Get 5 unique variations.',
    images: ['/tools/couple-name/opengraph-image'],
    creator: '@koreaexperience',
  },
  alternates: {
    canonical: 'https://www.koreaexperience.com/tools/couple-name',
  },
  authors: [{ name: 'Korea Experience' }],
  creator: 'Korea Experience',
  publisher: 'Korea Experience',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const toolSchema = generateWebApplicationSchema({
    name: 'Korean Couple Name Combiner',
    description: 'Combine two names to create the perfect couple nickname! Get 5 unique variations in English and Korean. Perfect for couples, best friends, and K-drama fans. 💕',
    url: `${SITE_CONFIG.url}/tools/couple-name`,
    imageUrl: `${SITE_CONFIG.url}/tools/couple-name/opengraph-image`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { name: 'Korean Couple Name Combiner', item: `${SITE_CONFIG.url}/tools/couple-name` },
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
