import type { Metadata } from 'next'
import { Mail, Phone } from 'lucide-react'

import { PageShell } from '@/components/page-shell'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Umów wizytę',
  description: 'Zarejestruj się telefonicznie lub online.',
}

export default function UmowWizytePage() {
  return (
    <PageShell title="Umów wizytę" lead="Rejestracja telefoniczna lub online.">
      <div className="max-w-2xl space-y-4 text-sm text-muted-foreground">
        <p>
          Formularz rejestracji online jest w przygotowaniu. W tej chwili wizytę umówisz
          telefonicznie lub mailowo:
        </p>
        <p className="flex items-center gap-3">
          <Phone className="size-4 text-primary" />
          <a href={siteConfig.phoneHref} className="font-semibold text-primary hover:underline">
            {siteConfig.phone}
          </a>
        </p>
        <p className="flex items-center gap-3">
          <Mail className="size-4 text-primary" />
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-semibold text-primary hover:underline"
          >
            {siteConfig.email}
          </a>
        </p>
        <p>Czynne {siteConfig.openingHours}.</p>
      </div>
    </PageShell>
  )
}
