// src/lib/word-parse.ts
export type Primitive = string | number | boolean | null | undefined
export type ParsedData = Record<string, string | string[]>

const CHECKED = '☒'

/** Extracts checked values from an HTML fragment produced by Mammoth */
export function parseCheckedList(cellHtml: string): string[] {
  const temp = document.createElement('div')
  temp.innerHTML = cellHtml
  const results: string[] = []
  const ps = temp.querySelectorAll('p')
  ps.forEach((p) => {
    const line = (p.textContent ?? '').trim()
    if (!line) return
    if (line.startsWith(CHECKED)) {
      let value = line.substring(1).trim()
      // Normalize "Other:" prefix
      if (value.toLowerCase().startsWith('other:')) {
        value = value.substring('other:'.length).trim()
      }
      results.push(value)
    }
  })
  return results
}

/** Safe innerText from an HTML fragment (keeps line breaks) */
export function extractPlainText(cellHtml: string): string {
  const temp = document.createElement('div')
  temp.innerHTML = cellHtml
  return temp.innerText.trim()
}

/** Field names in the table that are checkbox groups */
const CHECKBOX_FIELDS = new Set<string>([
  'Indicator Footprint',
  'Indicator thematic areas',
  'Indicator category',
  'Type of Data',
  'Groups supported with data',
  'Purpose of data',
  'Target audience',
  'Data replicability',
  'Pre-analysis',
  'Data type',
  'Data analysis',
  'Result Validation',
  'Frequency',
  'data communicated in the public space',
  'Public sharing consent',
  'Frequent information updates',
  'WebScrapping approval',
  'Dashboard usage',
])

/** Parse the first table in a Mammoth HTML string into a key/value object */
export function parseFirstTable(html: string): ParsedData {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const table = doc.querySelector('table')
  const data: ParsedData = {}

  if (!table) return data
  const rows = table.querySelectorAll('tr')

  rows.forEach((row) => {
    const cells = row.querySelectorAll('th')
    if (cells.length < 2) return

    const key = (cells[0].textContent ?? '').trim()
    const cellHtml = cells[1].innerHTML
    const cellText = (cells[1].textContent ?? '').trim()

    if (!key) return

    if (key === 'Communication Details') {
      // Collect text + optional image
      data[key] = extractPlainText(cellHtml)
      // If an image exists, store under a standard key
      const tmp = document.createElement('div')
      tmp.innerHTML = cellHtml
      const img = tmp.querySelector('img')
      if (img?.src) data['Indicator Image'] = img.src
      return
    }

    if (CHECKBOX_FIELDS.has(key)) {
      data[key] = parseCheckedList(cellHtml)
    } else {
      data[key] = cellText
    }
  })

  return data
}

/** Turn arrays into JSON strings for DB columns that expect text */
export function stringifyArrays(obj: ParsedData): Record<string, string> {
  const out: Record<string, string> = {}
  Object.keys(obj).forEach((k) => {
    const v = obj[k]
    out[k] = Array.isArray(v) ? JSON.stringify(v) : String(v ?? '')
  })
  return out
}
