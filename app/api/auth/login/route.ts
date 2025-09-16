import { NextRequest, NextResponse } from 'next/server'

interface LoginRequest {
  userName?: string
  password?: string
}

export async function POST(req: NextRequest) {
  const { userName, password } = await req
    .json()
    .catch(() => ({} as LoginRequest))
  const ok =
    userName === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASSWORD

  if (!ok) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  }

  const res = NextResponse.json({ ok: true })
  // minimal httpOnly session cookie
  res.cookies.set('geda_session', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8h
  })
  return res
}
