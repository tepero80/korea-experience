import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Which Korean City Should You Live In? | Korea Experience' },
  description: 'Seoul, Busan, or Jeju? Take our lifestyle quiz to discover which Korean city matches your personality, career goals, and budget.',
  keywords: [
    'korean city quiz',
    'where to live in korea',
    'best korean city',
    'seoul vs busan',
    'living in korea quiz',
    'korean city comparison',
    'expat korea city',
    'korea lifestyle quiz',
    'best city for expats korea',
    'korean city personality test',
    'jeju vs seoul',
    'korea city guide'
  ],
  openGraph: {
    title: 'Which Korean City Should You Live In? - Interactive Quiz',
    description: 'Discover your perfect Korean city match! Take our quiz to find out whether Seoul, Busan, Jeju, or another city fits your lifestyle.',
    type: 'website',
    url: 'https://koreaexperience.com/tools/korean-city-quiz',
    images: [
      {
        url: '/tools/korean-city-quiz/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korean City Quiz - Find Your Perfect City'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Which Korean City Should You Live In? Quiz',
    description: 'Find your perfect Korean city match with our interactive lifestyle quiz!',
    images: ['/tools/korean-city-quiz/opengraph-image']
  },
  alternates: {
    canonical: 'https://koreaexperience.com/tools/korean-city-quiz'
  }
};

export default function KoreanCityQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
