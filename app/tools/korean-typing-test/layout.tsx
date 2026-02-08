import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Korean Typing Speed Test | Hangul Skills | Korea Experience' },
  description: 'Test your Korean typing speed and accuracy! Measure your Hangul WPM with beginner, intermediate, and advanced Korean text challenges.',
  keywords: [
    'korean typing test',
    'hangul typing speed',
    'korean typing practice',
    'typing speed test korean',
    'korean keyboard test',
    'hangul typing game',
    'korean typing wpm',
    'korean typing accuracy',
    'learn korean typing',
    'korean typing skills',
    'korean language typing',
    'korean typing online',
  ],
  openGraph: {
    title: 'Korean Typing Speed Test | Measure Your Hangul Typing Skills',
    description: 'Test your Korean typing speed and accuracy! Practice with different difficulty levels and track your progress.',
    url: 'https://koreaexperience.com/tools/korean-typing-test',
    type: 'website',
    images: [
      {
        url: '/tools/korean-typing-test/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korean Typing Speed Test',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Typing Speed Test',
    description: 'Test your Korean typing speed and accuracy!',
    images: ['/tools/korean-typing-test/opengraph-image'],
  },
  alternates: {
    canonical: 'https://koreaexperience.com/tools/korean-typing-test',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
