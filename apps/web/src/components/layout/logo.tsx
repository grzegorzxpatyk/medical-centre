import Link from 'next/link'

import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

interface LogoProps {
  /** `light` sits on white surfaces, `dark` on the navy footer */
  variant?: 'light' | 'dark'
  className?: string
  /** Render as a plain block instead of a link (e.g. inside the mobile sheet header) */
  asLink?: boolean
}

function HeartMark({ variant }: { variant: 'light' | 'dark' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-9 shrink-0', variant === 'light' ? 'text-primary' : 'text-background')}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 21.35 10.55 20.03C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"
      />
      <g className={variant === 'light' ? 'fill-card' : 'fill-primary'}>
        <rect x="10.9" y="6.2" width="2.2" height="7.6" rx="0.6" />
        <rect x="8.2" y="8.9" width="7.6" height="2.2" rx="0.6" />
      </g>
    </svg>
  )
}

export function Logo({ variant = 'light', className, asLink = true }: LogoProps) {
  const content = (
    <>
      <HeartMark variant={variant} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-heading text-base font-bold tracking-tight',
            variant === 'light' ? 'text-foreground' : 'text-background',
          )}
        >
          {siteConfig.name.toUpperCase()}
        </span>
        <span
          className={cn(
            'mt-1 text-[0.5rem] font-medium tracking-[0.14em] uppercase',
            variant === 'light' ? 'text-muted-foreground' : 'text-background/70',
          )}
        >
          {siteConfig.tagline}
        </span>
      </span>
    </>
  )

  const classes = cn('flex items-center gap-2.5', className)

  if (!asLink) {
    return <span className={classes}>{content}</span>
  }

  return (
    <Link href="/" className={classes} aria-label={siteConfig.name}>
      {content}
    </Link>
  )
}
