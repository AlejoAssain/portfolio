import { AnimatedSection, SocialButtons } from '@/components/shared';
import { ArrowDown } from 'lucide-react';
import { useHeroAnimation, usePortfolioContent } from '@/hooks';
import { scrollToSection } from '@/lib/lenis';

const CHARACTER_ASPECT_RATIO = '1220 / 1186';

export function Hero() {
  const { personalInfo } = usePortfolioContent();
  const {
    containerRef,
    characterRef,
    videoRef,
    canvasRef,
    idleLayerRef,
    pupilsWrapRef,
  } = useHeroAnimation();

  const scrollToAbout = () => scrollToSection('#about');

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 w-full">
        <div className="max-w-xl space-y-8">
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
      </div>

      {/* Character — base flush with the viewport bottom, right side, 75% of viewport height */}
      <div
        ref={characterRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-[75vh] lg:right-[1%] lg:block"
        style={{ aspectRatio: CHARACTER_ASPECT_RATIO }}
      >
        <video
          ref={videoRef}
          src="/character/alejo-hood-transition.mp4"
          className="absolute inset-0 h-full w-full opacity-0"
          muted
          playsInline
          preload="auto"
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Resting state before any scroll: static no-pupils art with a
            cursor-tracking pupils overlay. Pixel-matched to the video's own
            first frame, so hiding this once scrolling starts hands off to
            the canvas without a visible swap. */}
        <div
          ref={idleLayerRef}
          className="absolute inset-0 h-full w-full transition-opacity duration-300"
        >
          <img
            src="/character/arms-crossed-no-pupils.png"
            alt=""
            className="absolute inset-0 h-full w-full"
          />
          <div
            ref={pupilsWrapRef}
            className="absolute inset-0 h-full w-full"
            style={{
              transform:
                'translate(var(--pupil-x, 0px), var(--pupil-y, 0px))',
            }}
          >
            <img
              src="/character/pupils-crossed.png"
              alt=""
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>

      <AnimatedSection
        delay={600}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
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
