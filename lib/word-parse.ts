export type ParsedData = Record<string, string | string[]>

const CHECKED_GLYPHS = [
  '☒',
  '☑',
  '✓',
  '✔',
  '■',
  '[x]',
  '[X]',
  'x',
  'X',
] as const

const CANON = {
  footprints: 'Indicator Footprint',
  thematicAreas: 'Indicator thematic areas',
  indicatorCategory: 'Indicator category',
  typeOfData: 'Type of Data',
  dataType: 'Data type',
  groupsSupported: 'Groups supported with data',
  purposeOfData: 'Purpose of data',
  targetAudience: 'Target audience',
  dataReplicability: 'Data replicability',
  preAnalysis: 'Pre-analysis',
  dataAnalysis: 'Data analysis',
  resultValidation: 'Result Validation',
  frequency: 'Frequency',
  commChannels: 'Data communicated in the public space',
  publicSharing: 'Public sharing consent',
  frequentUpdates: 'Frequent information updates',
  webScrap: 'WebScrapping approval',
  dashboardUsage: 'Dashboard usage',
  commDetails: 'Communication Details',
  indicatorImage: 'Indicator Image',

  shortName: 'Indicator Short Name',
  indicatorName: 'Indicator name',
  name: 'Name',
  description: 'Description',
  indicatorDescription: 'Indicator description',
  countries: 'Countries',
  linksToData: 'links to collected data',
  yearStart: 'indicator year start',
  methodology: 'Methodology',
  limitations: 'Limitations',
  // ---- Organization fields ----
  orgId: 'Organization ID',
  orgName: 'Organization Full Name',
  orgContactName: 'Organization contact name',
  orgContactEmail: 'Organization contact email',
  orgWebsite: 'Organization website',
} as const

const alias: Record<string, string> = {
  // Checkbox groups
  'indicator footprint': CANON.footprints,
  footprints: CANON.footprints,

  'indicator thematic areas': CANON.thematicAreas,
  'thematic areas': CANON.thematicAreas,

  'indicator category': CANON.indicatorCategory,
  category: CANON.indicatorCategory,

  'type of data': CANON.typeOfData,
  datatype: CANON.typeOfData,

  'data type': CANON.dataType,
  'nature of data': CANON.dataType,

  'groups supported with data': CANON.groupsSupported,

  'purpose of data': CANON.purposeOfData,

  'target audience': CANON.targetAudience,

  'data replicability': CANON.dataReplicability,

  'pre-analysis': CANON.preAnalysis,
  'pre analysis': CANON.preAnalysis,

  'data analysis': CANON.dataAnalysis,

  'result validation': CANON.resultValidation,
  'result validation ': CANON.resultValidation,

  frequency: CANON.frequency,

  'data communicated in the public space': CANON.commChannels,
  'communication channels': CANON.commChannels,

  'public sharing consent': CANON.publicSharing,

  'frequent information updates': CANON.frequentUpdates,

  'webscrapping approval': CANON.webScrap,
  'web scrapping approval': CANON.webScrap,

  'dashboard usage': CANON.dashboardUsage,

  'communication details': CANON.commDetails,
  'indicator image': CANON.indicatorImage,

  'indicator short name': CANON.shortName,
  'indicator name': CANON.indicatorName,
  name: CANON.name,

  description: CANON.description,
  'indicator description': CANON.indicatorDescription,

  countries: CANON.countries,
  'country/countries': CANON.countries,

  'links to data': CANON.linksToData,
  links: CANON.linksToData,
  'data links': CANON.linksToData,

  'year start': CANON.yearStart,
  'start year': CANON.yearStart,
  year: CANON.yearStart,

  methodology: CANON.methodology,
  limitations: CANON.limitations,
  // Organization (accept both Organisation/Organization)
  'organisation id': CANON.orgId,
  'organization id': CANON.orgId,

  'organisation full name': CANON.orgName,
  'organization full name': CANON.orgName,

  'organisation contact name': CANON.orgContactName,
  'organization contact name': CANON.orgContactName,

  'organisation contact email': CANON.orgContactEmail,
  'organization contact email': CANON.orgContactEmail,

  'organisation website': CANON.orgWebsite,
  'organization website': CANON.orgWebsite,
}

function canonLabel(s: string) {
  return s
    .toLowerCase()
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*:\s*$/, '')
    .trim()
}

function cleanText(s: string): string {
  return s
    .replace(/\u00A0/g, ' ')
    .replace(/style\s*=\s*"\s*[^"]*"/gi, '')
    .replace(/style\s*=\s*\{\{[^}]+\}\}/gi, '')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function parseCheckedList(cellHtml: string): string[] {
  const temp = document.createElement('div')
  temp.innerHTML = cellHtml
  const results: string[] = []

  const lines: string[] = []

  temp.querySelectorAll('p, li').forEach((el) => {
    const t = (el.textContent ?? '').trim()
    if (t) lines.push(t)
  })

  if (lines.length === 0) {
    const text = temp.textContent ?? ''
    text
      .split(/\n|<br\s*\/?>/gi)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => lines.push(s))
  }

  const checkedRe = new RegExp(
    `^(?:${CHECKED_GLYPHS.map((g) =>
      g.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    ).join('|')})\\s*`
  )

  lines.forEach((line) => {
    if (checkedRe.test(line)) {
      let value = line.replace(checkedRe, '').trim()
      // Normalize "Other:" / "Other -" / "Other –"
      value = value.replace(/^other\s*[:\-–]\s*/i, '').trim()
      if (value) results.push(value)
    }
  })
  return results
}

/** Safe innerText from an HTML fragment (keeps line breaks) */
export function extractPlainText(cellHtml: string): string {
  const temp = document.createElement('div')
  temp.innerHTML = cellHtml
  return cleanText(temp.innerText || temp.textContent || '')
}

/** Checkbox groups (use canonical keys) */
const CHECKBOX_FIELDS = new Set<string>([
  CANON.footprints,
  CANON.thematicAreas,
  CANON.indicatorCategory,
  CANON.typeOfData,
  CANON.groupsSupported,
  CANON.purposeOfData,
  CANON.targetAudience,
  CANON.dataReplicability,
  CANON.preAnalysis,
  CANON.dataType,
  CANON.dataAnalysis,
  CANON.resultValidation,
  CANON.frequency,
  CANON.commChannels,
  CANON.publicSharing,
  CANON.frequentUpdates,
  CANON.webScrap,
  CANON.dashboardUsage,
])

/** Parse the first table in a Mammoth HTML string into key/value pairs with normalized keys */
export function parseFirstTable(html: string): ParsedData {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const table = doc.querySelector('table')
  const data: ParsedData = {}

  if (!table) return data

  const rows = table.querySelectorAll('tr')

  rows.forEach((row) => {
    const cells = row.querySelectorAll<HTMLTableCellElement>('th,td')
    if (cells.length < 2) return

    const rawKey = (cells[0].textContent ?? '').trim()
    if (!rawKey) return

    const keyLc = canonLabel(rawKey)
    const key = alias[keyLc] ?? rawKey.trim()

    const cell = cells[1]
    const cellHtml = cell.innerHTML
    const cellText = extractPlainText(cellHtml)

    // 1) Explicit "Indicator Image" field
    if (key === CANON.indicatorImage) {
      const tmp = document.createElement('div')
      tmp.innerHTML = cellHtml
      const img = tmp.querySelector('img')
      if (img?.src) data[CANON.indicatorImage] = img.src
      else if (cellText) data[CANON.indicatorImage] = cellText
      return
    }

    // 2) Communication Details (text + optional inline <img>)
    if (key === CANON.commDetails) {
      data[key] = cellText
      const tmp = document.createElement('div')
      tmp.innerHTML = cellHtml
      const img = tmp.querySelector('img')
      if (img?.src) data[CANON.indicatorImage] = img.src
      return
    }

    // 3) Checkbox groups
    if (CHECKBOX_FIELDS.has(key)) {
      data[key] = parseCheckedList(cellHtml)
      return
    }

    // 4) Default: plain text
    data[key] = cellText
  })

  return data
}

export function stringifyArrays(obj: ParsedData): Record<string, string> {
  const out: Record<string, string> = {}
  Object.keys(obj).forEach((k) => {
    const v = obj[k]
    out[k] = Array.isArray(v) ? JSON.stringify(v) : String(v ?? '')
  })
  return out
}
