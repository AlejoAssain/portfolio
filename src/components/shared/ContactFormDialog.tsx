import { Mail, MessageSquare, Send, User } from 'lucide-react';
import { useState, type FormEvent } from 'react';
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
import { useTurnstile } from '@/hooks';
import { useLanguage } from '@/i18n/LanguageProvider';
import { createContactMessage } from '@/services/portfolio';
import type { ContactMessageInput } from '@/types';

export type ContactFormValues = ContactMessageInput;

type ContactFormDialogProps = {
  triggerLabel?: string;
  title?: string;
  description?: string;
};

export function ContactFormDialog({
  triggerLabel,
  title,
  description,
}: ContactFormDialogProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const turnstile = useTurnstile(open);
  const botCheckErrors = {
    required: t.contact.botCheckRequired,
    notConfigured: t.contact.botCheckNotConfigured,
    expired: t.contact.botCheckExpired,
    failedToLoad: t.contact.botCheckFailedToLoad,
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!turnstile.token) {
      turnstile.setError('required');
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values: ContactFormValues = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
      turnstileToken: turnstile.token,
      website: String(formData.get('website') ?? ''),
    };

    setSubmitting(true);
    try {
      await createContactMessage(values);
      toast.success(t.contact.sent);

      form.reset();
      setOpen(false);
    } catch (unknownError) {
      turnstile.reset();
      toast.error(
        unknownError instanceof Error
          ? unknownError.message
          : t.contact.sendFailed,
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
          {triggerLabel ?? t.contact.trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden border-primary/20 bg-background/95 p-0 shadow-none backdrop-blur sm:max-w-[520px]">
        <DialogHeader className="border-b border-border bg-secondary/40 px-6 py-6 pr-12 text-left">
          <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Send size={20} />
          </div>
          <DialogTitle className="font-display text-h4 font-medium">
            {title ?? t.contact.title}
          </DialogTitle>
          <DialogDescription className="max-w-sm text-body-sm">
            {description ?? t.contact.description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div className="grid gap-2">
            <Label htmlFor="name">{t.contact.name}</Label>
            <div className="relative">
              <User
                aria-hidden="true"
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="name"
                name="name"
                required
                maxLength={120}
                autoComplete="name"
                placeholder={t.contact.namePlaceholder}
                className="h-11 pl-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t.contact.email}</Label>
            <div className="relative">
              <Mail
                aria-hidden="true"
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder={t.contact.emailPlaceholder}
                className="h-11 pl-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">{t.contact.message}</Label>
            <div className="relative">
              <MessageSquare
                aria-hidden="true"
                size={16}
                className="pointer-events-none absolute left-3 top-3.5 text-muted-foreground"
              />
              <Textarea
                id="message"
                name="message"
                required
                maxLength={3000}
                placeholder={t.contact.messagePlaceholder}
                className="min-h-32 resize-none pl-10"
              />
            </div>
          </div>
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <div ref={turnstile.containerRef} className="min-h-[65px]" />
            {turnstile.error && (
              <p role="alert" className="text-sm text-destructive">
                {botCheckErrors[turnstile.error]}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting || !turnstile.token}
          >
            <Send />
            {submitting ? t.contact.sending : t.contact.send}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
