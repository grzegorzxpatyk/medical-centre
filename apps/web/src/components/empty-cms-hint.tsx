const CMS_PUBLIC_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

/**
 * Shown wherever a CMS-driven section has no documents yet — the API client
 * degrades to an empty result when the CMS is unreachable, so this doubles as
 * the "CMS is down" state instead of an error page.
 */
export function EmptyCmsHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {children}{' '}
      <a href={`${CMS_PUBLIC_URL}/admin`} className="text-primary underline">
        Dodaj treści w panelu CMS
      </a>
      .
    </p>
  )
}
