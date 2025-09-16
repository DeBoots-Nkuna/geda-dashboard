import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@/lib/generated/prisma'
import type {
  Indicator,
  Organization,
  DataNature,
  Frequency,
  PublishStatus,
} from '@/lib/generated/prisma'
import {
  mapParsedToIndicator,
  extractOrganization,
  ParsedData,
} from '@/lib/map-indicator'

const prisma = new PrismaClient()

function isAuthed(req: NextRequest) {
  const cookie = req.headers.get('cookie') || ''
  return /geda_session=1/.test(cookie) // your simple session cookie
}

/** For the details page: shape DB -> UI-friendly JSON */
function toViewModel(ind: Indicator & { organization?: Organization | null }) {
  const org = ind.organization ?? null

  // build a readable "communication details" if free-text wasn't captured
  const parts: string[] = []
  if (ind.commDate)
    parts.push(`Date: ${new Date(ind.commDate).toISOString().slice(0, 10)}`)
  if (ind.commLink) parts.push(`Link: ${ind.commLink}`)
  if (ind.commChannels?.length)
    parts.push(`Channels: ${ind.commChannels.join(', ')}`)
  const communicationDetails = parts.join(' • ') || null

  return {
    // raw db fields you might still want
    ...ind,

    // aliases used by your current details page
    indicatorShortName: ind.indicatorShortName,
    indicatorDescription: ind.description,
    imageUrl: ind.imageUrl ?? null,

    indicatorFootprint: ind.footprints ?? [],
    indicatorYearStart: ind.yearStart ?? null,

    organisationFullName: org?.name ?? null,
    organisationContactName: org?.contactName ?? null,
    organisationContactEmail: org?.contactEmail ?? null,
    organisationWebsite: org?.website ?? null,

    communicationDetails,
  }
}

/** Wrap scalar-list updates in { set: [...] } where needed */
function asUpdateFromCreate(
  ci: Prisma.IndicatorCreateInput
): Prisma.IndicatorUpdateInput {
  const wrap = (v: unknown) => {
    if (Array.isArray(v)) {
      return { set: v }
    }
    if (v === undefined || v === null) {
      return undefined
    }
    // Handle Prisma input objects by extracting the set property if it exists
    if (typeof v === 'object' && v !== null && 'set' in v) {
      return v as { set: unknown[] }
    }
    return { set: v as unknown[] }
  }

  return {
    indicatorShortName: ci.indicatorShortName,
    description: ci.description,
    footprints: wrap(ci.footprints),
    countries: wrap(ci.countries),
    thematicAreas: wrap(ci.thematicAreas),
    indicatorCategories: wrap(ci.indicatorCategories),
    indicatorCategoryOther: ci.indicatorCategoryOther,
    typeOfData: wrap(ci.typeOfData),
    dataNature: ci.dataNature,
    groupsSupported: wrap(ci.groupsSupported),
    purposes: wrap(ci.purposes),
    yearStart: ci.yearStart,
    methodology: ci.methodology,
    limitations: ci.limitations,
    preAnalysis: wrap(ci.preAnalysis),
    dataAnalysis: wrap(ci.dataAnalysis),
    resultValidation: wrap(ci.resultValidation),
    frequency: ci.frequency,
    frequencyNote: ci.frequencyNote,
    linksToData: wrap(ci.linksToData),
    commChannels: wrap(ci.commChannels),
    commDate: ci.commDate,
    commLink: ci.commLink,
    publicSharingConsent: ci.publicSharingConsent,
    frequentUpdates: ci.frequentUpdates,
    webScrapingApproval: ci.webScrapingApproval,
    dashboardUsage: ci.dashboardUsage,
    status: ci.status,
    // imageUrl if you added it in your model
    ...(ci.imageUrl ? { imageUrl: ci.imageUrl } : {}),
  }
}

/** GET /api/indicators/:id — used by the details page */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const ind = await prisma.indicator.findUnique({
      where: { id },
      include: { organization: true },
    })
    if (!ind)
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json(toViewModel(ind))
  } catch (err: unknown) {
    console.error(err)
    const errorMessage = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}

/** PATCH /api/indicators/:id — requires auth */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  try {
    const body = await req.json()

    // Two supported payload shapes:
    // 1) { parsed: <ParsedData> } -> re-run full mapper and update
    // 2) { data: <partial IndicatorUpdateInput-like> } -> direct partial update
    let data: Prisma.IndicatorUpdateInput = {}

    if (body?.parsed && typeof body.parsed === 'object') {
      const parsed = body.parsed as ParsedData
      const createInput = mapParsedToIndicator(parsed)
      data = asUpdateFromCreate(createInput)

      // optional: upsert org again from parsed doc
      const org = extractOrganization(parsed)
      if (org && (org.code || org.name)) {
        const whereConditions = []
        if (org.code) {
          whereConditions.push({ code: org.code })
        }
        if (org.name) {
          whereConditions.push({
            name: { equals: org.name, mode: 'insensitive' as const },
          })
        }

        const existing = await prisma.organization.findFirst({
          where: {
            OR: whereConditions,
          },
          select: { id: true },
        })
        if (existing) {
          data.organization = { connect: { id: existing.id } }
        } else {
          const created = await prisma.organization.create({
            data: {
              code: org.code,
              name: org.name ?? 'Unnamed Organization',
              contactName: org.contactName,
              contactEmail: org.contactEmail,
              website: org.website,
            },
            select: { id: true },
          })
          data.organization = { connect: { id: created.id } }
        }
      }
    } else if (body?.data && typeof body.data === 'object') {
      // direct partial update; wrap list fields if present
      const d = body.data as Record<string, unknown>
      const wrap = (v: unknown): unknown => (Array.isArray(v) ? { set: v } : v)

      // Build the update data with proper type handling
      const updateData: Partial<Prisma.IndicatorUpdateInput> = {}

      if (d.indicatorShortName !== undefined)
        updateData.indicatorShortName = d.indicatorShortName as string
      if (d.description !== undefined)
        updateData.description = d.description as string | null
      if (d.footprints !== undefined)
        updateData.footprints = wrap(
          d.footprints
        ) as Prisma.IndicatorUpdatefootprintsInput
      if (d.countries !== undefined)
        updateData.countries = wrap(
          d.countries
        ) as Prisma.IndicatorUpdatecountriesInput
      if (d.thematicAreas !== undefined)
        updateData.thematicAreas = wrap(
          d.thematicAreas
        ) as Prisma.IndicatorUpdatethematicAreasInput
      if (d.indicatorCategories !== undefined)
        updateData.indicatorCategories = wrap(
          d.indicatorCategories
        ) as Prisma.IndicatorUpdateindicatorCategoriesInput
      if (d.indicatorCategoryOther !== undefined)
        updateData.indicatorCategoryOther = d.indicatorCategoryOther as
          | string
          | null
      if (d.typeOfData !== undefined)
        updateData.typeOfData = wrap(
          d.typeOfData
        ) as Prisma.IndicatorUpdatetypeOfDataInput
      if (d.dataNature !== undefined)
        updateData.dataNature = d.dataNature as DataNature
      if (d.groupsSupported !== undefined)
        updateData.groupsSupported = wrap(
          d.groupsSupported
        ) as Prisma.IndicatorUpdategroupsSupportedInput
      if (d.purposes !== undefined)
        updateData.purposes = wrap(
          d.purposes
        ) as Prisma.IndicatorUpdatepurposesInput
      if (d.yearStart !== undefined)
        updateData.yearStart = d.yearStart as number | null
      if (d.methodology !== undefined)
        updateData.methodology = d.methodology as string | null
      if (d.limitations !== undefined)
        updateData.limitations = d.limitations as string | null
      if (d.preAnalysis !== undefined)
        updateData.preAnalysis = wrap(
          d.preAnalysis
        ) as Prisma.IndicatorUpdatepreAnalysisInput
      if (d.dataAnalysis !== undefined)
        updateData.dataAnalysis = wrap(
          d.dataAnalysis
        ) as Prisma.IndicatorUpdatedataAnalysisInput
      if (d.resultValidation !== undefined)
        updateData.resultValidation = wrap(
          d.resultValidation
        ) as Prisma.IndicatorUpdateresultValidationInput
      if (d.frequency !== undefined)
        updateData.frequency = d.frequency as Frequency | null
      if (d.frequencyNote !== undefined)
        updateData.frequencyNote = d.frequencyNote as string | null
      if (d.linksToData !== undefined)
        updateData.linksToData = wrap(
          d.linksToData
        ) as Prisma.IndicatorUpdatelinksToDataInput
      if (d.commChannels !== undefined)
        updateData.commChannels = wrap(
          d.commChannels
        ) as Prisma.IndicatorUpdatecommChannelsInput
      if (d.commDate !== undefined)
        updateData.commDate = d.commDate as Date | null
      if (d.commLink !== undefined)
        updateData.commLink = d.commLink as string | null
      if (d.publicSharingConsent !== undefined)
        updateData.publicSharingConsent = d.publicSharingConsent as
          | boolean
          | null
      if (d.frequentUpdates !== undefined)
        updateData.frequentUpdates = d.frequentUpdates as boolean | null
      if (d.webScrapingApproval !== undefined)
        updateData.webScrapingApproval = d.webScrapingApproval as boolean | null
      if (d.dashboardUsage !== undefined)
        updateData.dashboardUsage = d.dashboardUsage as boolean | null
      if (d.status !== undefined) updateData.status = d.status as PublishStatus
      if (d.imageUrl !== undefined)
        updateData.imageUrl = d.imageUrl as string | null
      if (d.organizationId)
        updateData.organization = {
          connect: { id: d.organizationId as string },
        }

      data = updateData
    } else {
      return NextResponse.json(
        { message: 'Invalid payload. Send { parsed } or { data }.' },
        { status: 400 }
      )
    }

    const updated = await prisma.indicator.update({
      where: { id },
      data,
      include: { organization: true },
    })

    return NextResponse.json(toViewModel(updated))
  } catch (err: unknown) {
    console.error(err)
    const errorMessage = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}

/** DELETE /api/indicators/:id — requires auth */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  try {
    await prisma.indicator.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error(err)
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      err.code === 'P2025'
    ) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
