import type { Metadata } from 'next';
import GuideLibrary from '@/components/site/GuideLibrary';
export const metadata: Metadata = {
  title: 'Practical Korea travel guides',
  description:
    'Find Korea travel guides by what you need to decide: arrival, transport, accommodation, routes, food, shopping and everyday essentials.',
  alternates: { canonical: 'https://koreaexperience.com/blog' },
};
export default function Blog() {
  return <GuideLibrary />;
}
