import { useState } from 'react';
import { Button, Input, Label } from '@/components/ui';
import { ScreenshotImage } from '@/components/shared/ScreenshotImage';
import { MAX_SCREENSHOTS } from '@/lib/media';
import { uploadScreenshot } from '@/services/media';
import type { ProjectScreenshot } from '@/types/media';
import { LocalizedField } from './LocalizedField';

const previewLabels = {
  loading: 'Loading preview…',
  error: 'Preview could not load.',
  retry: 'Retry preview',
};

export function ProjectScreenshots({
  images,
  onChange,
  onBusy,
}: {
  images: ProjectScreenshot[];
  onChange: (images: ProjectScreenshot[]) => void;
  onBusy: (busy: boolean) => void;
}) {
  const [pending, setPending] = useState<File>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function upload(file: File) {
    setBusy(true);
    onBusy(true);
    setError('');
    setPending(file);
    try {
      const image = await uploadScreenshot(file);
      onChange([...images, { ...image, cover: images.length === 0 }]);
      setPending(undefined);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Upload failed. Retry.',
      );
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }
  function remove(id: string) {
    const next = images.filter((image) => image.id !== id);
    if (next.length && !next.some((image) => image.cover))
      next[0] = { ...next[0], cover: true };
    onChange(next);
  }
  function move(index: number, delta: number) {
    const next = [...images];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange(next);
  }
  return (
    <section
      className="space-y-4"
      aria-label="Project screenshots"
      aria-busy={busy}
    >
      <div className="space-y-2">
        <Label htmlFor="project-screenshot-upload">Screenshots</Label>
        <p id="screenshot-limits" className="text-sm text-muted-foreground">
          Up to 6 captures. PNG, JPEG or WebP, 2 MiB each. Prefer WebP under 300
          KB. Removing a capture only unlinks it after saving.
        </p>
        <Input
          id="project-screenshot-upload"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          aria-describedby="screenshot-limits"
          disabled={busy || images.length >= MAX_SCREENSHOTS}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) void upload(file);
          }}
        />
      </div>
      {busy && <p role="status">Uploading…</p>}
      {error && (
        <div role="alert" className="space-y-2">
          <p>{error}</p>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => pending && void upload(pending)}
          >
            Retry upload
          </Button>
        </div>
      )}
      {images.map((image, index) => (
        <div key={image.id} className="space-y-4 rounded-md border p-4">
          <ScreenshotImage
            key={image.url}
            src={image.url}
            alt={image.alt.en}
            labels={previewLabels}
          />
          <LocalizedField
            label="Alternative text"
            value={image.alt}
            required
            onChange={(alt) =>
              onChange(
                images.map((item) =>
                  item.id === image.id ? { ...item, alt } : item,
                ),
              )
            }
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={image.cover ? 'default' : 'outline'}
              aria-pressed={image.cover}
              onClick={() =>
                onChange(
                  images.map((item) => ({
                    ...item,
                    cover: item.id === image.id,
                  })),
                )
              }
            >
              {image.cover ? 'Cover' : 'Use as cover'}
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-label={`Move screenshot ${index + 1} earlier`}
              disabled={index === 0}
              onClick={() => move(index, -1)}
            >
              Move earlier
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-label={`Move screenshot ${index + 1} later`}
              disabled={index === images.length - 1}
              onClick={() => move(index, 1)}
            >
              Move later
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-label={`Unlink screenshot ${index + 1}`}
              onClick={() => remove(image.id)}
            >
              Unlink
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
}
