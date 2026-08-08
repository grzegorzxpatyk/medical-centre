import type { Metadata } from 'next'

import { EmptyCmsHint } from '@/components/empty-cms-hint'
import { PageShell } from '@/components/page-shell'
import { PoradniaCard } from '@/components/poradnia-card'
import { getPoradnie } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Poradnie',
  description: 'Pełna lista poradni i specjalizacji dostępnych w naszej przychodni.',
}

export default async function PoradniePage() {
  const { docs: poradnie } = await getPoradnie()

  return (
    <PageShell
      title="Nasze poradnie"
      lead="Zapewniamy kompleksową opiekę medyczną w szerokim zakresie specjalizacji."
    >
      {poradnie.length === 0 ? (
        <EmptyCmsHint>Nie dodano jeszcze żadnych poradni.</EmptyCmsHint>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {poradnie.map((poradnia) => (
            <li key={poradnia.id}>
              <PoradniaCard poradnia={poradnia} />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
