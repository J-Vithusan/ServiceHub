import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ServiceCard } from '@/components/ServiceCard';
import { Prisma } from '@prisma/client';
import {
  Wrench,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Star,
  CheckCircle2,
  Users,
  CalendarCheck,
  Award,
} from 'lucide-react';

export const revalidate = 0; // Dynamic data

export type LandingCategory = Prisma.CategoryGetPayload<{
  include: {
    _count: {
      select: { services: true };
    };
  };
}>;

export type LandingService = Prisma.ServiceGetPayload<{
  include: {
    category: true;
  };
}>;

interface LandingData {
  categories: LandingCategory[];
  featuredServices: LandingService[];
  bookingCount: number;
  servicesCount: number;
  customersCount: number;
}

async function getLandingData(): Promise<LandingData> {
  try {
    const [categories, featuredServices, stats] = await Promise.all([
      prisma.category.findMany({
        take: 6,
        include: {
          _count: {
            select: { services: true },
          },
        },
      }),
      prisma.service.findMany({
        where: { status: 'ACTIVE' },
        take: 6,
        include: {
          category: true,
        },
        orderBy: { price: 'asc' },
      }),
      Promise.all([
        prisma.booking.count(),
        prisma.service.count({ where: { status: 'ACTIVE' } }),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
      ]),
    ]);

    return {
      categories,
      featuredServices,
      bookingCount: stats[0] || 150,
      servicesCount: stats[1] || 12,
      customersCount: stats[2] || 80,
    };
  } catch (error) {
    console.error('Landing page data fetch fallback:', error);
    return {
      categories: [],
      featuredServices: [],
      bookingCount: 150,
      servicesCount: 12,
      customersCount: 80,
    };
  }
}

export default async function HomePage() {
  const { categories, featuredServices, bookingCount, servicesCount, customersCount } =
    await getLandingData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Next-Generation Home & Commercial Booking</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Verified Services On Demand,{' '}
              <span className="gradient-text">Booked in Seconds.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              From licensed plumbers and master electricians to meticulous deep cleaners,
              ServiceHub connects you with vetted professionals backed by real-time scheduling
              and a 100% satisfaction guarantee.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Browse All Services</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-300 bg-slate-900/80 hover:bg-slate-800 hover:text-white border border-slate-700 transition"
              >
                <span>Sign In to Your Account</span>
              </Link>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-sky-400" />
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>4.9 / 5 Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="border-y border-slate-800 bg-slate-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-black text-white">{bookingCount}+</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mt-1">
                Completed Bookings
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-blue-400">{servicesCount}+</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mt-1">
                Active Services
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-sky-400">{customersCount}+</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mt-1">
                Happy Customers
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-emerald-400">99.4%</p>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mt-1">
                Satisfaction Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Explore Domains
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Popular Categories
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 group"
            >
              <span>View all categories</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat: LandingCategory) => (
              <Link
                key={cat.id}
                href={`/services?category=${cat.slug}`}
                className="group p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all flex flex-col items-center text-center shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Wrench className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-1">
                  {cat._count?.services || 0} services
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Grid */}
      <section className="py-16 md:py-24 bg-slate-950/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Top Rated
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Featured Verified Services
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition"
            >
              <span>Explore All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service: LandingService) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                name={service.name}
                slug={service.slug}
                description={service.description}
                price={service.price}
                durationMinutes={service.durationMinutes}
                status={service.status}
                imageUrl={service.imageUrl}
                category={service.category}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-black text-white">How ServiceHub Works</h2>
            <p className="text-sm text-slate-400">
              Booking professional home and commercial care should never be complicated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
              <div className="h-12 w-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-lg font-black mb-6">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Select Your Service</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by category, transparent pricing, and verified reviews to pick the exact service you need.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
              <div className="h-12 w-12 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30 flex items-center justify-center text-lg font-black mb-6">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pick Date & Time Slot</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose an available slot on the calendar. Real-time availability prevents double-booking.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
              <div className="h-12 w-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-lg font-black mb-6">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pro Arrives & Completes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A background-checked, insured specialist arrives punctually and completes the job with guaranteed satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-slate-900 to-[#070a12] border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to experience effortless service booking?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Join hundreds of satisfied homeowners and business owners who rely on ServiceHub for every job, big or small.
          </p>
          <div className="pt-2">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/40 transition-all hover:scale-105 active:scale-95"
            >
              <span>Explore Catalog Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
