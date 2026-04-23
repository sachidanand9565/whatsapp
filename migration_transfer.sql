-- ============================================================
-- Migration: Chat Transfer
-- Run this against your whatsapp_saas database
-- ============================================================

USE whatsapp_saas;

-- Direct agent assignment on a contact (set when chat is transferred)
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS assigned_agent_id INT NULL,
  ADD INDEX IF NOT EXISTS idx_assigned_agent (assigned_agent_id);
