import { notFound } from 'next/navigation';
import { PRACTICAL_TOOLS } from '@/lib/constants';
import { PLACES } from '@/lib/editorial';
import TravelTool from '@/components/site/TravelTool';
import { toolMetadata } from '@/lib/seo';
import { toolPreviewFor } from '@/lib/tool-preview';
type Params = Promise<{ slug: string }>;
export const dynamicParams = false;
export function generateStaticParams() {
  return PRACTICAL_TOOLS.filter((t) => t.href !== '/tools/trip-budget').map((t) => ({
    slug: t.href.split('/').pop()!,
  }));
}
export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const t = toolPreviewFor(slug);
  return t ? toolMetadata(t) : { robots: { index: false } };
}
export default async function Tool({ params }: { params: Params }) {
  const { slug } = await params;
  const t = PRACTICAL_TOOLS.find((t) => t.href === '/tools/' + slug);
  if (!t) notFound();
  return (
    <TravelTool
      slug={slug}
      title={t.title}
      description={t.description}
      places={PLACES.filter((p) =>
        ['seoul-craft-museum', 'national-museum-korea', 'gwangjang-market'].includes(p.id),
      )}
    />
  );
}
