import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'What Korean Food Matches Your Personality? | Korea Experience' },
  description: 'Which Korean food matches your personality? Take our fun quiz to find your K-food soulmate — from kimchi to bulgogi and beyond.',
  keywords: [
    'korean food quiz',
    'korean food personality test',
    'what korean food am i',
    'korean cuisine quiz',
    'korean food personality',
    'korean food match',
    'kimchi personality',
    'bibimbap quiz',
    'korean food test',
    'korean cuisine personality',
    'korean food soulmate',
    'korean food character'
  ],
  openGraph: {
    title: 'What Korean Food Matches Your Personality? | Korea Experience',
    description: 'Take our fun personality quiz to discover which Korean food perfectly represents you!',
    type: 'website',
    url: 'https://koreaexperience.com/tools/korean-food-quiz',
    images: [
      {
        url: '/tools/korean-food-quiz/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korea Experience - Korean Food Personality Quiz'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Korean Food Matches Your Personality? | Korea Experience',
    description: 'Take our fun personality quiz to discover which Korean food perfectly represents you!',
    images: ['/tools/korean-food-quiz/opengraph-image']
  },
  alternates: {
    canonical: 'https://koreaexperience.com/tools/korean-food-quiz'
  }
};

export default function KoreanFoodQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
