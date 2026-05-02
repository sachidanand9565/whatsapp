import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, Clock, HelpCircle, Zap, Shield, Users } from 'lucide-react';

const faqs = [
  { q: 'How do I connect my WhatsApp Business account?', a: 'Go to Settings in your dashboard and enter your Meta API credentials (Access Token, Phone Number ID, and WABA ID). Follow the Meta Business setup guide to get these credentials.' },
  { q: 'How do I send a bulk campaign?', a: 'Create a message template first (requires Meta approval), then go to Campaigns → New Campaign, select your template and target contacts, and launch.' },
  { q: 'Can I import contacts via CSV?', a: 'Yes. Go to Contacts → Import and upload a CSV file with columns: name, phone, email, city, source. Duplicate numbers are handled automatically.' },
  { q: 'How does the chatbot work?', a: 'The chatbot uses keyword-triggered rules. When an incoming message matches a rule (exact, contains, starts_with, or any), it sends the configured auto-reply.' },
  { q: 'What message types are supported?', a: 'Text, images, documents, videos, audio, templates, interactive messages, reactions, location, and contact cards.' },
  { q: 'How do I add team members?', a: 'Admin users can go to Agents in the sidebar to invite and manage team members with different roles (admin, manager, agent).' },
];

const supportOptions = [
  { icon: Phone,         title: 'Call Us',        value: '+91 6386103750',        desc: 'Mon–Sat, 9 AM – 7 PM IST',  href: 'tel:+916386103750',            iconBg: 'bg-green-100',   iconColor: 'text-green-600', btnText: 'Call Now',          btnStyle: 'bg-green-600 hover:bg-green-700 text-white' },
  { icon: Mail,          title: 'Email Support',  value: 'sachi274406@gmail.com', desc: 'We reply within 24 hours',   href: 'mailto:sachi274406@gmail.com', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', btnText: 'Send Email',      btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  { icon: MessageCircle, title: 'WhatsApp Chat',  value: '+91 6386103750',        desc: 'Chat directly on WhatsApp', href: 'https://wa.me/916386103750',   iconBg: 'bg-green-50',    iconColor: 'text-green-500', btnText: 'Chat on WhatsApp', btnStyle: 'bg-green-500 hover:bg-green-600 text-white' },
];

const highlights = [
  { icon: Clock,  title: 'Fast Response',    desc: 'Average response time under 2 hours during business hours.' },
  { icon: Zap,    title: 'Expert Team',      desc: 'Our team knows the platform inside out and resolves issues quickly.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data and queries are handled with full confidentiality.' },
  { icon: Users,  title: 'Dedicated Support',desc: 'Enterprise customers get a dedicated account manager.' },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="SK WEBTECH" width={160} height={160} priority className="h-16 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-green-600 transition px-4 py-2">Sign In</Link>
            <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition shadow-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 text-center bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <HelpCircle size={12} /> Support Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gray-900">
            How Can We{' '}
            <span className="text-green-600">Help You?</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Our team is ready to assist you. Reach us by phone, email, or WhatsApp — we&apos;re here to make sure your experience is seamless.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportOptions.map(({ icon: Icon, title, value, desc, href, iconBg, iconColor, btnText, btnStyle }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-green-200 transition">
              <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-4`}>
                <Icon size={26} className={iconColor} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-green-600 font-medium text-sm mb-1 break-all">{value}</p>
              <p className="text-gray-400 text-xs mb-5">{desc}</p>
              <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold text-center transition ${btnStyle}`}>
                {btnText}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Info Banner */}
      <section className="py-6 px-4">
        <div className="max-w-5xl mx-auto bg-green-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-0.5">SK WEBTECH Support Team</h3>
            <p className="text-green-100 text-sm">INNOVATE &bull; DEVELOP &bull; ELEVATE</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 text-sm">
            <a href="tel:+916386103750" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition text-white font-medium">
              <Phone size={15} /> +91 6386103750
            </a>
            <a href="mailto:sachi274406@gmail.com" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition text-white font-medium">
              <Mail size={15} /> sachi274406@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* Why Our Support */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose <span className="text-green-600">SK WEBTECH Support</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-green-200 transition">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={20} className="text-green-600" />
                </div>
                <h4 className="text-gray-900 font-semibold mb-1">{title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:border-green-200 transition">
                <h4 className="text-gray-900 font-semibold mb-2 flex items-start gap-2">
                  <HelpCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />{q}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed pl-6">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-green-50">
        <div className="max-w-3xl mx-auto text-center bg-white border border-green-100 rounded-3xl p-10 shadow-sm">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Still Have Questions?</h2>
          <p className="text-gray-500 mb-6">Our support team is just a message away.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:sachi274406@gmail.com" className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2">
              <Mail size={16} /> Email Us
            </a>
            <a href="tel:+916386103750" className="border-2 border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-600 font-medium px-8 py-3 rounded-xl transition flex items-center justify-center gap-2">
              <Phone size={16} /> Call +91 6386103750
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="SK WEBTECH" width={160} height={160} className="h-20 w-auto" />
          <div className="flex items-center gap-3 text-xs text-gray-400 font-medium tracking-widest">
            <span>INNOVATE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            <span>DEVELOP</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            <span>ELEVATE</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/" className="hover:text-green-600 transition">Home</Link>
            <span className="text-gray-300">|</span>
            <Link href="/login" className="hover:text-green-600 transition">Sign In</Link>
            <span className="text-gray-300">|</span>
            <Link href="/signup" className="hover:text-green-600 transition">Get Started</Link>
          </div>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} SK WEBTECH. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
