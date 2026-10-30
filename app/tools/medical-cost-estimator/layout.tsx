import type { Metadata } from 'next';
import { TOOL_REVIEWS } from '@/lib/tool-review';
export const metadata: Metadata = {
  title: TOOL_REVIEWS['medical-cost-estimator'].title,
  description: TOOL_REVIEWS['medical-cost-estimator'].explanation,
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://koreaexperience.com/tools/medical-cost-estimator' },
  openGraph: {
    title: TOOL_REVIEWS['medical-cost-estimator'].title,
    description: TOOL_REVIEWS['medical-cost-estimator'].explanation,
  },
  twitter: {
    title: TOOL_REVIEWS['medical-cost-estimator'].title,
    description: TOOL_REVIEWS['medical-cost-estimator'].explanation,
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
