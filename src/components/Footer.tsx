import React from 'react';
import Link from 'next/link';
import { Wrench, Shield, Clock, Award, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070b0c] text-slate-600 dark:text-slate-400 mt-auto transition-colors duration-200">
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 py-8 bg-slate-50/60 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-700 dark:bg-teal-500/10 dark:border-teal-500/20 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">100% Verified Specialists</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Every contractor is licensed, background-checked & insured.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Real-Time Dispatch</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Immediate slot confirmation with arrival window guarantees.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Craftsmanship Guarantee</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">30-day warranty on all completed domestic & trade services.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-800 to-teal-500 flex items-center justify-center text-white shadow-sm">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                Service<span className="text-amber-600 dark:text-amber-400">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The high-trust marketplace connecting homeowners and facility managers with top-tier licensed trade specialists.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Platform Active & Dispatched</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Popular Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services?category=home-cleaning" className="hover:text-teal-700 dark:hover:text-teal-400 transition">
                  Home Deep Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services?category=plumbing" className="hover:text-teal-700 dark:hover:text-teal-400 transition">
                  Emergency Plumbing
                </Link>
              </li>
              <li>
                <Link href="/services?category=electrical" className="hover:text-teal-700 dark:hover:text-teal-400 transition">
                  Electrical & Lighting
                </Link>
              </li>
              <li>
                <Link href="/services?category=hvac-climate" className="hover:text-teal-700 dark:hover:text-teal-400 transition">
                  HVAC & AC Maintenance
                </Link>
              </li>
              <li>
                <Link href="/services?category=appliance-repair" className="hover:text-teal-700 dark:hover:text-teal-400 transition">
                  Appliance Diagnostics
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-teal-700 dark:hover:text-teal-400 transition">
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-teal-700 dark:hover:text-teal-400 transition">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-teal-700 dark:hover:text-teal-400 transition">
                  Register Account
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-700 dark:hover:text-amber-400 transition">
                  Admin Portal Gateway
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">Support & Standards</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Need assistance with an appointment or custom commercial contract?
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
              <p className="font-semibold text-slate-900 dark:text-white">Direct Dispatch</p>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">+1 (800) 555-HUB1</p>
              <p className="text-slate-600 dark:text-slate-400">dispatch@servicehub.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} ServiceHub Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with architectural precision</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 mx-1" />
            <span>for Modern Service Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
