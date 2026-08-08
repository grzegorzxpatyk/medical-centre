'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clock, Menu, Phone } from 'lucide-react'

import { Container } from '@/components/container'
import { FacebookIcon } from '@/components/icons/social'
import { Logo } from '@/components/layout/logo'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { SiteData } from '@/lib/site-data'
import { cn } from '@/lib/utils'
import { LinkButton } from '../ui/link-button'

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function SiteHeader({ data }: { data: SiteData }) {
  const pathname = usePathname()
  const { mainNav, topBarNav, social } = data

  return (
    <header>
      <div className="bg-primary text-primary-foreground">
        <Container className="flex h-10 items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Clock className="size-3.5 opacity-80" />
              {data.openingHours}
            </span>
            <a href={data.phoneHref} className="hidden items-center gap-2 sm:flex">
              <Phone className="size-3.5 opacity-80" />
              Rejestracja: {data.phone}
            </a>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {topBarNav.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <FacebookIcon className="size-3.5" />
              </a>
            )}
          </div>
        </Container>
      </div>

      <div className="border-b bg-card">
        <Container className="flex h-20 items-center justify-between gap-6">
          <Logo name={data.name} tagline={data.tagline} />

          <nav className="hidden h-full items-center gap-7 lg:flex">
            {mainNav.map((link) => {
              const active = isActive(pathname, link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex h-full items-center text-xs font-semibold tracking-wide uppercase transition-colors',
                    active ? 'text-primary' : 'text-foreground hover:text-primary',
                    // sits flush on the header's bottom border
                    active &&
                    'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LinkButton
              size="lg"
              href="/umow-wizyte"
            >
              Umów wizytę
            </LinkButton>

            <Sheet>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" className="lg:hidden" />}
                aria-label="Otwórz menu"
              >
                <Menu />
              </SheetTrigger>
              <SheetContent side="right" className="w-4/5">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <Logo name={data.name} tagline={data.tagline} asLink={false} />
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-6 pb-6">
                  {[...mainNav, ...topBarNav].map((link) => (
                    <SheetClose
                      key={link.href}
                      render={
                        <Link
                          href={link.href}
                          className={cn(
                            'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent',
                            isActive(pathname, link.href) && 'text-primary',
                          )}
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  ))}
                  <SheetClose
                    render={
                      <Link
                        href="/umow-wizyte"
                        className={cn(
                          buttonVariants({ size: 'lg' }),
                          'mt-4 text-xs font-semibold tracking-wide uppercase',
                        )}
                      />
                    }
                  >
                    Umów wizytę
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </div>
    </header>
  )
}
