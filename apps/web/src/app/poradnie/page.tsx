import type { Metadata } from 'next'

import { EmptyCmsHint } from '@/components/empty-cms-hint'
import { PageShell } from '@/components/page-shell'
import { ServiceCard } from '@/components/service-card'
import { getServices } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Poradnie',
  description: 'Pełna lista poradni i specjalizacji dostępnych w naszym ośrodku.',
}

export default async function PoradniePage() {
  const { docs: services } = await getServices()

  return (
    <PageShell
      title="Nasze poradnie"
      lead="Zapewniamy kompleksową opiekę medyczną w szerokim zakresie specjalizacji."
    >
      {services.length === 0 ? (
        <EmptyCmsHint>Nie dodano jeszcze żadnych poradni.</EmptyCmsHint>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <li key={service.id}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
