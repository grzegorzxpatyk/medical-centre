import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Poradnia } from '@medical-centre/shared-types'

import { PoradniaIcon } from '@/components/poradnia-icon'
import { Card, CardContent } from '@/components/ui/card'

export function PoradniaCard({ poradnia }: { poradnia: Poradnia }) {
  return (
    <Card className="h-full text-center transition-shadow hover:shadow-lg">
      <CardContent className="flex h-full flex-col items-center gap-4">
        <PoradniaIcon name={poradnia.icon} className="size-10 text-primary" />

        <h3 className="font-heading text-sm font-bold text-foreground">{poradnia.title}</h3>

        {poradnia.description && (
          <p className="text-xs leading-relaxed text-muted-foreground">{poradnia.description}</p>
        )}

        <Link
          href={`/poradnie/${poradnia.slug}`}
          className="mt-auto inline-flex items-center gap-2 pt-2 text-xs font-semibold tracking-wide text-primary uppercase hover:underline"
        >
          Zobacz więcej
          <ArrowRight className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
