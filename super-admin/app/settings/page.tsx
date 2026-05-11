'use client'
import { useState } from 'react'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    platform_name: 'WhatsApp SaaS',
    support_email: 'support@example.com',
    razorpay_key_id: '',
    razorpay_key_secret: '',
    meta_app_id: '',
    meta_app_secret: '',
  })

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function save() {
    // In production: POST /api/settings
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sections = [
    {
      title: 'General',
      fields: [
        { label: 'Platform Name', key: 'platform_name', type: 'text' },
        { label: 'Support Email', key: 'support_email', type: 'email' },
      ],
    },
    {
      title: 'Razorpay (Billing)',
      fields: [
        { label: 'Key ID', key: 'razorpay_key_id', type: 'text' },
        { label: 'Key Secret', key: 'razorpay_key_secret', type: 'password' },
      ],
    },
    {
      title: 'Meta WhatsApp',
      fields: [
        { label: 'App ID', key: 'meta_app_id', type: 'text' },
        { label: 'App Secret', key: 'meta_app_secret', type: 'password' },
      ],
    },
  ]

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Platform configuration</p>
      </div>

      {sections.map(s => (
        <div key={s.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 text-sm border-b border-gray-100 pb-2">{s.title}</h2>
          {s.fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <input
                type={f.type}
                value={(form as any)[f.key]}
                onChange={e => set(f.key, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={save}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        <Save className="w-4 h-4" />
        {saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}
