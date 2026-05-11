'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MessageSquare, Users, Phone, Mail, Building } from 'lucide-react'
import { formatDate, formatNumber } from '@/lib/utils'
import type { Tenant } from '@/types'

export default function UserDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(r => r.json())
      .then(d => setUser(d.user))
      .finally(() => setLoading(false))
  }, [id])

  async function changePlan(plan: string) {
    await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    setUser(prev => prev ? { ...prev, plan: plan as any } : prev)
  }

  async function changeStatus(status: string) {
    await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUser(prev => prev ? { ...prev, status: status as any } : prev)
  }

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>
  if (!user) return <div className="p-6 text-gray-500">User not found</div>

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <select
              value={user.plan}
              onChange={e => changePlan(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <select
              value={user.status}
              onChange={e => changeStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Messages', value: formatNumber(user.message_count), icon: MessageSquare, color: 'text-purple-500' },
            { label: 'Contacts', value: formatNumber(user.contact_count), icon: Users, color: 'text-blue-500' },
            { label: 'Phone ID', value: user.phone_number_id || 'Not set', icon: Phone, color: 'text-green-500' },
            { label: 'Workspace', value: user.workspace_name, icon: Building, color: 'text-orange-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs text-gray-500">{label}</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Joined: </span>
            <span className="text-gray-800">{formatDate(user.created_at)}</span>
          </div>
          <div>
            <span className="text-gray-500">Last Active: </span>
            <span className="text-gray-800">{user.last_active ? formatDate(user.last_active) : 'Never'}</span>
          </div>
          <div>
            <span className="text-gray-500">WABA ID: </span>
            <span className="text-gray-800 font-mono text-xs">{user.waba_id || 'Not connected'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
