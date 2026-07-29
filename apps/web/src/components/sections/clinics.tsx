import Link from 'next/link'

import { Container } from '@/components/container'
import { EmptyCmsHint } from '@/components/empty-cms-hint'
import { SectionHeading } from '@/components/section-heading'
import { ServiceCard } from '@/components/service-card'
import { buttonVariants } from '@/components/ui/button'
import { getServices } from '@/lib/api'
import { cn } from '@/lib/utils'

export async function Clinics() {
  const { docs: services } = await getServices(5)

  return (
    <section className="bg-secondary py-16">
      <Container>
        <SectionHeading className="mb-12">Nasze poradnie</SectionHeading>

        {services.length === 0 ? (
          <EmptyCmsHint>Nie dodano jeszcze żadnych poradni.</EmptyCmsHint>
        ) : (
          <>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {services.map((service) => (
                <li key={service.id}>
                  <ServiceCard service={service} />
                </li>
              ))}
            </ul>

            <div className="mt-12 flex justify-center">
              <Link
                href="/poradnie"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'h-11 px-6 text-xs font-semibold tracking-wide uppercase',
                )}
              >
                Zobacz wszystkie poradnie
              </Link>
            </div>
          </>
        )}
      </Container>
    </section>
  )
}
