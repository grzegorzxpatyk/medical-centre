import type { Metadata } from 'next'

import { EmptyCmsHint } from '@/components/empty-cms-hint'
import { NewsItem } from '@/components/news-item'
import { PageShell } from '@/components/page-shell'
import { Separator } from '@/components/ui/separator'
import { getNews } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Aktualności',
  description: 'Bieżące informacje i komunikaty naszego ośrodka zdrowia.',
}

export default async function AktualnosciPage() {
  const { docs: news } = await getNews(100)

  return (
    <PageShell title="Aktualności" lead="Bieżące informacje i komunikaty naszego ośrodka.">
      {news.length === 0 ? (
        <EmptyCmsHint>Brak aktualności.</EmptyCmsHint>
      ) : (
        <div className="max-w-3xl space-y-8">
          {news.map((item, index) => (
            <div key={item.id} className="space-y-8">
              {index > 0 && <Separator />}
              <NewsItem item={item} />
            </div>
          ))}
        </div>
      )}
    </PageShell>
  )
}
