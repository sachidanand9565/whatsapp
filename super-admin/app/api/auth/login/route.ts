import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'
import { comparePassword, signAdminToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const admin = await queryOne<{ id: number; email: string; name: string; password_hash: string }>(
      'SELECT * FROM admin_users WHERE email = ?', [email]
    )
    if (!admin) return NextResponse.json({ error: 'Invalid Email' }, { status: 401 })

    const valid = await comparePassword(password, admin.password_hash)
    if (!valid) return NextResponse.json({ error: 'Invalid Password' }, { status: 401 })

    const token = signAdminToken({ id: admin.id, email: admin.email })
    cookies().set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
      path: '/',
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[ADMIN LOGIN ERROR]', e?.message, e?.code)
    return NextResponse.json({ error: e?.message || 'Server error', code: e?.code }, { status: 500 })
  }
}
