import Image from 'next/image'
import { HeartHandshake, ShieldCheck, Users, type LucideIcon } from 'lucide-react'

import { SectionHeading } from '@/components/section-heading'

const benefits: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Users,
    title: 'Doświadczeni lekarze',
    description: 'Nasz zespół to wykwalifikowani specjaliści z wieloletnim doświadczeniem.',
  },
  {
    icon: ShieldCheck,
    title: 'Nowoczesny sprzęt',
    description: 'Korzystamy z nowoczesnych technologii i sprawdzonych metod leczenia.',
  },
  {
    icon: HeartHandshake,
    title: 'Indywidualne podejście',
    description:
      'Każdy pacjent jest dla nas ważny. Zapewniamy opiekę dopasowaną do potrzeb.',
  },
]

export function WhyUs() {
  return (
    <div>
      <SectionHeading align="start" className="mb-10">
        Dlaczego my?
      </SectionHeading>

      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
        <ul className="space-y-8">
          {benefits.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="size-5" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="font-heading text-sm font-bold text-foreground">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <Image
          src="/images/doctor-portrait.jpg"
          alt="Lekarka Ośrodka Zdrowia"
          width={420}
          height={520}
          sizes="(min-width: 1024px) 320px, 100vw"
          className="w-full max-w-xs justify-self-center rounded-xl object-cover lg:w-80"
        />
      </div>
    </div>
  )
}
