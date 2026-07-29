import type { SVGProps } from 'react'

/**
 * lucide v1 dropped its brand icons, so Facebook/Instagram are no longer
 * importable from lucide-react and are inlined here instead. Sized and stroked
 * to sit alongside the lucide set.
 */

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14.5 8.5V6.9c0-.7.5-.9.8-.9h2V3h-2.7C11.6 3 11 5.2 11 6.6v1.9H9V12h2v9h3.5v-9h2.4l.3-3.5h-2.7Z" />
    </svg>
  )
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
