import { Container } from '@/components/container'
import { SectionHeading } from '@/components/section-heading'

interface PageShellProps {
  title: string
  lead?: string
  children?: React.ReactNode
}

/** Standard inner-page frame: heading band plus a content container */
export function PageShell({ title, lead, children }: PageShellProps) {
  return (
    <>
      <div className="bg-secondary py-12">
        <Container>
          <SectionHeading as="h1" align="start">
            {title}
          </SectionHeading>
          {lead && <p className="mt-5 max-w-2xl text-sm text-muted-foreground">{lead}</p>}
        </Container>
      </div>

      {children && (
        <Container className="py-14">{children}</Container>
      )}
    </>
  )
}
