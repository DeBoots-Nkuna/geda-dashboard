'use client'

import React from 'react'
import mammoth from 'mammoth'
import { parseFirstTable, stringifyArrays, ParsedData } from '@/lib/word-parse'
import { toast } from 'sonner'

export default function UploadPage() {
  const [parsed, setParsed] = React.useState<ParsedData>({})
  const [busy, setBusy] = React.useState(false)

  const onFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.docx')) {
      toast.error('Please upload a .docx file')
      return
    }

    setBusy(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer })
      const data = parseFirstTable(html)
      setParsed(data)
      toast.success('Document parsed')
    } catch (err) {
      console.error(err)
      toast.error('Failed to parse document')
    } finally {
      setBusy(false)
      e.currentTarget.value = ''
    }
  }

  const onSubmit = async () => {
    try {
      setBusy(true)
      const payload = stringifyArrays(parsed)
      const res = await fetch('/api/indicators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.message || 'Failed to save')
      }
      toast.success('Saved to database')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6 rounded-2xl bg-white/90 ring-1 ring-black/5">
      <h1 className="text-2xl font-semibold text-slate-900 text-center mb-1">
        Upload & Parse Indicator Document
      </h1>
      <p className="text-center text-sm text-slate-600 mb-6">
        Upload a <code>.docx</code> file generated from the template.
      </p>

      <div className="flex flex-col gap-4">
        <div>
          <a className="underline text-teal-700" href="/template.docx" download>
            Download template.docx
          </a>
        </div>

        <input
          type="file"
          accept=".docx"
          onChange={onFile}
          disabled={busy}
          className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:font-medium file:bg-teal-600 file:text-white hover:file:bg-teal-700"
        />

        <div className="flex gap-3">
          <button
            onClick={onSubmit}
            disabled={busy || !Object.keys(parsed).length}
            className="rounded-lg px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {busy ? 'Working…' : 'Submit Parsed Data'}
          </button>
          <button
            onClick={() => setParsed({})}
            disabled={busy || !Object.keys(parsed).length}
            className="rounded-lg px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Parsed Data</h2>
          <div className="overflow-auto p-3 border border-slate-200 rounded bg-slate-50">
            <pre className="text-xs">{JSON.stringify(parsed, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
