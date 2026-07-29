import type { Metadata } from 'next'

import { PageShell } from '@/components/page-shell'

export const metadata: Metadata = {
  title: 'Deklaracja POZ',
  description: 'Złóż deklarację wyboru lekarza podstawowej opieki zdrowotnej.',
}

export default function DeklaracjaPozPage() {
  return (
    <PageShell
      title="Deklaracja POZ"
      lead="Złóż deklarację wyboru lekarza podstawowej opieki zdrowotnej."
    >
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Treść tej strony jest w przygotowaniu.
      </p>
    </PageShell>
  )
}
