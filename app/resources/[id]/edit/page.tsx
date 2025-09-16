'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'

// actions
import ClientDelete from '@/components/site/DeleteIndicator'
import LogoutButton from '@/components/site/LogoutBtn'

type IndicatorVM = {
  id: string
  shortName?: string | null
  indicatorShortName?: string | null
  description?: string | null
  methodology?: string | null
  commDate?: string | null // ISO
  commLink?: string | null
  imageUrl?: string | null
}

const Schema = z.object({
  shortName: z.string().min(2, 'Please enter a title'),
  description: z.string().optional(),
  methodology: z.string().optional(),
  commDate: z.string().optional(), // yyyy-mm-dd
  commLink: z
    .string()
    .url('Enter a valid URL')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  imageUrl: z
    .string()
    .url('Enter a valid URL or leave blank')
    .optional()
    .or(z.literal('').transform(() => undefined)),
})

type FormValues = z.infer<typeof Schema>

export default function EditIndicatorPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = React.useState(true)
  const [initial, setInitial] = React.useState<IndicatorVM | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      shortName: '',
      description: '',
      methodology: '',
      commDate: '',
      commLink: '',
      imageUrl: '',
    },
  })

  // load current values
  React.useEffect(() => {
    if (!id) return
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`/api/indicators/${encodeURIComponent(id)}`, {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('Failed to load')
        const data: IndicatorVM = await res.json()
        if (!alive) return

        setInitial(data)

        const dateStr = data.commDate
          ? new Date(data.commDate).toISOString().slice(0, 10)
          : ''

        form.reset({
          shortName: data.shortName || data.indicatorShortName || '',
          description: data.description || '',
          methodology: data.methodology || '',
          commDate: dateStr,
          commLink: data.commLink || '',
          imageUrl: data.imageUrl || '',
        })
      } catch {
        toast.error('Failed to load indicator')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id, form])

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        data: {
          // ✅ use shortName (your API expects this)
          shortName: values.shortName,
          description: values.description || null,
          methodology: values.methodology || null,
          commLink: values.commLink || null,
          commDate: values.commDate ? new Date(values.commDate) : null,
          imageUrl: values.imageUrl || null,
        },
      }

      const res = await fetch(`/api/indicators/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 401) {
        // not logged in → go to login, then come back here
        router.push(
          `/login?next=${encodeURIComponent(`/resources/${id}/edit`)}`
        )
        return
      }

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.message || 'Update failed')
      }

      toast.success('Indicator updated')
      router.push(`/resources/${id}`)
      router.refresh()
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Update failed'
      toast.error(errorMessage)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Loading…</CardTitle>
            <CardDescription>Fetching indicator details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-9 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-9 w-1/3" />
            <Skeleton className="h-9 w-1/3" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!initial) {
    return (
      <div className="mx-auto max-w-3xl text-center text-slate-600">
        Failed to load indicator.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <Card className="bg-white/90 ring-1 ring-black/5">
        <CardHeader>
          <CardTitle className="text-customNavyTeal">Edit Indicator</CardTitle>
          <CardDescription>
            Minimal fields for the demo. Changes will reflect on the details
            page.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="shortName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="Indicator short name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full min-h-[120px] resize-y leading-6"
                        placeholder="Brief description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Methodology */}
              <FormField
                control={form.control}
                name="methodology"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Methodology</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full min-h-[100px] resize-y leading-6"
                        placeholder="Methodology notes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Comm date + link */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="commDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Communication Date</FormLabel>
                      <FormControl>
                        <Input className="w-full" type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Communication Link</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="https://example.org/post"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image URL + live preview */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        placeholder="https://…"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {field.value ? (
                      <div className="mt-2 overflow-hidden rounded-xl border">
                        {/* Plain <img> to avoid Next/Image domain config for external URLs */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={field.value}
                          alt="Preview"
                          className="block h-40 w-full object-cover"
                        />
                      </div>
                    ) : null}
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 cursor-pointer"
                >
                  Save changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push(`/resources/${id}`)}
                  className="cursor-pointer hover:bg-slate-700 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-500">
            You must be logged in to save or delete.
          </div>
          <div className="flex flex-wrap gap-2">
            <ClientDelete id={initial.id} />
            <LogoutButton redirectTo={`/resources/${initial.id}`} />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
