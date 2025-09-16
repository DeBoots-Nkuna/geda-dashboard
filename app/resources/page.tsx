import { prisma } from '@/lib/prisma'
import type { Indicator } from '@/lib/generated/prisma'
import { ThematicArea } from '@/lib/generated/prisma'
import FiltersBar from '@/components/site/DataFilter'
import { IndicatorCard } from '@/components/site/IndicatorCard'
import { humanize } from '@/lib/characterFormater'
export const metadata = {
  title: 'Data Center — GedA Dashboard',
}

export default async function ResourcesPage({
  searchParams,
}: {
  // 👇 async params in Next 15
  searchParams: Promise<{ q?: string; topic?: string }>
}) {
  const sp = await searchParams
  const q = (sp?.q ?? '').trim()
  const topic = (sp?.topic ?? '').toUpperCase()

  const items = await prisma.indicator.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { indicatorShortName: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
        topic && topic !== 'ALL'
          ? { thematicAreas: { has: topic as ThematicArea } }
          : {},
      ],
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-customNavyTeal">
          Data Center
        </h1>
        <p className="mt-1 text-slate-600">
          {items.length} result{items.length === 1 ? '' : 's'}
          {q ? ` • search: “${q}”` : ''}
          {topic && topic !== 'ALL' ? ` • topic: ${humanize(topic)}` : ''}
        </p>
      </header>

      <FiltersBar />

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((indicator) => (
            <IndicatorCard
              key={indicator.id}
              id={indicator.id}
              title={indicator.indicatorShortName}
              description={indicator.description}
              thematicAreas={indicator.thematicAreas as unknown as string[]}
            />
          ))}
        </section>
      )}
    </div>
  )
}

// Empty state when no indicators match the filters

function EmptyState() {
  return (
    <div className="mt-10 rounded-2xl border bg-white p-8 text-center shadow-soft">
      <h3 className="text-lg font-semibold text-slate-900">
        No indicator data
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Nothing matched your filters. Try “Display All” or{' '}
        <a
          href="/upload"
          className="text-customNavyTeal underline decoration-transparent hover:decoration-current"
        >
          upload a template
        </a>
        .
      </p>
      <div className="mt-4">
        <a
          href="/resources"
          className="inline-flex items-center justify-center rounded-xl bg-customTealWhite px-4 py-2 text-white transition hover:bg-customNavyTeal"
        >
          Display All
        </a>
      </div>
    </div>
  )
}
