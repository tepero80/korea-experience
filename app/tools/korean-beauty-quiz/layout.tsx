import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Korean Beauty Routine Quiz | K-Beauty Skincare | Korea Experience' },
  description: 'Find your perfect K-Beauty skincare routine! Take our 5-question skin type quiz for personalized Korean beauty product recommendations.',
  keywords: [
    'korean beauty quiz',
    'k-beauty routine',
    'korean skincare routine',
    'skin type quiz',
    'k-beauty recommendations',
    'korean skincare quiz',
    'beauty routine finder',
    'korean cosmetics guide',
    'k-beauty products',
    'korean skincare steps',
    'glass skin routine',
    'k-beauty skincare'
  ],
  openGraph: {
    title: 'Korean Beauty Routine Quiz | Find Your Perfect K-Beauty ✨',
    description: 'Take our quiz to discover your skin type and get personalized Korean skincare recommendations!',
    type: 'website',
    url: 'https://www.koreaexperience.com/tools/korean-beauty-quiz',
    siteName: 'Korea Experience',
    locale: 'en_US',
    images: [
      {
        url: '/tools/korean-beauty-quiz/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korea Experience - Korean Beauty Routine Quiz'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Beauty Routine Quiz | Find Your Perfect K-Beauty ✨',
    description: 'Discover your skin type and get personalized K-beauty routine recommendations!',
    images: ['/tools/korean-beauty-quiz/opengraph-image'],
    creator: '@koreaexperience',
  },
  alternates: {
    canonical: 'https://www.koreaexperience.com/tools/korean-beauty-quiz',
  },
  authors: [{ name: 'Korea Experience' }],
  creator: 'Korea Experience',
  publisher: 'Korea Experience',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
