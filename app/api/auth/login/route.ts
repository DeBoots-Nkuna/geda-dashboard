import { NextRequest, NextResponse } from 'next/server'

interface LoginRequest {
  userName?: string
  password?: string
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    const ADMIN_USER = process.env.ADMIN_USERNAME ?? 'root'
    const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? 'root#123'

    const ok = username === ADMIN_USER && password === ADMIN_PASS
    if (!ok) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const res = NextResponse.json({ ok: true })

    // Set cookie used by your edit/delete API routes
    res.cookies.set('geda_session', '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    })

    return res
  } catch {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
