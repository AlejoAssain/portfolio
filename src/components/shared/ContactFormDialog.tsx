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

export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

type ContactFormDialogProps = {
  triggerLabel?: string;
  title?: string;
  description?: string;
};

export function ContactFormDialog({
  triggerLabel = 'Leave me a message',
  title = 'Leave me a message',
  description = 'Tell me what you are building, fixing, or trying to make less annoying.',
}: ContactFormDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    console.log('Contact form submitted:', values);
    toast.success('Thanks! I will contact you soon.');

    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden border-primary/20 bg-background/95 p-0 shadow-2xl shadow-primary/10 backdrop-blur sm:max-w-[520px]">
        <DialogHeader className="border-b border-border bg-secondary/40 px-6 py-6 pr-12 text-left">
          <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Send size={20} />
          </div>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="max-w-sm text-sm leading-relaxed">
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
          <Button type="submit" size="lg" className="w-full">
            <Send />
            Send message
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
