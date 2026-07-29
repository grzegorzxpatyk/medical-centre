import type { Metadata } from 'next'

import { PageShell } from '@/components/page-shell'

export const metadata: Metadata = {
  title: 'O nas',
  description: 'Poznaj nasz ośrodek zdrowia i zespół, który się nim opiekuje.',
}

export default function ONasPage() {
  return (
    <PageShell
      title="O nas"
      lead="Od lat zapewniamy kompleksową opiekę medyczną mieszkańcom naszego miasta."
    >
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Treść tej strony jest w przygotowaniu.
      </p>
    </PageShell>
  )
}
