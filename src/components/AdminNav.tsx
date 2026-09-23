'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  CalendarCheck,
  Users,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export function AdminNav() {
  const pathname = usePathname();

  const links = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Manage Services', href: '/admin/services', icon: Wrench },
    { label: 'Manage Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { label: 'Manage Users', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="w-full border-b border-amber-500/20 bg-slate-950/60 backdrop-blur-md mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 overflow-x-auto gap-4 no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/30 uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Console</span>
            </span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0 hidden md:block">
            <Link
              href="/services"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>Public Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
