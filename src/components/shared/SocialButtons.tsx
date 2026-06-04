import {
  BriefcaseBusiness,
  Code2,
  Mail,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react'

import { socialLinks } from '@/mocks/portfolio'
import { cn } from '@/lib/utils'
import { MagneticButton } from '@/components/shared/MagneticButton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const iconMap: Record<string, LucideIcon> = {
  github: Code2,
  linkedin: BriefcaseBusiness,
  twitter: MessageCircle,
  mail: Mail,
}

interface SocialButtonsProps {
  className?: string
  iconSize?: number
}

export function SocialButtons({ className, iconSize = 20 }: SocialButtonsProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {socialLinks.map((link) => {
        const Icon = iconMap[link.icon] ?? Mail

        return (
          <Tooltip key={link.name}>
            <TooltipTrigger asChild>
              <MagneticButton
                href={link.url}
                strength={0.4}
                aria-label={link.name}
              >
                <span className="flex items-center justify-center rounded-lg bg-secondary p-3 text-secondary-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
                  <Icon size={iconSize} />
                  <span className="sr-only">{link.name}</span>
                </span>
              </MagneticButton>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>{link.name}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
