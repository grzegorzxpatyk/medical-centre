import type { CollectionConfig } from 'payload'

/**
 * Everyone the practice lists as personnel, not only the physicians — nurses,
 * the registrar and technical staff live here too, which is why `specialty`
 * is labelled as a role.
 */
export const Doctors: CollectionConfig = {
  slug: 'doctors',
  labels: {
    singular: 'Osoba',
    plural: 'Personel',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'specialty', 'order'],
  },
  // Without this Payload falls back to '-createdAt', which lists newly added
  // people first rather than in the practice's own order.
  defaultSort: 'order',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'specialty',
      type: 'text',
      label: 'Rola / specjalizacja',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'richText',
    },
  ],
}
