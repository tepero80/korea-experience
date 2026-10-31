import test from 'node:test';
import assert from 'node:assert/strict';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import sharp from 'sharp';
import { shareCardUrl } from '../lib/share-card-url';
import { budgetShareUrl, readBudgetShare } from '../lib/tool-share';

test('result-card QR retains validated inputs while excluding private or tracking fields', async () => {
  const input = {
    days: 7,
    nights: 6,
    travelers: 2,
    rooms: 2,
    roomNight: 120000,
    foodDay: 35000,
    transportDay: 10000,
    activitiesDay: 20000,
    oneOff: 100000,
    bufferPercent: 15,
  };
  const longUrl = new URL(budgetShareUrl(input));
  longUrl.searchParams.set('note', 'PRIVATE');
  longUrl.hash = 'private-account-id';
  const publicUrl = shareCardUrl(longUrl.href);
  assert.equal(publicUrl.includes('PRIVATE'), false);
  assert.equal(publicUrl.includes('private-account-id'), false);
  const image = await QRCode.toBuffer(publicUrl, {
    width: 256,
    margin: 4,
    errorCorrectionLevel: 'M',
  });
  const { data, info } = await sharp(image)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const decoded = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  assert.equal(decoded?.data, publicUrl);
  assert.deepEqual(readBudgetShare(new URL(decoded!.data).search), input);
  assert.equal(
    shareCardUrl('https://koreaexperience.com/blog/arrival?email=PRIVATE#discussion'),
    'https://koreaexperience.com/blog/arrival',
  );
  assert.throws(() => shareCardUrl('https://koreaexperience.com/community/shared/PRIVATE'));
  assert.throws(() => shareCardUrl('https://untrusted.example/'));
});
