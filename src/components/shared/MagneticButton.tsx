import {
  forwardRef,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
  useRef,
  useState,
} from 'react'

import { cn } from '@/lib/utils'

interface MagneticButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
  className?: string
  href?: string
  onClick?: MouseEventHandler<HTMLElement>
  strength?: number
}

export const MagneticButton = forwardRef<HTMLElement, MagneticButtonProps>(
  (
    { children, className, href, onClick, strength = 0.3, ...props },
    forwardedRef,
  ) => {
    const ref = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return

      const { left, top, width, height } = ref.current.getBoundingClientRect()
      const x = (e.clientX - left - width / 2) * strength
      const y = (e.clientY - top - height / 2) * strength
      setPosition({ x, y })
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    const content = (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'relative inline-flex items-center justify-center transition-transform duration-200 ease-out',
          className,
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {children}
      </div>
    )

    if (href) {
      return (
        <a
          ref={forwardedRef as Ref<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
          {...props}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={forwardedRef as Ref<HTMLButtonElement>}
        onClick={onClick as MouseEventHandler<HTMLButtonElement>}
        type="button"
        {...props}
      >
        {content}
      </button>
    )
  },
)

MagneticButton.displayName = 'MagneticButton'
