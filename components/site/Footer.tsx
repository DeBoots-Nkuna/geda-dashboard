import Link from 'next/link'
import { Linkedin, Twitter, Youtube, Globe } from 'lucide-react'

export default function Footer({
  variant = 'black',
}: {
  variant?: 'black' | 'teal'
}) {
  const bg = variant === 'teal' ? 'bg-customNavyTeal' : 'bg-black'
  return (
    <footer className={`${bg} text-white`}>
      {/* contained inner width ONLY; no outer margins so it sits at the edge */}
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/80">
            © {new Date().getFullYear()} GedA Dashboard
          </p>

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

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/60">
            Built with Next.js, Tailwind, shadcn/ui, Prisma & Neon.
          </p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
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
//helper component for social icons
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
                 bg-white/10 text-white/80 ring-1 ring-white/10
                 hover:bg-white/20 hover:text-white transition"
    >
      {children}
    </a>
  )
}
