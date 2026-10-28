import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface GlowCTAProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export function GlowCTA({ onClick, children, className }: GlowCTAProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative inline-flex items-center justify-center rounded-full p-px transition-transform duration-[var(--duration-micro)] ease-out-snap active:scale-[0.97]',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="glow-cta-ring absolute inset-0 rounded-full"
      />
      <span className="relative rounded-full bg-card px-5 py-2 text-sm font-medium text-foreground transition-colors group-hover:bg-card/70">
        {children}
      </span>
    </button>
  );
}
