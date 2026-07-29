import type { Metadata } from 'next'

import { PageShell } from '@/components/page-shell'

export const metadata: Metadata = {
  title: 'e-Rejestracja',
  description: 'Zarejestruj się na wizytę przez internet.',
}

export default function ERejestracjaPage() {
  return (
    <PageShell title="e-Rejestracja" lead="Zarejestruj się na wizytę przez internet.">
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        System e-Rejestracji jest w przygotowaniu.
      </p>
    </PageShell>
  )
}
