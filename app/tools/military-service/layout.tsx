import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Korean Military Service Calculator | Korea Experience' },
  description: 'Calculate Korean military service requirements based on age and health. Find service duration, branch options, and important deadlines.',
  keywords: [
    'korean military service',
    'military service calculator',
    'korea conscription',
    'mandatory military service korea',
    'korean army service',
    'military service requirements',
    'korea military age',
    'korean military exemption',
    'katusa application',
    'korea military service duration',
    'korean military branches',
    'military service korea foreigners'
  ],
  openGraph: {
    title: 'Korean Military Service Calculator | Check Your Requirements 🪖',
    description: 'Calculate your Korean military service requirements. Find out service duration, branch options, and important deadlines.',
    type: 'website',
    url: 'https://www.koreaexperience.com/tools/military-service',
    siteName: 'Korea Experience',
    locale: 'en_US',
    images: [
      {
        url: '/tools/military-service/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korea Experience - Korean Military Service Calculator'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Military Service Calculator | Check Your Requirements 🪖',
    description: 'Calculate your Korean military service requirements. Essential for Korean men aged 18-35.',
    images: ['/tools/military-service/opengraph-image'],
    creator: '@koreaexperience',
  },
  alternates: {
    canonical: 'https://www.koreaexperience.com/tools/military-service',
  },
  authors: [{ name: 'Korea Experience' }],
  creator: 'Korea Experience',
  publisher: 'Korea Experience',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
