import type { Metadata } from 'next';
import { TOOL_REVIEWS } from '@/lib/tool-review';
export const metadata: Metadata = {
  title: TOOL_REVIEWS['military-service'].title,
  description: TOOL_REVIEWS['military-service'].explanation,
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://koreaexperience.com/tools/military-service' },
  openGraph: {
    title: TOOL_REVIEWS['military-service'].title,
    description: TOOL_REVIEWS['military-service'].explanation,
  },
  twitter: {
    title: TOOL_REVIEWS['military-service'].title,
    description: TOOL_REVIEWS['military-service'].explanation,
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
