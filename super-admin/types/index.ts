export interface AdminUser {
  id: number
  email: string
  name: string
  created_at: string
}

export interface Tenant {
  id: number
  name: string
  email: string
  workspace_name: string
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  status: 'active' | 'suspended' | 'pending'
  phone_number_id: string | null
  waba_id: string | null
  message_count: number
  contact_count: number
  created_at: string
  last_active: string | null
}

export interface Plan {
  id: number
  name: string
  price_monthly: number
  price_yearly: number
  max_contacts: number
  max_messages_per_month: number
  max_agents: number
  features: string[]
  is_active: boolean
}

export interface SupportTicket {
  id: number
  user_id: number
  user_name: string
  user_email: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total_users: number
  active_users: number
  suspended_users: number
  total_messages: number
  messages_today: number
  total_contacts: number
  open_tickets: number
  revenue_this_month: number
}

export interface RevenueData {
  month: string
  revenue: number
  new_users: number
}
