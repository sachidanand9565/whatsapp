'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/hooks/useApi';
import {
  MessageSquare, Users, Megaphone, CheckCircle, BookOpen,
  TrendingUp, Facebook, Settings, RefreshCw, Zap, Phone,
  Copy, ExternalLink, BarChart3, Bot, ChevronRight, Wifi, WifiOff,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

interface Workspace {
  id: number;
  name: string;
  phone_number_id: string;
  waba_id: string;
  plan: string;
  is_active: number;
  verify_token: string;
}

interface Summary {
  total_messages_sent: number;
  delivery_rate: number;
  read_rate: number;
  total_contacts: number;
  new_contacts_today: number;
  active_campaigns: number;
  converted_leads: number;
  messages_failed: number;
}

export default function DashboardPage() {
  const [workspace, setWorkspace]   = useState<Workspace | null>(null);
  const [summary, setSummary]       = useState<Summary | null>(null);
  const [chartData, setChartData]   = useState<{ date: string; sent: number; received: number }[]>([]);
  const [loading, setLoading]       = useState(true);
  const [wsLoading, setWsLoading]   = useState(true);
  const [userRole, setUserRole]     = useState('');

  const isConnected = !!(workspace?.phone_number_id && workspace?.waba_id);

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole') || '');

    apiFetch('/api/workspace').then((r) => {
      if (r?.data) setWorkspace(r.data);
    }).finally(() => setWsLoading(false));

    apiFetch('/api/analytics').then((r) => {
      if (r?.data) {
        setSummary(r.data.summary);
        setChartData(r.data.charts.daily_messages);
      }
    }).finally(() => setLoading(false));
  }, []);

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  }

  const planColor: Record<string, string> = {
    FREE:       'bg-gray-100 text-gray-600',
    PRO:        'bg-blue-100 text-blue-700',
    ENTERPRISE: 'bg-purple-100 text-purple-700',
  };
  const plan = (workspace?.plan || 'FREE').toUpperCase();

  return (
    <div className="space-y-5">

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-gray-900 truncate">
            {workspace?.name || 'Dashboard'}
          </h1>
        </div>

        {/* API Status pill */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
          isConnected
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {isConnected
            ? <><Wifi size={12} className="text-green-500" /> WA API: LIVE</>
            : <><WifiOff size={12} /> WA API: NOT CONNECTED</>}
        </div>

        {/* Plan badge */}
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${planColor[plan] || planColor.FREE}`}>
          {plan}
        </span>

        <Link href="/settings"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          <Settings size={13} /> Settings
        </Link>
      </div>

      {/* ── Main grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── LEFT (2/3) ────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-5">

          {/* API Status card */}
          <div className={`rounded-xl border p-5 ${
            isConnected
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
              : 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200'
          }`}>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">WhatsApp Business API</p>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${
                  isConnected ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-white' : 'bg-white'} animate-pulse`} />
                  {isConnected ? 'LIVE' : 'NOT CONNECTED'}
                </div>
              </div>

              {isConnected && (
                <>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Quality Rating</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
                      High
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Messaging Quota</p>
                    <p className="text-sm font-bold text-gray-800">Unlimited</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Phone Number</p>
                    <p className="text-sm font-mono font-bold text-gray-800">{workspace?.phone_number_id}</p>
                  </div>
                </>
              )}

              {!isConnected && (
                <div className="flex items-center gap-3 ml-auto">
                  <Link href="/settings"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                    <Facebook size={15} /> Connect WhatsApp
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Stats grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card h-24 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Messages Sent',    value: summary.total_messages_sent, icon: MessageSquare, color: 'text-blue-600',   bg: 'bg-blue-50' },
                { label: 'Total Contacts',   value: summary.total_contacts,       icon: Users,         color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Delivery Rate',    value: `${summary.delivery_rate}%`,  icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50' },
                { label: 'Active Campaigns', value: summary.active_campaigns,     icon: Megaphone,     color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="card flex items-center gap-3 p-4">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={color} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-tight">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 size={16} className="text-whatsapp-teal" /> Messages — Last 7 Days
              </h2>
              <button onClick={() => apiFetch('/api/analytics').then((r) => r?.data && setChartData(r.data.charts.daily_messages))}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>
            {chartData.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-10">No messages yet. Send your first campaign!</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="sent"     name="Sent"     fill="#25D366" radius={[4,4,0,0]} />
                  <Bar dataKey="received" name="Received" fill="#128C7E" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'New Campaign',  href: '/campaigns',  icon: Megaphone, desc: 'Send bulk WhatsApp messages',   color: 'text-orange-500', bg: 'bg-orange-50' },
              { title: 'Add Contacts',  href: '/contacts',   icon: Users,     desc: 'Import CSV or add manually',    color: 'text-purple-500', bg: 'bg-purple-50' },
              { title: 'Setup Chatbot', href: '/chatbot',    icon: Bot,       desc: 'Automate replies with keywords', color: 'text-blue-500',   bg: 'bg-blue-50' },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="card hover:shadow-md transition-all cursor-pointer group flex items-center gap-3 p-4">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <item.icon size={18} className={item.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-whatsapp-teal transition-colors">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-whatsapp-teal transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR (1/3) ───────────────────────────── */}
        <div className="space-y-5">

          {/* Profile card */}
          <div className="card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-whatsapp-teal flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {workspace?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">{workspace?.name || '—'}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${planColor[plan] || planColor.FREE}`}>
                  {plan}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              {workspace?.phone_number_id ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Phone Number ID</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono text-gray-700">{workspace.phone_number_id.slice(0,8)}…</span>
                    <button onClick={() => copyText(workspace.phone_number_id)} className="text-gray-400 hover:text-gray-600">
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              ) : null}

              {workspace?.waba_id ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={13} className="text-gray-400" />
                    <span className="text-xs text-gray-500">WABA ID</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono text-gray-700">{workspace.waba_id.slice(0,8)}…</span>
                    <button onClick={() => copyText(workspace.waba_id)} className="text-gray-400 hover:text-gray-600">
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              ) : null}

              {workspace?.verify_token ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={13} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Verify Token</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono text-gray-700">{workspace.verify_token.slice(0,8)}…</span>
                    <button onClick={() => copyText(workspace.verify_token)} className="text-gray-400 hover:text-gray-600">
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <Link href="/settings"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <ExternalLink size={13} /> View Full Settings
            </Link>
          </div>

          {/* Connect via Facebook */}
          <div className="card space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Facebook size={15} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {isConnected ? 'WhatsApp Connected' : 'Connect WhatsApp'}
                </p>
                <p className="text-xs text-gray-400">
                  {isConnected ? 'Your account is live' : 'Link your WhatsApp Business Account'}
                </p>
              </div>
            </div>

            {isConnected ? (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-xs font-semibold text-green-700">LIVE — Receiving messages</span>
              </div>
            ) : (
              <Link href="/settings"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                <Facebook size={15} /> Connect Now
              </Link>
            )}
          </div>

          {/* More stats */}
          {summary && (
            <div className="card space-y-3">
              <p className="text-sm font-semibold text-gray-900">Performance</p>
              {[
                { label: 'Read Rate',         value: `${summary.read_rate}%`,      icon: BookOpen,   color: 'text-yellow-500' },
                { label: 'New Contacts Today', value: summary.new_contacts_today,   icon: Users,      color: 'text-purple-500' },
                { label: 'Converted Leads',   value: summary.converted_leads,      icon: TrendingUp, color: 'text-teal-500' },
                { label: 'Messages Failed',   value: summary.messages_failed,      icon: MessageSquare, color: 'text-red-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={13} className={color} />
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Agent notice */}
          {userRole === 'agent' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-700">
              No campaigns assigned yet. Ask your admin to assign a campaign.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
