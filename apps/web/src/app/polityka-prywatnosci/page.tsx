import type { Metadata } from 'next'

import { PageShell } from '@/components/page-shell'

export const metadata: Metadata = {
  title: 'Polityka prywatności',
  description: 'Zasady przetwarzania danych osobowych w naszym ośrodku zdrowia.',
}

export default function PolitykaPrywatnosciPage() {
  return (
    <PageShell
      title="Polityka prywatności"
      lead="Zasady przetwarzania danych osobowych w naszym ośrodku."
    >
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
        Treść polityki prywatności jest w przygotowaniu.
      </p>
    </PageShell>
  )
}
