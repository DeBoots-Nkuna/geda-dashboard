'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Search, Filter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { humanize } from '@/lib/characterFormater'

const THEMES = [
  'ALL',
  'AGRICULTURE',
  'BIODIVERSITY',
  'CLIMATE_CHANGE',
  'ENERGY',
  'FISHERIES',
  'FORESTRY',
  'LAND',
  'NUTRITION',
  'OCEANS',
  'WATER',
  'OTHER',
] as const
type ThemeKey = (typeof THEMES)[number]

export default function FiltersBar() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const [q, setQ] = useState(sp.get('q') ?? '')
  const active: ThemeKey = (sp.get('topic')?.toUpperCase() as ThemeKey) || 'ALL'

  const setParam = (key: string, value?: string | null) => {
    const params = new URLSearchParams(sp.toString())
    if (!value) params.delete(key)
    else params.set(key, value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setParam('q', q ? q : null)
  }

  const buttons = useMemo(
    () =>
      THEMES.map((t) => ({
        key: t,
        label: humanize(t),
      })),
    []
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Search + dropdown */}
      <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
        <div className="relative w-full max-w-xl">
          <input
            className="w-full rounded-xl border px-10 py-2 outline-none ring-0"
            placeholder="Search indicators…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>

        {/* Dropdown for filters (same values as buttons) */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center rounded-xl border px-3 py-2 text-sm hover:bg-black/5">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {buttons.map((b) => (
              <DropdownMenuItem
                key={b.key}
                onClick={() =>
                  setParam('topic', b.key === 'ALL' ? null : b.key)
                }
                className={
                  active === b.key ? 'font-semibold text-customNavyTeal' : ''
                }
              >
                {b.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </form>

      {/* Pill buttons (scrollable on mobile) */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {buttons.map((b) => (
          <button
            key={b.key}
            onClick={() => setParam('topic', b.key === 'ALL' ? null : b.key)}
            className={[
              'whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition border',
              active === b.key
                ? 'bg-customTealWhite text-white border-transparent'
                : 'bg-white text-slate-700 hover:bg-black/5 border-slate-200',
            ].join(' ')}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  )
}
