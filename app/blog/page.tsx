import GuideLibrary from '@/components/site/GuideLibrary';
import { GUIDE_LIBRARY_DESCRIPTION } from '@/lib/constants';
import { guideCollectionMetadata } from '@/lib/seo';
export const metadata = guideCollectionMetadata(
  'Korea travel guides',
  GUIDE_LIBRARY_DESCRIPTION,
  '/blog',
);
export default function Blog() {
  return <GuideLibrary />;
}
