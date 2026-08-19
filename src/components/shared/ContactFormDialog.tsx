import { Mail, MessageSquare, Send, User } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createContactMessage } from '@/services/portfolio';
import type { ContactMessageInput } from '@/types';

export type ContactFormValues = ContactMessageInput;

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

type ContactFormDialogProps = {
  triggerLabel?: string;
  title?: string;
  description?: string;
};

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

export function ContactFormDialog({
  triggerLabel = 'Leave me a message',
  title = 'Leave me a message',
  description = 'Tell me what you are building, fixing, or trying to make less annoying.',
}: ContactFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
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
      setTurnstileError('The bot check is not configured.');
      return;
    }

    let active = true;

    loadTurnstileScript()
      .then(() => {
        if (
          !active ||
          !window.turnstile ||
          !turnstileContainerRef.current ||
          turnstileWidgetIdRef.current
        ) {
          return;
        }

        turnstileWidgetIdRef.current = window.turnstile.render(
          turnstileContainerRef.current,
          {
            sitekey: turnstileSiteKey,
            callback: (token) => {
              setTurnstileToken(token);
              setTurnstileError('');
            },
            'expired-callback': () => {
              setTurnstileToken('');
              setTurnstileError('The bot check expired. Please try again.');
            },
            'error-callback': () => {
              setTurnstileToken('');
              setTurnstileError('The bot check failed to load.');
            },
          },
        );
      })
      .catch(() => {
        if (active) {
          setTurnstileError('The bot check failed to load.');
        }
      });

    return () => {
      active = false;
    };
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!turnstileToken) {
      setTurnstileError('Complete the bot check before sending.');
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values: ContactFormValues = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
      turnstileToken,
      website: String(formData.get('website') ?? ''),
    };

    setSubmitting(true);
    try {
      await createContactMessage(values);
      toast.success('Thanks! I will contact you soon.');

      form.reset();
      setTurnstileToken('');
      setOpen(false);
    } catch (unknownError) {
      if (turnstileWidgetIdRef.current) {
        window.turnstile?.reset(turnstileWidgetIdRef.current);
        setTurnstileToken('');
      }
      toast.error(
        unknownError instanceof Error
          ? unknownError.message
          : 'Message could not be sent.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden border-primary/20 bg-background/95 p-0 shadow-none backdrop-blur sm:max-w-[520px]">
        <DialogHeader className="border-b border-border bg-secondary/40 px-6 py-6 pr-12 text-left">
          <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Send size={20} />
          </div>
          <DialogTitle className="font-display text-h4 font-medium">
            {title}
          </DialogTitle>
          <DialogDescription className="max-w-sm text-body-sm">
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="name"
                name="name"
                required
                placeholder="Your name"
                className="h-11 pl-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="h-11 pl-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <div className="relative">
              <MessageSquare
                size={16}
                className="pointer-events-none absolute left-3 top-3.5 text-muted-foreground"
              />
              <Textarea
                id="message"
                name="message"
                required
                placeholder="What's on your mind?"
                className="min-h-32 resize-none pl-10"
              />
            </div>
          </div>
          <div className="hidden">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <div ref={turnstileContainerRef} className="min-h-[65px]" />
            {turnstileError && (
              <p className="text-sm text-destructive">{turnstileError}</p>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting || !turnstileToken}
          >
            <Send />
            {submitting ? 'Sending...' : 'Send message'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
