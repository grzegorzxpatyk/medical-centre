import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, Phone } from 'lucide-react'

import { Container } from '@/components/container'
import { buttonVariants } from '@/components/ui/button'
import { getSiteData } from '@/lib/site-data'
import { cn } from '@/lib/utils'

export async function Hero() {
  const { phone, phoneHref } = await getSiteData()

  return (
    <section className="relative overflow-hidden bg-secondary">
      {/* Photo bleeds off the right edge and fades into the tinted band */}
      <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <Image
          src="/images/hero-reception.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/50 to-transparent" />
      </div>

      <Container className="relative py-16 lg:py-24">
        <div className="max-w-xl">
          <h1 className="font-heading text-4xl leading-tight font-bold sm:text-5xl">
            <span className="block text-primary">Troska o zdrowie</span>
            <span className="block text-foreground">Twoje i Twojej rodziny</span>
          </h1>

          <p className="mt-6 max-w-md text-base text-muted-foreground">
            Zapewniamy kompleksową opiekę medyczną na najwyższym poziomie.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/umow-wizyte"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 px-6 text-xs font-semibold tracking-wide uppercase',
              )}
            >
              <CalendarDays />
              Umów wizytę online
            </Link>

            <a
              href={phoneHref}
              className="flex items-center gap-3 text-lg font-bold text-primary transition-opacity hover:opacity-80"
            >
              <Phone className="size-5" />
              {phone}
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
