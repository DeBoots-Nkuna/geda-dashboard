'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

type NavItem = { href: string; label: string; cta?: boolean }
const NAV: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/resources', label: 'Data Center' },
  { href: '/about', label: 'About' },
  { href: '/upload', label: 'Upload Data', cta: true },
]

export default function NavBar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const linkBase = isHome
    ? 'text-white/80 hover:text-white'
    : 'text-slate-600 hover:text-slate-900'
  const activeLink = isHome ? 'text-white' : 'text-slate-900 font-medium'

  return (
    // FULL-WIDTH header background; no rounded, no inner ring
    <header
      className={[
        'fixed inset-x-0 top-0 z-20 backdrop-blur-md',
        isHome
          ? 'bg-black/40 text-white'
          : 'bg-white/95 text-slate-900 ring-1 ring-black/10 supports-[backdrop-filter]:bg-white/80',
      ].join(' ')}
    >
      {/* Contained content width only */}
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src="/images/geda-logo.png"
            alt="GedA Logo"
            width={80}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) =>
            item.cta ? (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl bg-customTealWhite px-3 py-1.5 text-white hover:bg-customNavyTeal transition"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`${linkBase} transition ${
                  pathname?.startsWith(item.href) ? activeLink : ''
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className={[
            'md:hidden inline-flex h-8 w-8 items-center justify-center rounded-md transition',
            isHome
              ? 'text-white hover:bg-white/10'
              : 'text-slate-800 hover:bg-black/5',
          ].join(' ')}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-10 bg-black/40 md:hidden"
        />
      )}

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        className={[
          'md:hidden fixed inset-x-0 top-14 z-20 origin-top transition-all duration-200',
          isHome
            ? 'bg-black/90 text-white'
            : 'bg-white text-slate-900 ring-1 ring-black/10',
          open
            ? 'opacity-100 scale-y-100'
            : 'pointer-events-none opacity-0 scale-y-95',
        ].join(' ')}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          {NAV.map((item) =>
            item.cta ? (
              <Link
                key={item.href}
                href={item.href}
                className="mt-1 rounded-xl bg-customTealWhite px-3 py-2 text-center text-white hover:bg-customNavyTeal transition"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'rounded-lg px-3 py-2 text-base transition',
                  pathname?.startsWith(item.href)
                    ? isHome
                      ? 'bg-white/10 text-white'
                      : 'bg-black/5 text-slate-900'
                    : isHome
                    ? 'text-white/85 hover:bg-white/10 hover:text-white'
                    : 'text-slate-700 hover:bg-black/5',
                ].join(' ')}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
