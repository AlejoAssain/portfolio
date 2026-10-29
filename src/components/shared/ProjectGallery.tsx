import { useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';
import { useLanguage } from '@/i18n/LanguageProvider';
import type { Project } from '@/types';
import { ScreenshotImage } from './ScreenshotImage';

export function ProjectGallery({ project }: { project: Project }) {
  const { t } = useLanguage();
  const labels = t.projects.gallery;
  const images =
    project.screenshots ??
    (project.image
      ? [{ id: 'legacy', url: project.image, alt: project.title, cover: true }]
      : []);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  if (!images.length) return null;
  const cover = images.find((image) => image.cover) ?? images[0];
  const image = images[index] ?? cover;
  function move(delta: number) {
    setIndex((index + delta + images.length) % images.length);
  }
  return (
    <div className="mb-4 space-y-2">
      <ScreenshotImage
        key={cover.url}
        src={cover.url}
        alt={cover.alt}
        labels={labels}
      />
      <Button
        ref={trigger}
        type="button"
        variant="outline"
        aria-haspopup="dialog"
        onClick={() => {
          setIndex(images.indexOf(cover));
          setOpen(true);
        }}
      >
        {labels.open} ({images.length})
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          data-lenis-prevent
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            trigger.current?.focus();
          }}
          showCloseButton={false}
          className="screenshot-dialog max-h-[90svh] overflow-y-auto sm:max-w-5xl"
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              move(1);
            }
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              move(-1);
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>{project.title}</DialogTitle>
            <DialogDescription>{labels.description}</DialogDescription>
          </DialogHeader>
          <ScreenshotImage
            key={image.url}
            src={image.url}
            alt={image.alt}
            labels={labels}
            expanded
          />
          <p className="text-body-sm text-muted-foreground" aria-live="polite">
            {image.alt} · {index + 1} / {images.length}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={images.length < 2}
              onClick={() => move(-1)}
            >
              {labels.previous}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={images.length < 2}
              onClick={() => move(1)}
            >
              {labels.next}
            </Button>
            <a
              className="text-primary underline underline-offset-4"
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {labels.fullSize}
            </a>
            <Button type="button" onClick={() => setOpen(false)}>
              {labels.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
