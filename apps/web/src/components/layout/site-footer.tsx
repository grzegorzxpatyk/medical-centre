import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'

import { Container } from '@/components/container'
import { FacebookIcon, InstagramIcon } from '@/components/icons/social'
import { Logo } from '@/components/layout/logo'
import { Separator } from '@/components/ui/separator'
import type { NavLink, SiteData } from '@/lib/site-data'

function FooterColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h2 className="font-heading text-xs font-bold tracking-[0.12em] uppercase">{title}</h2>
      <ul className="mt-5 space-y-2.5 text-sm text-background/75">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition-colors hover:text-background">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteFooter({ data }: { data: SiteData }) {
  const { social } = data

  const socialLinks = [
    { href: social.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: social.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: social.maps, label: 'Mapa dojazdu', Icon: MapPin },
  ].filter((link): link is typeof link & { href: string } => Boolean(link.href))

  return (
    <footer className="bg-foreground text-background">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Logo name={data.name} tagline={data.tagline} variant="dark" />
            <p className="mt-6 max-w-xs text-sm text-background/75">{data.description}</p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-background/75 transition-colors hover:text-background"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Szybkie linki" links={data.mainNav} />
          <FooterColumn title="Dla pacjenta" links={data.patientNav} />

          <div>
            <h2 className="font-heading text-xs font-bold tracking-[0.12em] uppercase">Kontakt</h2>
            <ul className="mt-5 space-y-3.5 text-sm text-background/75">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {data.address}
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0" />
                <a
                  href={`mailto:${data.email}`}
                  className="transition-colors hover:text-background"
                >
                  {data.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0" />
                <a href={data.phoneHref} className="transition-colors hover:text-background">
                  {data.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0" />
                {data.openingHours}
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mt-12 bg-background/15" />

        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-xs text-background/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {data.name}. Wszelkie prawa zastrzeżone.
          </p>
          <Link href="/polityka-prywatnosci" className="transition-colors hover:text-background">
            Polityka prywatności
          </Link>
        </div>
      </Container>
    </footer>
  )
}
