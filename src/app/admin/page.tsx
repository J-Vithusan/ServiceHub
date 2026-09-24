'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminNav } from '@/components/AdminNav';
import { StatsCard } from '@/components/StatsCard';
import { StatusBadge } from '@/components/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  DollarSign,
  CalendarCheck,
  Wrench,
  Users,
  Clock,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface Metrics {
  totalBookings: number;
  totalRevenue: number;
  activeServicesCount: number;
  totalCustomersCount: number;
  statusBreakdown: {
    PENDING: number;
    CONFIRMED: number;
    COMPLETED: number;
    CANCELLED: number;
  };
}

interface RecentBooking {
  id: string;
  bookingDate: string;
  timeSlot: string;
  totalPrice: number;
  status: string;
  service: {
    name: string;
    price: number;
  };
  user: {
    name: string;
    email: string;
  };
}

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/admin/login');
        return;
      }
      if (user.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }
    }

    async function loadAdminStats() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
          setRecentBookings(data.recentBookings || []);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user && user.role === 'ADMIN') {
      loadAdminStats();
    }
  }, [user, isLoading, router]);

  if (isLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Loading admin metrics...</p>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN' || !metrics) return null;

  return (
    <div className="min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Platform Overview & Analytics</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Real-time operational summary of bookings, customer activity, and catalog health.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/services"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New Service</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Manage Bookings</span>
            </Link>
          </div>
        </div>

        {/* 4 Main KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            change="+18.4% vs last month"
            isPositive={true}
            icon={DollarSign}
            color="emerald"
          />
          <StatsCard
            title="Total Bookings"
            value={metrics.totalBookings}
            change="+12.1% this week"
            isPositive={true}
            icon={CalendarCheck}
            color="teal"
          />
          <StatsCard
            title="Active Services"
            value={metrics.activeServicesCount}
            icon={Wrench}
            color="amber"
          />
          <StatsCard
            title="Registered Customers"
            value={metrics.totalCustomersCount}
            change="+8 new this month"
            isPositive={true}
            icon={Users}
            color="teal"
          />
        </div>

        {/* Status Distribution Summary */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Booking Status Breakdown
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">Pending Review</span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {metrics.statusBreakdown.PENDING}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Needs admin action</span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20">
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase">Confirmed</span>
              <p className="text-2xl font-black text-teal-700 dark:text-teal-400 mt-1">
                {metrics.statusBreakdown.CONFIRMED}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Scheduled for delivery</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">Completed</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {metrics.statusBreakdown.COMPLETED}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Successfully fulfilled</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase">Cancelled</span>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {metrics.statusBreakdown.CANCELLED}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Cancelled by user/admin</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Customer Bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>Manage all bookings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#0f171a] border border-slate-200/90 dark:border-slate-800/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800 font-bold">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">Customer</th>
                    <th className="px-6 py-3.5 font-bold">Service</th>
                    <th className="px-6 py-3.5 font-bold">Appointment</th>
                    <th className="px-6 py-3.5 font-bold">Price</th>
                    <th className="px-6 py-3.5 font-bold">Status</th>
                    <th className="px-6 py-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No bookings found.
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 dark:text-white">{b.user.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{b.user.email}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                          {b.service.name}
                        </td>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                          <p>{formatDate(b.bookingDate)}</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">{b.timeSlot}</p>
                        </td>
                        <td className="px-6 py-4 font-extrabold text-teal-700 dark:text-teal-400">
                          {formatCurrency(b.totalPrice)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href="/admin/bookings"
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-[11px] transition-colors"
                          >
                            Review
                          </Link>
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
    </div>
  );
}
