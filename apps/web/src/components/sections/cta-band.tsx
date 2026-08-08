import Link from 'next/link'
import { CalendarDays, Phone } from 'lucide-react'

import { Container } from '@/components/container'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getSiteData } from '@/lib/site-data'
import { cn } from '@/lib/utils'

export async function CtaBand() {
  const { phone, phoneHref } = await getSiteData()

  return (
    <section className="bg-primary py-10 text-primary-foreground">
      <Container className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary-foreground text-primary">
            <CalendarDays className="size-6" strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="font-heading text-xl font-bold">Umów wizytę już dziś</h2>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Rejestracja telefoniczna lub online.
            </p>
          </div>
          <Link
            href="/umow-wizyte"
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'h-11 border-primary-foreground/60 bg-transparent px-6 text-xs font-semibold tracking-wide text-primary-foreground uppercase hover:bg-primary-foreground hover:text-primary sm:ml-6',
            )}
          >
            Umów wizytę
          </Link>
        </div>

        <Separator orientation="vertical" className="hidden h-16 bg-primary-foreground/25 lg:block" />

        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary-foreground text-primary">
            <Phone className="size-6" strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="font-heading text-xl font-bold">Zadzwoń do nas</h2>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Jesteśmy do Twojej dyspozycji.
            </p>
          </div>
          <a
            href={phoneHref}
            className="text-xl font-bold transition-opacity hover:opacity-80 sm:ml-6"
          >
            {phone}
          </a>
        </div>
      </Container>
    </section>
  )
}
