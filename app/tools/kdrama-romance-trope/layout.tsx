import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Your K-Drama Romance Trope | Love Story Quiz | Korea Experience' },
  description: 'Discover your perfect K-Drama romance trope! From chaebol romance to enemies-to-lovers, find out which classic Korean drama love story matches your personality. Take the quiz now!',
  keywords: [
    'kdrama romance trope',
    'kdrama romance quiz',
    'korean drama love story',
    'kdrama romance types',
    'chaebol romance',
    'enemies to lovers kdrama',
    'kdrama trope quiz',
    'korean drama romance',
    'kdrama love story test',
    'korean romance tropes',
    'which kdrama romance',
    'kdrama personality quiz'
  ],
  openGraph: {
    title: 'Your K-Drama Romance Trope | Which Love Story Matches You? 💕',
    description: 'Discover your perfect K-Drama romance trope! From chaebol romance to enemies-to-lovers, find out which classic Korean drama love story is meant for you!',
    type: 'website',
    url: 'https://www.koreaexperience.com/tools/kdrama-romance-trope',
    siteName: 'Korea Experience',
    locale: 'en_US',
    images: [
      {
        url: '/tools/kdrama-romance-trope/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korea Experience - K-Drama Romance Trope Quiz'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your K-Drama Romance Trope | Which Love Story Matches You? 💕',
    description: 'Discover your perfect K-Drama romance trope! From chaebol romance to enemies-to-lovers, find out which love story is meant for you!',
    images: ['/tools/kdrama-romance-trope/opengraph-image'],
    creator: '@koreaexperience',
  },
  alternates: {
    canonical: 'https://www.koreaexperience.com/tools/kdrama-romance-trope',
  },
  authors: [{ name: 'Korea Experience' }],
  creator: 'Korea Experience',
  publisher: 'Korea Experience',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
