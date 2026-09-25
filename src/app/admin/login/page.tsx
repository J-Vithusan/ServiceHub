'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@servicehub.com');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      if (data.user.role !== 'ADMIN') {
        throw new Error('Access denied: You do not have administrator permissions.');
      }

      login(data.user);
      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during admin sign-in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#0f171a] border border-amber-200 dark:border-amber-500/30 shadow-xl dark:shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-linear-to-tr from-amber-600 to-yellow-500 items-center justify-center text-white shadow-md shadow-amber-500/25 mb-1">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Administrator Portal</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Secure administrative console for service, booking, and user management
          </p>
        </div>

        {/* Quick autofill note */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Pre-filled with default Admin demo credentials</span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mono-index text-[11px] font-bold text-foreground mb-1.5">
              Admin Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
              id="admin-email-input"
            />
          </div>

          <div>
            <label className="block mono-index text-[11px] font-bold text-foreground mb-1.5">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-medium"
              id="admin-password-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] py-3 rounded-xl font-bold text-sm text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            id="admin-submit-btn"
          >
            <Lock className="h-4 w-4" />
            <span>{loading ? 'Authenticating...' : 'Access Admin Dashboard'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 font-medium">
          Looking for customer login?{' '}
          <Link href="/login" className="text-teal-700 dark:text-teal-400 hover:underline font-bold">
            Switch to customer sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
