import type { CollectionConfig } from 'payload'

/**
 * Values must stay in sync with the lucide icon map in
 * apps/web/src/components/service-icon.tsx
 */
const iconOptions = [
  { label: 'Stethoscope', value: 'stethoscope' },
  { label: 'Baby', value: 'baby' },
  { label: 'Heart pulse', value: 'heart-pulse' },
  { label: 'Person', value: 'user-round' },
  { label: 'Medical briefcase', value: 'briefcase-medical' },
  { label: 'Syringe', value: 'syringe' },
  { label: 'Brain', value: 'brain' },
  { label: 'Eye', value: 'eye' },
  { label: 'Bone', value: 'bone' },
  { label: 'Activity', value: 'activity' },
]

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'price'],
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      defaultValue: 'stethoscope',
      options: iconOptions,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short teaser shown on the poradnia card',
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Full description shown on the poradnia detail page',
      },
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
      name: 'price',
      type: 'number',
      min: 0,
      admin: {
        description: 'Price in PLN',
      },
    },
  ],
}
