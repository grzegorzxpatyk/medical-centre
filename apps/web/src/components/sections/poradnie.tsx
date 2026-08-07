import Link from 'next/link'

import { Container } from '@/components/container'
import { EmptyCmsHint } from '@/components/empty-cms-hint'
import { SectionHeading } from '@/components/section-heading'
import { PoradnieCarousel } from '@/components/sections/poradnie-carousel'
import { buttonVariants } from '@/components/ui/button'
import { getPoradnie } from '@/lib/api'
import { cn } from '@/lib/utils'

export async function Poradnie() {
  const { docs: poradnie } = await getPoradnie()

  return (
    <section className="bg-secondary py-16">
      <Container>
        <SectionHeading className="mb-12">Nasze poradnie</SectionHeading>

        {poradnie.length === 0 ? (
          <EmptyCmsHint>Nie dodano jeszcze żadnych poradni.</EmptyCmsHint>
        ) : (
          <>
            <PoradnieCarousel poradnie={poradnie} />

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
