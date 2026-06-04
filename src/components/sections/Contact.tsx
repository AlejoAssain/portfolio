import { AnimatedSection, ContactFormDialog } from '@/components/shared';

export function Contact() {
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
            <ContactFormDialog />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
