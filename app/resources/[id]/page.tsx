import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '' // same-origin by default

async function getIndicator(id: string) {
  const res = await fetch(`${API_BASE}/api/indicators/${id}`, {
    cache: 'no-store',
  })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch indicator.')
  // optional tiny delay for nicer skeleton transitions
  // await new Promise(r => setTimeout(r, 600))
  return res.json()
}

export default async function IndicatorDetailedPage({
  params,
}: {
  params: { indicatorId: string }
}) {
  const indicator = await getIndicator(params.indicatorId)
  if (!indicator) notFound()

  const tags = coerceArray(indicator.thematicAreas)
  const footprint = coerceArray(indicator.indicatorFootprint)

  return (
    <main className="mx-auto max-w-6xl px-4 pt-8 pb-16">
      {/* breadcrumb + back */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <nav className="text-sm text-slate-500">
          <Link href="/resources" className="hover:text-slate-700">
            Data Center
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-700">Indicator</span>
        </nav>
        <Link
          href="/resources"
          className="rounded-lg border px-3 py-1.5 text-sm text-slate-700 hover:bg-black/5"
        >
          ← Back
        </Link>
      </div>

      {/* title + tags */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {indicator.indicatorShortName ?? indicator.shortName}
        </h1>
        {tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-customNavyTeal/30 bg-white px-3 py-1 text-xs font-medium text-customNavyTeal"
              >
                {humanize(t)}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      {/* main content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* left: image + description + footprint */}
        <article className="rounded-2xl border bg-white p-4 shadow-soft">
          <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={indicator.indicatorImage || '/images/placeholder.jpg'}
              alt=""
              fill
              sizes="(max-width:768px) 100vw, 66vw"
              className="object-cover"
              priority
            />
          </div>

          {indicator.indicatorDescription ? (
            <p className="text-slate-700">{indicator.indicatorDescription}</p>
          ) : null}

          {footprint?.length ? (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Indicator Footprint
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {footprint.map((v) => (
                  <span
                    key={v}
                    className="rounded-full bg-customTextNavy/30 px-2 py-1 text-xs"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </article>

        {/* right: organization + quick facts */}
        <aside className="space-y-4">
          <section className="rounded-2xl border bg-white p-4 shadow-soft">
            <h3 className="text-sm font-semibold text-slate-900">
              Organization
            </h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Full Name" value={indicator.organisationFullName} />
              <Row
                label="Contact Name"
                value={indicator.organisationContactName}
              />
              <Row label="Email" value={indicator.organisationContactEmail} />
              <Row
                label="Website"
                value={
                  indicator.organisationWebsite ? (
                    <a
                      href={indicator.organisationWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-customNavyTeal underline decoration-transparent hover:decoration-current"
                    >
                      {indicator.organisationWebsite}
                    </a>
                  ) : (
                    '—'
                  )
                }
              />
            </dl>
          </section>

          <section className="rounded-2xl border bg-white p-4 shadow-soft">
            <h3 className="text-sm font-semibold text-slate-900">Details</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row
                label="Start Year"
                value={indicator.indicatorYearStart ?? '—'}
              />
            </dl>
          </section>
        </aside>
      </div>

      {/* methodology & communication */}
      {(indicator.methodology || indicator.communicationDetails) && (
        <section className="mt-6 rounded-2xl border bg-white p-4 shadow-soft">
          <h3 className="text-sm font-semibold text-slate-900">
            Methodology & Communication
          </h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <p className="text-sm leading-6 text-slate-700">
              <span className="font-medium text-slate-900">Methodology:</span>{' '}
              {indicator.methodology || '—'}
            </p>
            <p className="text-sm leading-6 text-slate-700">
              <span className="font-medium text-slate-900">Communication:</span>{' '}
              {indicator.communicationDetails || '—'}
            </p>
          </div>
        </section>
      )}

      {/* actions */}
      <ActionsRow id={indicator.id} />
    </main>
  )
}

/* ---------- helpers & small presentational bits ---------- */

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="grow text-right text-slate-900">{value || '—'}</dd>
    </div>
  )
}

function humanize(v: string) {
  return v
    ?.toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

function coerceArray(value: unknown): string[] | undefined {
  try {
    const v = typeof value === 'string' ? JSON.parse(value) : value
    return Array.isArray(v) ? v : undefined
  } catch {
    return undefined
  }
}

/* Actions row includes Edit (to login) + Delete (confirm) */
function ActionsRow({ id }: { id: string }) {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      <Link
        href={`/admin/login?next=/resources/${id}/edit`}
        className="rounded-xl bg-customTealWhite px-4 py-2 text-white transition hover:bg-customNavyTeal"
      >
        Edit Indicator
      </Link>
      {/* client-side delete button below */}
      <DeleteIndicator id={id} />
    </div>
  )
}

/* Delete button (client) */
function DeleteIndicator({ id }: { id: string }) {
  // This is inlined to keep the file self-contained; you can lift it out to a component file if you prefer.
  return <ClientDelete id={id} />
}
