import type { Metadata } from 'next'
import { Mail, Phone } from 'lucide-react'

import { PageShell } from '@/components/page-shell'
import { getSiteData } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Umów wizytę',
  description: 'Zarejestruj się telefonicznie lub online.',
}

export default async function UmowWizytePage() {
  const { phone, phoneHref, email, openingHours } = await getSiteData()

  return (
    <PageShell title="Umów wizytę" lead="Rejestracja telefoniczna lub online.">
      <div className="max-w-2xl space-y-4 text-sm text-muted-foreground">
        <p>
          Formularz rejestracji online jest w przygotowaniu. W tej chwili wizytę umówisz
          telefonicznie lub mailowo:
        </p>
        <p className="flex items-center gap-3">
          <Phone className="size-4 text-primary" />
          <a href={phoneHref} className="font-semibold text-primary hover:underline">
            {phone}
          </a>
        </p>
        <p className="flex items-center gap-3">
          <Mail className="size-4 text-primary" />
          <a
            href={`mailto:${email}`}
            className="font-semibold text-primary hover:underline"
          >
            {email}
          </a>
        </p>
        <p>Czynne {openingHours}.</p>
      </div>
    </PageShell>
  )
}
