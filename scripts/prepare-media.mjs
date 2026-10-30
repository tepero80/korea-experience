import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const manifest = JSON.parse(await fs.readFile('data/editorial-research/photos.json', 'utf8'));
await fs.mkdir('public/images/editorial', { recursive: true });
const media = [];
for (const photo of manifest.photos) {
  if (!photo.commercialReuse || !photo.localOriginal)
    throw new Error(`Unverified photo: ${photo.id}`);
  const destination = `public/images/editorial/${photo.id}.webp`;
  await sharp(photo.localOriginal)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toFile(destination);
  const dimensions = await sharp(destination).metadata();
  media.push({
    id: photo.id,
    src: `/images/editorial/${photo.id}.webp`,
    width: dimensions.width,
    height: dimensions.height,
    alt: photo.description || photo.place,
    credit: {
      kind: 'photograph',
      title: photo.title,
      author: photo.author,
      sourceUrl: photo.sourcePage,
      license: photo.license,
      licenseUrl: photo.licenseUrl,
      note: `Resized and converted to WebP. ${/^\d{4}-\d{2}-\d{2}/.test(photo.capturedAt || '') ? `Photographed ${String(photo.capturedAt).slice(0, 10)}. ` : ''}${photo.shareAlikeRequired ? 'This image adaptation is available under the same license. ' : ''}Historical image; not evidence of current access, prices, signage or availability.`,
    },
  });
}
await fs.writeFile('data/media.json', JSON.stringify(media, null, 2) + '\n');
console.log(
  `Prepared ${media.length} licensed real photographs; originals remain outside the export.`,
);
