import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Your Ideal Korean Partner Type',
  description: 'Discover your ideal Korean partner type based on personality and values. Take our quiz to find out what kind of Korean partner matches your relationship style and preferences perfectly!',
  keywords: ['ideal Korean partner', 'Korean dating quiz', 'Korean relationship', 'Korean partner type', 'dating in Korea', 'Korean romance', 'partner quiz'],
  openGraph: {
    title: 'Your Ideal Korean Partner Type | Korea Experience',
    description: 'Find your perfect Korean partner type based on personality and values.',
    url: `${SITE_CONFIG.url}/tools/ideal-korean-partner`,
    siteName: SITE_CONFIG.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/tools/ideal-korean-partner/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Ideal Korean Partner Quiz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Ideal Korean Partner Type',
    description: 'Discover your ideal Korean partner',
    creator: SITE_CONFIG.social.twitter,
    images: ['/tools/ideal-korean-partner/opengraph-image'],
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/tools/ideal-korean-partner`,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
