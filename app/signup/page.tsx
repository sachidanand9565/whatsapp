'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', workspaceName: '' });
  const [loading, setLoading] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Signup failed'); return; }
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('workspaceId', String(data.data.workspaceId));
      toast.success('Account created! Welcome 🎉');
      setTimeout(() => { window.location.href = '/dashboard'; }, 500);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { label: 'Full Name',      name: 'name',          type: 'text',     placeholder: 'John Doe' },
    { label: 'Email Address',  name: 'email',         type: 'email',    placeholder: 'you@company.com' },
    { label: 'Password',       name: 'password',      type: 'password', placeholder: 'Min 8 characters' },
    { label: 'Business Name',  name: 'workspaceName', type: 'text',     placeholder: 'Acme Corp' },
  ];

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-[#0d1f3c] border border-white/10 rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image src="/logo.svg" alt="SK WEBTECH" width={200} height={56} priority />
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-1">Create Account</h1>
          <p className="text-slate-400 text-sm text-center mb-8">Start sending WhatsApp campaigns today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{f.label}</label>
                <input
                  type={f.type} name={f.name} required
                  value={form[f.name as keyof typeof form]}
                  onChange={onChange}
                  placeholder={f.placeholder}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            ))}
            <button
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-sky-500 text-white font-semibold py-3 rounded-lg transition shadow-lg shadow-blue-900/40 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating account…' : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 font-medium hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-sm text-slate-500 mt-2">
            <Link href="/support" className="hover:text-slate-300 transition">Need help? Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
