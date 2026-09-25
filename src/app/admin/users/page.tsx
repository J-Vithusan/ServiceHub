'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminNav } from '@/components/AdminNav';
import { formatDate } from '@/lib/utils';
import {
  Search,
  Users,
  Shield,
  ShieldCheck,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  _count: {
    bookings: number;
  };
}

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/admin/login');
        return;
      }
      loadUsers();
    }
  }, [user, isLoading, router, loadUsers]);

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.toLowerCase().includes(search.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manage Users & Accounts
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
            Directory of registered customers and platform administrators.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 shadow-xs">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition font-medium"
              id="admin-user-search"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {['ALL', 'CUSTOMER', 'ADMIN'].map((rf) => (
              <button
                key={rf}
                onClick={() => setRoleFilter(rf)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  roleFilter === rf
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {rf === 'ALL' ? 'All Roles' : rf}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Card-Based View (< 768px) */}
        <div className="block md:hidden space-y-4">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-xs">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">No accounts found matching filters.</div>
          ) : (
            filteredUsers.map((u) => (
              <div key={u.id} className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-border overflow-hidden">
                      {u.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.avatarUrl} alt={u.name} className="h-full w-full object-cover" />
                      ) : (
                        u.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'ADMIN'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        : 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30'
                    }`}
                  >
                    {u.role === 'ADMIN' ? (
                      <ShieldCheck className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    {u.role}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-secondary/60 border border-border text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="text-foreground font-medium">{u.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="text-foreground font-medium truncate max-w-[200px]">{u.address || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Bookings:</span>
                    <span className="font-bold text-teal-700 dark:text-teal-400">{u._count?.bookings || 0}</span>
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                  <span>Joined: {formatDate(u.createdAt)}</span>
                  <span className="font-mono text-[10px]">ID: {u.id.slice(0, 8)}...</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Users Table (>= 768px) */}
        <div className="hidden md:block rounded-2xl bg-card border border-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-foreground">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800 font-bold">
                <tr>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Contact Phone</th>
                  <th className="px-6 py-4 font-bold">Primary Address</th>
                  <th className="px-6 py-4 font-bold">Total Bookings</th>
                  <th className="px-6 py-4 font-bold text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No accounts found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-teal-700 overflow-hidden flex items-center justify-center text-white font-bold text-xs shrink-0 border border-slate-200 dark:border-slate-700">
                            {u.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={u.avatarUrl}
                                alt={u.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              u.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            u.role === 'ADMIN'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                              : 'bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30'
                          }`}
                        >
                          {u.role === 'ADMIN' ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          <span>{u.role}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {u.phone || <span className="text-slate-400 italic">None</span>}
                      </td>

                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {u.address || <span className="text-slate-400 italic">None</span>}
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {u._count.bookings}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400">
                        {formatDate(u.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
