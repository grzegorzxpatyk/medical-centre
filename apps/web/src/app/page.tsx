import { Container } from '@/components/container'
import { CtaBand } from '@/components/sections/cta-band'
import { Hero } from '@/components/sections/hero'
import { NewsPreview } from '@/components/sections/news-preview'
import { Poradnie } from '@/components/sections/poradnie'
import { WhyUs } from '@/components/sections/why-us'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Poradnie />

      <section className="bg-card py-16">
        <Container className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <WhyUs />
          <div className="lg:border-l lg:pl-16">
            <NewsPreview />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  )
}
