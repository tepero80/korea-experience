import fs from 'node:fs';
import sharp from 'sharp';
import { getLaunchGuides } from '../lib/posts';
import { cardFingerprint, toolCardFingerprint } from '../lib/card-fingerprint';
import { TOOL_PREVIEWS } from '../lib/tool-preview';
import cards from '../data/card-credits.json';
import toolCards from '../data/tool-card-credits.json';
async function main() {
  for (const p of getLaunchGuides()) {
    const card = (cards as Record<string, { src: string; fingerprint: string }>)[p.slug];
    if (!card || card.fingerprint !== cardFingerprint(p) || !fs.existsSync('public' + card.src))
      throw Error(
        `Stale/missing preview card: ${p.slug}. Run npm run generate:cards, inspect the card and commit the asset.`,
      );
    const meta = await sharp('public' + card.src).metadata();
    if (meta.width !== 1200 || meta.height !== 630)
      throw Error('Invalid card dimensions: ' + p.slug);
  }
  for (const tool of TOOL_PREVIEWS) {
    const card = (toolCards as Record<string, { src: string; fingerprint: string }>)[tool.slug];
    if (
      !card ||
      card.fingerprint !== toolCardFingerprint(tool) ||
      !fs.existsSync('public' + card.src)
    )
      throw Error('Stale/missing tool preview card: ' + tool.slug);
    const meta = await sharp('public' + card.src).metadata();
    if (meta.width !== 1200 || meta.height !== 630)
      throw Error('Invalid tool card dimensions: ' + tool.slug);
  }
  console.log('Guide/tool preview cards match reviewed metadata and 1200×630 dimensions.');
}
void main();
