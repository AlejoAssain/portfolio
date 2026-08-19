import { cn } from '@/lib/utils'

interface SkillBadgeProps {
  name: string
  className?: string
}

export function SkillBadge({ name, className }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1.5 text-mono-xs font-mono rounded-full',
        'bg-secondary text-secondary-foreground',
        'border border-border',
        'hover:bg-primary hover:text-primary-foreground hover:border-primary',
        'transition-all duration-300 cursor-default',
        className,
      )}
    >
      {name}
    </span>
  )
}
