import Image from 'next/image'
import Link from 'next/link'
import type { News } from '@medical-centre/shared-types'

import { mediaAlt, mediaUrl } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function NewsItem({ item }: { item: News }) {
  const image = mediaUrl(item.image)

  return (
    <article className="flex gap-5">
      {image && (
        <Image
          src={image}
          alt={mediaAlt(item.image, item.title)}
          width={180}
          height={120}
          sizes="90px"
          className="h-16 w-24 shrink-0 rounded-md object-cover"
        />
      )}

      <div className="min-w-0">
        <h3 className="font-heading text-sm font-bold text-foreground">
          <Link href={`/aktualnosci/${item.slug}`} className="hover:text-primary">
            {item.title}
          </Link>
        </h3>

        {item.excerpt && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
        )}

        <time dateTime={item.publishedAt} className="mt-2 block text-xs text-muted-foreground/80">
          {formatDate(item.publishedAt)}
        </time>
      </div>
    </article>
  )
}
