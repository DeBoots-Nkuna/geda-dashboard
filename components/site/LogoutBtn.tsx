'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function LogoutButton({
  redirectTo = '/resources',
  label = 'Log out',
}: {
  /** Where to send the user after logout (and where "Sign in" will send them back) */
  redirectTo?: string
  label?: string
}) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)

  const onLogout = async () => {
    try {
      setBusy(true)
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (!res.ok) throw new Error('Logout failed')
      toast.success('Signed out')
      // Send them to login; after they sign in, they'll come back to redirectTo
      router.replace(`/login?next=${encodeURIComponent(redirectTo)}`)
      router.refresh()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Logout failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button
      onClick={onLogout}
      disabled={busy}
      variant="secondary"
      className="border-teal-600 text-teal-700 hover:bg-teal-50 cursor-pointer disabled:opacity-50"
    >
      {busy ? 'Signing out…' : label}
    </Button>
  )
}
