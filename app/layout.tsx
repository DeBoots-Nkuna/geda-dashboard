import type { Metadata } from 'next'
import { Outfit, Lato } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/site/providers'

const outfit = Outfit({
  variable: '--font-heading',
  subsets: ['latin'],
})

const lato = Lato({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['100', '300', '400', '700'],
})

export const metadata: Metadata = {
  title: 'GEDA Dashboard',
  description: 'Gender + Environment Data Alliance',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${lato.variable} min-h-dvh bg-slate-100 text-slate-900 antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
