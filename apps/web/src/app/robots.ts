import type { MetadataRoute } from 'next'

import { isIndexable } from '@/lib/seo'

// Read the flag per request rather than baking it in at build time
export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return { rules: { userAgent: '*', allow: '/' } }
}
