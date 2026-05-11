import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAdminFromCookies } from '@/lib/auth'

export async function GET(req: Request) {
  if (!getAdminFromCookies()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''

  let sql = `
    SELECT u.id AS user_id, u.name AS user_name, u.email AS user_email,
           w.name AS workspace_name, w.phone_number_id, w.waba_id,
           CASE
             WHEN w.phone_number_id IS NOT NULL AND w.waba_id IS NOT NULL THEN 'connected'
             ELSE 'not_connected'
           END AS wa_status,
           u.created_at
    FROM users u
    JOIN workspaces w ON w.owner_id = u.id
    WHERE 1=1
  `
  const params: any[] = []
  if (search) { sql += ' AND (u.name LIKE ? OR u.email LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
  sql += ' ORDER BY u.created_at DESC'

  const records = await query(sql, params)
  return NextResponse.json({ records })
}
