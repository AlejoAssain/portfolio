import { useEffect, useState } from 'react';

import { GlowCTA } from '@/components/shared';
import { usePortfolioContent } from '@/hooks';
import { cn } from '@/lib/utils';
import { isPastHero, onScroll, scrollToSection } from '@/lib/lenis';
import { navItems } from '@/mocks/portfolio';

import { MobileNav } from './MobileNav';
import { NavPill } from './NavPill';

const sectionIds = navItems.map((item) => item.href.replace('#', ''));

export function Header() {
  const { personalInfo, sectionVisibility } = usePortfolioContent();
  const visibleNavItems = navItems.filter((item) => {
    const section = item.href.replace('#', '');
    return sectionVisibility[section as keyof typeof sectionVisibility];
  });
  const [activeSection, setActiveSection] = useState('');
  const [isSolid, setIsSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSolid(isPastHero());

      let current = '';
      for (const sectionId of [...sectionIds].reverse()) {
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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#"
          aria-label={personalInfo.name}
          className="block h-9 w-9 bg-foreground opacity-90 transition-opacity hover:opacity-100 [mask-image:url(/logo.png)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-image:url(/logo.png)] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]"
        />

        <NavPill
          items={visibleNavItems}
          activeHref={`#${activeSection}`}
          onNavigate={scrollToSection}
        />

        <div className="flex items-center gap-2">
          <GlowCTA
            onClick={() => scrollToSection('#contact')}
            className="hidden sm:inline-flex"
          >
            Say hello
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
