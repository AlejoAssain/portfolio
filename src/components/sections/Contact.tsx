import { personalInfo } from '@/mocks/portfolio';
import { AnimatedSection } from '@/components/shared';
import { Send } from 'lucide-react';
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

export function Contact() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const message = String(formData.get('message') ?? '');

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );

    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
    toast.success('Message ready in your email app.');
    event.currentTarget.reset();
    setOpen(false);
  };

  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl font-bold text-foreground">Contact</h2>
            <div className="h-px flex-1 bg-border max-w-xs" />
          </div>
        </AnimatedSection>

        <div className="max-w-2xl">
          <AnimatedSection delay={100}>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Got an idea, a project, or a problem worth solving? Leave me a
              message and I will get back to you.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Send />
                    Leave me a message
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Leave me a message</DialogTitle>
                    <DialogDescription>
                      Tell me who you are and how I can reach you.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" name="message" required />
                    </div>
                    <Button type="submit" className="w-full">
                      <Send />
                      Send message
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
