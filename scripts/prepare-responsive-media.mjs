// Explicit, offline derivative preparation. Never download or spend during a build.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

const registry = JSON.parse(await fs.readFile('data/media.json', 'utf8'));
const originals = JSON.parse(
  await fs.readFile('data/editorial-research/photos.json', 'utf8'),
).photos;
const records = [];
for (const media of registry.filter((m) => m.credit.kind !== 'illustration' && m.width >= 800)) {
  const sourceCandidates = [
    `.private/media-originals/experience-v2/${media.id}.jpg`,
    originals.find((p) => p.id === media.id)?.localOriginal,
  ].filter(Boolean);
  let bytes;
  for (const source of sourceCandidates) {
    try {
      bytes = await fs.readFile(source);
      break;
    } catch {}
  }
  if (!bytes) throw Error('Reviewed local original missing: ' + media.id);
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  if (media.originalHash && hash !== media.originalHash)
    throw Error('Original identity changed: ' + media.id);
  const src = '/images/editorial/' + media.id + '-800.webp';
  await sharp(bytes)
    .rotate()
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile('public' + src);
  const actual = await sharp('public' + src).metadata();
  const candidates = new Map(
    (media.srcSet || `${media.src} ${media.width}w`).split(',').map((part) => {
      const [file, width] = part.trim().split(/\s+/);
      return [Number(width.slice(0, -1)), file];
    }),
  );
  candidates.set(actual.width, src);
  media.srcSet = [...candidates]
    .sort(([a], [b]) => a - b)
    .map(([width, file]) => `${file} ${width}w`)
    .join(', ');
  records.push({
    id: media.id,
    src,
    width: actual.width,
    height: actual.height,
    bytes: (await fs.stat('public' + src)).size,
    originalHash: hash,
  });
}
await fs.writeFile('data/media.json', JSON.stringify(registry, null, 2) + '\n');
await fs.mkdir('.private/reports', { recursive: true });
await fs.writeFile(
  '.private/reports/responsive-media-preparation.json',
  JSON.stringify(
    {
      at: new Date().toISOString(),
      method:
        'Offline resampling only; no crop, synthesis or scene alteration. Existing source/license records apply.',
      records,
    },
    null,
    2,
  ),
);
console.log(
  `Prepared ${records.length} intermediate800px derivatives from reviewed local originals; no download or paid generation.`,
);
