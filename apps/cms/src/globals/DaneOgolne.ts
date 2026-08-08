import type { Field, GlobalConfig } from 'payload'

/**
 * A navigation menu. All three menus share a shape, so they share a builder —
 * only the labelling differs between them.
 */
const navField = (
  name: string,
  label: string,
  description: string,
  defaultValue: { label: string; href: string }[],
): Field => ({
  name,
  type: 'array',
  label,
  defaultValue,
  labels: {
    singular: 'Link',
    plural: 'Links',
  },
  admin: {
    description,
    initCollapsed: true,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'href',
      type: 'text',
      required: true,
      admin: {
        description: 'Path relative to the site root, e.g. /kontakt',
      },
    },
  ],
})

/**
 * Site-wide contact details and navigation, previously hard-coded in
 * apps/web/src/lib/site-config.ts. A global rather than a collection because
 * exactly one document is meaningful.
 *
 * The defaults reproduce the values the site shipped with, so a freshly seeded
 * database renders the same page as before an editor touches anything.
 */
export const DaneOgolne: GlobalConfig = {
  slug: 'dane-ogolne',
  label: 'Dane ogólne',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Ośrodek Zdrowia',
      admin: {
        description: 'Shown in the logo, page titles and the footer copyright line',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      defaultValue: 'Twoje zdrowie w dobrych rękach',
      admin: {
        description: 'Sits under the name in the logo',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue: 'Zapewniamy kompleksową opiekę medyczną dla Ciebie i Twojej rodziny.',
      admin: {
        description: 'Footer intro paragraph, and the default meta description',
      },
    },
    {
      name: 'openingHours',
      type: 'text',
      required: true,
      defaultValue: 'Pon - Pt: 7:00 - 18:00',
      admin: {
        description: 'Rendered verbatim, e.g. "Pon - Pt: 7:00 - 18:00"',
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      defaultValue: '123 456 789',
      admin: {
        description:
          'Display format — spaces are fine. The tel: link is derived from it, assuming a Polish number when no country code is given.',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      defaultValue: 'rejestracja@osrodekzdrowia.pl',
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      defaultValue: 'ul. Zdrowa 1, 00-000 Twoje Miasto',
    },
    {
      name: 'social',
      type: 'group',
      admin: {
        description: 'Leave a field empty to hide its icon',
      },
      fields: [
        {
          name: 'facebook',
          type: 'text',
          defaultValue: 'https://facebook.com',
        },
        {
          name: 'instagram',
          type: 'text',
          defaultValue: 'https://instagram.com',
        },
        {
          name: 'maps',
          type: 'text',
          label: 'Google Maps',
          defaultValue: 'https://maps.google.com',
        },
      ],
    },
    navField(
      'mainNav',
      'Main navigation',
      'Header menu, also reused as the footer "Szybkie linki" column',
      [
        { label: 'Strona główna', href: '/' },
        { label: 'O nas', href: '/o-nas' },
        { label: 'Poradnie', href: '/poradnie' },
        { label: 'Lekarze', href: '/lekarze' },
        { label: 'Aktualności', href: '/aktualnosci' },
        { label: 'Kontakt', href: '/kontakt' },
      ],
    ),
    navField(
      'topBarNav',
      'Top bar navigation',
      'Utility links in the blue bar above the header',
      [
        { label: 'Deklaracja POZ', href: '/deklaracja-poz' },
        { label: 'Wyniki badań', href: '/wyniki-badan' },
        { label: 'e-Rejestracja', href: '/e-rejestracja' },
      ],
    ),
    navField('patientNav', 'Patient navigation', 'Footer column "Dla pacjenta"', [
      { label: 'Deklaracja POZ', href: '/deklaracja-poz' },
      { label: 'e-Rejestracja', href: '/e-rejestracja' },
      { label: 'Wyniki badań', href: '/wyniki-badan' },
      { label: 'Dokumenty do pobrania', href: '/dokumenty' },
      { label: 'FAQ', href: '/faq' },
    ]),
  ],
}
