'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Wrench, Shield, User, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      login(data.user);

      if (data.user.role === 'ADMIN' && redirectPath === '/dashboard') {
        router.push('/admin');
      } else {
        router.push(redirectPath);
      }
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Demo accounts helper
  const handleDemoLogin = async (role: 'ADMIN' | 'CUSTOMER') => {
    if (role === 'ADMIN') {
      setEmail('admin@servicehub.com');
      setPassword('Admin123!');
    } else {
      setEmail('customer@servicehub.com');
      setPassword('Customer123!');
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 shadow-xl dark:shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-linear-to-tr from-teal-700 to-teal-500 items-center justify-center text-white shadow-md shadow-teal-700/20 mb-1">
          <Wrench className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Sign in to manage your appointments or administrative panel
        </p>
      </div>

      {/* Quick Demo Credentials Bar for Evaluators */}
      <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 text-xs space-y-2.5">
        <div className="flex items-center gap-1.5 text-teal-800 dark:text-teal-300 font-bold">
          <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span>Quick Demo Access (One-Click Fill)</span>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => handleDemoLogin('CUSTOMER')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-[11px] border border-teal-200 dark:border-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <User className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>Demo Customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('ADMIN')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-amber-50 dark:bg-amber-500/15 hover:bg-amber-100 dark:hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 font-semibold text-[11px] border border-amber-200 dark:border-amber-500/30 transition-colors shadow-2xs cursor-pointer"
          >
            <Shield className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Demo Admin</span>
          </button>
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
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/10 transition font-medium"
            id="login-email"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Password
            </label>
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/10 transition font-medium"
            id="login-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-sm shadow-teal-700/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          id="login-submit-btn"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 font-medium">
        Don&apos;t have an account yet?{' '}
        <Link href="/register" className="text-teal-700 dark:text-teal-400 hover:underline font-bold">
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-slate-400 text-sm">Loading sign in...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
