// Explicit editorial preparation command; never downloads during a deploy build.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const sources = JSON.parse(await fs.readFile('data/experience-media-sources.json', 'utf8'));
const registry = JSON.parse(await fs.readFile('data/media.json', 'utf8'));
await fs.mkdir('.private/media-originals/experience-v2', { recursive: true });
await fs.mkdir('public/images/editorial', { recursive: true });
for (const p of sources) {
  if (new URL(p.download).hostname !== 'upload.wikimedia.org')
    throw Error('Review download origin');
  if (
    !['CC0', 'CC BY 2.0', 'CC BY 4.0', 'CC BY-SA 4.0', 'CC BY-SA 3.0', 'CC BY-SA 2.0'].includes(
      p.license,
    )
  )
    throw Error('Review license');
  const original = `.private/media-originals/experience-v2/${p.id}.jpg`;
  let bytes;
  try {
    bytes = await fs.readFile(original);
  } catch {
    const response = await fetch(p.download, {
      headers: {
        'User-Agent': 'KoreaExperienceEditorial/2.0 (https://koreaexperience.com/editorial-policy)',
      },
    });
    if (!response.ok) throw Error(`${p.id}: HTTP ${response.status}; do not silently substitute`);
    bytes = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(original, bytes);
  }
  const originalHash = crypto.createHash('sha256').update(bytes).digest('hex');
  const variants = [];
  for (const width of [640, 1280]) {
    const output = `public/images/editorial/${p.id}-${width}.webp`;
    await sharp(bytes)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(output);
    const actual = await sharp(output).metadata();
    if (!variants.some((v) => v.width === actual.width))
      variants.push({ src: `/images/editorial/${p.id}-${width}.webp`, width: actual.width });
  }
  const dimensions = await sharp(`public/images/editorial/${p.id}-1280.webp`).metadata();
  const credit = {
    kind: 'photograph',
    title: p.file,
    author: p.author,
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:' + p.file.replaceAll(' ', '_'),
    license: p.license,
    licenseUrl:
      p.license === 'CC0'
        ? 'https://creativecommons.org/publicdomain/zero/1.0/'
        : `https://creativecommons.org/licenses/${p.license.includes('BY-SA') ? 'by-sa' : 'by'}/${p.license.match(/\d\.\d$/)[0]}/`,
    note: `Photographed ${p.capturedAt}. Resized and converted to WebP. ${p.license === 'CC0' ? 'Public-domain dedication.' : 'Image derivatives retain the original credit and license.'} Historical photograph; check current signs, services and opening conditions separately.`,
  };
  const record = {
    id: p.id,
    originalId: p.file,
    originalHash,
    capturedAt: p.capturedAt,
    checkedAt: '2026-10-31',
    src: `/images/editorial/${p.id}-1280.webp`,
    srcSet: variants.map((v) => `${v.src} ${v.width}w`).join(', '),
    width: dimensions.width,
    height: dimensions.height,
    alt: p.alt,
    focal: p.focal,
    credit,
  };
  const i = registry.findIndex((x) => x.id === p.id);
  if (i >= 0) registry[i] = record;
  else registry.push(record);
  console.log(`${p.id}: ${dimensions.width} × ${dimensions.height}`);
}
const pendingRegistry = '.private/media-registry-pending.json';
await fs.writeFile(pendingRegistry, JSON.stringify(registry, null, 2) + '\n');
await fs.rename(pendingRegistry, 'data/media.json');
