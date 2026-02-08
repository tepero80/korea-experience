import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Korean Name Generator | Get Your Korean Name | Korea Experience' },
  description: 'Get your authentic Korean name based on your English name! Choose male, female, or unisex options with cultural meanings and Hangul spelling.',
  keywords: [
    'korean name generator',
    'korean name',
    'get korean name',
    'korean name meaning',
    'korean name for me',
    'korean name translator',
    'korean name creator',
    'korean baby names',
    'korean name based on english name',
    'korea experience'
  ],
  openGraph: {
    title: 'Korean Name Generator - Get Your Authentic Korean Name',
    description: 'Generate your perfect Korean name based on your English name! Choose from male, female, or unisex options with cultural meanings.',
    url: 'https://www.koreaexperience.com/tools/korean-name',
    siteName: 'Korea Experience',
    type: 'website',
    images: [
      {
        url: '/tools/korean-name/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korean Name Generator - Korea Experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Name Generator - Get Your Authentic Korean Name',
    description: 'Generate your perfect Korean name based on your English name! Free tool with cultural meanings.',
    images: ['/tools/korean-name/opengraph-image'],
  },
  alternates: {
    canonical: 'https://www.koreaexperience.com/tools/korean-name',
  },
};

export default function KoreanNameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
