import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET: reset admin password to Admin@123
export async function GET() {
  try {
    const newPassword = 'Admin@123'
    const hash = await bcrypt.hash(newPassword, 10)

    // Update existing OR insert new
    const existing = await query('SELECT id FROM admin_users LIMIT 1')

    if (existing.length > 0) {
      await query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hash, (existing[0] as any).id])
    } else {
      await query(
        'INSERT INTO admin_users (name, email, password_hash) VALUES (?,?,?)',
        ['Super Admin', 'admin@skwebtech.in', hash]
      )
    }

    const admin = await query('SELECT id, name, email FROM admin_users LIMIT 1')

    return NextResponse.json({
      ok: true,
      message: 'Password reset successful',
      login: {
        email: (admin[0] as any).email,
        password: newPassword,
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}
