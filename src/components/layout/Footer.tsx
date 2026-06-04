import { AnimatedSection, SocialButtons } from '@/components/shared';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <AnimatedSection delay={300}>
            <SocialButtons />
          </AnimatedSection>

          <p className="text-sm text-muted-foreground">
            {currentYear} — Built with React & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
