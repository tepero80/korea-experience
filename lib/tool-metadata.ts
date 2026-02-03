import { Metadata } from 'next';

interface ToolMetadataConfig {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  emoji: string;
}

export function generateToolMetadata({
  slug,
  title,
  description,
  category,
  keywords,
  emoji
}: ToolMetadataConfig): Metadata {
  const baseUrl = 'https://www.koreaexperience.com';
  const toolUrl = `${baseUrl}/tools/${slug}`;
  
  return {
    title: `${title} | Korea Experience`,
    description: description,
    keywords: keywords.join(', '),
    openGraph: {
      type: 'website',
      url: toolUrl,
      title: title,
      description: description,
      images: [{
        url: `${toolUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: title
      }],
      siteName: 'Korea Experience'
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [`${toolUrl}/opengraph-image`],
    },
    alternates: {
      canonical: toolUrl
    },
    robots: {
      index: true,
      follow: true
    }
  };
}
