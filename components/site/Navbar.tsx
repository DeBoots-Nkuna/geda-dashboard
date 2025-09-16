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
  const [open, setOpen] = useState(false)

  // Close on route change
  useEffect(() => setOpen(false), [pathname])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href)

  return (
    <header className="fixed inset-x-0 top-0 z-20">
      <div
        className="
          mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6
          rounded-b-2xl bg-black/40 backdrop-blur-md ring-1 ring-white/10
         py-8
        "
      >
        {/* Home Link*/}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-white"
        >
          <Image
            src="/images/geda-logo.png"
            alt="GEDA Logo"
            width={50}
            height={50}
            className="h-30 w-30 object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) =>
            item.cta ? (
              <Link
                key={item.href}
                href={item.href}
                className="
                  rounded-xl bg-customTealWhite px-3 py-1.5 text-white
                  hover:bg-customNavyTeal transition
                "
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`transition ${
                  isActive(item.href)
                    ? 'text-white'
                    : 'text-white/80 hover:text-white'
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
          className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-md
                     text-white hover:bg-white/10 transition"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay when menu is open */}
      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-10 bg-black/40 md:hidden"
        />
      )}

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        className={`
          md:hidden fixed inset-x-0 top-14 z-20 origin-top
          bg-black/90 backdrop-blur-md ring-1 ring-white/10
          transition-all duration-200
          ${
            open
              ? 'opacity-100 scale-y-100'
              : 'pointer-events-none opacity-0 scale-y-95'
          }
        `}
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
                className={`rounded-lg px-3 py-2 text-base transition ${
                  isActive(item.href)
                    ? 'bg-white/10 text-white'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
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
