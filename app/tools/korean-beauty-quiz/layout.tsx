import type { Metadata } from 'next';
import { TOOL_REVIEWS } from '@/lib/tool-review';
export const metadata: Metadata = {
  title: TOOL_REVIEWS['korean-beauty-quiz'].title,
  description: TOOL_REVIEWS['korean-beauty-quiz'].explanation,
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://koreaexperience.com/tools/korean-beauty-quiz' },
  openGraph: {
    title: TOOL_REVIEWS['korean-beauty-quiz'].title,
    description: TOOL_REVIEWS['korean-beauty-quiz'].explanation,
  },
  twitter: {
    title: TOOL_REVIEWS['korean-beauty-quiz'].title,
    description: TOOL_REVIEWS['korean-beauty-quiz'].explanation,
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
