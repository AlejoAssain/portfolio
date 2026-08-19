import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import { useRef, useState } from 'react';

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

  return (
    <div className="relative md:hidden">
      <button
        onClick={() => setOpen(!isOpen)}
        className="p-2 text-foreground transition-colors hover:text-primary"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      <ul
        ref={panelRef}
        className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur-lg"
        style={{ height: 0, opacity: 0 }}
      >
        {items.map((item) => (
          <li key={item.href} className="border-b border-border last:border-0">
            <button
              onClick={() => {
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
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
