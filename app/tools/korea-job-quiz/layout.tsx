import { Metadata } from 'next';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'What Job Would You Have in Korea? - Career Quiz | Korea Experience' },
  description: 'What job would you have in Korea? Take our career personality quiz to discover your ideal Korean job with salary info and career paths.',
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
  const toolSchema = generateWebApplicationSchema({
    name: 'What Would Your Job Be in Korea?',
    description: 'What job would you have in Korea? Take our career personality quiz to discover your ideal Korean job with salary info and career paths.',
    url: `${SITE_CONFIG.url}/tools/korea-job-quiz`,
    imageUrl: `${SITE_CONFIG.url}/tools/korea-job-quiz/opengraph-image`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { name: 'What Would Your Job Be in Korea?', item: `${SITE_CONFIG.url}/tools/korea-job-quiz` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
