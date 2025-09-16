'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [userName, setUserName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [busy, setBusy] = React.useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.message || 'Login failed')
      }
      toast.success('Welcome back')
      router.replace('/upload')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md mt-20 rounded-2xl bg-white/90 p-8 ring-1 ring-black/5">
      <div className="text-center mb-6">
        <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-r from-sky-500 to-violet-500" />
        <h1 className="mt-4 text-2xl font-semibold">Welcome to GedA</h1>
        <p className="text-slate-600 text-sm">
          Your Gateway to Intelligent Interaction
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm">
          <span className="text-slate-700">Username</span>
          <input
            type="text"
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Enter username"
          />
        </label>

        <label className="block text-sm">
          <span className="text-slate-700">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg px-4 py-2 bg-gradient-to-r from-sky-500 to-violet-500 text-white font-medium disabled:opacity-60"
        >
          {busy ? 'Submitting…' : 'Submit'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        By clicking “Submit”, you agree to GedA’s{' '}
        <a className="underline">User Agreement</a> and{' '}
        <a className="underline">Privacy Policy</a>.
      </p>
    </div>
  )
}
