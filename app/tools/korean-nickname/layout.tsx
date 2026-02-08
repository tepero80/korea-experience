import { Metadata } from 'next';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: { absolute: 'Korean Nickname Generator | Korea Experience' },
  description: 'Generate cute, cool, or unique Korean nicknames based on your name! Get personalized Korean-style nicknames with Hangul spelling and meanings.',
  openGraph: {
    title: 'Korean Nickname Generator | Korea Experience',
    description: 'Generate cute, cool, or unique Korean nicknames based on your name!',
    url: 'https://koreaexperience.com/tools/korean-nickname',
    siteName: 'Korea Experience',
    type: 'website',
    images: [
      {
        url: '/tools/korean-nickname/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korean Nickname Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Korean Nickname Generator',
    description: 'Generate cute, cool, or unique Korean nicknames based on your name!',
    images: ['/tools/korean-nickname/opengraph-image'],
  },
  alternates: {
    canonical: 'https://koreaexperience.com/tools/korean-nickname',
  },
};

export default function KoreanNicknameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toolSchema = generateWebApplicationSchema({
    name: 'Korean Nickname Generator',
    description: 'Generate cute, cool, or unique Korean nicknames based on your name! Get personalized Korean-style nicknames with Hangul spelling and meanings.',
    url: `${SITE_CONFIG.url}/tools/korean-nickname`,
    imageUrl: `${SITE_CONFIG.url}/tools/korean-nickname/opengraph-image`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: SITE_CONFIG.url },
    { name: 'Tools', item: `${SITE_CONFIG.url}/tools` },
    { name: 'Korean Nickname Generator', item: `${SITE_CONFIG.url}/tools/korean-nickname` },
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
