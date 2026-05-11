import { NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAdminFromCookies } from '@/lib/auth'

export async function GET() {
  if (!getAdminFromCookies()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const [
      total_users, active_users, suspended_users,
      total_messages, messages_today, total_contacts,
    ] = await Promise.all([
      queryOne<{c:number}>('SELECT COUNT(*) AS c FROM users'),
      queryOne<{c:number}>('SELECT COUNT(*) AS c FROM workspaces WHERE is_active = 1'),
      queryOne<{c:number}>('SELECT COUNT(*) AS c FROM workspaces WHERE is_active = 0'),
      queryOne<{c:number}>('SELECT COUNT(*) AS c FROM messages'),
      queryOne<{c:number}>('SELECT COUNT(*) AS c FROM messages WHERE DATE(created_at) = CURDATE()'),
      queryOne<{c:number}>('SELECT COUNT(*) AS c FROM contacts'),
    ])

    // open tickets (table may not exist yet)
    let open_tickets = 0
    try {
      const t = await queryOne<{c:number}>('SELECT COUNT(*) AS c FROM support_tickets WHERE status = "open"')
      open_tickets = t?.c ?? 0
    } catch {}

    const stats = {
      total_users:       total_users?.c ?? 0,
      active_users:      active_users?.c ?? 0,
      suspended_users:   suspended_users?.c ?? 0,
      total_messages:    total_messages?.c ?? 0,
      messages_today:    messages_today?.c ?? 0,
      total_contacts:    total_contacts?.c ?? 0,
      open_tickets,
      revenue_this_month: 0,
    }

    const chart = await query(`
      SELECT DATE_FORMAT(created_at, '%b %Y') AS month,
             COUNT(*) AS new_users,
             0 AS revenue,
             0 AS messages
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY MIN(created_at) ASC
    `)

    return NextResponse.json({ stats, chart })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}
