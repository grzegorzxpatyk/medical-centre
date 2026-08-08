import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { getSiteData } from '@/lib/site-data'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  fallback: ['system-ui', 'sans-serif'],
})

export async function generateMetadata(): Promise<Metadata> {
  const { name, tagline, description } = await getSiteData()

  return {
    title: {
      default: `${name} — ${tagline}`,
      template: `%s | ${name}`,
    },
    description,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteData = await getSiteData()

  return (
    <html lang="pl" className={cn('font-sans', inter.variable)}>
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader data={siteData} />
        <main className="flex-1">{children}</main>
        <SiteFooter data={siteData} />
      </body>
    </html>
  )
}
