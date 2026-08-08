import { cache } from 'react'

import { getDaneOgolne } from '@/lib/api'

export interface NavLink {
  href: string
  label: string
}

/**
 * The header, footer, hero and CTA band all read from this shape. It is the
 * `dane-ogolne` global flattened into non-nullable fields so components never
 * have to branch on whether an editor filled a box in — apart from the handful
 * that are genuinely optional and hide themselves when empty.
 */
export interface SiteData {
  name: string
  /** Registered name for the footer copyright; falls back to `name` */
  legalName: string
  tagline: string
  description: string
  openingHours: string
  phone: string
  /** Derived from `phone`; tel: hrefs must not contain spaces */
  phoneHref: string
  /** The practice registers by phone; omitted when no address is published */
  email?: string
  address: string
  /** Empty entries are omitted so their icons can be hidden */
  social: { facebook?: string; instagram?: string; maps?: string }
  mainNav: NavLink[]
  topBarNav: NavLink[]
  patientNav: NavLink[]
}

/**
 * Used only when the CMS is unreachable. Every page renders the header and
 * footer, so degrading to an empty result the way the collection fetchers do
 * would take the whole site down rather than one section of it.
 *
 * These match the `dane-ogolne` field defaults.
 */
const fallback: SiteData = {
  name: 'Gabinet Lekarza Rodzinnego Zielonki',
  legalName: 'NZOZ Gabinet Lekarza Rodzinnego Zielonki Sp. z o.o.',
  tagline: 'Podstawowa opieka zdrowotna',
  description:
    'Zapewniamy opiekę lekarza rodzinnego, pediatry i radiologa oraz opiekę pielęgniarki środowiskowej mieszkańcom Zielonek i okolic.',
  openingHours: 'Pon - Pt: 8:00 - 18:00',
  phone: '12 285 01 12',
  phoneHref: 'tel:+48122850112',
  address: 'ul. Galicyjska 15, 32-087 Zielonki',
  social: {},
  mainNav: [
    { href: '/', label: 'Strona główna' },
    { href: '/o-nas', label: 'O nas' },
    { href: '/poradnie', label: 'Poradnie' },
    { href: '/lekarze', label: 'Personel' },
    { href: '/aktualnosci', label: 'Aktualności' },
    { href: '/kontakt', label: 'Kontakt' },
  ],
  topBarNav: [
    { href: '/deklaracja-poz', label: 'Deklaracja POZ' },
    { href: '/wyniki-badan', label: 'Wyniki badań' },
  ],
  patientNav: [
    { href: '/deklaracja-poz', label: 'Deklaracja POZ' },
    { href: '/wyniki-badan', label: 'Wyniki badań' },
    { href: '/dokumenty', label: 'Dokumenty do pobrania' },
    { href: '/faq', label: 'FAQ' },
  ],
}

/**
 * Editors enter phone numbers in a readable form ("12 285 01 12"), which is not
 * a valid tel: target. Numbers without a country code are assumed Polish.
 */
function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return `tel:${digits.startsWith('+') ? digits : `+48${digits}`}`
}

/** Drops the `id` Payload adds to array rows, and any half-filled rows */
function toNavLinks(
  rows: { label?: string | null; href?: string | null }[] | null | undefined,
  fallbackLinks: NavLink[],
): NavLink[] {
  if (!rows?.length) return fallbackLinks
  return rows
    .filter((row): row is { label: string; href: string } => Boolean(row.label && row.href))
    .map(({ label, href }) => ({ label, href }))
}

/** Blank text fields come back as `''` or `null`; both mean "not set" */
const optional = (value: string | null | undefined) => value?.trim() || undefined

/**
 * Cached per request so the header, footer and any page section that needs
 * contact details share a single fetch.
 */
export const getSiteData = cache(async (): Promise<SiteData> => {
  const data = await getDaneOgolne()
  if (!data) return fallback

  return {
    name: data.name,
    legalName: optional(data.legalName) ?? data.name,
    tagline: data.tagline,
    description: data.description,
    openingHours: data.openingHours,
    phone: data.phone,
    phoneHref: telHref(data.phone),
    email: optional(data.email),
    address: data.address,
    social: {
      facebook: optional(data.social?.facebook),
      instagram: optional(data.social?.instagram),
      maps: optional(data.social?.maps),
    },
    mainNav: toNavLinks(data.mainNav, fallback.mainNav),
    topBarNav: toNavLinks(data.topBarNav, fallback.topBarNav),
    patientNav: toNavLinks(data.patientNav, fallback.patientNav),
  }
})
