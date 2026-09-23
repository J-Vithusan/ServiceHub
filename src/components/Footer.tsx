import React from 'react';
import Link from 'next/link';
import { Wrench, Shield, Clock, Award, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#070a12] text-slate-400 mt-auto">
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Verified Professionals</h4>
                <p className="text-xs text-slate-400 mt-0.5">Every technician is background checked & insured.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Instant Online Booking</h4>
                <p className="text-xs text-slate-400 mt-0.5">Real-time slot availability with automated confirmation.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Satisfaction Guarantee</h4>
                <p className="text-xs text-slate-400 mt-0.5">Not thrilled? We will make it right, guaranteed.</p>
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
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-md">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-xl font-black text-white">
                Service<span className="gradient-text">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The modern marketplace connecting homeowners and businesses with top-tier, licensed service specialists. Fast, transparent, and dependable.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3">Popular Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services?category=home-cleaning" className="hover:text-blue-400 transition">
                  Home Deep Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services?category=plumbing" className="hover:text-blue-400 transition">
                  Emergency Plumbing
                </Link>
              </li>
              <li>
                <Link href="/services?category=electrical" className="hover:text-blue-400 transition">
                  Electrical & Lighting
                </Link>
              </li>
              <li>
                <Link href="/services?category=hvac-climate" className="hover:text-blue-400 transition">
                  HVAC & AC Maintenance
                </Link>
              </li>
              <li>
                <Link href="/services?category=appliance-repair" className="hover:text-blue-400 transition">
                  Appliance Diagnostics
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-blue-400 transition">
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-400 transition">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-400 transition">
                  Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3">Support & Standards</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Need assistance with an existing appointment or custom inquiry? Our support desk is available 7 days a week.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <p className="font-semibold text-white">Direct Line</p>
              <p className="text-slate-400 mt-0.5">+1 (800) 555-HUB1</p>
              <p className="text-slate-400">support@servicehub.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} ServiceHub Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision & passion</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 mx-1" />
            <span>for Modern Service Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
