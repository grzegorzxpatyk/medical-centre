import type { Metadata } from 'next'
import Link from 'next/link'

import './globals.css'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Medical Centre',
  description: 'Medical Centre — services and doctors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-4">
            <Link href="/" className="text-lg font-semibold text-sky-700">
              Medical Centre
            </Link>
            <Link href="/" className="text-sm hover:text-sky-700">
              Services
            </Link>
            <Link href="/doctors" className="text-sm hover:text-sky-700">
              Doctors
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
