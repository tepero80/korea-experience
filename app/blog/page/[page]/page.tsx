import { notFound } from 'next/navigation';
import GuideLibrary, { GUIDES_PER_PAGE } from '@/components/site/GuideLibrary';
import { GUIDE_LIBRARY_DESCRIPTION } from '@/lib/constants';
import { getAllPosts } from '@/lib/posts';
import { guideCollectionMetadata } from '@/lib/seo';
type Params = Promise<{ page: string }>;
export const dynamicParams = false;
export function generateStaticParams() {
  return Array.from(
    { length: Math.max(0, Math.ceil(getAllPosts().length / GUIDES_PER_PAGE) - 1) },
    (_, i) => ({ page: String(i + 2) }),
  );
}
export async function generateMetadata({ params }: { params: Params }) {
  const { page } = await params;
  return guideCollectionMetadata(
    `Korea travel guides · Page ${page}`,
    GUIDE_LIBRARY_DESCRIPTION,
    `/blog/page/${page}`,
  );
}
export default async function Page({ params }: { params: Params }) {
  const value = (await params).page;
  const page = Number(value);
  if (
    !Number.isInteger(page) ||
    page < 2 ||
    page > Math.ceil(getAllPosts().length / GUIDES_PER_PAGE)
  )
    notFound();
  return <GuideLibrary page={page} />;
}
