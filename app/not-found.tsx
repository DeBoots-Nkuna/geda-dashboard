import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto grid max-w-6xl place-items-center px-4 py-20">
      <section className="text-center">
        {/* SVG illustration */}
        <svg
          aria-hidden="true"
          className="mx-auto h-40 w-40"
          viewBox="0 0 256 256"
          fill="none"
        >
          <rect
            width="256"
            height="256"
            rx="24"
            fill="url(#g1)"
            opacity="0.15"
          />
          {/* 4 */}
          <path
            d="M88 176V144H60l44-64v32h28l-44 64z"
            fill="currentColor"
            className="text-customNavyTeal"
          />
          {/* 0 (lifebuoy style) */}
          <circle cx="128" cy="112" r="32" className="fill-white" />
          <circle
            cx="128"
            cy="112"
            r="30"
            className="stroke-customTealWhite"
            strokeWidth="8"
          />
          <path
            d="M128 82v-8M128 150v8M98 112h-8M166 112h8"
            stroke="currentColor"
            strokeWidth="6"
            className="text-customTealWhite"
          />
          {/* 4 */}
          <path
            d="M168 176V144h-28l44-64v32h28l-44 64z"
            fill="currentColor"
            className="text-customNavyTeal"
          />
          {/* Water line */}
          <path
            d="M24 196c24 12 56 12 80 0s56-12 80 0 56 12 80 0"
            stroke="currentColor"
            className="text-customTextNavy"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="256" y2="256">
              <stop offset="0" stopColor="#006170" />
              <stop offset="1" stopColor="#009e91" />
            </linearGradient>
          </defs>
        </svg>

        <h1 className="mt-6 text-3xl font-semibold text-slate-900">
          Page not found
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-600">
          We couldn’t find the page you were looking for. It might have been
          moved or deleted.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-customTealWhite px-4 py-2 text-white transition hover:bg-customNavyTeal"
          >
            Go Home
          </Link>
          <Link
            href="/resources"
            className="rounded-xl border border-customNavyTeal/30 bg-white px-4 py-2 text-customNavyTeal transition hover:bg-customTextNavy/20"
          >
            Explore Data Center
          </Link>
          <Link
            href="/upload"
            className="rounded-xl border border-customNavyTeal/30 bg-white px-4 py-2 text-customNavyTeal transition hover:bg-customTextNavy/20"
          >
            Upload Data
          </Link>
        </div>
      </section>
    </main>
  )
}
