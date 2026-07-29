import { getDoctors } from '@/lib/api'

export const dynamic = 'force-dynamic'

const CMS_PUBLIC_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'

export default async function DoctorsPage() {
  const doctors = await getDoctors()

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Our doctors</h1>
      {doctors.docs.length === 0 ? (
        <p className="text-slate-500">No doctors yet. Add some in the CMS admin panel.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {doctors.docs.map((doctor) => {
            const photo = typeof doctor.photo === 'object' ? doctor.photo : null
            return (
              <li key={doctor.id} className="rounded-lg border border-slate-200 bg-white p-4">
                {photo?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${CMS_PUBLIC_URL}${photo.url}`}
                    alt={photo.alt}
                    className="mb-3 h-32 w-32 rounded-full object-cover"
                  />
                )}
                <h2 className="font-semibold">{doctor.name}</h2>
                <p className="text-sm text-slate-600">{doctor.specialty}</p>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
