import type { Metadata } from 'next'
import { Outfit, Lato } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/site/providers'
import Footer from '@/components/site/Footer'
import NavBar from '@/components/site/Navbar'

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
        className={`${outfit.variable} ${lato.variable} min-h-screen bg-black/30 text-slate-900`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
