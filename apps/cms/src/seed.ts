import type { Poradnia } from '@medical-centre/shared-types'
import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Loads the practice's own content into a database.
 *
 * Run with `pnpm --filter @medical-centre/cms seed`.
 *
 * Two modes, because this runs on every production deploy:
 *
 * - default — *bootstrap*. Anything already present is left alone, so
 *   redeploying never reverts what an editor changed in the admin panel.
 * - `SEED_FORCE=1` — *sync*. Re-asserts every value below, and deletes any
 *   poradnia or person not listed here. This is what clears out demo content.
 *
 * `SEED_FORCE` is an env var rather than a CLI flag because `payload run`
 * rebuilds process.argv from positional arguments only, so flags never
 * reach this script.
 *
 * `news`, `pages` and `media` are editor territory and are never touched.
 */

type RichText = NonNullable<Poradnia['content']>

/** Minimal Lexical document — paragraphs are all this seed needs to write. */
const richText = (...paragraphs: string[]): RichText => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      textFormat: 0,
      children: [
        {
          type: 'text',
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text,
          version: 1,
        },
      ],
    })),
  },
})

const REGISTRATION_NOTE =
  'Rejestracja odbywa się wyłącznie telefonicznie pod numerem 12 285 01 12, od poniedziałku do piątku w godzinach 8:00 - 18:00.'

const daneOgolne = {
  name: 'Gabinet Lekarza Rodzinnego Zielonki',
  legalName: 'NZOZ Gabinet Lekarza Rodzinnego Zielonki Sp. z o.o.',
  tagline: 'Podstawowa opieka zdrowotna',
  description:
    'Zapewniamy opiekę lekarza rodzinnego, pediatry i radiologa oraz opiekę pielęgniarki środowiskowej mieszkańcom Zielonek i okolic.',
  openingHours: 'Pon - Pt: 8:00 - 18:00',
  phone: '12 285 01 12',
  address: 'ul. Galicyjska 15, 32-087 Zielonki',
  mainNav: [
    { label: 'Strona główna', href: '/' },
    { label: 'O nas', href: '/o-nas' },
    { label: 'Poradnie', href: '/poradnie' },
    { label: 'Personel', href: '/lekarze' },
    { label: 'Aktualności', href: '/aktualnosci' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
  topBarNav: [
    { label: 'Deklaracja POZ', href: '/deklaracja-poz' },
    { label: 'Wyniki badań', href: '/wyniki-badan' },
  ],
  patientNav: [
    { label: 'Deklaracja POZ', href: '/deklaracja-poz' },
    { label: 'Wyniki badań', href: '/wyniki-badan' },
    { label: 'Dokumenty do pobrania', href: '/dokumenty' },
    { label: 'FAQ', href: '/faq' },
  ],
}

const poradnie = [
  {
    title: 'Podstawowa opieka zdrowotna',
    slug: 'podstawowa-opieka-zdrowotna',
    icon: 'stethoscope',
    order: 1,
    description: 'Opieka lekarza rodzinnego dla dzieci i dorosłych zapisanych do naszej przychodni.',
    content: richText(
      'Lekarze rodzinni przyjmują pacjentów w każdym wieku — od diagnostyki i leczenia chorób ostrych i przewlekłych, przez badania profilaktyczne, po skierowania na badania i do poradni specjalistycznych.',
      'Aby korzystać z bezpłatnych świadczeń w ramach NFZ, należy złożyć u nas deklarację wyboru lekarza POZ.',
      REGISTRATION_NOTE,
    ),
  },
  {
    title: 'Pediatria',
    slug: 'pediatria',
    icon: 'baby',
    order: 2,
    description: 'Opieka nad dziećmi od pierwszych dni życia, prowadzona przez lekarza pediatrę.',
    content: richText(
      'Poradnia pediatryczna obejmuje opieką dzieci od pierwszych dni życia: wizyty chorobowe, bilanse zdrowia oraz szczepienia ochronne zgodne z kalendarzem szczepień.',
      REGISTRATION_NOTE,
    ),
  },
  {
    title: 'Radiologia',
    slug: 'radiologia',
    icon: 'bone',
    order: 3,
    description: 'Diagnostyka obrazowa prowadzona przez lekarza radiologa.',
    content: richText(
      'Badania obrazowe wykonujemy na podstawie skierowania od lekarza. Opis badania przygotowuje lekarz radiolog, a wynik omówisz podczas wizyty u swojego lekarza rodzinnego.',
      REGISTRATION_NOTE,
    ),
  },
  {
    title: 'Pielęgniarka środowiskowa',
    slug: 'pielegniarka-srodowiskowa',
    icon: 'syringe',
    order: 4,
    description: 'Opieka i zabiegi pielęgniarskie w przychodni oraz w domu pacjenta.',
    content: richText(
      'Pielęgniarka środowiskowa wykonuje zabiegi zlecone przez lekarza, opatrunki, iniekcje i pomiary, a pacjentom, którzy nie mogą dotrzeć do przychodni, zapewnia opiekę w domu.',
      'Opieką obejmujemy pacjentów, którzy złożyli u nas deklarację wyboru pielęgniarki POZ.',
      REGISTRATION_NOTE,
    ),
  },
] as const

/** In the order the practice listed them */
const personel = [
  { name: 'Katarzyna Marchaj', specialty: 'Prezes Zarządu, specjalista medycyny rodzinnej' },
  { name: 'Tomasz Sobalski', specialty: 'Specjalista medycyny rodzinnej' },
  { name: 'Monika Kumiega', specialty: 'Lekarz rezydent' },
  { name: 'Magdalena Czerwik', specialty: 'Pediatra' },
  { name: 'Monika Niziniecka-Zając', specialty: 'Pielęgniarka, położna' },
  { name: 'Elżbieta Piórkowska', specialty: 'Pielęgniarka środowiskowa' },
  { name: 'Edyta Misiek', specialty: 'Pielęgniarka' },
  { name: 'Marzena Gut', specialty: 'Rejestratorka' },
  { name: 'Wojciech Partyka', specialty: 'Wsparcie techniczne, członek zarządu' },
]

const force = process.env.SEED_FORCE === '1' || process.env.SEED_FORCE === 'true'

const payload = await getPayload({ config })

payload.logger.info(force ? 'Tryb: SEED_FORCE (nadpisuję i usuwam nadmiarowe)' : 'Tryb: bootstrap (pomijam to, co już istnieje)')

// An unsaved global still resolves, from the field defaults, but carries no id
const savedGlobal = (await payload.findGlobal({ slug: 'dane-ogolne' })) as { id?: number }

if (force || !savedGlobal.id) {
  await payload.updateGlobal({ slug: 'dane-ogolne', data: daneOgolne })
  payload.logger.info('Zapisano dane ogólne')
} else {
  payload.logger.info('Dane ogólne już zapisane — pomijam')
}

const { totalDocs: poradnieCount } = await payload.count({ collection: 'poradnie' })

if (force || poradnieCount === 0) {
  for (const [index, poradnia] of poradnie.entries()) {
    const existing = await payload.find({
      collection: 'poradnie',
      where: { slug: { equals: poradnia.slug } },
      limit: 1,
    })

    // Spread strips the `as const` readonly modifiers Payload's data type rejects
    const data = { ...poradnia, content: poradnia.content }

    if (existing.docs[0]) {
      await payload.update({ collection: 'poradnie', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'poradnie', data })
    }
    payload.logger.info(`Poradnia ${index + 1}/${poradnie.length}: ${poradnia.title}`)
  }
} else {
  payload.logger.info(`Poradnie już uzupełnione (${poradnieCount}) — pomijam`)
}

const { totalDocs: personelCount } = await payload.count({ collection: 'doctors' })

if (force || personelCount === 0) {
  for (const [index, osoba] of personel.entries()) {
    const existing = await payload.find({
      collection: 'doctors',
      where: { name: { equals: osoba.name } },
      limit: 1,
    })

    const data = { ...osoba, order: index + 1 }

    if (existing.docs[0]) {
      await payload.update({ collection: 'doctors', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'doctors', data })
    }
    payload.logger.info(`Personel ${index + 1}/${personel.length}: ${osoba.name}`)
  }
} else {
  payload.logger.info(`Personel już uzupełniony (${personelCount}) — pomijam`)
}

// Pruning is destructive, so it stays behind the explicit flag
if (force) {
  const removedPoradnie = await payload.delete({
    collection: 'poradnie',
    where: { slug: { not_in: poradnie.map((p) => p.slug) } },
  })
  const removedPersonel = await payload.delete({
    collection: 'doctors',
    where: { name: { not_in: personel.map((p) => p.name) } },
  })

  for (const doc of removedPoradnie.docs) payload.logger.info(`Usunięto poradnię: ${doc.title}`)
  for (const doc of removedPersonel.docs) payload.logger.info(`Usunięto osobę: ${doc.name}`)
}

payload.logger.info('Seed zakończony')
process.exit(0)
