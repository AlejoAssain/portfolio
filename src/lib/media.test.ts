import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  youtubeUrl,
  validateScreenshotFormat,
  validateScreenshotFile,
  validateScreenshots,
  MAX_SCREENSHOT_BYTES,
} from './media.ts';

const id = 'dQw4w9WgXcQ';
const canonical = `https://www.youtube.com/watch?v=${id}`;
test('normalizes supported YouTube URLs without embedding a player', () => {
  for (const url of [
    canonical,
    `https://youtube.com/watch?v=${id}&t=30`,
    `https://youtu.be/${id}?si=abc`,
    `https://m.youtube.com/watch?v=${id}`,
    `https://www.youtube.com/shorts/${id}`,
    `https://youtube.com/embed/${id}`,
    `https://youtube.com/live/${id}`,
    `http://youtu.be/${id}`,
  ]) {
    assert.equal(youtubeUrl(url), canonical);
  }
});
test('rejects other hosts, credentials, unsafe protocols and malformed IDs', () => {
  for (const url of [
    '',
    '  ',
    'not a URL',
    `https://youtube.com.evil.test/watch?v=${id}`,
    `https://evil.test/?v=${id}`,
    'javascript:alert(1)',
    `https://youtube.com@evil.test/watch?v=${id}`,
    `https://a:b@youtube.com/watch?v=${id}`,
    `ftp://youtu.be/${id}`,
    'https://youtube.com/watch?v=short',
    `https://youtu.be/${id}/extra`,
    'https://youtube.com/playlist?list=abc',
  ]) {
    assert.equal(youtubeUrl(url), undefined);
  }
  assert.equal(youtubeUrl(undefined), undefined);
});
test('accepts only supported, nonempty files within the limit', () => {
  for (const type of ['image/png', 'image/jpeg', 'image/webp']) {
    assert.doesNotThrow(() =>
      validateScreenshotFile(new File(['x'], 'capture', { type })),
    );
  }
  assert.throws(() =>
    validateScreenshotFile(
      new File(['x'], 'capture.svg', { type: 'image/svg+xml' }),
    ),
  );
  assert.throws(() =>
    validateScreenshotFile(new File([], 'empty.png', { type: 'image/png' })),
  );
  assert.throws(() =>
    validateScreenshotFile(
      new File([new Uint8Array(MAX_SCREENSHOT_BYTES + 1)], 'large.png', {
        type: 'image/png',
      }),
    ),
  );
});
test('validates cover, count, alt text, duplicates and URL at the save boundary', () => {
  const image = {
    id: 'one',
    url: 'https://example.test/image.png',
    alt: { en: 'Dashboard', es: 'Panel' },
    cover: true,
  };
  assert.doesNotThrow(() => validateScreenshots([]));
  assert.doesNotThrow(() => validateScreenshots([image]));
  assert.throws(() => validateScreenshots([{ ...image, cover: false }]));
  assert.throws(() => validateScreenshots([{ ...image, alt: { en: ' ' } }]));
  assert.throws(() => validateScreenshots([image, image]));
  assert.throws(() =>
    validateScreenshots([{ ...image, url: 'javascript:alert(1)' }]),
  );
  assert.throws(() =>
    validateScreenshots(
      Array.from({ length: 7 }, (_, i) => ({
        ...image,
        id: String(i),
        cover: i === 0,
      })),
    ),
  );
});

test('rejects a forged MIME type before uploading', async () => {
  await assert.rejects(() =>
    validateScreenshotFormat(
      new File(['<svg></svg>'], 'fake.png', { type: 'image/png' }),
    ),
  );
  const png = new File(
    [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])],
    'capture.png',
    { type: 'image/png' },
  );
  await assert.doesNotReject(() => validateScreenshotFormat(png));
});
