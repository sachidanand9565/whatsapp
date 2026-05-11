-- Super Admin Tables (add to existing whatsapp_saas DB)

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plans table
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
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  subject    VARCHAR(255) NOT NULL,
  message    TEXT NOT NULL,
  status     ENUM('open','in_progress','resolved','closed') DEFAULT 'open',
  priority   ENUM('low','medium','high') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add plan and status columns to workspaces if not exist
ALTER TABLE workspaces
  ADD COLUMN IF NOT EXISTS plan   ENUM('free','starter','pro','enterprise') DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS status ENUM('active','suspended','pending') DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS waba_id VARCHAR(100) DEFAULT NULL;

-- Seed: default admin user (password: Admin@123)
-- Change this password immediately after first login!
INSERT IGNORE INTO admin_users (name, email, password_hash) VALUES (
  'Super Admin',
  'admin@yourdomain.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
);

-- Seed: default plans
INSERT IGNORE INTO admin_plans (name, price_monthly, price_yearly, max_contacts, max_messages_per_month, max_agents, features) VALUES
  ('free',       0,      0,      500,    1000,   1,  '["Basic Inbox","Chatbot","1 Agent"]'),
  ('starter',    999,    9990,   5000,   20000,  3,  '["Everything in Free","Campaigns","CSV Import","3 Agents"]'),
  ('pro',        2999,   29990,  25000,  100000, 10, '["Everything in Starter","Analytics","API Access","10 Agents"]'),
  ('enterprise', 7999,   79990,  100000, 500000, 50, '["Everything in Pro","Dedicated Support","50 Agents","White Label"]');
