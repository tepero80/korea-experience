import fs from 'node:fs';
import sharp from 'sharp';
import type { OverlayOptions } from 'sharp';
import { getLaunchGuides } from '../lib/posts';
import media from '../data/media.json';
import { cardFingerprint, toolCardFingerprint } from '../lib/card-fingerprint';
import { TOOL_PREVIEWS, toolPreviewImage } from '../lib/tool-preview';
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
  const target = process.argv.find((arg) => arg.startsWith('--slug='))?.slice('--slug='.length);
  const guides = getLaunchGuides().filter((post) => !target || post.slug === target);
  if (target && guides.length !== 1) throw Error(`Reviewed guide not found: ${target}`);
  const credits: Record<string, unknown> = target
    ? JSON.parse(fs.readFileSync('data/card-credits.json', 'utf8'))
    : {};
  for (const post of [
    ...(!target
      ? [
          {
            slug: 'korea-experience',
            title: 'Plan less. Experience more.',
            category: 'KOREA TRAVEL GUIDES, MAPS & TRIP PLANNER',
            excerpt: 'Choose your base, find your way and build days worth remembering.',
            image: '/images/editorial/bukchon.webp',
            checkedAt: undefined,
          },
        ]
      : []),
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
      if (details?.cardImageLabel) {
        const imageLabel = await text(details.cardImageLabel, 13, 360, '#ffffff');
        if ((await sharp(imageLabel).metadata()).height! > 26)
          throw Error(`Card image label is too long: ${post.slug}`);
        layers.push({
          input: Buffer.from('<svg width="400" height="34"><rect width="400" height="34" fill="#163632" fill-opacity=".93"/></svg>'),
          left: 800,
          top: 500,
        });
        layers.push({
          input: imageLabel,
          left: 820,
          top: 509,
        });
      }
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
  if (target) {
    console.log(`Prepared one guide card: ${target}.`);
    return;
  }
  const toolCredits: Record<string, unknown> = {};
  for (const [index, tool] of TOOL_PREVIEWS.entries()) {
    const layers: OverlayOptions[] = [
      {
        input: Buffer.from(
          '<svg width="1200" height="630"><rect width="1200" height="630" fill="#f2f7f4"/><rect width="1200" height="8" fill="#086b66"/><path d="M910 130v115h170v150H910v125" fill="none" stroke="#086b66" stroke-width="5" stroke-dasharray="12 9"/><circle cx="910" cy="130" r="20" fill="#e9b15c"/><circle cx="1080" cy="245" r="20" fill="#086b66"/><circle cx="910" cy="395" r="20" fill="#086b66"/><circle cx="910" cy="520" r="20" fill="#e9b15c"/></svg>',
        ),
        left: 0,
        top: 0,
      },
      { input: await text('KOREA EXPERIENCE', 22, 1000, '#086b66', true, true), left: 45, top: 38 },
      {
        input: await text(
          index
            ? 'YOUR TRAVEL DECISION · ' + String(index).padStart(2, '0')
            : 'YOUR PRACTICAL TRAVEL TOOLKIT',
          16,
          740,
          '#546c68',
          true,
        ),
        left: 45,
        top: 90,
      },
      { input: await text(tool.title, 48, 740, '#163632', true, true), left: 45, top: 145 },
      { input: await text(tool.facts[0], 24, 740, '#163632', true), left: 45, top: 340 },
      { input: await text(tool.facts[1], 22, 740, '#546c68'), left: 45, top: 410 },
      {
        input: await text('Planning aids · No live prices or availability', 18, 740, '#315e55'),
        left: 45,
        top: 510,
      },
      {
        input: await text('koreaexperience.com' + tool.href, 17, 740, '#163632'),
        left: 45,
        top: 570,
      },
    ];
    await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#f2f7f4' } })
      .composite(layers)
      .jpeg({ quality: 88 })
      .toFile('public' + toolPreviewImage(tool));
    toolCredits[tool.slug] = {
      src: toolPreviewImage(tool),
      fingerprint: toolCardFingerprint(tool),
      kind: 'original editorial diagram',
      note: 'Original code-drawn route/decision illustration; no depicted facility or live result.',
    };
  }
  fs.writeFileSync('data/tool-card-credits.json', JSON.stringify(toolCredits, null, 2) + '\n');
  // Use the same routing implementation as prebuild rather than a second redirect generator.
  execFileSync(process.execPath, ['--import', 'tsx', 'scripts/generate-routing.ts'], {
    stdio: 'inherit',
  });
  console.log(
    `Prepared ${guides.length + 1} guide/site cards and ${TOOL_PREVIEWS.length} tool cards with the bundled, licensed typefaces.`,
  );
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
