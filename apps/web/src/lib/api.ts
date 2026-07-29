import type { Doctor, Media, News, Page, Service } from '@medical-centre/shared-types'

const CMS_URL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

/** Browser-reachable CMS origin — media URLs are rendered client-side */
const CMS_PUBLIC_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

/**
 * Payload upload fields are `number | Media | null` depending on depth, so this
 * narrows to a usable absolute URL (or null when the relation is unpopulated).
 */
export function mediaUrl(media: number | Media | null | undefined): string | null {
  if (typeof media !== 'object' || media === null || !media.url) return null
  return `${CMS_PUBLIC_URL}${media.url}`
}

export function mediaAlt(media: number | Media | null | undefined, fallback = ''): string {
  return typeof media === 'object' && media !== null ? media.alt : fallback
}

/** Shape of Payload's paginated REST responses */
export interface PaginatedDocs<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

const emptyResult = <T>(): PaginatedDocs<T> => ({
  docs: [],
  totalDocs: 0,
  limit: 0,
  totalPages: 0,
  page: 1,
  pagingCounter: 0,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
})

async function fetchFromCms<T>(path: string): Promise<PaginatedDocs<T>> {
  try {
    const res = await fetch(`${CMS_URL}/api${path}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) {
      throw new Error(`CMS request failed: ${res.status} ${res.statusText}`)
    }
    return (await res.json()) as PaginatedDocs<T>
  } catch (error) {
    console.error(`Could not fetch ${path} from CMS at ${CMS_URL}:`, error)
    return emptyResult<T>()
  }
}

export const getDoctors = () => fetchFromCms<Doctor>('/doctors?limit=100')

export const getServices = (limit = 100) =>
  fetchFromCms<Service>(`/services?limit=${limit}&sort=order`)

export const getNews = (limit = 3) => fetchFromCms<News>(`/news?limit=${limit}&sort=-publishedAt`)

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  const result = await fetchFromCms<Page>(`/pages?where[slug][equals]=${encodeURIComponent(slug)}`)
  return result.docs[0] ?? null
}

export const getServiceBySlug = async (slug: string): Promise<Service | null> => {
  const result = await fetchFromCms<Service>(
    `/services?where[slug][equals]=${encodeURIComponent(slug)}`,
  )
  return result.docs[0] ?? null
}

export const getNewsBySlug = async (slug: string): Promise<News | null> => {
  const result = await fetchFromCms<News>(`/news?where[slug][equals]=${encodeURIComponent(slug)}`)
  return result.docs[0] ?? null
}
