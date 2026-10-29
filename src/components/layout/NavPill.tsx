import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';

import { useLanguage } from '@/i18n/LanguageProvider';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

interface NavPillProps {
  items: NavItem[];
  activeHref: string;
  onNavigate: (href: string) => void;
}

export function NavPill({ items, activeHref, onNavigate }: NavPillProps) {
  const { t } = useLanguage();
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  // Labels change width when the language does; the indicator has to follow.
  const labels = items.map((item) => item.label).join('|');

  const moveIndicator = (animate: boolean) => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    const activeLink = linkRefs.current.get(activeHref);
    if (!nav || !indicator) return;

    if (!activeLink) {
      gsap.set(indicator, { opacity: 0 });
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const x = linkRect.left - navRect.left;
    const width = linkRect.width;

    if (!animate) {
      gsap.set(indicator, { x, width, opacity: 1 });
      return;
    }
    gsap.to(indicator, { x, width, duration: 0.35, ease: 'power3.out' });
  };

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      moveIndicator(!reduced);

      const onResize = () => moveIndicator(false);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    },
    { scope: navRef, dependencies: [activeHref, labels] },
  );

  return (
    <nav
      ref={navRef}
      aria-label={t.nav.label}
      className="relative hidden items-center gap-1 rounded-full border border-border bg-card/80 px-2 py-2 backdrop-blur-lg md:flex"
    >
      <div
        ref={indicatorRef}
        className="absolute inset-y-2 left-0 rounded-full bg-primary/15"
        aria-hidden="true"
        style={{ width: 0, opacity: 0 }}
      />
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={activeHref === item.href ? 'location' : undefined}
          ref={(el) => {
            if (el) linkRefs.current.set(item.href, el);
            else linkRefs.current.delete(item.href);
          }}
          onClick={(event) => {
            event.preventDefault();
            onNavigate(item.href);
          }}
          className={cn(
            'relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors',
            activeHref === item.href
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
