'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/hooks/useApi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { IndianRupee, MessageSquare, Gift, TrendingUp, Send, CheckCheck, Eye, Clock } from 'lucide-react';

const USD_TO_INR = 84;
const toINR = (usd: number) => Math.round(usd * USD_TO_INR * 100) / 100;

function toLocalDate(d: Date) { return d.toISOString().slice(0, 10); }
function todayStr()     { return toLocalDate(new Date()); }
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate() - 1); return toLocalDate(d); }
function daysAgoStr(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return toLocalDate(d); }

interface Summary {
  total_conversations:  number;
  total_cost:           number;
  free_tier_used:       number;
  free_tier_remaining:  number;
  paid_conversations:   number;
  total_sent:           number;
  total_delivered:      number;
  total_read:           number;
  delivery_rate:        number;
}

interface CategoryRow { conversations: number; cost: number; }

interface DayRow {
  date: string; marketing: number; utility: number;
  authentication: number; service: number; cost: number;
  sent: number; delivered: number; read: number;
}

interface BillingData {
  label:         string;
  has_conv_data: boolean;
  has_msg_data:  boolean;
  summary:       Summary;
  by_category:   Record<string, CategoryRow>;
  daily:         DayRow[];
}

const CAT_COLORS: Record<string, string> = {
  MARKETING: '#EF4444', UTILITY: '#3B82F6', AUTHENTICATION: '#F59E0B', SERVICE: '#25D366',
};
const CAT_LABELS: Record<string, string> = {
  MARKETING: 'Marketing', UTILITY: 'Utility', AUTHENTICATION: 'Authentication', SERVICE: 'Service',
};

const PRESETS = [
  { label: 'Today',     getRange: () => ({ s: todayStr(),         e: todayStr() }) },
  { label: 'Yesterday', getRange: () => ({ s: yesterdayStr(),     e: yesterdayStr() }) },
  { label: 'Last 7d',   getRange: () => ({ s: daysAgoStr(6),      e: todayStr() }) },
  { label: 'Last 30d',  getRange: () => ({ s: daysAgoStr(29),     e: todayStr() }) },
];

export default function BillingPage() {
  const [startDate, setStartDate] = useState(yesterdayStr);
  const [endDate,   setEndDate]   = useState(yesterdayStr);
  const [data,      setData]      = useState<BillingData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  function applyPreset(s: string, e: string) { setStartDate(s); setEndDate(e); }

  useEffect(() => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError('');
    apiFetch(`/api/billing?start_date=${startDate}&end_date=${endDate}`)
      .then((r) => { if (r?.data) setData(r.data); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  const hasAnyData = data && (data.has_conv_data || data.has_msg_data);

  const pieData = data
    ? Object.entries(data.by_category)
        .filter(([, v]) => v.conversations > 0)
        .map(([cat, v]) => ({ name: CAT_LABELS[cat] || cat, value: v.conversations, color: CAT_COLORS[cat] || '#888' }))
    : [];

  const freePct = data
    ? Math.min(100, Math.round((data.summary.free_tier_used / 1000) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Usage</h1>
      </div>

      {/* Date filter */}
      <div className="card flex flex-wrap items-center gap-3">
        {/* Quick presets */}
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => {
            const r = p.getRange();
            const active = startDate === r.s && endDate === r.e;
            return (
              <button key={p.label} onClick={() => applyPreset(r.s, r.e)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${active ? 'bg-whatsapp-green text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-gray-500">From</span>
          <input type="date" value={startDate} max={endDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-whatsapp-green" />
          <span className="text-sm text-gray-500">To</span>
          <input type="date" value={endDate} min={startDate} max={todayStr()}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-whatsapp-green" />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-whatsapp-green border-t-transparent rounded-full" />
        </div>
      )}

      {error && (
        <div className="card border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {!loading && !error && data && !hasAnyData && (
        <div className="card border border-blue-200 bg-blue-50 text-blue-800 text-sm space-y-1">
          <p className="font-semibold">No data found for this month.</p>
          <ul className="list-disc list-inside space-y-0.5 text-blue-700">
            <li>Message analytics takes a few minutes to update.</li>
            <li>Billing (conversation) analytics has a <strong>24–72 hour delay</strong>.</li>
            <li>Make sure your phone number is connected in Settings.</li>
          </ul>
        </div>
      )}

      {!loading && !error && data && hasAnyData && (
        <>
          {/* Message stats banner — always available */}
          {data.has_msg_data && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Messages Sent',      value: data.summary.total_sent.toLocaleString(),      icon: Send,       color: 'text-blue-600',   bg: 'bg-blue-50' },
                { label: 'Delivered',           value: data.summary.total_delivered.toLocaleString(), icon: CheckCheck, color: 'text-green-600',  bg: 'bg-green-50' },
                { label: 'Read',                value: data.summary.total_read.toLocaleString(),      icon: Eye,        color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Delivery Rate',       value: `${data.summary.delivery_rate}%`,              icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="card">
                  <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                    <Icon size={18} className={color} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Billing / conversation data — available after delay */}
          {data.has_conv_data ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Conversations', value: data.summary.total_conversations.toLocaleString(), sub: 'this month',          icon: MessageSquare, color: 'text-blue-600',   bg: 'bg-blue-50' },
                  { label: 'Total Cost',           value: `₹${toINR(data.summary.total_cost).toFixed(2)}`, sub: 'approx. at ₹84/USD', icon: IndianRupee,   color: 'text-red-600',    bg: 'bg-red-50' },
                  { label: 'Free Tier Used',       value: `${data.summary.free_tier_used} / 1000`,          sub: `${data.summary.free_tier_remaining} remaining`, icon: Gift, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Paid Conversations',   value: data.summary.paid_conversations.toLocaleString(), sub: 'beyond free tier',   icon: TrendingUp,    color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map(({ label, value, sub, icon: Icon, color, bg }) => (
                  <div key={label} className="card">
                    <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                      <Icon size={18} className={color} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Free tier progress bar */}
              <div className="card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Free Tier Usage (1,000 conversations/month)</span>
                  <span className="text-sm font-semibold text-gray-900">{freePct}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${freePct >= 100 ? 'bg-red-500' : freePct >= 80 ? 'bg-yellow-500' : 'bg-whatsapp-green'}`}
                    style={{ width: `${freePct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {freePct < 100
                    ? `${data.summary.free_tier_remaining} free conversations left`
                    : `Free tier exhausted — all new conversations are billed`}
                </p>
              </div>
            </>
          ) : (
            <div className="card border border-yellow-200 bg-yellow-50 flex items-start gap-3">
              <Clock size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-800">Billing data not yet available</p>
                <p className="text-yellow-700 mt-0.5">
                  Conversation analytics (cost & category breakdown) updates with a 24–72 hour delay. Check back tomorrow for billing details.
                </p>
              </div>
            </div>
          )}

          {/* Charts row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Daily messages bar */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Daily Messages</h2>
              {data.daily.filter(d => d.sent > 0 || d.delivered > 0).length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No message data for this month</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={data.daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sent"      fill="#3B82F6" name="Sent"      radius={[2, 2, 0, 0]} />
                    <Bar dataKey="delivered" fill="#25D366" name="Delivered" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="read"      fill="#8B5CF6" name="Read"      radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category pie (only if conv data available) */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Conversations by Category</h2>
              {pieData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <Clock size={32} className="text-gray-300 mb-2" />
                  <p className="text-gray-400 text-sm">Category breakdown available after 24–72 hours</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={85} dataKey="value"
                      label={({ name, percent }) => `${name} ${Math.round((percent || 0) * 100)}%`}
                      labelLine={false}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [v, 'Conversations']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Category breakdown table — only if conv data */}
          {data.has_conv_data && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Cost Breakdown by Category</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium text-right">Conversations</th>
                      <th className="pb-3 font-medium text-right">Cost (INR)</th>
                      <th className="pb-3 font-medium text-right">Avg / Conv</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {Object.entries(data.by_category).map(([cat, row]) => (
                      <tr key={cat} className="hover:bg-gray-50">
                        <td className="py-3">
                          <span className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-full" style={{ background: CAT_COLORS[cat] || '#888' }} />
                            {CAT_LABELS[cat] || cat}
                          </span>
                        </td>
                        <td className="py-3 text-right font-medium">{row.conversations.toLocaleString()}</td>
                        <td className="py-3 text-right font-medium">₹{toINR(row.cost).toFixed(2)}</td>
                        <td className="py-3 text-right text-gray-500">
                          {row.conversations > 0 ? `₹${toINR(row.cost / row.conversations).toFixed(4)}` : '—'}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-gray-200 font-semibold">
                      <td className="pt-3">Total</td>
                      <td className="pt-3 text-right">{data.summary.total_conversations.toLocaleString()}</td>
                      <td className="pt-3 text-right">₹{toINR(data.summary.total_cost).toFixed(2)}</td>
                      <td className="pt-3 text-right text-gray-500">
                        {data.summary.total_conversations > 0
                          ? `₹${toINR(data.summary.total_cost / data.summary.total_conversations).toFixed(4)}`
                          : '—'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Daily detail table */}
          {data.daily.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Daily Detail</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium text-right">Sent</th>
                      <th className="pb-3 font-medium text-right">Delivered</th>
                      <th className="pb-3 font-medium text-right">Read</th>
                      {data.has_conv_data && <th className="pb-3 font-medium text-right">Cost (₹)</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.daily.map((d) => (
                      <tr key={d.date} className="hover:bg-gray-50">
                        <td className="py-2">{d.date}</td>
                        <td className="py-2 text-right">{d.sent || '—'}</td>
                        <td className="py-2 text-right">{d.delivered || '—'}</td>
                        <td className="py-2 text-right">{d.read || '—'}</td>
                        {data.has_conv_data && (
                          <td className="py-2 text-right font-medium">₹{toINR(d.cost).toFixed(2)}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
