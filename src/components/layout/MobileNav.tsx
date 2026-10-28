import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

interface MobileNavProps {
  items: NavItem[];
  activeHref: string;
  onNavigate: (href: string) => void;
}

export function MobileNav({ items, activeHref, onNavigate }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const { contextSafe } = useGSAP({ scope: panelRef });

  const setOpen = contextSafe((next: boolean) => {
    const panel = panelRef.current;
    if (!panel) return;
    setIsOpen(next);
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    gsap.to(panel, {
      height: next ? 'auto' : 0,
      opacity: next ? 1 : 0,
      duration: reduced ? 0 : 0.3,
      ease: 'power2.inOut',
    });
  });

  // setOpen is a fresh contextSafe wrapper each render; read it through a ref
  // so the listener only re-binds when the menu opens or closes.
  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // The panel goes inert on close; move focus out before it's stranded.
      if (panelRef.current?.contains(document.activeElement)) {
        toggleRef.current?.focus();
      }
      setOpenRef.current(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <nav aria-label="Sections" className="relative md:hidden">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen(!isOpen)}
        className="p-2 text-foreground transition-colors hover:text-primary"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <ul
        id="mobile-nav-panel"
        ref={panelRef}
        inert={!isOpen}
        className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur-lg"
        style={{ height: 0, opacity: 0 }}
      >
        {items.map((item) => (
          <li key={item.href} className="border-b border-border last:border-0">
            <a
              href={item.href}
              aria-current={activeHref === item.href ? 'location' : undefined}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.href);
                setOpen(false);
              }}
              className={cn(
                'block w-full px-5 py-3 text-left text-sm font-medium transition-colors',
                activeHref === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
