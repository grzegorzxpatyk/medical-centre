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
 * The defaults carry the practice's real details, so a freshly created database
 * renders a correct site before an editor touches anything. `src/seed.ts` writes
 * the same values into an existing database.
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
      defaultValue: 'Gabinet Lekarza Rodzinnego Zielonki',
      admin: {
        description: 'Trading name — shown in the logo and page titles. Keep it short enough to fit the header.',
      },
    },
    {
      name: 'legalName',
      type: 'text',
      admin: {
        description:
          'Full registered name, used for the footer copyright line. Falls back to the name above when empty.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      defaultValue: 'Podstawowa opieka zdrowotna',
      admin: {
        description: 'Sits under the name in the logo',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue:
        'Zapewniamy opiekę lekarza rodzinnego, pediatry i radiologa oraz opiekę pielęgniarki środowiskowej mieszkańcom Zielonek i okolic.',
      admin: {
        description: 'Footer intro paragraph, and the default meta description',
      },
    },
    {
      name: 'openingHours',
      type: 'text',
      required: true,
      defaultValue: 'Pon - Pt: 8:00 - 18:00',
      admin: {
        description: 'Rendered verbatim, e.g. "Pon - Pt: 8:00 - 18:00"',
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      defaultValue: '12 285 01 12',
      admin: {
        description:
          'Display format — spaces are fine. The tel: link is derived from it, assuming a Polish number when no country code is given.',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Optional — the practice registers patients by phone. Left empty, it is hidden across the site.',
      },
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      defaultValue: 'ul. Galicyjska 15, 32-087 Zielonki',
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
        },
        {
          name: 'instagram',
          type: 'text',
        },
        {
          name: 'maps',
          type: 'text',
          label: 'Google Maps',
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
        { label: 'Personel', href: '/lekarze' },
        { label: 'Aktualności', href: '/aktualnosci' },
        { label: 'Kontakt', href: '/kontakt' },
      ],
    ),
    navField('topBarNav', 'Top bar navigation', 'Utility links in the blue bar above the header', [
      { label: 'Deklaracja POZ', href: '/deklaracja-poz' },
      { label: 'Wyniki badań', href: '/wyniki-badan' },
    ]),
    navField('patientNav', 'Patient navigation', 'Footer column "Dla pacjenta"', [
      { label: 'Deklaracja POZ', href: '/deklaracja-poz' },
      { label: 'Wyniki badań', href: '/wyniki-badan' },
      { label: 'Dokumenty do pobrania', href: '/dokumenty' },
      { label: 'FAQ', href: '/faq' },
    ]),
  ],
}
