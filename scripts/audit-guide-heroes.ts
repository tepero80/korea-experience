import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp, { type OverlayOptions } from 'sharp';
import { getDestinations } from '../lib/destinations';
import { mediaFor, mediaForSource } from '../lib/media';
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
    kind: credit?.kind ?? 'unverified',
    recordedProvenance: Boolean(credit?.sourceUrl && credit.author && credit.licenseUrl),
  };
  try {
    if (!post.image?.startsWith('/')) throw new Error('Missing local hero path');
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
    return { data: { ...base, dimensions: [width, height], hash, decode: 'passed' }, tile };
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
  const counts = {
    guideCount: items.length,
    hubPlanCount: plans.length,
    decoded: items.filter((item) => item.decode === 'passed').length,
    recordedProvenance: items.filter((item) => item.recordedProvenance).length,
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
          'Published article hero assets from the current source inventory. Decoding and recorded provenance checks are automated. Contact sheets display complete assets. Reviewer scores, authenticity, rights and actual page crops require separate editorial evidence.',
        items,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(JSON.stringify({ folder, ...counts }, null, 2));
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
