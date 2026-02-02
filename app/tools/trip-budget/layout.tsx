import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Korea Trip Budget Calculator - Plan Your Perfect Korea Vacation',
  description: 'Calculate your Korea trip budget with our interactive tool. Get detailed cost estimates for accommodation, food, activities, transportation, and shopping. Plan your perfect Korean adventure in 2026.',
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
  return children;
}
