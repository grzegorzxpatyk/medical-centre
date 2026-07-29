import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageShell } from '@/components/page-shell'
import { RichText } from '@/components/rich-text'
import { ServiceIcon } from '@/components/service-icon'
import { getServiceBySlug } from '@/lib/api'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}

  return {
    title: service.title,
    description: service.description ?? undefined,
  }
}

export default async function PoradniaPage({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) notFound()

  return (
    <PageShell title={service.title} lead={service.description ?? undefined}>
      <div className="max-w-3xl">
        <ServiceIcon name={service.icon} className="mb-8 size-12 text-primary" />

        <RichText content={service.content} className="text-base" />

        {service.price != null && (
          <p className="mt-8 text-sm font-semibold text-primary">Cena: {service.price} PLN</p>
        )}
      </div>
    </PageShell>
  )
}
