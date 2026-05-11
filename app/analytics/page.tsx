'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/hooks/useApi';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

interface Summary {
  total_messages_sent:     number;
  total_messages_received: number;
  delivery_rate:           number;
  read_rate:               number;
  total_contacts:          number;
  new_contacts_today:      number;
  opted_in_contacts:       number;
  active_campaigns:        number;
  converted_leads:         number;
  messages_failed:         number;
}

interface MetaSummary {
  total_sent:          number;
  total_delivered:     number;
  delivery_rate:       number;
  total_conversations: number;
  total_cost_usd:      number;
}
interface MetaMsgPoint  { date: string; sent: number; delivered: number; }
interface MetaConvPoint { date: string; conversations: number; cost: number; }

const COLORS = ['#25D366', '#128C7E', '#FFB300', '#EF4444'];

function toLocalDate(d: Date) { return d.toISOString().slice(0, 10); }
function todayStr()     { return toLocalDate(new Date()); }
function daysAgoStr(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return toLocalDate(d); }

const PRESETS = [
  { label: 'Today',    s: () => todayStr(),      e: () => todayStr() },
  { label: 'Last 7d',  s: () => daysAgoStr(6),   e: () => todayStr() },
  { label: 'Last 30d', s: () => daysAgoStr(29),  e: () => todayStr() },
  { label: 'Last 90d', s: () => daysAgoStr(89),  e: () => todayStr() },
];

export default function AnalyticsPage() {
  const [summary, setSummary]   = useState<Summary | null>(null);
  const [daily, setDaily]       = useState<{ date: string; sent: number; received: number }[]>([]);
  const [loading, setLoading]   = useState(true);
  const [startDate, setStartDate] = useState(() => daysAgoStr(29));
  const [endDate,   setEndDate]   = useState(() => todayStr());

  // Meta analytics state
  const [metaSummary,  setMetaSummary]  = useState<MetaSummary | null>(null);
  const [metaMsg,      setMetaMsg]      = useState<MetaMsgPoint[]>([]);
  const [metaConv,     setMetaConv]     = useState<MetaConvPoint[]>([]);
  const [metaLoading,  setMetaLoading]  = useState(false);
  const [metaError,    setMetaError]    = useState('');

  useEffect(() => {
    if (!startDate || !endDate) return;
    setLoading(true);
    apiFetch(`/api/analytics?start_date=${startDate}&end_date=${endDate}`).then((r) => {
      if (r?.data) {
        setSummary(r.data.summary);
        setDaily(r.data.charts.daily_messages);
      }
    }).finally(() => setLoading(false));

    // Fetch Meta analytics in parallel
    setMetaLoading(true);
    setMetaError('');
    apiFetch(`/api/analytics/meta?start_date=${startDate}&end_date=${endDate}`).then((r) => {
      if (r?.data) {
        setMetaSummary(r.data.summary);
        setMetaMsg(r.data.messaging);
        setMetaConv(r.data.conversations);
      } else if (r?.error) {
        setMetaError(r.error);
      }
    }).catch(() => setMetaError('Meta API error'))
      .finally(() => setMetaLoading(false));
  }, [startDate, endDate]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-whatsapp-green border-t-transparent rounded-full" />
    </div>
  );

  const pieData = summary ? [
    { name: 'Read',      value: summary.read_rate },
    { name: 'Delivered', value: Math.max(0, summary.delivery_rate - summary.read_rate) },
    { name: 'Sent',      value: Math.max(0, 100 - summary.delivery_rate) },
    { name: 'Failed',    value: summary.messages_failed },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header + date filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
      </div>

      {/* Date filter bar */}
      <div className="card flex flex-wrap items-center gap-3">
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => {
            const ps = p.s(), pe = p.e();
            const active = startDate === ps && endDate === pe;
            return (
              <button key={p.label} onClick={() => { setStartDate(ps); setEndDate(pe); }}
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

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summary && [
          { label: 'Messages Sent',    value: summary.total_messages_sent,     sub: `${summary.total_messages_received} received` },
          { label: 'Delivery Rate',    value: `${summary.delivery_rate}%`,     sub: 'of sent messages' },
          { label: 'Read Rate',        value: `${summary.read_rate}%`,         sub: 'of sent messages' },
          { label: 'Total Contacts',   value: summary.total_contacts,          sub: `+${summary.new_contacts_today} today` },
          { label: 'Opted-in',         value: summary.opted_in_contacts,       sub: 'WhatsApp consent' },
          { label: 'Active Campaigns', value: summary.active_campaigns,        sub: 'running now' },
          { label: 'Converted Leads',  value: summary.converted_leads,         sub: 'total conversions' },
          { label: 'Failed Messages',  value: summary.messages_failed,         sub: 'need attention' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="card">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily messages chart */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">
            Messages — {startDate === endDate ? startDate : `${startDate} to ${endDate}`}
          </h2>
          {daily.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sent"     name="Sent"     fill="#25D366" radius={[4, 4, 0, 0]} />
                <Bar dataKey="received" name="Received" fill="#128C7E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Message status pie */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Message Status Breakdown</h2>
          {pieData.every((d) => d.value === 0) ? (
            <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Meta WhatsApp Analytics Section ─────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900">Meta WhatsApp Analytics</h2>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Official API</span>
        </div>

        {metaLoading && (
          <div className="card flex items-center justify-center h-32">
            <div className="animate-spin w-6 h-6 border-4 border-whatsapp-green border-t-transparent rounded-full" />
          </div>
        )}

        {!metaLoading && metaError && (
          <div className="card bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800 font-medium">Meta Analytics unavailable</p>
            <p className="text-xs text-yellow-600 mt-1">{metaError}</p>
            <p className="text-xs text-gray-500 mt-2">Make sure your WABA ID and Access Token are set in Settings.</p>
          </div>
        )}

        {!metaLoading && metaSummary && (
          <>
            {/* Meta KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Sent (Meta)',         value: metaSummary.total_sent.toLocaleString(),          color: 'text-green-600' },
                { label: 'Delivered (Meta)',     value: metaSummary.total_delivered.toLocaleString(),     color: 'text-blue-600'  },
                { label: 'Delivery Rate',        value: `${metaSummary.delivery_rate}%`,                  color: 'text-purple-600'},
                { label: 'Conversations',        value: metaSummary.total_conversations.toLocaleString(), color: 'text-orange-600'},
                { label: 'Total Cost (USD)',     value: `$${metaSummary.total_cost_usd}`,                 color: 'text-red-600'   },
              ].map(({ label, value, color }) => (
                <div key={label} className="card">
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-sm text-gray-600 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Sent vs Delivered chart */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Sent vs Delivered (Meta)</h3>
                {metaMsg.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No data for this period</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={metaMsg}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sent"      name="Sent"      fill="#25D366" radius={[4,4,0,0]} />
                      <Bar dataKey="delivered" name="Delivered" fill="#128C7E" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Conversations chart */}
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Conversations (Meta)</h3>
                {metaConv.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No data for this period</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={metaConv}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left"  tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left"  type="monotone" dataKey="conversations" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Conversations" />
                      <Line yAxisId="right" type="monotone" dataKey="cost"          stroke="#ef4444" strokeWidth={2} dot={false} name="Cost (USD)" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
