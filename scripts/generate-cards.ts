import fs from 'node:fs';
import sharp from 'sharp';
import type { OverlayOptions } from 'sharp';
import { getLaunchGuides } from '../lib/posts';
import media from '../data/media.json';
import { cardFingerprint } from '../lib/card-fingerprint';
import { execFileSync } from 'node:child_process';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
async function text(
  text: string,
  size: number,
  width: number,
  color = '#163632',
  bold = false,
  display = false,
) {
  const font = display ? 'KE Traveler Display' : 'KE Traveler Sans';
  return sharp({
    text: {
      text: `<span foreground="${color}" weight="${bold ? 700 : 400}">${escape(text)}</span>`,
      font: `${font} ${size}`,
      fontfile: `public/fonts/${display ? 'manrope' : 'source-sans-3'}-latin.ttf`,
      width,
      rgba: true,
      spacing: 5,
    },
  })
    .png()
    .toBuffer();
}
async function main() {
  fs.mkdirSync('public/images/cards', { recursive: true });
  const guides = getLaunchGuides();
  const credits: Record<string, unknown> = {};
  for (const post of [
    {
      slug: 'korea-experience',
      title: 'Plan less. Experience more.',
      category: 'KOREA TRAVEL GUIDES, MAPS & TRIP PLANNER',
      excerpt: 'Choose your base, find your way and build days worth remembering.',
      image: '/images/editorial/bukchon.webp',
      checkedAt: undefined,
    },
    ...guides,
  ]) {
    const details = 'editorial' in post ? post.editorial : undefined;
    const credit = media.find((m) => m.src === post.image)?.credit;
    const photo = await sharp('public' + post.image)
      .resize(400, 630, {
        fit: credit?.kind === 'illustration' ? 'contain' : 'cover',
        background: '#f2f7f4',
      })
      .png()
      .toBuffer();
    let title = await text(post.title, 46, 710, '#163632', true, true);
    for (const size of [43, 40, 37]) {
      if ((await sharp(title).metadata()).height! <= 220) break;
      title = await text(post.title, size, 710, '#163632', true, true);
    }
    const titleHeight = (await sharp(title).metadata()).height!;
    const summary = await text(post.excerpt, 21, 710, '#546c68');
    if (titleHeight > 220 || (await sharp(summary).metadata()).height! > 85)
      throw Error(`Card copy needs editing: ${post.slug}`);
    const fact = await text(
      details?.shareFacts[0] ||
        'Practical information for international visitors. Confirm important details for your dates.',
      17,
      710,
      '#315e55',
      true,
    );
    if ((await sharp(fact).metadata()).height! > 64)
      throw Error(`Card fact is too long: ${post.slug}`);
    const layers: OverlayOptions[] = [
      { input: photo, left: 800, top: 0 },
      {
        input: Buffer.from(
          '<svg width="800" height="8"><rect width="800" height="8" fill="#086b66"/></svg>',
        ),
        left: 0,
        top: 0,
      },
      { input: await text('KOREA EXPERIENCE', 21, 710, '#086b66', true, true), left: 40, top: 35 },
      {
        input: await text(post.category.toUpperCase(), 15, 710, '#546c68', true),
        left: 40,
        top: 82,
      },
      { input: title, left: 40, top: 132 },
      { input: summary, left: 40, top: 132 + titleHeight + 24 },
      { input: fact, left: 40, top: 458 },
      {
        input: await text(
          post.checkedAt
            ? 'Checked ' + post.checkedAt + ' · Confirm current conditions'
            : 'Independent guides · Useful planning tools',
          15,
          710,
          '#546c68',
        ),
        left: 40,
        top: 546,
      },
      {
        input: await text(
          'koreaexperience.com' + (post.slug === 'korea-experience' ? '' : '/blog/' + post.slug),
          13,
          710,
          '#163632',
        ),
        left: 40,
        top: 586,
      },
    ];
    if (credit) {
      layers.push({
        input: Buffer.from(
          '<svg width="400" height="96"><rect width="400" height="96" fill="#163632" fill-opacity=".93"/></svg>',
        ),
        left: 800,
        top: 534,
      });
      layers.push({
        input: await text(
          `${credit.kind === 'illustration' ? 'Illustration' : credit.kind === 'video-still' ? 'Video still' : 'Photo'}: ${credit.author} · ${credit.license}`,
          13,
          360,
          '#ffffff',
        ),
        left: 820,
        top: 549,
      });
      layers.push({
        input: await text('Source & reuse: koreaexperience.com/image-credits', 11, 360, '#ffffff'),
        left: 820,
        top: 604,
      });
    }
    await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
      .composite(layers)
      .jpeg({ quality: 85 })
      .toFile(`public/images/cards/${post.slug}.jpg`);
    credits[post.slug] = {
      src: `/images/cards/${post.slug}.jpg`,
      fingerprint: cardFingerprint(post),
      sourceImage: post.image,
      credit,
      adaptation:
        credit?.kind === 'illustration'
          ? 'Illustration contained in a social preview composition; it does not depict a real facility.'
          : credit?.kind === 'video-still'
            ? 'Cropped video still in a social preview composition. The source license also applies to the adapted card.'
            : 'Cropped photograph in a social preview composition. Share-alike photo licenses also apply to the adapted card.',
    };
  }
  fs.writeFileSync('data/card-credits.json', JSON.stringify(credits, null, 2) + '\n');
  // Use the same routing implementation as prebuild rather than a second redirect generator.
  execFileSync(process.execPath, ['--import', 'tsx', 'scripts/generate-routing.ts'], {
    stdio: 'inherit',
  });
  console.log(`Prepared ${guides.length + 1} cards with the bundled, licensed typefaces.`);
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
