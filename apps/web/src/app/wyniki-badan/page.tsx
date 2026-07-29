import type { Metadata } from 'next'

import { PageShell } from '@/components/page-shell'

export const metadata: Metadata = {
  title: 'Wyniki badań',
  description: 'Sprawdź wyniki swoich badań online.',
}

export default function WynikiBadanPage() {
  return (
    <PageShell title="Wyniki badań" lead="Sprawdź wyniki swoich badań online.">
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Dostęp do wyników badań online jest w przygotowaniu.
      </p>
    </PageShell>
  )
}
