import type { Metadata } from 'next';
import GuideLibrary from '@/components/site/GuideLibrary';
import { GUIDE_FEED_TYPES } from '@/lib/constants';
export const metadata: Metadata = {
  title: 'Practical Korea travel guides',
  description:
    'Find Korea travel guides by what you need to decide: arrival, transport, accommodation, routes, food, shopping and everyday essentials.',
  alternates: { canonical: 'https://koreaexperience.com/blog', types: GUIDE_FEED_TYPES },
};
export default function Blog() {
  return <GuideLibrary />;
}
