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
          <h1 className="text-3xl font-black text-white tracking-tight">
            Manage Users & Accounts
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Directory of registered customers and platform administrators.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              id="admin-user-search"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {['ALL', 'CUSTOMER', 'ADMIN'].map((rf) => (
              <button
                key={rf}
                onClick={() => setRoleFilter(rf)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  roleFilter === rf
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {rf === 'ALL' ? 'All Roles' : rf}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Contact Phone</th>
                  <th className="px-6 py-4 font-bold">Primary Address</th>
                  <th className="px-6 py-4 font-bold">Total Bookings</th>
                  <th className="px-6 py-4 font-bold text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
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
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center text-white font-bold text-xs shrink-0 border border-slate-700">
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
                            <p className="font-bold text-white text-sm">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            u.role === 'ADMIN'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
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

                      <td className="px-6 py-4 text-slate-300">
                        {u.phone || <span className="text-slate-500 italic">None</span>}
                      </td>

                      <td className="px-6 py-4 text-slate-300 max-w-xs truncate">
                        {u.address || <span className="text-slate-500 italic">None</span>}
                      </td>

                      <td className="px-6 py-4 font-bold text-white">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700">
                          {u._count.bookings}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right text-slate-400">
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
