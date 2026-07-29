import type { Doctor, Page, Service } from '@medical-centre/shared-types'

const CMS_URL = process.env.CMS_URL ?? process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

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

export const getServices = () => fetchFromCms<Service>('/services?limit=100')

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  const result = await fetchFromCms<Page>(`/pages?where[slug][equals]=${encodeURIComponent(slug)}`)
  return result.docs[0] ?? null
}
