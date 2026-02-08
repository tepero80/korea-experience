import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'What Job Would You Have in Korea? - Career Quiz | Korea Experience' },
  description: 'Take our fun quiz to discover your perfect Korean career! From K-pop idol to Samsung engineer, find out which Korean job matches your personality. 16 detailed job results with salary info and career paths.',
  keywords: [
    'korea job quiz',
    'korean career quiz',
    'jobs in korea',
    'working in korea',
    'korea career test',
    'korean job finder',
    'korea job personality test',
    'what job in korea',
    'korean career match',
    'korea experience'
  ],
  openGraph: {
    title: 'What Job Would You Have in Korea? - Career Quiz',
    description: 'Take our fun quiz to discover your perfect Korean career! From K-pop idol to Samsung engineer. 16 detailed job results.',
    url: 'https://www.koreaexperience.com/tools/korea-job-quiz',
    siteName: 'Korea Experience',
    type: 'website',
    images: [
      {
        url: '/tools/korea-job-quiz/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korea Job Quiz - Korea Experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Job Would You Have in Korea? - Career Quiz',
    description: 'Take our fun quiz to discover your perfect Korean career! 16 detailed job results with personality match.',
    images: ['/tools/korea-job-quiz/opengraph-image'],
  },
  alternates: {
    canonical: 'https://www.koreaexperience.com/tools/korea-job-quiz',
  },
};

export default function KoreaJobQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
