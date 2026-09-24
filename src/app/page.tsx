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
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-28 md:pb-36">
        {/* Subtle ambient lighting tailored for Deep Teal */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-teal-600/10 dark:bg-teal-500/12 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-amber-500/10 dark:bg-amber-400/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-7">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-500/30 text-xs font-semibold shadow-2xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Certified Domestic & Commercial Service Dispatch</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              Expert Services On Demand,{' '}
              <span className="gradient-heading">Scheduled in Seconds.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-normal">
              From licensed plumbers and certified electricians to professional deep-cleaners,
              ServiceHub provides vetted craftspeople with real-time slot availability and guaranteed workmanship.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-md shadow-teal-700/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Browse All Offerings</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs dark:text-slate-300 dark:bg-slate-900/80 dark:hover:bg-slate-800 dark:hover:text-white dark:border-slate-800 transition"
              >
                <span>Sign In to Account</span>
              </Link>
            </div>

            {/* Social Proof Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>4.9 / 5 Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="border-y border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-[#0c1316]/70 py-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{bookingCount}+</p>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Completed Appointments
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-teal-700 dark:text-teal-400">{servicesCount}+</p>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Active Catalog Services
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">{customersCount}+</p>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Satisfied Clients
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">99.4%</p>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Satisfaction Guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Explore Domains
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Popular Categories
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 flex items-center gap-1 group"
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
                className="group p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500/50 shadow-2xs hover:shadow-md dark:bg-[#0e1619] dark:border-slate-800 dark:hover:border-teal-500/40 transition-all duration-200 flex flex-col items-center text-center hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-700 dark:bg-teal-950/40 dark:border-teal-500/30 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:bg-teal-700 group-hover:text-white dark:group-hover:bg-teal-600 transition-colors">
                  <Wrench className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {cat._count?.services || 0} services
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Grid */}
      <section className="py-20 md:py-28 bg-slate-100/60 dark:bg-[#070b0c]/60 border-y border-slate-200/90 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Top Rated Offerings
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Featured Verified Services
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white dark:border-slate-700 transition"
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
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">How ServiceHub Works</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Booking professional domestic and commercial maintenance should never be complicated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs dark:bg-[#0e1619] dark:border-slate-800 relative transition-all">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-700 dark:bg-teal-950/40 dark:border-teal-500/30 dark:text-teal-400 flex items-center justify-center text-lg font-black mb-6">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Select Your Service</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Filter by trade specialty, transparent flat pricing, and verified reviews to pick the exact service you need.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs dark:bg-[#0e1619] dark:border-slate-800 relative transition-all">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-700 dark:bg-amber-950/40 dark:border-amber-500/30 dark:text-amber-400 flex items-center justify-center text-lg font-black mb-6">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Pick Date & Time Window</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Choose an available slot on the calendar. Real-time slot management prevents double-booking.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs dark:bg-[#0e1619] dark:border-slate-800 relative transition-all">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:text-emerald-400 flex items-center justify-center text-lg font-black mb-6">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Certified Specialist Delivers</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                A background-checked, insured contractor arrives punctually and completes the job with guaranteed satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-teal-50/50 to-white border-t border-slate-200/90 dark:from-[#0d171a] dark:to-[#070b0c] dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Ready to experience dependable service scheduling?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Join hundreds of satisfied property owners who rely on ServiceHub for every maintenance need, big or small.
          </p>
          <div className="pt-2">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-md shadow-teal-700/20 transition-all hover:scale-105 active:scale-95"
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
