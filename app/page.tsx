import Link from 'next/link'
import NavBar from '@/components/site/Navbar'
import BgVideo from '@/components/site/BgVideo'

export default function HomePage() {
  return (
    <main className="relative h-dvh overflow-hidden bg-black">
      {/* Background video */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BgVideo rate={0.5} webm="/videos/hero-bg.webm" />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      {/* Foreground */}
      <div className="relative z-10">
        <NavBar />

        <section className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 pt-16 text-center mt-20">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
            <span className="bg-gradient-to-r from-customTealWhite to-customNavyTeal bg-clip-text text-transparent">
              Lorem Ipsum{' '}
            </span>
            dolor sit amet, consectetur
            <br />
            consectetur adipiscing elit, sed do eiusmod
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-slate-200">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/resources"
              className="rounded-xl bg-customTealWhite px-5 py-2.5 text-white hover:bg-customNavyTeal transition"
            >
              Explore Data Center
            </Link>
            <Link
              href="/upload"
              className="rounded-xl border border-white/40 bg-transparent px-5 py-2.5 text-white hover:bg-white/10 transition"
            >
              Upload Data
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
