'use client'
import { useEffect, useState } from 'react'
import { Users, MessageSquare, PhoneCall, Ticket, TrendingUp, AlertCircle } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface Stats {
  total_users: number
  active_users: number
  suspended_users: number
  total_messages: number
  messages_today: number
  total_contacts: number
  open_tickets: number
  revenue_this_month: number
}

interface ChartData { month: string; revenue: number; new_users: number }

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [chart, setChart] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => { setStats(d.stats); setChart(d.chart) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>

  const cards = [
    { label: 'Total Users',      value: stats?.total_users ?? 0,        icon: Users,          color: 'bg-blue-500'   },
    { label: 'Active Users',     value: stats?.active_users ?? 0,       icon: TrendingUp,     color: 'bg-green-500'  },
    { label: 'Suspended',        value: stats?.suspended_users ?? 0,    icon: AlertCircle,    color: 'bg-red-500'    },
    { label: 'Messages Today',   value: stats?.messages_today ?? 0,     icon: MessageSquare,  color: 'bg-purple-500' },
    { label: 'Total Contacts',   value: stats?.total_contacts ?? 0,     icon: PhoneCall,      color: 'bg-yellow-500' },
    { label: 'Open Tickets',     value: stats?.open_tickets ?? 0,       icon: Ticket,         color: 'bg-orange-500' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview</p>
      </div>

      {/* Revenue Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-5 text-white">
        <p className="text-sm font-medium opacity-80">Revenue this month</p>
        <p className="text-4xl font-bold mt-1">₹{formatNumber(stats?.revenue_this_month ?? 0)}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Monthly Revenue (₹)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#16a34a" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">New Users per Month</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="new_users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
