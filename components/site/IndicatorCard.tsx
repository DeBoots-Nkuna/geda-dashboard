import Image from 'next/image'
import Link from 'next/link'

type IndicatorCardProps = {
  id: string
  title: string
  description?: string | null
  thematicAreas?: string[]
  imageUrl?: string | null // <- from Prisma (can be base64 or http)
}

export function IndicatorCard({
  id,
  title,
  description,
  thematicAreas = [],
  imageUrl,
}: IndicatorCardProps) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-soft">
      {/* Banner */}
      <div className="relative mb-3 overflow-hidden rounded-xl border bg-slate-100 aspect-[16/9]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority={false}
            unoptimized // allow base64 data URLs
          />
        ) : (
          <Image
            src="/images/default-image.png"
            alt={title}
            fill
            className="object-cover"
            priority={false}
            unoptimized // allow base64 data URLs
          />
        )}
      </div>

      {/* Title + blurb */}
      <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
        {title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
        {clean(description) || '—'}
      </p>

      {/* Chips */}
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

      {/* Read more link */}
      <Link
        href={`/resources/${id}`}
        className="mt-3 inline-block text-teal-700 font-medium hover:underline"
      >
        Read more
      </Link>
    </article>
  )
}

function humanize(v: string) {
  return v
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

/** In case bad inline-style strings leaked into text */
function clean(s?: string | null) {
  if (!s) return ''
  return s
    .replace(/style=\{\{[^}]+\}\}/g, '')
    .replace(/style="[^"]*"/g, '')
    .trim()
}
