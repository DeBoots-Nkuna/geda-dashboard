'use client'

import { useState, useRef } from 'react'
import mammoth from 'mammoth'
import { toast } from 'sonner'

import { parseFirstTable, ParsedData } from '@/lib/word-parse'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input' // only used as hidden input

export default function UploadPage() {
  const [parsed, setParsed] = useState<ParsedData>({})
  const [busy, setBusy] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)

  const openPicker = () => fileRef.current?.click()

  const onFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.docx')) {
      toast.error('Please upload a .docx file')
      return
    }

    setFileName(file.name)
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
      // allow re-selecting the same file; keep the label so the user sees the chosen name
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const onSubmit = async () => {
    try {
      setBusy(true)
      const res = await fetch('/api/indicators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
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

  const hasData = Object.keys(parsed).length > 0

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="bg-white/90 ring-1 ring-black/5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Upload &amp; Parse Indicator Document
          </CardTitle>
          <p className="text-sm text-slate-600">
            Upload a <code>.docx</code> file generated from the template.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <a
              className="underline text-teal-700"
              href="/template.docx"
              download
            >
              Download template.docx
            </a>
          </div>

          {/* File picker (button + hidden input) */}
          <div className="grid gap-2">
            <Label>Word document (.docx)</Label>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={openPicker}
                disabled={busy}
                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
              >
                Choose file
              </Button>

              <span className="text-sm text-slate-600 truncate max-w-[22rem]">
                {fileName ?? 'No file chosen'}
              </span>
            </div>

            {/* Hidden file input (triggered by button) */}
            <Input
              ref={fileRef}
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={onFile}
              className="sr-only"
              aria-hidden
              tabIndex={-1}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onSubmit}
              disabled={busy || !hasData}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
            >
              {busy ? 'Working…' : 'Submit Parsed Data'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setParsed({})
                setFileName(null)
              }}
              disabled={busy || !hasData}
              className="cursor-pointer"
            >
              Clear
            </Button>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Parsed Data</h2>
            <div className="overflow-auto p-3 border border-slate-200 rounded bg-slate-50">
              <pre className="text-xs">{JSON.stringify(parsed, null, 2)}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
