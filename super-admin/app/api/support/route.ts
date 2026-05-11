import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAdminFromCookies } from '@/lib/auth'

export async function GET(req: Request) {
  if (!getAdminFromCookies()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || ''

  let sql = `
    SELECT t.*, u.name AS user_name, u.email AS user_email
    FROM support_tickets t
    JOIN users u ON u.id = t.user_id
    WHERE 1=1
  `
  const params: any[] = []
  if (status) { sql += ' AND t.status = ?'; params.push(status) }
  sql += ' ORDER BY t.created_at DESC'

  const tickets = await query(sql, params)
  return NextResponse.json({ tickets })
}
