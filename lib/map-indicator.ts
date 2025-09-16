import type {
  Prisma,
  Footprint,
  ThematicArea,
  IndicatorCategory,
  TypeOfData,
  DataNature,
  SupportedGroup,
  Purpose,
  PreAnalysis,
  DataAnalysis,
  ResultValidation,
  Frequency,
  CommChannel,
  PublishStatus,
} from '@/lib/generated/prisma'

/** Parsed shape produced by your table parser */
export type ParsedData = Record<string, string | string[]>

// Utilities used across the mapper
const U = {
  normEnum(s: string) {
    return s
      .toUpperCase()
      .replaceAll('&', 'AND')
      .replaceAll('-', '_')
      .replaceAll('/', ' ')
      .replace(/\s+/g, '_')
      .trim()
  },

  first(v?: string | string[]) {
    return Array.isArray(v) ? v[0] : v ?? undefined
  },

  splitList(s?: string | null) {
    if (!s) return []
    // split by comma/semicolon/newline
    return s
      .split(/[,;\n]/g)
      .map((p) => p.trim())
      .filter(Boolean)
  },

  toBool(values?: string[] | string): boolean | undefined {
    if (Array.isArray(values)) {
      if (!values.length) return undefined
      const y = values.find((v) => /^y(es)?$/i.test(v.trim()))
      const n = values.find((v) => /^no?$/i.test(v.trim()))
      if (y) return true
      if (n) return false
      return true
    }
    if (typeof values === 'string') {
      if (/^y(es)?$/i.test(values)) return true
      if (/^no?$/i.test(values)) return false
      return !!values
    }
    return undefined
  },

  /** Find the first present value among label variants */
  pick(src: ParsedData, variants: string[]) {
    for (const k of variants) if (k in src) return src[k]
    return undefined
  },

  /** Try to find a URL inside a text blob */
  findUrl(text?: string) {
    if (!text) return undefined
    const m = text.match(/\bhttps?:\/\/[^\s)]+/i)
    return m?.[0]
  },

  /** Parse common date formats (YYYY-MM-DD, DD/MM/YYYY, 8 March 2024) */
  findDate(text?: string) {
    if (!text) return undefined
    // 2024-07-15
    let m = text.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/)
    if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}`)

    // 15/07/2024 or 15-07-2024
    m = text.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/)
    if (m) return new Date(`${m[3]}-${m[2]}-${m[1]}`)

    // 8 March 2024 / 08 Mar 2024
    m = text.match(/\b(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})\b/)
    if (m) {
      const months = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december',
      ]
      const idx = months.indexOf(m[2].toLowerCase())
      if (idx >= 0) return new Date(Number(m[3]), idx, Number(m[1]))
    }
    return undefined
  },
}

/** ==== ENUM DICTS (accept flexible text, map to Prisma enums) ==== */

const FootprintDict: Record<string, Footprint> = {
  GLOBAL: 'GLOBAL',
  REGIONAL: 'REGIONAL',
  NATIONAL: 'NATIONAL',
  LOCALISED: 'LOCALISED',
}

const ThematicDict: Record<string, ThematicArea> = {
  AGRICULTURE: 'AGRICULTURE',
  BIODIVERSITY: 'BIODIVERSITY',
  CLIMATE_CHANGE: 'CLIMATE_CHANGE',
  ENERGY: 'ENERGY',
  ENVIRONMENTAL_LEADERSHIP: 'ENVIRONMENTAL_LEADERSHIP',
  FISHERIES: 'FISHERIES',
  FORESTRY: 'FORESTRY',
  GENDER_BASED_VIOLENCE: 'GENDER_BASED_VIOLENCE',
  LAND: 'LAND',
  NUTRITION: 'NUTRITION',
  OCEANS: 'OCEANS',
  REPRODUCTIVE_HEALTH: 'REPRODUCTIVE_HEALTH',
  SERVICE_DELIVERY: 'SERVICE_DELIVERY',
  WATER: 'WATER',
  OTHER: 'OTHER',
}

const IndicatorCategoryDict: Record<string, IndicatorCategory> = {
  CLIMATE_ADAPTATION: 'CLIMATE_ADAPTATION',
  CLIMATE_MITIGATION: 'CLIMATE_MITIGATION',
  LOSS_DAMAGE_RISK: 'LOSS_DAMAGE_RISK',
  ADAPTATION_AND_MITIGATION: 'ADAPTATION_AND_MITIGATION',
  ADAPTATION_AND_LDR: 'ADAPTATION_AND_LDR',
  MITIGATION_AND_LDR: 'MITIGATION_AND_LDR',
  ADAPTATION_MITIGATION_AND_LDR: 'ADAPTATION_MITIGATION_AND_LDR',
  OTHER: 'OTHER',
}

const TypeOfDataDict: Record<string, TypeOfData> = {
  AREA_BASED_PROJECTS: 'AREA_BASED_PROJECTS',
  CITIZEN_GENERATED: 'CITIZEN_GENERATED',
  NATIONAL_STATISTICS: 'NATIONAL_STATISTICS',
  RESEARCH_PROJECTS: 'RESEARCH_PROJECTS',
  OTHER: 'OTHER',
}

const DataNatureDict: Record<string, DataNature> = {
  QUANTITATIVE: 'QUANTITATIVE',
  QUALITATIVE: 'QUALITATIVE',
  BOTH: 'BOTH',
}

const SupportedGroupDict: Record<string, SupportedGroup> = {
  CASTES: 'CASTES',
  CHILDREN: 'CHILDREN',
  VULNERABLE_TO_CLIMATE_CHANGE: 'VULNERABLE_TO_CLIMATE_CHANGE',
  INDIGENOUS_PEOPLE: 'INDIGENOUS_PEOPLE',
  LGBTQ_PLUS: 'LGBTQ_PLUS',
  SMALL_SCALE_INDUSTRY: 'SMALL_SCALE_INDUSTRY',
  TRIBAL_GROUPS: 'TRIBAL_GROUPS',
  WOMEN: 'WOMEN',
  YOUTH: 'YOUTH',
  OTHER: 'OTHER',
}

const PurposeDict: Record<string, Purpose> = {
  ADVOCACY: 'ADVOCACY',
  CAPACITY_BUILDING: 'CAPACITY_BUILDING',
  ENV_DATA_SCIENCE: 'ENV_DATA_SCIENCE',
  GESI_ANALYSIS: 'GESI_ANALYSIS',
  M_E: 'M_E',
  POLICY_MAKING: 'POLICY_MAKING',
  POLICY_RESEARCH: 'POLICY_RESEARCH',
  SUSTAINABLE_DEV_TECH: 'SUSTAINABLE_DEV_TECH',
  OTHER: 'OTHER',
}

const PreAnalysisDict: Record<string, PreAnalysis> = {
  STAKEHOLDER_ENGAGEMENTS: 'STAKEHOLDER_ENGAGEMENTS',
  DATA_QUALITY_CONTROL: 'DATA_QUALITY_CONTROL',
  DB_STRUCTURE: 'DB_STRUCTURE',
  DISAGGREGATION_BY_GENDER: 'DISAGGREGATION_BY_GENDER',
  OTHER: 'OTHER',
}

const DataAnalysisDict: Record<string, DataAnalysis> = {
  STATISTICAL_MODELLING: 'STATISTICAL_MODELLING',
  QUALITATIVE_CODING: 'QUALITATIVE_CODING',
  VISUAL_REPRESENTATION: 'VISUAL_REPRESENTATION',
  OTHER: 'OTHER',
}

const ResultValidationDict: Record<string, ResultValidation> = {
  PEER_REVIEW: 'PEER_REVIEW',
  EXPERT_FEEDBACK: 'EXPERT_FEEDBACK',
  SUPPORTED_GROUP_FEEDBACK: 'SUPPORTED_GROUP_FEEDBACK',
  TARGET_AUDIENCE_FEEDBACK: 'TARGET_AUDIENCE_FEEDBACK',
  TRIANGULATION: 'TRIANGULATION',
  OTHER: 'OTHER',
}

const FrequencyDict: Record<string, Frequency> = {
  ANNUALLY: 'ANNUALLY',
  QUARTERLY: 'QUARTERLY',
  EVENT_TRIGGERED: 'EVENT_TRIGGERED',
  OTHER: 'OTHER',
}

const CommDict: Record<string, CommChannel> = {
  PEER_REVIEWED: 'PEER_REVIEWED',
  NON_PEER_REVIEWED: 'NON_PEER_REVIEWED',
  WEBSITE: 'WEBSITE',
  WEBINAR: 'WEBINAR',
  LINKEDIN: 'LINKEDIN',
  FACEBOOK: 'FACEBOOK',
  X: 'X',
  TIKTOK: 'TIKTOK',
  INSTAGRAM: 'INSTAGRAM',
  WHATSAPP: 'WHATSAPP',
  YOUTUBE: 'YOUTUBE',
  TELEGRAM: 'TELEGRAM',
  SIGNAL: 'SIGNAL',
  RADIO: 'RADIO',
  STREAMING: 'STREAMING',
  TELEVISION: 'TELEVISION',
  MAGAZINES_BLOGS: 'MAGAZINES_BLOGS',
  OTHER: 'OTHER',
}

/** map helpers */
function mapMany<T extends string>(
  values: string[] | undefined,
  dict: Record<string, T>,
  opts?: { otherBucket?: (unknowns: string[]) => void }
): T[] {
  if (!values?.length) return []
  const unknowns: string[] = []
  const out = values
    .map((v) => {
      const key = U.normEnum(v)
      const hit = dict[key]
      if (!hit) unknowns.push(v)
      return hit
    })
    .filter(Boolean) as T[]
  if (unknowns.length && opts?.otherBucket) opts.otherBucket(unknowns)
  return out
}

function mapOne<T extends string>(
  value: string | undefined,
  dict: Record<string, T>
): T | undefined {
  if (!value) return
  return dict[U.normEnum(value)]
}

/** Label variants tolerated from Word docs */
const L = {
  footprints: ['Indicator Footprint', 'indicator footprint', 'Footprints'],
  thematicAreas: [
    'Indicator thematic areas',
    'indicator thematic areas',
    'Thematic areas',
  ],
  indicatorCategory: ['Indicator category', 'indicator category', 'Category'],
  typeOfData: ['Type of Data', 'type of data'],
  dataType: ['Data type', 'Datatype', 'Nature of data'],
  groupsSupported: ['Groups supported with data', 'groups supported with data'],
  purposeOfData: ['Purpose of data', 'purpose of data'],
  preAnalysis: ['Pre-analysis', 'Pre analysis'],
  dataAnalysis: ['Data analysis', 'data analysis'],
  resultValidation: ['Result Validation', 'Result validation'],
  frequency: ['Frequency', 'frequency'],
  commChannels: [
    'Data communicated in the public space',
    'data communicated in the public space',
    'Communication channels',
  ],
  publicSharing: ['Public sharing consent', 'public sharing consent'],
  frequentUpdates: [
    'Frequent information updates',
    'frequent information updates',
  ],
  webScrap: ['WebScrapping approval', 'Web Scrapping approval'],
  dashboardUsage: ['Dashboard usage', 'dashboard usage'],

  indicatorShortName: ['Indicator Short Name'],
  description: ['Description', 'Indicator description'],
  countries: ['Countries', 'Country/Countries'],
  linksToData: ['Links to collected data'],
  yearStart: ['Indicator year start'],
  methodology: ['Methodology'],
  limitations: ['Limitations'],

  commDetails: ['Communication Details', 'Communication details'],
  commDate: ['Communication Date', 'Comm Date', 'Publication Date'],
  commLink: ['Communication link', 'Comm Link'],
  // ---- Organization fields ----
  orgId: ['Organization ID', 'Organisation ID'],
  orgName: ['Organization Full Name', 'Organisation Full Name'],
  orgContactName: ['Organization contact name', 'Organisation contact name'],
  orgContactEmail: ['Organization contact email', 'Organisation contact email'],
  orgWebsite: ['Organization website', 'Organisation website'],
}

/** Build Prisma.IndicatorCreateInput from ParsedData */
export function mapParsedToIndicator(
  src: ParsedData
): Prisma.IndicatorCreateInput {
  const otherCats: string[] = []

  const footprints = mapMany(
    U.pick(src, L.footprints) as string[] | undefined,
    FootprintDict
  )

  const thematicAreas = mapMany(
    U.pick(src, L.thematicAreas) as string[] | undefined,
    ThematicDict
  )

  const indicatorCategories = mapMany(
    U.pick(src, L.indicatorCategory) as string[] | undefined,
    IndicatorCategoryDict,
    { otherBucket: (u) => otherCats.push(...u) }
  )

  const typeOfData = mapMany(
    U.pick(src, L.typeOfData) as string[] | undefined,
    TypeOfDataDict
  )

  const dataNature = mapOne(
    U.first(U.pick(src, L.dataType) as string[] | string | undefined),
    DataNatureDict
  )

  const groupsSupported = mapMany(
    U.pick(src, L.groupsSupported) as string[] | undefined,
    SupportedGroupDict
  )

  const purposes = mapMany(
    U.pick(src, L.purposeOfData) as string[] | undefined,
    PurposeDict
  )

  const preAnalysis = mapMany(
    U.pick(src, L.preAnalysis) as string[] | undefined,
    PreAnalysisDict
  )

  const dataAnalysis = mapMany(
    U.pick(src, L.dataAnalysis) as string[] | undefined,
    DataAnalysisDict
  )

  const resultValidation = mapMany(
    U.pick(src, L.resultValidation) as string[] | undefined,
    ResultValidationDict
  )

  // Frequency + optional note
  const freqVals = (U.pick(src, L.frequency) as string[] | undefined) ?? []
  let frequency: Frequency | undefined = undefined
  let frequencyNote: string | undefined = undefined
  if (freqVals.length) {
    frequency = mapOne(freqVals[0], FrequencyDict) ?? 'OTHER'
    if (freqVals.length > 1)
      frequencyNote = `Additional: ${freqVals.slice(1).join(', ')}`
    const otherTxt = freqVals.find((v) => v.toLowerCase().startsWith('other'))
    if (otherTxt) {
      frequency = 'OTHER'
      frequencyNote = otherTxt
    }
  }

  const commChannels = mapMany(
    U.pick(src, L.commChannels) as string[] | undefined,
    CommDict
  )

  const publicSharingConsent = U.toBool(U.pick(src, L.publicSharing))
  const frequentUpdates = U.toBool(U.pick(src, L.frequentUpdates))
  const webScrapingApproval = U.toBool(U.pick(src, L.webScrap))
  const dashboardUsage = U.toBool(U.pick(src, L.dashboardUsage))

  // Free text
  const indicatorShortName =
    U.first(
      U.pick(src, L.indicatorShortName) as string[] | string | undefined
    ) || 'Untitled Indicator'

  const description =
    U.first(U.pick(src, L.description) as string[] | string | undefined) ||
    undefined

  const countries = U.splitList(
    U.first(U.pick(src, L.countries) as string[] | string | undefined) ?? null
  )

  const linksToData = U.splitList(
    U.first(U.pick(src, L.linksToData) as string[] | string | undefined) ?? null
  )

  const yearStart = (() => {
    const raw = U.first(
      U.pick(src, L.yearStart) as string[] | string | undefined
    )
    const n = raw ? parseInt(raw, 10) : NaN
    return Number.isFinite(n) ? n : undefined
  })()

  const methodology = U.first(
    U.pick(src, L.methodology) as string[] | string | undefined
  )

  const limitations = U.first(
    U.pick(src, L.limitations) as string[] | string | undefined
  )

  // Communication Details: try to infer date/link if those fields are absent
  const commDetails = U.first(
    U.pick(src, L.commDetails) as string[] | string | undefined
  )

  const commDate =
    (() => {
      const raw = U.first(
        U.pick(src, L.commDate) as string[] | string | undefined
      )
      return raw ? U.findDate(raw) : undefined
    })() || U.findDate(commDetails)

  const commLink =
    U.first(U.pick(src, L.commLink) as string[] | string | undefined) ||
    U.findUrl(commDetails)

  // Any unknown indicator categories captured
  const indicatorCategoryOther = otherCats.length
    ? otherCats.join(', ')
    : undefined

  const data: Prisma.IndicatorCreateInput = {
    indicatorShortName,
    description,
    footprints,
    countries,
    thematicAreas,
    indicatorCategories,
    indicatorCategoryOther,
    typeOfData,
    dataNature: dataNature ?? 'BOTH',
    groupsSupported,
    purposes,
    yearStart,
    methodology,
    limitations,
    preAnalysis,
    dataAnalysis,
    resultValidation,
    frequency,
    frequencyNote,
    linksToData,
    commChannels,
    commDate: commDate ?? undefined,
    commLink: commLink ?? undefined,
    publicSharingConsent,
    frequentUpdates,
    webScrapingApproval,
    dashboardUsage,
    status: 'PUBLISHED' satisfies PublishStatus,
  }

  return data
}

export type OrgFields = {
  code?: string
  name?: string
  contactName?: string
  contactEmail?: string
  website?: string
}

/** Pull org fields from ParsedData (case/label tolerant) */
export function extractOrganization(src: ParsedData): OrgFields | null {
  const code = U.first(U.pick(src, L.orgId) as string[] | string | undefined)
  const name = U.first(U.pick(src, L.orgName) as string[] | string | undefined)
  const contactName = U.first(
    U.pick(src, L.orgContactName) as string[] | string | undefined
  )
  const contactEmail = U.first(
    U.pick(src, L.orgContactEmail) as string[] | string | undefined
  )
  const website = U.first(
    U.pick(src, L.orgWebsite) as string[] | string | undefined
  )

  if (!code && !name && !contactName && !contactEmail && !website) return null
  return {
    code: code || undefined,
    name: name || undefined,
    contactName,
    contactEmail,
    website,
  }
}
