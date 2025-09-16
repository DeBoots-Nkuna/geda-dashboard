import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ClientDelete from '@/components/site/DeleteIndicator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { prisma } from '@/lib/prisma'

//fetching indicator data
async function getIndicator(id: string) {
  try {
    const indicator = await prisma.indicator.findUnique({
      where: { id },
      include: {
        organization: true, // Include organization data
      },
    })
    return indicator
  } catch (error) {
    console.error('Error fetching indicator:', error)
    throw new Error('Failed to fetch indicator.')
  }
}

/* -------- page -------- */

export default async function IndicatorDetailedPage({
  params,
}: {
  params: Promise<{ id: string }> // 👈 your folder is [id]
}) {
  const { id } = await params // 👈 await the promise
  const indicator = await getIndicator(id)
  if (!indicator) notFound()

  const tags = asArray(indicator.thematicAreas)
  const footprint = asArray(indicator.footprints)

  const title = indicator.indicatorShortName ?? 'Indicator'
  const desc = indicator.description ?? ''
  const imgSrc: string =
    indicator.imageUrl || '/images/indicator-placeholder.png'
  const unoptimized = /^data:/i.test(imgSrc)
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
          {title}
        </h1>
        {tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((t: string) => (
              <Badge
                key={t}
                variant="outline"
                className="border-customNavyTeal/30 text-customNavyTeal"
              >
                {humanize(t)}
              </Badge>
            ))}
          </div>
        ) : null}
      </header>

      {/* layout */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* left: media + description + footprint */}
        <Card className="overflow-hidden">
          <div className="relative aspect-[16/9] w-full bg-slate-100">
            <Image
              src={imgSrc}
              alt={title}
              fill
              sizes="(max-width:768px) 100vw, 66vw"
              className="object-cover"
              priority
              unoptimized={unoptimized}
            />
          </div>
          <CardContent className="p-4">
            {desc ? (
              <p className="text-slate-700 leading-6">{desc}</p>
            ) : (
              <p className="text-slate-500 italic">No description provided.</p>
            )}

            {footprint?.length ? (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-slate-900">
                  Indicator Footprint
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {footprint.map((v) => (
                    <span
                      key={v}
                      className="rounded-full bg-customTextNavy/20 px-2 py-1 text-xs text-slate-800"
                    >
                      {humanize(v)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* right: organization + quick facts */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Organization</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <InfoRow
                label="Full Name"
                value={indicator.organization?.name ?? '—'}
              />
              <InfoRow
                label="Contact Name"
                value={indicator.organization?.contactName ?? '—'}
              />
              <InfoRow
                label="Email"
                value={indicator.organization?.contactEmail ?? '—'}
              />
              <InfoRow
                label="Website"
                value={
                  indicator.organization?.website ? (
                    <a
                      href={indicator.organization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-customNavyTeal underline decoration-transparent hover:decoration-current"
                    >
                      {indicator.organization.website}
                    </a>
                  ) : (
                    '—'
                  )
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <InfoRow
                label="Start Year"
                value={indicator.yearStart?.toString() ?? '—'}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* methodology & communication */}
      {(indicator.methodology ||
        indicator.commChannels?.length ||
        indicator.commLink) && (
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              Methodology &amp; Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 mb-1">
                  Methodology
                </h4>
                <p className="text-sm leading-6 text-slate-700">
                  {indicator.methodology || '—'}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-500 mb-1">
                  Communication
                </h4>
                <div className="text-sm leading-6 text-slate-700">
                  {indicator.commChannels &&
                  indicator.commChannels.length > 0 ? (
                    <div className="mb-2">
                      <span className="font-medium">Channels: </span>
                      {indicator.commChannels.join(', ')}
                    </div>
                  ) : null}
                  {indicator.commLink ? (
                    <div>
                      <span className="font-medium">Link: </span>
                      <a
                        href={indicator.commLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-customNavyTeal underline decoration-transparent hover:decoration-current"
                      >
                        {indicator.commLink}
                      </a>
                    </div>
                  ) : null}
                  {!indicator.commChannels?.length &&
                    !indicator.commLink &&
                    '—'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* actions */}
      <Separator className="my-8" />
      <ActionsRow id={indicator.id} />
    </main>
  )
}

/* -------- presentational bits -------- */

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
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

/* -------- actions -------- */

function ActionsRow({ id }: { id: string }) {
  const next = encodeURIComponent(`/resources/${id}/edit`)
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={`/login?next=${next}`}
        className="rounded-xl bg-customTealWhite px-4 py-2 text-white transition hover:bg-customNavyTeal"
      >
        Edit Indicator
      </a>
      <ClientDelete id={id} />
    </div>
  )
}

/* -------- helpers -------- */
function asArray(v: unknown): string[] | undefined {
  if (Array.isArray(v)) return v as string[]
  if (typeof v === 'string') {
    try {
      const p = JSON.parse(v)
      return Array.isArray(p) ? (p as string[]) : undefined
    } catch {}
  }
  return undefined
}
