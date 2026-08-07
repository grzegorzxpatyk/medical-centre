import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageShell } from '@/components/page-shell'
import { PoradniaIcon } from '@/components/poradnia-icon'
import { RichText } from '@/components/rich-text'
import { getPoradniaBySlug } from '@/lib/api'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const poradnia = await getPoradniaBySlug(slug)
  if (!poradnia) return {}

  return {
    title: poradnia.title,
    description: poradnia.description ?? undefined,
  }
}

export default async function PoradniaPage({ params }: Props) {
  const { slug } = await params
  const poradnia = await getPoradniaBySlug(slug)

  if (!poradnia) notFound()

  return (
    <PageShell title={poradnia.title} lead={poradnia.description ?? undefined}>
      <div className="max-w-3xl">
        <PoradniaIcon name={poradnia.icon} className="mb-8 size-12 text-primary" />

        <RichText content={poradnia.content} className="text-base" />

        {poradnia.price != null && (
          <p className="mt-8 text-sm font-semibold text-primary">Cena: {poradnia.price} PLN</p>
        )}
      </div>
    </PageShell>
  )
}
