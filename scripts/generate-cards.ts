import fs from 'node:fs';
import sharp from 'sharp';
import { getAllPosts, getLaunchGuides } from '../lib/posts';
import { ALL_TOOLS } from '../lib/constants';
import { RETIREMENTS } from '../lib/editorial';
import media from '../data/media.json';
import { cardFingerprint } from '../lib/card-fingerprint';
const escape = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function wrap(text: string, width: number, max: number) {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if ((line + ' ' + word).trim().length > width && line) {
      out.push(line);
      line = word;
    } else line = (line + ' ' + word).trim();
  }
  if (line) out.push(line);
  if (out.length <= max) return out;
  const clipped = out.slice(0, max);
  clipped[max - 1] = clipped[max - 1].slice(0, width - 1) + '…';
  return clipped;
}
async function main() {
  fs.mkdirSync('public/images/cards', { recursive: true });
  const guides = getLaunchGuides();
  const cardCredits: Record<string, unknown> = {};
  for (const post of [
    {
      slug: 'korea-experience',
      title: 'Korea, planned around you.',
      category: 'PRACTICAL GUIDES · USEFUL TRAVEL TOOLS',
      excerpt: 'Plan the journey. Find the useful details. Make the most of Korea.',
      image: '/images/editorial/bukchon.webp',
      checkedAt: undefined,
    },
    ...guides,
  ]) {
    const photo = fs.readFileSync('public' + post.image);
    const image = await sharp(photo)
      .resize(360, 630, { fit: 'cover' })
      .jpeg({ quality: 78 })
      .toBuffer();
    const title = wrap(post.title, 32, 4),
      summary = wrap(post.excerpt, 58, 2);
    const titleY = 175;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#faf9f5"/><image href="data:image/jpeg;base64,${image.toString('base64')}" x="840" width="360" height="630"/><rect width="840" height="12" fill="#b15a25"/><text x="55" y="68" fill="#b15a25" font-family="Arial" font-weight="bold" font-size="19">KOREA EXPERIENCE</text><text x="55" y="112" fill="#62716b" font-family="Arial" font-size="15">${escape(post.category.toUpperCase())}</text>${title.map((t, i) => `<text x="55" y="${titleY + i * 60}" fill="#20322e" font-family="Georgia" font-size="49">${escape(t)}</text>`).join('')}${summary.map((t, i) => `<text x="55" y="${titleY + title.length * 60 + 25 + i * 30}" fill="#62716b" font-family="Arial" font-size="21">${escape(t)}</text>`).join('')}<text x="55" y="560" fill="#62716b" font-family="Arial" font-size="16">${post.checkedAt ? 'Checked ' + post.checkedAt + ' · Confirm current conditions' : 'Guides, maps and tools for international visitors'}</text><text x="55" y="600" fill="#20322e" font-family="Arial" font-size="18">koreaexperience.com</text></svg>`;
    const details = 'editorial' in post ? post.editorial : undefined;
    const credit = media.find((m) => m.src === post.image)?.credit;
    cardCredits[post.slug] = {
      src: `/images/cards/${post.slug}.jpg`,
      fingerprint: cardFingerprint(post),
      sourceImage: post.image,
      credit,
      adaptation:
        'Cropped photograph in a social preview composition. Share-alike photo licenses also apply to the adapted card.',
    };
    const condition = wrap(
      details?.shareFacts[0] || 'Plan around your dates and confirm important details.',
      85,
      2,
    )
      .map(
        (line, i) =>
          `<text x="55" y="${506 + i * 23}" fill="#62716b" font-family="Arial" font-size="15">${escape(line)}</text>`,
      )
      .join('');
    const photoCredit = credit
      ? `<rect x="840" y="557" width="360" height="73" fill="#20322e" fill-opacity="0.85"/>${wrap(
          `Photo: ${credit.author} / ${credit.license}`,
          43,
          2,
        )
          .map(
            (line, i) =>
              `<text x="855" y="${580 + i * 17}" fill="white" font-family="Arial" font-size="12">${escape(line)}</text>`,
          )
          .join(
            '',
          )}<text x="855" y="616" fill="white" font-family="Arial" font-size="11">Sources &amp; rights: koreaexperience.com/image-credits</text>`
      : '';
    await sharp(Buffer.from(svg.replace('</svg>', condition + photoCredit + '</svg>')))
      .jpeg({ quality: 85 })
      .toFile(`public/images/cards/${post.slug}.jpg`);
  }
  fs.writeFileSync('data/card-credits.json', JSON.stringify(cardCredits, null, 2) + '\n');
  const redirects = getAllPosts().map(
    (p) =>
      `/blog/${p.slug}/opengraph-image ${p.reviewed ? '/images/cards/' + p.slug + '.jpg' : p.image || '/images/cards/korea-experience.jpg'} 301`,
  );
  for (const t of ALL_TOOLS)
    redirects.push(`${t.href}/opengraph-image /images/cards/korea-experience.jpg 301`);
  for (const r of RETIREMENTS)
    if (r.action === 'redirect' && r.target)
      redirects.push(`/blog/${r.slug} /blog/${r.target} 301`);
  if (redirects.length > 2000) throw Error('Review Cloudflare redirect budget.');
  fs.writeFileSync('public/_redirects', [...new Set(redirects)].join('\n') + '\n');
  console.log(`Cards: ${guides.length + 1}; compatible image redirects: ${redirects.length}.`);
}
void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
