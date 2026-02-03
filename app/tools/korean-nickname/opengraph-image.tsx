import { generateOGImage } from '@/lib/og-image-generator';

export const runtime = 'edge';
export const dynamic = 'force-static';
export const revalidate = false;
export const alt = 'Korean Nickname Generator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return generateOGImage({
    emoji: '🏷️',
    title: 'Korean Nickname Generator',
    description: 'Get your perfect Korean nickname! Generate cute, cool, or unique Korean-style nicknames.',
    category: 'Discover Yourself'
  });
}
