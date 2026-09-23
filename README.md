# ServiceHub — Modern Service Booking Platform

[![Next.js](https://img.shields.io/badge/Next.js-16%20App%20Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Compatible-336791?logo=postgresql)](https://www.postgresql.org/)
[![Vitest](https://img.shields.io/badge/Tests-31%20Passed-emerald?logo=vitest)](https://vitest.dev/)

**ServiceHub** is an enterprise-grade full-stack service marketplace that connects customers with verified home and commercial service specialists. Built for maximum reliability, speed, and visual appeal, ServiceHub features real-time scheduling, business rule enforcement (double-booking protection, immutable status transitions), and an administrative control panel with full telemetry.

---

## 🌟 Key Features

### 👤 Customer Experience
- **Authentication**: Secure registration, login, session persistence, and role-based routing.
- **Service Catalog**: Live search, category filtering, price/duration sorting, and detail views.
- **Appointment Scheduling**:
  - Interactive calendar with arrival window selection.
  - **Zero Past-Date Booking**: Strict validation preventing bookings before current date.
  - **Anti-Conflict Engine**: Prevents double-booking same service/slot by user or multiple customers.
- **Customer Dashboard & Bookings**:
  - Track appointments across **Pending**, **Confirmed**, **Completed**, and **Cancelled** states.
  - Real-time cancellation with confirmation modal and cancellation reason audit trail.
- **Profile Management**: Update name, contact phone, service address, and avatar image.

### 🛡️ Administrator Console
- **Dedicated Admin Portal**: Secure `/admin` with administrative role verification.
- **Telemetry & Metrics**: Real-time gross revenue, total bookings, active catalog items, and customer count.
- **Booking Status Breakdown**: Visual distribution of Pending, Confirmed, Completed, and Cancelled orders.
- **Catalog Management (CRUD)**: Add new services, edit rates/descriptions/durations, toggle Active/Inactive visibility, or delete services.
- **Booking Management**: Review all customer appointments, filter by status, search by customer/service, and advance statuses following the lifecycle state machine.
- **User Directory**: View registered customers and staff with order history.

---

## 🏗️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | High-performance React 19 SSR, route handlers, and streaming. |
| **Language** | TypeScript (Strict) | End-to-end type safety across schemas, API payloads, and components. |
| **Styling** | Tailwind CSS v4 | Curated dark aesthetic with glassmorphism, glowing accents, and responsive layout. |
| **Database ORM** | Prisma ORM 6.4 | Clean declarative schema, relational foreign keys, automated migrations. |
| **Database** | PostgreSQL (Primary) / SQLite | Production-ready for Supabase & Neon, plus zero-config local evaluation. |
| **Authentication** | JWT (`jose`) + Bcrypt | Secure HTTP-only cookies, tamper-evident signing, salted bcrypt hashes. |
| **Validation** | Zod | Runtime input validation on all forms, API requests, and search queries. |
| **Unit Testing** | Vitest | Lightning-fast test runner for business rules, validation schemas, and cryptographic helpers. |
| **E2E Testing** | Playwright | Full browser-level verification of the customer and admin lifecycle. |

---

## 🚦 Business Rules & State Machine

ServiceHub enforces strict domain rules on both client and server:

```
[ PENDING ] ──────► [ CONFIRMED ] ──────► [ COMPLETED (Terminal) ]
     │                      │
     ▼                      ▼
[ CANCELLED (Terminal) ]   [ CANCELLED (Terminal) ]
```

1. **State Machine Integrity**:
   - `PENDING` can transition to `CONFIRMED` or `CANCELLED`.
   - `CONFIRMED` can transition to `COMPLETED` or `CANCELLED`.
   - `COMPLETED` and `CANCELLED` are terminal states (immutable).
2. **Cancellation Authorization**:
   - Customers may only cancel their own bookings (and only while `PENDING` or `CONFIRMED`).
   - Customers cannot alter status to `CONFIRMED` or `COMPLETED`.
   - Administrators can transition any booking conforming to the state machine.
3. **Double-Booking & Slot Conflict Prevention**:
   - Users cannot schedule the same service on the same date and time slot if an active booking exists.
   - Time slots already confirmed for a service reject competing booking attempts with HTTP 409.

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **NPM**: v9.0.0 or higher

### 2. Clone & Install
```bash
# Clone the repository
git clone <repository-url>
cd Task_1

# Install all dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (or use `.env.example`):
```env
# Local zero-configuration database (default):
DATABASE_URL="file:./dev.db"

# Production PostgreSQL (Supabase / Neon):
# DATABASE_URL="postgresql://user:password@host:5432/servicehub?schema=public"

JWT_SECRET="servicehub-ultra-secure-jwt-secret-key-32-chars-minimum-token!"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Database Setup & Seeding
Choose your preferred database mode:

#### Option A: Zero-Config Local Setup (SQLite — Ready in 2 seconds)
```bash
npm run db:setup:sqlite
```

#### Option B: Production PostgreSQL Setup (Supabase / Neon / Local Postgres)
Configure `DATABASE_URL` in `.env` to your PostgreSQL connection string, then run:
```bash
npm run db:setup:postgres
```

### 5. Start the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Demo Accounts

Both accounts are automatically created during database seeding:

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Administrator** | `admin@servicehub.com` | `Admin123!` | Full control over services, bookings, users, and telemetry. |
| **Customer** | `customer@servicehub.com` | `Customer123!` | Browse, book services, manage bookings, and profile. |

> 💡 **Quick Login Tip**: The login page (`/login`) includes **"One-Click Demo Fill"** buttons for immediate reviewer testing!

---

## 🧪 Testing

### Unit & Integration Tests (Vitest)
Executes 31 automated tests validating Zod schemas, business rules, status transition state machine, and cryptographic helpers:
```bash
npm test
```

### End-to-End Tests (Playwright)
Executes full browser lifecycle test (Registration $\to$ Browse $\to$ Book $\to$ Admin Status Change):
```bash
npm run test:e2e
```

### Production Build Verification
```bash
npm run build
```

---

## 📂 Project Structure

```
Task_1/
├── docs/
│   ├── API.md               # Complete REST API specification & payloads
│   └── ERD.md               # Entity-Relationship diagram & data dictionary
├── prisma/
│   ├── schema.prisma        # Production PostgreSQL schema
│   ├── schema.sqlite.prisma # Zero-dependency SQLite schema
│   └── seed.js              # Database seeder with realistic demo data
├── tests/
│   ├── auth-security.test.ts # Bcrypt & JWT verification tests
│   ├── booking-rules.test.ts # State machine & business rule tests
│   └── validations.test.ts  # Zod schema input tests
├── e2e/
│   └── core-flow.spec.ts    # Playwright complete lifecycle test
├── src/
│   ├── app/
│   │   ├── api/             # REST API routes (auth, services, bookings, admin)
│   │   ├── admin/           # Admin portal (dashboard, services, bookings, users)
│   │   ├── dashboard/       # Customer dashboard, my bookings, profile
│   │   ├── services/        # Catalog browse & service booking details
│   │   ├── login/           # Unified login with demo autofill
│   │   ├── register/        # Registration form
│   │   ├── layout.tsx       # Root layout with AuthProvider, Navbar, Footer
│   │   └── page.tsx         # High-converting landing page
│   ├── components/          # Reusable UI components (Navbar, Footer, ServiceCard, StatusBadge, etc.)
│   ├── context/             # AuthContext state provider
│   └── lib/                 # Core utilities (Prisma singleton, JWT sessions, validations, rules)
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🚀 Deployment Guide (Vercel + Supabase / Neon)

1. **Database**: Create a PostgreSQL database on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
2. **Environment**: Copy the PostgreSQL connection URI into your Vercel project environment variables as `DATABASE_URL`.
3. **JWT Secret**: Generate a secure random string and set `JWT_SECRET`.
4. **Deploy**: Connect your GitHub repository to Vercel. Set build command to `prisma generate && next build`.
5. **Seed**: Run `node prisma/seed.js` using the connection string to populate initial categories and demo accounts.

---

## 📄 Documentation Links
- [REST API Documentation](docs/API.md)
- [Database ER Diagram & Dictionary](docs/ERD.md)
