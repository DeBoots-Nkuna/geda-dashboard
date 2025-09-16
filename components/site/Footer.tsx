import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/80">
          © {new Date().getFullYear()} GedA Dashboard
        </p>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/" className="text-white/80 hover:text-white transition">
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
      </div>
    </footer>
  )
}
