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
  ArrowUpRight,
  Layers,
  CalendarCheck,
  Award,
  Zap,
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
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40 border-b border-border/80">
        {/* Subtle architectural ambient gradient (Nordic Teal glow) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[340px] bg-teal-600/[0.08] dark:bg-teal-400/[0.06] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col max-w-4xl space-y-8">
            {/* Monospace Editorial Section Index */}
            <div className="flex items-center gap-3">
              <span className="mono-index text-teal-700 dark:text-teal-400 font-semibold tracking-widest">
                00 // PLATFORM DISPATCH PROTOCOL
              </span>
              <span className="h-px w-12 bg-border" />
              <span className="mono-index text-muted-foreground hidden sm:inline">
                EST. 2026 — SYSTEM VERIFIED
              </span>
            </div>

            {/* Oversized Display Typography */}
            <h1 className="editorial-title text-5xl sm:text-7xl lg:text-[5.5rem] font-black tracking-[-0.04em] text-foreground leading-[0.93]">
              PRECISION CRAFT.{' '}
              <span className="text-teal-700 dark:text-teal-400">
                DISPATCHED ON DEMAND.
              </span>
            </h1>

            {/* Subheadline with Generous Spacing */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl font-normal">
              An architectural standard for domestic and commercial services. Licensed tradespeople,
              transparent flat rates, and verified real-time appointment windows.
            </p>

            {/* Action Buttons & Micro-Interactions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm text-primary-foreground bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-md shadow-teal-700/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>Browse All Specifications</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm text-foreground bg-card hover:bg-muted/80 border border-border transition-all hover:border-teal-500/40"
              >
                <span>Sign In to Account</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </Link>
            </div>

            {/* Architectural Trust Indicators */}
            <div className="pt-8 border-t border-border/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-teal-700 dark:text-teal-400 shrink-0" />
                <span className="font-medium">100% Background-Vetted & Insured</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-teal-700 dark:text-teal-400 shrink-0" />
                <span className="font-medium">Instant Slot Locking Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="h-4 w-4 text-teal-700 dark:text-teal-400 shrink-0" />
                <span className="font-medium">30-Day Workmanship Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01: Service Categories Architectural Grid */}
      <section className="py-24 md:py-36 border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <div className="mono-index text-teal-700 dark:text-teal-400 font-semibold tracking-widest">
                01 // TRADE DISCIPLINES
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-foreground">
                Verified Service Categories
              </h2>
            </div>
            <Link
              href="/services"
              className="mono-index text-xs font-bold text-teal-700 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 flex items-center gap-2 group tracking-widest"
            >
              <span>EXPLORE FULL DIRECTORY</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Architectural Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat: LandingCategory, idx: number) => (
              <Link
                key={cat.id}
                href={`/services?category=${cat.slug}`}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-teal-500/50 transition-all duration-300 flex flex-col justify-between interactive-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="mono-index text-muted-foreground text-[10px]">
                      DISCIPLINE_0{idx + 1}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white dark:group-hover:bg-teal-600 transition-colors">
                      <Wrench className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    Certified specialists ready for rapid deployment with guaranteed tooling.
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
                  <span className="mono-index text-[11px] text-muted-foreground">
                    {cat._count?.services || 0} ACTIVE SPECS
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 02: Featured Services Grid */}
      <section className="py-24 md:py-36 bg-secondary/40 border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <div className="mono-index text-teal-700 dark:text-teal-400 font-semibold tracking-widest">
                02 // CURATED SPECIFICATIONS
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-foreground">
                Featured Verified Services
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl mono-index text-xs font-bold text-foreground bg-card hover:bg-muted border border-border transition-colors tracking-wider"
            >
              <span>VIEW ALL ACTIVE</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Section 03: Operational Workflow / Protocol */}
      <section className="py-24 md:py-36 border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 space-y-3">
            <div className="mono-index text-teal-700 dark:text-teal-400 font-semibold tracking-widest">
              03 // OPERATIONAL PROTOCOL
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-foreground">
              How Dispatch Operates
            </h2>
            <p className="text-base text-muted-foreground font-normal leading-relaxed pt-1">
              Engineered to eliminate friction between diagnosis, transparent booking, and certified completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-card border border-border relative flex flex-col justify-between interactive-card">
              <div>
                <span className="mono-index text-teal-700 dark:text-teal-400 text-xs font-bold tracking-widest block mb-6">
                  PHASE // 01
                </span>
                <h3 className="text-xl font-bold text-foreground mb-3">Select Specification</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Browse by licensed trade, review transparent fixed rates, and inspect verified pro track records.
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Fixed Rate Guarantee</span>
                <CheckCircle2 className="h-4 w-4 text-teal-700 dark:text-teal-400" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-card border border-border relative flex flex-col justify-between interactive-card">
              <div>
                <span className="mono-index text-teal-700 dark:text-teal-400 text-xs font-bold tracking-widest block mb-6">
                  PHASE // 02
                </span>
                <h3 className="text-xl font-bold text-foreground mb-3">Lock Arrival Window</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Choose your preferred date and slot. Dynamic concurrency checking prevents double bookings.
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Real-Time Slot Engine</span>
                <CalendarCheck className="h-4 w-4 text-teal-700 dark:text-teal-400" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-card border border-border relative flex flex-col justify-between interactive-card">
              <div>
                <span className="mono-index text-teal-700 dark:text-teal-400 text-xs font-bold tracking-widest block mb-6">
                  PHASE // 03
                </span>
                <h3 className="text-xl font-bold text-foreground mb-3">Certified Execution</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A licensed contractor arrives equipped with industrial tooling, backed by our 30-day warranty.
                </p>
              </div>
              <div className="pt-6 mt-8 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Post-Service Sign-Off</span>
                <ShieldCheck className="h-4 w-4 text-teal-700 dark:text-teal-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 04: Platform Metrics Bar */}
      <section className="py-20 md:py-28 bg-card border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mono-index text-muted-foreground text-xs mb-10 tracking-widest">
            04 // PROVEN DISPATCH METRICS
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <p className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                {bookingCount}+
              </p>
              <p className="mono-index text-[11px] text-muted-foreground font-semibold mt-2">
                FULFILLED BOOKINGS
              </p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-teal-700 dark:text-teal-400 tracking-tight">
                {servicesCount}+
              </p>
              <p className="mono-index text-[11px] text-muted-foreground font-semibold mt-2">
                VERIFIED SERVICES
              </p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                {customersCount}+
              </p>
              <p className="mono-index text-[11px] text-muted-foreground font-semibold mt-2">
                ACTIVE CLIENTS
              </p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-teal-700 dark:text-teal-400 tracking-tight">
                99.4%
              </p>
              <p className="mono-index text-[11px] text-muted-foreground font-semibold mt-2">
                CLIENT SATISFACTION
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 05: Final Editorial CTA */}
      <section className="py-24 md:py-36">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 sm:p-16 rounded-3xl bg-secondary/50 border border-border space-y-8 relative overflow-hidden">
            <div className="mono-index text-teal-700 dark:text-teal-400 text-xs font-semibold tracking-widest">
              05 // DIRECT DISPATCH INITIATION
            </div>
            <h2 className="editorial-title text-3xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[0.96]">
              Engineered for dependability.{' '}
              <span className="text-teal-700 dark:text-teal-400">
                Ready for immediate booking.
              </span>
            </h2>
            <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
              Experience the difference of structured domestic maintenance. Transparent pricing, zero hidden fees, and certified craft.
            </p>
            <div className="pt-2">
              <Link
                href="/services"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-sm text-primary-foreground bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-md shadow-teal-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Access Complete Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
