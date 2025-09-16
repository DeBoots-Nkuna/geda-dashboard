import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import {
  mapParsedToIndicator,
  extractOrganization,
  ParsedData,
} from '@/lib/map-indicator'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ParsedData
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 })
    }

    // 1) Build indicator data from parsed table
    const indicatorData = mapParsedToIndicator(body)

    // 2) Find/create organization (if any org fields present)
    let organizationId: string | undefined = undefined
    const org = extractOrganization(body)

    if (org && (org.code || org.name)) {
      // try to find by code first, then by name (case-insensitive)
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
      })

      if (existing) {
        organizationId = existing.id

        // optional: patch contact fields if empty in DB but present in upload
        const patch: Partial<{
          contactName: string
          contactEmail: string
          website: string
        }> = {}
        if (org.contactName && !existing.contactName)
          patch.contactName = org.contactName
        if (org.contactEmail && !existing.contactEmail)
          patch.contactEmail = org.contactEmail
        if (org.website && !existing.website) patch.website = org.website
        if (Object.keys(patch).length) {
          await prisma.organization.update({
            where: { id: existing.id },
            data: patch,
          })
        }
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
        organizationId = created.id
      }
    }

    // 3) Create indicator (link to org if we have one)
    const createData = organizationId
      ? { ...indicatorData, organizationId, organization: undefined }
      : indicatorData

    const saved = await prisma.indicator.create({
      data: createData,
      select: { id: true },
    })

    return NextResponse.json({ ok: true, id: saved.id })
  } catch (err: unknown) {
    console.error(err)
    const errorMessage = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ message: errorMessage }, { status: 500 })
  }
}
