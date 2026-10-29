import { useEffect, useRef, useState } from 'react';

type TurnstileWidgetId = string;

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    },
  ) => TurnstileWidgetId;
  remove: (widgetId: TurnstileWidgetId) => void;
  reset: (widgetId: TurnstileWidgetId) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const turnstileScriptId = 'cloudflare-turnstile-script';

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve();

  const existingScript = document.getElementById(turnstileScriptId);
  if (existingScript) {
    if (existingScript.dataset.loaded === 'true') {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      existingScript.addEventListener(
        'load',
        () => {
          existingScript.dataset.loaded = 'true';
          resolve();
        },
        { once: true },
      );
      existingScript.addEventListener('error', () => reject(), { once: true });
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = turnstileScriptId;
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true';
        resolve();
      },
      { once: true },
    );
    script.addEventListener('error', () => reject(), { once: true });
    document.head.appendChild(script);
  });
}

/** Error codes, so the UI can show them in the current language. */
export type TurnstileError =
  | 'required'
  | 'notConfigured'
  | 'expired'
  | 'failedToLoad';

// Renders the Turnstile widget into `containerRef` while `open` is true and
// tears it down when it closes.
export function useTurnstile(open: boolean) {
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState<TurnstileError | ''>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<TurnstileWidgetId | null>(null);

  useEffect(() => {
    if (!open) {
      if (turnstileWidgetIdRef.current) {
        window.turnstile?.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
      setTurnstileToken('');
      setTurnstileError('');
      return;
    }

    if (!turnstileSiteKey) {
      setTurnstileError('notConfigured');
      return;
    }

    let active = true;

    loadTurnstileScript()
      .then(() => {
        if (
          !active ||
          !window.turnstile ||
          !containerRef.current ||
          turnstileWidgetIdRef.current
        ) {
          return;
        }

        turnstileWidgetIdRef.current = window.turnstile.render(
          containerRef.current,
          {
            sitekey: turnstileSiteKey,
            callback: (token) => {
              setTurnstileToken(token);
              setTurnstileError('');
            },
            'expired-callback': () => {
              setTurnstileToken('');
              setTurnstileError('expired');
            },
            'error-callback': () => {
              setTurnstileToken('');
              setTurnstileError('failedToLoad');
            },
          },
        );
      })
      .catch(() => {
        if (active) {
          setTurnstileError('failedToLoad');
        }
      });

    return () => {
      active = false;
    };
  }, [open]);

  const reset = () => {
    if (turnstileWidgetIdRef.current) {
      window.turnstile?.reset(turnstileWidgetIdRef.current);
    }
    setTurnstileToken('');
  };

  return {
    containerRef,
    token: turnstileToken,
    error: turnstileError,
    setError: setTurnstileError,
    reset,
  };
}
