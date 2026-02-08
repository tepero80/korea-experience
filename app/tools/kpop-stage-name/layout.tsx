import { Metadata } from 'next';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'K-Pop Stage Name Generator - Your Idol Name | Korea Experience' },
  description: 'Generate your K-Pop idol stage name! Pick your concept — cute, cool, elegant, or powerful — and get a personalized name with Korean translation.',
  keywords: [
    'kpop stage name generator',
    'kpop name generator',
    'idol name generator',
    'korean stage name',
    'kpop idol name',
    'stage name quiz',
    'kpop concept',
    'idol stage name',
    'korean idol name',
    'kpop star name',
    'generate kpop name',
    'korean celebrity name'
  ],
  openGraph: {
    title: 'K-Pop Stage Name Generator - Find Your Perfect Idol Name',
    description: 'Discover your K-pop idol stage name with Korean translation! Choose your concept and get a name that matches your star potential ✨',
    type: 'website',
    url: 'https://koreaexperience.com/tools/kpop-stage-name',
    images: [
      {
        url: '/tools/kpop-stage-name/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'K-Pop Stage Name Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K-Pop Stage Name Generator - Find Your Perfect Idol Name',
    description: 'Discover your K-pop idol stage name with Korean translation! Choose your concept and get a name that matches your star potential ✨',
    images: ['/tools/kpop-stage-name/opengraph-image'],
  },
  alternates: {
    canonical: 'https://koreaexperience.com/tools/kpop-stage-name',
  },
};

export default function KpopStageNameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toolSchema = generateWebApplicationSchema({
    name: 'K-Pop Stage Name Generator',
    description: 'Generate your K-Pop idol stage name! Pick your concept — cute, cool, elegant, or powerful — and get a personalized name with Korean translation.',
    url: `${SITE_CONFIG.url}/tools/kpop-stage-name`,
    imageUrl: `${SITE_CONFIG.url}/tools/kpop-stage-name/opengraph-image`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { name: 'K-Pop Stage Name Generator', item: `${SITE_CONFIG.url}/tools/kpop-stage-name` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
