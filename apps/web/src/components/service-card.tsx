import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Service } from '@medical-centre/shared-types'

import { ServiceIcon } from '@/components/service-icon'
import { Card, CardContent } from '@/components/ui/card'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="h-full text-center transition-shadow hover:shadow-lg">
      <CardContent className="flex h-full flex-col items-center gap-4">
        <ServiceIcon name={service.icon} className="size-10 text-primary" />

        <h3 className="font-heading text-sm font-bold text-foreground">{service.title}</h3>

        {service.description && (
          <p className="text-xs leading-relaxed text-muted-foreground">{service.description}</p>
        )}

        <Link
          href={`/poradnie/${service.slug}`}
          className="mt-auto inline-flex items-center gap-2 pt-2 text-xs font-semibold tracking-wide text-primary uppercase hover:underline"
        >
          Zobacz więcej
          <ArrowRight className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
