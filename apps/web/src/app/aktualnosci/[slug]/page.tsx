import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { PageShell } from '@/components/page-shell'
import { RichText } from '@/components/rich-text'
import { getNewsBySlug, mediaAlt, mediaUrl } from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getNewsBySlug(slug)
  if (!item) return {}

  return {
    title: item.title,
    description: item.excerpt ?? undefined,
  }
}

export default async function AktualnoscPage({ params }: Props) {
  const { slug } = await params
  const item = await getNewsBySlug(slug)

  if (!item) notFound()

  const image = mediaUrl(item.image)

  return (
    <PageShell title={item.title} lead={item.excerpt ?? undefined}>
      <article className="max-w-3xl">
        <time dateTime={item.publishedAt} className="text-xs text-muted-foreground">
          {formatDate(item.publishedAt)}
        </time>

        {image && (
          <Image
            src={image}
            alt={mediaAlt(item.image, item.title)}
            width={960}
            height={540}
            sizes="(min-width: 768px) 768px, 100vw"
            className="mt-6 w-full rounded-xl object-cover"
          />
        )}

        <RichText content={item.content} className="mt-8 text-base" />
      </article>
    </PageShell>
  )
}
