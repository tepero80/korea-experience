import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'K-Pop Stage Name Generator - Your Idol Name | Korea Experience' },
  description: 'Discover your K-pop idol stage name! Choose your concept (cute, cool, elegant, powerful) and get a personalized stage name with Korean translation, meaning, and similar K-pop idols. Perfect for K-pop fans!',
  keywords: [
    'kpop stage name generator',
    'kpop name generator',
    'idol name generator',
    'korean stage name',
    'kpop idol name',
    'stage name quiz',
    'kpop concept',
    'idol stage name',
    'korean idol name',
    'kpop star name',
    'generate kpop name',
    'korean celebrity name'
  ],
  openGraph: {
    title: 'K-Pop Stage Name Generator - Find Your Perfect Idol Name',
    description: 'Discover your K-pop idol stage name with Korean translation! Choose your concept and get a name that matches your star potential ✨',
    type: 'website',
    url: 'https://koreaexperience.com/tools/kpop-stage-name',
    images: [
      {
        url: '/tools/kpop-stage-name/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'K-Pop Stage Name Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K-Pop Stage Name Generator - Find Your Perfect Idol Name',
    description: 'Discover your K-pop idol stage name with Korean translation! Choose your concept and get a name that matches your star potential ✨',
    images: ['/tools/kpop-stage-name/opengraph-image'],
  },
  alternates: {
    canonical: 'https://koreaexperience.com/tools/kpop-stage-name',
  },
};

export default function KpopStageNameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
