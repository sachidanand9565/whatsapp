'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Login failed'); return; }
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('workspaceId', String(data.data.workspaceId));
      localStorage.setItem('userRole', data.data.user.role);
      localStorage.setItem('userName', data.data.user.name);
      localStorage.setItem('workspaces', JSON.stringify(data.data.workspaces || []));
      window.location.href = '/dashboard';
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-8">
            <Image src="/logo.png" alt="SK WEBTECH" width={160} height={160} priority className="h-36 w-auto mx-auto" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Welcome Back</h1>
          <p className="text-slate-400 text-sm text-center mb-8">Sign in to your SK WEBTECH account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 rounded-lg transition shadow-lg shadow-green-900/40 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-green-400 font-medium hover:underline">Sign up free</Link>
          </p>
          <p className="text-center text-sm text-slate-500 mt-2">
            <Link href="/support" className="hover:text-slate-300 transition">Need help? Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
