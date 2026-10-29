import { cn } from '@/lib/utils'

interface SkillBadgeProps {
  name: string
  icon?: string
  className?: string
}

export function SkillBadge({ name, icon, className }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-mono-xs font-mono rounded-full',
        'bg-secondary text-secondary-foreground',
        'border border-border',
        'hover:bg-primary hover:text-primary-foreground hover:border-primary',
        'transition-all duration-300 cursor-default',
        className,
      )}
    >
      {icon && (
        // Mask so the monochrome logo follows the text color, hover included.
        <span
          aria-hidden
          className="size-3.5 shrink-0 bg-current"
          style={{
            mask: `url(/skill-icons/${icon}.svg) center / contain no-repeat`,
          }}
        />
      )}
      {name}
    </span>
  )
}
