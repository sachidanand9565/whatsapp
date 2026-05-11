import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAdminFromCookies } from '@/lib/auth'

export async function GET() {
  if (!getAdminFromCookies()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const plans = await query('SELECT * FROM admin_plans ORDER BY price_monthly ASC')
  return NextResponse.json({ plans })
}

export async function POST(req: Request) {
  if (!getAdminFromCookies()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, price_monthly, price_yearly, max_contacts, max_messages_per_month, max_agents, features, is_active } = await req.json()
  await query(
    'INSERT INTO admin_plans (name, price_monthly, price_yearly, max_contacts, max_messages_per_month, max_agents, features, is_active) VALUES (?,?,?,?,?,?,?,?)',
    [name, price_monthly, price_yearly, max_contacts, max_messages_per_month, max_agents, JSON.stringify(features || []), is_active ? 1 : 0]
  )
  return NextResponse.json({ ok: true })
}
