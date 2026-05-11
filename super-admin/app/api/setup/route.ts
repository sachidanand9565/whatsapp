import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Create admin_users table
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        name          VARCHAR(100) NOT NULL,
        email         VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create admin_plans table
    await query(`
      CREATE TABLE IF NOT EXISTS admin_plans (
        id                       INT AUTO_INCREMENT PRIMARY KEY,
        name                     VARCHAR(50) NOT NULL UNIQUE,
        price_monthly            DECIMAL(10,2) DEFAULT 0,
        price_yearly             DECIMAL(10,2) DEFAULT 0,
        max_contacts             INT DEFAULT 1000,
        max_messages_per_month   INT DEFAULT 10000,
        max_agents               INT DEFAULT 1,
        features                 JSON,
        is_active                TINYINT(1) DEFAULT 1,
        created_at               TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create support_tickets table
    await query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    INT NOT NULL,
        subject    VARCHAR(255) NOT NULL,
        message    TEXT NOT NULL,
        status     ENUM('open','in_progress','resolved','closed') DEFAULT 'open',
        priority   ENUM('low','medium','high') DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Add plan/status columns to workspaces if missing
    try {
      await query(`ALTER TABLE workspaces ADD COLUMN plan ENUM('free','starter','pro','enterprise') DEFAULT 'free'`)
    } catch {}
    try {
      await query(`ALTER TABLE workspaces ADD COLUMN status ENUM('active','suspended','pending') DEFAULT 'active'`)
    } catch {}
    try {
      await query(`ALTER TABLE workspaces ADD COLUMN waba_id VARCHAR(100) DEFAULT NULL`)
    } catch {}

    // Seed default admin (password: Admin@123)
    const existing = await query('SELECT id FROM admin_users WHERE email = ?', ['admin@skwebtech.in'])
    if (existing.length === 0) {
      const hash = await bcrypt.hash('Admin@123', 10)
      await query(
        'INSERT INTO admin_users (name, email, password_hash) VALUES (?,?,?)',
        ['Super Admin', 'admin@skwebtech.in', hash]
      )
    }

    // Seed default plans
    const plans = [
      ['free',       0,     0,      500,    1000,   1,  JSON.stringify(['Basic Inbox','Chatbot','1 Agent'])],
      ['starter',    999,   9990,   5000,   20000,  3,  JSON.stringify(['Campaigns','CSV Import','3 Agents'])],
      ['pro',        2999,  29990,  25000,  100000, 10, JSON.stringify(['Analytics','API Access','10 Agents'])],
      ['enterprise', 7999,  79990,  100000, 500000, 50, JSON.stringify(['Dedicated Support','50 Agents','White Label'])],
    ]
    for (const p of plans) {
      try {
        await query(
          'INSERT IGNORE INTO admin_plans (name, price_monthly, price_yearly, max_contacts, max_messages_per_month, max_agents, features) VALUES (?,?,?,?,?,?,?)',
          p
        )
      } catch {}
    }

    return NextResponse.json({
      ok: true,
      message: 'Setup complete!',
      login: { email: 'admin@skwebtech.in', password: 'Admin@123' }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message, code: e?.code }, { status: 500 })
  }
}
