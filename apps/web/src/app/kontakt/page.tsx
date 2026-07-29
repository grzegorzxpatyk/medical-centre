import type { Metadata } from 'next'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { PageShell } from '@/components/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: `Skontaktuj się z nami — ${siteConfig.address}, tel. ${siteConfig.phone}.`,
}

const details = [
  { icon: MapPin, label: 'Adres', value: siteConfig.address },
  { icon: Phone, label: 'Telefon', value: siteConfig.phone, href: siteConfig.phoneHref },
  { icon: Mail, label: 'E-mail', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: Clock, label: 'Godziny otwarcia', value: siteConfig.openingHours },
]

export default function KontaktPage() {
  return (
    <PageShell title="Kontakt" lead="Jesteśmy do Twojej dyspozycji.">
      <ul className="grid max-w-4xl gap-5 sm:grid-cols-2">
        {details.map(({ icon: Icon, label, value, href }) => (
          <li key={label}>
            <Card className="h-full">
              <CardContent className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="font-heading text-sm font-bold text-foreground">{label}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {href ? (
                      <a href={href} className="hover:text-primary">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </PageShell>
  )
}
