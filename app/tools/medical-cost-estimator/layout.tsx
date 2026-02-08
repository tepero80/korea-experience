import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Medical Tourism Cost Estimator | Korea Experience' },
  description: 'Estimate your medical procedure costs in Korea: plastic surgery, dental, dermatology, and more. Includes accommodation and travel costs.',
  keywords: ['Korea medical tourism', 'medical cost calculator', 'plastic surgery Korea', 'Gangnam clinic', 'medical tourism cost', 'Korea surgery price', 'medical procedure estimate'],
  openGraph: {
    title: 'Medical Tourism Cost Estimator | Korea Experience',
    description: 'Calculate your medical procedure costs in Korea including accommodation, meals, and travel expenses.',
    url: `${SITE_CONFIG.url}/tools/medical-cost-estimator`,
    siteName: SITE_CONFIG.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/tools/medical-cost-estimator/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Medical Tourism Cost Estimator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medical Tourism Cost Estimator',
    description: 'Estimate medical procedure costs in Korea',
    creator: SITE_CONFIG.social.twitter,
    images: ['/tools/medical-cost-estimator/opengraph-image'],
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/tools/medical-cost-estimator`,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
