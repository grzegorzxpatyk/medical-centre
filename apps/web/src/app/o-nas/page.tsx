import type { Metadata } from 'next'

import { PageShell } from '@/components/page-shell'
import { getSiteData } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'O nas',
  description: 'Poznaj naszą przychodnię i zespół, który się nią opiekuje.',
}

export default async function ONasPage() {
  const { legalName, address, openingHours, phone, phoneHref } = await getSiteData()

  return (
    <PageShell
      title="O nas"
      lead="Przychodnia podstawowej opieki zdrowotnej dla mieszkańców Zielonek i okolic."
    >
      <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          {legalName} prowadzi przychodnię przy {address}. Opiekujemy się pacjentami w każdym wieku —
          od pierwszych dni życia po seniorów.
        </p>
        <p>
          W ramach podstawowej opieki zdrowotnej przyjmują u nas specjaliści medycyny rodzinnej,
          lekarz pediatra oraz lekarz radiolog. Opiekę pielęgniarską, także w domu pacjenta,
          zapewnia pielęgniarka środowiskowa.
        </p>
        <p>
          Rejestracja czynna jest w godzinach {openingHours} i prowadzona wyłącznie telefonicznie
          pod numerem{' '}
          <a href={phoneHref} className="font-semibold text-primary hover:underline">
            {phone}
          </a>
          .
        </p>
      </div>
    </PageShell>
  )
}
