import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Korean Age & Zodiac Sign Calculator | Korea Experience' },
  description: 'Calculate your Korean age instantly and discover your Chinese zodiac sign (띠) with personality traits, lucky colors, and compatibility.',
  keywords: [
    'korean age calculator',
    'korean age',
    'how old am i in korea',
    'korean age system',
    'korean zodiac',
    'chinese zodiac calculator',
    '띠',
    '12지신',
    'korean age converter',
    'korea age difference',
    'korean birthday age',
    'korea experience'
  ],
  openGraph: {
    title: 'Korean Age Calculator - Find Your Korean Age & Zodiac Sign',
    description: 'Calculate your Korean age instantly! Discover your Chinese zodiac sign (띠) with personality traits and compatibility.',
    url: 'https://www.koreaexperience.com/tools/korean-age',
    siteName: 'Korea Experience',
    type: 'website',
    images: [
      {
        url: '/tools/korean-age/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korean Age Calculator - Korea Experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Age Calculator - Find Your Korean Age & Zodiac Sign',
    description: 'Calculate your Korean age and discover your Chinese zodiac sign! Learn about personality traits and compatibility.',
    images: ['/tools/korean-age/opengraph-image'],
  },
  alternates: {
    canonical: 'https://www.koreaexperience.com/tools/korean-age',
  },
};

export default function KoreanAgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
