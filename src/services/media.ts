import { supabase } from '@/lib/supabase';
import {
  SCREENSHOT_BUCKET,
  validateScreenshotFile,
  validateScreenshotFormat,
} from '@/lib/media';
import type { ProjectScreenshot } from '@/types/media';

export async function uploadScreenshot(file: File): Promise<ProjectScreenshot> {
  validateScreenshotFile(file);
  await validateScreenshotFormat(file);
  const bitmap = await createImageBitmap(file);
  const valid =
    bitmap.width > 0 &&
    bitmap.height > 0 &&
    bitmap.width * bitmap.height <= 40_000_000;
  bitmap.close();
  if (!valid) throw new Error('Choose an image with up to 40 megapixels.');
  const id = crypto.randomUUID();
  const extension = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
  }[file.type];
  const storagePath = `${id}.${extension}`;
  const { error } = await supabase.storage
    .from(SCREENSHOT_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '31536000',
      contentType: file.type,
      upsert: false,
    });
  if (error)
    throw new Error(
      `Upload failed. Check the bucket and admin policies, then retry. ${error.message}`,
    );
  const { data } = supabase.storage
    .from(SCREENSHOT_BUCKET)
    .getPublicUrl(storagePath);
  return {
    id,
    url: data.publicUrl,
    storagePath,
    alt: { en: '', es: '' },
    cover: false,
  };
}
