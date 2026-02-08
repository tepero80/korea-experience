import { Metadata } from 'next';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Korean Business Name Generator | Korea Experience' },
  description: 'Generate creative Korean business names for your cafe, restaurant, or startup. Get unique Korean-English name combos with brand stories.',
  keywords: [
    'korean business name generator',
    'korean business name',
    'korean cafe name',
    'korean restaurant name',
    'korean brand name',
    'korean company name',
    'business name korea',
    'korean business naming',
    'korean brand naming',
    'cafe name generator',
    'restaurant name ideas',
    'korean startup name'
  ],
  openGraph: {
    title: 'Korean Business Name Generator | Korea Experience',
    description: 'Generate the perfect Korean business name for your cafe, restaurant, beauty salon, or startup.',
    type: 'website',
    url: 'https://koreaexperience.com/tools/business-name',
    images: [
      {
        url: '/tools/business-name/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korea Experience - Korean Business Name Generator'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Business Name Generator | Korea Experience',
    description: 'Generate the perfect Korean business name for your cafe, restaurant, beauty salon, or startup.',
    images: ['/tools/business-name/opengraph-image']
  },
  alternates: {
    canonical: 'https://koreaexperience.com/tools/business-name'
  }
};

export default function BusinessNameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toolSchema = generateWebApplicationSchema({
    name: 'Korean Business Name Generator',
    description: 'Generate creative Korean business names for your cafe, restaurant, or startup. Get unique Korean-English name combos with brand stories.',
    url: `${SITE_CONFIG.url}/tools/business-name`,
    imageUrl: `${SITE_CONFIG.url}/tools/business-name/opengraph-image`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { name: 'Korean Business Name Generator', item: `${SITE_CONFIG.url}/tools/business-name` },
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
