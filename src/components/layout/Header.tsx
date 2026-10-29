import { useEffect, useState } from 'react';

import { GlowCTA } from '@/components/shared';
import { navSections } from '@/data/navigation';
import { usePortfolioContent } from '@/hooks';
import { useLanguage } from '@/i18n/LanguageProvider';
import { cn } from '@/lib/utils';
import { isScrolled, onScroll, scrollToSection } from '@/lib/lenis';

import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { NavPill } from './NavPill';

export function Header() {
  const { personalInfo, sectionVisibility } = usePortfolioContent();
  const { t } = useLanguage();
  const visibleNavItems = navSections
    .filter((section) => sectionVisibility[section])
    .map((section) => ({ label: t.nav[section], href: `#${section}` }));
  const [activeSection, setActiveSection] = useState('');
  const [isSolid, setIsSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSolid(isScrolled());

      let current = '';
      for (const sectionId of [...navSections].reverse()) {
        const element = document.getElementById(sectionId);
        if (element && element.getBoundingClientRect().top <= 100) {
          current = sectionId;
          break;
        }
      }
      setActiveSection(current);
    };

    return onScroll(handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-300',
        isSolid && 'bg-background border-b border-border',
      )}
    >
      <a
        href="#main"
        className="sr-only rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        {t.header.skipToContent}
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* A real navigation to "/": reloads and lands at the top with a clean
            URL. `#` left a trailing hash and fought Lenis for the scroll. */}
        <a
          href="/"
          aria-label={personalInfo.name}
          className="block h-9 w-9 bg-foreground opacity-90 transition-opacity hover:opacity-100 [mask-image:url(/logo.png)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-image:url(/logo.png)] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]"
        />

        <NavPill
          items={visibleNavItems}
          activeHref={`#${activeSection}`}
          onNavigate={scrollToSection}
        />

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <GlowCTA
            onClick={() => scrollToSection('#contact')}
            className="hidden sm:inline-flex"
          >
            {t.header.sayHello}
          </GlowCTA>
          <MobileNav
            items={visibleNavItems}
            activeHref={`#${activeSection}`}
            onNavigate={scrollToSection}
          />
        </div>
      </div>
    </header>
  );
}
