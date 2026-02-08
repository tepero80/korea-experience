import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Free Korea Tools & Quizzes | Korea Experience' },
  description: 'Try 20+ free interactive Korea tools: name generator, age calculator, K-drama quiz, trip budget planner, love compatibility, and more.',
  openGraph: {
    title: 'Free Korea Tools & Quizzes | Korea Experience',
    description: 'Try 20+ free interactive Korea tools: name generator, age calculator, K-drama quiz, trip budget planner, and more.',
    url: 'https://koreaexperience.com/tools',
    siteName: 'Korea Experience',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Korea Tools & Quizzes | Korea Experience',
    description: 'Try 20+ free interactive Korea tools and quizzes.',
  },
  alternates: {
    canonical: 'https://koreaexperience.com/tools',
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
