import type { Metadata } from 'next'
import Image from 'next/image'

import { EmptyCmsHint } from '@/components/empty-cms-hint'
import { PageShell } from '@/components/page-shell'
import { RichText } from '@/components/rich-text'
import { Card, CardContent } from '@/components/ui/card'
import { getDoctors, mediaAlt, mediaUrl } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Personel',
  description: 'Poznaj zespół naszej przychodni — lekarzy, pielęgniarki i rejestrację.',
}

export default async function LekarzePage() {
  const { docs: doctors } = await getDoctors()

  return (
    <PageShell
      title="Nasz personel"
      lead="Lekarze, pielęgniarki i pracownicy, których spotkasz w naszej przychodni."
    >
      {doctors.length === 0 ? (
        <EmptyCmsHint>Nie dodano jeszcze żadnych osób.</EmptyCmsHint>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => {
            const photo = mediaUrl(doctor.photo)
            return (
              <li key={doctor.id}>
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col items-center gap-4 text-center">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={mediaAlt(doctor.photo, doctor.name)}
                        width={256}
                        height={256}
                        sizes="128px"
                        className="size-32 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-32 rounded-full bg-secondary" />
                    )}

                    <div>
                      <h2 className="font-heading text-sm font-bold text-foreground">
                        {doctor.name}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">{doctor.specialty}</p>
                    </div>

                    <RichText content={doctor.bio} className="text-xs" />
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </PageShell>
  )
}
