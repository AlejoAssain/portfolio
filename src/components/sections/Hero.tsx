import { navItems, personalInfo } from '@/mocks/portfolio';
import { AnimatedSection, SocialButtons } from '@/components/shared';
import { ArrowDown } from 'lucide-react';

export function Hero() {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <AnimatedSection delay={0}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                {personalInfo.name}
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <h2 className="text-xl sm:text-2xl font-medium text-primary">
                {personalInfo.title}
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed text-pretty">
                {personalInfo.tagline}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <SocialButtons className="pt-4" />
            </AnimatedSection>
          </div>

          <AnimatedSection
            delay={400}
            direction="left"
            className="hidden lg:block"
          >
            <nav className="space-y-4 border-l border-border pl-8">
              {navItems.slice(0, 3).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="w-8 h-px bg-muted-foreground group-hover:w-16 group-hover:bg-primary transition-all duration-300" />
                  <span className="text-sm font-medium uppercase tracking-wider">
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>
          </AnimatedSection>
        </div>
      </div>

      <AnimatedSection
        delay={600}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <button
          onClick={scrollToAbout}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Scroll to about section"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown size={16} className="animate-bounce" />
        </button>
      </AnimatedSection>
    </section>
  );
}
