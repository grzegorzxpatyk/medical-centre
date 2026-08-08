import type { Metadata } from 'next'
import { Clock, MapPin, Phone } from 'lucide-react'

import { PageShell } from '@/components/page-shell'
import { getSiteData } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Umów wizytę',
  description: 'Wizyty umawiamy wyłącznie telefonicznie.',
}

export default async function UmowWizytePage() {
  const { phone, phoneHref, address, openingHours } = await getSiteData()

  return (
    <PageShell title="Umów wizytę" lead="Rejestracja odbywa się wyłącznie telefonicznie.">
      <div className="max-w-2xl space-y-6 text-sm text-muted-foreground">
        <p>
          Nie prowadzimy rejestracji internetowej. Wizytę umówisz, dzwoniąc do rejestracji lub
          zgłaszając się osobiście w przychodni.
        </p>

        <a
          href={phoneHref}
          className="flex items-center gap-3 text-2xl font-bold text-primary transition-opacity hover:opacity-80"
        >
          <Phone className="size-6" />
          {phone}
        </a>

        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <Clock className="size-4 shrink-0 text-primary" />
            {openingHours}
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="size-4 shrink-0 text-primary" />
            {address}
          </li>
        </ul>
      </div>
    </PageShell>
  )
}
