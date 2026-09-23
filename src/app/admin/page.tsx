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
        <p className="text-slate-400 text-sm">Loading admin metrics...</p>
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
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Platform Overview & Analytics</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time operational summary of bookings, customer activity, and catalog health.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/services"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-500/20 transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New Service</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs uppercase tracking-wider text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
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
            color="blue"
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
            color="violet"
          />
        </div>

        {/* Status Distribution Summary */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">
            Booking Status Breakdown
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-xs font-bold text-amber-300 uppercase">Pending Review</span>
              <p className="text-2xl font-black text-amber-400 mt-1">
                {metrics.statusBreakdown.PENDING}
              </p>
              <span className="text-[11px] text-slate-400">Needs admin action</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <span className="text-xs font-bold text-blue-300 uppercase">Confirmed</span>
              <p className="text-2xl font-black text-blue-400 mt-1">
                {metrics.statusBreakdown.CONFIRMED}
              </p>
              <span className="text-[11px] text-slate-400">Scheduled for delivery</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-300 uppercase">Completed</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {metrics.statusBreakdown.COMPLETED}
              </p>
              <span className="text-[11px] text-slate-400">Successfully fulfilled</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-xs font-bold text-rose-300 uppercase">Cancelled</span>
              <p className="text-2xl font-black text-rose-400 mt-1">
                {metrics.statusBreakdown.CANCELLED}
              </p>
              <span className="text-[11px] text-slate-400">Cancelled by user/admin</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Customer Bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Manage all bookings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">Customer</th>
                    <th className="px-6 py-3.5 font-bold">Service</th>
                    <th className="px-6 py-3.5 font-bold">Appointment</th>
                    <th className="px-6 py-3.5 font-bold">Price</th>
                    <th className="px-6 py-3.5 font-bold">Status</th>
                    <th className="px-6 py-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No bookings found.
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4">
                          <p className="font-bold text-white">{b.user.name}</p>
                          <p className="text-[11px] text-slate-400">{b.user.email}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-200">
                          {b.service.name}
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          <p>{formatDate(b.bookingDate)}</p>
                          <p className="text-[11px] text-slate-500">{b.timeSlot}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-400">
                          {formatCurrency(b.totalPrice)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href="/admin/bookings"
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-[11px] transition"
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
