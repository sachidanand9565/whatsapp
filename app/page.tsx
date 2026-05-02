import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: '📤',
    title: 'Bulk Campaigns',
    desc: 'Send thousands of WhatsApp messages to your contacts instantly with templates.',
  },
  {
    icon: '🤖',
    title: 'Smart Chatbot',
    desc: 'Automate replies 24/7 with keyword-triggered rules and multi-step flows.',
  },
  {
    icon: '👥',
    title: 'CRM Leads',
    desc: 'Manage your contacts, track status, assign agents, and import via CSV.',
  },
  {
    icon: '📊',
    title: 'Analytics',
    desc: 'Track delivery rates, read rates, and campaign performance in real time.',
  },
  {
    icon: '💬',
    title: 'Live Inbox',
    desc: 'Chat with customers in real time through a WhatsApp Web-style interface.',
  },
  {
    icon: '⚙️',
    title: 'Templates',
    desc: 'Create and manage approved WhatsApp Business message templates.',
  },
];

const stats = [
  { value: '10K+', label: 'Messages Sent Daily' },
  { value: '500+', label: 'Businesses Served' },
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '24/7', label: 'Support Available' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Image src="/logo.svg" alt="SK WEBTECH" width={180} height={50} priority />
          <div className="flex items-center gap-3">
            <Link
              href="/support"
              className="text-sm text-blue-300 hover:text-white transition hidden sm:block"
            >
              Support
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-white/80 hover:text-white transition px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition shadow-lg shadow-blue-900/40"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 text-center relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            WhatsApp Business Platform — Powered by SK WEBTECH
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Grow Your Business
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
              With WhatsApp
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Send bulk campaigns, automate replies, manage leads, and track analytics —
            all from one powerful platform built for modern businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-sky-500 text-white font-bold px-10 py-4 rounded-xl transition shadow-xl shadow-blue-900/40 text-base"
            >
              Start Free Today
            </Link>
            <Link
              href="/login"
              className="border border-white/20 hover:border-white/40 text-white font-bold px-10 py-4 rounded-xl transition hover:bg-white/5 text-base"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/10 bg-white/5">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-extrabold text-white mb-1">{value}</div>
              <div className="text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Everything You Need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
                Scale
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A complete WhatsApp business suite — from messaging to analytics, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-blue-700/50 transition group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">
                  {icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-blue-900/60 to-blue-800/40 border border-blue-700/40 rounded-3xl p-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Join hundreds of businesses already growing with SK WEBTECH's platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-sky-500 hover:opacity-90 text-white font-bold px-10 py-4 rounded-xl transition shadow-xl shadow-blue-900/40"
            >
              Create Free Account
            </Link>
            <Link
              href="/support"
              className="border border-white/20 hover:border-white/40 text-white font-medium px-10 py-4 rounded-xl transition hover:bg-white/5"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-slate-500 text-sm">
        <div className="flex justify-center mb-4">
          <Image src="/logo.svg" alt="SK WEBTECH" width={140} height={40} />
        </div>
        <p className="mb-2">INNOVATE &bull; DEVELOP &bull; ELEVATE</p>
        <p>
          &copy; {new Date().getFullYear()} SK WEBTECH. All rights reserved. &nbsp;|&nbsp;
          <Link href="/support" className="text-blue-400 hover:underline">Support</Link>
        </p>
      </footer>
    </div>
  );
}
