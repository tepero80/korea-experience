import { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Korean Emoji Name Generator | Transform Your Name | Korea Experience' },
  description: 'Turn your name into beautiful Korean-style emojis! Choose cute, cool, or elegant styles. Perfect for Instagram bios and social media profiles.',
  keywords: [
    'emoji name generator',
    'korean emoji name',
    'emoji name maker',
    'name to emoji',
    'instagram bio emojis',
    'cute emoji name',
    'cool emoji name',
    'elegant emoji name',
    'emoji converter',
    'social media emojis',
    'emoji nickname',
    'korean name emojis'
  ],
  openGraph: {
    title: 'Your Korean Emoji Name | Transform Your Name ✨',
    description: 'Turn your name into beautiful emojis! Choose from cute, cool, or elegant styles. Perfect for Instagram bios!',
    type: 'website',
    url: 'https://www.koreaexperience.com/tools/emoji-name',
    siteName: 'Korea Experience',
    locale: 'en_US',
    images: [
      {
        url: '/tools/emoji-name/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Korea Experience - Korean Emoji Name Generator'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Korean Emoji Name | Transform Your Name ✨',
    description: 'Turn your name into beautiful emojis! Choose from cute, cool, or elegant styles.',
    images: ['/tools/emoji-name/opengraph-image'],
    creator: '@koreaexperience',
  },
  alternates: {
    canonical: 'https://www.koreaexperience.com/tools/emoji-name',
  },
  authors: [{ name: 'Korea Experience' }],
  creator: 'Korea Experience',
  publisher: 'Korea Experience',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
