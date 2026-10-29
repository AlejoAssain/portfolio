import { AnimatedSection, ContactFormDialog } from '@/components/shared';
import { useLanguage } from '@/i18n/LanguageProvider';

export function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <AnimatedSection>
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-display text-h2 text-foreground">{t.contact.heading}</h2>
            <div className="h-px flex-1 bg-border max-w-xs" />
          </div>
        </AnimatedSection>

        <div className="max-w-2xl">
          <AnimatedSection delay={100}>
            <p className="text-body-lg text-muted-foreground mb-8">
              {t.contact.intro}
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
