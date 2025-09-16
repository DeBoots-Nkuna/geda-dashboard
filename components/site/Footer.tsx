// src/components/site-footer.tsx
import Link from 'next/link'
import { Linkedin, Twitter, Youtube, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/90 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Row 1: brand • main nav • social */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <p className="text-sm text-white/80">
            © {new Date().getFullYear()} GedA Dashboard
          </p>

          {/* Main footer nav */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition"
            >
              Home
            </Link>
            <Link
              href="/resources"
              className="text-white/80 hover:text-white transition"
            >
              Data Center
            </Link>
            <Link
              href="/about"
              className="text-white/80 hover:text-white transition"
            >
              About
            </Link>
            <Link
              href="/upload"
              className="text-white/80 hover:text-white transition"
            >
              Upload Data
            </Link>
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-2">
            <Social href="#" label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </Social>
            <Social href="#" label="X / Twitter">
              <Twitter className="h-4 w-4" />
            </Social>
            <Social href="#" label="YouTube">
              <Youtube className="h-4 w-4" />
            </Social>
            <Social href="#" label="Website">
              <Globe className="h-4 w-4" />
            </Social>
          </div>
        </div>

        {/* Row 2: legal */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/60">
            Built with Next.js, Tailwind, shadcn/ui, Prisma & Neon.
          </p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {/* Create these pages later */}
            <Link
              href="/terms"
              className="text-white/80 hover:text-white transition"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              className="text-white/80 hover:text-white transition"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

// helper for social links with accessible labels
function Social({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full
                 bg-white/5 ring-1 ring-white/10 text-white/80
                 hover:bg-white/10 hover:text-white transition"
    >
      {children}
    </a>
  )
}
