import type { Metadata } from 'next'

import { PageShell } from '@/components/page-shell'

export const metadata: Metadata = {
  title: 'Dokumenty do pobrania',
  description: 'Formularze i dokumenty do pobrania.',
}

export default function DokumentyPage() {
  return (
    <PageShell title="Dokumenty do pobrania" lead="Formularze i dokumenty w jednym miejscu.">
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Lista dokumentów jest w przygotowaniu.
      </p>
    </PageShell>
  )
}
