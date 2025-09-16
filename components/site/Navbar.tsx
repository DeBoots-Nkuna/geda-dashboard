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

// Simple NavLink that marks the current route as active
function NavLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
  // Active style: teal underline + stronger text
  const active =
    'text-white underline decoration-customLightTeal underline-offset-8'
  const base = 'text-white/90 hover:text-white transition'
  return (
    <Link
      href={href}
      className={`${base} ${isActive ? active : ''} ${className}`}
    >
      {children}
    </Link>
  )
}

export default function NavBar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  return (
    // NOTE: not fixed — it scrolls with the page
    <header className="relative z-20 w-full bg-customNavyTeal text-white shadow-sm">
      {/* contained row */}
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src="/images/geda-logo.png"
            alt="GedA Logo"
            width={160}
            height={40}
            priority
            style={{ width: 'auto', height: '40px' }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) =>
            item.cta ? (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl bg-customTealWhite px-3 py-1.5 text-white hover:bg-customNavyTeal/90 transition"
              >
                {item.label}
              </Link>
            ) : (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
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
          className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-md text-white/90 hover:bg-white/10 transition"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown (attached to header, not fixed) */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute inset-x-0 top-full z-20 bg-customNavyTeal/95 border-t border-white/10 ${
          open ? 'block' : 'hidden'
        }`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          {NAV.map((item) =>
            item.cta ? (
              <Link
                key={item.href}
                href={item.href}
                className="mt-1 rounded-xl bg-customTealWhite px-3 py-2 text-center text-white hover:bg-customNavyTeal/90 transition"
              >
                {item.label}
              </Link>
            ) : (
              <NavLink
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-base"
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
