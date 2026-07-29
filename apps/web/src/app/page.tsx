import { getServices } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const services = await getServices()

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Our services</h1>
      {services.docs.length === 0 ? (
        <p className="text-slate-500">
          No services yet. Add some in the{' '}
          <a
            href={`${process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001'}/admin`}
            className="text-sky-700 underline"
          >
            CMS admin panel
          </a>
          .
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {services.docs.map((service) => (
            <li key={service.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="font-semibold">{service.title}</h2>
              {service.description && (
                <p className="mt-1 text-sm text-slate-600">{service.description}</p>
              )}
              {service.price != null && (
                <p className="mt-2 text-sm font-medium text-sky-700">{service.price} PLN</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
