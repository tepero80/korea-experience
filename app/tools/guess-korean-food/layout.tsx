import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Guess Korean Food Quiz | Test K-Food Knowledge | Korea Experience' },
  description: 'Can you identify 20 Korean dishes from photos? Test your K-food knowledge with our interactive quiz and learn fun facts about each dish.',
  keywords: [
    'korean food quiz',
    'guess korean food',
    'korean cuisine game',
    'k-food quiz',
    'korean food trivia',
    'korean dish identifier',
    'learn korean food',
    'korean food game',
    'bibimbap quiz',
    'kimchi game',
    'korean food challenge',
    'k-food trivia'
  ],
  openGraph: {
    title: 'Guess Korean Food Photo Quiz | Test Your Knowledge 🍜',
    description: 'Can you identify these Korean dishes? Test your K-food knowledge with our fun interactive quiz!',
    type: 'website',
    url: 'https://www.koreaexperience.com/tools/guess-korean-food',
    siteName: 'Korea Experience',
    locale: 'en_US',
    images: [
      {
        url: '/tools/guess-korean-food/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korea Experience - Guess Korean Food Quiz'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guess Korean Food Photo Quiz | Test Your Knowledge 🍜',
    description: 'Can you identify these Korean dishes? Test your K-food knowledge!',
    images: ['/tools/guess-korean-food/opengraph-image'],
    creator: '@koreaexperience',
  },
  alternates: {
    canonical: 'https://www.koreaexperience.com/tools/guess-korean-food',
  },
  authors: [{ name: 'Korea Experience' }],
  creator: 'Korea Experience',
  publisher: 'Korea Experience',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
