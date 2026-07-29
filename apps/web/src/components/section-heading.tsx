import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  children: React.ReactNode
  align?: 'center' | 'start'
  className?: string
  /** Renders as h1 on pages where the heading is the page title */
  as?: 'h1' | 'h2'
}

/** Bold uppercase navy title with the short blue rule used across the design */
export function SectionHeading({
  children,
  align = 'center',
  className,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col', align === 'center' ? 'items-center' : 'items-start', className)}>
      <Tag className="font-heading text-xl font-bold tracking-[0.06em] text-foreground uppercase sm:text-2xl">
        {children}
      </Tag>
      <span className="mt-3 h-0.5 w-12 bg-primary" />
    </div>
  )
}
