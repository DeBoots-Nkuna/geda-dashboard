import Link from 'next/link'

export function IndicatorCard({
  id,
  title,
  description,
  thematicAreas = [],
}: {
  id: string
  title: string
  description?: string | null
  thematicAreas?: string[]
}) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-soft">
      <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
        {title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
        {description || '—'}
      </p>

      {thematicAreas.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {thematicAreas.map((t) => (
            <span
              key={t}
              className="rounded-full border border-customNavyTeal/30 bg-white px-2 py-0.5 text-xs text-customNavyTeal"
            >
              {humanize(t)}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link
          href={`/resources/${id}`}
          className="inline-flex items-center justify-center rounded-xl border border-customNavyTeal/30 bg-white px-3 py-1.5 text-sm text-customNavyTeal transition hover:bg-customTextNavy/20"
        >
          Open
        </Link>
      </div>
    </article>
  )
}

function humanize(v: string) {
  return v
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}
