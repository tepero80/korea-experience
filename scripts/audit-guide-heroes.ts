import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp, { type OverlayOptions } from 'sharp';
import { getDestinations } from '../lib/destinations';
import { generatedArchiveCoverHash, mediaFor, mediaForSource } from '../lib/media';
import { getAllPosts, type PostMetadata } from '../lib/posts';

const publicRoot = path.resolve('public');
const publicPrefix = publicRoot + path.sep;
const columns = 6;
const rows = 5;
const tileWidth = 224;
const tileHeight = 180;
const photoWidth = 212;
const photoHeight = 125;
const paper = '#faf6ed';
const pixelsPerSheet = columns * tileWidth;
const oneBit = BigInt(1);

const xml = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function titleLines(title: string) {
  const first = title.slice(0, 33);
  if (title.length <= 33) return [title, ''];
  const split = Math.max(first.lastIndexOf(' '), 19);
  const remainder = title.slice(split).trim();
  return [
    title.slice(0, split).trim(),
    remainder.length <= 33 ? remainder : remainder.slice(0, 32) + '…',
  ];
}

async function differenceHash(file: Buffer, fit: 'fill' | 'cover') {
  const pixels = await sharp(file)
    .autoOrient()
    .toColourspace('b-w')
    .removeAlpha()
    .resize(9, 8, { fit })
    .raw()
    .toBuffer();
  if (pixels.length !== 72) throw new Error('Unexpected fingerprint image channels');
  let hash = BigInt(0);
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const offset = row * 9 + col;
      hash = (hash << oneBit) | BigInt(pixels[offset] > pixels[offset + 1]);
    }
  }
  return hash.toString(16).padStart(16, '0');
}

async function thumbnail(post: PostMetadata) {
  const media = mediaFor(post.editorial?.heroMediaId) ?? mediaForSource(post.image);
  const credit = media?.credit ?? post.editorial?.imageCredit;
  const base = {
    slug: post.slug,
    title: post.title,
    image: post.image ?? null,
    category: post.categoryId,
    reviewedGuide: post.reviewed,
    mediaId: media?.id ?? null,
    originalId: media?.originalId ?? null,
    kind: post.image ? credit?.kind ?? 'unverified' : 'omitted',
    recordedProvenance: Boolean(credit?.sourceUrl && credit.author && credit.licenseUrl),
  };
  if (!post.image) return { data: { ...base, decode: 'omitted' }, tile: undefined };
  try {
    if (!post.image.startsWith('/')) throw new Error('Missing local hero path');
    const filename = path.resolve(publicRoot, post.image.slice(1));
    if (!filename.startsWith(publicPrefix)) throw new Error('Hero path is outside public');
    const file = await fs.readFile(filename);
    const { width, height } = await sharp(file).metadata();
    const tile = await sharp(file)
      .autoOrient()
      .resize(photoWidth, photoHeight, { fit: 'contain', background: '#eae1d2' })
      .removeAlpha()
      .jpeg({ quality: 83 })
      .toBuffer();
    const hash = createHash('sha256').update(file).digest('hex');
    const originalBlob = generatedArchiveCoverHash(post.slug, post.image);
    const generated = Boolean(originalBlob &&
      createHash('sha1').update(`blob ${file.length}\0`).update(file).digest('hex') === originalBlob);
    const fingerprints = await Promise.all([differenceHash(file, 'fill'), differenceHash(file, 'cover')]);
    return {
      data: {
        ...base,
        ...(generated ? { kind: 'generated-illustration', recordedProvenance: true } : {}),
        dimensions: [width, height],
        hash,
        fingerprints,
        decode: 'passed',
      },
      tile,
    };
  } catch (error) {
    return { data: { ...base, decode: 'failed', error: String(error) }, tile: undefined };
  }
}

async function renderSheets(folder: string, prefix: string, posts: PostMetadata[], offset: number) {
  const items: (Awaited<ReturnType<typeof thumbnail>>['data'] & {
    number: number;
    sheet: string;
    tile: number;
  })[] = [];
  const perSheet = columns * rows;
  for (let start = 0; start < posts.length; start += perSheet) {
    const sheet = `${prefix}-${String(1 + start / perSheet).padStart(2, '0')}.jpg`;
    const batch = await Promise.all(posts.slice(start, start + perSheet).map(thumbnail));
    const height = Math.ceil(batch.length / columns) * tileHeight;
    const layer: OverlayOptions[] = [];
    const labels = batch.map(({ data, tile }, i) => {
      const number = offset + start + i + 1;
      const left = (i % columns) * tileWidth + 6;
      const top = Math.floor(i / columns) * tileHeight + 5;
      if (tile) layer.push({ input: tile, left, top });
      const [title, subtitle] = titleLines(data.title);
      const note = `${number} · ${data.decode === 'failed' ? 'decode failed' : data.kind}`;
      items.push({ ...data, number, sheet, tile: i + 1 });
      return (
        `<text x="${left}" y="${top + 135}">${xml(note)}</text>` +
        `<text x="${left}" y="${top + 152}" class="title">${xml(title)}</text>` +
        `<text x="${left}" y="${top + 167}" class="title">${xml(subtitle)}</text>`
      );
    });
    const labelsSvg =
      Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${pixelsPerSheet}" height="${height}">
      <style>text{fill:#5f5344;font:11px sans-serif}.title{fill:#261f1a;font:600 12px sans-serif}</style>
      ${labels.join('')}
    </svg>`);
    await sharp({ create: { width: pixelsPerSheet, height, channels: 3, background: paper } })
      .composite([...layer, { input: labelsSvg, top: 0, left: 0 }])
      .jpeg({ quality: 87 })
      .toFile(path.join(folder, sheet));
  }
  return items;
}

function nearbyHeroPairs(items: Awaited<ReturnType<typeof renderSheets>>) {
  const maximumDistance = 5;
  const files = items.flatMap((item) =>
    'fingerprints' in item
      ? [{ slug: item.slug, image: item.image, hashes: item.fingerprints.map((hash) => BigInt('0x' + hash)) }]
      : [],
  );
  const candidates: { a: string; b: string; aImage: string | null; bImage: string | null; distance: number }[] = [];
  for (let i = 0; i < files.length; i++) {
    const current = files[i];
    for (let j = i + 1; j < files.length; j++) {
      const other = files[j];
      let closest = maximumDistance + 1;
      for (const a of current.hashes) {
        for (const b of other.hashes) {
          let bits = a ^ b;
          let distance = 0;
          while (bits && distance < closest) {
            bits &= bits - oneBit;
            distance++;
          }
          closest = Math.min(closest, distance);
        }
      }
      if (closest <= maximumDistance)
        candidates.push({ a: current.slug, b: other.slug, aImage: current.image, bImage: other.image, distance: closest });
    }
  }
  return candidates.sort((a, b) => a.distance - b.distance);
}

async function main() {
  const folder = path.resolve(
    '.private/reports/guide-hero-audit',
    new Date().toISOString().replaceAll(':', '-'),
  );
  const posts = getAllPosts();
  const visiblePlans = new Map<string, string[]>();
  for (const region of getDestinations()) {
    const current = region.highlights?.filter((slug) => region.posts.some((p) => p.slug === slug));
    const slugs = current?.length ? current : region.posts.slice(0, 6).map((post) => post.slug);
    for (const slug of slugs)
      visiblePlans.set(slug, [...(visiblePlans.get(slug) ?? []), region.id]);
  }
  const plans = [...visiblePlans.keys()].map((slug) => posts.find((post) => post.slug === slug)!);
  const remaining = posts.filter((post) => !visiblePlans.has(post.slug));
  await fs.mkdir(folder, { recursive: true });
  const priority = await renderSheets(folder, 'hub-plans', plans, 0);
  const archive = await renderSheets(folder, 'other-guides', remaining, plans.length);
  const items = [...priority, ...archive].map((item) => ({
    ...item,
    displayedHubPlans: visiblePlans.get(item.slug) ?? [],
  }));
  const candidates = nearbyHeroPairs(items);
  const counts = {
    guideCount: items.length,
    hubPlanCount: plans.length,
    decoded: items.filter((item) => item.decode === 'passed').length,
    recordedProvenance: items.filter((item) => item.recordedProvenance).length,
    visuallySimilarPairs: candidates.length,
    kinds: [...new Set(items.map((item) => item.kind))].map((kind) => ({
      kind,
      count: items.filter((item) => item.kind === kind).length,
    })),
  };
  await fs.writeFile(
    path.join(folder, 'inventory.json'),
    JSON.stringify(
      {
        at: new Date().toISOString(),
        counts,
        scope:
          'Published article hero assets from the current source inventory. Decoding and recorded provenance checks are automated. A matching archived blob identifies a generated illustration. Contact sheets display complete assets. Reviewer scores, photo authenticity, rights and actual page crops require separate editorial evidence.',
        items,
      },
      null,
      2,
    ) + '\n',
  );
  await fs.writeFile(
    path.join(folder, 'similarity-candidates.json'),
    JSON.stringify({
      scope: '64-bit grayscale difference hashes from the full frame and a centered 9:8 crop, Hamming distance at most five. Visually confirm suspected matches. Other crops and substantial edits can escape detection.',
      candidates,
    }, null, 2) + '\n',
  );
  console.log(JSON.stringify({ folder, ...counts }, null, 2));
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
