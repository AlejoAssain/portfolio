import { AnimatedSection, SocialButtons } from '@/components/shared';
import { ArrowDown } from 'lucide-react';
import { usePortfolioContent } from '@/hooks';
import { useLanguage } from '@/i18n/LanguageProvider';
import {
  CHARACTER_LOOP_SRC,
  CHARACTER_POSTER_SRC,
  useHeroAnimation,
} from '@/hooks/useHeroAnimation';
import { scrollToSection } from '@/lib/lenis';


export function Hero() {
  const { personalInfo } = usePortfolioContent();
  const { t } = useLanguage();
  const { containerRef, characterRef, entranceRef, videoRef } =
    useHeroAnimation();

  const scrollToAbout = () => scrollToSection('#about');

  return (
    <section
      ref={containerRef}
      id="hero"
      className="min-h-screen flex flex-col justify-center relative"
    >
      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 w-full">
        <div className="max-w-xl space-y-8">
          <AnimatedSection delay={0}>
            <h1 className="font-display text-display text-foreground text-balance">
              {personalInfo.name}
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <p className="font-display text-h4 text-primary">
              {personalInfo.title}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <p className="text-body-lg text-muted-foreground max-w-lg text-pretty">
              {personalInfo.tagline}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <SocialButtons className="pt-4" />
          </AnimatedSection>
        </div>
      </div>

      {/* Character — fixed to the viewport, leaning on its right edge, behind
          everything (-z-10 sits under the page's in-flow sections but above
          the body's canvas color). One fixed size throughout; the hook only
          dims it into a background presence once the hero scrolls away. The
          outer box takes the scroll dim, the inner one the load entrance,
          so the two tweens never fight over the same transform. */}
      <div
        ref={characterRef}
        aria-hidden="true"
        className="pointer-events-none fixed right-0 bottom-0 -z-10 aspect-[776/1600] h-[37svh] md:h-[51svh] lg:h-[73svh]"
      >
        <div ref={entranceRef} className="h-full w-full">
          <video
            ref={videoRef}
            src={CHARACTER_LOOP_SRC}
            poster={CHARACTER_POSTER_SRC}
            className="h-full w-full"
            muted
            loop
            playsInline
            preload="none"
          />
        </div>
      </div>

      <AnimatedSection
        delay={600}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <button
          onClick={scrollToAbout}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          aria-label={t.hero.scrollLabel}
        >
          <span className="text-xs uppercase tracking-widest">{t.hero.scroll}</span>
          <ArrowDown size={16} className="scroll-hint" />
        </button>
      </AnimatedSection>
    </section>
  );
}
