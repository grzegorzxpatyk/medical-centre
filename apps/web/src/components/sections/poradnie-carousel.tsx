'use client'

import type { Poradnia } from '@medical-centre/shared-types'

import { PoradniaCard } from '@/components/poradnia-card'
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

/**
 * Five cards abreast on desktop, stepping down to one on phones. Arrows sit in
 * the container gutter and are hidden on small screens, where swiping and the
 * dots below are the natural affordances.
 */
export function PoradnieCarousel({ poradnie }: { poradnie: Poradnia[] }) {
  return (
    <Carousel
      opts={{ align: 'start', containScroll: 'trimSnaps' }}
      aria-label="Nasze poradnie"
      className="w-full"
    >
      <CarouselContent className="items-stretch py-1">
        {poradnie.map((poradnia) => (
          <CarouselItem key={poradnia.id} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/5">
            <PoradniaCard poradnia={poradnia} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="hidden lg:inline-flex" />
      <CarouselNext className="hidden lg:inline-flex" />

      <CarouselDots className="mt-8" />
    </Carousel>
  )
}
