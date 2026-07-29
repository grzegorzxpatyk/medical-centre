/**
 * Contact details and navigation shared by the header, footer, hero and CTA
 * band. Kept in one typed constant so promoting it to a Payload global later
 * touches a single file rather than five components.
 */
export const siteConfig = {
  name: 'Ośrodek Zdrowia',
  tagline: 'Twoje zdrowie w dobrych rękach',
  description:
    'Zapewniamy kompleksową opiekę medyczną dla Ciebie i Twojej rodziny.',
  openingHours: 'Pon - Pt: 7:00 - 18:00',
  phone: '123 456 789',
  /** tel: hrefs must not contain spaces */
  phoneHref: 'tel:+48123456789',
  email: 'rejestracja@osrodekzdrowia.pl',
  address: 'ul. Zdrowa 1, 00-000 Twoje Miasto',
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    maps: 'https://maps.google.com',
  },
} as const

export interface NavLink {
  href: string
  label: string
}

/** Main header navigation */
export const mainNav: NavLink[] = [
  { href: '/', label: 'Strona główna' },
  { href: '/o-nas', label: 'O nas' },
  { href: '/poradnie', label: 'Poradnie' },
  { href: '/lekarze', label: 'Lekarze' },
  { href: '/aktualnosci', label: 'Aktualności' },
  { href: '/kontakt', label: 'Kontakt' },
]

/** Utility links in the blue bar above the header */
export const topBarNav: NavLink[] = [
  { href: '/deklaracja-poz', label: 'Deklaracja POZ' },
  { href: '/wyniki-badan', label: 'Wyniki badań' },
  { href: '/e-rejestracja', label: 'e-Rejestracja' },
]

/** Footer column: "Dla pacjenta" */
export const patientNav: NavLink[] = [
  { href: '/deklaracja-poz', label: 'Deklaracja POZ' },
  { href: '/e-rejestracja', label: 'e-Rejestracja' },
  { href: '/wyniki-badan', label: 'Wyniki badań' },
  { href: '/dokumenty', label: 'Dokumenty do pobrania' },
  { href: '/faq', label: 'FAQ' },
]
