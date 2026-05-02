import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, Clock, HelpCircle, Zap, Shield, Users } from 'lucide-react';

const faqs = [
  {
    q: 'How do I connect my WhatsApp Business account?',
    a: 'Go to Settings in your dashboard and enter your Meta API credentials (Access Token, Phone Number ID, and WABA ID). Follow the Meta Business setup guide to get these credentials.',
  },
  {
    q: 'How do I send a bulk campaign?',
    a: 'Create a message template first (requires Meta approval), then go to Campaigns → New Campaign, select your template and target contacts, and launch.',
  },
  {
    q: 'Can I import contacts via CSV?',
    a: 'Yes. Go to Contacts → Import and upload a CSV file with columns: name, phone, email, city, source. Duplicate numbers are handled automatically.',
  },
  {
    q: 'How does the chatbot work?',
    a: 'The chatbot uses keyword-triggered rules. When an incoming message matches a rule (exact, contains, starts_with, or any), it sends the configured auto-reply.',
  },
  {
    q: 'What message types are supported?',
    a: 'Text, images, documents, videos, audio, templates, interactive messages, reactions, location, and contact cards.',
  },
  {
    q: 'How do I add team members?',
    a: 'Admin users can go to Agents in the sidebar to invite and manage team members with different roles (admin, manager, agent).',
  },
];

const supportOptions = [
  {
    icon: Phone,
    title: 'Call Us',
    value: '+91 6386103750',
    desc: 'Mon–Sat, 9 AM – 7 PM IST',
    href: 'tel:+916386103750',
    color: 'bg-blue-600/20 text-blue-400',
    btnText: 'Call Now',
    btnStyle: 'bg-blue-600 hover:bg-blue-500 text-white',
  },
  {
    icon: Mail,
    title: 'Email Support',
    value: 'sachi274406@gmail.com',
    desc: 'We reply within 24 hours',
    href: 'mailto:sachi274406@gmail.com',
    color: 'bg-sky-600/20 text-sky-400',
    btnText: 'Send Email',
    btnStyle: 'bg-sky-600 hover:bg-sky-500 text-white',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Chat',
    value: '+91 6386103750',
    desc: 'Chat directly on WhatsApp',
    href: 'https://wa.me/916386103750',
    color: 'bg-green-600/20 text-green-400',
    btnText: 'Chat on WhatsApp',
    btnStyle: 'bg-green-600 hover:bg-green-500 text-white',
  },
];

const highlights = [
  { icon: Clock,   title: 'Fast Response',   desc: 'Average response time under 2 hours during business hours.' },
  { icon: Zap,     title: 'Expert Team',     desc: 'Our team knows the platform inside out and resolves issues quickly.' },
  { icon: Shield,  title: 'Secure & Private', desc: 'Your data and queries are handled with full confidentiality.' },
  { icon: Users,   title: 'Dedicated Support', desc: 'Enterprise customers get a dedicated account manager.' },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.svg" alt="SK WEBTECH" width={180} height={50} priority />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition px-4 py-2">
              Sign In
            </Link>
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition shadow-lg shadow-blue-900/40">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <HelpCircle size={12} />
            Support Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            How Can We{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
              Help You?
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Our team is ready to assist you. Reach us by phone, email, or WhatsApp — we&apos;re here to make sure your experience is seamless.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportOptions.map(({ icon: Icon, title, value, desc, href, color, btnText, btnStyle }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-blue-700/50 transition">
              <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-4`}>
                <Icon size={28} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
              <p className="text-blue-300 font-medium text-sm mb-1 break-all">{value}</p>
              <p className="text-slate-500 text-xs mb-5">{desc}</p>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold text-center transition ${btnStyle}`}
              >
                {btnText}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Info Banner */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-900/60 to-blue-800/40 border border-blue-700/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">SK WEBTECH Support Team</h3>
            <p className="text-slate-400 text-sm">INNOVATE &bull; DEVELOP &bull; ELEVATE</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 text-sm">
            <a href="tel:+916386103750" className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg transition text-white">
              <Phone size={15} className="text-blue-400" />
              +91 6386103750
            </a>
            <a href="mailto:sachi274406@gmail.com" className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg transition text-white">
              <Mail size={15} className="text-sky-400" />
              sachi274406@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* Why Our Support */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
              SK WEBTECH Support
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-blue-700/50 transition">
                <Icon size={24} className="text-blue-400 mb-3" />
                <h4 className="text-white font-semibold mb-1">{title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-blue-700/40 transition">
                <h4 className="text-white font-semibold mb-2 flex items-start gap-2">
                  <HelpCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  {q}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed pl-6">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-blue-900/60 to-blue-800/40 border border-blue-700/40 rounded-3xl p-10">
          <h2 className="text-2xl font-bold mb-3">Still Have Questions?</h2>
          <p className="text-slate-300 mb-6">
            Our support team is just a message away. Don&apos;t hesitate to reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:sachi274406@gmail.com"
              className="bg-gradient-to-r from-blue-600 to-sky-500 hover:opacity-90 text-white font-bold px-8 py-3 rounded-xl transition shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2"
            >
              <Mail size={16} />
              Email Us
            </a>
            <a
              href="tel:+916386103750"
              className="border border-white/20 hover:border-white/40 text-white font-medium px-8 py-3 rounded-xl transition hover:bg-white/5 flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              Call +91 6386103750
            </a>
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
          <Link href="/" className="text-blue-400 hover:underline">Home</Link>
        </p>
      </footer>
    </div>
  );
}
