/**
 * Preview deployments must stay out of search results — the practice's content
 * indexed under a temporary hostname would compete with the real site once it
 * launches, and the client's phone number would show up against a URL nobody
 * controls long-term.
 *
 * Deliberately not a `NEXT_PUBLIC_` var: those are inlined into the bundle at
 * build time, and this flag has to be flippable at runtime so the very image
 * that served the preview can be promoted to production without a rebuild.
 *
 * Defaults to "not indexable", so forgetting to set it fails safe.
 */
export const isIndexable = () => process.env.SITE_INDEXABLE === 'true'
