'use client'
import { useEffect, useState } from 'react'
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface WABARecord {
  user_id: number
  user_name: string
  user_email: string
  workspace_name: string
  phone_number_id: string | null
  waba_id: string | null
  wa_status: 'connected' | 'not_connected' | 'error'
  created_at: string
}

const STATUS_ICON = {
  connected:     <CheckCircle className="w-4 h-4 text-green-500" />,
  not_connected: <Clock className="w-4 h-4 text-yellow-500" />,
  error:         <XCircle className="w-4 h-4 text-red-500" />,
}

export default function WABAPage() {
  const [records, setRecords] = useState<WABARecord[]>([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const p = new URLSearchParams()
    if (search) p.set('search', search)
    fetch(`/api/waba?${p}`).then(r => r.json())
      .then(d => setRecords(d.records || []))
      .finally(() => setLoading(false))
  }, [search])

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">WABA Accounts</h1>
        <p className="text-sm text-gray-500 mt-1">WhatsApp Business Account status of all users</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search user..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">User</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Workspace</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone Number ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">WABA ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No records found</td></tr>
              ) : records.map(r => (
                <tr key={r.user_id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{r.user_name}</p>
                    <p className="text-xs text-gray-500">{r.user_email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.workspace_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.phone_number_id || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.waba_id || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {STATUS_ICON[r.wa_status]}
                      <span className="capitalize text-xs text-gray-600">{r.wa_status.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
