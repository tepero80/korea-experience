import { Metadata } from 'next';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Korean Convenience Store Meal Builder | Korea Experience' },
  description: 'Build the perfect Korean convenience store meal combo! Pick your budget and meal type to get curated GS25, CU, and 7-Eleven recommendations.',
  openGraph: {
    title: 'Korean Convenience Store Meal Builder | Korea Experience',
    description: 'Build the perfect Korean convenience store meal combo on any budget!',
    url: 'https://koreaexperience.com/tools/convenience-store-meals',
    siteName: 'Korea Experience',
    type: 'website',
    images: [
      {
        url: '/tools/convenience-store-meals/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korean Convenience Store Meal Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Convenience Store Meal Builder',
    description: 'Build the perfect Korean convenience store meal combo on any budget!',
    images: ['/tools/convenience-store-meals/opengraph-image'],
  },
  alternates: {
    canonical: 'https://koreaexperience.com/tools/convenience-store-meals',
  },
};

export default function ConvenienceStoreMealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toolSchema = generateWebApplicationSchema({
    name: 'Convenience Store Meal Builder',
    description: 'Build the perfect Korean convenience store meal combo! Pick your budget and meal type to get curated GS25, CU, and 7-Eleven recommendations.',
    url: `${SITE_CONFIG.url}/tools/convenience-store-meals`,
    imageUrl: `${SITE_CONFIG.url}/tools/convenience-store-meals/opengraph-image`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { name: 'Convenience Store Meal Builder', item: `${SITE_CONFIG.url}/tools/convenience-store-meals` },
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
