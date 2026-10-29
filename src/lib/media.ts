import type { ProjectScreenshot } from '@/types/media';

export const SCREENSHOT_BUCKET = 'project-screenshots';
export const MAX_SCREENSHOTS = 6;
export const MAX_SCREENSHOT_BYTES = 2 * 1024 * 1024;
export const SCREENSHOT_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export function youtubeUrl(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (
      !['https:', 'http:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.port
    )
      return undefined;
    let id: string | null = null;
    if (['youtu.be', 'www.youtu.be'].includes(url.hostname)) {
      id = url.pathname.match(/^\/([\w-]{11})\/?$/)?.[1] ?? null;
    } else if (
      ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)
    ) {
      id =
        url.pathname === '/watch'
          ? url.searchParams.get('v')
          : (url.pathname.match(
              /^\/(?:shorts|embed|live)\/([\w-]{11})\/?$/,
            )?.[1] ?? null);
    }
    return id && /^[\w-]{11}$/.test(id)
      ? `https://www.youtube.com/watch?v=${id}`
      : undefined;
  } catch {
    return undefined;
  }
}

export function validateScreenshots(images: ProjectScreenshot[]) {
  if (images.length > MAX_SCREENSHOTS)
    throw new Error('Use up to 6 screenshots per project.');
  if (new Set(images.map((image) => image.id)).size !== images.length)
    throw new Error('Duplicate screenshot.');
  if (images.length && images.filter((image) => image.cover).length !== 1)
    throw new Error('Choose one cover.');
  for (const image of images) {
    const url = new URL(image.url);
    if (!['http:', 'https:'].includes(url.protocol))
      throw new Error('Use an HTTP or HTTPS image URL.');
    if (!image.alt.en.trim())
      throw new Error('Add English alternative text for every screenshot.');
  }
}

export function validateScreenshotFile(file: File) {
  if (!SCREENSHOT_TYPES.includes(file.type))
    throw new Error('Choose a PNG, JPEG or WebP image.');
  if (!file.size || file.size > MAX_SCREENSHOT_BYTES)
    throw new Error('Each screenshot must be between 1 byte and 2 MiB.');
}

export async function validateScreenshotFormat(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every(
    (byte, index) => bytes[index] === byte,
  );
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp =
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
  const matches = { 'image/png': png, 'image/jpeg': jpeg, 'image/webp': webp };
  if (!matches[file.type as keyof typeof matches])
    throw new Error(
      'The file contents must match its PNG, JPEG or WebP format.',
    );
}
