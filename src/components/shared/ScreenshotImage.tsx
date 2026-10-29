import { useState } from 'react';
import { Button } from '@/components/ui';

export function ScreenshotImage({
  src,
  alt,
  labels,
  expanded = false,
}: {
  src: string;
  alt: string;
  labels: { loading: string; error: string; retry: string };
  expanded?: boolean;
}) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  );
  const [attempt, setAttempt] = useState(0);
  return (
    <div
      className={
        expanded ? 'screenshot-frame screenshot-expanded' : 'screenshot-frame'
      }
      aria-busy={status === 'loading'}
    >
      {status !== 'error' && (
        <img
          key={attempt}
          src={src}
          alt={alt}
          loading={expanded ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-contain"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
      {status !== 'loaded' && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card p-4 text-center text-body-sm text-muted-foreground"
          role="status"
        >
          <span>{status === 'loading' ? labels.loading : labels.error}</span>
          {status === 'error' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStatus('loading');
                setAttempt(attempt + 1);
              }}
            >
              {labels.retry}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
