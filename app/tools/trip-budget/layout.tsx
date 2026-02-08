import { Metadata } from 'next';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Korea Trip Budget Calculator | Korea Experience' },
  description: 'Plan your Korea trip budget with cost estimates for hotels, food, activities, transport, and shopping. Customize by travel style and duration.',
  keywords: [
    'korea trip budget calculator',
    'korea travel cost',
    'seoul trip budget',
    'korea vacation cost',
    'korea travel expenses',
    'korea trip planner',
    'korea budget travel',
    'korea travel calculator',
    'korea trip cost estimator',
    'korea travel budget 2026',
    'seoul vacation cost',
    'korea travel planning'
  ],
  openGraph: {
    title: 'Korea Trip Budget Calculator - Plan Your Perfect Korea Vacation',
    description: 'Calculate your Korea trip budget with our interactive tool. Get detailed cost estimates for accommodation, food, activities, and more.',
    type: 'website',
    url: 'https://www.koreaexperience.com/tools/trip-budget',
    siteName: 'Korea Experience',
    images: [
      {
        url: '/tools/trip-budget/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korea Trip Budget Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korea Trip Budget Calculator',
    description: 'Calculate your Korea trip budget with our interactive tool. Get detailed cost estimates for your perfect Korean adventure.',
    images: ['/tools/trip-budget/opengraph-image'],
  },
  alternates: {
    canonical: 'https://www.koreaexperience.com/tools/trip-budget',
  },
};

export default function TripBudgetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toolSchema = generateWebApplicationSchema({
    name: 'Korea Trip Budget Calculator',
    description: 'Plan your Korea trip budget with cost estimates for hotels, food, activities, transport, and shopping. Customize by travel style and duration.',
    url: `${SITE_CONFIG.url}/tools/trip-budget`,
    imageUrl: `${SITE_CONFIG.url}/tools/trip-budget/opengraph-image`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { name: 'Korea Trip Budget Calculator', item: `${SITE_CONFIG.url}/tools/trip-budget` },
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
