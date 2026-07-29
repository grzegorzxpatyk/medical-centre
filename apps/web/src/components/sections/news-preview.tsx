import Link from 'next/link'

import { EmptyCmsHint } from '@/components/empty-cms-hint'
import { NewsItem } from '@/components/news-item'
import { SectionHeading } from '@/components/section-heading'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getNews } from '@/lib/api'
import { cn } from '@/lib/utils'

export async function NewsPreview() {
  const { docs: news } = await getNews(3)

  return (
    <div>
      <SectionHeading align="start" className="mb-10">
        Aktualności
      </SectionHeading>

      {news.length === 0 ? (
        <EmptyCmsHint>Brak aktualności.</EmptyCmsHint>
      ) : (
        <>
          <div className="space-y-6">
            {news.map((item, index) => (
              <div key={item.id} className="space-y-6">
                {index > 0 && <Separator />}
                <NewsItem item={item} />
              </div>
            ))}
          </div>

          <Link
            href="/aktualnosci"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'mt-10 h-11 w-full px-6 text-xs font-semibold tracking-wide uppercase',
            )}
          >
            Zobacz wszystkie aktualności
          </Link>
        </>
      )}
    </div>
  )
}
